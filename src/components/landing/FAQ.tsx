'use client';

import { ChevronDown, Flower2, ShieldCheck, CreditCard, MessageCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqCategories = [
  {
    id: "about",
    title: "サービスについて",
    icon: <Flower2 className="text-primary" size={24} />,
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
    id: "privacy",
    title: "プライバシーと安全性",
    icon: <ShieldCheck className="text-primary" size={24} />,
    questions: [
      {
        q: "誰かにバレたりしませんか？",
        a: "完全プライベートな環境で、秘密は厳守します。事前カウンセリングも匿名で利用可能。個人情報は最小限のみ収集し、厳重に管理しています。"
      },
      {
        q: "初めてで不安なんですが...",
        a: "大丈夫です。みなさん最初は同じように不安を感じられます。事前カウンセリングでお話を伺い、あなたの不安を解消します。当日も、あなたのペースで進めますのでご安心ください。"
      },
      {
        q: "無理やりとか、ないですよね？",
        a: "絶対にありません。全てあなたのペースと意思を尊重します。『待って』と言っていただければ、いつでも止まります。安心してご利用ください。"
      }
    ]
  },
  {
    id: "booking",
    title: "料金と予約",
    icon: <CreditCard className="text-primary" size={24} />,
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
    id: "counseling",
    title: "事前カウンセリングについて",
    icon: <MessageCircle className="text-primary" size={24} />,
    questions: [
      {
        q: "事前カウンセリングって何ですか？",
        a: "予約前に、専任のカウンセラーがあなたの想いに寄り添い、お話を伺います。どんな悩みを抱えているか、どんなケアが必要か、どんなセラピストが合うか...カウンセラーが理解し、最適な提案をします。もちろん無料です。"
      },
      {
        q: "話した内容は誰かに見られますか？",
        a: "あなたが同意した場合のみ、担当セラピストに要約が共有されます（個人を特定する情報は含まれません）。それ以外の第三者に見られることは一切ありません。"
      },
      {
        q: "カウンセラーに相談するだけで終わってもいいですか？",
        a: "もちろんです。予約は強制ではありません。『誰かに話を聞いてほしい』だけでも、いつでもどうぞ。"
      }
    ]
  }
];

function AccordionItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void 
}) {
  return (
    <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden mb-3">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-white/5"
      >
        <span className="text-text-cream text-sm md:text-base font-medium leading-normal">
          {question}
        </span>
        <ChevronDown 
          className={`text-primary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 pt-1">
              <p className="text-text-muted text-sm md:text-base font-normal leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>("about-0");

  const toggleItem = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section id="faq" className="px-6 pt-1 pb-16 md:py-24 bg-background-dark overflow-hidden">
      <div className="max-w-4xl mx-auto mb-12 md:mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-text-cream text-4xl md:text-5xl font-serif font-bold leading-tight mb-6"
        >
          よくあるご質問
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-muted text-base md:text-xl font-normal leading-relaxed max-w-[320px] md:max-w-md mx-auto"
        >
          安心してご利用いただくために、<br className="md:hidden" />よくある疑問にお答えします。
        </motion.p>
      </div>

      <div className="flex flex-col max-w-3xl mx-auto gap-12 pb-2 md:pb-20">
        {faqCategories.map((category) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6 px-2">
              {category.icon}
              <h3 className="text-primary text-xl md:text-2xl font-serif font-bold tracking-tight">
                {category.title}
              </h3>
            </div>
            <div className="flex flex-col">
              {category.questions.map((item, i) => (
                <AccordionItem 
                  key={`${category.id}-${i}`}
                  question={item.q}
                  answer={item.a}
                  isOpen={openIndex === `${category.id}-${i}`}
                  onClick={() => toggleItem(`${category.id}-${i}`)}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 md:mt-12 flex flex-col items-center text-center"
        >
          <div className="w-16 h-px bg-primary/30 mb-8"></div>
          <p className="text-text-cream/80 text-sm md:text-base mb-8 leading-relaxed">
            他にご不明な点があれば、<br />お気軽にご相談ください
          </p>
          <button className="bg-primary text-background-dark font-bold py-5 px-10 rounded-full flex items-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all">
            <Mail size={20} />
            <span>お問い合わせはこちら</span>
          </button>
        </motion.div>
      </div>

      {/* Background Decoration Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[50%] h-[30%] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </section>
  );
}
