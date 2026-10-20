"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  MapPin,
  Utensils,
  ChefHat,
  X,
  Flame,
  RotateCcw,
  ArrowRight,
  Soup,
  HelpCircle,
  ShoppingBag,
  UsersRound,
  Building2,
  Award,
  Star,
  LogIn,
  UserPlus,
} from "lucide-react";

// Paleta OllaCercana
const ORANGE = "#F0822D";
const MONO = "font-['Courier_New',monospace]";
const HAND = "font-['Caveat',cursive]";
const SERIF = "font-['Playfair_Display',serif]";

function PhotoStamp({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl border-2 border-[#D9B68C] bg-[#FAF3E7] shadow-[2px_3px_0_rgba(43,33,23,.16)] ${className}`}>
      <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
    </div>
  );
}

export interface SpatialDish {
  id: string;
  name: string;
  category: "Sopas" | "Almuerzos" | "Vegetariano" | "Postres";
  cook: string;
  cookId: string;
  cookAvatar: string;
  cookRole: string;
  image: string;
  price: string;
  rawPrice: number;
  rating: string;
  reviewsCount: number;
  distance: string;
  walkMinutes: number;
  residentialComplex: string;
  portionsLeft: number;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  grandmaNote: string;
  cookingTime: string;
  dietaryTags: string[];
}

export const FEATURED_TEASER_DISH: SpatialDish = {
  id: "dish-ajiaco-teaser",
  name: "Ajiaco Santafereño de la Casa",
  category: "Sopas",
  cook: "Kevin & Cocineros del Fogón",
  cookId: "cocinero-comunitario",
  cookAvatar: "/images/comunidad/vecino_1.jpg",
  cookRole: "Cocina Comunitaria · Barrio San Luis",
  image: "/images/menu_ajiaco.jpg",
  price: "$18.000",
  rawPrice: 18000,
  rating: "4.9",
  reviewsCount: 128,
  distance: "A 350 m",
  walkMinutes: 4,
  residentialComplex: "Conjunto San Luis",
  portionsLeft: 4,
  badge: "Muestra del Día",
  shortDesc: "Tres papas andinas, pechuga desmechada tierna, mazorca dulce y crema fresca.",
  fullDesc:
    "Receta tradicional santafereña preparada a fuego lento durante tres horas en olla gruesa. Una muestra representativa de los platos caseros que se comparten entre vecinos en OllaCercana. Para descubrir más ollas y porciones calientes, explora El Libretón.",
  grandmaNote: "El truco está en que la papa criolla se deshaga solita para espesar el caldo, sin agregar harinas jamás.",
  cookingTime: "Fuego lento 3h 15m",
  dietaryTags: ["Sin Gluten", "100% Casero", "Porción Limitada"],
};

export interface CarouselScreen {
  id: string;
  type: "map" | "dish" | "mascot" | "cook" | "buyer";
  tabLabel: string;
  badge: string;
  categoryTag: string;
  title: string;
  subtitle: string;
  image: string;
  overlayMetric: string;
  overlaySub: string;
  description: string;
  highlightLabel: string;
  highlightValue: string;
  highlightPill: string;
  actionLabel: string;
  actionHref?: string;
}

export const CAROUSEL_SCREENS: CarouselScreen[] = [
  {
    id: "screen-map",
    type: "map",
    tabLabel: "Ruta del Barrio",
    badge: "Vecinos en Ruta",
    categoryTag: "GEOLOCALIZACIÓN VECINAL · A PASO LENTO",
    title: "Vecinos Explorando el Barrio",
    subtitle: "Ollas caseras a 500m – 2km de tu portería",
    image: "/images/comunidad/ruta-del-barrio.png",
    overlayMetric: "500m – 2km",
    overlaySub: "10 ollas activas hoy",
    description:
      "Descubre qué vecinos están preparando almuerzo casero a pocas cuadras. Consulta minutos a pie y recoge en portería con total confianza.",
    highlightLabel: "ENCUENTRO EN PORTERÍA",
    highlightValue: "A 4 – 12 min a pie",
    highlightPill: "Sin Domiciliarios",
    actionLabel: "Explorar Mapa de Cocineras",
    actionHref: "/cocineras-cercanas",
  },
  {
    id: "screen-dish",
    type: "dish",
    tabLabel: "Plato del Día",
    badge: "Sazón de la Casa",
    categoryTag: "FOGÓN TRADICIONAL · RECETA DEL DÍA",
    title: "Ajiaco Santafereño de la Casa",
    subtitle: "Doña Rosa & Vecinos · Conjunto San Luis",
    image: "/images/menu_ajiaco.jpg",
    overlayMetric: "$18.000",
    overlaySub: "Solo 4 porciones hoy",
    description:
      "Una muestra de la comida casera hecha a fuego lento por las manos de nuestras familias vecinas. Para descubrir todas las ollas del día, abre El Libretón.",
    highlightLabel: "COMIDA DE VERDAD",
    highlightValue: "A 350 m · 4 min a pie",
    highlightPill: "Recién Servido",
    actionLabel: "Apartar esta porción",
  },
  {
    id: "screen-mascot",
    type: "mascot",
    tabLabel: "Nuestro Equipo",
    badge: "Creadores del Proyecto",
    categoryTag: "QUIÉNES SOMOS · EQUIPO COMUNITARIO",
    title: "Nuestro Equipo y Comunidad",
    subtitle: "Presentamos a quienes creamos OllaCercana",
    image: "/images/comunidad/kevin-equipo.jpg",
    overlayMetric: "100% Real",
    overlaySub: "Vecinos del barrio",
    description:
      "¡Hola! Somos los creadores de OllaCercana. Diseñamos este espacio para unir a los vecinos a través de la comida casera de verdad, apoyando a familias locales y fortaleciendo los lazos del conjunto.",
    highlightLabel: "EQUIPO COMPROMETIDO",
    highlightValue: "5 Vecinos Fundadores",
    highlightPill: "0% Comisiones",
    actionLabel: "Conocer la Comunidad",
    actionHref: "/menu",
  },
  {
    id: "screen-cook",
    type: "cook",
    tabLabel: "Modo Cocinero",
    badge: "Sello Olla Verde",
    categoryTag: "ECONOMÍA FAMILIAR · MODO COCINERO",
    title: "Tu Cocina, Tus Porciones",
    subtitle: "Kevin y vecinos cocinando en el barrio",
    image: "/images/comunidad/vecino_1.jpg",
    overlayMetric: "0% Comisión",
    overlaySub: "4.9 Reputación Vecinal",
    description:
      "¿Cocinaste de más en casa? Sube tus platos en 1 minuto. Los platos expiran a las 4 horas para asegurar frescura total sin presiones ni cobros de plataforma.",
    highlightLabel: "APOYO AL HOGAR",
    highlightValue: "Todo el pago va directo a ti",
    highlightPill: "Ingreso Vecinal",
    actionLabel: "Conocer Modo Cocinero",
    actionHref: "/cuenta/cocina",
  },
  {
    id: "screen-buyer",
    type: "buyer",
    tabLabel: "Vecino Fiel",
    badge: "Comunidad Vecinal",
    categoryTag: "PASAPORTE VECINAL · PEDIDOS & FIDELIDAD",
    title: "Vecinos Comensales & Fidelidad",
    subtitle: "Aparta porciones y coordina en portería",
    image: "/images/comunidad/vecino_5.jpg",
    overlayMetric: "Vecino Fiel",
    overlaySub: "5% de descuento por racha",
    description:
      "Aparta tu plato con 1 toque sin tarjetas bancarias. Chatea directamente con quien cocina, acuerda la entrega en portería y acumula sellos de fidelidad.",
    highlightLabel: "TRATO DIRECTO",
    highlightValue: "Pagas directo al recibir",
    highlightPill: "Chat Interno",
    actionLabel: "Ver Mis Reservas",
    actionHref: "/cuenta/reservas",
  },
];

export default function SpatialCoverflowHero() {
  const router = useRouter();
  // Inicia en índice 2 (La Abuelita, centro) con pantallas/tarjetas a ambos lados según diseño interactivo
  const [activeIndex, setActiveIndex] = useState(2);
  const [expandedDish, setExpandedDish] = useState<SpatialDish | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ "dish-ajiaco-teaser": true });
  const [isAudioSimmering, setIsAudioSimmering] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cardTilt, setCardTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Modal para Apartar Porción (redirige a iniciar sesión o registro)
  const [authPromptDish, setAuthPromptDish] = useState<SpatialDish | null>(null);

  // Selector de rol interactivo
  const [activeRole, setActiveRole] = useState<"comprador" | "cocinera">("comprador");
  const [showHomeGuideIntro, setShowHomeGuideIntro] = useState(false);

  // Modal / Drawer de Preguntas Frecuentes
  const [helpDrawerOpen, setHelpDrawerOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleShowHomeGuide = () => {
      if (window.localStorage.getItem("ollacercana-home-guide-seen") !== "true") {
        setShowHomeGuideIntro(true);
      }
    };

    window.addEventListener("ollacercana:show-home-guide", handleShowHomeGuide);
    return () => window.removeEventListener("ollacercana:show-home-guide", handleShowHomeGuide);
  }, []);

  const currentScreen = CAROUSEL_SCREENS[activeIndex] || CAROUSEL_SCREENS[2];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      showToast(next ? "¡Guardado en tus favoritos!" : "Retirado de tus favoritos.");
      return { ...prev, [id]: next };
    });
  };

  // Cuando se pulsa Apartar Porción: abre el modal de registro/login
  const handleOpenAuthPrompt = (dish: SpatialDish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAuthPromptDish(dish);
  };

  // Desplazamiento suave al frame de la abuelita cocinando (al ~92% del scroll de la cocina)
  const handleScrollToAbuelitaKitchen = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = document.getElementById("kitchen-scroll");
    if (!container) return;
    const scrollableHeight = container.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: container.offsetTop + scrollableHeight * 0.92,
      behavior: "smooth",
    });
  };

  // Sonido ambiente sintetizado
  const toggleSimmerAudio = () => {
    if (isAudioSimmering) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioSimmering(false);
      showToast("Sonido de cocina silenciado");
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.06, ctx.currentTime);
      masterGain.connect(ctx.destination);

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(360, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      setIsAudioSimmering(true);
      showToast("Sonido ambiente activado: hervor y vapor en la cocina");
    } catch {
      showToast("Audio no disponible en este navegador");
    }
  };

  // Inclinación con mouse
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: x * 8, y: -y * 8 });
  };
  const handleCardMouseLeave = () => setCardTilt({ x: 0, y: 0 });

  // Deslizamiento táctil / ratón
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 55) {
      if (diff > 0 && activeIndex > 0) setActiveIndex((p) => p - 1);
      else if (diff < 0 && activeIndex < CAROUSEL_SCREENS.length - 1) setActiveIndex((p) => p + 1);
      setIsDragging(false);
    }
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e: React.TouchEvent) => setDragStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0 && activeIndex > 0) setActiveIndex((p) => p - 1);
      else if (diff < 0 && activeIndex < CAROUSEL_SCREENS.length - 1) setActiveIndex((p) => p + 1);
    }
  };

  // Preguntas Frecuentes
  const FAQS = [
    {
      q: "¿Cómo y cuándo se paga la comida?",
      a: "El trato es 100% directo entre vecinos. Pagas al momento de recibir tu porción en portería: en efectivo, Nequi o Daviplata. OllaCercana no retiene tu dinero ni cobra comisiones ocultas.",
    },
    {
      q: "¿Dónde se realiza la entrega?",
      a: "Acuerdas la entrega por el chat privado de la reserva (normalmente en la portería de tu conjunto o un punto cercano conocido). Por seguridad, nunca se publican números de apartamento ni direcciones privadas.",
    },
    {
      q: "¿Qué pasa si una porción no se confirma en 10 minutos?",
      a: "Si la cocinera no confirma en ~10 minutos, la reserva se libera sola automáticamente para que no te quedes esperando y puedas elegir otro plato caliente.",
    },
    {
      q: "¿Puedo vender comida si cocino en casa y no soy restaurante?",
      a: "¡Sí! OllaCercana nació para familias y vecinos que cocinan rico y les sobran porciones. Publicas en 1 minuto y generas un ingreso justo sin montar un negocio formal.",
    },
    {
      q: "¿Cómo garantizan la frescura de la comida?",
      a: "Cada publicación expira sola a las 4 horas de haber sido creada. Así garantizamos que todo lo que ves en la plataforma fue cocinado el mismo día.",
    },
  ];

  return (
    <div className="relative w-full font-sans select-none overflow-hidden pb-12">
      {/* ========================================================================= */}
      {/* 0. PUENTE DE TRANSICIÓN: CONEXIÓN SUAVE CON EL FOGÓN DE LA ABUELITA       */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex items-center justify-center pt-2 mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F4C430]/30 bg-[#2B2117]/85 px-4 py-1.5 text-xs font-bold text-[#F4C430] shadow-xl backdrop-blur-xl">
          <span className="flex h-2 w-2 rounded-full bg-[#62B869] animate-pulse" />
          <span>El fogón de la abuelita está servido · Conoce las ollas del barrio</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#F0822D]" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISIONOS TOP CAPSULE (Barra Flotante de Estado)                        */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE LA COMUNIDAD (Estilo Artesanal y Acogedor)           */}
      {/* ========================================================================= */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border-2 border-[#D9B68C] bg-[#FAF3E7]/95 px-4 py-2.5 shadow-xl backdrop-blur-md text-[#2B2117]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#E66A1F] to-[#C84B31] text-white shadow-sm">
              <Utensils className="h-3.5 w-3.5" />
            </span>
            <span className="font-['Playfair_Display',serif] text-sm font-black tracking-tight text-[#2B2117]">OllaCercana</span>
            <span className="text-[#D9B68C]">•</span>
            <span className={`${HAND} text-xl font-bold text-[#A84029] leading-none`}>El Fogón de la Comunidad</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#D9B68C] bg-[#F5EBD7] px-3.5 py-1 text-xs text-[#2B2117] font-semibold shadow-xs">
            <MapPin className="h-3.5 w-3.5 text-[#E66A1F]" />
            <span>Radio 500m – 2km</span>
            <span className="flex h-2 w-2 rounded-full bg-[#3E5326] animate-pulse" />
            <span className="text-[11px] text-[#3E5326] font-bold">10 ollas activas hoy</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Simmer Toggle */}
            <button
              type="button"
              onClick={toggleSimmerAudio}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                isAudioSimmering
                  ? "border-[#3E5326] bg-[#DCE4CE] text-[#3E5326] shadow-xs"
                  : "border-[#D9B68C] bg-[#FAF3E7] text-[#5B4A38] hover:border-[#E66A1F] hover:text-[#A84029]"
              }`}
              title="Sonido de cocina"
            >
              {isAudioSimmering ? <Volume2 className="h-3.5 w-3.5 animate-pulse text-[#3E5326]" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isAudioSimmering ? "Hervor activo" : "Sonido cocina"}</span>
            </button>

            {/* Ayuda Rápida */}
            <button
              type="button"
              onClick={() => setHelpDrawerOpen(true)}
              className="flex items-center gap-1 rounded-full border border-[#D9B68C] bg-[#FAF3E7] px-3 py-1 text-xs font-bold text-[#5B4A38] hover:border-[#E66A1F] hover:text-[#A84029] transition-colors cursor-pointer shadow-xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#E66A1F]" />
              <span>Ayuda</span>
            </button>

            {/* Compartir */}
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("¡Enlace copiado para compartir con tus vecinos!");
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9B68C] bg-[#FAF3E7] text-[#5B4A38] hover:text-[#E66A1F] hover:border-[#E66A1F] transition-colors shadow-xs"
              title="Compartir"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRESENTACIÓN DE LA COMUNIDAD (Quiénes Somos & Filosofía de Barrio)      */}
      {/* ========================================================================= */}
      <div className="relative z-20 text-center px-4 mb-3 pt-1">
        <p className={`${HAND} text-xl sm:text-2xl font-bold tracking-wide text-[#F4C430] mb-0.5`}>
          Quiénes somos y cómo alimentamos el barrio
        </p>
        <h2 className={`${SERIF} text-3xl sm:text-4xl lg:text-5xl text-[#FAF3E7] font-bold tracking-tight leading-tight`}>
          Lo cercano{" "}
          <span className="italic" style={{ color: ORANGE }}>
            también alimenta.
          </span>
        </h2>
        <p className="max-w-xl mx-auto mt-2 text-xs sm:text-sm text-[#E2CEB1] font-medium leading-relaxed">
          Conectamos a las vecinas que cocinan con amor de hogar con quienes buscan comida de verdad, calientita y sin sobrecostos de entrega.
        </p>

        {/* Selector de Pantallas del Carrusel (Estilo Pestañas de Cuaderno Artesanal) */}
        <div className="mt-4 mb-0 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-full border-2 border-[#D9B68C]/60 bg-[#2B2117]/85 p-1.5 shadow-xl max-w-fit mx-auto relative z-40 pointer-events-auto backdrop-blur-md">
          {CAROUSEL_SCREENS.map((screen, idx) => {
            const TabIcon = screen.type === "map"
              ? MapPin
              : screen.type === "dish"
                ? Soup
                : screen.type === "mascot"
                  ? UsersRound
                  : screen.type === "cook"
                    ? ChefHat
                    : ShoppingBag;

            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeIndex === idx
                    ? "bg-gradient-to-r from-[#E66A1F] to-[#D85718] text-white shadow-md scale-105"
                    : "text-[#E2CEB1] hover:text-white hover:bg-white/10"
                }`}
              >
                <TabIcon className="h-4 w-4" aria-hidden="true" />
                <span>{screen.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 3. ESCENARIO CENTRAL: VISOR 3D COVERFLOW (Equidistante entre filtros y dock) */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 mt-8 sm:mt-10">
        <div className="w-full flex flex-col items-center">
          <div className="relative min-h-[480px] sm:min-h-[500px] w-full flex items-center justify-center">
            <div
              className="relative w-full max-w-4xl h-[470px] sm:h-[490px] flex items-center justify-center cursor-grab active:cursor-grabbing"
              style={{ perspective: 1200, transformStyle: "preserve-3d" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {CAROUSEL_SCREENS.map((screen, index) => {
                const diff = index - activeIndex;
                const isCenter = diff === 0;

                const translateX = diff * 68;
                const translateZ = -Math.abs(diff) * 135;
                const rotateY = diff * -20;
                const scale = Math.max(0.72, 1 - Math.abs(diff) * 0.14);
                const opacity = Math.abs(diff) > 2 ? 0 : Math.max(0.35, 1 - Math.abs(diff) * 0.35);
                const zIndex = 25 - Math.abs(diff) * 8;
                const pointerEvents = Math.abs(diff) > 1 ? "none" : "auto";

                const tiltTransform = isCenter ? `rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)` : "";

                return (
                  <div
                    key={screen.id}
                    onClick={() => {
                      if (!isCenter) setActiveIndex(index);
                    }}
                    className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out will-change-transform"
                    style={{
                      width: "min(88vw, 360px)",
                      transform: `translate(-50%, -50%) translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale}) ${tiltTransform}`,
                      opacity,
                      zIndex,
                      pointerEvents,
                    }}
                    onMouseMove={isCenter ? handleCardMouseMove : undefined}
                    onMouseLeave={isCenter ? handleCardMouseLeave : undefined}
                  >
                    {/* Tarjeta Artesanal / Scrapbook Recetario (Estilo OllaCercana, No IA) */}
                    <div
                      className={`group relative overflow-hidden rounded-3xl transition-all duration-300 ${
                        isCenter
                          ? "border-2 border-[#C88359] bg-[#FFFBF3] shadow-[0_24px_50px_rgba(43,33,23,0.38)] ring-2 ring-[#E66A1F]/40 scale-[1.02]"
                          : "border border-[#D9B68C] bg-[#FAF3E7]/95 shadow-md backdrop-blur-xs"
                      } p-3.5 sm:p-4 text-[#2B2117]`}
                    >
                      {/* Cinta washi tape decorativa en la parte superior para toque artesanal */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-3.5 bg-[#D8BD82]/85 border-x border-[#C4A974] rotate-[-0.6deg] z-20 pointer-events-none shadow-2xs" />

                      {/* Visual Superior de la Pantalla (Marco Polaroid Artesanal) */}
                      <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl bg-[#F0E4D0] border border-[#D9B68C] shadow-inner">
                        <Image
                          src={screen.image}
                          alt={screen.title}
                          fill
                          sizes="360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority={isCenter}
                        />
                        {/* Velo cálido artesanal */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B11]/75 via-transparent to-black/20 pointer-events-none" />

                        {/* Badges y Botones superiores sobre la imagen */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                          <span className="rounded-full bg-[#FAF3E7]/95 border border-[#D9B68C] px-3 py-1 text-[10px] font-bold text-[#A84029] shadow-xs backdrop-blur-xs flex items-center gap-1">
                            <span>{screen.badge}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            {screen.type === "dish" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedDish(FEATURED_TEASER_DISH);
                                  }}
                                  className="flex items-center gap-1 rounded-full border border-[#D9B68C] bg-[#FAF3E7]/95 px-2.5 py-1 text-[11px] font-bold text-[#5B4A38] shadow-xs backdrop-blur-xs hover:text-[#A84029] cursor-pointer"
                                  title="Ver detalle"
                                >
                                  <Maximize2 className="h-3.5 w-3.5" />
                                  <span>Ver</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleFavorite("dish-ajiaco-teaser", e)}
                                  className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#D9B68C] backdrop-blur-xs cursor-pointer shadow-xs ${
                                    favorites["dish-ajiaco-teaser"] ? "bg-[#C84B31] text-white" : "bg-[#FAF3E7]/95 text-[#5B4A38]"
                                  }`}
                                >
                                  <Heart className={`h-3.5 w-3.5 ${favorites["dish-ajiaco-teaser"] ? "fill-white" : ""}`} />
                                </button>
                              </>
                            ) : screen.type === "cook" ? (
                              <span className="rounded-full bg-[#DCE4CE] border border-[#75865A] px-2.5 py-0.5 text-[10px] font-bold text-[#42542E] shadow-2xs">
                                Sello Olla Verde
                              </span>
                            ) : screen.type === "buyer" ? (
                              <span className="rounded-full bg-[#F7E7D2] border border-[#E8CDAE] px-2.5 py-0.5 text-[10px] font-bold text-[#A84029] shadow-2xs">
                                Pasaporte
                              </span>
                            ) : screen.type === "map" ? (
                              <span className="rounded-full bg-[#DCE4CE] border border-[#75865A] px-2.5 py-0.5 text-[10px] font-bold text-[#42542E] shadow-2xs flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#62B869]" />
                                En vivo
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#F7E7D2] border border-[#E8CDAE] px-2.5 py-0.5 text-[10px] font-bold text-[#A84029] shadow-2xs">
                                Oficial
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Métricas destacadas sobre la foto */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
                          <span className="text-2xl sm:text-3xl font-black text-[#FFF8E7] drop-shadow-[0_2px_8px_rgba(43,33,23,0.95)] font-['Playfair_Display',serif]">
                            {screen.overlayMetric}
                          </span>
                          <span className="rounded-full bg-[#FAF3E7]/95 border border-[#D9B68C] px-3 py-1 text-[10px] font-bold text-[#3E5326] shadow-sm uppercase tracking-wider">
                            {screen.overlaySub}
                          </span>
                        </div>
                      </div>

                      {/* Datos de la Pantalla */}
                      <div className="mt-3 text-left">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-[#A84029] uppercase tracking-wider">{screen.categoryTag}</span>
                          <span className="text-[#8A6D4B] font-bold">{index + 1} / {CAROUSEL_SCREENS.length}</span>
                        </div>

                        <h3 className={`${SERIF} text-lg sm:text-xl font-bold text-[#2B2117] line-clamp-1 mt-1`}>
                          {screen.title}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#5B4A38] line-clamp-1 mt-0.5">
                          {screen.subtitle}
                        </p>

                        {/* Cápsula de Proximidad / Característica Destacada (Estilo Libreta de Barrio) */}
                        <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl border border-[#D9B68C] bg-[#F4E8D3]/85 px-3 py-2.5 shadow-2xs">
                          <div className="flex items-center gap-2.5">
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#E8D1A3] border border-[#D9B68C] text-[#A84029] shrink-0">
                              {screen.type === "map" || screen.type === "dish" ? (
                                <MapPin className="h-4 w-4 fill-[#A84029] text-white shrink-0" />
                              ) : screen.type === "cook" ? (
                                <ChefHat className="h-4 w-4 text-[#3E5326]" />
                              ) : screen.type === "buyer" ? (
                                <ShoppingBag className="h-4 w-4 text-[#A84029]" />
                              ) : (
                                <Sparkles className="h-4 w-4 text-[#F0822D]" />
                              )}
                            </div>

                            <div className="flex flex-col text-left leading-none">
                              <span className="text-[9px] font-mono font-bold text-[#8A6D4B] uppercase tracking-wider">
                                {screen.highlightLabel}
                              </span>
                              <span className="text-sm sm:text-base font-black text-[#2B2117] tracking-tight mt-0.5">
                                {screen.highlightValue}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 rounded-full bg-[#FAF3E7] border border-[#D9B68C] px-2.5 py-1 text-xs font-bold text-[#3E5326] shadow-2xs shrink-0">
                            <Clock className="h-3.5 w-3.5 text-[#A84029]" />
                            <span>{screen.highlightPill}</span>
                          </div>
                        </div>

                        {/* Muestra de Nuestro Equipo Completo en la tarjeta central */}
                        {screen.id === "screen-mascot" && (
                          <div className="mt-2.5 pt-2 border-t border-dashed border-[#D9B68C] flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-[#8A6D4B] uppercase tracking-wider">
                              El Equipo Creador:
                            </span>
                            <div className="flex items-center -space-x-1.5">
                              {[
                                { src: "/images/comunidad/kevin-equipo.jpg", name: "Kevin" },
                                { src: "/images/comunidad/vecino_2.png", name: "Compañero" },
                                { src: "/images/comunidad/vecino_3.jpg", name: "Compañero" },
                                { src: "/images/comunidad/vecino_4.png", name: "Don Fernando" },
                                { src: "/images/comunidad/vecino_5.png", name: "Compañero" },
                              ].map((member, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="h-7 w-7 rounded-full border-2 border-[#FAF3E7] overflow-hidden shadow-xs hover:scale-125 transition-transform cursor-pointer shrink-0"
                                  title={member.name}
                                >
                                  <Image src={member.src} alt={member.name} width={28} height={28} className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Botón de Acción Principal (Naranja Cálido Artesanal) */}
                        {screen.type === "dish" ? (
                          <button
                            type="button"
                            onClick={(e) => handleOpenAuthPrompt(FEATURED_TEASER_DISH, e)}
                            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-[#E66A1F] to-[#D85718] hover:from-[#d55e16] hover:to-[#c44c12] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Utensils className="h-4 w-4" />
                            <span>{screen.actionLabel}</span>
                          </button>
                        ) : (
                          <Link
                            href={screen.actionHref || "/"}
                            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-[#E66A1F] to-[#D85718] hover:from-[#d55e16] hover:to-[#c44c12] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {screen.type === "map" && <MapPin className="h-4 w-4" />}
                            {screen.type === "mascot" && <Sparkles className="h-4 w-4" />}
                            {screen.type === "cook" && <ChefHat className="h-4 w-4" />}
                            {screen.type === "buyer" && <ShoppingBag className="h-4 w-4" />}
                            <span>{screen.actionLabel}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dock Flotante (Estilo Cuaderno de Barrio) */}
          <div className="flex flex-col items-center gap-2 mt-8 sm:mt-10 relative z-30">
            <div className="flex items-center gap-2.5 rounded-full border-2 border-[#D9B68C] bg-[#FAF3E7]/95 px-3.5 py-1.5 shadow-xl backdrop-blur-md text-[#2B2117]">
              <button
                type="button"
                onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
                disabled={activeIndex === 0}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFE0C2] text-[#2B2117] hover:bg-[#E8D1A3] disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div
                onClick={() => {
                  if (currentScreen.type === "dish") {
                    setExpandedDish(FEATURED_TEASER_DISH);
                  } else if (currentScreen.actionHref) {
                    router.push(currentScreen.actionHref);
                  }
                }}
                className="flex items-center gap-2 px-1 cursor-pointer"
              >
                <div className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-[#E66A1F]">
                  <Image src={currentScreen.image} alt={currentScreen.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col text-left leading-none max-w-[140px] sm:max-w-[200px]">
                  <span className="text-xs font-bold text-[#2B2117] truncate">{currentScreen.title}</span>
                  <span className="text-[10px] text-[#6B5542] truncate font-medium">{currentScreen.subtitle}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  if (currentScreen.type === "dish") {
                    handleToggleFavorite("dish-ajiaco-teaser", e);
                  } else {
                    showToast("¡Sección explorada con éxito!");
                  }
                }}
                className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#D9B68C] ${
                  currentScreen.type === "dish" && favorites["dish-ajiaco-teaser"]
                    ? "bg-[#C84B31] text-white"
                    : "bg-[#EFE0C2] text-[#5B4A38] hover:text-[#C84B31]"
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    currentScreen.type === "dish" && favorites["dish-ajiaco-teaser"] ? "fill-white" : ""
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setActiveIndex((p) => Math.min(CAROUSEL_SCREENS.length - 1, p + 1))}
                disabled={activeIndex === CAROUSEL_SCREENS.length - 1}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EFE0C2] text-[#2B2117] hover:bg-[#E8D1A3] disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Paginación */}
            <div className="flex items-center gap-1.5">
              {CAROUSEL_SCREENS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === activeIndex ? "w-6 bg-[#E66A1F]" : "w-2 bg-[#D9B68C]/60 hover:bg-[#D9B68C]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PILARES DE OLLACERCANA: INSIGNIAS, RESEÑAS, ECONOMÍA Y CONFIANZA       */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7 sm:mt-8 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left font-['Patrick_Hand',cursive]">
          
          {/* Card 1: Valor Diferenciador - Sello Olla Verde */}
          <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 sm:p-7 shadow-[0_16px_36px_rgba(43,33,23,0.18)] text-[#2B2117] flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-[#E66A1F] hover:-translate-y-1 group">
            <div>
              <div className="flex items-center gap-2.5 border-b border-[#D9B68C] pb-3 mb-3.5">
                <PhotoStamp src="https://images.unsplash.com/photo-1715828202780-915fd3571413?auto=format&fit=crop&w=160&h=160&q=80" alt="Cocinera preparando un plato casero" className="h-16 w-16" />
                <span className="text-sm font-bold text-[#A84029] uppercase tracking-wide">
                  VALOR DIFERENCIADOR
                </span>
              </div>
              
              <div className="flex items-start gap-3.5 mt-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-[#62B869] bg-[#FAF3E7] p-1 shadow-sm group-hover:scale-105 transition-transform">
                  <Image src="/images/sello_olla_verde.png" alt="Sello Olla Verde" fill className="object-contain" />
                </div>
                <div className="leading-tight">
                  <span className="text-base sm:text-lg font-bold text-[#3E5326] flex items-center gap-1.5">
                    Sello Olla Verde · 7 PT
                  </span>
                  <span className="text-sm font-bold text-[#8A6D4B] block mt-0.5">
                    Insignia de Excelencia Vecinal
                  </span>
                  <p className="text-sm sm:text-base text-[#5B4A38] mt-2 leading-relaxed">
                    Premio a cocineras que venden el 100% de sus porciones 7 días seguidos. Cero desperdicio y garantía de comida fresca en el conjunto.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#D9B68C] flex items-center justify-between text-xs text-[#5B4A38]">
              <span className="flex items-center gap-1 font-bold text-[#2B2117]">
                <Star className="h-3.5 w-3.5 text-[#F4C430] fill-[#F4C430]" /> Cocineras con 4.8+
              </span>
              <span className="rounded-full bg-[#DCE4CE] border border-[#75865A] px-2.5 py-0.5 text-xs font-bold text-[#42542E]">
                Sazón Verificada
              </span>
            </div>
          </div>

          {/* Card 2: Reseña Real de Vecino */}
          <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 sm:p-7 shadow-[0_16px_36px_rgba(43,33,23,0.18)] text-[#2B2117] flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-[#E66A1F] hover:-translate-y-1 group">
            <div>
              <div className="flex items-center gap-2.5 border-b border-[#D9B68C] pb-3 mb-3.5">
                <PhotoStamp src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=160&h=160&q=80" alt="Vecinos compartiendo una comida" className="h-16 w-16" />
                <span className="text-sm font-bold text-[#3E5326] uppercase tracking-wide">
                  RESEÑAS DEL BARRIO
                </span>
              </div>
              <p className="text-base sm:text-lg text-[#2B2117] italic leading-relaxed mt-2">
                &ldquo;El ajiaco tradicional sabe idéntico al de mi abuela. Llegó humeante y calientito a la portería de la Torre 2 en solo 5 minutos.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#DCE4CE] border border-[#75865A] px-2.5 py-0.5 text-[11px] font-bold text-[#42542E]">
                  ✓ Vecino Verificado
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D9B68C] flex items-center justify-between text-xs text-[#5B4A38]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-[#D9B68C] shadow-xs">
                  <Image src="/images/comunidad/vecino_4.png" alt="Don Fernando" width={36} height={36} className="h-full w-full object-cover" />
                </div>
                <div>
                  <span className="font-bold text-[#2B2117] block leading-tight">Don Fernando</span>
                  <span className="text-[10px] text-[#5B4A38] block">Vecino · Conjunto San Luis</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-0.5 text-[#F4C430]" aria-label="Calificación: 5 de 5">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
              </span>
            </div>
          </div>

          {/* Card 3: Comparador de Precios */}
          <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 sm:p-7 shadow-[0_16px_36px_rgba(43,33,23,0.18)] text-[#2B2117] flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-[#E66A1F] hover:-translate-y-1 group">
            <div>
              <div className="flex items-center gap-2.5 border-b border-[#D9B68C] pb-3 mb-3.5">
                <PhotoStamp src="https://images.unsplash.com/photo-1767628805149-ce974eb441c5?auto=format&fit=crop&w=160&h=160&q=80" alt="Comerciantes y vecinos en un mercado local" className="h-16 w-16" />
                <span className="text-sm font-bold text-[#3E5326] uppercase tracking-wide">
                  ECONOMÍA DEL BARRIO
                </span>
              </div>

              <div className="space-y-2 text-xs mt-3">
                <div className="flex justify-between items-center bg-[#EFE0C2] border border-[#D9B68C] px-3.5 py-2.5 rounded-xl">
                  <span className="text-[#6B5542] text-xs">Domicilio de app tradicional:</span>
                  <span className="line-through text-[#C84B31] font-bold text-xs sm:text-sm">$28k – $38k</span>
                </div>
                <div className="flex justify-between items-center bg-[#DCE4CE] border-2 border-[#75865A] px-3.5 py-2.5 rounded-xl shadow-xs">
                  <span className="text-[#2B2117] font-bold text-xs sm:text-sm">OllaCercana (A pie):</span>
                  <span className="text-[#3E5326] font-black text-sm sm:text-base">$8k – $18k</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#5B4A38] mt-3 text-center border-t border-[#D9B68C] pt-3 leading-snug">
              Ahorras más del 50% y comes comida casera de verdad sin sobrecostos de entrega.
            </p>
          </div>

          {/* Card 4: Seguridad y Confianza */}
          <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 sm:p-7 shadow-[0_16px_36px_rgba(43,33,23,0.18)] text-[#2B2117] flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-[#E66A1F] hover:-translate-y-1 group">
            <div>
              <div className="flex items-center gap-2.5 border-b border-[#D9B68C] pb-3 mb-3.5">
                <PhotoStamp src="https://images.unsplash.com/photo-1773741106710-0ad118f18933?auto=format&fit=crop&w=160&h=160&q=80" alt="Viviendas y edificios del barrio" className="h-16 w-16" />
                <span className="text-sm font-bold text-[#A84029] uppercase tracking-wide">
                  CONFIANZA VECINAL
                </span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#5B4A38] mt-3">
                <li className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#DCE4CE] text-[#3E5326] font-bold text-xs">✓</span>
                  <span>Vecinas verificadas en tu conjunto.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#DCE4CE] text-[#3E5326] font-bold text-xs">✓</span>
                  <span>Paga directo al recibir en portería.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#DCE4CE] text-[#3E5326] font-bold text-xs">✓</span>
                  <span>Sin comisiones abusivas a cocineras.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D9B68C] text-sm font-bold text-[#A84029] text-center">
              100% Comunitario y Hecho en el Barrio
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ¿QUÉ PUEDES HACER EN OLLACERCANA? (COMPRADOR VS COCINERA)               */}
      {/* ========================================================================= */}
      <section id="community-guide" className="relative z-30 max-w-6xl scroll-mt-6 mx-auto px-4 mt-12 pt-8 border-t border-white/10 font-['Patrick_Hand',cursive]">
        <div className="text-center mb-6">
          <p className="text-sm font-bold tracking-[0.18em] text-[#F4C430] uppercase mb-1">
            GUÍA DE LA COMUNIDAD · CERO COMPLICACIONES
          </p>
          <h3 className={`${HAND} text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF3E7]`}>
            ¿Cómo se vive <span style={{ color: ORANGE }}>OllaCercana</span>?
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#FAF3E7]/80 max-w-xl mx-auto">
            Elige tu rol en el barrio para ver todo lo que puedes hacer en la aplicación:
          </p>

          {showHomeGuideIntro && (
            <div role="status" aria-live="polite" className="mx-auto mt-4 max-w-2xl rounded-2xl border-2 border-[#F4C430] bg-[#2B2117] p-4 text-left text-[#FAF3E7] shadow-[0_0_32px_rgba(244,196,48,.35)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold text-[#F4C430]">Empieza por aquí</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#FAF3E7]/90">
                    Elige <strong>Comprador</strong> o <strong>Cocinera</strong>. Las tarjetas explican cada acceso y sus botones te llevan al menú, al mapa, a tus reservas o a la cocina.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.setItem("ollacercana-home-guide-seen", "true");
                    setShowHomeGuideIntro(false);
                  }}
                  className="shrink-0 rounded-full bg-[#F4C430] px-4 py-2 text-xs font-extrabold text-[#2B2117] transition hover:bg-[#ffdb58]"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {/* Toggle de Rol (Comprador vs Cocinera) */}
          <div className={`mt-4 inline-flex items-center rounded-full border-2 border-[#D9B68C] bg-[#FAF3E7] p-1 shadow-md ${showHomeGuideIntro ? "ring-4 ring-[#F4C430] ring-offset-4 ring-offset-[#24180f]" : ""}`}>
            <button
              type="button"
              onClick={() => setActiveRole("comprador")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeRole === "comprador"
                  ? "bg-gradient-to-r from-[#E66A1F] to-[#D85718] text-[#FFFBF3] shadow-md scale-105"
                  : "text-[#6B5542] hover:text-[#2B2117]"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Como Comprador</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole("cocinera")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeRole === "cocinera"
                  ? "bg-[#62B869] text-[#FFFBF3] shadow-md scale-105"
                  : "text-[#6B5542] hover:text-[#2B2117]"
              }`}
            >
              <ChefHat className="h-4 w-4" />
              <span>Como Cocinera</span>
            </button>
          </div>
        </div>

        {/* Tarjetas según el rol activo */}
        <AnimatePresence mode="wait">
          {activeRole === "comprador" ? (
            <motion.div
              key="comprador-guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-5 sm:grid-cols-3 ${showHomeGuideIntro ? "rounded-3xl ring-4 ring-[#F4C430] ring-offset-4 ring-offset-[#24180f]" : ""}`}
            >
              {/* Tarjeta 1: Menú */}
              <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 shadow-[0_12px_28px_rgba(43,33,23,0.14)] flex flex-col justify-between hover:border-[#E66A1F] transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9B68C]/70 pb-3 mb-3">
                    <PhotoStamp src="https://images.unsplash.com/photo-1510431198580-7727c9fa1e3a?auto=format&fit=crop&w=160&h=160&q=80" alt="Sopa casera servida en un plato" className="h-20 w-20" />
                    <span className="text-xs font-bold text-[#A84029] uppercase tracking-wide bg-[#F3DDC2] px-2.5 py-0.5 rounded-full border border-[#D9B68C]">
                      1. EN EL MENÚ DEL DÍA
                    </span>
                  </div>
                  <h4 className={`${HAND} text-xl sm:text-2xl font-bold text-[#2B2117] mt-1`}>Explora & Aparta tu Porción</h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Descubre platos caseros reales a 500m – 2km de tu edificio o conjunto.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span><strong className="text-[#2B2117]">Aparta en 1 toque</strong>: tienes 10 minutos de reserva garantizada sin tarjetas ni pagos por adelantado.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Filtra por sopas, almuerzos, vegetariano, postres y platos sin gluten.</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E66A1F] to-[#D85718] py-2.5 px-4 text-xs font-bold text-[#FFFBF3] hover:brightness-105 shadow-md transition-all"
                >
                  <span>Explorar el Menú</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tarjeta 2: Mapa */}
              <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 shadow-[0_12px_28px_rgba(43,33,23,0.14)] flex flex-col justify-between hover:border-[#62B869] transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9B68C]/70 pb-3 mb-3">
                    <PhotoStamp src="https://images.unsplash.com/photo-1771360292262-18411e2b2f8b?auto=format&fit=crop&w=160&h=160&q=80" alt="Persona consultando su teléfono mientras camina" className="h-20 w-20" />
                    <span className="text-xs font-bold text-[#3E5326] uppercase tracking-wide bg-[#DCE4CE] px-2.5 py-0.5 rounded-full border border-[#75865A]">
                      2. EN EL MAPA DE COCINERAS
                    </span>
                  </div>
                  <h4 className={`${HAND} text-xl sm:text-2xl font-bold text-[#2B2117] mt-1`}>Encuentra Quién Cocina Cerca</h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span>Mira en el mapa las ollas activas alrededor de tu ubicación actual.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span>Calcula tus minutos a pie (ej. 4 min caminando a la portería de al lado).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span><strong className="text-[#2B2117]">Privacidad total</strong>: solo ves el conjunto o barrio, nunca direcciones privadas.</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/cocineras-cercanas"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E5326] py-2.5 px-4 text-xs font-bold text-[#FFFBF3] hover:bg-[#344620] shadow-md transition-all"
                >
                  <span>Abrir Mapa Cercano</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tarjeta 3: Perfil y Pago */}
              <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 shadow-[0_12px_28px_rgba(43,33,23,0.14)] flex flex-col justify-between hover:border-[#E66A1F] transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9B68C]/70 pb-3 mb-3">
                    <PhotoStamp src="https://images.unsplash.com/photo-1721180672611-eb0489be150f?auto=format&fit=crop&w=160&h=160&q=80" alt="Personas compartiendo comida en una mesa" className="h-20 w-20" />
                    <span className="text-xs font-bold text-[#A84029] uppercase tracking-wide bg-[#F3DDC2] px-2.5 py-0.5 rounded-full border border-[#D9B68C]">
                      3. EN TU PERFIL & PEDIDOS
                    </span>
                  </div>
                  <h4 className={`${HAND} text-xl sm:text-2xl font-bold text-[#2B2117] mt-1`}>Coordina, Recoge & Paga</h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Habla con tu vecina por el chat interno para acordar el encuentro en portería.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span><strong className="text-[#2B2117]">Paga directo al recibir</strong>: efectivo, Nequi o Daviplata directo, sin intermediarios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Califica la sazón de la vecina y guarda tus cocineras favoritas del barrio.</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/cuenta/reservas"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E66A1F] to-[#D85718] py-2.5 px-4 text-xs font-bold text-[#FFFBF3] hover:brightness-105 shadow-md transition-all"
                >
                  <span>Ver Mis Reservas</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cocinera-guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-5 sm:grid-cols-3 ${showHomeGuideIntro ? "rounded-3xl ring-4 ring-[#F4C430] ring-offset-4 ring-offset-[#24180f]" : ""}`}
            >
              {/* Tarjeta Cocinera 1: Publicar */}
              <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 shadow-[0_12px_28px_rgba(43,33,23,0.14)] flex flex-col justify-between hover:border-[#62B869] transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9B68C]/70 pb-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCE4CE] text-[#3E5326]">
                      <Flame className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-[#3E5326] uppercase tracking-wide bg-[#DCE4CE] px-2.5 py-0.5 rounded-full border border-[#75865A]">
                      1. EN TU COCINA / PUBLICAR
                    </span>
                  </div>
                  <h4 className={`${HAND} text-xl sm:text-2xl font-bold text-[#2B2117] mt-1`}>Comparte lo que Sobró</h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span>¿Cocinaste de más? Sube foto, porciones y precio ($8k-$18k) en 1 minuto.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span><strong className="text-[#2B2117]">Frescura automática</strong>: tu plato expira a las 4 horas para que no cocines bajo presión.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span>Monetiza los sobrantes de tu cocina sin montar un negocio formal.</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/cuenta/cocina"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E5326] py-2.5 px-4 text-xs font-bold text-[#FFFBF3] hover:bg-[#344620] shadow-md transition-all"
                >
                  <span>Publicar un Plato</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tarjeta Cocinera 2: Reservas */}
              <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 shadow-[0_12px_28px_rgba(43,33,23,0.14)] flex flex-col justify-between hover:border-[#E66A1F] transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9B68C]/70 pb-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3DDC2] text-[#A84029]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-[#A84029] uppercase tracking-wide bg-[#F3DDC2] px-2.5 py-0.5 rounded-full border border-[#D9B68C]">
                      2. GESTIÓN DE RESERVAS
                    </span>
                  </div>
                  <h4 className={`${HAND} text-xl sm:text-2xl font-bold text-[#2B2117] mt-1`}>Confirmación sin Fricción</h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Cuando un vecino aparta, tienes ~10 minutos para confirmar con un toque.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Si no puedes despachar, la porción se libera sola sin penalizaciones.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#E66A1F] font-bold mt-0.5">✦</span>
                      <span>Coordina la hora de recogida en la portería de tu conjunto por el chat.</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/cuenta/reservas"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E66A1F] to-[#D85718] py-2.5 px-4 text-xs font-bold text-[#FFFBF3] hover:brightness-105 shadow-md transition-all"
                >
                  <span>Gestionar Reservas</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Tarjeta Cocinera 3: Cobro y Olla Verde */}
              <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 shadow-[0_12px_28px_rgba(43,33,23,0.14)] flex flex-col justify-between hover:border-[#62B869] transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between border-b border-[#D9B68C]/70 pb-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCE4CE] text-[#3E5326]">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-[#3E5326] uppercase tracking-wide bg-[#DCE4CE] px-2.5 py-0.5 rounded-full border border-[#75865A]">
                      3. INSIGNIAS & REPUTACIÓN
                    </span>
                  </div>
                  <h4 className={`${HAND} text-xl sm:text-2xl font-bold text-[#2B2117] mt-1`}>Gana el Sello Olla Verde</h4>
                  <ul className="mt-3 space-y-2 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span><strong className="text-[#2B2117]">0% comisiones de plataforma</strong>: todo el dinero de tus vecinos va a tu cuenta.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span>Gana el sello <strong className="text-[#3E5326]">Olla Verde</strong> por vender todas tus porciones 7 días consecutivos.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#3E5326] font-bold mt-0.5">✦</span>
                      <span>Gana clientes recurrentes que aman la buena sazón de hogar.</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/cuenta/perfil"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#3E5326] py-2.5 px-4 text-xs font-bold text-[#FFFBF3] hover:bg-[#344620] shadow-md transition-all"
                >
                  <span>Mi Perfil de Cocinera</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 5. CENTRO DE AYUDA INTERACTIVO & PREGUNTAS FRECUENTES                     */}
      {/* ========================================================================= */}
      <section className="relative z-30 max-w-4xl mx-auto px-4 mt-14">
        <div className="rounded-3xl border-2 border-[#D9B68C] bg-[#FBF5E8] p-6 sm:p-8 shadow-[0_16px_36px_rgba(43,33,23,0.18)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9B68C] pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3DDC2] border border-[#D9B68C] text-[#A84029]">
                <HelpCircle className="h-6 w-6" />
              </span>
              <div>
                <h4 className={`${HAND} text-2xl sm:text-3xl font-bold text-[#2B2117]`}>Centro de Ayuda de OllaCercana</h4>
                <p className="text-xs sm:text-sm text-[#5B4A38]">¿Tienes dudas de cómo funciona o pasó algo con tu pedido?</p>
              </div>
            </div>

            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E66A1F] to-[#D85718] px-5 py-2 text-xs font-bold text-[#FFFBF3] hover:brightness-105 shadow-md transition-all self-start sm:self-center"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F4C430]" />
              <span>Hablar con la Abuelita</span>
            </Link>
          </div>

          {/* Acordeón de Preguntas Frecuentes */}
          <div className="mt-5 space-y-2.5 text-left">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#D9B68C] bg-[#FFFBF3] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setSelectedFaq(selectedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left text-xs sm:text-sm font-bold text-[#2B2117] hover:text-[#E66A1F] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#E66A1F] text-lg ml-2 font-black">
                    {selectedFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {selectedFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-[13px] text-[#5B4A38] leading-relaxed border-t border-[#D9B68C]/50 pt-2.5 bg-[#FAF3E7]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#D9B68C] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5B4A38]">
            <span>¿Necesitas ayuda adicional con un vecino? Escríbenos a soporte comunitario.</span>
            <Link href="/ayuda" className="font-bold text-[#E66A1F] hover:underline flex items-center gap-1">
              <span>Ir a la Guía Paso a Paso</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CIERRE CÁLIDO & RETORNO AL FRAME DE LA ABUELITA COCINANDO               */}
      {/* ========================================================================= */}
      <div className="relative z-30 text-center mt-12 px-4">
        <p className={`${HAND} text-3xl sm:text-4xl text-[#FAF3E7]`}>
          La mejor receta es la que se comparte con el vecino.
        </p>
        
        {/* Este botón regresa suavemente al frame exacto de la abuelita cocinando */}
        <button
          type="button"
          onClick={handleScrollToAbuelitaKitchen}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#F0822D] bg-[#F0822D] px-6 py-2.5 text-sm font-bold text-[#2B2117] shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Volver a la cocina de la abuelita
        </button>

        <div className="text-xs text-[#8A7860] tracking-widest uppercase mt-6">
          OllaCercana · Conectando Cocinas Reales en el Barrio
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. MODAL DE AUTENTICACIÓN / REGISTRO AL APARTAR PORCIÓN                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {authPromptDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthPromptDish(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#2B2117]/95 p-6 text-center text-[#FAF3E7] shadow-2xl backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={() => setAuthPromptDish(null)}
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-2xl border-2 border-[#F0822D] shadow-lg">
                <Image src={authPromptDish.image} alt={authPromptDish.name} fill className="object-cover" />
              </div>

              <span className={`${MONO} text-[10px] font-bold text-[#F4C430] uppercase tracking-wider`}>
                ¡ESTÁS A UN PASO DE TU COMIDA!
              </span>
              <h3 className={`${SERIF} text-2xl font-bold text-[#FAF3E7] mt-1`}>
                Apartar {authPromptDish.name}
              </h3>
              <p className="mt-2 text-xs text-[#FAF3E7]/80 leading-relaxed">
                Para guardar tu porción por 10 minutos y coordinar la entrega en portería con {authPromptDish.cook}, inicia sesión o crea tu cuenta de vecino:
              </p>

              <div className="mt-5 space-y-2.5">
                <Link
                  href="/cuenta"
                  onClick={() => setAuthPromptDish(null)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F0822D] py-3 text-xs font-bold text-[#2B2117] hover:bg-[#F4C430] transition-colors shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  href="/cuenta/registro"
                  onClick={() => setAuthPromptDish(null)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-[#FAF3E7] hover:bg-white/10 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Crear Cuenta de Vecino</span>
                </Link>
              </div>

              <p className={`${MONO} text-[10px] text-[#FAF3E7]/60 mt-4`}>
                Precio: {authPromptDish.price} · Se paga al recibir en portería
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. MODAL EXPANDIDO DE DETALLES DEL PLATO                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {expandedDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedDish(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-[#2B2117]/95 p-5 text-left text-[#FAF3E7] shadow-2xl backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={() => setExpandedDish(null)}
                className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-black/40">
                <Image src={expandedDish.image} alt={expandedDish.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2117] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-bold text-[#F4C430]">
                  {expandedDish.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-xl font-black text-[#F4C430]">
                  {expandedDish.price}
                </span>
              </div>

              <div className="mt-4">
                <span className={`${MONO} text-[10px] font-bold text-[#62B869] uppercase`}>
                  {expandedDish.category} · HECHO EN CASA
                </span>
                <h3 className={`${SERIF} text-2xl font-bold text-[#FAF3E7] mt-0.5`}>{expandedDish.name}</h3>

                <div className="mt-3 flex items-center justify-between gap-2.5 rounded-2xl border border-white/15 bg-white/5 p-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={expandedDish.cookAvatar}
                      alt={expandedDish.cook}
                      width={44}
                      height={44}
                      className="rounded-full border-2 border-[#F0822D]"
                    />
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-[#FAF3E7] text-sm">{expandedDish.cook}</span>
                      <span className="text-[#FAF3E7]/70 text-[11px]">{expandedDish.cookRole}</span>
                      <span className="text-[#FAF3E7]/90 font-mono text-[11px] mt-0.5"><Building2 className="inline h-3 w-3" aria-hidden="true" /> {expandedDish.residentialComplex}</span>
                    </div>
                  </div>

                  {/* Pin Proximidad Destacado en el Modal */}
                  <div className="flex flex-col items-end gap-1 rounded-xl border border-[#62B869] bg-[#62B869]/20 px-3 py-1.5 shadow-[0_0_15px_rgba(98,184,105,0.25)] shrink-0">
                    <div className="flex items-center gap-1.5 text-[#62B869] font-extrabold text-xs">
                      <MapPin className="h-3.5 w-3.5 fill-[#62B869] text-[#2B2117] animate-bounce" />
                      <span>{expandedDish.distance}</span>
                    </div>
                    <span className="text-[10px] text-[#F4C430] font-mono font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {expandedDish.walkMinutes} min a pie
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-[#FAF3E7]/85 leading-relaxed">{expandedDish.fullDesc}</p>

                <div className="mt-3 rounded-xl border border-[#F4C430]/30 bg-[#F4C430]/10 p-3">
                  <p className={`${MONO} text-[9px] font-bold text-[#F4C430] uppercase mb-0.5`}>Consejo de la Abuela</p>
                  <p className={`${HAND} text-xl text-[#FDF3D6]`}>&ldquo;{expandedDish.grandmaNote}&rdquo;</p>
                </div>

                <div className="mt-4 flex gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      setExpandedDish(null);
                      handleOpenAuthPrompt(expandedDish, e);
                    }}
                    className="flex-1 rounded-xl bg-[#F0822D] py-2.5 text-xs font-bold text-[#2B2117] hover:bg-[#F4C430] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Utensils className="h-4 w-4" />
                    <span>Apartar porción ({expandedDish.price})</span>
                  </button>

                  <Link
                    href="/menu"
                    className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-[#FAF3E7] hover:bg-white/10 flex items-center justify-center"
                  >
                    Ver en Menú
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 9. DRAWER EMERGENTE DE AYUDA                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {helpDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpDrawerOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-[#2B2117]/95 p-6 text-left text-[#FAF3E7] shadow-2xl backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={() => setHelpDrawerOpen(false)}
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4C430]/20 border border-[#F4C430]/50 text-[#F4C430]">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#FAF3E7]">Preguntas Frecuentes & Soporte</h3>
                  <p className="text-xs text-[#FAF3E7]/70">Resolvemos tus dudas al instante</p>
                </div>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs font-bold text-[#F4C430]">{faq.q}</p>
                    <p className="mt-1 text-xs text-[#FAF3E7]/80 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/ayuda"
                  className="rounded-xl bg-[#F0822D] py-2.5 text-center text-xs font-bold text-[#2B2117] hover:bg-[#F4C430] transition-colors"
                >
                  Abrir Guía Completa de Ayuda
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-[#2B2117]/95 px-4 py-2 text-xs font-bold text-[#FAF3E7] shadow-2xl backdrop-blur-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#F4C430]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
