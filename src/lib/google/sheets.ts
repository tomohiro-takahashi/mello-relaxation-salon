import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { generateXPost, XAccountType } from '../ai/post-generator';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export interface XPostItem {
  rowIndex: number;
  scheduleTime: string;
  account: XAccountType;
  topic?: string;
  content?: string;
  status: 'Pending' | 'Success' | 'Error' | 'Manual';
}

async function getDoc() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // 改行コード（\n）を正しく処理する。
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n');
  const sheetId = process.env.GOOGLE_SHEET_ID_X_POSTS;

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    throw new Error('Missing Google API credentials');
  }

  const auth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();
  return doc;
}

export async function getPendingPosts(): Promise<XPostItem[]> {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0]; // 最初のシート
    const rows = await sheet.getRows();

    const now = new Date();

    return rows
      .map((row, index) => ({
        rowIndex: index,
        scheduleTime: row.get('ScheduleTime'),
        account: row.get('Account') as XAccountType,
        topic: row.get('Topic'),
        content: row.get('Content'),
        status: row.get('Status') as 'Pending' | 'Success' | 'Error',
        _row: row, // オリジナルの行データ
      }))
      .filter(post => {
        if (post.status !== 'Pending') return false;
        if (!post.scheduleTime) return true; // 時間指定がなければ即座に対象
        return new Date(post.scheduleTime) <= now;
      }) as any;
  } catch (err) {
    console.error('Error fetching pending posts:', err);
    return [];
  }
}

export async function updatePostStatus(rowIndex: number, status: 'Success' | 'Error' | 'Manual', log?: string, content?: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const row = rows[rowIndex];

    row.set('Status', status);
    if (log) row.set('Log', log);
    if (content) row.set('Content', content);
    
    await row.save();
  } catch (err) {
    console.error('Error updating post status:', err);
  }
}

/**
 * 自律モード：今日の投稿予定が空の場合、AIに生成させて追加する
 */
export async function ensureAutonomousPosts() {
  const doc = await getDoc();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const today = new Date();
  // JSTでの今日の日付文字列を取得 (YYYY-MM-DD)
  const todayJst = new Date(today.getTime() + (9 * 60 * 60 * 1000));
  const todayStr = todayJst.toISOString().split('T')[0];

  // ヘッダーがない場合の初期化
  if (rows.length === 0) {
    await sheet.setHeaderRow(['ScheduleTime', 'Account', 'Content', 'Status', 'Topic', 'Log']);
  }

  const hasPostsToday = rows.some(row => {
    const time = row.get('ScheduleTime');
    if (!time || typeof time !== 'string') return false;
    
    // 今日の日付 (YYYY-MM-DD) かつ 5:00 以降の投稿があるか確認
    // 深夜1時・2時の投稿を「昨日の残り」として扱うため
    const schedDate = new Date(time);
    const jstDate = new Date(schedDate.getTime() + (9 * 60 * 60 * 1000));
    const jstDateStr = jstDate.toISOString().split('T')[0];
    const jstHour = jstDate.getUTCHours(); // JST基準で計算済み
    
    return jstDateStr === todayStr && jstHour >= 5;
  });

  if (!hasPostsToday) {
    // 1日合計10ポスト（各5ポスト）を生成して予約
    // 営業時間（20:00 - 02:00）に合わせたスケジュール配置
    
    // 一ノ瀬: 感情に寄り添う / 予約への誘導
    const ichinoseHours = [10, 14, 18, 22, 1]; 
    // オーナー: 専門性 / 営業開始の空気感 / 哲学
    const ownerHours = [12, 16, 20, 23, 2];   

    // 一ノ瀬用
    for (const hour of ichinoseHours) {
      const content = await generateXPost('ichinose');
      
      // JSTでの該当日時を生成
      const timeJstStr = `${todayStr}T${String(hour).padStart(2, '0')}:00:00+09:00`;
      const schedDate = new Date(timeJstStr);
      
      // 深夜帯（1時, 2時など）は翌日にずらす
      if (hour < 5) {
        schedDate.setDate(schedDate.getDate() + 1);
      }
      
      await sheet.addRow({
        ScheduleTime: schedDate.toISOString(), // 保存はUTCのISO形式（2026-02-23T16:00:00Z 等）
        Account: 'ichinose',
        Content: content,
        Status: 'Pending',
        Topic: `AI Autonomous Generation (${hour}:00 JST)`
      });
    }

    // オーナー用
    for (const hour of ownerHours) {
      const content = await generateXPost('owner');
      
      const timeJstStr = `${todayStr}T${String(hour).padStart(2, '0')}:00:00+09:00`;
      const schedDate = new Date(timeJstStr);
      
      if (hour < 5) {
        schedDate.setDate(schedDate.getDate() + 1);
      }

      await sheet.addRow({
        ScheduleTime: schedDate.toISOString(),
        Account: 'owner',
        Content: content,
        Status: 'Pending',
        Topic: `AI Autonomous Generation (${hour}:00 JST)`
      });
    }
  }
}
