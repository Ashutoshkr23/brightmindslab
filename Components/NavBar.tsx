'use client';

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import { auth, provider, db }  from '@/lib/firebase';
import { signInWithPopup }     from 'firebase/auth';
import { doc, getDoc }         from 'firebase/firestore';

export default function NavBar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState('User');

  // Watch auth state and load userName
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setSignedIn(true);
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) setUserName(snap.data().name || 'User');
        } catch (error) {
          console.error('Could not fetch user profile', error);
        }
      } else {
        setSignedIn(false);
        setUserName('User');
      }
    });
    return () => unsub();
  }, []);

  // Handle sign-in & then redirect
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user   = result.user;
      const snap   = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) router.replace('/dashboard');
      else               router.replace('/onboarding');
    } catch (error) {
      console.error('Sign-in error', error);
    }
  };

  const links = [
    { href: '/profile', label: 'Profile',         auth: true  },
    { href: '/enrolled', label: 'Enrolled Courses', auth: true },
    { href: '/about',   label: 'About Us',        auth: false },
    { href: '/terms',   label: 'Terms & Conditions', auth: false },
    { href: '/refund',  label: 'Refund Policy',   auth: false },
  ];

  return (
    <nav className="bg-dark text-light border-b border-secondary">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* User Name */}
        <div className="text-2xl font-heading">{userName}</div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map(({ href, label, auth: requiresAuth }) => (
            (!requiresAuth || signedIn) && (
              <Link
                key={href}
                href={href}
                className="hover:text-primary transition"
              >
                {label}
              </Link>
            )
          ))}

          {signedIn
            ? <button
                onClick={() => auth.signOut()}
                className="ml-4 bg-background hover:bg-background/80 text-primary px-4 py-2 rounded-2xl"
              >
                Log Out
              </button>
            : <button
                onClick={handleSignIn}
                className="ml-4 bg-primary hover:bg-primary/90 text-dark px-4 py-2 rounded-2xl"
              >
                Log In
              </button>
          }
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen
            ? <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"/>
              </svg>
            : <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8h16M4 16h16"/>
              </svg>
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark border-t border-secondary">
          <div className="px-6 py-4 space-y-2">
            {links.map(({ href, label, auth: requiresAuth }) => (
              (!requiresAuth || signedIn) && (
                <Link
                  key={href}
                  href={href}
                  className="block px-3 py-2 rounded-md hover:bg-background transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            ))}

            {signedIn
              ? <button
                  onClick={() => { setMenuOpen(false); auth.signOut(); }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-background"
                >
                  Log Out
                </button>
              : <button
                  onClick={() => { setMenuOpen(false); handleSignIn(); }}
                  className="w-full text-left px-3 py-2 bg-primary text-dark rounded-2xl hover:bg-primary/90"
                >
                  Log In
                </button>
            }
          </div>
        </div>
      )}
    </nav>
  );
}
