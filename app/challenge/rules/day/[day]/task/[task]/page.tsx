'use client';

import { use } from 'react';
import { useState } from 'react';
import { getEnglishQuestionsForRule } from '@/lib/englishQuizData';

export default function EnglishTaskPracticePage({
  params,
}: {
  params: Promise<{ day: string; task: string }>;
}) {
  const { day, task } = use(params);
  const dayNumber = parseInt(day);
  const taskNumber = parseInt(task);

  const questions = getEnglishQuestionsForRule(dayNumber, taskNumber);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (selectedIndex !== null) return; // prevent multiple clicks
    setSelectedIndex(index);

    if (index === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedIndex(null);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">
          📝 Day {dayNumber} - Rule {taskNumber} Practice
        </h1>
        <p className="text-gray-400 text-lg">
          Let’s test your understanding of today’s grammar rule.
        </p>
      </div>

      {showResult ? (
        <section className="bg-dark p-6 rounded-xl w-full max-w-3xl border border-gray-700 shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-green-400 mb-4">✅ Quiz Completed!</h2>
          <p className="text-lg text-white mb-2">Your Score: {score} / {questions.length}</p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <button
              onClick={handleRetry}
              className="bg-primary text-dark px-6 py-2 rounded hover:opacity-90 transition"
            >
              🔁 Retry Quiz
            </button>

            <button
              onClick={() =>
                window.location.href = `/challenge/rules/day/${dayNumber}`
              }
              className="bg-secondary text-white px-6 py-2 rounded hover:opacity-90 transition"
            >
              📘 Back to Day
            </button>

            <button
              onClick={() =>
                window.location.href = `/challenge/rules/day/${dayNumber}/task/${taskNumber + 1}`
              }
              className="bg-success text-dark px-6 py-2 rounded hover:opacity-90 transition"
            >
              ⏭️ Next Task
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-dark p-6 rounded-xl w-full max-w-3xl border border-gray-700 shadow-lg text-center">
          <h2 className="text-xl text-white mb-4">
            Q{currentIndex + 1}: {currentQuestion.question}
          </h2>

          <div className="flex flex-col gap-4 text-left">
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = idx === currentQuestion.answer;
              const isSelected = idx === selectedIndex;

              let bgColor = 'bg-gray-700';
              if (selectedIndex !== null) {
                if (isSelected && isCorrect) bgColor = 'bg-green-600';
                else if (isSelected && !isCorrect) bgColor = 'bg-red-600';
                else if (isCorrect) bgColor = 'bg-green-600';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  className={`${bgColor} px-4 py-2 rounded transition text-white`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
