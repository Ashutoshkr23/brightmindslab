// app/challenge/page.tsx
import Link from 'next/link';

const TOTAL_DAYS = 30;

export default function ChallengePage() {
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">
          30-Day Challenge
        </h1>
        <p className="text-center text-light mb-8">Select a day to start your mental maths mastery journey!</p>

        <div className="space-y-4">
          {days.map((day) => (
            <Link
              key={day}
              href={`/quiz?day=${day}`}
              className="block w-full bg-dark border border-light px-6 py-3 rounded-xl hover:bg-primary hover:text-black transition shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Day {day}</span>
                <span className="text-sm text-light/70">Start</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}