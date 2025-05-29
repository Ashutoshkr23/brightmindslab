'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

type Question = {
  question: string;
  answer: string;
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const day = searchParams.get('day');
  
  // States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (day) {
      const dayNum = parseInt(day);
      const qs = generateQuestionsForDay(dayNum);
      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setUserAnswer('');
      setStartTime(Date.now());
      setEndTime(null);
    }
  }, [day]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questions.length) return;

    const correctAnswer = questions[currentIndex].answer;
    if (userAnswer.trim() === correctAnswer) {
      setScore((prev) => prev + 1);
    }
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      inputRef.current?.focus();
    } else {
      setShowResult(true);
      setEndTime(Date.now());
    }
  };

  const handleRetry = () => {
    if (day) {
      const dayNum = parseInt(day);
      const qs = generateQuestionsForDay(dayNum);
      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
      setUserAnswer('');
      setStartTime(Date.now());
      setEndTime(null);
      inputRef.current?.focus();
    }
  };

  if (!day) {
    return <p className="text-center text-light">Day not specified.</p>;
  }

  if (!questions.length) {
    return <p className="text-center text-light">Loading questions...</p>;
  }

  if (showResult) {
    const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(1) : '-';
    return (
      <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full bg-dark p-6 rounded-xl shadow-md text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Quiz Completed!</h1>
          <p className="mb-4 text-lg">Your Score: {score} / {questions.length}</p>
          <p className="mb-8 text-lg">Time Taken: {timeTaken} seconds</p>
          <button
            onClick={handleRetry}
            className="bg-primary hover:bg-primary/90 text-black py-2 px-6 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <main className="min-h-screen bg-background text-light p-6 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-dark p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-primary mb-4">Day {day} Quiz</h1>
        <p className="mb-6 text-lg">{currentQ.question}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            name="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full px-4 py-2 rounded-lg bg-background border border-light text-light focus:outline-none"
            autoComplete="off"
            autoFocus
          />
          <button
            type="submit"
            disabled={userAnswer.trim() === ''}
            className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-lg disabled:opacity-50"
          >
            Submit
          </button>
        </form>

        <p className="mt-4 text-sm text-light/70">
          Question {currentIndex + 1} of {questions.length} | Score: {score}
        </p>
      </div>
    </main>
  );
}

// Helper to generate the full question set for a day
function generateQuestionsForDay(day: number): Question[] {
  // For example purposes, day 1 has 3 concept types:
  // 1. Addition of two-digit number (50,60,70) + 1-digit number (random)
  // 2. Addition of any 1-digit number + 1-digit number
  // 3. Tables 1-5

  // Generate 20 questions from first two addition approaches (randomly mixed)
  const addQuestions: Question[] = [];
  for (let i = 0; i < 20; i++) {
    if (Math.random() < 0.5) {
      // Approach 1: 50, 60, or 70 + 1 digit
      const base = [50, 60, 70][Math.floor(Math.random() * 3)];
      const add = Math.floor(Math.random() * 9) + 1;
      addQuestions.push({
        question: `Calculate: ${base} + ${add}`,
        answer: String(base + add),
      });
    } else {
      // Approach 2: 1 digit + 1 digit
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      addQuestions.push({
        question: `Calculate: ${a} + ${b}`,
        answer: String(a + b),
      });
    }
  }

  // Generate 30 questions from tables 1-5 (random multiples)
  const tableQuestions: Question[] = [];
  for (let i = 0; i < 30; i++) {
    const tableNum = Math.floor(Math.random() * 5) + 1;
    const multiplier = Math.floor(Math.random() * 10) + 1;
    tableQuestions.push({
      question: `What is ${tableNum} × ${multiplier}?`,
      answer: String(tableNum * multiplier),
    });
  }

  // Generate 50 mixed questions from all three concepts
  const mixedQuestions: Question[] = [];
  for (let i = 0; i < 50; i++) {
    const choice = Math.floor(Math.random() * 3);
    if (choice === 0) {
      // Approach 1 again
      const base = [50, 60, 70][Math.floor(Math.random() * 3)];
      const add = Math.floor(Math.random() * 9) + 1;
      mixedQuestions.push({
        question: `Calculate: ${base} + ${add}`,
        answer: String(base + add),
      });
    } else if (choice === 1) {
      // Approach 2 again
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      mixedQuestions.push({
        question: `Calculate: ${a} + ${b}`,
        answer: String(a + b),
      });
    } else {
      // Tables
      const tableNum = Math.floor(Math.random() * 5) + 1;
      const multiplier = Math.floor(Math.random() * 10) + 1;
      mixedQuestions.push({
        question: `What is ${tableNum} × ${multiplier}?`,
        answer: String(tableNum * multiplier),
      });
    }
  }

  return [...addQuestions, ...tableQuestions, ...mixedQuestions];
}
