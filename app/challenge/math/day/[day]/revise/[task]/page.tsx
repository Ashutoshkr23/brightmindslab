'use client';

import { use } from 'react';
import { getNotesForDay } from '@/lib/mathNotes';
import { useRouter } from 'next/navigation';

export default function ReviseConceptPage({
  params,
}: {
  params: Promise<{ day: string; task: string }>;
}) {
  const router = useRouter();
  const { day, task } = use(params);
  const dayNumber = parseInt(day);
  const taskNumber = parseInt(task);

  const notesForDay = getNotesForDay(dayNumber);
  const currentNote = notesForDay[taskNumber - 1]; // Task 1 is index 0

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
      {/* Page Header */}
      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          📚 Day {dayNumber} - Task {taskNumber} Concept
        </h1>
        <p className="text-gray-400 text-lg">
          Here&apos;s the concept explanation for this task. Understand it before you begin practice!
        </p>
      </div>

      {/* Concept Card */}
      <section className="bg-dark p-6 rounded-xl w-full max-w-3xl border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">{currentNote?.title || 'Concept Title'}</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {currentNote?.content || 'No notes available for this task yet.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push(`/challenge/math/day/${dayNumber}/task/${taskNumber}`)}
            className="bg-success text-dark px-6 py-2 rounded hover:opacity-90 transition"
          >
            🚀 Start Practice
          </button>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:opacity-90 transition"
          >
            🔙 Back to Tasks
          </button>
        </div>
      </section>
    </main>
  );
}

