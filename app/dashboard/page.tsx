'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Assuming '@/lib/firebase' contains the necessary auth, db, and provider exports
import { auth, db, provider } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';

const Dashboard = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const unsub = auth.onAuthStateChanged(async (user) => {
            if(user) {
                const userRef = doc(db, 'users', user.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    // const data = snap.data();
                }
            }
        });
        return () => unsub();
      }
    };

    fetchUserName();
  }, []);

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

      <main className="flex-grow p-6 space-y-8 pt-16">
        <h1 className="text-center text-4xl font-bold font-heading text-light">
          {/* Updated Title for Clarity */}
          Start Your Mental Math Challenge
        </h1>
        {/* Adjusted grid to center the single column or maintain 1-column layout */}
        <div className="max-w-xl mx-auto grid grid-cols-1 gap-8">
          <Link href="/challenge/math">
            <div className="h-full bg-dark rounded-2xl p-8 shadow-card border border-light/10 hover:border-primary/80 hover:scale-105 transition-all duration-300 cursor-pointer text-center">
              <h2 className="text-3xl font-bold font-heading text-white mb-2">
                30 Day Mental Math Challenge
              </h2>
              <p className="text-gray-400 text-lg">
                Sharpen your mental math skills with daily challenges and quizzes.
              </p>
              {/* Optional: Add a visual element like an icon here */}
            </div>
          </Link>

          {/* REMOVED: English Grammar Challenge section */}
        </div>
      </main>

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
