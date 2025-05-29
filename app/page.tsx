// 'use client';

// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../lib/firebase';

// export default function Home() {
//   const router = useRouter();

//   const handleGoogleAuth = async () => {
//     try {
//       await signInWithPopup(auth, provider);
//       router.push('/onboarding');
//     } catch (err) {
//       console.error('Google sign-in error:', err);
//     }
//   };

//   const handleExploreGuest = () => {
//     // you can set a guest flag in localStorage if needed
//     router.push('/dashboard');
//   };

//   return (
//     <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 font-sans">
//       <div className="mb-6">
//         <Image
//           src="/logo01.png"
//           width={360}
//           height={220}
//           alt="Bright Minds Lab Logo"
//         />
//       </div>

//       <h1 className="text-3xl font-heading font-bold mb-1">
//         BRIGHT MINDS LAB
//       </h1>
//       <p className="text-sm text-light mb-10">Learn Smart. Grow Daily.</p>

//       <div className="w-full max-w-xs space-y-4">
//         <button
//           onClick={handleGoogleAuth}
//           className="w-full bg-secondary hover:bg-secondary/90 text-white py-2 rounded-2xl shadow-card transition"
//         >
//           Sign In with Google
//         </button>

//         <button
//           onClick={handleGoogleAuth}
//           className="w-full bg-primary hover:bg-primary/90 text-black py-2 rounded-2xl shadow-card transition"
//         >
//           Sign Up with Google
//         </button>

//         <button
//           onClick={handleExploreGuest}
//           className="w-full border border-light text-light py-2 rounded-2xl hover:bg-gray-800 transition"
//         >
//           Explore without Login
//         </button>
//       </div>
//     </div>
//   );
// }
// pages/index.tsx

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-light flex items-center justify-center p-6">
      <div className="text-center max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Mental Maths Mastery
        </h1>
        <p className="text-lg md:text-xl text-light">
          Join the 30-Day Challenge and master fast calculation tricks with fun memory tasks and daily quizzes.
        </p>
        <Link href="/challenge">
          <button className="mt-6 px-6 py-3 bg-primary text-dark text-lg font-semibold rounded-2xl shadow-md hover:bg-opacity-80 transition">
            Start 30-Day Challenge
          </button>
        </Link>
      </div>
    </main>
  );
}
