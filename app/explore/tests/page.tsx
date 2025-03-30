"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sampleNotes = [
  {
    id: 1,
    title: "Newton's Laws",
    image: "/images/newton.jpg",
    text: "An object in motion stays in motion...",
    words: { "Motion": "The action of moving", "Inertia": "Resistance to change in motion" },
    video: "https://www.youtube.com/watch?v=kKKM8Y-u7ds"
  },
  {
    id: 2,
    title: "Pythagoras Theorem",
    image: "/images/pythagoras.jpg",
    text: "In a right triangle, a² + b² = c²...",
    words: { "Hypotenuse": "The longest side of a right triangle", "Triangle": "A three-sided polygon" },
    video: "https://www.youtube.com/watch?v=lzGLOv8ZAJg"
  },
  {
    id: 3,
    title: "Photosynthesis",
    image: "/images/photosynthesis.jpg",
    text: "Plants convert sunlight into energy...",
    words: { "Chlorophyll": "Green pigment in plants", "Glucose": "A sugar made by plants" },
    video: "https://www.youtube.com/watch?v=HbIHjsn5cHo"
  }
];

export default function NotesPage() {
  const [index, setIndex] = useState(0);
  const [swipeMessage, setSwipeMessage] = useState("");
  const [readAgain, setReadAgain] = useState<typeof sampleNotes>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false); // Toggle word meaning box

  // Auto-hide swipe message
  useEffect(() => {
    if (swipeMessage) {
      const timer = setTimeout(() => setSwipeMessage(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [swipeMessage]);

  const handleSwipe = (offsetX: number, offsetY: number) => {
    const threshold = 100;

    if (reviewMode) {
      if (offsetX < -threshold || offsetY < -threshold) {
        if (reviewIndex < readAgain.length - 1) {
          setReviewIndex(reviewIndex + 1);
        } else {
          setReviewMode(false);
        }
      }
    } else {
      if (offsetX < -threshold) {
        if (index < sampleNotes.length - 1) {
          setIndex(index + 1);
          setShowInfo(false);
        } else {
          setIndex(-1);
        }
      } else if (offsetY > threshold) {
        setReadAgain((prev) => [...prev, sampleNotes[index]]);
        setSwipeMessage("Added to Read Again");
        if (index < sampleNotes.length - 1) {
          setIndex(index + 1);
        } else {
          setIndex(-1);
        }
      } else if (offsetY < -threshold) {
        setShowInfo(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      {!reviewMode && index >= 0 ? (
        <motion.div
          key={sampleNotes[index].id}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={(_, info) => handleSwipe(info.offset.x, info.offset.y)}
          className="w-full h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4 relative"
          animate={showInfo ? { y: "-20%" } : { y: "0%" }}
        >
          <h2 className="text-2xl font-bold">{sampleNotes[index].title}</h2>
          <img
            src={sampleNotes[index].image}
            alt={sampleNotes[index].title}
            className="w-full max-w-xs h-60 object-cover my-4 rounded-lg shadow-md"
          />
          <p className="text-gray-600 text-center">{sampleNotes[index].text}</p>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 bg-white p-4 rounded-lg shadow-lg w-3/4 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Word Meanings</h3>
              <ul className="text-gray-600">
                {Object.entries(sampleNotes[index].words).map(([word, meaning]) => (
                  <li key={word}><strong>{word}:</strong> {meaning}</li>
                ))}
              </ul>
              <a href={sampleNotes[index].video} target="_blank" className="text-blue-600 underline mt-2 block">
                Watch Video 📺
              </a>
            </motion.div>
          )}
        </motion.div>
      ) : reviewMode && reviewIndex < readAgain.length ? (
        <motion.div
          key={readAgain[reviewIndex].id}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={(_, info) => handleSwipe(info.offset.x, info.offset.y)}
          className="w-full h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4 relative"
          animate={showInfo ? { y: "-20%" } : { y: "0%" }}
        >
          <h2 className="text-2xl font-bold">{readAgain[reviewIndex].title}</h2>
          <img
            src={readAgain[reviewIndex].image}
            alt={readAgain[reviewIndex].title}
            className="w-full max-w-xs h-60 object-cover my-4 rounded-lg shadow-md"
          />
          <p className="text-gray-600 text-center">{readAgain[reviewIndex].text}</p>

          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-10 bg-white p-4 rounded-lg shadow-lg w-3/4 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Word Meanings</h3>
              <ul className="text-gray-600">
                {Object.entries(readAgain[reviewIndex].words).map(([word, meaning]) => (
                  <li key={word}><strong>{word}:</strong> {meaning}</li>
                ))}
              </ul>
              <a href={readAgain[reviewIndex].video} target="_blank" className="text-blue-600 underline mt-2 block">
                Watch Video 📺
              </a>
            </motion.div>
          )}
        </motion.div>
      ) : index === -1 ? (
        readAgain.length > 0 ? (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Read Again List</h2>
            <ul className="list-disc text-lg">
              {readAgain.map((note, i) => (
                <li
                  key={note.id}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => { setReviewMode(true); setReviewIndex(i); }}
                >
                  {note.title} <span className="text-red-500 ml-2 cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    setReadAgain(readAgain.filter((_, j) => j !== i));
                  }}>❌</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-2xl font-bold">Lesson Over 🎉</h2>
            <p className="text-gray-600">You've reviewed all the selected topics.</p>
          </div>
        )
      ) : null}

      {swipeMessage && <motion.div className="absolute bottom-10 bg-black text-white px-4 py-2 rounded-lg">{swipeMessage}</motion.div>}
    </div>
  );
}
