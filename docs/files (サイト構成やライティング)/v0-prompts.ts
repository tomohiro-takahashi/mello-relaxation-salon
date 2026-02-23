/**
 * v0.dev プロンプト集
 * 各セクションごとに分割して生成することを推奨
 */

// ============================================================================
// プロンプト 1: 完全なランディングページ（一括生成）
// ============================================================================

const v0_prompt_full = `
Create a premium, mobile-first landing page for "Serene" - a private relaxation service for women aged 30-40.

DESIGN THEME:
- Sophisticated, luxurious, empathetic
- Dark theme: Deep navy (#0A0E14), muted gold (#C5A059), soft cream (#F5F5F7)
- Typography: Playfair Display (serif) for headings, Inter for body
- Glassmorphism effects, subtle animations

PAGE STRUCTURE (9 sections):

1. HERO SECTION
   - Full screen, centered
   - Pre-heading: "完全予約制・女性専用"
   - Main heading: "あなただけの、プライベートな癒しを。" (Large serif)
   - Subheading: "忙しい毎日に疲れていませんか？誰かに話を聞いてほしい。大切に扱われたい。そんなあなたのための、特別な時間。"
   - 3 CTAs:
     * Primary (gold button): "まずは相談してみる" → /chat
     * Secondary (outline): "詳しく見る" (smooth scroll)
     * Tertiary (link): "セラピストを見る" → /therapists
   - Background: Elegant abstract gradient

2. TRUST BADGES
   - 4 horizontal badges with icons:
     * Shield: "届出済み"
     * Lock: "完全プライベート"
     * Users: "女性専用"
     * Calendar: "完全予約制"
   - Semi-transparent cards

3. FEATURES (3つの特徴)
   - Heading: "Sereneが選ばれる、3つの理由"
   - 3 large feature cards (alternating left-right layout):
     
     Feature 1:
     - Number: "01"
     - Title: "事前カウンセリング"
     - Subtitle: "まず、あなたの話を聞かせてください"
     - Description: "予約前に、カウンセラーがあなたの気持ちに寄り添います。どんな悩みも、ここでなら安心して話せます。その上で、あなたに最適なセラピストをご提案。"
     - 3 benefits with checkmarks
     - Icon: MessageCircle
     
     Feature 2:
     - Number: "02"
     - Title: "本物のリラクゼーション"
     - Subtitle: "心だけじゃなく、体も癒される"
     - Description: "ちゃんとした技術を持ったセラピストが、あなたの心と体、両方をケア。肩こり、腰痛、疲労…本当に楽になります。"
     - 3 benefits
     - Icon: Sparkles
     
     Feature 3:
     - Number: "03"
     - Title: "パーソナライズされた寄り添い"
     - Subtitle: "初めてでも、安心"
     - Description: "AIが事前にあなたのことを理解。担当セラピストにも共有されるので、初対面でも「分かってもらえてる」安心感。"
     - 3 benefits
     - Icon: Heart
   
   - CTA: "事前カウンセリングを始める" (gold button)

4. HOW IT WORKS
   - Heading: "ご利用の流れ"
   - 3 steps in horizontal cards with connecting lines:
     
     Step 1: "AIに相談する" (MessageSquare icon, 5-15分)
     Step 2: "セラピストを選ぶ" (Users icon, 3-5分)
     Step 3: "予約して、癒される" (Calendar icon, 90-180分)
   
   - Special offer card: "初回限定特典 - 通常90分 → 120分（同料金）"
   - CTA: "今すぐ始める"

5. TESTIMONIALS (利用者の声)
   - Heading: "ご利用いただいた方の声"
   - 3 testimonial cards (horizontal scroll on mobile, grid on desktop):
     
     Card 1:
     - Quote: "最初は『こういうの利用するなんて...』って罪悪感があったけど、AIに話を聞いてもらって、『自分を大切にしていいんだ』って思えました。"
     - Author: "K.M.さん（37歳・会社員）"
     - Context: "仕事と育児の両立に疲れて"
     
     Card 2:
     - Quote: "夫との関係に悩んでて、誰にも相談できなくて...。でもここでは全部話せた。体も心も、すごく軽くなった。"
     - Author: "A.T.さん（42歳・専業主婦）"
     
     Card 3:
     - Quote: "本当に技術がちゃんとしてる。肩こりが嘘みたいに楽になって驚きました。ただのリラクゼーションじゃない、『寄り添い』がある。"
     - Author: "R.S.さん（34歳・管理職）"
   
   - Stats: "92%の方が「また来たい」" / "30-40代女性の利用が増加中" / "平均4.8（5点満点）"

6. THERAPISTS PREVIEW
   - Heading: "担当するセラピスト"
   - 3 therapist cards:
     
     Aoi: "静かで落ち着いた、寄り添い型" - Deep Relaxation, Emotional Care
     Yuki: "会話を楽しみながら、心を軽く" - Conversational, Empathetic
     Saki: "リードしながら、包み込むケア" - Leadership, Deep Tissue
   
   - CTA: "全てのセラピストを見る" → /therapists
   - Note: "マッチ度は事前カウンセリング後に表示されます"

7. FAQ (Accordion)
   - Heading: "よくあるご質問"
   - 4 categories with multiple Q&As:
     * サービスについて (3 questions)
     * プライバシーと安全性 (3 questions)
     * 料金と予約 (3 questions)
     * 事前カウンセリングについて (3 questions)
   - Expandable accordion style

8. FINAL CTA
   - Full width section with elegant background
   - Heading: "あなたは、十分頑張っています。"
   - Subheading: "たまには、自分を労わってもいいんです。ここは、あなたのための場所。"
   - Large gold CTA: "事前カウンセリングを始める"
   - Trust badges below

9. FOOTER
   - 4 columns:
     * Serene (tagline)
     * サービス (links)
     * 安全性 (links)
     * ヘルプ (links)
   - Bottom: Copyright + "無店舗型性風俗特殊営業 届出済み"

DESIGN SPECIFICATIONS:
- Mobile-first responsive design
- Smooth scroll animations (fade in on scroll)
- Glassmorphism cards: rgba(42, 46, 52, 0.6) with backdrop-filter: blur(10px)
- Hover effects: translateY(-4px) + shadow
- Max content width: 1280px
- Section spacing: clamp(4rem, 10vw, 8rem)
- All buttons have hover states with glow effect
- High-quality, professional appearance
- NO explicit imagery
- Elegant, trustworthy, empathetic tone

Use Next.js 14, TypeScript, Tailwind CSS, and Lucide React icons.
`;

