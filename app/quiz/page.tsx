"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getGeneratorForDay } from "@/lib/dayGenerators";

type QuestionGenerator = () => [number, number, number, string];

const Test: React.FC = () => {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get("day");
  const day = dayParam && !isNaN(Number(dayParam)) ? parseInt(dayParam, 10) : 1;

  const [generator, setGenerator] = useState<QuestionGenerator | null>(null);
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);
  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  useEffect(() => {
    const gen = getGeneratorForDay(day);
    if (typeof gen === "function") {
      setGenerator(() => gen);
    } else {
      console.error("Invalid generator function for day:", day);
    }
  }, [day]);

  const generateQuestion = () => {
    if (!generator) return;
    const [num1, num2, answer, op] = generator();
    setNumber1(num1);
    setNumber2(num2);
    setOperator(op);
    setCorrectAnswer(answer);
    setTempAnswer(null);
  };

  const handleStart = () => {
    if (!generator) return;
    setStarted(true);
    setStartTime(Date.now());
    setQuestionNumber(1);
    generateQuestion();
  };

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
    if (!generator || correctAnswer === null) return;
    if (userAnswer === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (questionNumber < 60) {
      setQuestionNumber((prev) => prev + 1);
      generateQuestion();
    } else {
      setGameOver(true);
      setEndTime(Date.now());
    }
  };

  const handleRetry = () => {
    setStarted(false);
    setScore(0);
    setQuestionNumber(0);
    setStartTime(null);
    setEndTime(null);
    setGameOver(false);
    setTempAnswer(null);
    setNumber1(null);
    setNumber2(null);
    setOperator(null);
    setCorrectAnswer(null);
  };

  if (!generator) {
    return <p className="text-2xl text-Dark-blue">Loading...</p>;
  }

  if (!started) {
    return (
      <button
        onClick={handleStart}
        className="h-12 px-12 rounded-2xl mx-auto flex justify-center items-center bg-Dark-blue hover:bg-Dark-blue/80 transition-colors duration-300"
      >
        <p className="text-Black text-3xl font-semibold select-none">
          Start Day {day}
        </p>
      </button>
    );
  }

  if (gameOver) {
    const timeTaken =
      startTime && endTime ? ((endTime - startTime) / 1000).toFixed(2) : "0";
    return (
      <div className="flex flex-col gap-6 justify-center items-center">
        <p className="text-3xl font-semibold text-Dark-blue">
          Score: {score} / 60
        </p>
        <p className="text-3xl font-semibold text-Dark-blue">
          Time taken: {timeTaken} seconds
        </p>
        <button
          onClick={handleRetry}
          className="h-12 px-12 rounded-2xl bg-Dark-blue hover:bg-Dark-blue/80 transition-colors duration-300"
        >
          <p className="text-Black text-3xl font-semibold select-none">Retry</p>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      <p className="text-4xl font-bold text-Dark-blue">
        Question {questionNumber} / 60
      </p>
      <div className="flex gap-6 items-center">
        <p className="text-4xl font-semibold text-Black select-none">
          {number1} {operator} {number2} = ?
        </p>
        <input
          type="number"
          className="text-Black text-4xl rounded border-2 border-Dark-blue w-24 text-center focus:outline-none focus:ring-4 focus:ring-Dark-blue/50 transition"
          value={tempAnswer ?? ""}
          onChange={handleChange}
          autoFocus
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default Test;
