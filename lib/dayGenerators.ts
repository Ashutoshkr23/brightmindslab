// Define the structure for our data
type Question = {
  operands: [number, number];
  operator: string;
  answer: number;
};

type QuestionGenerator = () => Question;

type StarRating = {
  pro: { maxTime: number; label: string };
  threeStar: { maxTime: number };
  twoStar: { maxTime: number };
  oneStar: { minTime: number };
};

type Task = { name: string; generator: QuestionGenerator };

type ChallengeDay = {
  heading: string;
  starRating: StarRating;
  tasks: Task[];
};

// --- Core Generators (Days 1 & 2) ---
const singleDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 7 + 3);
  const b = Math.floor(Math.random() * 7 + 3);
  return { operands: [a, b], operator: "+", answer: a + b };
};

const tensAdd: QuestionGenerator = () => {
  const a = (Math.floor(Math.random() * 9) + 1) * 10;
  const b = (Math.floor(Math.random() * 9) + 1) * 10;
  return { operands: [a, b], operator: "+", answer: a + b };
};

const twoDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10);
  const b = Math.floor(Math.random() * 90 + 10);
  return { operands: [a, b], operator: "+", answer: a + b };
};

const threeDigitTensAddWithTwoDigit: QuestionGenerator = () => {
  const a = (Math.floor(Math.random() * 90) + 10) * 10;
  const b = Math.floor(Math.random() * 90 + 10);
  return { operands: [a, b], operator: "+", answer: a + b };
};

const threeDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 900 + 100);
  const b = Math.floor(Math.random() * 900 + 100);
  return { operands: [a, b], operator: "+", answer: a + b };
};

const nearMultipleOf100Add: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 900 + 100);
  const base = (Math.floor(Math.random() * 8) + 2) * 100;
  const offset = Math.floor(Math.random() * 5) - 2;
  const b = base + offset;
  return { operands: [a, b], operator: "+", answer: a + b };
};

// --- Day 3: Special-Case Addition ---
const closeNumbersDiffLessThan20: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 80 + 10);
  let b: number;
  do {
    b = a + (Math.floor(Math.random() * 41) - 20);
  } while (b < 10 || b > 99);
  return { operands: [a, b], operator: "+", answer: a + b };
};

const xyPlusYX: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10);
  const str = a.toString();
  const rev = parseInt(str.split("").reverse().join(""), 10);
  return { operands: [a, rev], operator: "+", answer: a + rev };
};

// --- Subtraction Generators (Days 4 & 5) ---
const twoDigitMinusOneDigit: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10);
  const b = Math.floor(Math.random() * 9 + 1);
  return { operands: [a, b], operator: "-", answer: a - b };
};

const twoDigitSubtractNoCarry: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10);
  const b = Math.floor(Math.random() * (a % 10 + 1));
  return { operands: [a, b], operator: "-", answer: a - b };
};

const twoDigitSubtractWithCarry: QuestionGenerator = () => {
  let a = Math.floor(Math.random() * 90 + 10);
  let b = Math.floor(Math.random() * 90 + 10);
  if (b > a) [a, b] = [b, a];
  return { operands: [a, b], operator: "-", answer: a - b };
};

const threeDigitSubtractNoCarry: QuestionGenerator = () => {
  const a = Array.from({ length: 3 }, () => Math.floor(Math.random() * 9)).join("");
  const b = Array.from(a).map((d) => String(Math.floor(Math.random() * Number(d + 1)))).join("");
  const ai = parseInt(a, 10), bi = parseInt(b, 10);
  return { operands: [ai, bi], operator: "-", answer: ai - bi };
};

const threeDigitSubtractWithCarry: QuestionGenerator = () => {
  let a = Math.floor(Math.random() * 900 + 100);
  let b = Math.floor(Math.random() * 900 + 100);
  if (b > a) [a, b] = [b, a];
  return { operands: [a, b], operator: "-", answer: a - b };
};

const xyMinusYX: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10);
  const rev = parseInt(a.toString().split("").reverse().join(""), 10);
  return { operands: [a, rev], operator: "-", answer: a - rev };
};

// --- Multiplication Table Generators (Days 6–8, 10) ---
const makeTableGenerator = (start: number, end: number): QuestionGenerator => () => {
  const a = Math.floor(Math.random() * (end - start + 1)) + start;
  const b = Math.floor(Math.random() * 10 + 1);
  return { operands: [a, b], operator: "×", answer: a * b };
};

