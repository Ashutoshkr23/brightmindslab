import React from 'react';
export default function VocabCard({ word, meaning, usage }) {
  return (
    <div className="p-4 bg-dark rounded-2xl shadow-card mb-4">
      <h3 className="text-xl font-heading mb-1 text-primary">{word}</h3>
      <p className="text-light mb-2">{meaning}</p>
      <p className="text-gray-400 italic">"{usage}"</p>
    </div>
  );
}