'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MathDayClient({ day }: { day: string }) {
  const router = useRouter();
  const dayNumber = parseInt(day);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const savedDay = localStorage.getItem('math-day');
    const progress = savedDay ? parseInt(savedDay) : 1;
    setCurrentDay(progress);
    console.log(currentDay)

    if (dayNumber > progress) {
      alert('🚫 This day is not unlocked yet!');
      router.push('/dashboard');
    }
  }, [dayNumber, router, currentDay]);

  const taskButtons = Array.from({ length: 4 }).map((_, i) => {
    const taskNum = i + 1;
    return (
      <div
        key={taskNum}
        className="bg-dark border border-gray-600 rounded-xl px-6 py-4 shadow transition text-center space-y-4"
      >
        <h2 className="text-xl text-light font-semibold">Task {taskNum}</h2>
        <div className="flex justify-center gap-4">
          <Link href={`/challenge/math/day/${dayNumber}/task/${taskNum}/revise`}>
            <button className="bg-secondary text-white px-4 py-2 rounded-xl hover:bg-secondary/80 transition">
              📘 Revise
            </button>
          </Link>
          <Link href={`/challenge/math/day/${dayNumber}/task/${taskNum}/practice`}>
            <button className="bg-primary text-dark px-4 py-2 rounded-xl hover:bg-primary/90 transition">
              🧠 Practice
            </button>
          </Link>
        </div>
      </div>
    );
  });

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Day {dayNumber} Challenge
      </h1>
      <div className="max-w-3xl mx-auto space-y-6">{taskButtons}</div>
    </main>
  );
}