// ============================================================================
// プロンプト 2: Hero Section のみ（分割生成推奨）
// ============================================================================

const v0_prompt_hero = `
Create a premium hero section for a women's wellness service landing page.

DESIGN:
- Dark theme: Background #0A0E14 (deep navy) with subtle gradient
- Full viewport height, centered content
- Elegant, sophisticated, empathetic tone

CONTENT:
- Small pre-heading: "完全予約制・女性専用" (muted gold color)
- Main heading (large serif font, Playfair Display):
  Line 1: "あなただけの、"
  Line 2: "プライベートな癒しを。"
- Subheading (body font, Inter, cream color #F5F5F7):
  "忙しい毎日に疲れていませんか？
   誰かに話を聞いてほしい。大切に扱われたい。
   そんなあなたのための、特別な時間。"

BUTTONS (3 CTAs):
1. Primary (large, gold #C5A059, glow effect):
   "まずは相談してみる"
2. Secondary (outline style):
   "詳しく見る"
3. Tertiary (text link with arrow):
   "セラピストを見る"

EFFECTS:
- Fade in animation on load
- Subtle parallax on scroll
- Glassmorphism card behind text (optional)
- Mobile responsive (stack vertically)

Use Next.js 14, TypeScript, Tailwind CSS.
`;

// ============================================================================
// プロンプト 3: Features Section のみ
// ============================================================================

