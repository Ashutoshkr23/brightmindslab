'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  interface UserProfile {
    name: string;
    userType: string;
    class?: string;
    exam?: string;
    englishLevel: string;
  }
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return router.replace('/');
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) setUserProfile(snap.data() as UserProfile);
      else router.replace('/onboarding');
    });
    return () => unsub();
  }, [router]);

  if (!userProfile) {
    return <p>Loading your dashboard…</p>;
  }

  const { name, userType, class: cls, exam, englishLevel } = userProfile;

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-background text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-heading">Welcome, {name}!</h1>
        <button onClick={handleSignOut} className="text-light underline">
          Log Out
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Summary */}
        <div className="p-4 bg-dark rounded-2xl shadow-card">
          <p><strong>Type:</strong> {userType === 'student' ? `Class ${cls}` : exam}</p>
          <p><strong>English Level:</strong> {englishLevel}</p>
        </div>

        {/* My Courses */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* School Vocab Card */}
          <div className="p-4 bg-dark rounded-2xl shadow-card">
            <h2 className="text-xl mb-2">School Vocabulary</h2>
            <p>Class {cls} sight words & chapters</p>
            <button
              onClick={() => router.push(`/vocab/class/${cls}/sightwords`)}
              className="mt-4 bg-primary py-2 px-4 rounded-2xl text-black"
            >
              Start Learning
            </button>
          </div>

          {/* Competitive Vocab Card */}
          <div className="p-4 bg-dark rounded-2xl shadow-card">
            <h2 className="text-xl mb-2">Competitive Vocabulary</h2>
            <p>Synonyms, Idioms & more</p>
            <button
              onClick={() => router.push('/vocab/competitive/synonyms')}
              className="mt-4 bg-secondary py-2 px-4 rounded-2xl text-white"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
