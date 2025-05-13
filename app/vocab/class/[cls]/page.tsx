'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ClassVocabMenu() {
  const { cls } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
      <h1 className="text-2xl font-heading mb-6">Class {cls} Vocabulary</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-dark rounded-2xl shadow-card text-center">
          <h2 className="text-xl mb-2">Sight Words</h2>
          <p>High-frequency words to master daily.</p>
          <button
            onClick={() => router.push(`/vocab/class/${cls}/sightwords`)}
            className="mt-4 bg-primary py-2 px-4 rounded-2xl text-black"
          >
            Go to Sight Words
          </button>
        </div>

        <div className="p-4 bg-dark rounded-2xl shadow-card text-center">
          <h2 className="text-xl mb-2">Chapter Vocabulary</h2>
          <p>Words organized by textbook chapters.</p>
          <button
            onClick={() => router.push(`/vocab/class/${cls}/chapter`)}
            className="mt-4 bg-secondary py-2 px-4 rounded-2xl text-white"
          >
            View Chapters
          </button>
        </div>
      </div>
    </div>
  );
}
