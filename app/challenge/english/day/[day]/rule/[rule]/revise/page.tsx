// app/challenge/english/day/[day]/rule/[rule]/revise/page.tsx
import { use } from "react";
import { englishRulesData } from "@/lib/englishRules";

interface Props {
  params: { rule: string };
}

export default function ReviseRulePage({ params }: Props) {
  const { rule } = params;
  const ruleNumber = parseInt(rule);
  const ruleData = englishRulesData[ruleNumber - 1];

  // If ruleData is an array, pick the first element or handle accordingly
  const singleRule = Array.isArray(ruleData) ? ruleData[0] : ruleData;

  return (
    <main className="min-h-screen bg-background text-light p-4 space-y-4">
      <h1 className="text-2xl font-bold text-primary">Rule {ruleNumber}: {singleRule?.title}</h1>
      <p className="text-base text-light whitespace-pre-line">{singleRule?.explanation}</p>
    </main>
  );
}