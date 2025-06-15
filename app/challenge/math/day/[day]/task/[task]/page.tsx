'use client';

import { use } from 'react';
import QuizClient from '@/Components/QuizClient';

export default function MathQuizTaskPage({
  params,
}: {
  params: Promise<{ day: string; task: string }>;
}) {
  const { day, task } = use(params);

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <QuizClient day={parseInt(day)} task={parseInt(task)} />
    </main>
  );
}
