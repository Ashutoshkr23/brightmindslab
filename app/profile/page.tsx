'use client';

import { useState, useEffect } from 'react';
import { useRouter }          from 'next/navigation';
import { auth, db }           from '@/lib/firebase';
import { doc, getDoc }        from 'firebase/firestore';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading]       = useState(true);
  const [profile, setProfile]       = useState<any>(null);

  // 1️⃣ Require sign-in and fetch profile
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        router.replace('/onboarding');
        return;
      }
      setProfile(snap.data());
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-light">Loading profile…</p>
      </div>
    );
  }

  const {
    name,
    preparingFor,
    englishFocus,
    practiceTime,
    notifications,
    interfaceLanguage,
    joinedAt
  } = profile;

  return (
    <div className="min-h-screen bg-background text-light p-6">
      <div className="max-w-xl mx-auto bg-dark rounded-2xl shadow-card p-8 space-y-6">
        <h1 className="text-3xl font-heading">My Profile</h1>

        <div className="space-y-3">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Preparing For:</strong> {preparingFor}</p>
          <p><strong>English Focus:</strong> {englishFocus}</p>
          {practiceTime && (
            <p><strong>Practice Time:</strong> {practiceTime}</p>
          )}
          <p>
            <strong>Notifications:</strong>{' '}
            {notifications?.email ? 'Email ' : ''} 
            {notifications?.push ? 'Push' : ''} 
            {!notifications?.email && !notifications?.push && 'None'}
          </p>
          <p><strong>Interface Language:</strong> {interfaceLanguage}</p>
          {joinedAt && (
            <p>
              <strong>Joined:</strong>{' '}
              {new Date(joinedAt.seconds * 1000).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => auth.signOut()}
            className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-xl transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
