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

export async function getDoc() {
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
        
        const scheduleDate = new Date(post.scheduleTime);
        // 安全策：現在時刻より12時間以上前の投稿は無視する（バックログ爆発防止）
        const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000));
        
        if (scheduleDate < twelveHoursAgo) {
          console.log(`Skipping old post (Row ${post.rowIndex}): ${post.scheduleTime}`);
          return false;
        }

        return scheduleDate <= now;
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

  const now = new Date();
  // JSTでの今日の日付文字列を取得 (YYYY-MM-DD)
  const todayJst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const todayStr = `${todayJst.getFullYear()}-${String(todayJst.getMonth() + 1).padStart(2, '0')}-${String(todayJst.getDate()).padStart(2, '0')}`;

  // ヘッダーがない場合の初期化
  if (rows.length === 0) {
    await sheet.setHeaderRow(['ScheduleTime', 'DisplayTimeJST', 'Account', 'Content', 'Status', 'Topic', 'Log']);
  }

  const hasPostsToday = rows.some(row => {
    const time = row.get('ScheduleTime');
    if (!time || typeof time !== 'string') return false;
    
    // 今日の日付 (YYYY-MM-DD) かつ 5:00 以降の投稿があるか確認
    const schedDate = new Date(time);
    const jstDate = new Date(schedDate.getTime() + (9 * 60 * 60 * 1000));
    const jstDateStr = jstDate.toISOString().split('T')[0];
    const jstHour = jstDate.getUTCHours();
    
    return jstDateStr === todayStr && jstHour >= 5;
  });

  if (!hasPostsToday) {
    console.log(`Generating posts for ${todayStr}...`);
    
    // 一ノ瀬: 10, 14, 18, 22, 1
    const ichinoseHours = [10, 14, 18, 22, 1]; 
    // オーナー: 12, 16, 20, 23, 2
    const ownerHours = [12, 16, 20, 23, 2];   

    // 一ノ瀬用
    for (const hour of ichinoseHours) {
      const topic = (hour === 22 || hour === 1) ? 'Chat相談への誘導' : 'AI Autonomous Generation';
      
      const timeJstStr = `${todayStr}T${String(hour).padStart(2, '0')}:00:00+09:00`;
      const schedDate = new Date(timeJstStr);
      if (hour < 5) schedDate.setDate(schedDate.getDate() + 1);

      // 過去の時間はスキップ
      if (schedDate.getTime() <= now.getTime()) {
        console.log(`Skipping past slot (Ichinose): ${schedDate.toISOString()}`);
        continue;
      }

      const content = await generateXPost('ichinose', topic);
      const displayJst = schedDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
      
      await sheet.addRow({
        ScheduleTime: schedDate.toISOString(),
        DisplayTimeJST: displayJst,
        Account: 'ichinose',
        Content: content,
        Status: 'Pending',
        Topic: topic === 'AI Autonomous Generation' ? `AI Autonomous Generation (${hour}:00 JST)` : topic
      });
    }

    // オーナー用
    for (const hour of ownerHours) {
      const topic = (hour === 20 || hour === 23) ? '店舗の宣伝・予約状況' : 'AI Autonomous Generation';
      
      const timeJstStr = `${todayStr}T${String(hour).padStart(2, '0')}:00:00+09:00`;
      const schedDate = new Date(timeJstStr);
      if (hour < 5) schedDate.setDate(schedDate.getDate() + 1);

      // 過去の時間はスキップ
      if (schedDate.getTime() <= now.getTime()) {
        console.log(`Skipping past slot (Owner): ${schedDate.toISOString()}`);
        continue;
      }

      const content = await generateXPost('owner', topic);
      const displayJst = schedDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

      await sheet.addRow({
        ScheduleTime: schedDate.toISOString(),
        DisplayTimeJST: displayJst,
        Account: 'owner',
        Content: content,
        Status: 'Pending',
        Topic: topic === 'AI Autonomous Generation' ? `AI Autonomous Generation (${hour}:00 JST)` : topic
      });
    }
  }
}
