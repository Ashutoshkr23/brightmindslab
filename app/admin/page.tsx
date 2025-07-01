'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

// Define the User type for better type-checking
interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  isSubscribed?: boolean;
  tier?: string;
  isAdmin?: boolean;
}

const AdminPanel = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for admin privileges on component mount
  useEffect(() => {
    const checkAdminStatus = async (uid: string) => {
      try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().isAdmin) {
          const userData = { id: userSnap.id, ...userSnap.data() } as UserProfile;
          setCurrentUser(userData);
          fetchUsers();
        } else {
          // If not an admin, redirect to dashboard
          alert('Access Denied. Admins only.');
          router.push('/dashboard');
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError("Failed to verify user permissions.");
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAdminStatus(user.uid);
      } else {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch all user profiles from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
      setUsers(userList);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data. Check Firestore permissions.");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle a user's subscription status
  const handleToggleSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isSubscribed: !currentStatus,
        tier: !currentStatus ? 'premium' : null,
      });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error updating subscription:", err);
      alert("Failed to update subscription. Please try again.");
    }
  };
  
  // Function to change a user's subscription tier
  const handleChangeTier = async (userId: string, newTier: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
          tier: newTier,
          isSubscribed: true,
        });
      fetchUsers(); // Refresh the user list
    } catch (err)      {
      console.error("Error changing tier:", err);
      alert("Failed to change tier. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-light flex items-center justify-center">Loading Admin Panel...</div>;
  }
  
  if (error) {
      return <div className="min-h-screen bg-background text-red-500 flex items-center justify-center">{error}</div>;
  }

  if (!currentUser) {
      // This should ideally not be reached if logic is correct, but serves as a fallback.
      return <div className="min-h-screen bg-background text-light flex items-center justify-center">Verifying admin access...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-light p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>
        <p className="text-lg text-gray-300">Manage Users and Subscriptions</p>
      </header>
      
      <div className="max-w-6xl mx-auto bg-dark p-4 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Subscription</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-light/5">
                  <td className="p-4">{user.name || 'N/A'}</td>
                  <td className="p-4">{user.email || 'N/A'}</td>
                  <td className={`p-4 ${user.isSubscribed ? 'text-green-400' : 'text-red-400'}`}>
                    {user.isSubscribed ? 'Active' : 'Inactive'}
                  </td>
                  <td className="p-4">{user.isSubscribed ? user.tier || 'N/A' : 'N/A'}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleToggleSubscription(user.id, user.isSubscribed ?? false)}
                      className={`px-3 py-1 rounded text-sm font-bold ${
                        user.isSubscribed ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {user.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                    <select
                        value={user.tier || ''}
                        onChange={(e) => handleChangeTier(user.id, e.target.value)}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-sm disabled:opacity-50"
                        disabled={!user.isSubscribed}
                    >
                        <option value="" disabled>Change Tier</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;