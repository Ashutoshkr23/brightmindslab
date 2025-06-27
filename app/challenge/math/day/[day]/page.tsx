'use client';

import { use } from 'react';
import Link from 'next/link';
import { getNotesForDay } from '@/lib/mathNotes';

export default function MathChallengePage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  // Unwrap the day param
  const { day }    = use(params);
  const dayNumber  = parseInt(day, 10);

  const notes = getNotesForDay(dayNumber);

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Day {dayNumber} Challenge
        </h1>
        <p className="text-lg text-gray-300">
          Let’s master some mental math today! Complete all 4 tasks below 👇
        </p>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {Array.from({ length: 4 }).map((_, index) => {
          const taskNumber = index + 1;
          const taskTitle  = notes[index]?.title || `Task ${taskNumber}`;

          return (
            <div
              key={taskNumber}
              className="bg-dark border border-gray-700 rounded-xl p-6 shadow hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-white mb-1">
                Task {taskNumber}
              </h2>
              <p className="text-sm text-gray-400 mb-4">{taskTitle}</p>

              <div className="flex flex-col gap-4">
                <Link href={`/challenge/math/day/${dayNumber}/task/${taskNumber}`}>
                  <button className="bg-success text-dark px-4 py-2 rounded-lg hover:opacity-90 transition w-full">
                    🚀 Start Practice
                  </button>
                </Link>

                <Link href={`/challenge/math/day/${dayNumber}/revise/${taskNumber}`}>
                  <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition w-full">
                    📚 Revise Concept
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🚩 Compete Button */}
      <div className="w-full max-w-4xl mt-10 flex justify-center">
        <Link href={`/challenge/math/day/${dayNumber}/compete`}>
          <button className="bg-primary text-dark px-8 py-3 rounded-2xl text-lg hover:bg-primary/90 transition">
            🚩 Compete: 100 Questions
          </button>
        </Link>
      </div>
    </main>
  );
}
