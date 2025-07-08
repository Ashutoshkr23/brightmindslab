"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Lock, Star, Crown } from 'lucide-react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// Corrected the import path to match our setup
import { challengeConfig } from "@/lib/dayGenerators"; 

// --- FIX: StarRating component moved outside the Page component ---
// This ensures it's only defined once and follows the Rules of Hooks.
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

// Define the shape of our progress data
interface DayProgress {
  completedTasks: Set<number>;
  totalTasks: number;
}

export default function Page() {
    const totalDays = 30;
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    
    // All hooks are now correctly at the top level of the component.
    const [user] = useAuthState(auth);
    const [userProgress, setUserProgress] = useState<Map<number, DayProgress>>(new Map());
    const [isPro, setIsPro] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchUserProgress = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && userSnap.data().isPro) {
                setIsPro(true);
            }

            const attemptsRef = collection(db, 'users', user.uid, 'attempts');
            const attemptsSnap = await getDocs(attemptsRef);

            const progress = new Map<number, DayProgress>();

            attemptsSnap.forEach(doc => {
                const attempt = doc.data();
                const day = attempt.day;
                const task = attempt.taskNo;

                if (day && task) {
                    if (!progress.has(day)) {
                        progress.set(day, {
                            completedTasks: new Set(),
                            totalTasks: challengeConfig[day]?.tasks.length || 0,
                        });
                    }
                    progress.get(day)!.completedTasks.add(task);
                }
            });

            setUserProgress(progress);
            setIsLoading(false);
        };

        fetchUserProgress();
    }, [user]);

    // This logic is fine and does not involve hooks.
    let lastCompletedDay = 0;
    for (let day = 1; day <= totalDays; day++) {
        const progress = userProgress.get(day);
        if (progress && progress.completedTasks.size >= progress.totalTasks) {
            lastCompletedDay = day;
        } else {
            break; 
        }
    }
    const nextTaskDay = lastCompletedDay + 1;
    
    if (isLoading) {
        return <div className="text-center p-10">Loading Your Progress...</div>
    }

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
                                    <Link href={`/challenge/math/day/${day}`} key={day}>
                                      <div className="flex justify-between items-center bg-dark p-3 rounded-lg text-foreground/80 border border-primary/50 cursor-pointer hover:border-primary">
                                          <span className="font-medium">Day {day}</span>
                                          <StarRating count={3} />
                                      </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                   </div>
                )}
                
                {/* --- Next Task Card --- */}
                {nextTaskDay <= totalDays && (
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-foreground/60 uppercase mb-2 ml-1">Next Task</h2>
                        {nextTaskDay > 7 && !isPro ? (
                            <div className="w-full flex flex-col items-center p-4 bg-dark rounded-lg text-foreground border-2 border-amber-400 shadow-lg">
                                <Crown size={24} className="text-amber-400 mb-2"/>
                                <span className="font-bold text-lg text-center">Unlock Day {nextTaskDay} with Pro</span>
                                <Link href="/pro-upgrade" className="mt-3 bg-amber-400 text-dark px-4 py-1 rounded-md text-sm font-semibold">Upgrade</Link>
                            </div>
                        ) : (
                            <Link href={`/challenge/math/day/${nextTaskDay}`}>
                                <div className="w-full flex justify-between items-center p-4 bg-dark hover:bg-opacity-90 rounded-lg text-foreground font-bold text-lg border-2 border-primary shadow-lg cursor-pointer transition-all transform hover:scale-105">
                                    Day {nextTaskDay}
                                    <ChevronRight size={24} />
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* --- Upcoming Locked Tasks --- */}
                {nextTaskDay < totalDays && (
                    <div>
                        <h2 className="text-sm font-semibold text-foreground/60 uppercase mb-2 ml-1">Upcoming</h2>
                        <div className="space-y-2">
                        {days.slice(nextTaskDay).map((day) => {
                            const isProRequired = day > 7 && !isPro;
                            return (
                                <div key={day} className="w-full flex justify-between items-center p-4 bg-dark/50 rounded-lg text-foreground/50 border border-primary/30">
                                    <span className="font-medium">Day {day}</span>
                                    {isProRequired ? <Crown size={16} className="text-amber-400" /> : <Lock size={16} />}
                                </div>
                            );
                        })}
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