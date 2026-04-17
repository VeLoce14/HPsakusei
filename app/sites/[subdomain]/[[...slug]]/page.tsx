type Props = {
  params: Promise<{ subdomain: string; slug?: string[] }>
}

export default async function PublicSitePage({ params }: Props) {
  const { subdomain, slug } = await params
  const path = slug?.length ? `/${slug.join('/')}` : '/'

  return (
    <main className="min-h-screen bg-bg px-4 py-12">
      <section className="mx-auto max-w-4xl card p-6">
        <p className="badge">公開ページ（MVPモック）</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-main">{subdomain}.example.com</h1>
        <p className="mt-2 text-subtext">表示パス: {path}</p>

        <article className="mt-6 rounded-lg bg-white p-5">
          <h2 className="text-2xl font-bold">地域に愛される、やさしいサロン</h2>
          <p className="mt-2 text-subtext">このページは /sites/[subdomain] 配下の公開ルーティングを確認するためのモックです。</p>
          <button className="mt-4 rounded-lg bg-main px-4 py-2 font-semibold text-white">お問い合わせ</button>
        </article>
      </section>
    </main>
  )
}
