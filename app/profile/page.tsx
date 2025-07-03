'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';

// Define a type for your user data from Firestore
interface UserProfile {
  name: string;
  email: string;
  goal?: string;
  focus?: string;
  whatsapp?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        // If no user, redirect to login/onboarding
        router.push('/onboarding');
      }
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]);

  // While loading, show a simple loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-light">Loading Profile...</p>
      </div>
    );
  }

  // If loading is finished but there's no profile, show an error or redirect
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-light">Could not load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-heading text-primary mb-8">
          Your Profile
        </h1>
        
        <div className="bg-dark p-6 rounded-xl shadow-lg">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Name</span>
              <p className="text-lg">{userProfile.name}</p>
            </div>
            <div className="border-t border-gray-700"></div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Email</span>
              {/* This line is now safe because we wait for userProfile to load */}
              <p className="text-lg">{userProfile.email}</p>
            </div>
            <div className="border-t border-gray-700"></div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Primary Goal</span>
              <p className="text-lg">{userProfile.goal || 'Not set'}</p>
            </div>
            <div className="border-t border-gray-700"></div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Main Focus</span>
              <p className="text-lg">{userProfile.focus || 'Not set'}</p>
            </div>
            <div className="border-t border-gray-700"></div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">WhatsApp Number</span>
              <p className="text-lg">{userProfile.whatsapp || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}