export interface EnglishRule {
  rule: number;
  title: string;
  explanation: string;
  example: string;
}

export const englishRulesData: Record<number, EnglishRule[]> = {
  1: [
    {
      rule: 1,
      title: "Subject-Verb Agreement",
      explanation: "The verb must agree with its subject in number.",
      example: "She walks to school. (Not: She walk to school)",
    },
    {
      rule: 2,
      title: "Use of Articles",
      explanation: "Use 'a' before consonant sounds, 'an' before vowel sounds.",
      example: "An apple, A cat",
    },
  ],
  2: [
    {
      rule: 3,
      title: "Tense Consistency",
      explanation: "Stick to the same tense within a sentence or paragraph.",
      example: "He went to the market and bought apples. (Not: goes and bought)",
    },
    {
      rule: 4,
      title: "Pronoun-Antecedent Agreement",
      explanation: "Pronouns must agree with the nouns they refer to.",
      example: "Each student should bring his or her book.",
    },
  ],
};
