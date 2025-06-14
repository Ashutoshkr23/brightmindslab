'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function MathDayPage({ params }: { params: { day: string } }) {
  const router = useRouter();
  const dayNumber = parseInt(params.day);

  useEffect(() => {
    const savedDay = localStorage.getItem('math-day');
    const progress = savedDay ? parseInt(savedDay) : 1;

    if (dayNumber > progress) {
      alert('🚫 This day is not unlocked yet!');
      router.push('/dashboard');
    }
  }, [dayNumber, router]);

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Day {dayNumber} Challenge
      </h1>

      <div className="max-w-md mx-auto space-y-6">
        {/* Revise Concept Button */}
        <Link href={`/challenge/math/day/${dayNumber}/revise`}>
          <div className="bg-dark border border-success text-success rounded-xl px-6 py-4 hover:bg-success hover:text-dark shadow transition text-center text-xl font-semibold cursor-pointer">
            📚 Revise Concept
          </div>
        </Link>

        {/* Practice Button */}
        <Link href={`/challenge/math/day/${dayNumber}/task`}>
          <div className="bg-dark border border-primary text-primary rounded-xl px-6 py-4 hover:bg-primary hover:text-dark shadow transition text-center text-xl font-semibold cursor-pointer">
            🚀 Start Practice
          </div>
        </Link>
      </div>
    </main>
  );
}

