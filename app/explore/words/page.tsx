
"use client"
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { PanInfo } from "framer-motion";

const sampleNotes = [
  { id: 1, title: "Newton's Laws", description: "An object in motion stays in motion..." },
  { id: 2, title: "Pythagoras Theorem", description: "In a right triangle, a² + b² = c²..." },
  { id: 3, title: "Photosynthesis", description: "Plants convert sunlight into energy..." },
  { id: 4, title: "Gravity", description: "Gravity is the force that pulls objects toward Earth..." },
  { id: 5, title: "Evolution", description: "Species change over generations through natural selection..." },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(sampleNotes);
  const [swipeDirection, setSwipeDirection] = useState("");

  

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo, id: number) => {
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;

    let direction = "";
    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      direction = offsetX > 0 ? "Right" : "Left";
    } else {
      direction = offsetY > 0 ? "Down" : "Up";
    }

    setSwipeDirection(`Swiped ${direction}`);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Swipeable Notes</h1>
      <p className="text-lg mb-4">{swipeDirection || "Swipe any card"}</p>
      <div className="relative w-full max-w-md h-96">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={(event, info) => handleDragEnd(event, info, note.id)}
            className="absolute w-full bg-white shadow-md rounded-lg p-4 text-center"
            whileTap={{ scale: 1.1 }}
          >
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-600">{note.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
