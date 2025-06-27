// app/challenge/math/day/[day]/compete/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter }      from 'next/navigation';
import { getGeneratorsForDay, QuestionGenerator } from '@/lib/dayGenerators';
import { auth, db }                  from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore';

const TOTAL_QUESTIONS = 10;  // ← testing count

interface FinalAttempt {
  id:            string;
  userId:        string;
  day:           number;
  challengeType: 'final';
  score:         number;
  total:         number;
  timeTaken:     number;
  createdAt:     Timestamp;
}

export default function CompetePage() {
  const router = useRouter();
  const { day } = useParams();
  const dayNumber = parseInt(day as string || '1', 10);

  // 1️⃣ Load all task generators for this day
  const [generators, setGenerators] = useState<QuestionGenerator[]>([]);
  useEffect(() => {
    setGenerators(getGeneratorsForDay(dayNumber));
  }, [dayNumber]);

  // 2️⃣ Competition state
  const [started, setStarted]     = useState(false);
  const [index, setIndex]         = useState(0);
  const [a, setA]                 = useState(0);
  const [b, setB]                 = useState(0);
  const [op, setOp]               = useState('');
  const [ans, setAns]             = useState(0);
  const [input, setInput]         = useState('');
  const [startTime, setStartTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [finished, setFinished]   = useState(false);

  // 3️⃣ Leaderboard & recent finals
  const [board, setBoard]           = useState<FinalAttempt[]>([]);
  const [recent, setRecent]         = useState<FinalAttempt[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);

  // Pick a random question
  const nextQuestion = () => {
    const pick = generators[Math.floor(Math.random() * generators.length)];
    const [x, y, correct, operator] = pick();
    setA(x); setB(y); setAns(correct); setOp(operator);
    setInput('');
  };

  // Start compete
  const handleStart = () => {
    setStarted(true);
    setIndex(1);
    setFinished(false);
    setStartTime(Date.now());
    nextQuestion();
  };

  // Advance when user has typed as many digits as the correct answer
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    // as soon as length matches, advance
    if (val.length === ans.toString().length) {
      // parse to number for correctness check
      const num = parseInt(val, 10);
      const isCorrect = num === ans;

      if (index < TOTAL_QUESTIONS) {
        setIndex(i => i + 1);
        nextQuestion();
      } else {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeTaken(elapsed);
        setFinished(true);
      }

      // you could track score if desired:
      // if (isCorrect) setScore(s => s+1);
    }
  };

  // On finish: write & fetch leaderboard + recent
  useEffect(() => {
    if (!finished) return;
    (async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Write final attempt
      await addDoc(collection(db, 'attempts'), {
        userId:        user.uid,
        challengeType: 'final',
        day:           dayNumber,
        score:         TOTAL_QUESTIONS,  // or track correct count if you like
        total:         TOTAL_QUESTIONS,
        timeTaken,
        createdAt:     serverTimestamp()
      });

      // Fetch top‐10 fastest
      const lbQ = query(
        collection(db, 'attempts'),
        where('challengeType','==','final'),
        where('day','==',dayNumber),
        orderBy('timeTaken','asc'),
        limit(10)
      );
      const lbSnap = await getDocs(lbQ);
      setBoard(lbSnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<FinalAttempt,'id'>)
      })));

      // Fetch your last 10 finals
      const myQ = query(
        collection(db, 'attempts'),
        where('challengeType','==','final'),
        where('day','==',dayNumber),
        where('userId','==',user.uid),
        orderBy('createdAt','desc'),
        limit(10)
      );
      const mySnap = await getDocs(myQ);
      setRecent(mySnap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<FinalAttempt,'id'>)
      })));

      setLoadingBoard(false);
    })();
  }, [finished, timeTaken, dayNumber]);

  // — UI —

  // Before start
  if (!started) {
    return (
      <div className="min-h-screen bg-background text-light flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-heading mb-4">Day {dayNumber} Final Challenge</h1>
        <p className="mb-6">10 random questions – fastest time wins!</p>
        <button
          onClick={handleStart}
          className="bg-primary text-dark px-6 py-3 rounded-2xl text-lg hover:bg-primary/90 transition"
        >
          🚩 Start Compete
        </button>
      </div>
    );
  }

  // During compete
  if (!finished) {
    return (
      <div className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
        <p className="mb-2">
          Question {index} / {TOTAL_QUESTIONS}
        </p>
        <p className="mb-4 text-sm text-gray-400">
          Time: {Math.floor((Date.now() - startTime) / 1000)}s
        </p>
        <div className="bg-dark p-8 rounded-2xl shadow-card mb-4">
          <p className="text-4xl font-bold">{a} {op} {b} = ?</p>
        </div>
        <input
          type="number"
          value={input}
          onChange={handleChange}
          className="border text-dark px-4 py-2 rounded-lg mb-4 w-1/2 text-center"
          autoFocus
        />
      </div>
    );
  }

  // After finish
  return (
    <div className="min-h-screen bg-background text-light p-6 space-y-6">
      <h1 className="text-3xl font-heading">🏁 Completed in {timeTaken}s</h1>

      {/* Leaderboard */}
      <section>
        <h2 className="text-2xl mb-2">🏆 Top 10 Fastest</h2>
        {loadingBoard
          ? <p>Loading leaderboard…</p>
          : (
            <table className="w-full bg-dark rounded-2xl shadow-card overflow-hidden">
              <thead className="bg-secondary text-white">
                <tr>
                  <th className="p-2">#</th>
                  <th>Name</th>
                  <th>Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {board.map((r, i) => (
                  <tr key={r.id} className={i % 2 ? 'bg-background' : 'bg-dark'}>
                    <td className="p-2">{i+1}</td>
                    <td className="p-2">{r.userId}</td>
                    <td className="p-2">{r.timeTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </section>

      {/* Your Recent Finals */}
      <section>
        <h2 className="text-2xl mb-2">🎖️ Your Last Finals</h2>
        {recent.length === 0
          ? <p>No previous finals.</p>
          : recent.map(r => (
              <div
                key={r.id}
                className="bg-dark p-4 rounded-2xl shadow-card mb-2"
              >
                <p className="text-sm text-secondary">
                  {r.createdAt.toDate().toLocaleString()}
                </p>
                <p>
                  Time: <strong>{r.timeTaken}s</strong>
                </p>
              </div>
            ))
        }
      </section>

      <button
        onClick={() => router.replace(`/challenge/math/day/${dayNumber}`)}
        className="mt-6 bg-primary text-dark px-6 py-2 rounded-2xl"
      >
        ← Back to Day {dayNumber}
      </button>
    </div>
  );
}
