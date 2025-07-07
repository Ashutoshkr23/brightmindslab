'use client';

import { use } from 'react';
import Link from 'next/link';
// 1. Import the main challenge configuration
import { challengeConfig } from '@/lib/dayGenerators';

export default function MathChallengePage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day }   = use(params);
  const dayNumber = parseInt(day, 10);

  // 2. Get the specific configuration for the current day
  const dayConfig = challengeConfig[dayNumber];
  
  // Handle case where no config exists for the day
  if (!dayConfig) {
    return (
      <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Challenge Not Found
        </h1>
        <p className="text-lg text-gray-300">
          Sorry, we couldn't find a challenge for Day {dayNumber}.
        </p>
        <Link href="/learn">
          <button className="mt-8 bg-secondary text-white px-6 py-2 rounded-lg hover:opacity-90">
            Back to Challenges
          </button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
      {/* Header with dynamic title */}
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">
          {dayConfig.heading}
        </h1>
        <p className="text-lg text-gray-300">
          Let’s master some mental math! Complete all tasks below 👇
        </p>
      </div>

      {/* 3. Tasks Grid is now dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Map over tasks from the config file */}
        {dayConfig.tasks.map((task, index) => {
          const taskNumber = index + 1;

          return (
            <div
              key={taskNumber}
              className="bg-dark border border-gray-700 rounded-xl p-6 shadow hover:shadow-xl transition flex flex-col"
            >
              <h2 className="text-xl font-semibold text-white mb-1">
                Task {taskNumber}
              </h2>
              {/* Use the task name from the config */}
              <p className="text-sm text-gray-400 mb-4 flex-grow">{task.name}</p>

              <div className="flex flex-col gap-4 mt-auto">
                <Link href={`/challenge/math/day/${dayNumber}/task/${taskNumber}`}>
                  <button className="bg-success text-dark px-4 py-2 rounded-lg hover:opacity-90 transition w-full">
                    🚀 Start Practice
                  </button>
                </Link>
                {/* The Revise button is preserved */}
                <Link href={`/challenge/math/day/${dayNumber}/revise/${taskNumber}`}>
                  <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition w-full">
                    📚 Revise Concept
                  </button>
                </Link>
              </div>
            </div>
          );
        })}

        {/* 4. Add the "Final Task" that links to the compete page */}
        <div 
          key="compete"
          className="md:col-span-2 bg-gradient-to-r from-primary to-yellow-400 p-1 rounded-xl shadow-lg"
        >
          <div className="bg-dark h-full w-full rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                🏆 Final Task: The Gauntlet
              </h2>
              <p className="text-gray-300">
                A mix of all tasks from Day {dayNumber}. Put your skills to the test!
              </p>
            </div>
            <Link href={`/challenge/math/day/${dayNumber}/compete`}>
              <button className="bg-primary text-dark px-8 py-3 rounded-xl text-lg hover:bg-primary/90 transition flex-shrink-0">
                🚩 Compete Now
              </button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
