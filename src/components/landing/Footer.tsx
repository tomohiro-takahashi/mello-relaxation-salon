'use client';

import Link from 'next/link';

const footerLinks = [
  {
    title: "サービス",
    links: [
      { text: "事前カウンセリング", href: "/chat" },
      { text: "セラピスト一覧", href: "/therapists" },
      { text: "予約の流れ", href: "/#how-it-works" },
      { text: "運営について", href: "/about" }
    ]
  },
  {
    title: "安全性",
    links: [
      { text: "届出情報", href: "/safety" },
      { text: "プライバシーポリシー", href: "/policy/privacy" },
      { text: "利用規約", href: "/policy/terms" }
    ]
  },
  {
    title: "ヘルプ",
    links: [
      { text: "よくある質問", href: "/#faq" },
      { text: "お問い合わせ", href: "/contact" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-background-dark border-t border-white/5 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col gap-6">
              <div className="text-primary font-serif tracking-[0.2em] text-lg font-bold uppercase transition-colors hover:text-primary/80">
                楪（ゆずりは）
              </div>
              <p className="max-w-[240px] text-text-muted text-sm leading-relaxed">
                あなただけの、プライベートな癒しを。
              </p>
              <p className="max-w-[240px] text-text-muted text-sm leading-relaxed">
                無店舗型性風俗特殊営業 届出済み
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-1 md:col-span-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-text-cream font-bold text-sm mb-6 uppercase tracking-widest">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.text}>
                      <Link 
                        href={link.href}
                        className="text-text-muted hover:text-primary transition-colors text-sm"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-text-muted/40 text-[10px] tracking-[0.2em] uppercase order-2 md:order-1">
            © 2026 YUZURIHA WELLNESS GROUP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <span className="text-text-muted/60 text-[10px] uppercase font-bold tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
              営業許可 届出済み
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
