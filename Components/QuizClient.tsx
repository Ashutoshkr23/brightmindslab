"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getGeneratorsForDay, QuestionGenerator } from "@/lib/dayGenerators";

const QUESTIONS_PER_APPROACH = 20;

const QuizClient: React.FC = () => {
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

  const injectInterstitialAd = () => {
    const script = document.createElement("script");
    script.src = "https://groleegni.net/401/9412753";
    script.async = true;
    try {
      (document.body || document.documentElement).appendChild(script);
    } catch (e) {
      console.error("Ad injection failed", e);
    }
  };

  const delayedStartApproach = () => {
    setTimeout(() => {
      setStarted(true);
      setScore(0);
      setQuestionNumber(1);
      setShowResult(false);
      generateQuestion();
      setStartTime(Date.now());
      setElapsedTime(0);
    }, 1500); // 1.5 second delay after ad
  };

  const startApproach = () => {
    injectInterstitialAd();
    delayedStartApproach();
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

  const handleNextApproach = () => {
    if (approachIndex < generators.length - 1) {
      injectInterstitialAd();
      setTimeout(() => {
        setApproachIndex((prev) => prev + 1);
        delayedStartApproach();
      }, 1500);
    } else {
      alert("✅ Day completed! (Learning task coming soon...)");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (showResult) {
    const isLastApproach = approachIndex === generators.length - 1;

    return (
      <div className="flex flex-col gap-4 bg-background items-center min-h-screen">
        <p className="text-3xl font-bold text-Dark-blue mt-[120px]">
          Score: {score} / {QUESTIONS_PER_APPROACH}
        </p>
        <p className="text-2xl text-gray-700 mt-[60px]">
          Time Taken: {formatTime(elapsedTime)}
        </p>

        <div className="flex flex-col md:flex-row gap-6 mt-[60px]">
          <button
            onClick={handleRetry}
            className="bg-primary text-dark text-xl md:text-2xl px-6 py-3 rounded-xl shadow hover:bg-opacity-90 transition"
          >
            Practice Again
          </button>

          {isLastApproach ? (
            <button
              onClick={() => window.location.href = '/challenge'}
              className="bg-red-600 text-white text-xl md:text-2xl px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
            >
              Back to Home
            </button>
          ) : (
            <button
              onClick={handleNextApproach}
              className="bg-secondary text-white text-xl md:text-2xl px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
            >
              Next Approach
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="relative min-h-screen bg-background flex flex-col gap-y-20 ">
        <p className="w-full text-center text-3xl text-light mt-[120px]">
          Task {approachIndex + 1} of {generators.length}
        </p>

        <div className="w-full flex justify-center mt-[120px]">
          <button
            onClick={startApproach}
            className="bg-primary text-dark text-2xl md:text-3xl px-6 py-3 rounded-xl shadow hover:bg-[#e08e0b] transition"
          >
            Start Task {approachIndex + 1}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-background justify-center p-4">
      <div>
        <p className="text-3xl text-Dark-blue font-semibold mt-[40px]">
          Approach {approachIndex + 1}
        </p>
        <p className="text-3xl mt-2 text-Dark-blue font-semibold ">
          Question {questionNumber} / {QUESTIONS_PER_APPROACH}
        </p>
      </div>
      <p className="text-xl text-gray-600 mt-[20px]">
        Time: {formatTime(elapsedTime)}
      </p>
      <div className="flex flex-col items-center gap-6">
        <p className="text-4xl font-bold select-none text-Black mt-[20px]">
          {number1} {operator} {number2} = ?
        </p>
        <input
          type="number"
          value={tempAnswer ?? ""}
          onChange={handleChange}
          className="border-2 border-Dark-blue text-black text-3xl text-center w-24 rounded focus:outline-none focus:ring-2 focus:ring-Dark-blue/50 mt-[40px]"
          autoFocus
        />
      </div>
    </div>
  );
};

export default QuizClient;
