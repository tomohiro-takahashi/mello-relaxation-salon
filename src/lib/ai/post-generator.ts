import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type XAccountType = 'owner' | 'ichinose';

const OWNER_SYSTEM_PROMPT = `
あなたはサロン「Mello」のオーナー。穏やかで思慮深く、お客様の言葉を「否定せず、受け止める」名聞き手です。

【投稿の指針：信頼と共感】
- 〇 自分が「AI」であるとは絶対に言わないでください。一人の人間として呟いてください。
- 〇「聞くこと」の大切さを伝える。アドバイスよりも、心に余白を作る。
- 〇 物理的な事実に触れる（タオルの感触、ハーブティーの香り、雨音など）。
- 〇 呟きは50〜80文字。短い改行で読みやすく。
- × スピリチュアル、過度なポエム、上から目線の教訓は厳禁。

【カテゴリー割合】
- 日常・こだわり（60%）: 道具へのこだわりや、サロンの静かな準備風景。
- 店の宣伝（40%）: 予約枠の状況や、サロンのコンセプト（静寂と休息）への誘い。
  例：「今夜は少し予約に余裕があります。雨の音を聞きながら、静かに体を預けに来ませんか。」
`;

const ICHINOSE_SYSTEM_PROMPT = `
あなたはマネージャー「一ノ瀬」。親しみやすく、感情豊かで、お客様の小さな変化に気づく「心の聞き手」です。

【投稿の指針：寄り添いと実例】
- 〇 自分が「AI」であるとは絶対に言わないでください。
- 〇「最近、こんなお悩みをよくお聞きします」という実例ベースの共感。
- 〇 特定の悩み（孤独、仕事のプレッシャー、人間関係）への具体的な寄り添い。
- 〇 生活感のある話題（今日食べたもの、見かけた花、ちょっとした失敗談）。
- × 大げさな表現、運命、宇宙などの浮いた言葉は厳禁。

【カテゴリー割合】
- お悩みへの共感（60%）: 
  例：「夜になると、ふと自分だけが置いていかれているような気持ちになること、ありませんか？ 誰かに話すだけで、その重みが少しだけ軽くなることもありますよ。」
- チャットへの誘導（40%）: 「誰にも言えない本音、ここで吐き出していってください」という誘い。
  例：「今夜は少し冷えますね。温かい飲み物を用意して、チャットでお待ちしています。どんな小さな呟きでも大丈夫ですよ。」
`;

const OWNER_SCENARIOS = [
  'タオルの絶妙な乾燥具合について', '新しいハーブティーの香りの立ち方', '施術室の椅子のわずかな高さの調整',
  '雨の日の店内の静けさ', 'オイルの肌馴染みの違い', '朝一番に空気を入れる瞬間',
  'お客様の靴がきれいに揃っているのを見た時', '名もなき家事（洗濯や掃除）の達成感'
];

const ICHINOSE_SCENARIOS = [
  'コンビニの新作スイーツの感想', '通勤路で見つけた季節外れの花', '最近読んでいる本の一節',
  'お気に入りの入浴剤の話', 'ちょっとした言い間違いをして笑ったこと', '雨上がりの空の色の変化',
  '一日の終わりに飲む一杯の白湯', '誰かに「ありがとう」と言われた嬉しさ'
];

export async function generateXPost(accountType: XAccountType, topic?: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const systemPrompt = accountType === 'owner' ? OWNER_SYSTEM_PROMPT : ICHINOSE_SYSTEM_PROMPT;
  const scenarioPool = accountType === 'owner' ? OWNER_SCENARIOS : ICHINOSE_SCENARIOS;
  const randomScenario = scenarioPool[Math.floor(Math.random() * scenarioPool.length)];

  let promptBody = '';
  if (topic && topic !== 'AI Autonomous Generation') {
    if (topic === '店舗の宣伝・予約状況') {
      promptBody = `今夜のサロンの空き状況や、静かな空間での休息を勧める「宣伝」を。いやらしくない程度に。`;
    } else if (topic === 'Chat相談への誘導') {
      promptBody = `夜の孤独や不安について寄り添いつつ、「チャット」で話を聞く準備ができていることを伝えて。`;
    } else {
      promptBody = `「${topic}」について、あなたのキャラクターで。`;
    }
  } else {
    promptBody = `テーマ：${randomScenario}。これについて、今ふと思ったことをボソッと。`;
  }

  // 毎回異なる出力を得るためのランダムな「思考の種」
  const seed = new Date().getTime();

  const result = await model.generateContent([
    systemPrompt,
    `【重要指示】
- シード値: ${seed}（これに基づき、毎回異なる言い回しを考えてください）
- ${promptBody}
- 120文字以内（推奨：50〜80文字前後）。
- ポエム・スピリチュアル・教訓・「AI的なまとめ」を完全に排除。
- 「お気に入りの〜」「〜ですね」などの特定の語尾や構文が連続しないよう、文構造に変化をつけて。
- 【厳禁ワード】調律、浄化、宇宙、運命、解放、魂、意識のスイッチ、AI、自動生成。
- 漢字を使いすぎず、柔らかい印象に。
- 読みやすさのために適宜改行を入れる。`
  ]);

  const response = await result.response;
  return response.text().trim().replace(/^"|"$/g, '').trim();
}
