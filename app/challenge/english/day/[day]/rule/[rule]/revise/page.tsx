// app/challenge/english/day/[day]/rule/[rule]/revise/page.tsx

import Link from "next/link";
import { englishRulesData } from "@/lib/englishRules";

export default function ReviseRulePage({
  params,
}: {
  params: { day: string; rule: string };
}) {
  const { day, rule } = params;
  const ruleNumber = Number(rule);
  const ruleData = englishRulesData[ruleNumber - 1];

  const singleRule = Array.isArray(ruleData) ? ruleData[0] : ruleData;

  return (
    <main className="min-h-screen bg-background text-light p-4 space-y-6">
      <header>
        <Link href={`/challenge/english/day/${day}`}>
          <button className="text-sm text-secondary hover:underline">← Back to Day {day}</button>
        </Link>
      </header>

      <h1 className="text-2xl font-bold text-primary">
        Rule {ruleNumber}: {singleRule?.title || "Untitled"}
      </h1>

      <p className="text-base text-light whitespace-pre-line">
        {singleRule?.explanation || "No explanation available."}
      </p>

      <div>
        <Link href={`/challenge/english/day/${day}/rule/${rule}/practice`}>
          <button className="mt-4 bg-secondary text-white py-2 px-6 rounded-xl hover:bg-opacity-90">
            Practice Now
          </button>
        </Link>
      </div>
    </main>
  );
}
