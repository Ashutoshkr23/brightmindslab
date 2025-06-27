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

const TOTAL_CORRECT = 10; // need 10 correct answers

interface FinalAttempt {
  id:            string;
  userId:        string;
  userName:      string;
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

  // 1️⃣ load all 4 task generators
  const [generators, setGenerators] = useState<QuestionGenerator[]>([]);
  useEffect(() => {
    setGenerators(getGeneratorsForDay(dayNumber));
  }, [dayNumber]);

  // 2️⃣ competition state
  const [started, setStarted]       = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [a, setA]                   = useState(0);
  const [b, setB]                   = useState(0);
  const [op, setOp]                 = useState('');
  const [ans, setAns]               = useState(0);
  const [input, setInput]           = useState('');
  const [startTime, setStartTime]   = useState(0);
  const [timeTaken, setTimeTaken]   = useState(0);
  const [finished, setFinished]     = useState(false);

  // 3️⃣ leaderboard + recent finals
  const [board, setBoard]           = useState<FinalAttempt[]>([]);
  const [recent, setRecent]         = useState<FinalAttempt[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);

  // pick a random question
  const nextQuestion = () => {
    const pick = generators[Math.floor(Math.random() * generators.length)];
    const [x,y,correct,operator] = pick();
    setA(x); setB(y); setAns(correct); setOp(operator);
    setInput('');
  };

  // start compete
  const handleStart = () => {
    setStarted(true);
    setCorrectCount(0);
    setFinished(false);
    setStartTime(Date.now());
    nextQuestion();
  };

  // auto-advance when input length hits answer length
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    if (val.length === ans.toString().length) {
      const num = parseInt(val, 10);
      // only correct answers count toward the 10
      if (num === ans) {
        const newCount = correctCount + 1;
        if (newCount < TOTAL_CORRECT) {
          setCorrectCount(newCount);
          nextQuestion();
        } else {
          // reached 10 correct → finish
          setCorrectCount(newCount);
          setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
          setFinished(true);
        }
      } else {
        // wrong answer → just move on
        nextQuestion();
      }
    }
  };

  // on finish: write + fetch
  useEffect(() => {
    if (!finished) return;
    (async () => {
      const user = auth.currentUser; if (!user) return;

      // write attempt with userName
      await addDoc(collection(db,'attempts'), {
        userId:        user.uid,
        userName:      user.displayName || 'User',
        challengeType: 'final',
        day:           dayNumber,
        score:         TOTAL_CORRECT,
        total:         TOTAL_CORRECT,
        timeTaken,
        createdAt:     serverTimestamp()
      });

      // top-10 fastest
      const lbQ = query(
        collection(db,'attempts'),
        where('challengeType','==','final'),
        where('day','==',dayNumber),
        orderBy('timeTaken','asc'),
        limit(10)
      );
      const lbSnap = await getDocs(lbQ);
      setBoard(lbSnap.docs.map(d=>({
        id: d.id,
        ...(d.data() as Omit<FinalAttempt,'id'>)
      })));

      // your last 10 finals
      const myQ = query(
        collection(db,'attempts'),
        where('challengeType','==','final'),
        where('day','==',dayNumber),
        where('userId','==',user.uid),
        orderBy('createdAt','desc'),
        limit(10)
      );
      const mySnap = await getDocs(myQ);
      setRecent(mySnap.docs.map(d=>({
        id: d.id,
        ...(d.data() as Omit<FinalAttempt,'id'>)
      })));

      setLoadingBoard(false);
    })();
  }, [finished, timeTaken, dayNumber]);

  // — UI —

  if (!started) {
    return (
      <div className="min-h-screen bg-background text-light flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-heading mb-4">Day {dayNumber} Final Challenge</h1>
        <p className="mb-6">Get {TOTAL_CORRECT} correct answers as fast as you can!</p>
        <button
          onClick={handleStart}
          className="bg-primary text-dark px-6 py-3 rounded-2xl text-lg hover:bg-primary/90 transition"
        >
          🚩 Start Compete
        </button>
      </div>
    );
  }

  if (!finished) {
    return (
      <div className="min-h-screen bg-background text-light p-6 flex flex-col items-center">
        <p className="mb-2">Correct: {correctCount} / {TOTAL_CORRECT}</p>
        <p className="mb-4 text-sm text-gray-400">
          Time: {Math.floor((Date.now() - startTime)/1000)}s
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

  return (
    <div className="min-h-screen bg-background text-light p-6 space-y-6">
      <h1 className="text-3xl font-heading">🏁 Completed in {timeTaken}s</h1>

      {/* Leaderboard */}
      <section>
        <h2 className="text-2xl mb-2">🏆 Top 10 Fastest</h2>
        {loadingBoard ? (
          <p>Loading leaderboard…</p>
        ) : (
          <table className="w-full bg-dark rounded-2xl shadow-card overflow-hidden">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="p-2">#</th><th>Name</th><th>Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {board.map((r,i) => (
                <tr key={r.id} className={i%2 ? 'bg-background' : 'bg-dark'}>
                  <td className="p-2">{i+1}</td><td className="p-2">{r.userName}</td><td className="p-2">{r.timeTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Your Recent Finals */}
      <section>
        <h2 className="text-2xl mb-2">🎖️ Your Last Finals</h2>
        {recent.length === 0 ? (
          <p>No previous finals.</p>
        ) : (
          recent.map(r => (
            <div key={r.id} className="bg-dark p-4 rounded-2xl shadow-card mb-2">
              <p className="text-sm text-secondary">
                {r.createdAt.toDate().toLocaleString()}
              </p>
              <p>Time: <strong>{r.timeTaken}s</strong></p>
            </div>
          ))
        )}
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