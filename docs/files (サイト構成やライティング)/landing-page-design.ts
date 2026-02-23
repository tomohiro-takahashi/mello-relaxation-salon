/**
 * ランディングページ 完全設計書
 * 
 * 目的: 30〜40代女性に「安心して相談できる場所」という印象を与え、
 *      AIチャットへ自然に誘導する
 */

// ============================================================================
// 1. ページ構造（セクション一覧）
// ============================================================================

const landingPageStructure = {
  sections: [
    "1. Hero（ヒーローセクション）",
    "2. Trust Signals（信頼の証）",
    "3. Features（3つの特徴）",
    "4. How It Works（ご利用の流れ）",
    "5. Social Proof（利用者の声）",
    "6. Therapists Preview（セラピスト紹介）",
    "7. FAQ（よくある質問）",
    "8. Final CTA（最後の一押し）",
    "9. Footer（フッター）"
  ]
};

// ============================================================================
// 2. セクション別コピーライティング
// ============================================================================

// ----------------------------------------------------------------------------
// Section 1: Hero（ヒーローセクション）
// ----------------------------------------------------------------------------

const heroSection = {
  layout: "Full screen, centered",
  background: "Dark navy with subtle gradient, elegant abstract pattern",
  
  copy: {
    preheading: "完全予約制・女性専用",
    
    mainHeading: {
      line1: "あなただけの、",
      line2: "プライベートな癒しを。",
      style: "Large serif font, elegant spacing"
    },
    
    subheading: "忙しい毎日に疲れていませんか？\n誰かに話を聞いてほしい。大切に扱われたい。\nそんなあなたのための、特別な時間。",
    
    cta: {
      primary: {
        text: "まずは相談してみる",
        action: "→ /chat",
        style: "Large, gold button with glow effect"
      },
      secondary: {
        text: "詳しく見る",
        action: "→ scroll to features",
        style: "Outline button"
      },
      tertiary: {
        text: "セラピストを見る",
        action: "→ /therapists",
        style: "Text link with arrow"
      }
    }
  },
  
  designNotes: [
    "背景: ダークネイビー（#0A0E14）のグラデーション",
    "タイポグラフィ: Playfair Display for heading, Inter for body",
    "アニメーション: Fade in on load, subtle parallax on scroll",
    "モバイル: Stack vertically, maintain readability"
  ]
};

// ----------------------------------------------------------------------------
// Section 2: Trust Signals（信頼の証）
// ----------------------------------------------------------------------------

const trustSignalsSection = {
  layout: "Horizontal badges, centered",
  
  badges: [
    {
      icon: "Shield Check",
      text: "無店舗型性風俗特殊営業\n届出済み"
    },
    {
      icon: "Lock",
      text: "完全プライベート\n秘密厳守"
    },
    {
      icon: "Users",
      text: "女性専用\n安心の環境"
    },
    {
      icon: "Calendar",
      text: "完全予約制\n待ち時間なし"
    }
  ],
  
  designNotes: [
    "小さく控えめに表示",
    "アイコン + テキストのシンプルなバッジ",
    "背景は半透明のカード"
  ]
};

// ----------------------------------------------------------------------------
// Section 3: Features（3つの特徴）
// ----------------------------------------------------------------------------

const featuresSection = {
  heading: "Sereneが選ばれる、3つの理由",
  subheading: "あなたの心と体、両方を大切にします。",
  
  features: [
    {
      number: "01",
      title: "事前カウンセリング",
      subtitle: "まず、あなたの話を聞かせてください",
      description: "予約前に、カウンセラーがあなたの気持ちに寄り添います。どんな悩みも、ここでなら安心して話せます。その上で、あなたに最適なセラピストをご提案。",
      icon: "MessageCircle",
      image: "chat-interface-preview.jpg",
      benefits: [
        "24時間いつでも相談可能",
        "誰にも知られず、安心して話せる",
        "あなたの状態に合わせたマッチング"
      ]
    },
    {
      number: "02",
      title: "本物のリラクゼーション",
      subtitle: "心だけじゃなく、体も癒される",
      description: "ちゃんとした技術を持ったセラピストが、あなたの心と体、両方をケア。肩こり、腰痛、疲労…本当に楽になります。",
      icon: "Sparkles",
      image: "relaxation-image.jpg",
      benefits: [
        "熟練セラピストによる施術",
        "あなたの希望に合わせた柔軟な対応",
        "リラクゼーションマッサージから親密なケアまで"
      ]
    },
    {
      number: "03",
      title: "パーソナライズされた寄り添い",
      subtitle: "初めてでも、安心",
      description: "専任のカウンセラーが事前にあなたのことを理解。担当セラピストにも共有されるので、初対面でも「分かってもらえてる」安心感。あなたのペースで、大丈夫。",
      icon: "Heart",
      image: "therapist-caring.jpg",
      benefits: [
        "事前カウンセリングで不安を解消",
        "あなたの好みに合わせた接し方",
        "無理のない、安心できる時間"
      ]
    }
  ],
  
  cta: {
    text: "事前カウンセリングを始める",
    subtext: "まずは気軽に、お話ししてみませんか？",
    action: "→ /chat"
  },
  
  designNotes: [
    "各featureは大きなカードで表示",
    "左右交互のレイアウト（画像とテキスト）",
    "スクロールでフェードイン",
    "Hover時に微かな拡大"
  ]
};

