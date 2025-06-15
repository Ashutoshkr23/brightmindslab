'use client';

import React, { useEffect, useState } from "react";
import { getGeneratorsForDay, QuestionGenerator } from "@/lib/dayGenerators";

type QuizClientProps = {
  day: number;
  task: number;
};

const QUESTIONS_PER_APPROACH = 20;

const QuizClient: React.FC<QuizClientProps> = ({ day, task }) => {
  const [generators, setGenerators] = useState<QuestionGenerator[]>([]);
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Get question generators for the day
  useEffect(() => {
    const gens = getGeneratorsForDay(day);
    setGenerators(gens);
  }, [day]);

  const currentGenerator = generators[task - 1];

  const generateQuestion = () => {
    if (!currentGenerator) return;
    const [a, b, ans, op] = currentGenerator();
    setNumber1(a);
    setNumber2(b);
    setCorrectAnswer(ans);
    setOperator(op);
    setTempAnswer(null);
  };

  const startApproach = () => {
    setStarted(true);
    setScore(0);
    setQuestionNumber(1);
    setShowResult(false);
    generateQuestion();
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, startTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setTempAnswer(isNaN(value) ? null : value);
    if (
      correctAnswer !== null &&
      !isNaN(value) &&
      value.toString().length === correctAnswer.toString().length
    ) {
      handleAnswer(value);
    }
  };

  const handleAnswer = (userAnswer: number) => {
    if (correctAnswer === null) return;
    if (userAnswer === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (questionNumber < QUESTIONS_PER_APPROACH) {
      setQuestionNumber((prev) => prev + 1);
      generateQuestion();
    } else {
      setShowResult(true);
      setStarted(false);
    }
  };

  const handleRetry = () => {
    startApproach();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (showResult) {
  const isLastTask = task === generators.length;

  return (
    <div className="flex flex-col gap-4 bg-background items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-primary mt-20">✅ Task {task} Completed</h1>
      <p className="text-2xl text-light">Score: {score} / {QUESTIONS_PER_APPROACH}</p>
      <p className="text-lg text-gray-400">Time Taken: {formatTime(elapsedTime)}</p>

      <div className="flex flex-col md:flex-row gap-4 mt-10">
        <button
          onClick={handleRetry}
          className="bg-primary text-dark text-lg px-6 py-2 rounded-xl hover:bg-opacity-90 transition"
        >
          🔁 Retry Task
        </button>

        <button
          onClick={() => window.location.href = `/challenge/math/day/${day}`}
          className="bg-secondary text-white text-lg px-6 py-2 rounded-xl hover:bg-opacity-90 transition"
        >
          📋 Back to Day {day}
        </button>

        {!isLastTask && (
          <button
            onClick={() => window.location.href = `/challenge/math/day/${day}/task/${task + 1}`}
            className="bg-success text-dark text-lg px-6 py-2 rounded-xl hover:bg-opacity-90 transition"
          >
            ⏭️ Next Task
          </button>
        )}
      </div>
    </div>
  );
}


  if (!started) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-light">
        <h2 className="text-3xl font-semibold mb-6">Task {task} of Day {day}</h2>
        <button
          onClick={startApproach}
          className="bg-primary text-dark text-2xl px-6 py-3 rounded-xl shadow hover:bg-opacity-90 transition"
        >
          🚀 Start Task {task}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-light p-4">
      <h2 className="text-2xl font-semibold mb-2">Day {day} - Task {task}</h2>
      <p className="text-xl mb-1">Question {questionNumber} / {QUESTIONS_PER_APPROACH}</p>
      <p className="text-sm text-gray-400 mb-4">Time: {formatTime(elapsedTime)}</p>

      <div className="bg-dark border border-gray-700 p-6 rounded-xl shadow-lg flex flex-col items-center">
        <p className="text-4xl font-bold mb-4">{number1} {operator} {number2} = ?</p>
        <input
          type="number"
          value={tempAnswer ?? ""}
          onChange={handleChange}
          className="text-3xl text-dark text-center border border-gray-300 rounded-lg p-2 w-32"
          autoFocus
        />
      </div>
    </div>
  );
};

export default QuizClient;

