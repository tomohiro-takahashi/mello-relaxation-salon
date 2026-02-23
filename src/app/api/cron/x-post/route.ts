import { NextResponse } from 'next/server';
import { getPendingPosts, updatePostStatus, ensureAutonomousPosts } from '@/lib/google/sheets';
import { sendXPost } from '@/lib/x/client';
import { generateXPost } from '@/lib/ai/post-generator';
import { sendDiscordNotification, formatXCronResultMessage } from '@/lib/utils/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // セキュリティチェック（Authorization ヘッダーを確認）
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (process.env.NODE_ENV === 'production' && (!cronSecret || authHeader !== `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. 自律モードの実行（今日の予定がなければ生成）
    await ensureAutonomousPosts();

    // 2. 予約済みの投稿を取得
    const pendingPosts = await getPendingPosts();

    if (pendingPosts.length === 0) {
      return NextResponse.json({ message: 'No pending posts.' });
    }

    const results = [];

    // 3. 順次投稿
    for (const post of pendingPosts) {
      try {
        let content = post.content;

        // 本文が空でトピックがある場合は、その場で生成
        if (!content && post.topic) {
          content = await generateXPost(post.account, post.topic);
        }

        if (!content) {
          await updatePostStatus(post.rowIndex, 'Error', 'Content is empty');
          results.push({ id: post.rowIndex, account: post.account, status: 'error', reason: 'Empty content' });
          continue;
        }

        // Xに投稿
        try {
          await sendXPost(post.account, content);
          await updatePostStatus(post.rowIndex, 'Success', undefined, content);
          results.push({ id: post.rowIndex, account: post.account, status: 'success' });
        } catch (err: any) {
          if (err.message.includes('Missing X API credentials')) {
            await updatePostStatus(post.rowIndex, 'Manual', 'Credentials missing - Ready for manual posting', content);
            results.push({ id: post.rowIndex, account: post.account, status: 'manual_skip' });
          } else {
            throw err; // 再スローして catch (err: any) { ... } で処理
          }
        }
      } catch (err: any) {
        console.error(`Failed to post for row ${post.rowIndex}:`, err);
        const errorMessage = err.message || 'Unknown error';
        await updatePostStatus(post.rowIndex, 'Error', errorMessage);
        results.push({ id: post.rowIndex, account: post.account, status: 'error', reason: errorMessage });
      }
    }

    // 4. Discordへの結果通知（異常がある場合、または実行完了時）
    const message = formatXCronResultMessage(results);
    await sendDiscordNotification(message);

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('X Cron Error:', err);
    await sendDiscordNotification(`🚨 **X Cron Job 重大エラー発生**\n${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
