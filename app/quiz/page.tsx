"use client";
import React, { useState } from "react";

// Moved generateNumbersAndSum here
const generateNumbersAndSum = (): [number, number, number, string] => {
  const operators = ["+", "-", "*"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let num1 = Math.floor(Math.random() * 90 + 10); // 10 to 99
  let num2 = Math.floor(Math.random() * 90 + 10);

  // Make sure subtraction doesn't go negative
  if (operator === "-" && num2 > num1) {
    [num1, num2] = [num2, num1];
  } else if (operator === "*") {
    // For multiplication, use smaller numbers
    num1 = Math.floor(Math.random() * 10 + 1);
    num2 = Math.floor(Math.random() * 10 + 1);
  }

  let sum = 0;
  switch (operator) {
    case "+":
      sum = num1 + num2;
      break;
    case "-":
      sum = num1 - num2;
      break;
    case "*":
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
  const [enteredAnswer, setEnteredAnswer] = useState<number | null>(null);
  const [number1, setNumber1] = useState<number | null>(null);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);
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
    const inputLength = String(inputValue).length;
    const sumLength = String(result).length;
    if (inputLength === sumLength) {
      setEnteredAnswer(inputValue);
      handleAnswer(inputValue, result);
      console.log("handle answer called");
      console.log(inputValue);
    }
  };

  const handleAnswer = (input: number | null, result: number | null) => {
    setEnteredAnswer(input);
    if (input === result) {
      setScore(score + 1);
    }
    if (questionNumber < 60) {
      setQuestionNumber(questionNumber + 1);
      const [num1, num2, sum, operator] = generateNumbersAndSum();
      setNumber1(num1);
      setNumber2(num2);
      setOperators(operator);
      setResult(sum);
      setTempAnswer(null);
    } else {
      setGameOver(true);
      setTempAnswer(null);
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
    setEnteredAnswer(null);
    setTempAnswer(null);
    setNumber1(null);
    setNumber2(null);
    setOperators(null);
    setResult(null);
  };

  if (!started) {
    return (
      <button
        className="h-10 bg-Dark-blue px-10 w-40 py-2 rounded-2xl mx-auto flex justify-center items-center"
        onClick={handleStart}
      >
        <p className="text-Black text-3xl"> Start </p>
      </button>
    );
  }

  if (gameOver) {
    const timeTaken = endTime && startTime ? (endTime - startTime) / 1000 : 0;
    return (
      <div className="flex flex-col gap-6 justify-center items-center">
        <p className="text-3xl">
          Score: {score}/60
        </p>
        <p className="text-3xl">
          Time taken: {timeTaken} seconds
        </p>
        <button
          className="h-10 bg-Dark-blue px-10 w-40 py-2 rounded-2xl mx-auto flex justify-center items-center"
          onClick={handleRetry}
        >
          <p className="text-Black text-3xl"> Retry </p>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-4xl">Question {questionNumber}/60:</p>
      <div className="flex gap-4">
        <p className="text-4xl mt-4">
          {number1} {operators} {number2} = ?
        </p>
        <input
          className="text-Black mt-4 text-4xl rounded w-20 border-black border"
          type="number"
          value={tempAnswer === null ? "" : tempAnswer}
          onChange={handleChange}
          autoFocus
        />
      </div>
      <p></p>
    </div>
  );
};

export default Test;

