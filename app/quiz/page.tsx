'use client'
import React, { Suspense } from "react";

import QuizClient from "@/Components/QuizClient";
export default function QuizPage() {
  return (
    <Suspense  fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background text-light p-6">
      <QuizClient />
      </div>

    </Suspense>
  );
}



