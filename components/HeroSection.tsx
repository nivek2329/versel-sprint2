"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ChefHat, UtensilsCrossed, ChevronDown, Sparkles, CircleHelp } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const kitchenHeight = document.getElementById("kitchen-scroll")?.getBoundingClientRect().height ?? document.documentElement.scrollHeight;
      const scrollHeight = kitchenHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.max(0, Math.min(1, scrollY / scrollHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Title lockup fade out (0% to ~45% scroll)
  const titleOpacity = Math.max(0, Math.min(1, 1 - scrollProgress * 2.2));
  const titleScale = 1 + scrollProgress * 0.08;

  // Glass pill buttons fade in smoothly at kitchen table scene (~65% to 100% scroll)
  const buttonsOpacity = scrollProgress < 0.65 
    ? 0 
    : Math.max(0, Math.min(1, (scrollProgress - 0.65) * 3.5));

  const quickBarOpacity = 1;

  const handleScrollDownClick = () => {
    const guide = document.getElementById("community-guide");
    if (!guide) return;

    const targetTop = guide.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    window.dispatchEvent(new Event("ollacercana:show-home-guide"));
  };

  return (
    <section className="relative h-full w-full bg-transparent text-[#FAF3E7] flex flex-col items-center justify-between overflow-hidden select-none font-sans min-h-screen">
      
      {/* ========================================================================= */}
      {/* 1. STARTING TITLE LOCKUP (0% SCROLL - FADES OUT ON SCROLL) */}
      {/* ========================================================================= */}
      <div 
        className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center justify-center text-center pointer-events-none transition-opacity duration-75 ease-out my-auto pt-8"
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          visibility: titleOpacity === 0 ? "hidden" : "visible",
        }}
      >
        <BrandLogo size="xl" showTagline={true} taglineColor="text-[#FDF3D6] drop-shadow-md" />
      </div>

      {/* ========================================================================= */}
      {/* 2. SCROLL GUIDANCE & QUICK ACCESS BAR */}
      {/* ========================================================================= */}
      <div 
        className="relative z-40 w-full max-w-4xl mx-auto px-4 pb-6 flex flex-col items-center gap-3 transition-opacity duration-300 pointer-events-auto"
        style={{ opacity: quickBarOpacity }}
      >
        {/* Scroll Hint (Desliza hacia abajo) */}
        {scrollProgress < 0.25 && (
          <button 
            onClick={handleScrollDownClick}
            className="group flex flex-col items-center gap-1.5 cursor-pointer text-[#FAF3E7] hover:text-[#F4C430] transition-all transform hover:scale-105"
            aria-label="Avanzar hasta los accesos al menú, al mapa y a las cocineras"
          >
            <span className="font-['Caveat',cursive] text-lg sm:text-xl font-bold tracking-wide flex items-center gap-1.5 bg-[#2B2117]/90 px-3.5 py-1 rounded-full border border-[#F0822D]/50 shadow-md">
              <Sparkles className="w-4 h-4 text-[#F4C430] animate-pulse" />
              Explora la cocina y sus accesos
            </span>
            <span className="text-center text-[10px] font-bold tracking-wide text-[#FAF3E7]/90">
              Desliza hacia abajo para recorrer la cocina de la abuelita
            </span>
            <ChevronDown className="w-6 h-6 text-[#F0822D] animate-bounce" />
          </button>
        )}

        {scrollProgress >= 0.25 && scrollProgress < 0.65 && (
          <p className="rounded-full border border-[#F0822D]/50 bg-[#2B2117]/90 px-4 py-2 text-center text-xs font-bold text-[#FAF3E7] shadow-md">
            Sigue deslizando · Mapa, cocineras y menú en los objetos de la cocina
          </p>
        )}

        {scrollProgress >= 0.65 && (
          <p className="rounded-full border border-[#62B869]/60 bg-[#2B2117]/95 px-4 py-1.5 text-center text-xs font-bold text-[#62B869] shadow-lg flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#62B869] animate-ping" />
            ¡Toca los elementos de la cocina para explorar!
          </p>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE CHALKBOARD PILL BADGES OVER EXACT CANVAS OBJECTS */}
      {/* ========================================================================= */}
      <div 
        className="absolute inset-0 z-30 w-full h-full pointer-events-auto transition-all duration-300 ease-out"
        style={{
          opacity: buttonsOpacity,
          visibility: buttonsOpacity === 0 ? "hidden" : "visible",
        }}
      >
        <div className="relative w-full h-full inset-0">
          
          {/* =================================================================== */}
          {/* BADGE 1: MAPA (VERDE - EN LA VENTANA DERECHA DE LA COCINA) */}
          {/* =================================================================== */}
          <Link
            href="/cocineras-cercanas"
            className="group absolute right-[4%] sm:right-[7%] lg:right-[9%] top-[16%] sm:top-[18%] -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 z-30"
          >
            {/* Pulsing ring indicator */}
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-[#62B869]/50 blur-sm animate-pulse group-hover:bg-[#62B869]/80" />
              <div className="relative bg-[#2B2117]/95 border-2 border-[#62B869] px-4 py-2 rounded-full flex items-center gap-2.5 shadow-[0_8px_25px_rgba(43,33,23,0.85)] group-hover:bg-[#5B4A38]">
                <MapPin className="w-5 h-5 text-[#62B869] shrink-0 animate-bounce" />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-['Caveat',cursive] text-xl font-bold text-[#FAF3E7] tracking-wide">Mapa</span>
                  <span className="text-[10px] font-sans text-[#62B869] font-bold uppercase tracking-wider">¡Comida cerca de ti!</span>
                </div>
              </div>
            </div>
            {/* Hand Pointer */}
            <div className="mt-1.5 flex items-center gap-1 bg-[#2B2117]/95 px-2.5 py-0.5 rounded-full border border-[#62B869]/70 shadow-md">
              <span className="text-[10px] font-bold text-[#FAF3E7] font-sans">Toca para abrir el mapa del barrio</span>
            </div>
          </Link>

          {/* =================================================================== */}
          {/* BADGE 2: COCINERAS (AMARILLO - EN EL GABINETE / ESTANTERÍA DE OLLAS) */}
          {/* =================================================================== */}
          <Link
            href="/cocineras-cercanas"
            className="group absolute left-[30%] sm:left-[35%] lg:left-[38%] top-[18%] sm:top-[20%] -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 z-30"
          >
            {/* Pulsing ring indicator */}
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-[#F4C430]/50 blur-sm animate-pulse group-hover:bg-[#F4C430]/80" />
              <div className="relative bg-[#2B2117]/95 border-2 border-[#F4C430] px-4 py-2 rounded-full flex items-center gap-2.5 shadow-[0_8px_25px_rgba(43,33,23,0.85)] group-hover:bg-[#5B4A38]">
                <ChefHat className="w-5 h-5 text-[#F4C430] shrink-0 animate-bounce" />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-['Caveat',cursive] text-xl font-bold text-[#FAF3E7] tracking-wide">Cocineras</span>
                  <span className="text-[10px] font-sans text-[#F4C430] font-bold uppercase tracking-wider">¡Sabor de barrio!</span>
                </div>
              </div>
            </div>
            {/* Hand Pointer */}
            <div className="mt-1.5 flex items-center gap-1 bg-[#2B2117]/95 px-2.5 py-0.5 rounded-full border border-[#F4C430]/70 shadow-md">
              <span className="text-[10px] font-bold text-[#FAF3E7] font-sans">Toca para encontrar cocineras</span>
            </div>
          </Link>

          {/* =================================================================== */}
          {/* BADGE 3: MENÚ (NARANJA - SOBRE LA PLANCHA DE AREPAS EN LA MESA)    */}
          {/* =================================================================== */}
          <Link
            href="/menu"
            className="group absolute left-1/2 -translate-x-1/2 top-[68%] sm:top-[70%] -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-110 z-30"
          >
            {/* Pulsing ring indicator */}
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-[#F0822D]/60 blur-sm animate-pulse group-hover:bg-[#F0822D]/90" />
              <div className="relative bg-[#2B2117]/95 border-2 border-[#F0822D] px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_25px_rgba(43,33,23,0.85)] group-hover:bg-[#5B4A38]">
                <UtensilsCrossed className="w-5 h-5 text-[#F0822D] shrink-0 animate-bounce" />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-['Caveat',cursive] text-2xl font-bold text-[#FAF3E7] tracking-wide">Menú del Día</span>
                  <span className="text-[10px] font-sans text-[#F0822D] font-bold uppercase tracking-wider">¡Arepas & Platos calientes!</span>
                </div>
              </div>
            </div>
            {/* Hand Pointer */}
            <div className="mt-1.5 flex items-center gap-1 bg-[#2B2117]/95 px-3 py-0.5 rounded-full border border-[#F0822D]/70 shadow-md">
              <span className="text-[10px] font-bold text-[#FAF3E7] font-sans">Toca para explorar los platos caseros</span>
            </div>
          </Link>

        </div>
      </div>

    </section>
  );
}
