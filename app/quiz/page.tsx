'use client'
import React, { Suspense } from "react";

import QuizClient from "@/Components/QuizClient";
export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizClient />
    </Suspense>
  );
}



