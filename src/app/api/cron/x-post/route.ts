import { NextResponse } from 'next/server';
import { getPendingPosts, updatePostStatus, ensureAutonomousPosts } from '@/lib/google/sheets';
import { sendXPost } from '@/lib/x/client';
import { generateXPost } from '@/lib/ai/post-generator';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // セキュリティチェック（Vercel Cronなどの場合は Authorization ヘッダーなどを確認）
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

        // 本文が空でトピックがある場合は、その場で生成（念のためのフォールバック）
        if (!content && post.topic) {
          content = await generateXPost(post.account, post.topic);
        }

        if (!content) {
          await updatePostStatus(post.rowIndex, 'Error', 'Content is empty');
          results.push({ id: post.rowIndex, status: 'error', reason: 'Empty content' });
          continue;
        }

        // Xに投稿
        await sendXPost(post.account, content);

        // スプレッドシートを更新
        await updatePostStatus(post.rowIndex, 'Success', undefined, content);
        
        results.push({ id: post.rowIndex, account: post.account, status: 'success' });
      } catch (err: any) {
        console.error(`Failed to post for row ${post.rowIndex}:`, err);
        await updatePostStatus(post.rowIndex, 'Error', err.message);
        results.push({ id: post.rowIndex, status: 'error', reason: err.message });
      }
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error('X Cron Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
