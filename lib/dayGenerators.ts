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
};

const threeDigitAdd: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 900 + 100); // 100-999
  const b = Math.floor(Math.random() * 900 + 100); // 100-999
  return { operands: [a, b], operator: "+", answer: a + b };
};

const nearMultipleOf100Add: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 900 + 100); // 100-999
  const base = (Math.floor(Math.random() * 8) + 2) * 100; // 200, 300...900
  const offset = Math.floor(Math.random() * 5) - 2;        // -2, -1, 0, 1, 2
  const b = base + offset;
  return { operands: [a, b], operator: "+", answer: a + b };
};

// Day 3 Generators
const closeToMultipleOf100PlusTwoOrThreeDigit: QuestionGenerator = () => {
  const base = (Math.floor(Math.random() * 8) + 2) * 100; // 200-900
  const offset = Math.floor(Math.random() * 5) - 2;       // -2 to 2
  const a = base + offset;
  const b = Math.random() < 0.5
    ? Math.floor(Math.random() * 90 + 10)                // 10-99
    : Math.floor(Math.random() * 900 + 100);             // 100-999
  return { operands: [a, b], operator: "+", answer: a + b };
};

const closeNumbersDiffLessThan20: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 980 + 20);           // 20-999
  let diff = Math.floor(Math.random() * 39) - 19;            // -19 to 19
  if (diff === 0) diff = 1;
  const b = a + diff;
  return { operands: [a, b], operator: "+", answer: a + b };
};

const xyYxAdd: QuestionGenerator = () => {
  const x = Math.floor(Math.random() * 9) + 1;              // 1-9
  let y = Math.floor(Math.random() * 10);                   // 0-9
  while (y === x) y = Math.floor(Math.random() * 10);
  const a = x * 10 + y;
  const b = y * 10 + x;
  return { operands: [a, b], operator: "+", answer: a + b };
};

// Day 4 Generators (Subtraction)
const twoDigitMinusOneDigit: QuestionGenerator = () => {
  const a = Math.floor(Math.random() * 90 + 10); // 10-99
  const b = Math.floor(Math.random() * 9 + 1);   // 1-9
  return { operands: [a, b], operator: "-", answer: a - b };
};

const twoDigitMinusTwoDigitNoBorrow: QuestionGenerator = () => {
  const tensA = Math.floor(Math.random() * 9) + 1;
  const unitsA = Math.floor(Math.random() * 10);
  const tensB = Math.floor(Math.random() * (tensA + 1));
  const unitsB = Math.floor(Math.random() * (unitsA + 1));
  const a = tensA * 10 + unitsA;
  const b = tensB * 10 + unitsB;
  return { operands: [a, b], operator: "-", answer: a - b };
};

const twoDigitMinusTwoDigitWithBorrow: QuestionGenerator = () => {
  const tensA = Math.floor(Math.random() * 9) + 1;
  const unitsA = Math.floor(Math.random() * 9); // 0-8 to allow borrow
  const tensB = Math.floor(Math.random() * tensA);
  const unitsB = Math.floor(Math.random() * (9 - unitsA)) + unitsA + 1; // > unitsA
  const a = tensA * 10 + unitsA;
  const b = tensB * 10 + unitsB;
  return { operands: [a, b], operator: "-", answer: a - b };
};

// Day 5 Generators (Subtraction)
const threeDigitSubtractNoBorrow: QuestionGenerator = () => {
  const aHundreds = Math.floor(Math.random() * 9) + 1;
  const aTens = Math.floor(Math.random() * 10);
  const aUnits = Math.floor(Math.random() * 10);
  const bHundreds = Math.floor(Math.random() * (aHundreds + 1));
  const bTens = Math.floor(Math.random() * (aTens + 1));
  const bUnits = Math.floor(Math.random() * (aUnits + 1));
  const a = aHundreds * 100 + aTens * 10 + aUnits;
  const b = bHundreds * 100 + bTens * 10 + bUnits;
  return { operands: [a, b], operator: "-", answer: a - b };
};

