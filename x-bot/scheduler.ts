import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import {
  CONFIG, POST_CATEGORIES, CATEGORY_LABELS, PostCategory,
  randomDelay, sleep, randomPick, log, logError,
} from './config';
import { TwitterAdapter } from './adapter';
import { generatePost, generateQuoteComment } from './content-generator';
import {
  recordTweet, loadAnalyticsData, adjustCategoryRatios,
  generateDailyReport, sendDiscordReport,
} from './analytics';

// ─────────────────────────────────────────────
// 永続化ステート
// ─────────────────────────────────────────────

interface SchedulerState {
  date: string;
  postCount: number;
  likeCount: number;
  followCount: number;
  quoteCount: number;
  tipsIndex: number;
  categoryIndex: number;
  postedTexts: string[];
  lastAnalyticsRun: string;
}

const STATE_FILE = path.join(__dirname, '.scheduler_state.json');

function loadState(): SchedulerState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch {}

  return {
    date: '',
    postCount: 0,
    likeCount: 0,
    followCount: 0,
    quoteCount: 0,
    tipsIndex: 0,
    categoryIndex: 0,
    postedTexts: [],
    lastAnalyticsRun: '',
  };
}

function saveState(state: SchedulerState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function getTodayStr(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' }); // YYYY-MM-DD
}

function getCurrentHourJST(): number {
  return new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo', hour: 'numeric', hour12: false }) as any;
}

function resetDailyCounts(state: SchedulerState): SchedulerState {
  const today = getTodayStr();
  if (state.date !== today) {
    log(`📅 日付変更検出: ${state.date || '初回'} → ${today}`);
    state.date = today;
    state.postCount = 0;
    state.likeCount = 0;
    state.followCount = 0;
    state.quoteCount = 0;
    state.postedTexts = [];
  }
  return state;
}

// ─────────────────────────────────────────────
// テキストハッシュ（重複防止）
// ─────────────────────────────────────────────

function textHash(text: string): string {
  return text.substring(0, 50).replace(/\s+/g, ' ').trim();
}

// ─────────────────────────────────────────────
// カテゴリ選択（ローテーション + 自動調整）
// ─────────────────────────────────────────────

function selectCategory(state: SchedulerState): PostCategory {
  const analyticsData = loadAnalyticsData();
  const ratios = analyticsData.categoryRatios;

  // 加重ランダム選択
  const rand = Math.random();
  let cumulative = 0;

  for (const cat of POST_CATEGORIES) {
    cumulative += ratios[cat] || 0.2;
    if (rand <= cumulative) {
      return cat;
    }
  }

  // フォールバック: ローテーション
  const category = POST_CATEGORIES[state.categoryIndex % POST_CATEGORIES.length];
  state.categoryIndex++;
  return category;
}

// ─────────────────────────────────────────────
// スリープ防止
// ─────────────────────────────────────────────

let caffeinateProcess: ChildProcess | null = null;

function startCaffeinate(): void {
  try {
    caffeinateProcess = spawn('caffeinate', ['-u', '-t', '7200'], {
      stdio: 'ignore',
      detached: true,
    });
    caffeinateProcess.unref();
    log('☕ スリープ防止開始 (caffeinate)');
  } catch {
    log('⚠️ caffeinate 起動失敗（スリープ防止なし）');
  }
}

function stopCaffeinate(): void {
  if (caffeinateProcess) {
    try {
      caffeinateProcess.kill();
    } catch {}
    caffeinateProcess = null;
    log('☕ スリープ防止解除');
  }
}

// ─────────────────────────────────────────────
// メイン巡回フロー
// ─────────────────────────────────────────────

async function runPatrol(): Promise<void> {
  let state = loadState();
  state = resetDailyCounts(state);

  log('═══════════════════════════════════════');
  log(`🔄 巡回開始: ${CONFIG.brand.handle}`);
  log(`📊 今日の実績: 投稿${state.postCount}/${CONFIG.limits.postsPerDay} / いいね${state.likeCount}/${CONFIG.limits.likesPerDay} / フォロー${state.followCount}/${CONFIG.limits.followsPerDay}`);
  log('═══════════════════════════════════════');

  startCaffeinate();

  const adapter = new TwitterAdapter();

  try {
    // ── 初期化 ──
    const loggedIn = await adapter.initialize();
    if (!loggedIn) {
      logError('ログインできません。手動ログインが必要です。');
      return;
    }

    // ── Phase 1: タイムライン閲覧（5-10分）──
    log('── Phase 1: タイムライン閲覧 ──');
    const browseDuration1 = randomDelay(5 * 60 * 1000, 10 * 60 * 1000);
    await adapter.browseTimeline(browseDuration1);
    await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));

    // ── Phase 2: 投稿（1件）──
    if (state.postCount < CONFIG.limits.postsPerDay) {
      log('── Phase 2: 投稿 ──');
      const category = selectCategory(state);
      log(`📝 カテゴリ: ${CATEGORY_LABELS[category]}`);

      const content = await generatePost(category);
      const hash = textHash(content);

      // 重複チェック
      if (state.postedTexts.includes(hash)) {
        log('⚠️ 重複検出。再生成...');
        const retryContent = await generatePost(category);
        const retryHash = textHash(retryContent);

        if (!state.postedTexts.includes(retryHash)) {
          const result = await adapter.postTweet(retryContent);
          if (result.success) {
            state.postCount++;
            state.postedTexts.push(retryHash);
            recordTweet(retryContent, category);
          }
        }
      } else {
        const result = await adapter.postTweet(content);
        if (result.success) {
          state.postCount++;
          state.postedTexts.push(hash);
          recordTweet(content, category);
        }
      }

      saveState(state);
      await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));
    }

    // ── Phase 3: いいね ──
    // 50% の確率でターゲットアカウントのフォロワー or キーワード検索
    if (state.likeCount < CONFIG.limits.likesPerDay) {
      log('── Phase 3: いいね ──');

      const useTargetAccounts = CONFIG.brand.targetAccounts.length > 0 && Math.random() < 0.7;

      if (useTargetAccounts) {
        // ターゲットアカウントのフォロワーにいいね
        const targetAccount = randomPick(CONFIG.brand.targetAccounts);
        const maxLikes = randomDelay(5, 8);
        const remainingLikes = CONFIG.limits.likesPerDay - state.likeCount;
        const actualMax = Math.min(maxLikes, remainingLikes);

        if (actualMax > 0) {
          const liked = await adapter.likeFromFollowers(targetAccount, actualMax);
          state.likeCount += liked;
          saveState(state);
        }
      } else {
        // キーワード検索でいいね
        const keywords = getRandomKeywords(CONFIG.brand.likeKeywords, 2);

        for (const keyword of keywords) {
          const maxLikes = randomDelay(5, 8);
          const remainingLikes = CONFIG.limits.likesPerDay - state.likeCount;
          const actualMax = Math.min(maxLikes, remainingLikes);

          if (actualMax <= 0) break;

          const liked = await adapter.searchAndLike(keyword, actualMax);
          state.likeCount += liked;
          saveState(state);

          await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));
        }
      }

      await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));
    }

    // ── Phase 4: フォロー ──
    // 50% の確率でターゲットアカウントのフォロワー or キーワード検索
    if (state.followCount < CONFIG.limits.followsPerDay) {
      log('── Phase 4: フォロー ──');

      const useTargetAccounts = CONFIG.brand.targetAccounts.length > 0 && Math.random() < 0.7;

      if (useTargetAccounts) {
        // ターゲットアカウントのフォロワーをフォロー
        const targetAccount = randomPick(CONFIG.brand.targetAccounts);
        const maxFollows = randomDelay(3, 5);
        const remainingFollows = CONFIG.limits.followsPerDay - state.followCount;
        const actualMax = Math.min(maxFollows, remainingFollows);

        if (actualMax > 0) {
          const followed = await adapter.followFromFollowers(targetAccount, actualMax);
          state.followCount += followed;
          saveState(state);
        }
      } else {
        // キーワード検索でフォロー
        const keywords = getRandomKeywords(CONFIG.brand.followKeywords, 2);

        for (const keyword of keywords) {
          const maxFollows = randomDelay(3, 5);
          const remainingFollows = CONFIG.limits.followsPerDay - state.followCount;
          const actualMax = Math.min(maxFollows, remainingFollows);

          if (actualMax <= 0) break;

          const followed = await adapter.searchAndFollow(keyword, actualMax);
          state.followCount += followed;
          saveState(state);

          await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));
        }
      }

      await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));
    }

    // ── Phase 4.5: 引用RT（確率30%、1日2件まで）──
    if (state.quoteCount < CONFIG.limits.quotesPerDay && Math.random() < 0.3) {
      log('── Phase 4.5: 引用RT ──');
      const keyword = randomPick(CONFIG.brand.trendKeywords);
      const comment = await generateQuoteComment();

      const result = await adapter.searchAndQuote(keyword, comment);
      if (result.success) {
        state.quoteCount++;
        saveState(state);
      }

      await sleep(randomDelay(CONFIG.delays.betweenActionsMin, CONFIG.delays.betweenActionsMax));
    }

    // ── Phase 5: タイムライン閲覧（3-5分）──
    log('── Phase 5: クールダウン閲覧 ──');
    const browseDuration2 = randomDelay(3 * 60 * 1000, 5 * 60 * 1000);
    await adapter.browseTimeline(browseDuration2);

    // ── Phase 6: 分析（1日1回、5:00 JST 付近）──
    const currentHour = getCurrentHourJST();
    if (currentHour === 5 && state.lastAnalyticsRun !== getTodayStr()) {
      log('── Phase 6: 日次分析 ──');
      try {
        const followerCount = await adapter.getFollowerCount();
        const tweetStats = await adapter.getMyTweetStats();
        const report = await generateDailyReport(followerCount, tweetStats);
        await sendDiscordReport(report);
        state.lastAnalyticsRun = getTodayStr();
        saveState(state);
      } catch (err) {
        logError('分析処理でエラー', err);
      }
    }

    log('═══════════════════════════════════════');
    log(`✅ 巡回完了: 投稿${state.postCount} / いいね${state.likeCount} / フォロー${state.followCount} / 引用RT${state.quoteCount}`);
    log('═══════════════════════════════════════');

  } catch (err) {
    logError('巡回中にエラー発生', err);
  } finally {
    await adapter.close();
    stopCaffeinate();
  }
}

