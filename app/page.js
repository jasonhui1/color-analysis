'use client'
import { Suspense } from "react";
import ColorAnalysis from "./ColorAnalysis";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ColorAnalysis />
    </Suspense>
  );
}
