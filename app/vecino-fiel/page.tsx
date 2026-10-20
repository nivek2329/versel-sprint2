"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Utensils,
  CookingPot,
  UserCheck,
  Star,
  ChevronLeft,
  Calendar,
  Percent,
  BookOpen,
  Coffee
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import {
  getVecinoFielStatus,
  syncVecinoFielAfterCompletion,
  getStoredReservations,
  saveReservations,
  Reservation,
  VecinoFielSummary,
  getMonthKey
} from "@/lib/ollacercana-store";

export default function VecinoFielPage() {
  const [summary, setSummary] = useState<VecinoFielSummary>({
    isVecinoFiel: false,
    unlockedCooks: [],
    inProgressCooks: [],
    totalCompletedThisMonth: 0,
    allCookStreaks: [],
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const refreshStreaks = () => {
    const updated = getVecinoFielStatus();
    setSummary(updated);
  };

  useEffect(() => {
    refreshStreaks();

    const handleUpdated = () => refreshStreaks();
    window.addEventListener("vecinofiel-updated", handleUpdated);
    window.addEventListener("storage", handleUpdated);

    return () => {
      window.removeEventListener("vecinofiel-updated", handleUpdated);
      window.removeEventListener("storage", handleUpdated);
    };
  }, []);

  // Simulación interactiva para evaluar HU-21:
  // Escenario 1: Completar entrega para avanzar racha y desbloquear insignia y 5% de descuento
  const handleSimulateDelivery = (cookId: string, cookName: string) => {
    const all = getStoredReservations();
    const newReservation: Reservation = {
      id: `sim-res-${Date.now()}`,
      dishId: `dish-${cookId}`,
      dishName: "Almuerzo Casero de Barrio",
      dishImage: "/images/menu_ajiaco.jpg",
      cookId,
      cookName,
      cookAvatar: "/images/dona_rosa_mascot.jpg",
      cookResidentialComplex: "Conjunto El Rosal",
      buyerName: "Vecino Comprador",
      buyerEmail: "comprador@ollacercana.com",
      portions: 1,
      pricePerPortion: 16000,
      totalPrice: 16000,
      preferredPaymentMethod: "Efectivo",
      pickupTime: "12:30 PM",
      status: "COMPLETADA",
      buyerConfirmedDelivery: true,
      cookConfirmedDelivery: true,
      cookConfirmedPayment: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    };

    const updated = [newReservation, ...all];
    saveReservations(updated);
    syncVecinoFielAfterCompletion(newReservation);
    refreshStreaks();

    setNotificationMsg(`¡Entrega completada con ${cookName}! Racha actualizada.`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Escenario 3: Simular inactividad de un mes (reinicio de racha)
  const handleSimulateMonthReset = (cookId: string, cookName: string) => {
    const all = getStoredReservations();
    const pastMonthDate = new Date();
    pastMonthDate.setMonth(pastMonthDate.getMonth() - 1);
    const pastIso = pastMonthDate.toISOString();

    const updated = all.map((r) => {
      if (r.cookId === cookId) {
        return { ...r, completedAt: pastIso, createdAt: pastIso };
      }
      return r;
    });

    saveReservations(updated);
    refreshStreaks();

    setNotificationMsg(`Simulación de mes vencido: la racha con ${cookName} se ha reiniciado (HU-21 Escenario 3).`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <main
      data-theme-page
      className="min-h-screen w-full bg-[#FAF3E7] text-[#2B2117] font-['Outfit',sans-serif] selection:bg-[#F0822D] selection:text-white pb-20"
      style={{
        backgroundImage: "radial-gradient(ellipse at 15% 15%, rgba(240,130,45,0.05), transparent 45%), radial-gradient(ellipse at 85% 85%, rgba(98,184,105,0.05), transparent 45%)"
      }}
    >
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2B2117] text-[#FAF3E7] px-6 py-3 rounded-full shadow-2xl border-2 border-[#F0822D] text-xs font-bold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#F4C430]" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* ── BARRA SUPERIOR (Cálida y armónica con OllaCercana) ── */}
      <header className="sticky top-0 z-40 bg-[#FAF3E7]/95 backdrop-blur-md border-b border-[#E6D4B8] px-2 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="transition-transform hover:scale-105">
              <BrandLogo size="md" showTagline={false} />
            </Link>
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#A84029] bg-[#F7E7D2] px-2.5 py-0.5 rounded-full border border-[#E8CDAE]">
              Cuaderno de Fidelidad Vecinal · HU-21
            </span>
          </div>

          <nav className="flex items-center gap-1.5 sm:gap-4">
            <Link
              href="/menu"
              aria-label="Ver Menú"
              className="flex items-center gap-1.5 text-xs font-bold text-[#5B4A38] hover:text-[#F0822D] bg-[#EFE0C2] hover:bg-[#E8D1A3] px-2 sm:px-3.5 py-2 rounded-full border border-[#D9B68C] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#F0822D]" />
              <span className="hidden min-[420px]:inline">Ver Menú</span>
            </Link>
            <Link
              href="/cocineras-cercanas"
              className="text-xs font-bold text-[#5B4A38] hover:text-[#F0822D] px-3 py-2 rounded-full transition-colors hidden md:inline-block"
            >
              Cocineras Cerca
            </Link>
            <Link
              href="/cuenta/perfil"
              aria-label="Mi Perfil"
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#F0822D] hover:bg-[#D97224] px-2 sm:px-4 py-2 rounded-full shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden min-[420px]:inline">Mi Perfil</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ── HERO SECTION: CODIFICADO COMPLETAMENTE EN EL ESTILO DE LA REFERENCIA ── */}
      {/* ========================================================================= */}
      <section className="relative px-3 sm:px-6 pt-5 pb-8 max-w-7xl mx-auto">
        
        {/* Contenedor principal con fondo de madera cálida e iluminación matutina */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(43,33,23,0.22)] border-2 sm:border-3 border-[#D9B68C] bg-[#E2CEB1] p-4 sm:p-7 lg:p-9">
          
          {/* Fondo fotográfico de cocina iluminada con velo cálido */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/kitchen_background.jpg"
              alt=""
              fill
              className="object-cover object-center filter brightness-95 contrast-105"
            />
            {/* Resplandor cálido de ventana solar matutina */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF3E7]/90 via-[#FAF3E7]/75 to-[#FAF3E7]/85" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E8D1A3]/25 to-[#2B1B11]/25" />
          </div>

          {/* ── BARRA SUPERIOR DE PARGAMINO (Header interior del Hero) ── */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
            
            {/* Pill izquierdo: OllaCercana | CUADERNO DE FIDELIDAD VECINAL */}
            <div className="inline-flex items-center gap-3 bg-[#FAF3E7] border border-[#D9B68C] px-4 py-2 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1.5">
                <CookingPot className="w-4 h-4 text-[#F0822D]" />
                <span className="font-['Caveat',cursive] text-xl font-bold text-[#2B2117] leading-none">
                  OllaCercana
                </span>
              </div>
              <div className="h-4 w-[1.5px] bg-[#D9B68C]" />
              <span className="text-[10px] font-bold text-[#5B4A38] uppercase tracking-wider font-mono">
                CUADERNO DE FIDELIDAD VECINAL
              </span>
            </div>

            {/* Pill derecho: Mes en curso */}
            <div className="inline-flex items-center gap-2 bg-[#FAF3E7] border border-[#D9B68C] px-3.5 py-1.5 rounded-2xl shadow-sm text-xs font-bold text-[#5B4A38]">
              <Calendar className="w-3.5 h-3.5 text-[#F0822D]" />
              <span>Mes en curso:</span>
              <span className="text-[#A84029] font-mono">{getMonthKey(new Date())}</span>
            </div>
          </div>

          {/* ── GRILLA DE 3 BLOQUES IDÉNTICA A LA COMPOSICIÓN DE TU REFERENCIA ── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* =================================================================== */}
            {/* 1. HOJA IZQUIERDA: RECONOCIMIENTO OFICIAL / VECINO DEL MES / METAS  */}
            {/* =================================================================== */}
            <div className="lg:col-span-4 bg-[#FBF5E8] border border-[#D9B68C] rounded-2xl p-5 sm:p-6 shadow-[0_10px_25px_rgba(43,33,23,0.14)] rotate-[-0.8deg] hover:rotate-0 transition-transform duration-300 flex flex-col justify-between">
              <div>
                {/* Etiqueta superior */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#A84029]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
                  <span>RECONOCIMIENTO OFICIAL</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
                </div>

                {/* Título en tipografía gruesa artesanal con corazón doodle */}
                <div className="relative my-2.5">
                  <h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl font-black text-[#2B2117] leading-[0.88] tracking-tight uppercase">
                    VECINO<br />
                    <span className="text-[#3E5326]">FIEL</span>
                  </h1>
                  <span className="absolute top-0.5 right-6 sm:right-10 font-['Caveat',cursive] text-4xl text-[#F0822D] font-bold rotate-12 select-none pointer-events-none">
                    ♡
                  </span>
                </div>

                <p className="text-xs text-[#5B4A38] leading-relaxed mb-4">
                  Un homenaje a quienes eligen comer casero una y otra vez, fortaleciendo el lazo con las cocineras de su propio conjunto.
                </p>

                {/* Ficha técnica interior redondeada */}
                <div className="rounded-xl bg-[#F4E8D3]/75 border border-[#D9B68C] p-3.5 space-y-2 text-xs font-bold text-[#2B2117]">
                  
                  {/* Rango 5 Estrellas */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B4A38]">RANGO:</span>
                    <div className="flex items-center gap-1 text-[#F4C430]">
                      <Star className="w-3.5 h-3.5 fill-[#F4C430]" />
                      <Star className="w-3.5 h-3.5 fill-[#F4C430]" />
                      <Star className="w-3.5 h-3.5 fill-[#F4C430]" />
                      <Star className="w-3.5 h-3.5 fill-[#F4C430]" />
                      <Star className="w-3.5 h-3.5 fill-[#F4C430]" />
                      <span className="text-[10px] text-[#8A6D4B] ml-1 font-mono">5 ESTRELLAS</span>
                    </div>
                  </div>

                  {/* Impacto */}
                  <div className="flex items-center justify-between border-t border-[#E8CDAE] pt-1.5">
                    <span className="text-[#5B4A38]">IMPACTO:</span>
                    <span className="text-[#3E5326] flex items-center gap-1 font-bold">
                      <CookingPot className="w-3.5 h-3.5 text-[#62B869]" /> Cero Desperdicio
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between border-t border-[#E8CDAE] pt-1.5">
                    <span className="text-[#5B4A38]">META:</span>
                    <span className="font-bold text-[#2B2117]">3 entregas / mes</span>
                  </div>

                  {/* Beneficio 5% */}
                  <div className="flex items-center justify-between border-t border-[#E8CDAE] pt-1.5">
                    <span className="text-[#5B4A38]">PREMIO:</span>
                    <span className="text-[#A84029] font-bold flex items-center gap-1">
                      <Percent className="w-3 h-3" /> 5% dto. próximo pedido
                    </span>
                  </div>

                  {/* Estado */}
                  <div className="flex items-center justify-between border-t border-[#E8CDAE] pt-1.5">
                    <span className="text-[#5B4A38]">ESTADO:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      summary.isVecinoFiel
                        ? "bg-[#DCE4CE] text-[#42542E] border border-[#75865A]"
                        : "bg-[#F7E7D2] text-[#A84029] border border-[#E8CDAE]"
                    }`}>
                      {summary.isVecinoFiel ? "🌟 Insignia Activa" : "⏳ Racha en Progreso"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pastilla inferior de verificación */}
              <div className="mt-4 rounded-xl bg-[#E8EFE0] border border-[#687A49]/35 p-2.5 text-[11px] text-[#3D5426] font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#52663D] shrink-0" />
                <span>Sello otorgado de manera automática al registrarse la 3ra entrega.</span>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 2. POLAROID CENTRAL: DOÑA ROSA CON CINTA Y SELLO DE BARRIO         */}
            {/* =================================================================== */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              
              <div className="relative w-full max-w-[325px] bg-white p-3.5 pb-5 rounded-xs shadow-[0_16px_36px_rgba(43,33,23,0.25)] border border-[#CBB089] rotate-[0.6deg] hover:rotate-0 transition-transform duration-300">
                
                {/* Cinta washi tape adhesiva en la parte superior */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#D8BD82]/95 rotate-[-1deg] border border-[#C4A974] shadow-xs z-20" />

                {/* Fotografía de Doña Rosa cocinando */}
                <div className="relative w-full aspect-[4/5] rounded-xs overflow-hidden bg-[#FAF3E7] border border-[#E6D4B8]">
                  <Image
                    src="https://images.unsplash.com/photo-1556911073-a517e752729c?auto=format&fit=crop&crop=faces&w=900&h=1100&q=90"
                    alt="Doña Rosa cocinando en su cocina"
                    fill
                    sizes="340px"
                    className="object-cover object-top"
                    priority
                  />

                  {/* Sello circular rojo "100% Casero de barrio" */}
                  <div className="absolute top-2.5 right-2.5 z-10 w-16 h-16 rounded-full border-2 border-dashed border-[#C84B31] bg-[#FAF3E7]/95 p-1 rotate-[14deg] flex flex-col items-center justify-center text-center shadow-xs">
                    <span className="text-[7px] font-bold text-[#A84029] uppercase leading-none">OllaCercana</span>
                    <span className="text-[10px] font-['Caveat',cursive] font-bold text-[#2B2117] leading-none my-0.5">100% Casero</span>
                    <span className="text-[6px] font-bold text-[#52663D] uppercase leading-none">de barrio</span>
                  </div>
                </div>

                {/* Pie de foto manuscrito en Caveat con ramitas de romero */}
                <div className="mt-3 text-center">
                  <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#2B2117] leading-tight flex items-center justify-center gap-1.5">
                    <span>Doña Rosa & la sazón del barrio</span>
                    <span className="text-[#F0822D]">♡</span>
                  </h3>
                  <p className="text-[10px] font-bold text-[#52663D] uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                    <span>🌿</span> «COCINANDO CON EL CORAZÓN CADA DÍA» <span>🌿</span>
                  </p>
                </div>
              </div>

            </div>

            {/* =================================================================== */}
            {/* 3. COLUMNA DERECHA: LAS 3 FICHAS (I, II, III) + BOTÓN NARANJA      */}
            {/* =================================================================== */}
            <div className="lg:col-span-4 space-y-3">
              
              {/* Tarjeta I: El Pacto de la Mesa */}
              <div className="rounded-2xl bg-[#FBF5E8] border border-[#D9B68C] p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F3DDC2] text-[11px] font-bold text-[#A84029]">
                    I
                  </span>
                  <h4 className="font-['Caveat',cursive] text-xl font-bold text-[#2B2117] leading-none">
                    El Pacto de la Mesa
                  </h4>
                </div>
                <p className="text-xs text-[#5B4A38] leading-relaxed">
                  Completa 3 reservas en un mismo mes con la misma cocinera. Al efectuar la 3ra entrega, el sistema te otorga la insignia de forma automática.
                </p>
              </div>

              {/* Tarjeta II: Constancia y Cero Desperdicio */}
              <div className="rounded-2xl bg-[#FBF5E8] border border-[#D9B68C] p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCE4CE] text-[11px] font-bold text-[#52663D]">
                    II
                  </span>
                  <h4 className="font-['Caveat',cursive] text-xl font-bold text-[#2B2117] leading-none">
                    Constancia y Cero Desperdicio
                  </h4>
                </div>
                <p className="text-xs text-[#5B4A38] leading-relaxed">
                  Pedir seguido le permite a la vecina planificar sus compras sin desperdiciar nada. Si pasa un mes entero sin pedir, el contador se reinicia.
                </p>
              </div>

              {/* Tarjeta III: El Privilegio de la Casa & 5% Dto. */}
              <div className="rounded-2xl bg-[#FBF5E8] border border-[#D9B68C] p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5E9D2] text-[11px] font-bold text-[#80694D]">
                    III
                  </span>
                  <h4 className="font-['Caveat',cursive] text-xl font-bold text-[#2B2117] leading-none">
                    El Privilegio de la Casa
                  </h4>
                </div>
                <p className="text-xs text-[#5B4A38] leading-relaxed">
                  Tu perfil y opiniones lucirán el sello distintivo. Además, recibes <strong className="text-[#A84029]">5% de descuento en tu siguiente pedido</strong> con ella.
                </p>
              </div>

              {/* Botón naranja idéntico a la referencia: Explorar menú y empezar racha */}
              <Link
                href="/menu"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E66A1F] to-[#D85718] hover:from-[#d55e16] hover:to-[#c44c12] text-white py-3.5 px-6 font-bold text-xs sm:text-sm shadow-[0_6px_20px_rgba(230,106,31,0.35)] hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Explorar menú y empezar racha →</span>
              </Link>
            </div>

          </div>

          {/* ── AMBIENTACIÓN INFERIOR DE LA MESA (Cuaderno de recetas) ── */}
          <div className="relative z-10 mt-6 pt-4 border-t border-[#D9B68C]/50 flex items-center justify-between text-xs text-[#5B4A38]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#A84029]" />
              <span className="font-['Caveat',cursive] text-base font-bold text-[#2B2117]">
                Recetas de la abuela ♡
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-[#8A6D4B]">
              Comida de hogar · Bogotá 2026
            </span>
          </div>

        </div>
      </section>

      {/* ── BANNER DESTACADO: RECOMPENSA DEL 5% DE DESCUENTO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-2">
        <div className="rounded-2xl border-2 border-[#D9B68C] bg-[#EFE0C2] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#C88359] bg-[#FAF3E7] text-[#A84029] shadow-xs">
              <Percent className="h-6 w-6 text-[#F0822D]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84029] bg-[#FAF3E7] px-2 py-0.5 rounded-full border border-[#D9B68C]">
                  Beneficio de Fidelidad
                </span>
                {summary.isVecinoFiel && (
                  <span className="bg-[#62B869] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    🌟 5% Activo
                  </span>
                )}
              </div>
              <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#2B2117] leading-none mt-1">
                Gana un 5% de descuento en tu siguiente pedido
              </h3>
              <p className="text-xs text-[#5B4A38] mt-0.5">
                Al completar tus 3 entregas del mes con la misma cocinera, el sistema activa automáticamente un <strong>5% de descuento</strong> en tu próxima comida con ella.
              </p>
            </div>
          </div>

          <Link
            href="/menu"
            className="shrink-0 inline-flex items-center gap-2 bg-[#F0822D] hover:bg-[#D97224] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all"
          >
            <span>Pedir en el Menú</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── SECCIÓN INTERACTIVA: TU PASAPORTE DE RACHAS EN VIVO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b-2 border-[#D9B68C] pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84029]">
              SEGUIMIENTO EN VIVO · HU-21
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl font-bold text-[#2B2117]">
              Tus Rachas con Cocineras del Barrio
            </h2>
            <p className="text-xs text-[#5B4A38] mt-0.5">
              Acumula 3 entregas con la misma cocinera para ganar el sello y tu 5% de descuento.
            </p>
          </div>

          <div className="bg-[#EFE0C2] border border-[#D9B68C] px-4 py-2 rounded-xl text-xs font-bold text-[#2B2117] flex items-center gap-2">
            <span>Entregas completadas este mes:</span>
            <span className="bg-[#F0822D] text-white px-2.5 py-0.5 rounded-full text-xs font-mono">
              {summary.totalCompletedThisMonth} pedidos
            </span>
          </div>
        </div>

        {/* Tarjetas de cocineras estilo Libretón */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.allCookStreaks.slice(0, 6).map((streak) => {
            const current = Math.min(3, streak.currentMonthOrders);
            const percent = (current / 3) * 100;

            return (
              <div
                key={streak.cookId}
                className={`relative rounded-2xl p-5 border-2 transition-all shadow-sm flex flex-col justify-between ${
                  streak.isUnlocked
                    ? "bg-[#FAF3E7] border-[#62B869] shadow-[0_8px_20px_rgba(98,184,105,0.18)]"
                    : "bg-[#EFE0C2] border-[#D9B68C] hover:border-[#B59165]"
                }`}
              >
                {/* Badge flotante si ya está desbloqueado */}
                {streak.isUnlocked && (
                  <div className="absolute -top-3 right-4 bg-[#62B869] text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-white/60">
                    <Award className="w-3.5 h-3.5" /> ¡Sello Otorgado!
                  </div>
                )}

                <div>
                  {/* Encabezado con foto de la cocinera */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D9B68C] bg-[#FAF3E7] shrink-0">
                      <Image
                        src={streak.cookAvatar || "/images/dona_rosa_mascot.jpg"}
                        alt={streak.cookName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#2B2117] leading-none">
                        {streak.cookName}
                      </h3>
                      <span className="text-[11px] text-[#5B4A38] block mt-1">
                        {streak.cookResidentialComplex || "Cocina local"}
                      </span>
                    </div>
                  </div>

                  {/* Tarjeta de progreso */}
                  <div className="bg-[#FAF3E7] border border-[#D9B68C] p-3.5 rounded-xl mb-4">
                    <div className="flex items-center justify-between text-xs font-bold mb-2 text-[#2B2117]">
                      <span>Racha mensual:</span>
                      <span className={streak.isUnlocked ? "text-[#52663D]" : "text-[#A84029]"}>
                        {streak.currentMonthOrders} / 3 entregas
                      </span>
                    </div>

                    {/* Barra de progreso visual */}
                    <div className="w-full h-2.5 bg-[#E6D4B8] rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-[#F0822D] to-[#62B869] transition-all duration-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Pasos 1, 2, 3 */}
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {[1, 2, 3].map((step) => {
                        const done = streak.currentMonthOrders >= step;
                        return (
                          <div
                            key={step}
                            className={`py-1 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 ${
                              done
                                ? "bg-[#DCE4CE] text-[#42542E] border border-[#75865A]"
                                : "bg-[#EFE0C2] text-[#8A6D4B] border border-[#D9B68C]"
                            }`}
                          >
                            {done ? <CheckCircle2 className="w-3 h-3 text-[#52663D]" /> : <span>{step}º</span>}
                            <span>{step === 3 ? "Sello" : "Pedido"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estado y beneficio del 5% */}
                  {streak.isUnlocked ? (
                    <div className="mb-4 rounded-xl border border-[#75865A] bg-[#DCE4CE] p-3 text-xs text-[#42542E] space-y-1.5 shadow-xs">
                      <p className="font-bold flex items-center gap-1.5 text-sm text-[#2B2117]">
                        <Sparkles className="w-4 h-4 text-[#A84029] fill-[#F4C430]" />
                        ¡5% de Descuento Activo!
                      </p>
                      <p className="text-[11px] leading-relaxed text-[#52663D]">
                        Se descontará automáticamente en tu siguiente pedido de comida con {streak.cookName}.
                      </p>
                      <Link
                        href="/menu"
                        className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#52663D] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#43552E] transition-all shadow-xs"
                      >
                        <span>Pedir con 5% dto.</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5B4A38] leading-relaxed mb-4">
                      {streak.streakStatus === "REINICIADA"
                        ? "Racha reiniciada por cambio de período mensual sin actividad reciente."
                        : `Te faltan ${Math.max(0, 3 - streak.currentMonthOrders)} entregas este mes para recibir la insignia y tu 5% de descuento en el siguiente pedido.`}
                    </p>
                  )}
                </div>

                {/* Botones de simulación para evaluar HU-21 */}
                <div className="pt-3 border-t border-[#D9B68C] space-y-2">
                  <button
                    onClick={() => handleSimulateDelivery(streak.cookId, streak.cookName)}
                    className="w-full bg-[#FAF3E7] hover:bg-white text-[#2B2117] border border-[#D9B68C] py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#62B869]" />
                    <span>Simular 1 entrega completada</span>
                  </button>

                  <button
                    onClick={() => handleSimulateMonthReset(streak.cookId, streak.cookName)}
                    className="w-full text-[#8A6D4B] hover:text-[#A84029] py-1 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Simular reinicio (mes vencido)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECCIÓN TIPO SCRAPBOOK: LAS 4 REGLAS DEL VECINO FIEL ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-14">
        <div className="relative bg-[#E8D1A3] border-2 border-[#9B774F] p-6 sm:p-10 rounded-2xl shadow-[0_10px_25px_rgba(43,33,23,0.1)]">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-dashed border-[#AE9066] pb-3 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A84029]">
                CONVIVENCIA Y COMUNIDAD
              </span>
              <h3 className="font-['Caveat',cursive] text-3xl font-bold text-[#2B2117]">
                Las 4 Reglas Clave de Vecino Fiel
              </h3>
            </div>
            <span className="text-xs font-bold text-[#5B4A38] bg-[#FAF3E7] px-3 py-1 rounded-full border border-[#D9B68C]">
              Criterios HU-21
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#4A3222] leading-relaxed">
            <div className="bg-[#FAF3E7] p-4 rounded-xl border border-[#D9B68C]">
              <strong className="block font-['Caveat',cursive] text-xl font-bold text-[#A84029] mb-1">
                1. Mismo mes calendario
              </strong>
              Las 3 entregas deben ocurrir durante el mismo mes calendario con la misma cocinera.
            </div>

            <div className="bg-[#FAF3E7] p-4 rounded-xl border border-[#D9B68C]">
              <strong className="block font-['Caveat',cursive] text-xl font-bold text-[#A84029] mb-1">
                2. Descuento del 5% en tu siguiente pedido
              </strong>
              Al completar la 3ra entrega y ganar la insignia, tu siguiente pedido de comida con esa cocinera recibe automáticamente un 5% de descuento.
            </div>

            <div className="bg-[#FAF3E7] p-4 rounded-xl border border-[#D9B68C]">
              <strong className="block font-['Caveat',cursive] text-xl font-bold text-[#A84029] mb-1">
                3. Reinicio mensual por inactividad
              </strong>
              Si transcurre un mes calendario sin pedidos a esa cocinera, el contador de racha se reinicia al mes siguiente.
            </div>

            <div className="bg-[#FAF3E7] p-4 rounded-xl border border-[#D9B68C]">
              <strong className="block font-['Caveat',cursive] text-xl font-bold text-[#A84029] mb-1">
                4. Racha independiente
              </strong>
              Puedes acumular rachas y ser Vecino Fiel con varias cocineras de tu barrio a la vez.
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-[#AE9066] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-['Caveat',cursive] text-2xl font-bold text-[#A84029]">
              OllaCercana · El sabor de tu barrio, a un clic
            </span>
            <Link
              href="/menu"
              className="font-bold text-[#2B2117] hover:text-[#A84029] underline underline-offset-4"
            >
              Ir al Menú y hacer un pedido hoy →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
