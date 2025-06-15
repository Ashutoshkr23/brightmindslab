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
          title: "Addition of Single Digits (5–9)",
          content:
            "In this task, you’ll add two single-digit numbers between 5 and 9. Example: 7 + 8 = 15. Focus on mental strategies like making 10 first (e.g., 7 + 3 + 5).",
        },
        {
          title: "Two-digit + One-digit Numbers",
          content:
            "You’ll add a two-digit number (like 47) with a one-digit number (like 6). Try breaking the numbers into tens and units to simplify. Example: 47 + 6 = 53.",
        },
        {
          title: "Three-digit + Two-digit Numbers",
          content:
            "This covers larger addition such as 183 + 24. Break the numbers using place value: 183 + 24 = (180 + 20) + (3 + 4).",
        },
        {
          title: "Multiplying with 29 or 30",
          content:
            "Practice multiplying numbers like 29 or 30 with numbers from 1 to 10. Shortcut: 29 × 7 = (30 × 7) - 7 = 203.",
        },
      ];

    default:
      return [
        { title: "Coming Soon", content: "Concept notes will be added here shortly." },
      ];
  }
};
