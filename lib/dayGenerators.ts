// lib/dayGenerators.ts
export type QuestionGenerator = () => [number, number, number, string];

export const getGeneratorsForDay = (day: number): QuestionGenerator[] => {
  switch (day) {
    case 1:
      // … (Day 1 generators unchanged) …
      const singleDigitAdd: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 7 + 3);
        const b = Math.floor(Math.random() * 7 + 3);
        return [a, b, a + b, "+"] as [number, number, number, string];
      };
      const tensAdd: QuestionGenerator = () => {
        const a = (Math.floor(Math.random() * 9) + 1) * 10;
        const b = (Math.floor(Math.random() * 9) + 1) * 10;
        return [a, b, a + b, "+"] as [number, number, number, string];
      };
      const twoDigitAdd: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 90 + 10);
        const b = Math.floor(Math.random() * 90 + 10);
        return [a, b, a + b, "+"] as [number, number, number, string];
      };
      const tableOf2to5: QuestionGenerator = () => {
        const base = Math.floor(Math.random() * 4) + 2;
        const m = Math.floor(Math.random() * 10) + 1;
        return [base, m, base * m, "×"] as [number, number, number, string];
      };
      return [singleDigitAdd, tensAdd, twoDigitAdd, tableOf2to5];

    case 2:
      // 1️⃣ Two-digit + two-digit, sometimes tens‐digit of the first is 9
      const twoDigitWithNineTens: QuestionGenerator = () => {
        let a: number;
        if (Math.random() < 0.5) {
          // force tens digit = 9
          a = 90 + Math.floor(Math.random() * 10);    // 90–99
        } else {
          a = Math.floor(Math.random() * 90 + 10);     // 10–99
        }
        const b = Math.floor(Math.random() * 90 + 10); // 10–99
        return [a, b, a + b, "+"] as [number, number, number, string];
      };

      // 2️⃣ Three-digit (tens always 9) + two‐ or three‐digit
      const threeDigitWithNineTensAndVar: QuestionGenerator = () => {
        const hundreds = Math.floor(Math.random() * 9) + 1; // 1–9
        const ones = Math.floor(Math.random() * 10);       // 0–9
        const a = hundreds * 100 + 90 + ones;               // X9Y
        let b: number;
        if (Math.random() < 0.5) {
          b = Math.floor(Math.random() * 90 + 10);         // 10–99
        } else {
          b = Math.floor(Math.random() * 900 + 100);       // 100–999
        }
        return [a, b, a + b, "+"] as [number, number, number, string];
      };

      // 3️⃣ Three-digit + three-digit (100–999)
      const threeDigitAdd: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 900 + 100);    // 100–999
        const b = Math.floor(Math.random() * 900 + 100);    // 100–999
        return [a, b, a + b, "+"] as [number, number, number, string];
      };

      // 4️⃣ Multiplication table of 6–8 (×1–10)
      const tableOf6to8: QuestionGenerator = () => {
        const base = Math.floor(Math.random() * 3) + 6;     // 6,7,8
        const m = Math.floor(Math.random() * 10) + 1;       // 1–10
        return [base, m, base * m, "×"] as [number, number, number, string];
      };

      return [
        twoDigitWithNineTens,
        threeDigitWithNineTensAndVar,
        threeDigitAdd,
        tableOf6to8,
      ];

    default:
      // fallback
      return [
        () => [1, 2, 3, "+"],
        () => [4, 5, 9, "+"],
      ];
  }
};


