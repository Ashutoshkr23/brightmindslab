'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'competitive'
  const [cls, setCls] = useState('');
  const [school, setSchool] = useState('');
  const [otherSchool, setOtherSchool] = useState('');
  const [exam, setExam] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 1️⃣ Check auth & existing profile
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Guest users go straight to dashboard
        router.replace('/dashboard');
        return;
      }
      // If already onboarded, skip form
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        router.replace('/dashboard');
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // 2️⃣ Submit handler: write to Firestore
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const user = auth.currentUser;
    if (!user) {
      router.replace('/dashboard');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        userType,
        class: userType === 'student' ? cls : null,
        school: userType === 'student'
          ? (school === 'Other' ? otherSchool : school)
          : null,
        exam: userType === 'competitive' ? exam : null,
        englishLevel,
        joinedAt: serverTimestamp(),
      });
      router.replace('/dashboard');
    } catch (err) {
      console.error('Onboarding error:', err);
      alert('Failed to save data. Check console.');
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
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 font-sans">
      <h1 className="text-2xl font-heading mb-6">Tell Us About Yourself</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-2xl bg-dark placeholder:text-light"
        />

        {/* User Type */}
        <div className="flex space-x-4">
          <label className="flex-1">
            <input
              type="radio"
              name="userType"
              value="student"
              checked={userType === 'student'}
              onChange={() => setUserType('student')}
              className="mr-2"
            />
            Class Student
          </label>
          <label className="flex-1">
            <input
              type="radio"
              name="userType"
              value="competitive"
              checked={userType === 'competitive'}
              onChange={() => setUserType('competitive')}
              className="mr-2"
            />
            Competitive Aspirant
          </label>
        </div>

        {/* Class & School (only for students) */}
        {userType === 'student' && (
          <>
            <select
              value={cls}
              onChange={e => setCls(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-2xl bg-dark text-light"
            >
              <option value="" disabled>Select Class</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>

            <select
              value={school}
              onChange={e => setSchool(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-2xl bg-dark text-light"
            >
              <option value="" disabled>Select School</option>
              <option value="St Mary">St Mary</option>
              <option value="Other">Other</option>
            </select>

            {school === 'Other' && (
              <input
                type="text"
                placeholder="Your School Name"
                value={otherSchool}
                onChange={e => setOtherSchool(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-2xl bg-dark placeholder:text-light"
              />
            )}
          </>
        )}

        {/* Exam (only for competitive aspirants) */}
        {userType === 'competitive' && (
          <select
            value={exam}
            onChange={e => setExam(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-2xl bg-dark text-light"
          >
            <option value="" disabled>Select Exam</option>
            <option value="SSC">SSC</option>
            <option value="Bank PO">Bank PO</option>
            <option value="CUET">CUET</option>
            <option value="Other">Other</option>
          </select>
        )}

        {/* English Level */}
        <select
          value={englishLevel}
          onChange={e => setEnglishLevel(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-2xl bg-dark text-light"
        >
          <option value="" disabled>Select English Level</option>
          <option value="Vocabulary">Beginner</option>
          <option value="Basic Grammar">Intermediate</option>
          <option value="Sentence Formation">Expert</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 rounded-2xl shadow-card transition ${
            submitting
              ? 'bg-gray-600 cursor-not-allowed text-light'
              : 'bg-primary hover:bg-primary/90 text-black'
          }`}
        >
          {submitting ? 'Saving…' : 'Continue'}
        </button>

      </form>
    </div>
  );
}
