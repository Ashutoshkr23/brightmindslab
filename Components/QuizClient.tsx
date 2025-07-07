'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { challengeConfig, StarRating } from '@/lib/dayGenerators'
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

// The interface remains, ensuring type safety for your Firestore documents.
interface Attempt {
  id: string;
  challengeType: 'math' | 'rules' | 'task' | 'final';
  day: number;
  taskNo?: number;
  score: number;
  total?: number; // Total questions attempted
  timeTaken: number;
  createdAt: Timestamp;
  starsEarned?: number;
  proTag?: string | null;
}

// Helper function to calculate star ratings.
const getStarRating = (time: number, ratingConfig: StarRating) => {
    if (time <= ratingConfig.pro.maxTime) return { stars: 3, tag: ratingConfig.pro.label };
    if (time <= ratingConfig.threeStar.maxTime) return { stars: 3, tag: null };
    if (time <= ratingConfig.twoStar.maxTime) return { stars: 2, tag: null };
    return { stars: 1, tag: null };
};

// --- CHANGE 2: The goal is now based on correct answers. ---
const CORRECT_ANSWERS_GOAL = 10;

export default function QuizClient() {
  const { day, task } = useParams();
  const dayNumber = parseInt(day as string || '1', 10);
  const taskNumber = parseInt(task as string || '1', 10);

  // All your original state variables are preserved.
  const [isAdmin, setIsAdmin] = useState(false);
  const [started, setStarted] = useState(false);
  
  // `score` tracks correct answers, `questionCount` tracks total attempts.
  const [score, setScore] = useState(0); 
  const [questionCount, setQuestionCount] = useState(0); 

  const [number1, setNumber1] = useState<number | null>(null);
  const [number2, setNumber2] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [tempAnswer, setTempAnswer] = useState<number | null>(null);
  
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  
  // Your config-loading logic is unchanged.
  const challengeDayConfig = challengeConfig[dayNumber];
  const currentTask = challengeDayConfig?.tasks[taskNumber - 1];
  const currentGenerator = currentTask?.generator;
  const totalTasksInDay = challengeDayConfig?.tasks.length || 0;

  // Your effects for checking admin and timing are unchanged.
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().isAdmin) setIsAdmin(true);
      }
    };
    checkAdminStatus();
  }, []);

  const generateQuestion = () => {
    if (!currentGenerator) return;
    const { operands, answer, operator } = currentGenerator();
    setNumber1(operands[0]);
    setNumber2(operands[1]);
    setCorrectAnswer(answer);
    setOperator(operator);
    setTempAnswer(null);
  };

  const startApproach = () => {
    setStarted(true);
    setScore(0);
    setQuestionCount(1); // Start with the first question.
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
    const val = parseInt(e.target.value);
    setTempAnswer(isNaN(val) ? null : val);
    if (correctAnswer !== null && !isNaN(val) && val.toString().length === correctAnswer.toString().length) {
      handleAnswer(val);
    }
  };

  // --- CHANGE 2 (Implementation): Answer logic now targets 10 correct answers. ---
  const handleAnswer = (userAnswer: number) => {
    if (correctAnswer === null) return;
    
    let newScore = score;
    if (userAnswer === correctAnswer) {
        newScore = score + 1;
        setScore(newScore); // Update score immediately if correct.
    }
    
    if (newScore >= CORRECT_ANSWERS_GOAL) {
      setShowResult(true);
      setStarted(false);
    } else {
      setQuestionCount(n => n + 1); // Increment total attempts.
      generateQuestion();
    }
  };

  // Your logging logic is preserved, with `questionCount` now used for `total`.
  useEffect(() => {
    if (!showResult) return;
    const logAndFetch = async () => {
      const user = auth.currentUser;
      if (user && challengeDayConfig) {
        const { stars, tag } = getStarRating(elapsedTime, challengeDayConfig.starRating);

        await addDoc(collection(db, 'attempts'), {
          userId: user.uid,
          challengeType: 'task',
          day: dayNumber,
          taskNo: taskNumber,
          score,
          total: questionCount, // Log total questions attempted.
          timeTaken: elapsedTime,
          createdAt: serverTimestamp(),
          starsEarned: stars,
          proTag: tag,
        });

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
  }, [showResult, dayNumber, taskNumber, score, elapsedTime, questionCount, challengeDayConfig]);

  const handleRetry = () => startApproach();
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  if (showResult) {
    const isLast = taskNumber === totalTasksInDay;
    const { stars, tag } = getStarRating(elapsedTime, challengeDayConfig.starRating);
    return (
      <div className="flex flex-col items-center bg-background text-light min-h-screen p-6 gap-4">
        <h1 className="text-3xl font-bold text-primary mt-20">
          ✅ {currentTask?.name || `Task ${taskNumber}`} Completed
        </h1>

        {/* --- CHANGE 1: Display Pro tag OR stars, not both. --- */}
        <div className="text-4xl h-12 flex items-center">
            {tag ? (
                <span className="text-3xl px-4 py-2 bg-yellow-400 text-dark rounded-full font-semibold">{tag}</span>
            ) : (
                <span className="text-yellow-400">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
            )}
        </div>
        
        <p className="text-2xl">Score: {score} / {questionCount}</p>
        <p className="text-lg text-gray-400">Time: {formatTime(elapsedTime)}</p>
        
        {/* Your navigation buttons are unchanged. */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button onClick={handleRetry} className="bg-primary text-dark px-6 py-2 rounded-xl hover:bg-opacity-90">🔁 Retry</button>
          <button onClick={() => window.location.href=`/challenge/math/day/${dayNumber}`} className="bg-secondary text-white px-6 py-2 rounded-xl hover:bg-opacity-90">📋 Back</button>
          {!isLast && (<button onClick={() => window.location.href=`/challenge/math/day/${dayNumber}/task/${taskNumber+1}`} className="bg-success text-dark px-6 py-2 rounded-xl hover:bg-opacity-90">⏭️ Next</button>)}
        </div>
        
        <section className="w-full max-w-lg mt-12">
          <h2 className="text-2xl font-heading mb-4">Your Last 10 Attempts</h2>
          {loadingAttempts ? <p>Loading…</p> : recentAttempts.length === 0 ? <p>No attempts yet.</p> :
            <div className="space-y-3">
              {recentAttempts.map(a => (
                <div key={a.id} className="bg-dark p-4 rounded-2xl shadow-card">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-secondary">{a.createdAt.toDate().toLocaleString()}</p>
                    {a.proTag ? <span className="text-xs px-2 py-1 bg-yellow-400 text-dark rounded-full font-semibold">{a.proTag}</span> : a.starsEarned ? <p className="text-yellow-400">{'★'.repeat(a.starsEarned)}{'☆'.repeat(3 - (a.starsEarned || 0))}</p> : null}
                  </div>
                  <h3 className="text-lg font-heading">Task {a.taskNo} of Day {a.day}</h3>
                  <p>Score: <strong>{a.score} / {a.total}</strong> | Time: <strong>{a.timeTaken}s</strong></p>
                </div>
              ))}
            </div>
          }
        </section>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center bg-background text-light min-h-screen p-6 text-center">
        {/* --- CHANGE 3: The main day heading is removed from this screen. --- */}
        <h2 className="text-3xl font-bold mb-4">{currentTask?.name || `Task ${taskNumber}`}</h2>
        <p className="text-lg text-gray-400 mb-6">Answer {CORRECT_ANSWERS_GOAL} questions correctly to complete the task.</p>
        <button onClick={startApproach} className="bg-primary text-dark text-2xl px-8 py-3 rounded-xl mt-4">
          🚀 Start Task
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-background text-light h-screen p-6">
      <h2 className="text-2xl mb-2">{currentTask?.name || `Task ${taskNumber}`}</h2>
      {/* --- CHANGE 2: Progress bar now shows correct answers toward the goal. --- */}
      <p className="text-lg mb-1">Correct Answers: {score} / {CORRECT_ANSWERS_GOAL}</p>
      <p className="text-sm text-gray-400 mb-4">Time: {formatTime(elapsedTime)}</p>

      <div className="bg-dark border border-gray-700 rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center">
        <p className="text-5xl mb-4 font-bold tracking-wider">{number1} {operator} {number2} = ?</p>
        <input
          type="number"
          value={tempAnswer ?? ''}
          onChange={handleChange}
          autoFocus
          className="w-full text-center text-4xl bg-gray-200 text-dark border border-gray-300 rounded-lg p-2"
        />
      </div>
    </div>
  );
}
