'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ReviseConceptPage() {
  const { day } = useParams() as { day: string };

  return (
    <main className="min-h-screen bg-background text-light p-4 flex flex-col">
      <header className="mb-4">
        <Link href={`/challenge/math`}>
          <button className="text-sm text-secondary hover:underline">← Back to Challenge</button>
        </Link>
      </header>

      <h1 className="text-2xl font-bold text-primary mb-2">
        Day {day}: Multiply by 11 Trick
      </h1>

      <section className="bg-dark p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2 text-light">📘 Concept:</h2>
        <p className="text-sm text-light leading-relaxed">
          When multiplying a 2-digit number by 11, add the digits and place the result in between.
        </p>
        <p className="text-sm mt-3 text-green-400">
          Example: 52 × 11 = 5<span className="underline">+5+2</span>2 = 572
        </p>
      </section>

      <section className="bg-dark p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2 text-light">🧠 Why it works:</h2>
        <p className="text-sm text-light leading-relaxed">
          You're basically    tfjrhrerftjykgul using place values. Splitting 52 into 50 + 2 and using 11 = 10 + 1. 123445
        </p>
      </section>

      <Link href={`/challenge/math/day/${day}/task/1/practice`}>
        <button className="mt-auto bg-primary text-dark py-3 rounded-xl text-center hover:bg-opacity-90">
          Practice Now  
        </button>
      </Link>
    </main>
  );
}
