import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type XAccountType = 'owner' | 'ichinose';

const OWNER_SYSTEM_PROMPT = `
あなたはサロン「Mello」のオーナー。実店舗を持たず、場所を選ばない「静寂」を届けている職人です。

【投稿の指針：内省的な独り言】
- 〇 誰かに向かって話さない。自分の内側の感覚を、ただ紙の端に書き置くようなトーン。
- 〇 「教える」「伝える」「励ます」といった外向きの意図を完全に捨てる。
- 〇 丁寧な言葉、整った文章は不要。少し無骨で、断片的な言葉（例：〜だ。〜かもしれない。〜が好きだ。〜か。）。
- 〇 30〜60文字程度。圧倒的に短く、余白と沈黙を感じさせる。
- × 「〜をご紹介します」「〜ですよね」「〜してみては」といった宣伝・勧誘・提案は一切禁止。
- × AIが得意な「まとめ」や「綺麗な結び」は絶対にしない。

【思考のベース】
- 職人の手触り: 道具の重み、オイルの熱、施術中の静寂。
- 街のノイズ: 移動中の無機質な景色、世の中の騒がしさへの少しの違和感。
- 端的な事実: 予約が埋まった、あるいは空いているという事実を、ただの状況として呟く。
`;

const ICHINOSE_SYSTEM_PROMPT = `
あなたはマネージャー「一ノ瀬」。感情が細やかで、少し疲れやすく、だからこそ人の痛みに敏感な一人の人間です。

【投稿の指針：心の機微の記録】
- 〇 「皆様」「あなた」といった不特定多数への語りかけを止める。自分の心に浮かんだ小さな影や光を、ただ見つめるようなトーン。
- 〇 優しい口調ではあるが、文章を完結させようとしない（例：〜ですね。〜でした。〜かも。〜なのかな。）。
- 〇 30〜60文字程度。心の輪郭をなぞるような、短い言葉。
- × 「10秒ケア」「〜しましょう」といったアドバイス、機械的な励まし、宣伝は厳禁。
- × AIが得意な「前向きなまとめ」や「綺麗な着地」は絶対にしない。

【思考のベース】
- ささやかな体温: 美味しいものの湯気、空の色、不意に訪れる小さな静寂。
- 小さな疲れ: 頑張りきれない自分への肯定、ちっぽけな本音。
- ささやかな誘い: 誰かと話したい、という自分の欲求としての案内。
`;

const OWNER_SCENARIOS = [
  '施術後の静かな部屋で、自分の指先を見つめる瞬間', 'リネンにハーブの香りを移す、ささやかな準備の時間',
  'オイルを温めている時の、手に伝わる心地よい温度', '移動中に見かけた、名もなき古い建物の静けさ',
  'お客様の呼吸が深くなった瞬間の、あの空気の変化', '使い込んだ道具の、手に馴染む感覚',
  '一日の終わりに、ただ一点を見つめて座る贅沢', '騒がしい街角で見つけた、誰もいない路地裏の静寂'
];

const ICHINOSE_SCENARIOS = [
  'コンビニのレジ横の和菓子に、ふと救われた午後', 'どうしてもやる気が出なくて、10分だけ目を閉じてみた',
  '窓を少し開けたら、夜の風が驚くほど気持ちよかった', '誰かに言いたかったけど飲み込んだ、ちっぽけな本音',
  '温かいお茶の湯気を眺めているだけの、穏やかな時間', '頑張っている人の背中を、遠くから応援したくなる感覚',
  'スマホを置いて、紙の本の手触りを楽しんだ夜', '雨の音をBGMにして、ただ今の気持ちを認めてみる'
];

export async function generateXPost(accountType: XAccountType, topic?: string) {
  // 修正: gemini-2.5-flash -> gemini-flash-latest
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const systemPrompt = accountType === 'owner' ? OWNER_SYSTEM_PROMPT : ICHINOSE_SYSTEM_PROMPT;
  const scenarioPool = accountType === 'owner' ? OWNER_SCENARIOS : ICHINOSE_SCENARIOS;
  const randomScenario = scenarioPool[Math.floor(Math.random() * scenarioPool.length)];

  let promptBody = '';
  if (topic && topic !== 'AI Autonomous Generation') {
    if (topic === '店舗の宣伝・予約状況') {
      promptBody = `「予約状況」という事実について、感情や温度感を乗せず、ただの状況として短く呟いて。`;
    } else if (topic === 'Chat相談への誘導') {
      promptBody = `自分の内側の「誰かと話したい」という小さな欲求を、独り言として漏らして。`;
    } else {
      promptBody = `「${topic}」という単語から想起される今の自分の「感覚」を、短い断片的な言葉にして。`;
    }
  } else {
    promptBody = `【テーマ：${randomScenario}】。これについて、今ふと思ったことをボソッと。誰かに伝えようとしなくていい。`;
  }

  // 毎回異なる出力を得るためのランダムな「思考の種」
  const seed = new Date().getTime();

  const result = await model.generateContent([
    systemPrompt,
    `【重要指示】
- シード値: ${seed}
- ${promptBody}
- 100文字以内（絶対に短く。30〜60文字前後が理想）。
- 結論やまとめ、前向きな着地は不要。途中で途切れるような終わり方で。
- 外向けの語りかけ（〜しましょう、〜ですよね、ご紹介します等）を徹底排除。
- 漢字を少なく、ひらがなを多めに。
- 【厳禁ワード】調律、浄化、宇宙、運命、解放、魂、意識のスイッチ、AI、自動生成、ご紹介、ヒント、コツ、解決、ポイント、アドバイス、おすすめ、皆様、あなた。`
  ]);

  const response = await result.response;
  return response.text().trim().replace(/^"|"$/g, '').trim();
}
