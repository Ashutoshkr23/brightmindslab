// app/challenge/english/day/[day]/rule/[rule]/practice/page.tsx
import { englishRulesData } from "@/lib/englishRules";

interface Props {
  params: { day: string; rule: string };
}

export default function EnglishPracticePage({ params }: Props) {
  const day = parseInt(params.day);
  const ruleNumber = parseInt(params.rule);

  const rule = englishRulesData[day]?.find((r) => r.rule === ruleNumber);

  if (!rule) {
    return (
      <div className="p-6 text-center text-red-500">
        Rule not found for Day {day}, Rule {ruleNumber}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-light px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-primary mb-4">
        Practice: {rule.title}
      </h1>

      {/* Dummy Question */}
      <div className="bg-dark p-4 rounded-xl shadow-md">
        <p className="mb-4">
          Choose the correct sentence:
        </p>
        <ul className="space-y-3">
          <li className="bg-secondary p-3 rounded-xl hover:bg-secondary/80 transition">
            She walk to the school.
          </li>
          <li className="bg-secondary p-3 rounded-xl hover:bg-secondary/80 transition">
            She walks to the school.
          </li>
          <li className="bg-secondary p-3 rounded-xl hover:bg-secondary/80 transition">
            She walking to the school.
          </li>
        </ul>
      </div>

      {/* Placeholder for multiple questions later */}
      <p className="text-sm text-light/70 text-center">
        More practice coming soon...
      </p>
    </main>
  );
}