// --- Challenge Configuration ---
export const challengeConfig: Record<number, ChallengeDay> = {
  1: {
    heading: "Addition of 2 Digits",
    starRating: { pro: { maxTime: 20, label: "Pro" }, threeStar: { maxTime: 25 }, twoStar: { maxTime: 30 }, oneStar: { minTime: 30 } },
    tasks: [
      { name: "Single Digits", generator: singleDigitAdd },
      { name: "Multiples of 10", generator: tensAdd },
      { name: "Double Digits", generator: twoDigitAdd },
    ],
  },
  2: {
    heading: "Addition Day 2",
    starRating: { pro: { maxTime: 20, label: "Pro" }, threeStar: { maxTime: 25 }, twoStar: { maxTime: 30 }, oneStar: { minTime: 30 } },
    tasks: [
      { name: "3-Digit ×10 + 2-Digit", generator: threeDigitTensAddWithTwoDigit },
      { name: "3-Digit + 3-Digit", generator: threeDigitAdd },
      { name: "Near Multiple of 100", generator: nearMultipleOf100Add },
    ],
  },
  3: {
    heading: "Special-Case Addition",
    starRating: { pro: { maxTime: 25, label: "Pro" }, threeStar: { maxTime: 30 }, twoStar: { maxTime: 35 }, oneStar: { minTime: 35 } },
    tasks: [
      { name: "Near Multiple of 100", generator: nearMultipleOf100Add },
      { name: "3-Digit ×10 + 2-Digit", generator: threeDigitTensAddWithTwoDigit },
      { name: "Close Numbers (Δ≤20)", generator: closeNumbersDiffLessThan20 },
      { name: "Form XY + YX", generator: xyPlusYX },
    ],
  },
  4: {
    heading: "Subtraction Basics",
    starRating: { pro: { maxTime: 25, label: "Pro" }, threeStar: { maxTime: 30 }, twoStar: { maxTime: 35 }, oneStar: { minTime: 35 } },
    tasks: [
      { name: "2-Digit - 1-Digit", generator: twoDigitMinusOneDigit },
      { name: "2-Digit - 2-Digit (No Carry)", generator: twoDigitSubtractNoCarry },
      { name: "2-Digit - 2-Digit (With Carry)", generator: twoDigitSubtractWithCarry },
    ],
  },
  5: {
    heading: "3-Digit Subtraction",
    starRating: { pro: { maxTime: 30, label: "Pro" }, threeStar: { maxTime: 35 }, twoStar: { maxTime: 40 }, oneStar: { minTime: 40 } },
    tasks: [
      { name: "3-Digit - 3-Digit (No Carry)", generator: threeDigitSubtractNoCarry },
      { name: "3-Digit - 3-Digit (With Carry)", generator: threeDigitSubtractWithCarry },
      { name: "Form XY - YX", generator: xyMinusYX },
    ],
  },
  6: {
    heading: "Multiplication Tables (1–8)",
    starRating: { pro: { maxTime: 20, label: "Pro" }, threeStar: { maxTime: 25 }, twoStar: { maxTime: 30 }, oneStar: { minTime: 30 } },
    tasks: [
      { name: "Table 1–4", generator: makeTableGenerator(1, 4) },
      { name: "Table 5–6", generator: makeTableGenerator(5, 6) },
      { name: "Table 7–8", generator: makeTableGenerator(7, 8) },
    ],
  },
  7: {
    heading: "Multiplication Tables (9–14)",
    starRating: { pro: { maxTime: 20, label: "Pro" }, threeStar: { maxTime: 25 }, twoStar: { maxTime: 30 }, oneStar: { minTime: 30 } },
    tasks: [
      { name: "Table 9–10", generator: makeTableGenerator(9, 10) },
      { name: "Table 11–12", generator: makeTableGenerator(11, 12) },
      { name: "Table 13–14", generator: makeTableGenerator(13, 14) },
    ],
  },
  8: {
    heading: "Multiplication Tables (15–20)",
    starRating: { pro: { maxTime: 20, label: "Pro" }, threeStar: { maxTime: 25 }, twoStar: { maxTime: 30 }, oneStar: { minTime: 30 } },
    tasks: [
      { name: "Table 15–16", generator: makeTableGenerator(15, 16) },
      { name: "Table 17–18", generator: makeTableGenerator(17, 18) },
      { name: "Table 19–20", generator: makeTableGenerator(19, 20) },
    ],
  },
  10: {
    heading: "Multiplication Tables (21–24)",
    starRating: { pro: { maxTime: 20, label: "Pro" }, threeStar: { maxTime: 25 }, twoStar: { maxTime: 30 }, oneStar: { minTime: 30 } },
    tasks: [
      { name: "Table 21–22", generator: makeTableGenerator(21, 22) },
      { name: "Table 23–24", generator: makeTableGenerator(23, 24) },
    ],
  },
};
