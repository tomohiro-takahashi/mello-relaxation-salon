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
  status: 'Pending' | 'Success' | 'Error';
}

async function getDoc() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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

export async function updatePostStatus(rowIndex: number, status: 'Success' | 'Error', log?: string, content?: string) {
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
  
  const today = new Date().toISOString().split('T')[0];
  const hasPostsToday = rows.some(row => row.get('ScheduleTime')?.startsWith(today));

  if (!hasPostsToday) {
    // オーナーと一ノ瀬、それぞれ1つずつ生成
    const accounts: XAccountType[] = ['owner', 'ichinose'];
    for (const account of accounts) {
      const content = await generateXPost(account);
      await sheet.addRow({
        ScheduleTime: new Date().toISOString(),
        Account: account,
        Content: content,
        Status: 'Pending',
        Topic: 'AI Autonomous Generation'
      });
    }
  }
}
