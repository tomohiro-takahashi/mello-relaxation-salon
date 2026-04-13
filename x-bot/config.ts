import 'dotenv/config';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface BrandConfig {
  brand: string;
  handle: string;
  displayName: string;
  profileDir: string;
  domain: string;
  chatUrl: string;
  // いいね用キーワード（個人のツイートに対していいね）
  likeKeywords: string[];
  // フォロー用キーワード（個人ユーザーを狙う。店舗系を除外）
  followKeywords: string[];
  trendKeywords: string[];
  // ターゲットアカウント: フォロワーにいいね・フォローを行う
  targetAccounts: string[];
}

export interface ScheduleConfig {
  hours: number[];  // JST hours
}

export interface LimitsConfig {
  postsPerDay: number;
  likesPerDay: number;
  followsPerDay: number;
  quotesPerDay: number;
}

export interface DelaysConfig {
  betweenActionsMin: number;
  betweenActionsMax: number;
  typingDelay: number;
  scrollPauseMin: number;
  scrollPauseMax: number;
}

export interface XBotConfig {
  brand: BrandConfig;
  schedule: ScheduleConfig;
  limits: LimitsConfig;
  delays: DelaysConfig;
}

// ─────────────────────────────────────────────
// 投稿カテゴリ
// ─────────────────────────────────────────────

export type PostCategory = 'daily' | 'selfcare' | 'intimate' | 'fortune' | 'cta';

export const POST_CATEGORIES: PostCategory[] = ['daily', 'selfcare', 'fortune', 'intimate', 'cta'];

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  daily: '日常つぶやき',
  selfcare: 'セルフケアTips',
  intimate: '性・親密さの本音',
  fortune: '占い×心理',
  cta: 'チャット送客',
};

// ─────────────────────────────────────────────
// メイン設定（★カスタマイズはここ）
// ─────────────────────────────────────────────

export const CONFIG: XBotConfig = {
  brand: {
    brand: 'ichinose',
    handle: '@Mello_ichinose',
    displayName: '一ノ瀬｜Mello',
    profileDir: './chrome-profile-x-ichinose',
    domain: 'mello-relaxation.vercel.app',
    chatUrl: 'https://mello-relaxation.vercel.app/contact',

    // ── いいね用キーワード ──
    // 個人が感情でつぶやくキーワードのみ（お店のツイートが出にくい）
    likeKeywords: [
      '疲れた 癒されたい', '寂しい 夜', '仕事疲れ 帰りたい',
      '頑張りすぎ もう無理', '自分にご褒美', 'メンタル 限界',
      'セルフケア 大事', '自律神経 やばい', '一人の時間 ほしい',
      'MBTI 共感', '占い 当たる', '誰かに話したい',
      'マッサージ 行きたい', '疲れた 寝たい', '泣きたい 夜',
      '甘えたい', '褒められたい', 'ストレス やばい',
    ],

    // ── フォロー用キーワード ──
    // 個人ユーザーを狙う。感情・悩み系に絞る
    followKeywords: [
      'セルフケア 女性', '自律神経 つらい',
      '寂しい 夜', '仕事疲れ 帰りたい',
      '頑張りすぎ 休みたい', '自分にご褒美',
      'MBTI 女', '一人の時間 大事',
      '疲れた 癒されたい', 'メンタル 限界',
      '東京 女子 疲れた', '埼玉 OL',
    ],

    // ── 引用RT用トレンドキーワード ──
    trendKeywords: [
      'セルフケア', '自律神経', 'MBTI', '星座',
      '疲れた', '頑張りすぎ', '女性 本音',
      '癒し', 'ご褒美',
    ],

    // ── ターゲットアカウント ──
    // これらのアカウントの「フォロワー」にいいね・フォローを行う
    // フォロワー = 女性客 → Melloのターゲット層
    targetAccounts: [
      // 女性専用ヨガ・ピラティス
      'LAVA_official',        // LAVA（女性専用ホットヨガ）
      'pilates_k_',           // pilates K（女性専用ピラティス）
      // ネイル・美容系
      'nailquick_official',   // Nail Quick
      'hotpepper_beauty',     // ホットペッパービューティー
      // 占い・癒し系
      'uranai_will',          // 占いの館ウィル
      // ★ とむさんが見つけたアカウントをここに追加
    ],
  },

  // 1日5投稿（JST）— 19時以降の夜〜深夜帯
  schedule: {
    hours: [19, 21, 23, 1, 3],
  },

  // 制限値（初期は控えめ）
  limits: {
    postsPerDay: 5,
    likesPerDay: 40,
    followsPerDay: 15,
    quotesPerDay: 2,
  },

  // ディレイ設定（BAN回避）
  delays: {
    betweenActionsMin: 20000,   // 20秒
    betweenActionsMax: 90000,   // 1.5分
    typingDelay: 30,            // 30ms/文字
    scrollPauseMin: 4000,       // 4秒
    scrollPauseMax: 12000,      // 12秒
  },
};

// ─────────────────────────────────────────────
// ユーティリティ
// ─────────────────────────────────────────────

export function randomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function log(msg: string): void {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  console.log(`[${now}] ${msg}`);
}

export function logError(msg: string, err?: any): void {
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  console.error(`[${now}] ❌ ${msg}`, err?.message || err || '');
}
