'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGeneratorsForDay, QuestionGenerator } from '@/lib/dayGenerators';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore';

const QUESTIONS_PER_APPROACH = 20;

interface Attempt {
  id:         string;
  challengeType: 'math' | 'rules';
  day:        number;
  score:      number;
  timeTaken:  number;       // seconds
  createdAt:  Timestamp;
}

const QuizClient = () => {
  const { day, task } = useParams();
  const dayNumber     = parseInt(day as string || '1', 10);
  const taskNumber    = parseInt(task as string || '1', 10);

  const [generators, setGenerators] = useState<QuestionGenerator[]>([]);
  const [started, setStarted]       = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore]           = useState(0);
  const [number1, setNumber1]       = useState<number | null>(null);
  const [number2, setNumber2]       = useState<number | null>(null);
  const [operator, setOperator]     = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime]   = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 🔴 New state for recent attempts
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  useEffect(() => {
    setGenerators(getGeneratorsForDay(dayNumber));
  }, [dayNumber]);

  const currentGenerator = generators[taskNumber - 1];

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
      setScore(prev => prev + 1);
    }
    if (questionNumber < QUESTIONS_PER_APPROACH) {
      setQuestionNumber(prev => prev + 1);
      generateQuestion();
    } else {
      setShowResult(true);
      setStarted(false);
    }
  };

  // 🔴 Fetch recent 10 attempts once we show the result
  useEffect(() => {
    if (!showResult) return;

    const fetchAttempts = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingAttempts(false);
        return;
      }
      const q = query(
        collection(db, 'attempts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id:         doc.id,
        ...(doc.data() as Omit<Attempt, 'id'>)
      }));
      setRecentAttempts(data);
      setLoadingAttempts(false);
    };

    fetchAttempts();
  }, [showResult]);

  const handleRetry = () => {
    startApproach();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // ———— RESULT SCREEN ————
  if (showResult) {
    const isLastTask = taskNumber === generators.length;

    return (
      <div className="flex flex-col gap-4 bg-background items-center min-h-screen p-6">
        <h1 className="text-3xl font-bold text-primary mt-20">
          ✅ Task {taskNumber} Completed
        </h1>
        <p className="text-2xl text-light">
          Score: {score} / {QUESTIONS_PER_APPROACH}
        </p>
        <p className="text-lg text-gray-400">Time Taken: {formatTime(elapsedTime)}</p>

        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button
            onClick={handleRetry}
            className="bg-primary text-dark text-lg px-6 py-2 rounded-xl hover:bg-opacity-90 transition"
          >
            🔁 Retry Task
          </button>

          <button
            onClick={() => window.location.href = `/challenge/math/day/${dayNumber}`}
            className="bg-secondary text-white text-lg px-6 py-2 rounded-xl hover:bg-opacity-90 transition"
          >
            📋 Back to Day {dayNumber}
          </button>

          {!isLastTask && (
            <button
              onClick={() =>
                window.location.href = `/challenge/math/day/${dayNumber}/task/${taskNumber + 1}`
              }
              className="bg-success text-dark text-lg px-6 py-2 rounded-xl hover:bg-opacity-90 transition"
            >
              ⏭️ Next Task
            </button>
          )}
        </div>

        {/* 🔴 Recent 10 Attempts */}
        <section className="w-full max-w-lg mt-12">
          <h2 className="text-2xl font-heading text-light mb-4">Your Last 10 Attempts</h2>

          {loadingAttempts ? (
            <p className="text-light">Loading attempts…</p>
          ) : recentAttempts.length === 0 ? (
            <p className="text-light">No attempts yet.</p>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map(a => (
                <div
                  key={a.id}
                  className="bg-dark rounded-2xl shadow-card p-4"
                >
                  <p className="text-sm text-secondary">
                    {a.createdAt.toDate().toLocaleString()}
                  </p>
                  <h3 className="text-lg font-heading text-light">
                    {a.challengeType === 'math' ? 'Speed Math' : 'Rules'} Day {a.day}
                  </h3>
                  <p className="text-light">
                    Score: <strong>{a.score}</strong> | Time: <strong>{a.timeTaken}s</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // ——— START SCREEN ———
  if (!started) {
    return (
      <div
        className="min-h-screen flex flex-col gap-y-8 items-center bg-background text-light"
        style={{ paddingTop: '5rem', paddingBottom: '5rem' }}
      >
        <h2 className="text-3xl font-semibold">Task {taskNumber} of Day {dayNumber}</h2>
        <button
          onClick={startApproach}
          className="bg-primary text-dark text-2xl rounded-xl shadow hover:bg-opacity-90 transition"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          🚀 Start Task {taskNumber}
        </button>
      </div>
    );
  }

  // ——— QUESTION SCREEN ———
  return (
    <div
      className="flex flex-col items-center bg-background text-light p-4"
      style={{ height: '100vh', padding: '1rem' }}
    >
      <h2 className="text-2xl font-semibold" style={{ marginBottom: '0.5rem' }}>
        Day {dayNumber} - Task {taskNumber}
      </h2>
      <p className="text-xl" style={{ marginBottom: '0.25rem' }}>
        Question {questionNumber} / {QUESTIONS_PER_APPROACH}
      </p>
      <p className="text-sm text-gray-400" style={{ marginBottom: '1rem' }}>
        Time: {formatTime(elapsedTime)}
      </p>

      <div
        className="bg-dark border w-full border-gray-700 rounded-xl shadow-lg flex flex-col items-center"
        style={{ margin: '1.5rem', padding: '1.5rem' }}
      >
        <p className="text-4xl font-bold" style={{ marginBottom: '1rem' }}>
          {number1} {operator} {number2} = ?
        </p>
        <input
          type="number"
          value={tempAnswer ?? ''}
          onChange={handleChange}
          className="text-3xl text-dark w-full text-center border border-gray-300 rounded-lg"
          style={{ padding: '0.5rem' }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default QuizClient;



