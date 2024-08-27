'use client'
import { Suspense } from "react";
import ColorAnalysis from "./ColorAnalysis";
import { ColorProvider } from "@/context/color";
import { ImageProvider } from "@/context/image";
import { MainCanvasProvider } from "@/context/mainCanvas";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ColorProvider>
        <ImageProvider>
          <MainCanvasProvider>
            <ColorAnalysis />
          </MainCanvasProvider>
        </ImageProvider>
      </ColorProvider>
    </Suspense>
  );
}
