import * as fs from 'fs';
import * as path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PostCategory, CATEGORY_LABELS, CONFIG, log, logError } from './config';
import { TweetStats } from './adapter';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface TweetRecord {
  content: string;
  category: PostCategory;
  postedAt: string;
  metrics?: {
    likes: number;
    retweets: number;
    replies: number;
    impressions: number;
  };
  engagementRate?: number;
}

interface DailyReport {
  date: string;
  followerCount: number;
  followerDelta: number;
  totalImpressions: number;
  totalLikes: number;
  totalRetweets: number;
  categoryScores: Record<PostCategory, number>;
  recommendations: string[];
  adjustedRatios: Record<PostCategory, number>;
}

interface AnalyticsData {
  tweets: TweetRecord[];
  dailyReports: DailyReport[];
  lastFollowerCount: number;
  categoryRatios: Record<PostCategory, number>;
}

// ─────────────────────────────────────────────
// Analytics Manager
// ─────────────────────────────────────────────

const ANALYTICS_FILE = path.join(__dirname, '.analytics_data.json');

const DEFAULT_RATIOS: Record<PostCategory, number> = {
  daily: 0.25,
  selfcare: 0.20,
  intimate: 0.20,
  fortune: 0.20,
  cta: 0.15,
};

export function loadAnalyticsData(): AnalyticsData {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    }
  } catch {}

  return {
    tweets: [],
    dailyReports: [],
    lastFollowerCount: 0,
    categoryRatios: { ...DEFAULT_RATIOS },
  };
}

export function saveAnalyticsData(data: AnalyticsData): void {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ─────────────────────────────────────────────
// ツイート記録
// ─────────────────────────────────────────────

export function recordTweet(content: string, category: PostCategory): void {
  const data = loadAnalyticsData();

  data.tweets.push({
    content: content.substring(0, 200),
    category,
    postedAt: new Date().toISOString(),
  });

  // 過去30日分のみ保持
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  data.tweets = data.tweets.filter(t => t.postedAt >= thirtyDaysAgo);

  saveAnalyticsData(data);
}

// ─────────────────────────────────────────────
// エンゲージメント更新
// ─────────────────────────────────────────────

export function updateTweetMetrics(tweetStats: TweetStats[]): void {
  const data = loadAnalyticsData();

  for (const stat of tweetStats) {
    // 記録済みツイートとマッチング（先頭50文字）
    const matchIndex = data.tweets.findIndex(t =>
      t.content.substring(0, 50) === stat.content.substring(0, 50)
    );

    if (matchIndex >= 0) {
      data.tweets[matchIndex].metrics = stat.metrics;
      const m = stat.metrics;
      const total = m.likes + m.retweets + m.replies;
      data.tweets[matchIndex].engagementRate = m.impressions > 0
        ? total / m.impressions
        : total; // インプレッション取れなければ絶対値
    }
  }

  saveAnalyticsData(data);
}

// ─────────────────────────────────────────────
// カテゴリ別スコア計算
// ─────────────────────────────────────────────

function calculateCategoryScores(tweets: TweetRecord[]): Record<PostCategory, number> {
  const scores: Record<PostCategory, number> = {
    daily: 0, selfcare: 0, intimate: 0, fortune: 0, cta: 0,
  };
  const counts: Record<PostCategory, number> = {
    daily: 0, selfcare: 0, intimate: 0, fortune: 0, cta: 0,
  };

  for (const tweet of tweets) {
    if (tweet.metrics) {
      const engagement = tweet.metrics.likes + tweet.metrics.retweets + tweet.metrics.replies;
      scores[tweet.category] += engagement;
      counts[tweet.category]++;
    }
  }

  // 平均エンゲージメントで正規化
  for (const cat of Object.keys(scores) as PostCategory[]) {
    scores[cat] = counts[cat] > 0 ? scores[cat] / counts[cat] : 0;
  }

  return scores;
}

// ─────────────────────────────────────────────
// 比率自動調整
// ─────────────────────────────────────────────

export function adjustCategoryRatios(): Record<PostCategory, number> {
  const data = loadAnalyticsData();

  // 過去7日分のツイートでスコア計算
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentTweets = data.tweets.filter(t => t.postedAt >= sevenDaysAgo && t.metrics);

  if (recentTweets.length < 10) {
    log('📊 データ不足（10件未満）。デフォルト比率を維持。');
    return data.categoryRatios;
  }

  const scores = calculateCategoryScores(recentTweets);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  if (totalScore === 0) return data.categoryRatios;

  // スコアに基づいて比率を計算（ただし最低10%は保証）
  const newRatios: Record<PostCategory, number> = { ...DEFAULT_RATIOS };
  const MIN_RATIO = 0.10;

  for (const cat of Object.keys(scores) as PostCategory[]) {
    const rawRatio = scores[cat] / totalScore;
    newRatios[cat] = Math.max(MIN_RATIO, rawRatio);
  }

  // 合計1.0に正規化
  const total = Object.values(newRatios).reduce((a, b) => a + b, 0);
  for (const cat of Object.keys(newRatios) as PostCategory[]) {
    newRatios[cat] = Math.round((newRatios[cat] / total) * 100) / 100;
  }

  data.categoryRatios = newRatios;
  saveAnalyticsData(data);

  return newRatios;
}

// ─────────────────────────────────────────────
// 日次レポート生成
// ─────────────────────────────────────────────

export async function generateDailyReport(
  followerCount: number,
  tweetStats: TweetStats[]
): Promise<DailyReport> {
  const data = loadAnalyticsData();
  const followerDelta = data.lastFollowerCount > 0
    ? followerCount - data.lastFollowerCount
    : 0;

  // メトリクス更新
  updateTweetMetrics(tweetStats);

  // 昨日のツイートを集計
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const todayTweets = data.tweets.filter(t => t.postedAt >= yesterday && t.metrics);

  let totalImpressions = 0;
  let totalLikes = 0;
  let totalRetweets = 0;

  for (const tweet of todayTweets) {
    if (tweet.metrics) {
      totalImpressions += tweet.metrics.impressions;
      totalLikes += tweet.metrics.likes;
      totalRetweets += tweet.metrics.retweets;
    }
  }

  const categoryScores = calculateCategoryScores(todayTweets);
  const adjustedRatios = adjustCategoryRatios();

  // AI改善提案
  const recommendations = await generateRecommendations(categoryScores, adjustedRatios, followerDelta);

  const report: DailyReport = {
    date: new Date().toISOString().split('T')[0],
    followerCount,
    followerDelta,
    totalImpressions,
    totalLikes,
    totalRetweets,
    categoryScores,
    recommendations,
    adjustedRatios,
  };

  // レポート保存
  data.dailyReports.push(report);
  data.lastFollowerCount = followerCount;

  // 過去30日分のみ保持
  if (data.dailyReports.length > 30) {
    data.dailyReports = data.dailyReports.slice(-30);
  }

  saveAnalyticsData(data);

  return report;
}

// ─────────────────────────────────────────────
// AI 改善提案
// ─────────────────────────────────────────────

async function generateRecommendations(
  scores: Record<PostCategory, number>,
  ratios: Record<PostCategory, number>,
  followerDelta: number
): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const scoreText = Object.entries(scores)
      .map(([cat, score]) => `${CATEGORY_LABELS[cat as PostCategory]}: ${score.toFixed(1)}`)
      .join('\n');

    const ratioText = Object.entries(ratios)
      .map(([cat, ratio]) => `${CATEGORY_LABELS[cat as PostCategory]}: ${(ratio * 100).toFixed(0)}%`)
      .join('\n');

    const result = await model.generateContent([
      `あなたはXのマーケティング分析AIです。以下のデータから改善提案を3つだけ、箇条書きで出してください。各提案は1行で、具体的なアクションを含めること。

カテゴリ別平均エンゲージメント:
${scoreText}

現在の投稿比率:
${ratioText}

フォロワー増減: ${followerDelta >= 0 ? '+' : ''}${followerDelta}

改善提案を3つ:`,
    ]);

    const text = result.response.text().trim();
    return text.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[-・•*]\s*/, '').trim())
      .slice(0, 3);
  } catch (err) {
    logError('AI改善提案の生成に失敗', err);
    return ['データを蓄積中。3日後に改善提案を開始します。'];
  }
}

