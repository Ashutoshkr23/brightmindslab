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
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';

// Define the structure for an attempt
interface Attempt {
  id: string;
  challengeType: 'math' | 'rules' | 'task' | 'final';
  day: number;
  taskNo?: number;
  score: number;
  total?: number;
  timeTaken: number; // seconds
  createdAt: Timestamp;
}

export default function QuizClient() {
  const { day, task } = useParams();
  const dayNumber = parseInt(day as string || '1', 10);
  const taskNumber = parseInt(task as string || '1', 10);

  // --- NEW: State for Admin Mode ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [questionsPerApproach, setQuestionsPerApproach] = useState(20); // Default to 20

  // Question state
  const [generators, setGenerators] = useState<QuestionGenerator[]>([]);
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);

  // Timing & result
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Recent attempts
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  // --- NEW: Effect to check for admin status ---
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().isAdmin) {
          setIsAdmin(true);
          setQuestionsPerApproach(10); // Set questions to 10 for admins
        } else {
          setQuestionsPerApproach(20); // Ensure it's 20 for regular users
        }
      }
    };
    checkAdminStatus();
  }, []);


  // Load generators for the day
  useEffect(() => {
    setGenerators(getGeneratorsForDay(dayNumber));
  }, [dayNumber]);

  const currentGenerator = generators[taskNumber - 1];

  // Generate a new question
  const generateQuestion = () => {
    if (!currentGenerator) return;
    const [a, b, ans, op] = currentGenerator();
    setNumber1(a);
    setNumber2(b);
    setCorrectAnswer(ans);
    setOperator(op);
    setTempAnswer(null);
  };

  // Start the quiz
  const startApproach = () => {
    setStarted(true);
    setScore(0);
    setQuestionNumber(1);
    setShowResult(false);
    generateQuestion();
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, startTime]);

  // Handle user input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setTempAnswer(isNaN(val) ? null : val);
    if (correctAnswer !== null && !isNaN(val) && val.toString().length === correctAnswer.toString().length) {
      handleAnswer(val);
    }
  };

  // Check the answer
  const handleAnswer = (userAnswer: number) => {
    if (correctAnswer === null) return;
    if (userAnswer === correctAnswer) setScore(s => s + 1);

    // Use the state variable for the question limit
    if (questionNumber < questionsPerApproach) {
      setQuestionNumber(n => n + 1);
      generateQuestion();
    } else {
      setShowResult(true);
      setStarted(false);
    }
  };

  // Log attempt and fetch recent attempts when the quiz finishes
  useEffect(() => {
    if (!showResult) return;
    const logAndFetch = async () => {
      const user = auth.currentUser;
      if (user) {
        // Log this attempt to Firestore
        await addDoc(collection(db, 'attempts'), {
          userId: user.uid,
          challengeType: 'task',
          day: dayNumber,
          taskNo: taskNumber,
          score,
          total: questionsPerApproach, // Log the correct total
          timeTaken: elapsedTime,
          createdAt: serverTimestamp(),
        });

        // Query the last 10 attempts for this task
        const q = query(
          collection(db, 'attempts'),
          where('userId', '==', user.uid),
          where('challengeType', '==', 'task'),
          where('day', '==', dayNumber),
          where('taskNo', '==', taskNumber),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        const data: Attempt[] = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Attempt, 'id'>)
        }));
        setRecentAttempts(data);
      }
      setLoadingAttempts(false);
    };
    logAndFetch();
  }, [showResult, dayNumber, taskNumber, score, elapsedTime, questionsPerApproach]);

  const handleRetry = () => startApproach();
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}m ${sec}s`;
  };

  // — RESULT SCREEN —
  if (showResult) {
    const isLast = taskNumber === generators.length;
    return (
      <div className="flex flex-col items-center bg-background text-light min-h-screen p-6 gap-4">
        <h1 className="text-3xl font-bold text-primary mt-20">
          ✅ Task {taskNumber} Completed
        </h1>
        <p className="text-2xl">Score: {score} / {questionsPerApproach}</p> {/* Use dynamic total */}
        <p className="text-lg text-gray-400">Time: {formatTime(elapsedTime)}</p>
        
        {/* Navigation buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button onClick={handleRetry} className="bg-primary text-dark px-6 py-2 rounded-xl hover:bg-opacity-90">
            🔁 Retry
          </button>
          <button onClick={() => window.location.href=`/challenge/math/day/${dayNumber}`} className="bg-secondary text-white px-6 py-2 rounded-xl hover:bg-opacity-90">
            📋 Back
          </button>
          {!isLast && (
            <button onClick={() => window.location.href=`/challenge/math/day/${dayNumber}/task/${taskNumber+1}`} className="bg-success text-dark px-6 py-2 rounded-xl hover:bg-opacity-90">
              ⏭️ Next
            </button>
          )}
        </div>
        
        {/* Recent attempts section */}
        <section className="w-full max-w-lg mt-12">
          <h2 className="text-2xl font-heading mb-4">Your Last 10 Attempts</h2>
          {loadingAttempts ? <p>Loading attempts…</p> :
            recentAttempts.length === 0 ? <p>No attempts yet.</p> :
            <div className="space-y-3">
              {recentAttempts.map(a=>(
                <div key={a.id} className="bg-dark p-4 rounded-2xl shadow-card">
                  <p className="text-sm text-secondary">{a.createdAt.toDate().toLocaleString()}</p>
                  <h3 className="text-lg font-heading">Task {a.taskNo} of Day {a.day}</h3>
                  <p>Score: <strong>{a.score}</strong> | Time: <strong>{a.timeTaken}s</strong></p>
                </div>
              ))}
            </div>
          }
        </section>
      </div>
    );
  }

  // — START SCREEN —
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center bg-background text-light min-h-screen p-6">
        <h2 className="text-3xl mb-2">Day {dayNumber} - Task {taskNumber}</h2>
        {isAdmin && <p className="text-yellow-400 mb-6">(Admin Mode: 10 Questions)</p>} {/* Admin indicator */}
        <button onClick={startApproach} className="bg-primary text-dark text-2xl px-6 py-2 rounded-xl">
          🚀 Start Task
        </button>
      </div>
    );
  }

  // — QUESTION SCREEN —
  return (
    <div className="flex flex-col items-center bg-background text-light h-screen p-6">
      <h2 className="text-2xl mb-2">Day {dayNumber} — Task {taskNumber}</h2>
      <p className="text-lg mb-1">Question {questionNumber} / {questionsPerApproach}</p> {/* Use dynamic total */}
      <p className="text-sm text-gray-400 mb-4">Time: {formatTime(elapsedTime)}</p>

      <div className="bg-dark border border-gray-700 rounded-xl shadow-lg w-full p-6 flex flex-col items-center">
        <p className="text-4xl mb-4 font-bold">{number1} {operator} {number2} = ?</p>
        <input
          type="number"
          value={tempAnswer ?? ''}
          onChange={handleChange}
          autoFocus
          className="w-full text-center text-3xl border border-gray-300 rounded-lg p-2"
        />
      </div>
    </div>
  );
}


