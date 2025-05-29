"use client";
import React, { useState } from "react";

const generateNumbersAndSum = (): [number, number, number, string] => {
  const caseNumber = Math.floor(Math.random() * 3) + 1;
  let num1 = 0;
  let num2 = 0;
  let operator = "";
  let sum = 0;

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
      operator = "*";
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
  const [operators, setOperators] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    setQuestionNumber(1);
    const [num1, num2, sum, operator] = generateNumbersAndSum();
    setNumber1(num1);
    setNumber2(num2);
    setOperators(operator);
    setResult(sum);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value);
    setTempAnswer(inputValue);
    if (result === null) return;
    if (String(inputValue).length === String(result).length) {
      handleAnswer(inputValue, result);
    }
  };

  const handleAnswer = (input: number | null, result: number | null) => {
    if (input === result) {
      setScore((prev) => prev + 1);
    }
    if (questionNumber < 60) {
      setQuestionNumber((prev) => prev + 1);
      const [num1, num2, sum, operator] = generateNumbersAndSum();
      setNumber1(num1);
      setNumber2(num2);
      setOperators(operator);
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
    setOperators(null);
    setResult(null);
  };

  if (!started) {
    return (
      <button
        className="h-12 px-12 rounded-2xl mx-auto flex justify-center items-center bg-Dark-blue hover:bg-Dark-blue/80 transition-colors duration-300"
        onClick={handleStart}
      >
        <p className="text-Black text-3xl font-semibold select-none">Start</p>
      </button>
    );
  }

  if (gameOver) {
    const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : "0";
    return (
      <div className="flex flex-col gap-6 justify-center items-center">
        <p className="text-3xl font-semibold text-Dark-blue">
          Score: {score} / 60
        </p>
        <p className="text-3xl font-semibold text-Dark-blue">
          Time taken: {timeTaken} seconds
        </p>
        <button
          className="h-12 px-12 rounded-2xl mx-auto flex justify-center items-center bg-Dark-blue hover:bg-Dark-blue/80 transition-colors duration-300"
          onClick={handleRetry}
        >
          <p className="text-Black text-3xl font-semibold select-none">Retry</p>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      <p className="text-4xl font-bold text-Dark-blue">Question {questionNumber} / 60:</p>
      <div className="flex gap-6 items-center">
        <p className="text-4xl font-semibold text-Black select-none">
          {number1} {operators} {number2} = ?
        </p>
        <input
          className="text-Black text-4xl rounded border-2 border-Dark-blue w-24 text-center focus:outline-none focus:ring-4 focus:ring-Dark-blue/50 transition"
          type="number"
          value={tempAnswer === null ? "" : tempAnswer}
          onChange={handleChange}
          autoFocus
          inputMode="numeric"
        />
      </div>
    </div>
  );
};

export default Test;