const threeDigitSubtractWithBorrow: QuestionGenerator = () => {
  const aHundreds = Math.floor(Math.random() * 9) + 1;
  const aTens = Math.floor(Math.random() * 10);
  const aUnits = Math.floor(Math.random() * 9); // 0-8 for borrow
  const hundredsB = Math.floor(Math.random() * aHundreds);
  const tensB = Math.floor(Math.random() * 10);
  const unitsB = Math.floor(Math.random() * (9 - aUnits)) + aUnits + 1; // > aUnits
  const a = aHundreds * 100 + aTens * 10 + aUnits;
  const b = hundredsB * 100 + tensB * 10 + unitsB;
  return { operands: [a, b], operator: "-", answer: a - b };
};

const abcCbaSubtract: QuestionGenerator = () => {
  const x = Math.floor(Math.random() * 9) + 1;
  const z = Math.floor(Math.random() * x);
  const y = Math.floor(Math.random() * 10);
  const a = x * 100 + y * 10 + z;
  const b = z * 100 + y * 10 + x;
  return { operands: [a, b], operator: "-", answer: a - b };
};

const xyYxSubtract: QuestionGenerator = () => {
  // pick x from 1 to 9
  const x = Math.floor(Math.random() * 9) + 1;
  // pick y from 1 to 9, but not equal to x
  let y = Math.floor(Math.random() * 9) + 1;
  while (y === x) {
    y = Math.floor(Math.random() * 9) + 1;
  }
  const a = x * 10 + y;
  const b = y * 10 + x;
  // ensure the larger comes first
  const first = Math.max(a, b);
  const second = Math.min(a, b);
  return {
    operands: [first, second],
    operator: "-",
    answer: first - second
  };
};



// --- Challenge Definitions ---
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
      { name: "Three Digit (x10) + Two Digit", generator: threeDigitTensAddWithTwoDigit },
      { name: "Three Digit + Three Digit", generator: threeDigitAdd },
      { name: "Near a Multiple of 100", generator: nearMultipleOf100Add },
    ],
  },
  3: {
    heading: "Addition Day 3",
    starRating: {
      pro: { maxTime: 20, label: "Pro" },
      threeStar: { maxTime: 25 },
      twoStar: { maxTime: 30 },
      oneStar: { minTime: 30 },
    },
    tasks: [
      { name: "Close to Multiple of 100 + 2/3-Digit", generator: closeToMultipleOf100PlusTwoOrThreeDigit },
      { name: "Close Numbers (Δ < 20)", generator: closeNumbersDiffLessThan20 },
      { name: "XY + YX", generator: xyYxAdd },
    ],
  },
  4: {
    heading: "Subtraction Day 4",
    starRating: {
      pro: { maxTime: 20, label: "Pro" },
      threeStar: { maxTime: 25 },
      twoStar: { maxTime: 30 },
      oneStar: { minTime: 30 },
    },
    tasks: [
      { name: "2-Digit - 1-Digit", generator: twoDigitMinusOneDigit },
      { name: "2-Digit - 2-Digit Without Borrow", generator: twoDigitMinusTwoDigitNoBorrow },
      { name: "2-Digit - 2-Digit With Borrow", generator: twoDigitMinusTwoDigitWithBorrow },
    ],
  },
  5: {
    heading: "Subtraction Day 5",
    starRating: {
      pro: { maxTime: 20, label: "Pro" },
      threeStar: { maxTime: 25 },
      twoStar: { maxTime: 30 },
      oneStar: { minTime: 30 },
    },
    tasks: [
      { name: "3-Digit - 3-Digit Without Borrow", generator: threeDigitSubtractNoBorrow },
      { name: "3-Digit - 3-Digit With Borrow", generator: threeDigitSubtractWithBorrow },
      { name: "ABC - CBA (Base Method)", generator: abcCbaSubtract },
      { name: "XY - YX", generator: xyYxSubtract },
    ],
  },
};
