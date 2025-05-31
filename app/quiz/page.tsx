import React, { Suspense } from "react";
import QuizClient from "./Quizclient.tsx/page";

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <QuizClient />
    </Suspense>
  );
}



