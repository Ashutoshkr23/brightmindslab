export type QuestionGenerator = () => [number, number, number, string];

export const getGeneratorsForDay = (day: number): QuestionGenerator[] => {
  switch (day) {
    case 1:
      // 1. Single-digit addition (both > 5, exclude 0)
      const singleDigitAdd: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 4 + 6); // 6–9
        const b = Math.floor(Math.random() * 4 + 6); // 6–9
        return [a, b, a + b, "+"];
      };

      // 2. Two-digit + one-digit
      const twoDigitPlusOne: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 90 + 10); // 10–99
        const b = Math.floor(Math.random() * 9 + 1); // 1–9
        return [a, b, a + b, "+"];
      };

      // 3. Three-digit + one/two-digit
      const threeDigitPlusSmall: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 900 + 100); // 100–999
        const b = Math.random() > 0.5
          ? Math.floor(Math.random() * 90 + 10) // 10–99
          : Math.floor(Math.random() * 9 + 1);  // 1–9
        return [a, b, a + b, "+"];
      };

      // 4. Multiplication with 29 or 30, up to 10
      const multiply29or30: QuestionGenerator = () => {
        const base = Math.random() > 0.5 ? 29 : 30;
        const multiplier = Math.floor(Math.random() * 10 + 1); // 1–10
        return [base, multiplier, base * multiplier, "×"];
      };

      return [
        singleDigitAdd,
        twoDigitPlusOne,
        threeDigitPlusSmall,
        multiply29or30,
      ];

    default:
      // fallback
      return [
        () => [1, 2, 3, "+"],
        () => [4, 5, 9, "+"],
      ];
  }
};


