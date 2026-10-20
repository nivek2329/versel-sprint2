"use client";

import React, { useRef, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ScrollCanvasBackground from "@/components/ScrollCanvasBackground";
import EndingSection from "@/components/EndingSection";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#ending") {
      const el = document.getElementById("ending");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, []);

  return (
    <main
      data-theme-page
      className="w-full overflow-hidden bg-[#2B2117] text-[#FAF3E7] selection:bg-[#F0822D] selection:text-[#2B2117]"
    >
      {/* ========================================================================= */}
      {/* 1. KITCHEN SCROLL WITH 150 FRAMES OF THE ABUELITA                         */}
      {/* ========================================================================= */}
      <div
        id="kitchen-scroll"
        ref={containerRef}
        className="relative min-h-[300vh] w-full sm:min-h-[400vh]"
      >
        <ScrollCanvasBackground
          scrollContainerRef={containerRef}
          totalFrames={150}
        />
        <div className="sticky left-0 top-0 z-10 flex h-[100svh] min-h-[560px] w-full flex-col justify-between overflow-hidden">
          <HeroSection />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REVOLUTIONARY INTERACTIVE ENDING PAGE (OLLACERCANA SPATIAL EXPERIENCE) */}
      {/* ========================================================================= */}
      <EndingSection />
    </main>
  );
}