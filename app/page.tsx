// pages/index.js
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Brightminds Home</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#FAF3E0] flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">🎓 Brightminds</h1>
        <p className="text-gray-700 mb-6 text-center">Learn smart. Practice better.</p>

        <div className="mb-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow">
            🚀 Start Learning
          </button>
        </div>

        <div className="mb-10">
          <button className="text-blue-700 underline hover:text-blue-900 font-medium">🔐 Sign In / Sign Up</button>
        </div>

        <div className="w-full max-w-md grid grid-cols-2 gap-4">
          <Link href="/notes">
            <div className="p-4 bg-white rounded-xl shadow-md text-gray-800 text-center hover:bg-blue-100 transition cursor-pointer">
              📝 Notes
            </div>
          </Link>

          <Link href="/quiz">
            <div className="p-4 bg-white rounded-xl shadow-md text-gray-800 text-center hover:bg-green-100 transition cursor-pointer">
              ❓ Quiz
            </div>
          </Link>

          <Link href="/shorts">
            <div className="p-4 bg-white rounded-xl shadow-md text-gray-800 text-center hover:bg-yellow-100 transition cursor-pointer">
              🎬 Shorts
            </div>
          </Link>

          <Link href="/word-meanings">
            <div className="p-4 bg-white rounded-xl shadow-md text-gray-800 text-center hover:bg-purple-100 transition cursor-pointer">
              📘 Word Meanings
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

