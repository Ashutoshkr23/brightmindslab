'use client';

import { useState, useEffect } from 'react';
import { auth, db }            from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore';

interface Attempt {
  id:         string;
  challengeType: 'math' | 'rules';
  day:        number;
  score:      number;
  timeTaken:  number;       // seconds
  createdAt:  Timestamp;
}

export default function RecentAttempts() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      // Query last 10 attempts by this user
      const q = query(
        collection(db, 'attempts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id:           doc.id,
        ...(doc.data() as Omit<Attempt,'id'>)
      }));
      setAttempts(data);
      setLoading(false);
    };
    fetchAttempts();
  }, []);

  if (loading) {
    return <p className="text-light">Loading recent attempts…</p>;
  }
  if (attempts.length === 0) {
    return <p className="text-light">You have no past attempts yet.</p>;
  }

  return (
    <div className="space-y-4">
      {attempts.map(({ id, challengeType, day, score, timeTaken, createdAt }) => (
        <div
          key={id}
          className="bg-dark rounded-2xl shadow-card p-4"
        >
          <p className="text-sm text-secondary">
            {createdAt.toDate().toLocaleString()}
          </p>
          <h3 className="text-lg font-heading text-light">
            {challengeType === 'math' ? 'Speed Math' : 'Rules'} Day {day}
          </h3>
          <p className="text-light">
            Score: <strong>{score}</strong> | Time: <strong>{timeTaken}s</strong>
          </p>
        </div>
      ))}
    </div>
  );
}

