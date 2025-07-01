'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db, provider } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';

const Dashboard = () => {
  const router = useRouter();

  // Your existing state
  const [userName, setUserName] = useState('User');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Show login modal if not signed in
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        setShowLoginModal(true);
      } else {
        setShowLoginModal(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Fetch user name once signed in
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        // Listen for auth state changes to get user name
        const unsub = auth.onAuthStateChanged(async (user) => {
            if(user) {
                const userRef = doc(db, 'users', user.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setUserName(data.name || 'User');
                }
            }
        });
        return () => unsub();
      }
    };

    fetchUserName();
  }, []);

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-light flex flex-col">
      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-dark p-6 rounded-xl w-80 space-y-4 border border-light/10 shadow-lg">
            <h2 className="text-white text-xl font-bold font-heading">Sign In Required</h2>
            <p className="text-gray-300">
              Please sign in to track your progress and unlock full features.
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-primary text-dark font-bold py-2 rounded-lg shadow-card hover:bg-primary/90 transition-colors"
            >
              Sign In with Google
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full bg-dark border border-light/20 text-light py-2 rounded-lg hover:bg-light/5 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow p-6 space-y-8 pt-16">
        <h1 className="text-center text-4xl font-bold font-heading text-light">
          Choose Your Challenge
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Speed Math Challenge Card */}
          <Link href="/challenge/math">
            <div className="h-full bg-dark rounded-2xl p-8 shadow-card border border-light/10 hover:border-primary/80 hover:scale-105 transition-all duration-300 cursor-pointer">
              <h2 className="text-2xl font-bold font-heading text-white mb-2">
                30 Day Speed Math Challenge
              </h2>
              <p className="text-gray-400">
                Sharpen your mental math skills with daily challenges.
              </p>
            </div>
          </Link>

          {/* English Grammar Challenge Card */}
          <Link href="/challenge/rules">
            <div className="h-full bg-dark rounded-2xl p-8 shadow-card border border-light/10 hover:border-secondary/80 hover:scale-105 transition-all duration-300 cursor-pointer">
              <h2 className="text-2xl font-bold font-heading text-white mb-2">
                60 Day English Grammar Challenge
              </h2>
              <p className="text-gray-400">
                Master the rules of English grammar with daily exercises.
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-dark text-light/50 text-center py-4 text-sm mt-auto">
        &copy; 2025 BrightMinds |{' '}
        <a href="/terms" className="underline hover:text-primary">
          Terms
        </a>{' '}
        |{' '}
        <a href="/privacy" className="underline hover:text-primary">
          Privacy
        </a>
      </footer>
    </div>
  );
};

export default Dashboard;



