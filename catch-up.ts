import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- Manual Catch-up Started ---');
  
  // 1. 環境変数のロード
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;
      const index = trimmedLine.indexOf('=');
      if (index > 0) {
        const key = trimmedLine.substring(0, index).trim();
        const value = trimmedLine.substring(index + 1).trim().replace(/^['\"]|['\"]$/g, '');
        process.env[key] = value;
      }
    });
  }

  // 2. モジュールのインポート
  const { GET } = await import('./src/app/api/cron/x-post/route');

  // 3. 滞っている投稿を数回分処理する
  for (let i = 0; i < 5; i++) {
    console.log(`Processing slot ${i + 1}...`);
    const req = {
      headers: {
        get: (name: string) => (name === 'authorization' ? `Bearer ${process.env.CRON_SECRET}` : null)
      }
    } as any;
    
    try {
      const response = await GET(req);
      const data = await response.json();
      console.log('Result:', JSON.stringify(data, null, 2));
      
      if (data.message === 'No pending posts.') {
        console.log('Successfully caught up with all pending posts!');
        break;
      }
    } catch (err) {
      console.error('Execution failed:', err);
      break;
    }
  }

  console.log('--- Catch-up Complete ---');
}

run();
