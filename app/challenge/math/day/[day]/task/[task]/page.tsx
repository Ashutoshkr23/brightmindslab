// app/challenge/math/day/[day]/task/[task]/page.tsx
'use client';

import { useParams } from 'next/navigation';

export default function TaskPage() {
  const params = useParams();
  const { day, task } = params as { day: string; task: string };

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        🧮 Practice Task {task} - Day {day}
      </h1>
      <p className="text-center text-lg text-gray-400">
        This is the quiz/practice page for Day {day}, Task {task}.
      </p>
    </main>
  );
}
