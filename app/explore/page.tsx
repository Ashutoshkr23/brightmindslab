// app/explore/page.js
import Link from 'next/link';

export default function Explore() {
  return (
    <main className="min-h-screen bg-gray-90 px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Explore</h1>

      <div className="flex flex-col gap-4">
        
        {/* Notes Section */}
        <Link href="/explore/notes">
          <div className="bg-gray p-4 shadow rounded-xl flex items-center space-x-4 hover:bg-indigo-50 transition">
            <div className="text-2xl">📝</div>
            <div>
              <h2 className="text-lg font-semibold">Notes</h2>
              <p className="text-sm text-gray-500">Swipeable interactive notes.</p>
            </div>
          </div>
        </Link>

        {/* Word Meanings Section */}
        <Link href="/explore/words">
          <div className="bg-gray p-4 shadow rounded-xl flex items-center space-x-4 hover:bg-indigo-50 transition">
            <div className="text-2xl">📚</div>
            <div>
              <h2 className="text-lg font-semibold">Word Meanings</h2>
              <p className="text-sm text-gray-500">Chapter-wise vocabulary.</p>
            </div>
          </div>
        </Link>

        {/* Tests Section */}
        <Link href="/explore/tests">
          <div className="bg-gray p-4 shadow rounded-xl flex items-center space-x-4 hover:bg-indigo-50 transition">
            <div className="text-2xl">🧩</div>
            <div>
              <h2 className="text-lg font-semibold">Tests & Quizzes</h2>
              <p className="text-sm text-gray-500">Swipe to test knowledge.</p>
            </div>
          </div>
        </Link>

        {/* Shorts Section */}
        <Link href="/explore/shorts">
          <div className="bg-gray p-4 shadow rounded-xl flex items-center space-x-4 hover:bg-indigo-50 transition">
            <div className="text-2xl">🎬</div>
            <div>
              <h2 className="text-lg font-semibold">Shorts Videos</h2>
              <p className="text-sm text-gray-500">Quick topic explanations.</p>
            </div>
          </div>
        </Link>

      </div>
    </main>
  );
}
