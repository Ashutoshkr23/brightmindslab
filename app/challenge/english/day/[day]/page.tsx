//import { use } from "react";
import Link from "next/link";

interface Props {
  params: { day: string };
}

export default function EnglishDayPage({ params }: Props) {
  const { day } = params;
  const rule1 = (parseInt(day) - 1) * 2 + 1;
  const rule2 = rule1 + 1;

  return (
    <main className="min-h-screen bg-background text-light p-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary">Day {day}: Rules {rule1} & {rule2}</h1>

      {[rule1, rule2].map((ruleNum) => (
        <div key={ruleNum} className="bg-dark p-4 rounded-xl shadow space-y-3">
          <h2 className="text-xl font-semibold text-secondary">Rule {ruleNum}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href={`/challenge/english/day/${day}/rule/${ruleNum}/revise`}>
              <button className="w-full bg-primary text-dark py-2 rounded-xl hover:bg-opacity-90">Revise</button>
            </Link>
            <Link href={`/challenge/english/day/${day}/rule/${ruleNum}/practice`}>
              <button className="w-full bg-secondary text-white py-2 rounded-xl hover:bg-opacity-90">Practice</button>
            </Link>
          </div>
        </div>
      ))}
    </main>
  );
}
