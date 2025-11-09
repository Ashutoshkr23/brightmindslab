'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
// Assuming '@/lib/firebase' contains the necessary auth, db, and provider exports
import { auth, db, provider } from '@/lib/firebase';
import { getDoc, doc } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();

  // 0️⃣ Redirect already‐signed‐in users
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.replace('/dashboard');
      }
    });
    return () => unsub();
  }, [router]);

  // 1️⃣ Handle Google Sign‐In / Onboarding redirect
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  // 2️⃣ Guest explore
  const handleExploreGuest = () => {
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-background text-light flex items-center justify-center p-6 font-sans">
      <div className="text-center max-w-2xl space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image
            src="/logo01.png"
            width={320}
            height={160}
            // BRANDING CHANGE: Updated Alt Text
            alt="Mental Math Mastery Logo"
          />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          {/* BRANDING CHANGE: Updated App Title */}
          Mental Math Mastery
        </h1>
        <p className="text-lg md:text-xl text-light">
          {/* BRANDING CHANGE: Updated Tagline for new focus */}
          Master Quick Calculation with focused, fun daily exercises. <br />
          Train your brain for lightning-fast mental math proficiency.
        </p>

        {/* Auth Buttons */}
        <div className="w-full max-w-xs mx-auto space-y-3 pt-4">
          <button
            onClick={handleGoogleAuth}
            className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-2xl shadow-card transition"
          >
            Sign In with Google
          </button>

          <button
            onClick={handleGoogleAuth}
            className="w-full bg-primary hover:bg-primary/90 text-dark py-2 rounded-2xl shadow-card transition"
          >
            Sign Up with Google
          </button>

          <button
            onClick={handleExploreGuest}
            className="w-full border border-light text-light py-2 rounded-2xl hover:bg-gray-800 transition"
          >
            Explore without Login
          </button>
        </div>
      </div>
    </main>
  );
}
