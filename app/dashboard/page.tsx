'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  name: string;
  userType: 'student' | 'competitive';
  class?: string;
  exam?: string;
  englishLevel: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Listen for auth changes and load profile if signed in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Guest user
        setUserProfile(null);
        setLoading(false);
        return;
      }
      // Signed-in: fetch Firestore profile
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        // Not onboarded yet
        router.replace('/onboarding');
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-light">
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  const isGuest = userProfile === null;
  const isStudent = isGuest || userProfile?.userType === 'student';
  const isCompetitive = userProfile?.userType === 'competitive';

  // Navigate or prompt login for guests
  const goTo = (path: string) => {
    if (isGuest) router.push('/login');
    else router.push(path);
  };

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-heading">
          {isGuest ? 'Welcome, Guest!' : `Welcome, ${userProfile!.name}!`}
        </h1>
        {!isGuest && (
          <button
            onClick={() => {
              auth.signOut();
              router.replace('/');
            }}
            className="text-light underline"
          >
            Log Out
          </button>
        )}
      </div>

      {/* Profile Summary for signed-in users */}
      {!isGuest && (
        <div className="p-4 bg-surface rounded-2xl shadow-card mb-6">
          <p>
            <strong>Type:</strong>{' '}
            {userProfile!.userType === 'student'
              ? `Class ${userProfile!.class}`
              : userProfile!.exam}
          </p>
          <p>
            <strong>English Level:</strong> {userProfile!.englishLevel}
          </p>
        </div>
      )}

      {/* Module Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Vocabulary */}
        {isStudent && (
          <div className="p-4 bg-surface rounded-2xl shadow-card">
            <h2 className="text-xl mb-2">Vocabulary</h2>
            <p>
              {isGuest
                ? 'Sign in to explore high-frequency & chapter vocab'
                : `Explore high-frequency & chapter vocab`}
            </p>
            <button
              onClick={() => goTo(`/vocab/class/${isGuest ? '6' : userProfile!.class}`)}
              className="mt-4 bg-primary py-2 px-4 rounded-2xl text-black w-full"
            >
              {isGuest ? 'Log In to Learn' : 'Enter'}
            </button>
          </div>
        )}

        {/* English Skills */}
        <div className="p-4 bg-surface rounded-2xl shadow-card">
          <h2 className="text-xl mb-2">English Skills</h2>
          <p>Mini-courses on grammar, writing & more</p>
          <button
            onClick={() => goTo('/english')}
            className="mt-4 bg-primary py-2 px-4 rounded-2xl text-white w-full"
          >
            {isGuest ? 'Log In to Access' : 'Enter'}
          </button>
        </div>

        {/* Revision Notes */}
        <div className="p-4 bg-surface rounded-2xl shadow-card">
          <h2 className="text-xl mb-2">Revision Notes</h2>
          <p>Subject-wise quick revision cards</p>
          <button
            onClick={() => goTo('/notes')}
            className="mt-4 bg-primary py-2 px-4 rounded-2xl text-black w-full"
          >
            {isGuest ? 'Log In to Access' : 'Enter'}
          </button>
        </div>

        {/* Competitive Vocabulary (only for competitive aspirants) */}
        {isCompetitive && (
          <div className="p-4 bg-surface rounded-2xl shadow-card">
            <h2 className="text-xl mb-2">Competitive Vocabulary</h2>
            <p>Synonyms, idioms & exam-focused vocab</p>
            <button
              onClick={() => goTo('/vocab/competitive/synonyms')}
              className="mt-4 bg-secondary py-2 px-4 rounded-2xl text-white w-full"
            >
              Enter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
