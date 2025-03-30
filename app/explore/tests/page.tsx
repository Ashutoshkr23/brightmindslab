"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sampleNotes = [
  { id: 1, title: "Newton's Laws", image: "/images/newton.jpg", text: "An object in motion stays in motion..." },
  { id: 2, title: "Pythagoras Theorem", image: "/images/pythagoras.jpg", text: "In a right triangle, a² + b² = c²..." },
  { id: 3, title: "Photosynthesis", image: "/images/photosynthesis.jpg", text: "Plants convert sunlight into energy..." },
  { id: 4, title: "Gravity", image: "/images/gravity.jpg", text: "Gravity pulls objects toward Earth..." },
  { id: 5, title: "Evolution", image: "/images/evolution.jpg", text: "Species change over generations..." },
];

export default function NotesPage() {
  const [index, setIndex] = useState(0);
  const [swipeMessage, setSwipeMessage] = useState("");
  const [readAgain, setReadAgain] = useState<{ id: number; title: string }[]>([]);

  // Function to clear the message after 1.5 sec
  useEffect(() => {
    if (swipeMessage) {
      const timer = setTimeout(() => setSwipeMessage(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [swipeMessage]);

  const handleSwipe = (offsetX: number, offsetY: number) => {
    const threshold = 100;

    if (offsetX < -threshold) {
      if (index < sampleNotes.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(-1); // Move to Read Again List
      }
      setSwipeMessage("");
    } else if (offsetX > threshold && index > 0) {
      setIndex(index - 1);
      setSwipeMessage("");
    } else if (offsetY < -threshold) {
      setSwipeMessage("Swiped Up");
    } else if (offsetY > threshold) {
      setReadAgain((prev) => [...prev, { id: sampleNotes[index].id, title: sampleNotes[index].title }]);
      setSwipeMessage("Added to Read Again");
      if (index < sampleNotes.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(-1); // Move to Read Again List
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      {index >= 0 ? (
        <motion.div
          key={sampleNotes[index].id}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={(_, info) => handleSwipe(info.offset.x, info.offset.y)}
          className="w-full h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4"
        >
          <h2 className="text-2xl font-bold">{sampleNotes[index].title}</h2>
          <img
            src={sampleNotes[index].image}
            alt={sampleNotes[index].title}
            className="w-full max-w-xs h-60 object-cover my-4 rounded-lg shadow-md"
          />
          <p className="text-gray-600 text-center">{sampleNotes[index].text}</p>
        </motion.div>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Read Again List</h2>
          <ul className="list-disc text-lg">
            {readAgain.map((note) => (
              <li key={note.id}>{note.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Swipe message (disappears automatically) */}
      {swipeMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-10 bg-black text-white px-4 py-2 rounded-lg"
        >
          {swipeMessage}
        </motion.div>
      )}
    </div>
  );
}
