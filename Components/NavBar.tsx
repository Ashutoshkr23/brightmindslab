'use client';

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import { auth, provider, db }  from '@/lib/firebase';
import { signInWithPopup }     from 'firebase/auth';
import { doc, getDoc }         from 'firebase/firestore';

export default function NavBar() {
  const router = useRouter();

  // 1️⃣ Track mobile vs desktop from the very first render
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  // 2️⃣ Menu open & auth state
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // 3️⃣ userName starts blank — we won't show "User" until we've run onAuthStateChanged
  const [userName, setUserName] = useState<string>('');

  // — Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // — Watch auth, fetch or default the name
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setSignedIn(true);
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          setUserName(snap.exists() ? snap.data().name || 'User' : 'User');
        } catch (err) {
          console.error('Could not fetch user profile', err);
          setUserName('User');
        }
      } else {
        setSignedIn(false);
        setUserName('User');
      }
    });
    return () => unsub();
  }, []);

  // — Sign in & redirect logic
  const handleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const snap = await getDoc(doc(db, 'users', user.uid));
      router.replace(snap.exists() ? '/dashboard' : '/onboarding');
    } catch (err) {
      console.error('Sign-in error', err);
    }
  };

  const links = [
    { href: '/profile', label: 'Profile',         auth: true  },
    { href: '/enrolled', label: 'Enrolled Courses', auth: true },
    { href: '/about',   label: 'About Us',        auth: false },
    { href: '/terms',   label: 'Terms & Conditions', auth: false },
    { href: '/refund',  label: 'Refund Policy',   auth: false },
  ];

  // Inline styles for nav container
  const navStyle = {
    backgroundColor: '#111827',
    color:           '#EAEAEA',
    borderBottom:    '1px solid #3498DB'
  };

  const containerStyle = {
    maxWidth:    '1024px',
    margin:      '0 auto',
    display:     'flex',
    alignItems:  'center',
    justifyContent: 'space-between',
    padding:     '16px 24px'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* User Name */}
        <div style={{ fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
          {userName}
        </div>

        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
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
            {signedIn ? (
              <button
                onClick={() => auth.signOut()}
                style={{
                  marginLeft:    '16px',
                  padding:       '8px 16px',
                  backgroundColor: '#1F2937',
                  color:         '#EAEAEA',
                  border:        'none',
                  borderRadius:  '12px',
                  cursor:        'pointer'
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                style={{
                  marginLeft:    '16px',
                  padding:       '8px 16px',
                  backgroundColor: '#F39C12',
                  color:         '#111827',
                  border:        'none',
                  borderRadius:  '12px',
                  cursor:        'pointer'
                }}
              >
                Log In
              </button>
            )}
          </div>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <div
            onClick={() => setMenuOpen(o => !o)}
            style={{ padding: '8px', cursor: 'pointer' }}
          >
            <svg
              style={{ color: '#EAEAEA' }}
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={{ backgroundColor: '#111827', borderTop: '1px solid #3498DB' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 24px' }}>
            {links.map(({ href, label, auth: requiresAuth }) =>
              (!requiresAuth || signedIn) && (
                <Link className='bg-white'
                  key={href}
                  href={href}
                  style={{
                    display:       'block',
                    padding:       '8px 12px',
                    borderRadius:  '8px',
                    textDecoration:'none'
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            )}
            {signedIn ? (
              <button
                onClick={() => { setMenuOpen(false); auth.signOut(); }}
                style={{
                  width:         '100%',
                  textAlign:     'left',
                  padding:       '8px 12px',
                  borderRadius:  '8px',
                  backgroundColor:'#1F2937',
                  color:         '#EAEAEA',
                  border:        'none',
                  cursor:        'pointer'
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); handleSignIn(); }}
                style={{
                  width:         '100%',
                  textAlign:     'left',
                  padding:       '8px 12px',
                  borderRadius:  '12px',
                  backgroundColor:'#F39C12',
                  color:         '#111827',
                  border:        'none',
                  cursor:        'pointer'
                }}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
