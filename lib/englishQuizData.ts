export type EnglishMCQ = {
  question: string;
  options: string[];
  answer: number; // index of correct option
};

export const getEnglishQuestionsForRule = (day: number, rule: number): EnglishMCQ[] => {
  if (day === 1 && rule === 1) {
    return [
      {
        question: "Choose the correct option: ______ of the team members is dedicated.",
        options: [
          "Every",
          "Each",
          "All",
          "Some"
        ],
        answer: 1
      },
      {
        question: "Which sentence is grammatically correct?",
        options: [
          "Every student have a textbook.",
          "Each students has a textbook.",
          "Every student has a textbook.",
          "Each of the student are given a textbook."
        ],
        answer: 2
      },
      {
        question: "She had a different excuse for ______ time she was late.",
        options: [
          "each",
          "every",
          "all",
          "any"
        ],
        answer: 1
      },
      {
        question: "Which sentence is grammatically incorrect?",
        options: [
          "He held a phone in each hand.",
          "Every seat in the theater was taken.",
          "They have every reason to be proud.",
          "He has a book in every hand."
        ],
        answer: 3
      },
      {
        question: "______ one of the paintings was a masterpiece.",
        options: [
          "Every",
          "Each",
          "All",
          "Many"
        ],
        answer: 1
      }
    ];
  }

  return [];
};