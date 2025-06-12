import { use } from "react";
import Link from "next/link";

interface Props {
  params: { day: string; task: string };
}

export default function PracticeTaskPage({ params }: Props) {
  const { day, task } = params;

  return (
    <main className="min-h-screen bg-background text-light p-4 flex flex-col">
      <header className="mb-4">
        <Link href={`/challenge/math/day/${day}`}>
          <button className="text-sm text-secondary hover:underline">← Back to Day {day}</button>
        </Link>
      </header>

      <h1 className="text-2xl font-bold text-primary mb-4">
        Day {day} • Task {task} Practice
      </h1>

      <div className="bg-dark p-4 rounded-xl shadow-md space-y-3">
        <p className="text-sm text-light">📝 Question 1: What is 53 × 11?</p>
        <div className="space-y-2">
          <button className="w-full bg-secondary hover:bg-opacity-90 text-white py-2 rounded-xl">573</button>
          <button className="w-full bg-secondary hover:bg-opacity-90 text-white py-2 rounded-xl">583</button>
          <button className="w-full bg-secondary hover:bg-opacity-90 text-white py-2 rounded-xl">603</button>
          <button className="w-full bg-secondary hover:bg-opacity-90 text-white py-2 rounded-xl">562</button>
        </div>
      </div>

      {/* Add more questions below or load dynamically later */}
    </main>
  );
}
