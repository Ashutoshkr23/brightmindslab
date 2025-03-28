// app/explore/page.js
import Link from 'next/link';

export default function Explore() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Explore Content</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Notes Section */}
        <Link href="/explore/notes">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md cursor-pointer transition">
            <h2 className="text-xl font-semibold">📝 Notes</h2>
            <p className="text-gray-600">Interactive swipeable notes.</p>
          </div>
        </Link>

        {/* Word Meaning Section */}
        <Link href="/explore/words">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md cursor-pointer transition">
            <h2 className="text-xl font-semibold">📚 Word Meanings</h2>
            <p className="text-gray-600">Learn meanings chapter-wise.</p>
          </div>
        </Link>

        {/* Tests Section */}
        <Link href="/explore/tests">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md cursor-pointer transition">
            <h2 className="text-xl font-semibold">🧩 Tests & Quizzes</h2>
            <p className="text-gray-600">Swipe to test your knowledge.</p>
          </div>
        </Link>

        {/* Shorts Section */}
        <Link href="/explore/shorts">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md cursor-pointer transition">
            <h2 className="text-xl font-semibold">🎬 Shorts Videos</h2>
            <p className="text-gray-600">Quick video explanations.</p>
          </div>
        </Link>

      </div>
    </main>
  );
}