// ----------------------------------------------------------------------------
// Section 4: How It Works（ご利用の流れ）
// ----------------------------------------------------------------------------

const howItWorksSection = {
  heading: "ご利用の流れ",
  subheading: "たった3ステップで、あなただけの時間が始まります。",
  
  steps: [
    {
      step: "Step 1",
      title: "AIに相談する",
      description: "まずは、今の気持ちをAIに話してみてください。どんなことでも大丈夫。あなたのペースで、ゆっくりと。",
      duration: "5〜15分",
      icon: "MessageSquare",
      action: "無料・匿名で今すぐ"
    },
    {
      step: "Step 2",
      title: "セラピストを選ぶ",
      description: "AIがあなたに合ったセラピストをご提案。プロフィールを見て、「この人なら」と思える方を選んでください。",
      duration: "3〜5分",
      icon: "Users",
      action: "マッチ度で選べる"
    },
    {
      step: "Step 3",
      title: "予約して、癒される",
      description: "日時を選んで予約完了。当日は、あなたのことを理解したセラピストが、心を込めてお迎えします。",
      duration: "90〜180分",
      icon: "Calendar",
      action: "初回特典あり"
    }
  ],
  
  note: {
    heading: "初回限定特典",
    text: "初めての方には、30分のカウンセリング時間を含む特別プランをご用意しています。",
    highlight: "通常90分 → 120分（同料金）"
  },
  
  cta: {
    text: "今すぐ始める",
    action: "→ /chat"
  }
};

// ----------------------------------------------------------------------------
// Section 5: Social Proof（利用者の声）
// ----------------------------------------------------------------------------

const socialProofSection = {
  heading: "ご利用いただいた方の声",
  subheading: "みなさん、最初は同じように迷われていました。",
  
  testimonials: [
    {
      quote: "最初は『こういうの利用するなんて...』って罪悪感があったけど、AIに話を聞いてもらって、『自分を大切にしていいんだ』って思えました。実際に会ったセラピストの方も優しくて、本当に来てよかった。",
      author: "K.M.さん（37歳・会社員）",
      situation: "仕事と育児の両立に疲れて",
      avatar: "avatar-1.jpg"
    },
    {
      quote: "夫との関係に悩んでて、誰にも相談できなくて...。でもここでは全部話せた。セラピストさんが『大変でしたね』って言ってくれた時、涙が出ました。体も心も、すごく軽くなった。",
      author: "A.T.さん（42歳・専業主婦）",
      situation: "パートナーとの距離感に孤独を感じて",
      avatar: "avatar-2.jpg"
    },
    {
      quote: "『マッサージ』って言うけど、本当に技術がちゃんとしてる。肩こりが嘘みたいに楽になって驚きました。それに、話もちゃんと聞いてくれる。ただのリラクゼーションじゃない、『寄り添い』がある。",
      author: "R.S.さん（34歳・管理職）",
      situation: "慢性的な肩こりとストレスで",
      avatar: "avatar-3.jpg"
    }
  ],
  
  stats: {
    heading: "ご利用者データ",
    items: [
      {
        number: "92%",
        label: "の方が\n「また来たい」"
      },
      {
        number: "30-40代",
        label: "女性の利用が\n増加中"
      },
      {
        number: "平均4.8",
        label: "満足度\n（5点満点）"
      }
    ]
  },
  
  designNotes: [
    "カード形式で横スクロール（モバイル）",
    "グリッド表示（デスクトップ）",
    "引用符のアイコン",
    "星評価の表示"
  ]
};

// ----------------------------------------------------------------------------
// Section 6: Therapists Preview（セラピスト紹介）
// ----------------------------------------------------------------------------

