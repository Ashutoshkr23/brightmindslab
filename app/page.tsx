'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // TODO: Firebase Google login
    console.log('Login with Google clicked');
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 font-sans">
      <div className="mb-6">
        <Image src="/logo01.png" width={360} height={220} alt="Bright Minds Lab Logo" />
      </div>

      <h1 className="text-3xl font-heading font-bold mb-1">BRIGHT MINDS LAB</h1>
      <p className="text-sm text-light mb-10">Learn Smart. Grow Daily.</p>

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-2xl shadow-card transition"
        >
          Login with Google
        </button>

        <button
          onClick={() => router.push('/login')}
          className="w-full border border-light text-white py-2 rounded-2xl hover:bg-gray-800 transition"
        >
          Login with Email
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-transparent text-primary py-2 rounded-2xl border border-primary hover:bg-primary/10 transition"
        >
          Explore without Login
        </button>
      </div>
    </div>
  );
}