const v0_prompt_features = `
Create a premium features section showcasing 3 key features.

DESIGN:
- Dark background (#0A0E14)
- Alternating left-right layout (image left, text right, then flip)
- Large feature cards with glassmorphism effect

HEADING:
"Sereneが選ばれる、3つの理由"
Subheading: "あなたの心と体、両方を大切にします。"

FEATURES:

Feature 1:
- Number badge: "01"
- Icon: MessageCircle (Lucide)
- Title: "事前カウンセリング"
- Subtitle: "まず、あなたの話を聞かせてください"
- Description: "予約前に、カウンセラーがあなたの気持ちに寄り添います。どんな悩みも、ここでなら安心して話せます。その上で、あなたに最適なセラピストをご提案。"
- Benefits (with checkmarks):
  * "24時間いつでも相談可能"
  * "誰にも知られず、安心して話せる"
  * "あなたの状態に合わせたマッチング"

Feature 2:
- Number: "02"
- Icon: Sparkles
- Title: "本物のリラクゼーション"
- Subtitle: "心だけじゃなく、体も癒される"
- Description: "ちゃんとした技術を持ったセラピストが、あなたの心と体、両方をケア。肩こり、腰痛、疲労…本当に楽になります。"
- Benefits:
  * "熟練セラピストによる施術"
  * "あなたの希望に合わせた柔軟な対応"
  * "リラクゼーションマッサージから親密なケアまで"

Feature 3:
- Number: "03"
- Icon: Heart
- Title: "パーソナライズされた寄り添い"
- Subtitle: "初めてでも、安心"
- Description: "AIが事前にあなたのことを理解。担当セラピストにも共有されるので、初対面でも「分かってもらえてる」安心感。"
- Benefits:
  * "事前カウンセリングで不安を解消"
  * "あなたの好みに合わせた接し方"
  * "無理のない、安心できる時間"

BOTTOM CTA:
Gold button: "事前カウンセリングを始める"
Subtext: "まずは気軽に、お話ししてみませんか？"

EFFECTS:
- Scroll-triggered fade in
- Hover: slight scale and shadow
- Mobile: Stack vertically, single column

Colors: Gold #C5A059, Navy #0A0E14, Cream #F5F5F7
Use Next.js 14, TypeScript, Tailwind CSS, Lucide React.
`;

// ============================================================================
// プロンプト 4: Testimonials Section
// ============================================================================

const v0_prompt_testimonials = `
Create an elegant testimonials section for a premium wellness service.

DESIGN:
- Dark background
- Glassmorphism cards
- Horizontal scroll on mobile, 3-column grid on desktop

HEADING:
"ご利用いただいた方の声"
Subheading: "みなさん、最初は同じように迷われていました。"

TESTIMONIALS (3 cards):

Card 1:
- Quote: "最初は『こういうの利用するなんて...』って罪悪感があったけど、AIに話を聞いてもらって、『自分を大切にしていいんだ』って思えました。実際に会ったセラピストの方も優しくて、本当に来てよかった。"
- Author: "K.M.さん（37歳・会社員）"
- Context: "仕事と育児の両立に疲れて"
- Star rating: 5/5

Card 2:
- Quote: "夫との関係に悩んでて、誰にも相談できなくて...。でもここでは全部話せた。セラピストさんが『大変でしたね』って言ってくれた時、涙が出ました。体も心も、すごく軽くなった。"
- Author: "A.T.さん（42歳・専業主婦）"
- Context: "パートナーとの距離感に孤独を感じて"
- Rating: 5/5

Card 3:
- Quote: "『マッサージ』って言うけど、本当に技術がちゃんとしてる。肩こりが嘘みたいに楽になって驚きました。それに、話もちゃんと聞いてくれる。ただのリラクゼーションじゃない、『寄り添い』がある。"
- Author: "R.S.さん（34歳・管理職）"
- Context: "慢性的な肩こりとストレスで"
- Rating: 5/5

STATS SECTION (below testimonials):
3 stat cards in a row:
1. "92%" - "の方が「また来たい」"
2. "30-40代" - "女性の利用が増加中"
3. "平均4.8" - "満足度（5点満点）"

STYLING:
- Quote marks icon
- Soft shadows
- Elegant typography
- Gold accents for ratings
- Cream text on dark cards

Use Next.js 14, TypeScript, Tailwind CSS, Lucide React.
`;

// ============================================================================
// プロンプト 5: FAQ Accordion
// ============================================================================