const therapistsPreviewSection = {
  heading: "担当するセラピスト",
  subheading: "経験豊富で、心優しいプロフェッショナルたち。",
  
  therapists: [
    {
      name: "Aoi",
      tagline: "静かで落ち着いた、寄り添い型",
      specialties: ["Deep Relaxation", "Emotional Care", "Silent Treatment"],
      bio: "お客様のペースを何より大切にします。ゆっくり、静かに、あなたの疲れを癒します。",
      image: "aoi.jpg",
      experience: "5年",
      matchRate: "あなたとのマッチ度: 計算中...",
      note: "事前カウンセリング後に表示"
    },
    {
      name: "Yuki",
      tagline: "会話を楽しみながら、心を軽く",
      specialties: ["Conversational", "Empathetic", "Gentle Touch"],
      bio: "お話しながら、少しずつ心を開いていただけたら嬉しいです。笑顔でお迎えします。",
      image: "yuki.jpg",
      experience: "3年",
      matchRate: "計算中...",
      note: "事前カウンセリング後に表示"
    },
    {
      name: "Saki",
      tagline: "リードしながら、包み込むケア",
      specialties: ["Leadership", "Deep Tissue", "Intuitive"],
      bio: "お任せいただければ、全てお預かりします。あなたは何も考えず、ただ委ねてください。",
      image: "saki.jpg",
      experience: "7年",
      matchRate: "計算中...",
      note: "事前カウンセリング後に表示"
    }
  ],
  
  cta: {
    text: "全てのセラピストを見る",
    subtext: "事前カウンセリングで、あなたに合った方をご提案します",
    action: "→ /therapists"
  },
  
  designNotes: [
    "プロフィール写真は品位を保つ（露骨な写真は避ける）",
    "特技タグはバッジで表示",
    "Hover時に詳細情報を表示",
    "『マッチ度』は薄くグレーアウト（AIチャット後に有効化）"
  ]
};

// ----------------------------------------------------------------------------
// Section 7: FAQ（よくある質問）
// ----------------------------------------------------------------------------

const faqSection = {
  heading: "よくあるご質問",
  subheading: "不安なこと、気になることにお答えします。",
  
  faqs: [
    {
      category: "サービスについて",
      questions: [
        {
          q: "どんなサービスなんですか？",
          a: "完全予約制・女性専用のプライベートリラクゼーションサービスです。事前カウンセリングであなたの状態を理解し、最適なセラピストをご提案。心と体、両方を癒します。無店舗型性風俗特殊営業として届出済みです。"
        },
        {
          q: "本当に効果がありますか？",
          a: "はい。ちゃんとした技術を持ったセラピストが担当します。肩こり、腰痛、疲労など、体の不調も実際に楽になります。心のケアと体のケア、両方を大切にしています。"
        },
        {
          q: "どんな人が利用していますか？",
          a: "30〜40代の働く女性の方が中心です。仕事のストレス、家庭での役割、パートナーとの関係など、様々な悩みを抱えた方がいらっしゃいます。『自分を労わりたい』『誰かに話を聞いてほしい』という気持ちは、みなさん同じです。"
        }
      ]
    },
    {
      category: "プライバシーと安全性",
      questions: [
        {
          q: "誰かにバレたりしませんか？",
          a: "完全プライベートな環境で、秘密は厳守します。事前カウンセリングも匿名で利用可能。個人情報は最小限のみ収集し、厳重に管理しています。"
        },
        {
          q: "初めてで不安なんですが...",
          a: "大丈夫です。みなさん最初は同じように不安を感じられます。事前カウンセリングで事前にお話を伺い、あなたの不安を解消します。当日も、あなたのペースで進めますのでご安心ください。"
        },
        {
          q: "無理やりとか、ないですよね？",
          a: "絶対にありません。全てあなたのペースと意思を尊重します。『待って』と言っていただければ、いつでも止まります。安心してご利用ください。"
        }
      ]
    },
    {
      category: "料金と予約",
      questions: [
        {
          q: "料金はいくらですか？",
          a: "コースや時間により異なります。予約フォームに詳細がございますが、初回の方には30分のカウンセリングを含む特別プランをご用意しています（通常90分→120分、同料金）。"
        },
        {
          q: "予約方法は？",
          a: "①事前カウンセリングで相談 → ②セラピスト選択 → ③日時選択 → ④予約完了、の流れです。所要時間は合計で10〜15分程度です。"
        },
        {
          q: "キャンセルできますか？",
          a: "はい、可能です。ただし、当日キャンセルの場合はキャンセル料が発生する場合がございます。詳しくは予約時にご確認ください。"
        }
      ]
    },
    {
      category: "事前カウンセリングについて",
      questions: [
        {
          q: "事前カウンセリングって何ですか？",
          a: "予約前に、カウンセラーがあなたの想いに寄り添い、お話を伺います。どんな悩みを抱えているか、どんなケアが必要か、どんなセラピストが合うか...カウンセラーが理解し、最適な提案をします。もちろん無料です。"
        },
        {
          q: "話した内容は誰かに見られますか？",
          a: "あなたが同意した場合のみ、担当セラピストに要約が共有されます（個人を特定する情報は含まれません）。それ以外の第三者に見られることは一切ありません。"
        },
        {
          q: "AIに話すだけで終わってもいいですか？",
          a: "もちろんです。予約は強制ではありません。『誰かに話を聞いてほしい』だけでも、いつでもどうぞ。"
        }
      ]
    }
  ],
  
  cta: {
    text: "他にご不明な点があれば、カウンセラーにご相談ください",
    action: "→ /chat"
  }
};

