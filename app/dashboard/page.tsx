'use client';
import { useState } from 'react';

const Dashboard = () => {
  const [speedMathProgress, setSpeedMathProgress] = useState(20); // Speed Math progress in %
  const [rulesChallengeProgress, setRulesChallengeProgress] = useState(10); // 120 Rules progress in %
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Function to handle "Continue Challenge" button click
  const handleContinueChallenge = (challenge: string) => {
    alert(`Continuing ${challenge}`);
  };

  // Function to navigate to previous day's challenge
  const navigateToPreviousChallenge = (challenge: string) => {
    if (selectedDay) {
      alert(`Navigating to Day ${selectedDay} of ${challenge}`);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light flex flex-col">
      {/* Header */}
      <header className="bg-dark text-light p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Welcome back, Alex!</div>
        <div className="text-sm">Day 6 of Challenge</div>
      </header>

      {/* Main Body */}
      <main className="flex-grow p-6">
        {/* Speed Math Challenge Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">30-Day Speed Math Challenge</h2>
          <div className="mb-4">
            <div className="bg-gray-400 h-2 rounded-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${speedMathProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-400 mb-4">Day 6 - Multiply numbers</div>
          <div className="space-x-4">
            <button
              className="bg-orange-500 px-6 py-2 rounded text-white"
              onClick={() => handleContinueChallenge('Speed Math Challenge')}
            >
              Continue Challenge
            </button>
            <button className="bg-gray-500 px-6 py-2 rounded text-white">View Progress</button>
          </div>
          <p className="text-xs mt-2 text-gray-500">
            Day 7 will unlock after completing today's task.
          </p>
          {/* Button to open day selector */}
          <button
            className="bg-gray-600 text-white mt-4 px-6 py-2 rounded"
            onClick={() => setShowDaySelector(true)}
          >
            Go to Previous Challenges
          </button>
        </div>

        {/* 120 Rules Challenge Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-2">60-Day 120 Rules Challenge</h2>
          <div className="mb-4">
            <div className="bg-gray-400 h-2 rounded-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${rulesChallengeProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-400 mb-4">Rule 10 - Addition of Fractions</div>
          <div className="space-x-4">
            <button
              className="bg-blue-600 px-6 py-2 rounded text-white"
              onClick={() => handleContinueChallenge('120 Rules Challenge')}
            >
              Continue Challenge
            </button>
            <button className="bg-gray-500 px-6 py-2 rounded text-white">View Progress</button>
          </div>
          <p className="text-xs mt-2 text-gray-500">
            Day 7 will unlock after completing today's rule.
          </p>
          {/* Button to open day selector */}
          <button
            className="bg-gray-600 text-white mt-4 px-6 py-2 rounded"
            onClick={() => setShowDaySelector(true)}
          >
            Go to Previous Challenges
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-4">
        <p>
          &copy; 2025 BrightMinds | <a href="/terms" className="underline text-orange-500">Terms of Service</a> |{' '}
          <a href="/privacy" className="underline text-orange-500">Privacy Policy</a>
        </p>
      </footer>

      {/* Day Selector Modal */}
      {showDaySelector && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-dark p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl text-white mb-4">Select Previous Day</h3>
            <div className="space-y-2">
              {[...Array(6).keys()].map((day) => (
                <button
                  key={day}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedDay(day + 1); // Days are 1-based, so we add 1
                    setShowDaySelector(false);
                    navigateToPreviousChallenge('Speed Math Challenge');
                  }}
                >
                  Day {day + 1}
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setShowDaySelector(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;



