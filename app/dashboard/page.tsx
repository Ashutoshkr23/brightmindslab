'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [speedMathProgress, setSpeedMathProgress] = useState(1);
  const [rulesChallengeProgress, setRulesChallengeProgress] = useState(1);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentChallengeType, setCurrentChallengeType] = useState<'math' | 'rules' | null>(null);

  useEffect(() => {
    const math = localStorage.getItem('speedMathProgress');
    const rules = localStorage.getItem('rulesChallengeProgress');
    if (math) setSpeedMathProgress(parseInt(math));
    if (rules) setRulesChallengeProgress(parseInt(rules));
  }, []);

  useEffect(() => {
    localStorage.setItem('speedMathProgress', speedMathProgress.toString());
    localStorage.setItem('rulesChallengeProgress', rulesChallengeProgress.toString());
  }, [speedMathProgress, rulesChallengeProgress]);

  const handleContinueChallenge = (type: 'math' | 'rules', day: number) => {
    router.push(`/challenge/${type}/day/${day}`);
  };

  const navigateToPreviousChallenge = () => {
    if (!selectedDay || !currentChallengeType) return;
    router.push(`/challenge/${currentChallengeType}/day/${selectedDay}`);
  };

  return (
    <div className="min-h-screen bg-background text-light flex flex-col">
      <header className="bg-dark text-light p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Welcome back, Alex!</div>
        <div className="text-sm">Day {speedMathProgress} of Math | Rule {rulesChallengeProgress}</div>
      </header>

      <main className="flex-grow p-6 space-y-8">
        {/* Speed Math Challenge */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">30-Day Speed Math Challenge</h2>
          <div className="mb-4">
            <div className="bg-gray-600 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(speedMathProgress / 30) * 100}%` }} />
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-4">Day {speedMathProgress} - Multiply numbers</p>
          <div className="flex gap-4">
            <button onClick={() => handleContinueChallenge('math', speedMathProgress)} className="bg-orange-500 px-6 py-2 rounded text-white hover:opacity-90">
              Continue Challenge
            </button>
            {/* <button className="bg-gray-500 px-6 py-2 rounded text-white">View Progress</button> */}
          </div>
          <p className="text-xs text-gray-400 mt-2">Day {speedMathProgress + 1} unlocks after today.</p>
          <button onClick={() => { setCurrentChallengeType('math'); setShowDaySelector(true); }} className="bg-gray-700 text-white mt-4 px-6 py-2 rounded">
            Go to Previous Challenges
          </button>
        </div>

        {/* 120 Rules Challenge */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">60-Day | 120 Rules Challenge</h2>
          <div className="mb-4">
            <div className="bg-gray-600 h-2 rounded-full">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(rulesChallengeProgress / 60) * 100}%` }} />
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-4">Rule {rulesChallengeProgress} - Addition of Fractions</p>
          <div className="flex gap-4">
            <button onClick={() => handleContinueChallenge('rules', rulesChallengeProgress)} className="bg-blue-600 px-6 py-2 rounded text-white hover:opacity-90">
              Continue Challenge
            </button>
            {/* <button className="bg-gray-500 px-6 py-2 rounded text-white">View Progress</button> */}
          </div>
          <p className="text-xs text-gray-400 mt-2">Rule {rulesChallengeProgress + 1} unlocks after today.</p>
          <button onClick={() => { setCurrentChallengeType('rules'); setShowDaySelector(true); }} className="bg-gray-700 text-white mt-4 px-6 py-2 rounded">
            Go to Previous Challenges
          </button>
        </div>
      </main>

      <footer className="bg-dark text-light text-center py-4 text-sm">
        &copy; 2025 BrightMinds | <a href="/terms" className="underline text-orange-500">Terms</a> | <a href="/privacy" className="underline text-orange-500">Privacy</a>
      </footer>

      {/* Day Selector Modal */}
      {showDaySelector && currentChallengeType && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-dark p-6 rounded-lg w-80 shadow-xl">
            <h3 className="text-xl text-white mb-4">Select Previous Day</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...Array((currentChallengeType === 'math' ? speedMathProgress : rulesChallengeProgress) - 1).keys()].map((day) => (
                <button
                  key={day}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedDay(day + 1);
                    setShowDaySelector(false);
                    navigateToPreviousChallenge();
                  }}
                >
                  Day {day + 1}
                </button>
              ))}
            </div>
            <button className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setShowDaySelector(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;




