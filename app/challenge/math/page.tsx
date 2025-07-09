"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Lock, Star, Crown } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { challengeConfig } from "@/lib/dayGenerators";

// ─── define the shape of your user document ─────────────────────────────────
type UserProfile = {
  isPro?: boolean;
};

// ─── StarRating component ──────────────────────────────────────────────────────
const StarRating = ({ count }: { count: number }) => (
  <div className="flex items-center">
    {Array.from({ length: 3 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? "text-amber-400 fill-amber-400" : "text-foreground/30"}
      />
    ))}
  </div>
);

// ─── shape of our progress data ─────────────────────────────────────────────────
interface DayProgress {
  completedTasks: Set<number>;
  totalTasks: number;
}

export default function Page() {
  // ─── Hooks ────────────────────────────────────────────────────────────────────
  const [user] = useAuthState(auth);
  const [userProgress, setUserProgress] = useState<Map<number, DayProgress>>(new Map());
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // ─── Derive days & total from your config ───────────────────────────────────────
  const days = Object.keys(challengeConfig)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);
  const totalDays = days.length;

  // ─── Fetch user’s attempts & pro-status ─────────────────────────────────────────
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // load user profile
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as UserProfile | undefined;
      if (userData?.isPro) {
        setIsPro(true);
      }

      // load all attempt docs
      const attemptsRef = collection(db, "users", user.uid, "attempts");
      const attemptsSnap = await getDocs(attemptsRef);

      const progress = new Map<number, DayProgress>();
      attemptsSnap.forEach((docSnap) => {
        const { day, taskNo } = docSnap.data() as { day: number; taskNo: number };
        if (day != null && taskNo != null) {
          if (!progress.has(day)) {
            progress.set(day, {
              completedTasks: new Set(),
              totalTasks: challengeConfig[day]?.tasks.length ?? 0,
            });
          }
          progress.get(day)!.completedTasks.add(taskNo);
        }
      });

      setUserProgress(progress);
      setIsLoading(false);
    };

    fetchUserProgress();
  }, [user]);

  // ─── Compute last fully completed day ──────────────────────────────────────────
  let lastCompletedDay = 0;
  for (const d of days) {
    const prog = userProgress.get(d);
    if (prog && prog.completedTasks.size >= prog.totalTasks) {
      lastCompletedDay = d;
    } else {
      break;
    }
  }
  const nextTaskDay = lastCompletedDay + 1;

  // ─── Loading placeholder ──────────────────────────────────────────────────────
  if (isLoading) {
    return <div className="text-center p-10">Loading Your Progress…</div>;
  }

  // ─── Main UI ──────────────────────────────────────────────────────────────────
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-foreground mb-6">
          30-Day Speed Math Mastery
        </h1>

        {/* Completed Tasks */}
        {lastCompletedDay > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex justify-between items-center p-4 bg-dark rounded-lg text-foreground border border-primary shadow-md"
            >
              <span className="font-semibold">Completed Tasks</span>
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {isExpanded && (
              <div className="mt-2 space-y-2 animate-fadeIn">
                {days
                  .filter((d) => d <= lastCompletedDay)
                  .map((d) => (
                    <Link href={`/challenge/math/day/${d}`} key={d}>
                      <div className="flex justify-between items-center bg-dark p-3 rounded-lg text-foreground/80 border border-primary/50 hover:border-primary cursor-pointer">
                        <span className="font-medium">Day {d}</span>
                        <StarRating count={3} />
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Next Task */}
        {nextTaskDay <= totalDays && (
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground/60 uppercase mb-2 ml-1">
              Next Task
            </h2>
            {nextTaskDay > 7 && !isPro ? (
              <div className="w-full flex flex-col items-center p-4 bg-dark rounded-lg text-foreground border-2 border-amber-400 shadow-lg">
                <Crown size={24} className="text-amber-400 mb-2" />
                <span className="font-bold text-lg text-center">
                  Unlock Day {nextTaskDay} with Pro
                </span>
                <Link
                  href="/pro-upgrade"
                  className="mt-3 bg-amber-400 text-dark px-4 py-1 rounded-md text-sm font-semibold"
                >
                  Upgrade
                </Link>
              </div>
            ) : (
              <Link href={`/challenge/math/day/${nextTaskDay}`}>
                <div className="w-full flex justify-between items-center p-4 bg-dark hover:bg-opacity-90 rounded-lg text-foreground font-bold text-lg border-2 border-primary shadow-lg transition transform hover:scale-105 cursor-pointer">
                  Day {nextTaskDay}
                  <ChevronRight size={24} />
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Upcoming Locked Tasks */}
        {nextTaskDay < totalDays && (
          <div>
            <h2 className="text-sm font-semibold text-foreground/60 uppercase mb-2 ml-1">
              Upcoming
            </h2>
            <div className="space-y-2">
              {days
                .filter((d) => d > nextTaskDay)
                .map((d) => {
                  const proNeeded = d > 7 && !isPro;
                  return (
                    <div
                      key={d}
                      className="w-full flex justify-between items-center p-4 bg-dark/50 rounded-lg text-foreground/50 border border-primary/30"
                    >
                      <span className="font-medium">Day {d}</span>
                      {proNeeded ? (
                        <Crown size={16} className="text-amber-400" />
                      ) : (
                        <Lock size={16} />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Completed All */}
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