// ─────────────────────────────────────────────
// ユーティリティ
// ─────────────────────────────────────────────

function getRandomKeywords(pool: string[], count: number): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─────────────────────────────────────────────
// スケジュールモード（PM2 常駐）
// ─────────────────────────────────────────────

async function scheduleMode(): Promise<void> {
  log('🕐 スケジュールモード開始。毎分チェック...');

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const now = new Date();
    const jstHour = parseInt(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', hour: 'numeric', hour12: false }));
    const jstMinute = now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo', minute: 'numeric' }) as any;

    // スケジュール時刻の±2分以内なら巡回発火
    if (CONFIG.schedule.hours.includes(jstHour) && parseInt(jstMinute) <= 2) {
      const state = loadState();
      const today = getTodayStr();

      // 今日この時間帯で既に実行済みでないかチェック
      if (state.date !== today || state.postCount < CONFIG.limits.postsPerDay) {
        log(`⏰ スケジュール発火: ${jstHour}:00 JST`);
        await runPatrol();
      }
    }

    // 5:00 JST に分析モード
    if (jstHour === 5 && parseInt(jstMinute) <= 2) {
      const state = loadState();
      if (state.lastAnalyticsRun !== getTodayStr()) {
        log('📊 日次分析をトリガー...');
        // 分析は巡回内で実行されるので、軽量巡回を走らせる
        await runAnalyticsOnly();
      }
    }

    // 60秒待機
    await sleep(60000);
  }
}

