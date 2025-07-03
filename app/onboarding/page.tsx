'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, BookCheck, Building, CheckCircle, School, TrendingUp, User, MessageSquare,
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Define the structure for each step
interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  inputType?: 'text' | 'tel';
  options?: { name: string; icon: React.ElementType }[];
}

// Onboarding steps data
const onboardingSteps: OnboardingStep[] = [
  {
    key: 'name',
    title: "What's your name?",
    description: "Let's get to know each other.",
    icon: User,
    inputType: 'text',
  },
  {
    key: 'goal',
    title: 'What are you preparing for?',
    description: 'Select your primary goal to help us tailor your content.',
    icon: TrendingUp,
    options: [
      { name: 'SSC', icon: Building },
      { name: 'Banking', icon: Building },
      { name: 'Other Govt. Exams', icon: Building },
      { name: 'School', icon: School },
    ],
  },
  {
    key: 'focus',
    title: "What's your main focus?",
    description: 'This helps us recommend the right exercises for you.',
    icon: BookCheck,
    options: [
      { name: 'Vocabulary', icon: BookCheck },
      { name: 'Basic Grammar', icon: BookCheck },
      { name: 'Sentence Formation', icon: BookCheck },
      { name: 'Quick Calculation', icon: BookCheck },
    ],
  },
  {
    key: 'whatsapp',
    title: 'Get important updates on WhatsApp',
    description: 'We will send you reminders and practice materials. (Optional)',
    icon: MessageSquare,
    inputType: 'tel',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    focus: '',
    whatsapp: '',
  });
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- FIX START: Add state to manage auth status and errors ---
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState('');
  // --- FIX END ---

  // --- FIX START: This hook ensures the page waits for Firebase to be ready ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Now we are sure a user is logged in.
        setAuthReady(true);
      } else {
        // If no user is found after checking, they should not be on this page.
        // Redirecting to home is a safe fallback.
        router.push('/');
      }
    });
    // Clean up the listener when the component is removed from the screen
    return () => unsubscribe();
  }, [router]);
  // --- FIX END ---

  const handleNext = () => {
    if (currentStep.inputType) {
      setFormData((prev) => ({ ...prev, [currentStep.key]: inputValue }));
    }
    setInputValue('');
    setStep((prev) => prev + 1);
  };

  const handleSelectOption = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };
  
  const handleFinalSubmit = async () => {
    // --- FIX START: Added more robust error checking ---
    setError(''); // Clear previous errors
    setIsSubmitting(true);
    const user = auth.currentUser;

    // This check is now more reliable because we wait for authReady
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        // Using { merge: true } is a safe practice. It creates the doc if it doesn't exist,
        // or updates it without overwriting existing fields.
        await setDoc(userDocRef, {
          ...formData,
          email: user.email,
          uid: user.uid,
          // Includes the default subscription fields as requested
          tier: "free",
          subscriptionStatus: "inactive",
          isSubscribed: false,
        }, { merge: true });
        
        router.push('/dashboard');

      } catch (err) {
        console.error("Firestore Write Error: ", err);
        setError("Could not save profile. Please check your connection and try again.");
        setIsSubmitting(false);
      }
    } else {
      setError("Authentication error. Please refresh and try again.");
      setIsSubmitting(false);
    }
    // --- FIX END ---
  };


  const currentStep = onboardingSteps[step];
  const variants = {
    hidden: { opacity: 0, y: 30 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  // --- FIX START: Show a loading state until Firebase auth is confirmed ---
  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-light text-lg">Loading...</p>
      </div>
    );
  }
  // --- FIX END ---

  return (
    <div className="min-h-screen bg-background text-light font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {step < onboardingSteps.length ? (
            // Form Steps
            <motion.div
              key={step}
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <currentStep.icon className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold font-heading text-light">
                  {currentStep.title}
                </h1>
                <p className="mt-2 text-gray-400">{currentStep.description}</p>
              </div>
              {currentStep.inputType ? (
                <div className="space-y-4">
                  <input
                    type={currentStep.inputType}
                    placeholder={`Enter your ${currentStep.key}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-4 bg-dark border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-dark font-bold py-3 px-4 rounded-xl flex items-center justify-center"
                  >
                    Continue <ArrowRight className="ml-2" />
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentStep.options?.map((option) => (
                    <motion.button
                      key={option.name}
                      onClick={() =>
                        handleSelectOption(currentStep.key, option.name)
                      }
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center text-left p-4 bg-dark border border-gray-700 rounded-xl hover:border-primary transition-colors"
                    >
                      <option.icon className="h-6 w-6 text-secondary mr-4" />
                      <span className="font-semibold">{option.name}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            // Completion Step
            <motion.div
              key="success"
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="text-center"
            >
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="text-3xl font-bold font-heading text-light">
                You're all set!
              </h1>
              <p className="mt-2 text-gray-400">
                We've personalized your learning journey.
              </p>
              <motion.button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full bg-primary text-dark font-bold py-3 px-4 rounded-xl flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Start Learning'}
                {!isSubmitting && <ArrowRight className="ml-2" />}
              </motion.button>
              
              {/* --- FIX START: Show error message to user if submission fails --- */}
              {error && (
                <p className="mt-4 text-sm text-red-500">{error}</p>
              )}
              {/* --- FIX END --- */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-12">
          <div className="w-full bg-dark rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${(step / onboardingSteps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
