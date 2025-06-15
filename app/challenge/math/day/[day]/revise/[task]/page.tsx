'use client';

import { use } from 'react';

export default function ReviseConceptPage({
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
          📚 Day {dayNumber} - Task {taskNumber} Concept
        </h1>
        <p className="text-gray-400 text-lg">
          Here's the concept explanation for this task. Understand it before you begin practice!
        </p>
      </div>

      <section className="bg-dark p-6 rounded-xl w-full max-w-3xl border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Concept Title</h2>
        <p className="text-gray-300 leading-relaxed">
          This is dummy concept content for Day {dayNumber}, Task {taskNumber}. You can replace this with actual notes, examples, or embedded videos later.
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={() =>
              window.history.back()
            }
            className="bg-success text-dark px-6 py-2 rounded hover:opacity-90 transition"
          >
            🔙 Back to Tasks
          </button>
        </div>
      </section>
    </main>
  );
}
