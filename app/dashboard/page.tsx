// app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const router = useRouter();

  // Dummy progress data — replace with Firebase fetch later
  const [mathDay, setMathDay] = useState(1); // current day
  const [englishDay, setEnglishDay] = useState(1); // current day

  const handleRestart = (type: 'math' | 'english') => {
    if (confirm(`Are you sure you want to restart the ${type} challenge?`)) {
      if (type === 'math') {
        setMathDay(1); // Reset logic — replace with Firebase update
        router.push('/challenge/math/day/1');
      } else {
        setEnglishDay(1);
        router.push('/challenge/english/day/1');
      }
    }
  };

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
        Welcome to QRE Mastery Dashboard
      </h1>

      <div className="grid gap-8 max-w-4xl mx-auto">
        {/* 🧮 Math Challenge */}
        <div className="bg-dark rounded-xl p-6 shadow-lg border border-primary space-y-4">
          <h2 className="text-2xl font-bold text-success">🧮 30-Day Mental Maths Mastery</h2>
          <p className="text-light text-lg">You’re on Day {mathDay} of 30</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link href={`/challenge/math/day/${mathDay}`}>
              <button className="bg-success text-dark px-4 py-2 rounded-xl hover:bg-opacity-90 transition">
                ▶️ Continue
              </button>
            </Link>

            <Link href="/challenge/math">
              <button className="bg-secondary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition">
                📅 View All Days
              </button>
            </Link>

            <button
              onClick={() => handleRestart('math')}
              className="bg-danger text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
            >
              🔁 Restart
            </button>
          </div>
        </div>

        {/* 📘 English Challenge */}
        <div className="bg-dark rounded-xl p-6 shadow-lg border border-secondary space-y-4">
          <h2 className="text-2xl font-bold text-primary">📘 60-Day | 120 Rules of English</h2>
          <p className="text-light text-lg">You’re on Day {englishDay} of 60</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link href={`/challenge/english/day/${englishDay}`}>
              <button className="bg-success text-dark px-4 py-2 rounded-xl hover:bg-opacity-90 transition">
                ▶️ Continue
              </button>
            </Link>

            <Link href="/challenge/english">
              <button className="bg-secondary text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition">
                📅 View All Days
              </button>
            </Link>

            <button
              onClick={() => handleRestart('english')}
              className="bg-danger text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
            >
              🔁 Restart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
