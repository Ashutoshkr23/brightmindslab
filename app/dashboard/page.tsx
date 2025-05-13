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

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // Guest flow
        setUserProfile(null);
        setLoading(false);
        return;
      }
      // Signed-in flow
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
  const isStudent = userProfile?.userType === 'student' || isGuest;
  const isCompetitive = userProfile?.userType === 'competitive';

  const handleCardClick = (path: string) => {
    if (isGuest) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
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

      {!isGuest && (
        <div className="p-4 bg-dark rounded-2xl shadow-card mb-6">
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

      <div className="grid gap-4 md:grid-cols-2">
        {/* School Vocabulary for Guests & Students */}
        {isStudent && (
          <div className="p-4 bg-dark rounded-2xl shadow-card">
            <h2 className="text-xl mb-2">School Vocabulary</h2>
            <p>
              {isGuest
                ? 'Sign in to access class-based vocabulary'
                : `Class ${userProfile!.class} vocab menu`}
            </p>
            <button
              onClick={() =>
                handleCardClick(`/vocab/class/${isGuest ? '6' : userProfile!.class}`)
              }
              className="mt-4 bg-primary py-2 px-4 rounded-2xl text-black"
            >
              {isGuest ? 'Log In to Learn' : 'Start Learning'}
            </button>
          </div>
        )}

        {/* Competitive Vocabulary only for Competitive Aspirants */}
        {isCompetitive && (
          <div className="p-4 bg-dark rounded-2xl shadow-card">
            <h2 className="text-xl mb-2">Competitive Vocabulary</h2>
            <p>Synonyms, Idioms & more</p>
            <button
              onClick={() => handleCardClick('/vocab/competitive/synonyms')}
              className="mt-4 bg-secondary py-2 px-4 rounded-2xl text-white"
            >
              Start Learning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
