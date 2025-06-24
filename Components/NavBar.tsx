'use client';

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/navigation';
import Link                    from 'next/link';
import { auth, provider, db }  from '@/lib/firebase';
import { signInWithPopup }     from 'firebase/auth';
import { doc, getDoc }         from 'firebase/firestore';

export default function NavBar() {
  const router = useRouter();

  // Determine mobile/desktop
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Auth & menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setSignedIn(true);
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          setUserName(snap.exists() ? snap.data().name || 'User' : 'User');
        } catch {
          setUserName('User');
        }
      } else {
        setSignedIn(false);
        setUserName('User');
      }
    });
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const snap = await getDoc(doc(db, 'users', user.uid));
      router.replace(snap.exists() ? '/dashboard' : '/onboarding');
    } catch (err) {
      console.error('Sign-in error', err);
    }
  };

  // Links: temporarily commenting out '/enrolled'
  const links = [
    { href: '/profile', label: 'Profile',      auth: true  },
    // { href: '/enrolled', label: 'Enrolled Courses', auth: true }, 
    { href: '/contact', label: 'Contact Us',   auth: false },
    { href: '/terms',   label: 'Terms & Conditions', auth: false },
    { href: '/refund',  label: 'Refund Policy', auth: false },
  ];

  // Styles
  const navStyle = {
    backgroundColor: '#111827',
    color:           '#EAEAEA',
    borderBottom:    '1px solid #3498DB',
  };
  const container = {
    maxWidth:      '1024px',
    margin:        '0 auto',
    display:       'flex',
    alignItems:    'center',
    justifyContent:'space-between',
    padding:       '16px 24px',
  };

  return (
    <nav style={navStyle}>
      <div style={container}>
        {/* 1️⃣ User Name */}
        <div style={{ fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
          {userName}
        </div>

        {/* 2️⃣ Desktop Links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {links.map(({ href, label, auth: requires }) =>
              (!requires || signedIn) && (
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
                  cursor:        'pointer',
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
                  cursor:        'pointer',
                }}
              >
                Log In
              </button>
            )}
          </div>
        )}

        {/* 3️⃣ Mobile Hamburger */}
        {isMobile && (
          <div
            onClick={() => setMenuOpen(o => !o)}
            style={{ padding: '8px', cursor: 'pointer' }}
          >
            <svg
              style={{ color: '#EAEAEA' }}
              width="24"
              height="24"
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

      {/* 4️⃣ Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={{ backgroundColor: '#111827', borderTop: '1px solid #3498DB' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 24px' }}>
            {links.map(({ href, label, auth: requires }) =>
              (!requires || signedIn) && (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display:        'block',
                    padding:        '8px 12px',
                    borderRadius:   '8px',
                    color:          '#EAEAEA',
                    textDecoration: 'none',
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
                  width:           '100%',
                  textAlign:       'left',
                  padding:         '8px 12px',
                  borderRadius:    '8px',
                  backgroundColor: '#1F2937',
                  color:           '#EAEAEA',
                  border:          'none',
                  cursor:          'pointer',
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); handleSignIn(); }}
                style={{
                  width:           '100%',
                  textAlign:       'left',
                  padding:         '8px 12px',
                  borderRadius:    '12px',
                  backgroundColor: '#F39C12',
                  color:           '#111827',
                  border:          'none',
                  cursor:          'pointer',
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
