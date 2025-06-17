// lib/dayNotes.ts

export type NoteData = {
  title: string;
  content: string;
};

export const getNotesForDay = (day: number): NoteData[] => {
  switch (day) {
    case 1:
      return [
        {
          title: "Single Digit + Single Digit / Two Digit + Single Digit",
          content: [
            "- Use the 'make 10' trick to simplify.",
            "- Example: 8 + 7 → 8 + 2 = 10, then 10 + 5 = 15.",
            "- For two-digit + one-digit, add units first.",
            "- Example: 76 + 8 → 6 + 8 = 14, then 70 + 14 = 84.",
          ].join("\n"),
        },
        {
          title: "Addition of Two Digit Numbers",
          content: [ 
            "- Break down numbers into tens and units.",
            "- Example: 58 + 76 → (50 + 8) + (70 + 6).",
            "- Add unit digits first: 8 + 6 = 14.",
            "- Then add tens: 50 + 70 = 120.",
            "- Finally, add both: 120 + 14 = 134.",
            "- Example: 58 + 76 = 134.",
          ].join("\n"),
        },
        {
          title: "Two Digit + Three Digit Addition",
          content: [
            "- Break down both numbers into hundreds, tens, and units.",
            "- Example: 76 + 245 → (70 + 6) + (200 + 40 + 5).",
            "- Add units: 6 + 5 = 11.",
            "- Add tens: 70 + 40 = 110.",
            "- Add hundreds: 200.",
            "- Then add all parts: 200 + 110 + 11 = 321.",
            "- Example: 76 + 245 = 321.",
          ].join("\n"),
        },
        {
          title: "Multiplication with 29 and 2 (Trick Method)",
          content: [
            "- For 29 × N: use shortcut → (30 × N) - N.",
            "- Example: 29 × 6 = 180 - 6 = 174.",
            "- For 2 × N: just double the number.",
            "- Example: 2 × 7 = 14.",
          ].join("\n"),
        },
      ];

    default:
      return [
        {
          title: "Coming Soon",
          content: "- Concept notes will be added here shortly.",
        },
      ];
  }
};
