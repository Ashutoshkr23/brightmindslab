'use client';

import { use } from 'react';

export default function EnglishTaskPracticePage({
  params,
}: {
  params: Promise<{ day: string; task: string }>;
}) {
  const { day, task } = use(params);
  const dayNumber = parseInt(day);
  const taskNumber = parseInt(task);

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          📝 Day {dayNumber} - Rule {taskNumber} Practice
        </h1>
        <p className="text-gray-400 text-lg">
          Let’s test your understanding of today’s grammar rule.
        </p>
      </div>

      <section className="bg-dark p-6 rounded-xl w-full max-w-3xl border border-gray-700 shadow-lg text-center">
        <h2 className="text-xl text-white mb-4">Example Question:</h2>
        <p className="text-gray-300 mb-6">
          Choose the correct sentence:
        </p>

        <div className="flex flex-col gap-4 text-left">
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-success/80 transition">
            ✅ She goes to school every day.
          </button>
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-danger/80 transition">
            ❌ She go to school every day.
          </button>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-opacity-80 transition"
        >
          🔙 Back to Tasks
        </button>
      </section>
    </main>
  );
}