// ----------------------------------------------------------------------------
// Section 8: Final CTA（最後の一押し）
// ----------------------------------------------------------------------------

const finalCTASection = {
  layout: "Full width, centered, with background image",
  background: "Elegant abstract pattern, semi-transparent overlay",
  
  copy: {
    heading: "あなたは、十分頑張っています。",
    subheading: "たまには、自分を労わってもいいんです。\nここは、あなたのための場所。",
    
    cta: {
      primary: {
        text: "事前カウンセリングを始める",
        subtext: "無料・匿名・24時間いつでも",
        action: "→ /chat",
        style: "Large gold button with glow"
      },
      secondary: {
        text: "セラピストを見てみる",
        action: "→ /therapists",
        style: "Text link"
      }
    }
  },
  
  trustBadge: {
    text: "安心してご利用いただけます",
    items: [
      "届出済み営業",
      "秘密厳守",
      "女性専用",
      "完全予約制"
    ]
  }
};

// ----------------------------------------------------------------------------
// Section 9: Footer（フッター）
// ----------------------------------------------------------------------------

const footerSection = {
  layout: "Multi-column",
  
  columns: [
    {
      title: "Serene",
      content: {
        tagline: "あなただけの、プライベートな癒しを。",
        social: null // SNSリンクは任意
      }
    },
    {
      title: "サービス",
      links: [
        { text: "事前カウンセリング", href: "/chat" },
        { text: "セラピスト一覧", href: "/therapists" },
        { text: "予約", href: "/booking" },
        { text: "サービス詳細", href: "/about" }
      ]
    },
    {
      title: "安全性",
      links: [
        { text: "届出情報", href: "/safety" },
        { text: "プライバシーポリシー", href: "/policy/privacy" },
        { text: "利用規約", href: "/policy/terms" },
        { text: "特定商取引法", href: "/policy/commercial" }
      ]
    },
    {
      title: "ヘルプ",
      links: [
        { text: "よくある質問", href: "/#faq" },
        { text: "お問い合わせ", href: "/contact" }
      ]
    }
  ],
  
  bottom: {
    copyright: "© 2026 Serene. All rights reserved.",
    legal: "無店舗型性風俗特殊営業 届出済み"
  }
};

// ============================================================================
// 3. デザインシステム
// ============================================================================

const designSystem = {
  colors: {
    primary: "#C5A059",        // Muted Gold
    primaryDark: "#A68848",
    background: "#0A0E14",     // Deep Navy
    backgroundLight: "#1A1E24",
    surface: "#2A2E34",
    surfaceLight: "#3A3E44",
    text: "#F5F5F7",           // Soft Cream
    textMuted: "#A0A0A8"
  },
  
  typography: {
    headings: "Playfair Display, serif",
    body: "Inter, system-ui, sans-serif",
    sizes: {
      h1: "clamp(2.5rem, 5vw, 4rem)",
      h2: "clamp(2rem, 4vw, 3rem)",
      h3: "clamp(1.5rem, 3vw, 2rem)",
      body: "1rem",
      small: "0.875rem"
    }
  },
  
  spacing: {
    section: "clamp(4rem, 10vw, 8rem)",
    element: "clamp(1rem, 3vw, 2rem)"
  },
  
  effects: {
    glassmorphism: {
      background: "rgba(42, 46, 52, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(197, 160, 89, 0.1)"
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)"
    }
  }
};

// ============================================================================
// 4. レスポンシブ対応
// ============================================================================

const responsiveGuidelines = {
  mobile: {
    breakpoint: "< 768px",
    changes: [
      "Single column layout",
      "Stack CTA buttons vertically",
      "Reduce heading sizes",
      "Horizontal scroll for testimonials",
      "Simplified navigation (hamburger menu)"
    ]
  },
  tablet: {
    breakpoint: "768px - 1024px",
    changes: [
      "2-column grid for features",
      "Maintain most desktop styles",
      "Adjust spacing"
    ]
  },
  desktop: {
    breakpoint: "> 1024px",
    changes: [
      "3-column grid where applicable",
      "Full layouts",
      "Maximum content width: 1280px"
    ]
  }
};

export {
  landingPageStructure,
  heroSection,
  trustSignalsSection,
  featuresSection,
  howItWorksSection,
  socialProofSection,
  therapistsPreviewSection,
  faqSection,
  finalCTASection,
  footerSection,
  designSystem,
  responsiveGuidelines
};
