import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <section id="hero-section" className="mx-auto max-w-6xl px-4 py-20">
        <p className="badge">初月無料トライアル</p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-main md:text-5xl">
          はじめてのHP制作を、
          <br />
          わかりやすい月額料金で。
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-subtext">
          個人事業主・スモールビジネス向けに、必要な機能だけをON/OFFできるトッピング型サブスク。
          制作会社に依頼せず、自分で運用できるノーコードHP作成サービスです。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-lg bg-main px-5 py-3 font-semibold text-white">新規登録する</Link>
          <Link href="/templates" className="rounded-lg border border-main/40 px-5 py-3 font-semibold text-main">テンプレートを見る</Link>
        </div>
      </section>

      <section id="pricing-section" className="mx-auto grid max-w-6xl gap-5 px-4 pb-8 md:grid-cols-3">
        <article className="card p-5">
          <h2 className="font-heading text-xl font-bold">ベースプラン</h2>
          <p className="mt-2 text-subtext">1ページHP / サブドメイン公開 / 基本エディタ</p>
          <p className="mt-4 text-3xl font-extrabold text-main">¥1,480<span className="text-base text-subtext">/月</span></p>
        </article>
        <article className="card p-5 md:col-span-2">
          <h2 className="font-heading text-xl font-bold">トッピングで拡張</h2>
          <ul className="mt-3 space-y-2 text-subtext">
            <li>・問い合わせフォーム + 自動返信: ¥800/月</li>
            <li>・ブログ/お知らせ: ¥500/月</li>
            <li>・独自ドメイン接続: ¥500/月</li>
            <li>・必要なものだけONにして、いつでも切り替え可能</li>
          </ul>
        </article>
      </section>

      <section id="legal-placeholder" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-5 text-sm text-subtext">
          <p>利用規約 / プライバシーポリシー / 特定商取引法に基づく表記（プレースホルダー）</p>
          <p className="mt-2">※正式文面は後から差し替え予定</p>
        </div>
      </section>
    </main>
  )
}
