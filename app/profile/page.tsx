'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User, Mail, Star, CheckCircle, XCircle, Goal, BookOpen, Phone } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

// Define a type for the user's profile data from Firestore
interface UserProfile {
  name: string;
  email: string;
  goal?: string;
  focus?: string;
  whatsapp?: string;
  tier?: string;
  isSubscribed?: boolean;
  subscriptionStatus?: string;
}

// A simple skeleton loader for a single line of text
const SkeletonLoader = () => (
    <div className="h-6 bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
);

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // User is logged in, fetch their profile from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // If no profile exists for a logged-in user, they need to onboard
            router.push('/onboarding');
          }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Optionally handle fetch error state
        }
      } else {
        // No user is logged in, redirect them to a login page
        router.push('/');
      }
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]);

  // Display a full-page loading indicator while checking auth and fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // A helper component to render each profile item
  type ProfileItemProps = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value?: string;
    isLoading: boolean;
  };

  const ProfileItem = ({ icon: Icon, label, value, isLoading }: ProfileItemProps) => (
    <div className="flex items-center space-x-4">
      <Icon className="h-6 w-6 text-secondary flex-shrink-0" />
      <div className="flex-grow">
        <p className="text-sm text-gray-400">{label}</p>
        {isLoading ? <SkeletonLoader /> : <p className="text-lg font-semibold">{value || 'Not set'}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-light p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
            <User className="h-12 w-12 text-primary" />
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading">
                    {loading ? 'Loading...' : userProfile?.name}
                </h1>
                <p className="text-gray-400">Here is your profile information.</p>
            </div>
        </div>
        
        <div className="bg-dark p-6 rounded-2xl shadow-lg space-y-6">
            <ProfileItem icon={Mail} label="Email" value={userProfile?.email} isLoading={loading} />
            <div className="border-t border-gray-700"></div>
            <ProfileItem icon={Goal} label="Primary Goal" value={userProfile?.goal} isLoading={loading} />
            <div className="border-t border-gray-700"></div>
            <ProfileItem icon={BookOpen} label="Main Focus" value={userProfile?.focus} isLoading={loading} />
            <div className="border-t border-gray-700"></div>
            <ProfileItem icon={Phone} label="WhatsApp" value={userProfile?.whatsapp || 'Not provided'} isLoading={loading} />
        </div>

        <div className="mt-8 bg-dark p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold font-heading mb-4 text-primary">Subscription</h2>
            <div className="space-y-6">
                <ProfileItem icon={Star} label="Current Tier" value={userProfile?.tier} isLoading={loading} />
                <div className="border-t border-gray-700"></div>
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        {loading ? <SkeletonLoader /> : userProfile?.isSubscribed ? <CheckCircle className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm text-gray-400">Subscription Status</p>
                        <p className="text-lg font-semibold">{loading ? '' : userProfile?.subscriptionStatus}</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
