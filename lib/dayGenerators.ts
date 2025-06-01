export type QuestionGenerator = () => [number, number, number, string];

export const getGeneratorsForDay = (day: number): QuestionGenerator[] => {
  switch (day) {
    case 1:
      // 1. Single-digit addition (both 5–9 inclusive)
      const singleDigitAdd: QuestionGenerator = () => {
        const a = Math.floor(Math.random() * 5 + 5); // 5–9
        const b = Math.floor(Math.random() * 5 + 5); // 5–9
        return [a, b, a + b, "+"];
      };

      // 2. Two-digit + one-digit
      //    - Tens digit (x) of two-digit number: 1–9
      //    - Units digit (y): 5–9
      const twoDigitPlusOne: QuestionGenerator = () => {
        const tens = Math.floor(Math.random() * 9 + 1); // 1–9
        const units = Math.floor(Math.random() * 5 + 5); // 5–9
        const a = tens * 10 + units;
        const b = Math.floor(Math.random() * 9 + 1); // 1–9
        return [a, b, a + b, "+"];
      };

      // 3. Three-digit (xyz) + two-digit (xy)
      //    - x: 1–9, y: 8, 9, 0, 1, z: 0–9
      //    - Two-digit: x in 3–9, y: 0–9
      const threeDigitPlusSmall: QuestionGenerator = () => {
        const x1 = Math.floor(Math.random() * 9 + 1); // 1–9
        const yOptions = [8, 9, 0, 1];
        const y1 = yOptions[Math.floor(Math.random() * yOptions.length)];
        const z1 = Math.floor(Math.random() * 10); // 0–9
        const a = x1 * 100 + y1 * 10 + z1;

        const x2 = Math.floor(Math.random() * 7 + 3); // 3–9
        const y2 = Math.floor(Math.random() * 10); // 0–9
        const b = x2 * 10 + y2;

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

