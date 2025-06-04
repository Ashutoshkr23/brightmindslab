import Link from "next/link";

// Total challenge days
const TOTAL_DAYS = 30;

// Get today's date
const today = new Date();
const currentDay = today.getDate(); // Example: 2 if it's June 2

export default function ChallengePage() {
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-background text-light p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">
          30-Day Challenge
        </h1>
        <p className="text-center text-light mb-8">
          Select a day to start your mental maths mastery journey!
        </p> 

        <div className="space-y-4">
          {days.map((day) => {
            const isUnlocked = day <= currentDay;

            return isUnlocked ? (
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
            ) : (
              <div
                key={day}
                className="block w-full bg-muted border border-muted-foreground px-6 py-3 rounded-xl opacity-50 cursor-not-allowed"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Day {day}</span>
                  <span className="text-sm text-muted-foreground">Locked 🔒</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
