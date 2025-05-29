'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function ClassVocabMenu() {
  const router = useRouter();
  const { cls } = useParams(); // e.g. "6", "7", etc.
  const [user, setUser] = useState<boolean | null>(null);

  // Quick auth check to redirect guests back to login
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(!!u);
      if (!u) {
        router.replace('/login');
      }
    });
    return () => unsub();
  }, [router]);

  if (user === null) {
    // still checking
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-light">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
      <button
        onClick={() => router.back()}
        className="text-light mb-6 underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-heading mb-8">
        Class {cls} Vocabulary
      </h1>

      <div className="space-y-6">
        {/* High-Frequency Vocabulary */}
        <div className="p-4 bg-surface rounded-2xl shadow-card">
          <h2 className="text-xl mb-2">High-Frequency Words</h2>
          <p className="text-secondary mb-4">
            Practice most common English words in levels
          </p>
          <button
            onClick={() => router.push(`/vocab/class/${cls}/sightwords`)}
            className="w-full bg-primary py-2 rounded-2xl text-black"
          >
            Start High-Frequency
          </button>
        </div>

        {/* Chapter-Wise Vocabulary */}
        <div className="p-4 bg-surface rounded-2xl shadow-card">
          <h2 className="text-xl mb-2">Chapter-Wise Vocabulary</h2>
          <p className="text-secondary mb-4">
            Learn words from each chapter of your textbook
          </p>
          <button
            onClick={() => router.push(`/vocab/class/${cls}/chapter`)}
            className="w-full bg-secondary py-2 rounded-2xl text-white"
          >
            Browse Chapters
          </button>
        </div>
      </div>
    </div>
  );
}

