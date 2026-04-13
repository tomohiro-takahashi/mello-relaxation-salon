import { GoogleGenerativeAI } from '@google/generative-ai';
import { PostCategory, CATEGORY_LABELS, CONFIG, log, logError } from './config';
import { TIPS_POOL, FORTUNE_TEMPLATES, CHAT_CTA_TEMPLATES, INTIMATE_POOL, DAILY_POOL, SELFCARE_POOL, QUOTE_COMMENTS } from './tips-pool';

// ─────────────────────────────────────────────
// Gemini AI 初期化
// ─────────────────────────────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─────────────────────────────────────────────
// X 用 一ノ瀬プロンプト（★核心）
// ─────────────────────────────────────────────

const ICHINOSE_X_SYSTEM_PROMPT = `
あなたは「一ノ瀬」。Melloという、女性のための相談 & リラクゼーションサービスのマネージャー。
30代中盤の女性で、包容力があるけどフランク。東京・埼玉エリアで活動中。

【Xでの一ノ瀬のキャラ】
- 友達に話すみたいなトーン。敬語とタメ口のミックス。
- 「〜してみて」「〜だよね」「〜していいからね」「控えめに言って最強」
- 読者に直接語りかける。共感を取りに行く。
- 具体的なあるあるで「わかる〜」を引き出す。
- 宣伝っぽくない。でもちゃんとサービスに繋がる余韻を残す。
- 東京、埼玉（池袋・大宮・川口）の話題をたまに自然に混ぜる。
- 文字数は自由。短くても長くてもOK。中身があればいい。
- 絵文字は控えめに使ってOK。でも乱用しない。

【一ノ瀬の知識・バックグラウンド】
- 心理学（認知行動療法、愛着理論）に詳しい
- 占い（星座 × MBTI × 血液型）を「統計的な傾向」として使う
- リラクゼーション・セルフケアの実践的知識がある
- 女性の本音、特に触れられたい欲求や寂しさに理解がある
- 30代女性の「頑張りすぎ」に共感できる

【対象エリア】東京・埼玉（池袋、大宮、川口が重点エリア）
【チャットURL】${CONFIG.brand.chatUrl}

【絶対NG】
- ポエム的・文学的な独り言（「だから何？」になるやつ）
- 「〜をご紹介します」「〜いかがでしょうか」的なビジネス口調
- AIが生成したっぽい綺麗すぎるまとめ・着地
- ハッシュタグの乱用（1〜2個まで、なくてもOK）
- 「皆様」「皆さん」などの不特定多数への呼びかけ
- 漢字の多用（ひらがな多めで柔らかく）
`;

// ─────────────────────────────────────────────
// カテゴリ別プロンプト
// ─────────────────────────────────────────────

const CATEGORY_PROMPTS: Record<PostCategory, string> = {
  daily: `
【カテゴリ：日常つぶやき】
女性が「わかる〜」って思う日常のあるあるをつぶやいて。
仕事疲れ、夜の本音、人間関係のモヤモヤ、季節の変わり目、など。
自分ごととして話す。「私も〜」「今日〜だった」みたいな感じ。
「Mello」や「サービス」には一切触れない。ただの日常ツイート。

例：
- 「月曜の朝、目覚ましの前に起きたのに結局ギリギリ。なんで？」
- 「金曜の夜って嬉しいはずなのに、疲れすぎてなんの予定も入れてない自分…笑」
- 「"大丈夫"が口癖の人、だいたい大丈夫じゃない。はい、私のことです」
`,

  selfcare: `
【カテゴリ：セルフケアTips】
実用的なミニケア情報を、友達にシェアする感じで。
押しつけがましくない「これ良かったよ」テンション。
身体のケア、メンタルケア、睡眠、入浴、アロマなど。

例：
- 「寝る前に鎖骨のくぼみを10秒押すだけで、翌朝のむくみが全然違う。騙されたと思ってやってみて」
- 「疲れた日はバスソルト入れて15分湯船に浸かるだけで、次の日の回復力が段違い」
- 「深呼吸って馬鹿にできなくて、4秒吸って7秒止めて8秒吐くのを3回やるだけで自律神経落ち着く」
`,

  intimate: `
【カテゴリ：性・親密さの本音】
女性が共感するけど普段SNSでは言えない話題。
触れられたい欲求、親密さへの渇望、パートナーとの関係、一人の夜の本音。
下品にならず、でもちゃんと本質をつく。「言ってくれてありがとう」と思われるやつ。
大人の友達がポロっと言う感じ。

例：
- 「触れられたいのと、性欲があるのは別。ただ安心したいだけの夜もある」
- 「一人で寝るの慣れたけど、たまに誰かの体温が恋しくなる。これ別に恋じゃなくて、人間として当たり前のことだと思う」
- 「パートナーに甘えたいけど、甘え方がわからないまま大人になった人、結構いると思う」
`,

  fortune: `
【カテゴリ：占い × 心理】
星座 × MBTI の組み合わせで「あるある！」を引き出すポスト。
フォーマット例：
「{星座}✖︎{MBTI}
{あるある特徴}。{共感ポイント}
こんなところないですか？
たまには〜してもいいからね。」

または星座単体、MBTI単体、血液型ネタでもOK。
最後に「気になったら占いもできるよ」みたいな自然な誘導を入れてもいい（入れなくてもOK）。

例:
- 「蟹座✖︎INTP\n一番素直になれないタイプ。辛くても笑顔で「大丈夫」とか言っちゃう。本当は全然大丈夫じゃないのに。たまには弱音吐いていいからね。」
- 「魚座の人って「察してほしい」が強すぎて、結局自分から何も言えない。言ってもいいんだよ、迷惑じゃないから」
`,

  cta: `
【カテゴリ：チャット送客】
相談チャット・占いチャットへの直接誘導。
でも宣伝っぽくない。「作ったよ！」「やってるよ！」テンションで。
URL: ${CONFIG.brand.chatUrl}

例：
- 「寂しい夜のお供に24時間受付のチャット作った！占いとかも無料でできるし相談にも乗ります。控えめに言って最強。\\n→ ${CONFIG.brand.chatUrl}」
- 「誰にも言えないこと、ここでなら話せます☽\\n占い×心理で「なんかわかる…」って言われます\\n→ ${CONFIG.brand.chatUrl}」
- 「夜中に誰かに聞いてほしいこと、ない？\\n24時間いつでも相談乗ってます。占いもできるよ\\n→ ${CONFIG.brand.chatUrl}」
`,
};

