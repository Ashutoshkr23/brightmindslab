

import Head from "next/head";
import Link from "next/link";

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
      <main className="h-screen flex flex-col items-center justify-center bg-gray-90">
      {/* Hero Section */}
      <section className="text-center w-64 pt-40 py-12 px-4">
        {/* Logo */}
        <img
          src="/Hero.jpg"
          alt="Bright Minds Lab"
          className="w-64 h-40 mt-24 mx-auto mb-8"
        />
        
        <p className="text-gray-600 mb-8">
          Learn, revise, and excel with interactive swipe cards and quizzes.
        </p>
        
        {/* Login and Explore Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition">
            Login
          </button>
          <Link href="/explore">
  <button className="px-6 py-2 bg-white border border-indigo-500 text-indigo-500 rounded-full hover:bg-indigo-50 transition">
    Explore
  </button>
</Link>
        </div>
      </section>
    </main>
      </div>
    </>
  );
}