// ─────────────────────────────────────────────
// Discord レポート送信
// ─────────────────────────────────────────────

export async function sendDiscordReport(report: DailyReport): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    log('⚠️ DISCORD_WEBHOOK_URL が未設定。レポートをコンソールに出力します。');
    printReportToConsole(report);
    return;
  }

  const scoreEntries = Object.entries(report.categoryScores)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, score], i) => {
      const medals = ['🏆', '🥈', '🥉', '📍', '📍'];
      return `  ${medals[i]} ${CATEGORY_LABELS[cat as PostCategory]}: ${score.toFixed(1)}`;
    })
    .join('\n');

  const ratioText = Object.entries(report.adjustedRatios)
    .map(([cat, ratio]) => `${CATEGORY_LABELS[cat as PostCategory]} ${(ratio * 100).toFixed(0)}%`)
    .join(' / ');

  const message = `📊 **Mello X Bot 日次レポート** (${report.date})

👥 フォロワー: ${report.followerCount.toLocaleString()} (${report.followerDelta >= 0 ? '+' : ''}${report.followerDelta})
👁 インプレッション合計: ${report.totalImpressions.toLocaleString()}
❤️ いいね合計: ${report.totalLikes}
🔄 RT合計: ${report.totalRetweets}

📈 **カテゴリ別エンゲージメント:**
${scoreEntries}

💡 **改善提案:**
${report.recommendations.map(r => `  - ${r}`).join('\n')}

🤖 **明日の投稿比率:** ${ratioText}`;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
    log('📨 Discord レポート送信完了');
  } catch (err) {
    logError('Discord レポート送信失敗', err);
    printReportToConsole(report);
  }
}

function printReportToConsole(report: DailyReport): void {
  console.log('\n' + '='.repeat(50));
  console.log(`📊 日次レポート: ${report.date}`);
  console.log(`👥 フォロワー: ${report.followerCount} (${report.followerDelta >= 0 ? '+' : ''}${report.followerDelta})`);
  console.log(`❤️ いいね: ${report.totalLikes} / 🔄 RT: ${report.totalRetweets}`);
  console.log('📈 カテゴリ別スコア:');
  for (const [cat, score] of Object.entries(report.categoryScores)) {
    console.log(`  ${CATEGORY_LABELS[cat as PostCategory]}: ${score.toFixed(1)}`);
  }
  console.log('💡 改善提案:');
  for (const rec of report.recommendations) {
    console.log(`  - ${rec}`);
  }
  console.log('='.repeat(50) + '\n');
}
