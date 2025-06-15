// lib/englishQuizData.ts

export type EnglishMCQ = {
  question: string;
  options: string[];
  answer: number; // index of correct option
};

export const getEnglishQuestionsForRule = (day: number, rule: number): EnglishMCQ[] => {
  if (day === 1 && rule === 1) {
    return [
      {
        question: "What is the correct sentence?",
        options: [
          "She go to school every day.",
          "She goes to school every day.",
          "She gone to school every day.",
          "She going to school every day."
        ],
        answer: 1
      },
      {
        question: "Which word is a verb?",
        options: ["Beautiful", "Quickly", "Run", "Happiness"],
        answer: 2
      },
      {
        question: "Identify the correct form: 'He ____ a book now.'",
        options: ["read", "reads", "is reading", "reading"],
        answer: 2
      },
      {
        question: "What is the plural of 'child'?",
        options: ["childs", "children", "childes", "childrens"],
        answer: 1
      },
      {
        question: "Choose the correct article: 'I saw ___ elephant.'",
        options: ["a", "an", "the", "no article needed"],
        answer: 1
      },
      {
        question: "Which sentence is correct?",
        options: [
          "They is playing.",
          "They are playing.",
          "They was playing.",
          "They be playing."
        ],
        answer: 1
      },
      {
        question: "What type of word is 'quickly'?",
        options: ["Noun", "Adjective", "Verb", "Adverb"],
        answer: 3
      },
      {
        question: "Identify the subject in: 'Ravi plays cricket.'",
        options: ["plays", "cricket", "Ravi", "None"],
        answer: 2
      },
      {
        question: "Choose the correct form: 'They ____ a car.'",
        options: ["has", "have", "having", "had"],
        answer: 1
      },
      {
        question: "Select the correct sentence:",
        options: [
          "Me and him went to school.",
          "He and I went to school.",
          "Him and I went to school.",
          "He and me went to school."
        ],
        answer: 1
      }
    ];
  }

  return [];
};