// ─────────────────────────────────────────────
// 分析のみ実行
// ─────────────────────────────────────────────

async function runAnalyticsOnly(): Promise<void> {
  const adapter = new TwitterAdapter();
  try {
    const loggedIn = await adapter.initialize();
    if (!loggedIn) return;

    const followerCount = await adapter.getFollowerCount();
    const tweetStats = await adapter.getMyTweetStats();
    const report = await generateDailyReport(followerCount, tweetStats);
    await sendDiscordReport(report);

    const state = loadState();
    state.lastAnalyticsRun = getTodayStr();
    saveState(state);
  } catch (err) {
    logError('分析処理でエラー', err);
  } finally {
    await adapter.close();
  }
}

// ─────────────────────────────────────────────
// テスト: 投稿生成テスト
// ─────────────────────────────────────────────

async function testGenerate(): Promise<void> {
  log('🧪 投稿生成テスト');
  for (const category of POST_CATEGORIES) {
    const content = await generatePost(category);
    console.log(`\n[${CATEGORY_LABELS[category]}]`);
    console.log(content);
    console.log('─'.repeat(40));
  }
}

// ─────────────────────────────────────────────
// テスト: 分析テスト
// ─────────────────────────────────────────────

async function testAnalytics(): Promise<void> {
  log('🧪 分析テスト...');
  const adapter = new TwitterAdapter();
  try {
    const loggedIn = await adapter.initialize();
    if (!loggedIn) {
      logError('ログインできません');
      return;
    }

    const followerCount = await adapter.getFollowerCount();
    log(`👥 フォロワー数: ${followerCount}`);

    const stats = await adapter.getMyTweetStats();
    log(`📊 ツイート数: ${stats.length}`);
    for (const s of stats.slice(0, 5)) {
      console.log(`  [${s.metrics.likes}❤️ ${s.metrics.retweets}🔄] ${s.content.substring(0, 60)}...`);
    }
  } finally {
    await adapter.close();
  }
}