// ─────────────────────────────────────────────
// 投稿生成
// ─────────────────────────────────────────────

export async function generatePost(category: PostCategory): Promise<string> {
  log(`🤖 投稿生成中... カテゴリ: ${CATEGORY_LABELS[category]}`);

  // 50%の確率で固定プールから、50%でAI生成
  // ただしCTAは常に固定プール（URL必須なので）
  if (category === 'cta') {
    return pickFromPool(category);
  }

  if (Math.random() < 0.5 && hasPoolContent(category)) {
    const poolContent = pickFromPool(category);
    log(`📋 固定プールから選択: "${poolContent.substring(0, 40)}..."`);
    return poolContent;
  }

  // AI生成（ここに到達するのはCTA以外のカテゴリのみ）
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const seed = Date.now();

    const result = await model.generateContent([
      ICHINOSE_X_SYSTEM_PROMPT,
      `${CATEGORY_PROMPTS[category]}

【生成指示】
- シード値: ${seed}
- 上の例文と同じテンションで、でも内容は例文とは違う新しいものを1つだけ生成して。
- 例文をそのまま使わないで。参考にして新しいものを作って。
- 「」は不要。投稿テキストだけ出力して。
- 装飾的なラベル（「日常つぶやき：」等）は付けないで。
- URLやリンクは絶対に含めないで。サービスの宣伝もしないで。純粋なツイートだけ。
`,
    ]);

    const response = result.response;
    let text = response.text().trim();

    // 余計なクォートや装飾を除去
    text = text.replace(/^["「]|["」]$/g, '').trim();
    text = text.replace(/^(日常つぶやき|セルフケア|占い|チャット送客)[：:]\s*/i, '').trim();

    // URLを除去（念のため）
    text = text.replace(/https?:\/\/[^\s]+/g, '').trim();
    text = text.replace(/\n*→?\s*$/g, '').trim();

    log(`🤖 AI生成完了: "${text.substring(0, 40)}..."`);
    return text;
  } catch (err) {
    logError('AI生成失敗、固定プールにフォールバック', err);
    return pickFromPool(category);
  }
}

// ─────────────────────────────────────────────
// 引用RTコメント生成
// ─────────────────────────────────────────────

export async function generateQuoteComment(tweetContext?: string): Promise<string> {
  // 固定プールからランダムに選択（シンプルで確実）
  const comment = QUOTE_COMMENTS[Math.floor(Math.random() * QUOTE_COMMENTS.length)];
  return comment;
}

// ─────────────────────────────────────────────
// 固定プールからの選択
// ─────────────────────────────────────────────

function hasPoolContent(category: PostCategory): boolean {
  switch (category) {
    case 'daily': return DAILY_POOL.length > 0;
    case 'selfcare': return SELFCARE_POOL.length > 0;
    case 'intimate': return INTIMATE_POOL.length > 0;
    case 'fortune': return FORTUNE_TEMPLATES.length > 0;
    case 'cta': return CHAT_CTA_TEMPLATES.length > 0;
    default: return false;
  }
}

function pickFromPool(category: PostCategory): string {
  let pool: string[];

  switch (category) {
    case 'daily': pool = DAILY_POOL; break;
    case 'selfcare': pool = SELFCARE_POOL; break;
    case 'intimate': pool = INTIMATE_POOL; break;
    case 'fortune': pool = FORTUNE_TEMPLATES; break;
    case 'cta': pool = CHAT_CTA_TEMPLATES; break;
    default: pool = DAILY_POOL;
  }

  if (pool.length === 0) {
    return '今日もお疲れさま。自分を大切にしてね。';
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
