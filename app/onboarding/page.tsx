'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  onboardingComplete?: boolean;
  name?: string;
  state?: string;
  exam?: string;
  practiceTime?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [exam, setExam] = useState('');
  const [practiceTime, setPracticeTime] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as UserData;
        if (data.onboardingComplete) {
          router.push('/dashboard');
          return;
        }
        setName(data.name || user.displayName || '');
        setState(data.state || '');
        setExam(data.exam || '');
        setPracticeTime(data.practiceTime || '');
      } else {
        setName(user.displayName || '');
      }
    };
    loadProfile();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), {
      name,
      state,
      exam,
      practiceTime,
      email: user.email,
      onboardingComplete: true,
      joinedAt: new Date().toISOString(),
    });
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-background text-light flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-dark p-6 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-primary text-center">Welcome!</h1>
        <div className="space-y-2">
          <label className="block text-sm">Name</label>
          <input className="w-full p-2 rounded bg-gray-800" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">State</label>
          <input className="w-full p-2 rounded bg-gray-800" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Exam Preparing For</label>
          <input className="w-full p-2 rounded bg-gray-800" value={exam} onChange={(e) => setExam(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Practice Time per Day</label>
          <input className="w-full p-2 rounded bg-gray-800" value={practiceTime} onChange={(e) => setPracticeTime(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-secondary text-white py-2 rounded-2xl">Continue</button>
      </form>
    </main>
  );
}