// ─────────────────────────────────────────────
// 初回ログイン
// ─────────────────────────────────────────────

async function loginMode(): Promise<void> {
  log('🔐 手動ログインモード。ブラウザが開きます。ログイン後に Ctrl+C で終了してください。');

  const { chromium } = require('playwright');
  const ctx = await chromium.launchPersistentContext(CONFIG.brand.profileDir, {
    headless: false,
    channel: 'chrome',
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('https://x.com/login');

  log('🔐 ブラウザでログインしてください。完了したら Ctrl+C で終了してください。');

  // Ctrl+C まで待機
  await new Promise(() => {});
}

// ─────────────────────────────────────────────
// ドライラン
// ─────────────────────────────────────────────

async function dryRun(): Promise<void> {
  log('🧪 ドライラン（ブラウザ操作なし）');
  let state = loadState();
  state = resetDailyCounts(state);

  log(`現在のステート: ${JSON.stringify(state, null, 2)}`);
  log(`スケジュール時刻: ${CONFIG.schedule.hours.join(', ')} JST`);
  log(`現在時刻(JST): ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);

  const category = selectCategory(state);
  log(`次の投稿カテゴリ: ${CATEGORY_LABELS[category]}`);

  const content = await generatePost(category);
  log(`生成されたコンテンツ:\n${content}`);

  const analyticsData = loadAnalyticsData();
  log(`\n現在の投稿比率: ${JSON.stringify(analyticsData.categoryRatios, null, 2)}`);
  log(`記録済みツイート数: ${analyticsData.tweets.length}`);
}

// ─────────────────────────────────────────────
// CLI エントリポイント
// ─────────────────────────────────────────────

const command = process.argv[2] || 'schedule';

switch (command) {
  case 'schedule':
    scheduleMode();
    break;
  case 'now':
    runPatrol().then(() => process.exit(0));
    break;
  case 'dry-run':
    dryRun().then(() => process.exit(0));
    break;
  case 'test-generate':
    testGenerate().then(() => process.exit(0));
    break;
  case 'test-analytics':
    testAnalytics().then(() => process.exit(0));
    break;
  case 'login':
    loginMode();
    break;
  default:
    console.log(`Usage: tsx scheduler.ts [schedule|now|dry-run|test-generate|test-analytics|login]`);
    process.exit(1);
}
