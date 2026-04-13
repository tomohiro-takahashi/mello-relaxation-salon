import fs from 'fs';
import path from 'path';

async function run() {
  console.log('--- Post Quality Test (Humanize) ---');
  
  // 1. Load Env
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

  // 2. Import generator
  const { generateXPost } = await import('./src/lib/ai/post-generator');

  console.log('\n[OWNER POSTS]');
  for (let i = 0; i < 3; i++) {
    const post = await generateXPost('owner');
    console.log(`${i+1}: ${post}`);
  }

  console.log('\n[ICHINOSE POSTS]');
  for (let i = 0; i < 3; i++) {
    const post = await generateXPost('ichinose');
    console.log(`${i+1}: ${post}`);
  }

  console.log('\n--- Test Complete ---');
}

run();
