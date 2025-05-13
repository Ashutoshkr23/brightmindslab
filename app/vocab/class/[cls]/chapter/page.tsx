'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ChapterListPage() {
  const { cls } = useParams();
  const router = useRouter();
  // Replace with actual number of chapters or fetch from config
  const chapters = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
      <h1 className="text-2xl font-heading mb-6">Class {cls} Chapters</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((ch) => (
          <div key={ch} className="p-4 bg-dark rounded-2xl shadow-card text-center">
            <h3 className="text-lg mb-2">Chapter {ch}</h3>
            <button
              onClick={() => router.push(`/vocab/class/${cls}/chapter/${ch}`)}
              className="mt-2 bg-primary py-2 px-4 rounded-2xl text-black"
            >
              View Words
            </button>
          </div>
        ))}    
      </div>
    </div>
  );
}
