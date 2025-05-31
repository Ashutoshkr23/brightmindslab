"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getGeneratorsForDay, QuestionGenerator } from "@/lib/dayGenerators";

const QUESTIONS_PER_APPROACH = 20;

const Test: React.FC = () => {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const day = dayParam && !isNaN(Number(dayParam)) ? parseInt(dayParam, 10) : 1;

  const [generators, setGenerators] = useState<QuestionGenerator[]>([]);
  const [approachIndex, setApproachIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 🕒 Time tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const gens = getGeneratorsForDay(day);
    setGenerators(gens);
  }, [day]);

  const currentGenerator = generators[approachIndex];

  const generateQuestion = () => {
    if (!currentGenerator) return;
    const [a, b, ans, op] = currentGenerator();
    setNumber1(a);
    setNumber2(b);
    setCorrectAnswer(ans);
    setOperator(op);
    setTempAnswer(null);
  };

  // ⏱ Start the timer and quiz
  const startApproach = () => {
    setStarted(true);
    setScore(0);
    setQuestionNumber(1);
    setShowResult(false);
    generateQuestion();
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // ⏱ Timer effect (updates every second)
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

  const handleNextApproach = () => {
    if (approachIndex < generators.length - 1) {
      setApproachIndex((prev) => prev + 1);
      startApproach();
    } else {
      alert("✅ Day completed! (Learning task coming soon...)");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // ⏱ Result screen with time
  if (showResult) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-3xl font-bold text-Dark-blue">
          Score: {score} / {QUESTIONS_PER_APPROACH}
        </p>
        <p className="text-xl text-gray-700">
          Time Taken: {formatTime(elapsedTime)}
        </p>
        <div className="flex gap-6">
          <button
            onClick={handleRetry}
            className="bg-Dark-blue text-white px-6 py-2 rounded-lg"
          >
            Practice Again
          </button>
          <button
            onClick={handleNextApproach}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Next Approach
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-xl text-gray-600">Approach {approachIndex + 1} of {generators.length}</p>
        <button
          onClick={startApproach}
          className="bg-Dark-blue text-white text-2xl px-6 py-3 rounded-xl"
        >
          Start Approach {approachIndex + 1}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center p-4">
      <p className="text-xl text-Dark-blue font-semibold">
        Approach {approachIndex + 1} | Question {questionNumber} /{" "}
        {QUESTIONS_PER_APPROACH}
      </p>
      <p className="text-sm text-gray-600">Time: {formatTime(elapsedTime)}</p>
      <div className="flex items-center gap-6">
        <p className="text-3xl font-bold select-none text-Black">
          {number1} {operator} {number2} = ?
        </p>
        <input
          type="number"
          value={tempAnswer ?? ""}
          onChange={handleChange}
          className="border-2 border-Dark-blue text-3xl text-center w-24 rounded focus:outline-none focus:ring-2 focus:ring-Dark-blue/50"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Test;


