'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function EnglishDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const router = useRouter();
  const { day } = use(params);
  const dayNumber = parseInt(day);

  const handleStart = (task: number) => {
    router.push(`/challenge/rules/day/${dayNumber}/task/${task}`);
  };

  const handleRevise = (task: number) => {
    router.push(`/challenge/rules/day/${dayNumber}/revise/${task}`);
  };

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Day {dayNumber} - English Challenge
        </h1>
        <p className="text-lg text-gray-300">
          2 grammar rules today. Select a task to begin 👇
        </p>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {[1, 2].map((task) => (
          <div
            key={task}
            className="bg-dark border border-gray-700 rounded-xl p-6 shadow hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Rule {task} of Day {dayNumber}
            </h2>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleStart(task)}
                className="bg-success text-dark px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                🚀 Start Practice
              </button>

              <button
                onClick={() => handleRevise(task)}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                📚 Revise Concept
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
