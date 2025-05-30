export type GeneratorFunc = () => [number, number, number, string];

const dayGenerators: Record<number, GeneratorFunc> = {
  1: () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return [a, b, a + b, "+"];
  },
  2: () => {
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 20);
    return [a, b, a - b, "-"];
  },
  // Add more day functions as needed
};

export const getGeneratorForDay = (day: number): GeneratorFunc => {
  return dayGenerators[day] || (() => [0, 0, 0, "?"]);
};