const v0_prompt_faq = `
Create an elegant FAQ section with accordion functionality.

HEADING:
"よくあるご質問"
Subheading: "不安なこと、気になることにお答えします。"

4 CATEGORIES WITH Q&As:

Category 1: サービスについて
Q1: "どんなサービスなんですか？"
A1: "完全予約制・女性専用のプライベートリラクゼーションサービスです。事前カウンセリングであなたの状態を理解し、最適なセラピストをご提案。心と体、両方を癒します。無店舗型性風俗特殊営業として届出済みです。"

Q2: "本当に効果がありますか？"
A2: "はい。ちゃんとした技術を持ったセラピストが担当します。肩こり、腰痛、疲労など、体の不調も実際に楽になります。心のケアと体のケア、両方を大切にしています。"

Q3: "どんな人が利用していますか？"
A3: "30〜40代の働く女性の方が中心です。仕事のストレス、家庭での役割、パートナーとの関係など、様々な悩みを抱えた方がいらっしゃいます。"

Category 2: プライバシーと安全性
Q1: "誰かにバレたりしませんか？"
A1: "完全プライベートな環境で、秘密は厳守します。事前カウンセリングも匿名で利用可能。個人情報は最小限のみ収集し、厳重に管理しています。"

Q2: "初めてで不安なんですが..."
A2: "大丈夫です。みなさん最初は同じように不安を感じられます。事前カウンセリングで事前にお話を伺い、あなたの不安を解消します。当日も、あなたのペースで進めますのでご安心ください。"

Q3: "無理やりとか、ないですよね？"
A3: "絶対にありません。全てあなたのペースと意思を尊重します。『待って』と言っていただければ、いつでも止まります。安心してご利用ください。"

Category 3: 料金と予約
Q1: "料金はいくらですか？"
A1: "コースや時間により異なります。予約フォームに詳細がございますが、初回の方には30分のカウンセリングを含む特別プランをご用意しています。"

Q2: "予約方法は？"
A2: "①事前カウンセリングで相談 → ②セラピスト選択 → ③日時選択 → ④予約完了、の流れです。所要時間は合計で10〜15分程度です。"

Q3: "キャンセルできますか？"
A3: "はい、可能です。ただし、当日キャンセルの場合はキャンセル料が発生する場合がございます。"

Category 4: 事前カウンセリングについて
Q1: "事前カウンセリングって何ですか？"
A1: "予約前に、AIがあなたの話を聞き、気持ちに寄り添います。どんな悩みを抱えているか、どんなケアが必要か、どんなセラピストが合うか...AIが理解し、最適な提案をします。"

Q2: "話した内容は誰かに見られますか？"
A2: "あなたが同意した場合のみ、担当セラピストに要約が共有されます。それ以外の第三者に見られることは一切ありません。"

Q3: "AIに話すだけで終わってもいいですか？"
A3: "もちろんです。予約は強制ではありません。『誰かに話を聞いてほしい』だけでも、いつでもどうぞ。"

DESIGN:
- Accordion with smooth expand/collapse
- Plus/minus icons
- Glassmorphism cards
- Category headers in gold
- Hover states
- Mobile responsive

CTA at bottom: "他にご不明な点があれば、AIにご相談ください"

Use Next.js 14, TypeScript, Tailwind CSS, Lucide React (ChevronDown icon).
`;

// ============================================================================
// 使用方法のガイド
// ============================================================================

const usage_guide = `
V0.DEV 使用ガイド

1. フルページ生成（推奨しない - 長すぎる可能性）
   → v0_prompt_full を使用

2. セクション別生成（推奨）
   → 各プロンプト（hero, features, testimonials, faq）を順番に生成
   → 生成されたコードを統合

3. 生成後の調整
   - 色をカスタマイズ（tailwind.config.tsで定義）
   - 画像パスを実際のものに変更
   - リンクを実際のルートに変更
   - アニメーションを追加/調整

4. 統合方法
   各セクションを別々のコンポーネントとして生成し、
   src/app/page.tsx で組み合わせる：

   import Hero from '@/components/landing/Hero'
   import Features from '@/components/landing/Features'
   // ...

   export default function Home() {
     return (
       <>
         <Hero />
         <Features />
         <Testimonials />
         <FAQ />
         // ...
       </>
     )
   }
`;

export {
  v0_prompt_full,
  v0_prompt_hero,
  v0_prompt_features,
  v0_prompt_testimonials,
  v0_prompt_faq,
  usage_guide
};
