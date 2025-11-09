'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, provider, db } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function NavBar() {
  const router = useRouter();

  // detect mobile/desktop
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // auth + menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

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
        setUserName('');
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // sign-in logic
  const handleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const snap = await getDoc(doc(db, 'users', user.uid));
      router.replace(snap.exists() ? '/dashboard' : '/onboarding');
    } catch (err) {
      console.error('Sign-in error', err);
    }
  };

  // links
  const links = [
    { href: '/profile', label: 'Profile', auth: true },
    { href: '/contact', label: 'Contact Us', auth: false },
    { href: '/terms', label: 'Terms & Conditions', auth: false },
    { href: '/refund', label: 'Refund Policy', auth: false },
  ];

  const navBackgroundStyle = {
    backgroundColor: '#111827',
    color: '#EAEAEA',
    borderBottom: '1px solid #3498DB',
  };

  const containerStyle = {
    maxWidth: '1024px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // This will keep desktop layout correct
    padding: '16px 24px',
  };
  
  // Skeleton component for loading state
  const Skeleton = () => (
    <div style={{
      backgroundColor: '#374151',
      height: '24px',
      width: '128px',
      borderRadius: '8px',
      animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }}>
      <style>{`
        @keyframes pulse {
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
  
  // CHANGE 2: Animation variants for the slide-in menu from the LEFT
  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };
  
  // Render Links function for reuse
  const renderLinks = () => (
    <>
      {links.map(({ href, label, auth: req }) =>
        (!req || signedIn) && (
          <Link
            key={href} href={href}
            style={{ display: 'block', padding: '8px 12px', borderRadius: '8px', color: '#EAEAEA', textDecoration: 'none' }}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        )
      )}
    </>
  );

  return (
    <nav style={navBackgroundStyle}>
      <div style={containerStyle}>
        {/* On mobile, show hamburger on left. On desktop, show brand name on left. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* CHANGE 1: Hamburger icon is now on the left for mobile */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none', color: '#EAEAEA', zIndex: 100 }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          )}

          {/* Brand Name / Title */}
          <div 
            style={{ fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' }}
            onClick={() => router.push(signedIn ? '/dashboard' : '/')}
          >
            {isMobile 
              ? '30 days mastery' 
              : (loading ? <Skeleton /> : (signedIn ? userName : 'Bright Minds Lab'))
            }
          </div>
        </div>

        {/* Desktop Links and Buttons */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {renderLinks()}
            {signedIn ? (
              <button
                onClick={() => auth.signOut()}
                style={{ marginLeft: '16px', padding: '8px 16px', backgroundColor: '#1F2937', color: '#EAEAEA', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                style={{ marginLeft: '16px', padding: '8px 16px', backgroundColor: '#F39C12', color: '#111827', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                Log In
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu (Slide-in Panel from LEFT) */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 98 }}
            />
            {/* CHANGE 3: Slide-in menu from LEFT */}
            <motion.div
              key="mobile-menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{
                position: 'fixed',
                top: 0,
                left: 0, // Changed from right: 0
                height: '100vh',
                width: '250px',
                backgroundColor: '#111827',
                borderRight: '1px solid #3498DB', // Changed from borderLeft
                zIndex: 99,
                padding: '80px 24px 16px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {renderLinks()}
                {signedIn ? (
                  <button
                    onClick={() => { setMenuOpen(false); auth.signOut(); }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#1F2937', color: '#EAEAEA', border: 'none', cursor: 'pointer', marginTop: '16px' }}
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    onClick={() => { setMenuOpen(false); handleSignIn(); }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '12px', backgroundColor: '#F39C12', color: '#111827', border: 'none', cursor: 'pointer', marginTop: '16px' }}
                  >
                    Log In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
} 