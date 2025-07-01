'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const RulesChallengePage = () => {
  const [rulesChallengeProgress, setRulesChallengeProgress] = useState(1);

  useEffect(() => {
    const rules = localStorage.getItem('rulesChallengeProgress');
    if (rules) {
      setRulesChallengeProgress(parseInt(rules, 10));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-light p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary">60 Day English Grammar Challenge</h1>
        <p className="text-lg text-gray-300">Select a day to begin your challenge.</p>
      </header>
      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((day) => {
            const isUnlocked = day <= rulesChallengeProgress;
            return (
              <Link key={day} href={isUnlocked ? `/challenge/rules/day/${day}` : '#'} passHref>
                <div
                  className={`flex items-center justify-center h-20 rounded-xl text-xl font-bold transition-all ${
                    isUnlocked
                      ? 'bg-primary text-dark cursor-pointer hover:bg-primary/80'
                      : 'bg-dark text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isUnlocked ? `Day ${day}` : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default RulesChallengePage;