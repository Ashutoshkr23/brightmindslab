// app/challenge/math/page.tsx

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Lock, Star } from 'lucide-react';

export default function Page() {
    const totalDays = 30;
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // This should be replaced with your actual Firestore data fetching logic
    const [userProgress, setUserProgress] = useState<{ [key: string]: { stars: number } }>({});
    
    useEffect(() => {
        // Example data - replace with your data fetching call
        const fetchedProgress = {
            'day-1': { stars: 3 },
            'day-2': { stars: 2 },
            'day-3': { stars: 3 },
            'day-4': { stars: 1 },
        };
        setUserProgress(fetchedProgress);
    }, []);

    const [isExpanded, setIsExpanded] = useState(false);

    const lastCompletedDay = Object.keys(userProgress).length;
    const nextTaskDay = lastCompletedDay + 1;

    // --- Star Rating Component ---
    const StarRating = ({ count }: { count: number }) => (
        <div className="flex items-center">
            {Array.from({ length: 3 }).map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={i < count ? 'text-amber-400 fill-amber-400' : 'text-foreground/30'}
                />
            ))}
        </div>
    );

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-background">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-foreground mb-6">
                    30-Day Speed Math Mastery
                </h1>

                {/* --- Completed Tasks Dropdown --- */}
                {lastCompletedDay > 0 && (
                     <div className="mb-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex justify-between items-center p-4 bg-dark rounded-lg text-foreground border border-primary shadow-md transition-colors"
                        >
                            <span className="font-semibold">Completed Tasks</span>
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        {isExpanded && (
                            <div className="mt-2 space-y-2 animate-fadeIn">
                                {days.slice(0, lastCompletedDay).map(day => (
                                    <div key={day} className="flex justify-between items-center bg-dark p-3 rounded-lg text-foreground/80 border border-primary/50">
                                        <span className="font-medium">Day {day}</span>
                                        <StarRating count={userProgress[`day-${day}`]?.stars || 0} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
               
                {/* --- Next Task Card --- */}
                {nextTaskDay <= totalDays && (
                    <div className="mb-4">
                         <h2 className="text-sm font-semibold text-foreground/60 uppercase mb-2 ml-1">Next Task</h2>
                        <Link href={`/challenge/math/day/${nextTaskDay}`}>
                            <div className="w-full flex justify-between items-center p-4 bg-dark hover:bg-opacity-90 rounded-lg text-foreground font-bold text-lg border-2 border-primary shadow-lg cursor-pointer transition-all transform hover:scale-105">
                                Day {nextTaskDay}
                                <ChevronRight size={24} />
                            </div>
                        </Link>
                    </div>
                )}

                {/* --- Upcoming Locked Tasks --- */}
                {nextTaskDay < totalDays && (
                    <div>
                        <h2 className="text-sm font-semibold text-foreground/60 uppercase mb-2 ml-1">Upcoming</h2>
                        <div className="space-y-2">
                        {days.slice(nextTaskDay).map((day) => (
                            <div
                                key={day}
                                className="w-full flex justify-between items-center p-4 bg-dark/50 rounded-lg text-foreground/50 border border-primary/30"
                            >
                                <span className="font-medium">Day {day}</span>
                                <Lock size={16} />
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                 {nextTaskDay > totalDays && (
                    <div className="text-center p-8 bg-dark rounded-lg border border-primary shadow-lg">
                        <h2 className="text-2xl font-bold text-green-400">Congratulations!</h2>
                        <p className="text-foreground/80 mt-2">You have completed the 30-Day Challenge!</p>
                    </div>
                 )}
            </div>
        </main>
    );
}