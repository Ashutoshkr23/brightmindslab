"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation"; // Import usePathname

const sampleNotes = [
  { id: 1, title: "Newton's Laws", description: "An object in motion stays in motion...", meanings: ["Inertia", "Force", "Acceleration"], video: "https://youtu.be/example1" },
  { id: 2, title: "Pythagoras Theorem", description: "In a right triangle, a² + b² = c²...", meanings: ["Hypotenuse", "Right Angle", "Triangle"], video: "https://youtu.be/example2" },
  { id: 3, title: "Photosynthesis", description: "Plants convert sunlight into energy...", meanings: ["Chlorophyll", "Glucose", "Oxygen"], video: "https://youtu.be/example3" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(sampleNotes);
  const [selectedNote, setSelectedNote] = useState<null | (typeof sampleNotes)[0]>(null);
  const pathname = usePathname(); // Get current page URL

  // Reset selectedNote when the page changes
  useEffect(() => {
    setSelectedNote(null);
  }, [pathname]);

  const handleSwipe = (note: (typeof sampleNotes)[0]) => {
    setSelectedNote(note);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Swipeable Notes</h1>

      <div className="relative w-full max-w-md h-96">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={() => handleSwipe(note)}
            className="absolute w-full bg-white shadow-md rounded-lg p-4 text-center"
            whileTap={{ scale: 1.1 }}
          >
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-600">{note.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Word Meaning & Video Section */}
      {selectedNote && (
        <div className="w-full max-w-md mt-4 p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold">Related Meanings:</h3>
          <ul className="list-disc pl-5">
            {selectedNote.meanings.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
          <a
            href={selectedNote.video}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-blue-600 underline"
          >
            Watch Explanation Video
          </a>
        </div>
      )}
    </div>
  );
}
