export type QuestionGenerator = () => [number, number, number, string];

export const getGeneratorsForDay = (day: number): QuestionGenerator[] => {
  switch (day) {
    case 1:
      // 1. Single-digit (3–9) + Single-digit (3–9) AND Single-digit (3–9) + Two-digit (10–99)
      const singleDigitAddVariants: QuestionGenerator = () => {
        const isSingleWithDouble = Math.random() > 0.5;

        const a = Math.floor(Math.random() * 7 + 3); // 3–9

        if (isSingleWithDouble) {
          const b = Math.floor(Math.random() * 90 + 10); // 10–99
          return [a, b, a + b, "+"];
        } else {
          const b = Math.floor(Math.random() * 7 + 3); // 3–9
          return [a, b, a + b, "+"];
        }
      };

      // 2. Two-digit + Two-digit (10–99)
      const twoDigitAdd: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 90 + 10); // 10–99
        const b = Math.floor(Math.random() * 90 + 10); // 10–99
        return [a, b, a + b, "+"];
      };

      // 3. Two-digit (10–99) + Three-digit (100–999)
      const twoDigitPlusThreeDigit: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 90 + 10); // 10–99
        const b = Math.floor(Math.random() * 900 + 100); // 100–999
        return [a, b, a + b, "+"];
      };

      // 4. Multiplication table of 29 and 2 (1–10)
      const tableOf29or2: QuestionGenerator = () => {
        const base = Math.random() > 0.5 ? 29 : 2;
        const multiplier = Math.floor(Math.random() * 10 + 1); // 1–10
        return [base, multiplier, base * multiplier, "×"];
      };

      return [
        singleDigitAddVariants,
        twoDigitAdd,
        twoDigitPlusThreeDigit,
        tableOf29or2,
      ];

    default:
      // fallback
      return [
        () => [1, 2, 3, "+"],
        () => [4, 5, 9, "+"],
      ];
  }
};

