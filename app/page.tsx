

import Head from "next/head";

export default function Home() {
  return (
    <>
      {/* PWA Meta & Manifest */}
      <Head>
        <title>Bright Minds Lab</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main>
          <h1>Bright Minds Lab testing</h1>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <p>© {new Date().getFullYear()} Bright Minds Lab</p>
        </footer>
      </div>
    </>
  );
}

