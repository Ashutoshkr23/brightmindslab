'use client';

import { useState, useEffect } from 'react';
import { useRouter }        from 'next/navigation';
import { auth, db }         from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
}                           from 'firebase/firestore';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);

  // Form state
  const [name, setName]                             = useState('');
  const [preparingFor, setPreparingFor]             = useState('');
  const [otherPreparingFor, setOtherPreparingFor]   = useState('');
  const [englishFocus, setEnglishFocus]             = useState('');
  const [practiceTime, setPracticeTime]             = useState('');
  const [notifyEmail, setNotifyEmail]               = useState(false);
  const [notifyPush, setNotifyPush]                 = useState(false);
  const [interfaceLanguage, setInterfaceLanguage]   = useState('Hindi & English');

  // 1️⃣ Ensure user is signed in, and hasn't onboarded yet
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async user => {
      if (!user) {
        router.replace('/'); // not signed in
        return;
      }
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        router.replace('/dashboard'); // already onboarded
      } else {
        setLoading(false); // show form
      }
    });
    return () => unsub();
  }, [router]);

  // 2️⃣ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const user = auth.currentUser;
    if (!user) {
      router.replace('/');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        preparingFor:
          preparingFor === 'Other' ? otherPreparingFor : preparingFor,
        englishFocus,
        practiceTime,
        notifications: {
          email: notifyEmail,
          push:  notifyPush,
        },
        interfaceLanguage,
        joinedAt: serverTimestamp(),
      });
      router.replace('/dashboard');
    } catch (err) {
      console.error('Onboarding error', err);
      alert('Failed to save profile. Check console.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-light">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-light flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-heading mb-8">Welcome to Bright Minds!</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-dark rounded-2xl shadow-card p-8 space-y-6"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-background text-light placeholder:text-secondary"
            placeholder="Enter your name"
          />
        </div>

        {/* Preparing For */}
        <div>
          <label className="block mb-1">Preparing For</label>
          <select
            value={preparingFor}
            onChange={e => setPreparingFor(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-background text-light"
          >
            <option value="" disabled>Select an option</option>
            <option>School</option>
            <option>Bank PO</option>
            <option>SSC</option>
            <option>12th Board</option>
            <option>Other</option>
          </select>
          {preparingFor === 'Other' && (
            <input
              type="text"
              value={otherPreparingFor}
              onChange={e => setOtherPreparingFor(e.target.value)}
              required
              className="mt-3 w-full px-4 py-2 rounded-xl bg-background text-light placeholder:text-secondary"
              placeholder="Please specify"
            />
          )}
        </div>

        {/* English Focus Level */}
        <div>
          <label className="block mb-1">English Focus Level</label>
          <select
            value={englishFocus}
            onChange={e => setEnglishFocus(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-background text-light"
          >
            <option value="" disabled>Select level</option>
            <option>Vocabulary</option>
            <option>Basic Grammar</option>
            <option>Sentence Formation</option>
          </select>
        </div>

        {/* Preferred Practice Time */}
        <div>
          <label className="block mb-1">Preferred Practice Time</label>
          <select
            value={practiceTime}
            onChange={e => setPracticeTime(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-background text-light"
          >
            <option value="" disabled>When do you prefer to practice?</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <label className="block mb-1">Notification Preferences</label>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={e => setNotifyEmail(e.target.checked)}
              id="notifyEmail"
              className="h-4 w-4 text-primary bg-background border-secondary rounded"
            />
            <label htmlFor="notifyEmail">Email reminders</label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifyPush}
              onChange={e => setNotifyPush(e.target.checked)}
              id="notifyPush"
              className="h-4 w-4 text-primary bg-background border-secondary rounded"
            />
            <label htmlFor="notifyPush">In-app push notifications</label>
          </div>
        </div>

        {/* Interface Language */}
        <div>
          <label className="block mb-1">Interface Language</label>
          <select
            value={interfaceLanguage}
            onChange={e => setInterfaceLanguage(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-background text-light"
          >
            <option>Hindi & English</option>
            <option>English only</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-xl ${
            submitting
              ? 'bg-secondary text-light cursor-not-allowed'
              : 'bg-primary text-light hover:opacity-90'
          }`}
        >
          {submitting ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </div>
  );
}

