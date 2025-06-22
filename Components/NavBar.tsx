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
  const [isMobile, setIsMobile] = useState(false);

  // ❶ Track window width for responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ❷ Watch auth state and load userName
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

  // ❸ Handle sign-in & redirect on first login
  const handleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const snap = await getDoc(doc(db, 'users', user.uid));
      router.replace(snap.exists() ? '/dashboard' : '/onboarding');
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

  // ❹ Inline styles for spacing & responsive
  const navStyle = {
    backgroundColor: '#111827',            // dark
    color: '#EAEAEA',                      // light
    borderBottom: '1px solid #3498DB',     // secondary
  };

  const containerStyle = {
    maxWidth: '1024px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',                  // py-4 px-6
  };

  const desktopLinksStyle = {
    display: isMobile ? 'none' : 'flex',
    gap: '24px',                            // space-x-6
    alignItems: 'center',
  };

  const mobileHamburgerStyle = {
    display: isMobile ? 'block' : 'none',
    padding: '8px',                         // roughly p-2
    cursor: 'pointer',
  };

  const mobileMenuStyle = {
    display: menuOpen && isMobile ? 'block' : 'none',
    backgroundColor: '#111827',
    borderTop: '1px solid #3498DB',
    padding: '16px 24px',
  };

  const mobileLinkStyle = {
    display: 'block',
    padding: '8px 12px',                    // py-2 px-3
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#EAEAEA',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* User Name */}
        <div style={{ fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
          {userName}
        </div>

        {/* Desktop Links */}
        <div style={desktopLinksStyle}>
          {links.map(({ href, label, auth: requiresAuth }) =>
            (!requiresAuth || signedIn) && (
              <Link
                key={href}
                href={href}
                style={{ color: '#EAEAEA', textDecoration: 'none' }}
              >
                {label}
              </Link>
            )
          )}

          {signedIn
            ? <button
                onClick={() => auth.signOut()}
                style={{
                  marginLeft: '16px',
                  padding: '8px 16px',
                  backgroundColor: '#1F2937',    // background
                  color: '#EAEAEA',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Log Out
              </button>
            : <button
                onClick={handleSignIn}
                style={{
                  marginLeft: '16px',
                  padding: '8px 16px',
                  backgroundColor: '#F39C12',    // primary
                  color: '#111827',               // dark
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Log In
              </button>
          }
        </div>

        {/* Mobile Hamburger */}
        <div style={mobileHamburgerStyle} onClick={() => setMenuOpen(o => !o)}>
          {menuOpen
            ? <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            : <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8h16M4 16h16" />
              </svg>
          }
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={mobileMenuStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map(({ href, label, auth: requiresAuth }) =>
            (!requiresAuth || signedIn) && (
              <Link
                key={href}
                href={href}
                style={mobileLinkStyle}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}

          {signedIn
            ? <button
                onClick={() => { setMenuOpen(false); auth.signOut(); }}
                style={{
                  ...mobileLinkStyle,
                  backgroundColor: '#1F2937',
                  textAlign: 'left',
                  border: 'none'
                }}
              >
                Log Out
              </button>
            : <button
                onClick={() => { setMenuOpen(false); handleSignIn(); }}
                style={{
                  ...mobileLinkStyle,
                  backgroundColor: '#F39C12',
                  color: '#111827',
                  border: 'none'
                }}
              >
                Log In
              </button>
          }
        </div>
      </div>
    </nav>
  );
}
