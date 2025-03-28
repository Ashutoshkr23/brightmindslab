// app/explore/notes/page.js
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cards = [
  { title: 'Card 1', description: 'Description for card 1.' },
  { title: 'Card 2', description: 'Description for card 2.' },
  { title: 'Card 3', description: 'Description for card 3.' },
  { title: 'Card 4', description: 'Description for card 4.' },
  { title: 'Card 5', description: 'Description for card 5.' },
];

export default function Notes() {
  const [current, setCurrent] = useState(0);

  const handleSwipe = () => {
    setCurrent((prev) => (prev + 1) % cards.length);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Swipeable Notes</h1>

      <div className="relative w-full max-w-sm h-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            onClick={handleSwipe}
            className="absolute inset-0 flex flex-col justify-center items-center bg-white shadow-lg rounded-xl cursor-pointer p-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {cards[current].title}
            </h2>
            <p className="text-center text-gray-600">
              {cards[current].description}
            </p>
            <span className="mt-4 text-xs text-gray-400">Tap to swipe →</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}