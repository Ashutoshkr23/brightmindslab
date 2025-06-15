'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard'); // direct to dashboard after login
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  const handleExploreGuest = () => {
    router.push('/dashboard'); // guest access to dashboard
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
            alt="QRE Mastery Logo - Quick Calculation, Reasoning & English"
          />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          QRE Mastery
        </h1>
        <p className="text-lg md:text-xl text-light">
          Master Quick Calculation, Reasoning & English with short daily tasks. <br />
          A focused, fun learning journey built for competitive minds and smart learners.
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

