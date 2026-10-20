"use client";

import React from "react";
import Image from "next/image";
import SpatialCoverflowHero from "./SpatialCoverflowHero";

export default function EndingSection() {
  return (
    <section
      id="ending"
      className="relative z-20 w-full px-3 pt-10 pb-16 sm:px-6 lg:px-8 overflow-hidden bg-[#1F1710]"
    >
      {/* ========================================================================= */}
      {/* 1. FONDO DE COCINA REAL: CONTINUACIÓN DIRECTA DE LA COCINA DE LA ABUELITA */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Imagen de cocina tradicional colombiana con desenfoque cálido */}
        <Image
          src="/images/kitchen_background.jpg"
          alt="Cocina tradicional colombiana"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top scale-105 filter blur-[1.5px] brightness-[0.38] contrast-[1.15] saturate-[1.25] transition-opacity duration-1000"
        />

        {/* Capa de transición superior: Disuelve el final de los 150 frames de la abuelita hacia esta cocina */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#2B2117] via-[#2B2117]/80 to-transparent" />

        {/* Atmósfera general: Calor de fogón de leña y brasas en el centro */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B2117]/70 via-[#231A12]/85 to-[#18110B]/98" />

        {/* Resplandor radial ámbar/dorado simulando la luz del fogón y la ventana */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(240,130,45,0.22),rgba(244,196,48,0.08)_45%,transparent_75%)]" />

        {/* Viñeta lateral para enmarcar las tarjetas y maximizar la legibilidad */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(24,17,11,0.85)_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. ISOTIPOS DE MARCA: MARCAS DE AGUA DE LA OLLA Y VAPOR TRADICIONAL       */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Isotipo 1: Gran Olla de Barro Tradicional (Arriba a la derecha) */}
        <div className="absolute -top-12 -right-16 w-80 sm:w-96 h-80 sm:h-96 opacity-[0.07] rotate-[-12deg] text-[#F4C430] transition-transform duration-700 hover:rotate-[-8deg]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
            <g strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Líneas de vapor ondulado */}
              <path d="M 38 28 C 43 22 35 17 40 11" />
              <path d="M 50 24 C 57 16 45 11 52 3" />
              <path d="M 62 28 C 67 22 59 17 64 11" />
              {/* Asa de la tapa */}
              <path d="M 43 37 A 7 7 0 0 1 57 37" />
              {/* Tapa abovedada */}
              <path d="M 19 44 Q 50 34 81 44" />
              {/* Cuerpo redondeado de la olla */}
              <path d="M 23 53 A 27 27 0 0 0 77 53" />
              {/* Asas laterales */}
              <path d="M 22 53 A 9 9 0 0 0 22 71" />
              <path d="M 78 53 A 9 9 0 0 1 78 71" />
            </g>
          </svg>
        </div>

        {/* Isotipo 2: Olla de Tierra Cocida (Abajo a la izquierda) */}
        <div className="absolute top-[48%] -left-20 w-88 sm:w-[420px] h-88 sm:h-[420px] opacity-[0.055] rotate-[15deg] text-[#F0822D]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
            <g strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 38 28 C 43 22 35 17 40 11" />
              <path d="M 50 24 C 57 16 45 11 52 3" />
              <path d="M 62 28 C 67 22 59 17 64 11" />
              <path d="M 43 37 A 7 7 0 0 1 57 37" />
              <path d="M 19 44 Q 50 34 81 44" />
              <path d="M 23 53 A 27 27 0 0 0 77 53" />
              <path d="M 22 53 A 9 9 0 0 0 22 71" />
              <path d="M 78 53 A 9 9 0 0 1 78 71" />
            </g>
          </svg>
        </div>

        {/* Isotipo 3: Mini Olla con destellos dorados (Centro inferior detrás del dock) */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-64 opacity-[0.04] text-[#62B869]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full stroke-current">
            <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 38 28 C 43 22 35 17 40 11" />
              <path d="M 50 24 C 57 16 45 11 52 3" />
              <path d="M 62 28 C 67 22 59 17 64 11" />
              <path d="M 43 37 A 7 7 0 0 1 57 37" />
              <path d="M 19 44 Q 50 34 81 44" />
              <path d="M 23 53 A 27 27 0 0 0 77 53" />
              <path d="M 22 53 A 9 9 0 0 0 22 71" />
              <path d="M 78 53 A 9 9 0 0 1 78 71" />
            </g>
          </svg>
        </div>

        {/* Espigas / Hojitas sutiles de sazón y yerbas de azotea (Esquinas) */}
        <div className="absolute top-28 left-6 w-24 h-24 opacity-[0.04] text-[#62B869] rotate-[-25deg]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" />
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BRASAS VIVAS Y VAPOR: DETALLES VIVOS DEL FOGÓN DE BARRIO               */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Puntos luminosos de calor cálido como chispitas flotantes de leña */}
        <div className="absolute top-[20%] left-[15%] h-1.5 w-1.5 rounded-full bg-[#F4C430] opacity-40 shadow-[0_0_8px_#F4C430] animate-ping" />
        <div className="absolute top-[35%] right-[20%] h-2 w-2 rounded-full bg-[#F0822D] opacity-35 shadow-[0_0_10px_#F0822D] animate-pulse" />
        <div className="absolute top-[65%] left-[25%] h-1 w-1 rounded-full bg-[#62B869] opacity-30 shadow-[0_0_6px_#62B869]" />
        <div className="absolute top-[75%] right-[12%] h-1.5 w-1.5 rounded-full bg-[#F4C430] opacity-35 shadow-[0_0_8px_#F4C430] animate-pulse" />
      </div>

      {/* ========================================================================= */}
      {/* 4. CONTENIDO PRINCIPAL: VISOR 3D SPATIAL HERO                             */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full mx-auto">
        <SpatialCoverflowHero />
      </div>
    </section>
  );
}