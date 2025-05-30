"use client";
import React, { useState } from "react";

const generateNumbersAndSum = (): [number, number, number, string] => {
  const caseNumber = Math.floor(Math.random() * 3) + 1;
  let num1 = 0, num2 = 0, operator = "", sum = 0;

  switch (caseNumber) {
    case 1:
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
      operator = "+";
      sum = num1 + num2;
      break;
    case 2:
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = (Math.floor(Math.random() * 9) + 1) * 10;
      operator = "+";
      sum = num1 + num2;
      break;
    case 3:
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      operator = "×";
      sum = num1 * num2;
      break;
  }

  return [num1, num2, sum, operator];
};

const Test: React.FC = () => {
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
  const [result, setResult] = useState<number | null>(null);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    setQuestionNumber(1);
    const [num1, num2, sum, op] = generateNumbersAndSum();
    setNumber1(num1);
    setNumber2(num2);
    setOperator(op);
    setResult(sum);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value);
    if (isNaN(inputValue)) return;
    setTempAnswer(inputValue);
    if (result === null) return;
    if (String(inputValue).length === String(result).length) {
      handleAnswer(inputValue, result);
    }
  };

  const handleAnswer = (input: number | null, result: number | null) => {
    if (input === result) setScore((prev) => prev + 1);
    if (questionNumber < 60) {
      setQuestionNumber((prev) => prev + 1);
      const [num1, num2, sum, op] = generateNumbersAndSum();
      setNumber1(num1);
      setNumber2(num2);
      setOperator(op);
      setResult(sum);
      setTempAnswer(null);
    } else {
      setGameOver(true);
      setEndTime(Date.now());
    }
  };

  const handleRetry = () => {
    setStarted(false);
    setQuestionNumber(0);
    setScore(0);
    setStartTime(null);
    setEndTime(null);
    setGameOver(false);
    setTempAnswer(null);
    setNumber1(null);
    setNumber2(null);
    setOperator(null);
    setResult(null);
  };

  const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : "0";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center bg-background">
      {!started ? (
        <button
          className="bg-Dark-blue hover:bg-Dark-blue/80 text-Black text-3xl font-bold px-10 py-4 rounded-2xl transition-colors duration-300"
          onClick={handleStart}
        >
          Start 60-Second Challenge
        </button>
      ) : gameOver ? (
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-Dark-blue">🧠 Mental Maths Mastery</h2>
          <p className="text-3xl text-Black font-semibold">Score: {score} / 60</p>
          <p className="text-2xl text-Black">⏱️ Time taken: {timeTaken} seconds</p>
          <button
            onClick={handleRetry}
            className="mt-4 bg-Dark-blue text-Black text-xl font-semibold px-8 py-3 rounded-xl hover:bg-Dark-blue/80 transition"
          >
            Retry Challenge
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-3xl font-bold text-Dark-blue">
            Question {questionNumber} of 60
          </h2>
          <div className="flex items-center gap-6">
            <p className="text-4xl font-semibold text-Black select-none">
              {number1} {operator} {number2} = ?
            </p>
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              autoComplete="off"
              className="text-4xl text-black text-center w-24 rounded border-2 border-Dark-blue focus:outline-none focus:ring-4 focus:ring-Dark-blue/50 transition"
              value={tempAnswer === null ? "" : tempAnswer}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;

