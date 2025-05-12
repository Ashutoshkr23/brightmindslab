'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VocabCard from '@/Components/VocabCard';
export default function SightWordsPage() {
  const { cls } = useParams();
  const [words, setWords] = useState<{ word: string; meaning: string; usage: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/data/class${cls}/sightwords.json`)
      .then(res => res.json())
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [cls]);

  if (loading) return <p className="text-light p-4">Loading words…</p>;

  return (
    <div className="min-h-screen bg-background text-white p-6">
      <h1 className="text-2xl font-heading mb-4">Class {cls} Sight Words</h1>
      <div>
        {words.map((w, idx) => (
          <VocabCard
            key={idx}
            word={w.word}
            meaning={w.meaning}
            usage={w.usage}
          />
        ))}
      </div>
    </div>
  );
}
