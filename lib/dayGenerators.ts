// lib/challengeConfig.ts

// Define the structure for our data
export type Question = {
  operands: [number, number];
  operator: string;
  answer: number;
};

export type QuestionGenerator = () => Question;

// Define the star rating system, including the "Pro" tag
export type StarRating = {
  pro: { maxTime: number; label: string }; // e.g., under 20 seconds
  threeStar: { maxTime: number };         // e.g., 20-25 seconds
  twoStar: { maxTime: number };           // e.g., 25-30 seconds
  oneStar: { minTime: number };           // e.g., above 30 seconds
};

export type Task = {
  name: string;
  generator: QuestionGenerator;
};

export type ChallengeDay = {
  heading: string;
  tasks: Task[];
  starRating: StarRating;
};

// --- Generator Functions ---
// These functions create the actual math problems

// Day 1 Generators
const singleDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 7 + 3); // 3-9
  const b = Math.floor(Math.random() * 7 + 3); // 3-9
  return { operands: [a, b], operator: "+", answer: a + b };
};

const tensAdd: QuestionGenerator = () => {
  const a = (Math.floor(Math.random() * 9) + 1) * 10; // 10, 20...90
  const b = (Math.floor(Math.random() * 9) + 1) * 10; // 10, 20...90
  return { operands: [a, b], operator: "+", answer: a + b };
};

const twoDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10); // 10-99
  const b = Math.floor(Math.random() * 90 + 10); // 10-99
  return { operands: [a, b], operator: "+", answer: a + b };
};


// Day 2 Generators
const threeDigitTensAddWithTwoDigit: QuestionGenerator = () => {
    const a = (Math.floor(Math.random() * 90) + 10) * 10; // 100, 110 ... 990
    const b = Math.floor(Math.random() * 90 + 10);      // 10-99
    return { operands: [a, b], operator: "+", answer: a + b };
}

const threeDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 900 + 100); // 100-999
  const b = Math.floor(Math.random() * 900 + 100); // 100-999
  return { operands: [a, b], operator: "+", answer: a + b };
};

const nearMultipleOf100Add: QuestionGenerator = () => {
    const a = Math.floor(Math.random() * 900 + 100); // 100-999
    // Create a number close to a multiple of 100 (e.g., 199, 201, 398)
    const base = (Math.floor(Math.random() * 8) + 2) * 100; // 200, 300...900
    const offset = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
    const b = base + offset;
    return { operands: [a, b], operator: "+", answer: a + b };
}


// --- Challenge Definitions ---
// This is the main object that defines each day's challenge.
// Your application can now import this directly.

export const challengeConfig: Record<number, ChallengeDay> = {
  1: {
    heading: "Addition of 2 Digits",
    starRating: {
      pro: { maxTime: 20, label: "Pro" },
      threeStar: { maxTime: 25 },
      twoStar: { maxTime: 30 },
      oneStar: { minTime: 30 },
    },
    tasks: [
      { name: "Single Digits", generator: singleDigitAdd },
      { name: "Multiples of 10", generator: tensAdd },
      { name: "Double Digits", generator: twoDigitAdd },
    ],
  },
  2: {
    heading: "Addition Day 2",
    starRating: {
      pro: { maxTime: 20, label: "Pro" },
      threeStar: { maxTime: 25 },
      twoStar: { maxTime: 30 },
      oneStar: { minTime: 30 },
    },
    tasks: [
        { name: "Three Digit (x10) + Two Digit", generator: threeDigitTensAddWithTwoDigit},
        { name: "Three Digit + Three Digit", generator: threeDigitAdd},
        { name: "Near a Multiple of 100", generator: nearMultipleOf100Add},
    ],
  },
  // You can easily add Day 3, 4, etc. here
};

