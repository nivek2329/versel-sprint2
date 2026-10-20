"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ChefHat,
  ShoppingBasket,
  HelpCircle,
  Sparkles,
  Award,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  HeartHandshake,
  MessageCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

interface FaqItem {
  id: string;
  category: "pedidos" | "insignias" | "cocineras" | "pagos" | "seguridad";
  categoryLabel: string;
  question: string;
  answer: string;
  tip?: string;
  highlightBadge?: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: "apartar-porcion",
    category: "pedidos",
    categoryLabel: "Pedidos y Porciones",
    question: "¿Cómo aparto una porción de comida casera?",
    answer:
      "Explora las ollas activas de hoy en el visor espacial o en el Libretón vecinal. Al encontrar tu plato preferido, pulsa «Apartar porción» e inicia sesión. Tu porción quedará reservada de inmediato durante 10 minutos para que coordines la recogida con la cocinera.",
    tip: "Te recomendamos apartar temprano: los platos de las abuelas tienen pocas porciones al día y suelen agotarse antes del mediodía.",
    highlightBadge: "Reserva de 10 min",
  },
  {
    id: "pagos-metodos",
    category: "pagos",
    categoryLabel: "Pagos y Recogida",
    question: "¿Cómo y cuándo se paga la comida? ¿Hay comisiones ocultas?",
    answer:
      "En OllaCercana creemos en la economía directa entre vecinos: no cobramos comisiones abusivas sobre la comida ni intermediamos el dinero. Acuerdas el pago directamente con la cocinera al recibir el plato en portería (Nequi, Daviplata o Efectivo exacto).",
    tip: "El precio que ves publicado es el total real del plato casero. Sin costos de servicio de plataforma.",
    highlightBadge: "0% Comisiones Ocultas",
  },
  {
    id: "sello-olla-verde",
    category: "insignias",
    categoryLabel: "Sello Olla Verde & Insignias",
    question: "¿Qué es el Sello Olla Verde (7 PT) y cómo lo consiguen las cocineras?",
    answer:
      "El Sello Olla Verde es nuestro máximo distintivo de honor comunitario y sostenibilidad. Se otorga a las cocineras que alcanzan 7 Puntos de Tradición (7 PT) consecutivos cocinando con precisión vecinal: vendiendo el 100% de sus porciones preparadas sin generar desperdicio de alimentos.",
    tip: "Cuando compras a una cocinera con Sello Olla Verde, estás apoyando la cocina con residuo cero en tu propio conjunto o cuadra.",
    highlightBadge: "Distintivo Sostenible 7 PT",
  },
  {
    id: "cocinera-destacada",
    category: "insignias",
    categoryLabel: "Sello Olla Verde & Insignias",
    question: "¿Cuáles son las otras insignias de reconocimiento del barrio?",
    answer:
      "Además del Sello Olla Verde, premiamos: «Cocinera Destacada» (calificación promedio de 4.8+ estrellas con más de 20 porciones entregadas), «Receta de Tradición» (platos emblemáticos preservados por más de dos generaciones) y «Olla al Carbón / Fuego Lento» (cocción artesanal certificada por los comensales).",
    tip: "Las insignias se actualizan de forma automática y transparente según las calificaciones reales de los vecinos.",
    highlightBadge: "Calificación 4.8+ Vecinal",
  },
  {
    id: "donde-recoger",
    category: "pagos",
    categoryLabel: "Pagos y Recogida",
    question: "¿Dónde se realiza la entrega de las porciones?",
    answer:
      "La entrega se efectúa de manera segura y cercana: generalmente en la portería del conjunto residencial o en el punto de encuentro acordado a pocos pasos (radio de 350 m a 1.5 km). Esto garantiza que la comida llegue humeante y lista para almorzar sin pagar costosos domicilios motorizados.",
    tip: "Coordina la hora exacta con la cocinera por el chat interno para bajar a portería justo cuando el plato esté listo.",
    highlightBadge: "Entrega en Portería",
  },
  {
    id: "vender-en-casa",
    category: "cocineras",
    categoryLabel: "Modo Cocinera & Publicación",
    question: "¿Puedo vender comida si cocino en mi casa y no soy un restaurante?",
    answer:
      "¡Absolutamente sí! OllaCercana nació para dignificar a las madres, abuelas y vecinos apasionados que cocinan con sazón en sus hogares. Solo necesitas registrarte con el rol de cocinera, aceptar nuestro pacto comunitario de higiene y convivencia, y publicar tus porciones disponibles del día.",
    tip: "Tú fijas tu propio menú, la cantidad de porciones que deseas compartir y el horario de entrega.",
    highlightBadge: "Empieza desde tu Cocina",
  },
  {
    id: "frescura-4-horas",
    category: "cocineras",
    categoryLabel: "Modo Cocinera & Publicación",
    question: "¿Cómo se garantiza que la comida no sea recalentada?",
    answer:
      "Nuestra plataforma tiene una regla sagrada de frescura: cada publicación de olla se desactiva automáticamente a las 4 horas de haber sido cocinada. Jamás encontrarás porciones recalentadas ni comida del día anterior; todo se elabora el mismo día a fuego lento.",
    tip: "Cada plato muestra la hora de cocción y el tiempo estimado desde que se apagó el fogón.",
    highlightBadge: "Ventana de 4 Horas",
  },
  {
    id: "resenas-verificadas",
    category: "seguridad",
    categoryLabel: "Seguridad y Confianza",
    question: "¿Cómo funcionan las reseñas y la seguridad entre vecinos?",
    answer:
      "Solo los vecinos registrados que hayan apartado y recibido efectivamente una porción pueden calificar y dejar una reseña en el perfil de la cocinera. Esto previene comentarios falsos y mantiene un ambiente de respeto, gratitud y confianza mutua.",
    tip: "Puedes leer las opiniones de vecinos de tu mismo conjunto residencial antes de ordenar cualquier plato.",
    highlightBadge: "100% Compradores Reales",
  },
  {
    id: "tiempo-expiracion",
    category: "pedidos",
    categoryLabel: "Pedidos y Porciones",
    question: "¿Qué ocurre si no confirmo mi reserva antes de los 10 minutos?",
    answer:
      "Para ser justos con la cocinera y con otros vecinos que desean almorzar, si una porción apartada no se confirma en el plazo de 10 minutos, vuelve a quedar disponible de forma automática en el visor de barrio.",
    tip: "Si surge algún imprevisto, puedes volver a apartarla si aún quedan porciones en la olla.",
    highlightBadge: "Rotación Justa",
  },
];

const CATEGORIES = [
  { id: "todos", label: "Todas las preguntas" },
  { id: "pedidos", label: "🥘 Pedidos y Porciones" },
  { id: "insignias", label: "🏅 Sello Olla Verde e Insignias" },
  { id: "cocineras", label: "👩‍🍳 Modo Cocinera" },
  { id: "pagos", label: "🤝 Pagos y Recogida" },
  { id: "seguridad", label: "🛡️ Seguridad y Reseñas" },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("apartar-porcion");

  // Mini asistente de pregunta rápida a Doña Rosa
  const [abuelaQuery, setAbuelaQuery] = useState("");
  const [abuelaReply, setAbuelaReply] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === "todos" || faq.category === activeCategory;
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchesSearch =
        normalizedQuery === "" ||
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery) ||
        faq.categoryLabel.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleAskAbuela = (e: React.FormEvent) => {
    e.preventDefault();
    const query = abuelaQuery.toLowerCase().trim();
    if (!query) return;

    if (query.includes("pago") || query.includes("plata") || query.includes("nequi") || query.includes("cuanto cuesta")) {
      setAbuelaReply(
        "¡Hola mi cielo! El pago lo acuerdas directo con tu vecina cocinera: en efectivo en portería o por Nequi/Daviplata al recibir tu plato. OllaCercana no cobra comisiones ocultas."
      );
    } else if (query.includes("verde") || query.includes("sello") || query.includes("insignia") || query.includes("7 pt")) {
      setAbuelaReply(
        "El Sello Olla Verde (7 PT) premia a las cocineras que durante 7 días seguidos logran vender todo su menú sin botar ni una pizca de comida. ¡Es puro orgullo y cero desperdicio en el barrio!"
      );
    } else if (query.includes("recoger") || query.includes("donde") || query.includes("domicilio") || query.includes("porteria")) {
      setAbuelaReply(
        "Por comodidad y seguridad de todos, la entrega se hace en la portería de tu conjunto o en un punto acordado a pocos metros de distancia. ¡Así tu sopita llega calientica!"
      );
    } else if (query.includes("cocinar") || query.includes("vender") || query.includes("mi casa") || query.includes("publicar")) {
      setAbuelaReply(
        "¡Qué dicha que quieras compartir tu sazón! Solo ve a «Crear cuenta», elige el rol Cocinera y publica tu olla del día con la hora exacta de cocción. Tu plato estará activo por 4 horas."
      );
    } else {
      setAbuelaReply(
        "Mi cielo, qué buena pregunta. En OllaCercana todo se basa en la buena fe y el amor casero entre vecinos. Revisa las preguntas abajo o ve al Libretón para probar nuestro sabor de hogar."
      );
    }
  };

  return (
    <main
      className="min-h-screen text-[#FAF3E7] relative selection:bg-[#F0822D]/30 selection:text-[#F4C430]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(30,22,15,0.88) 0%, rgba(30,22,15,0.96) 100%), url('/images/kitchen_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Luz ambiental cálida de cocina */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-[#F0822D]/20 via-[#F4C430]/5 to-transparent"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 1. BOTÓN DE REGRESO DIRECTO AL ENDING PAGE (NO AL INICIO DEL CANVAS)      */}
        {/* ========================================================================= */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <Link
            href="/#ending"
            className="group inline-flex items-center gap-2 rounded-full border border-[#F0822D]/60 bg-[#2B2117]/80 px-4 py-2 text-xs sm:text-sm font-bold text-[#FAF3E7] shadow-lg backdrop-blur-xl transition hover:border-[#F4C430] hover:bg-[#F0822D] hover:text-[#2B2117]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Volver a la cocina del barrio</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#FAF3E7]/70">
            <span className="h-2 w-2 rounded-full bg-[#62B869] animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-[#62B869]">
              Centro de Ayuda Vecinal Activo
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. HERO HEADER CON DOÑA ROSA Y ESTILO ACOGEDOR                           */}
        {/* ========================================================================= */}
        <header className="relative mb-8 overflow-hidden rounded-3xl border border-white/15 bg-[#2B2117]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border-2 border-[#F0822D] shadow-xl">
                <Image
                  src="/images/dona_rosa_mascot.jpg"
                  alt="Doña Rosa - Abuelita de OllaCercana"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#62B869] text-white shadow-md border-2 border-[#2B2117]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F4C430]/30 bg-[#F4C430]/10 px-3 py-1 text-[11px] font-bold text-[#F4C430] uppercase tracking-wider mb-2">
                <ChefHat className="h-3.5 w-3.5 text-[#F4C430]" />
                <span>Atención con Sabor de Hogar</span>
              </div>
              <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF3E7] leading-tight">
                Ayuda de la Casa
              </h1>
              <p className="mt-2 font-['Caveat',cursive] text-xl sm:text-2xl text-[#FDF3D6]">
                &ldquo;Aquí entre vecinos nos cuidamos y resolvemos cualquier duda con amor y sazón.&rdquo;
              </p>
              <p className="mt-2 text-xs sm:text-sm text-[#FAF3E7]/80 max-w-2xl leading-relaxed">
                Aprende cómo apartar tu almuerzo casero, cómo funciona el prestigioso Sello Olla Verde (7 PT) y cómo las cocineras del barrio comparten su receta sin comisiones.
              </p>
            </div>
          </div>

          {/* Barra de búsqueda interactiva */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FAF3E7]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por palabra clave (ej: Sello Olla Verde, portería, Nequi, 10 minutos, cocinera)..."
                className="w-full rounded-2xl border border-white/15 bg-black/40 pl-11 pr-4 py-3 text-xs sm:text-sm text-[#FAF3E7] placeholder:text-[#FAF3E7]/40 outline-none transition focus:border-[#F0822D] focus:ring-1 focus:ring-[#F0822D]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#FAF3E7]/60 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 3. ASISTENTE DIRECTO: PREGÚNTALE A LA ABUELITA                           */}
        {/* ========================================================================= */}
        <section className="mb-8 rounded-3xl border border-[#F4C430]/30 bg-gradient-to-r from-[#2B2117]/95 to-[#38281a]/95 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0822D]/20 text-[#F0822D] border border-[#F0822D]/40">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#FAF3E7]">
                ¿Tienes una duda rápida? Pregúntale directo a Doña Rosa
              </h2>
              <p className="text-xs text-[#FAF3E7]/70">
                Escribe tu consulta y recibe la respuesta de la abuela al instante
              </p>
            </div>
          </div>

          <form onSubmit={handleAskAbuela} className="flex flex-col sm:flex-row gap-2 mt-3">
            <input
              type="text"
              value={abuelaQuery}
              onChange={(e) => setAbuelaQuery(e.target.value)}
              placeholder="Ej: ¿Dónde recojo mi sancocho? o ¿Qué es el Sello Olla Verde?"
              className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-xs sm:text-sm text-[#FAF3E7] placeholder:text-[#FAF3E7]/40 outline-none focus:border-[#F4C430]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#F0822D] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#2B2117] transition hover:bg-[#F4C430] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              <span>Preguntar</span>
            </button>
          </form>

          {abuelaReply && (
            <div className="mt-4 rounded-2xl border border-[#62B869]/30 bg-[#62B869]/10 p-4 text-xs sm:text-sm text-[#FAF3E7] leading-relaxed">
              <p className="font-['Caveat',cursive] text-lg text-[#F4C430] mb-1 font-bold">
                Doña Rosa te aconseja:
              </p>
              <p>{abuelaReply}</p>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. TABS DE CATEGORÍAS                                                    */}
        {/* ========================================================================= */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#F0822D] text-[#2B2117] shadow-lg shadow-[#F0822D]/20 scale-105"
                  : "border border-white/15 bg-white/5 text-[#FAF3E7]/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* 5. LISTA DE PREGUNTAS EN ACORDEÓN INTERACTIVO                            */}
        {/* ========================================================================= */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-[#FAF3E7]/70">
              No encontramos respuestas para &ldquo;{searchQuery}&rdquo;. Intenta con términos como &ldquo;pago&rdquo;, &ldquo;reserva&rdquo;, &ldquo;cocinera&rdquo; o &ldquo;olla verde&rdquo;.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const isOllaVerde = faq.id === "sello-olla-verde";

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "border-[#F0822D]/50 bg-[#2B2117]/95 shadow-xl"
                      : "border-white/10 bg-[#2B2117]/70 hover:border-white/20"
                  } backdrop-blur-xl overflow-hidden`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-base font-bold text-[#FAF3E7] hover:text-[#F4C430] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#F4C430]">
                        <HelpCircle className="h-4 w-4" />
                      </span>
                      <span>{faq.question}</span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 ml-3">
                      {faq.highlightBadge && (
                        <span className="hidden sm:inline-block rounded-full bg-[#F4C430]/15 border border-[#F4C430]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#F4C430] font-mono">
                          {faq.highlightBadge}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 text-[#F0822D] transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 border-t border-white/10 text-xs sm:text-sm text-[#FAF3E7]/85 leading-relaxed space-y-3">
                      <p>{faq.answer}</p>

                      {/* Elemento visual especial para Sello Olla Verde */}
                      {isOllaVerde && (
                        <div className="mt-3 flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-[#62B869]/40 bg-[#62B869]/10 p-3.5">
                          <div className="relative h-16 w-16 shrink-0">
                            <Image
                              src="/images/sello_olla_verde.png"
                              alt="Sello Olla Verde"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="text-xs text-[#FAF3E7]/90 leading-relaxed text-center sm:text-left">
                            <p className="font-bold text-[#62B869] uppercase font-mono text-[11px] mb-0.5">
                              Distintivo de Honor: Sello Olla Verde (7 PT)
                            </p>
                            <p>
                              Premia el compromiso real contra el desperdicio. Las cocineras planifican porciones exactas para sus vecinos, evitando sobras y promoviendo el consumo local sostenible.
                            </p>
                          </div>
                        </div>
                      )}

                      {faq.tip && (
                        <div className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-xs text-[#FAF3E7]/75">
                          <CheckCircle2 className="h-4 w-4 text-[#62B869] shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-[#FAF3E7]">Consejo del barrio:</strong> {faq.tip}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. VALOR DIFERENCIADOR & PILARES DE OLLACERCANA                          */}
        {/* ========================================================================= */}
        <section className="mt-12 rounded-3xl border border-white/15 bg-black/40 p-6 sm:p-8 backdrop-blur-xl text-center">
          <p className="font-mono text-[10px] font-bold text-[#F4C430] uppercase tracking-widest mb-1">
            NUESTRO PACTO CON LA COMUNIDAD
          </p>
          <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#FAF3E7]">
            Por qué OllaCercana es diferente a una app de domicilios
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0822D]/20 text-[#F0822D] mb-3">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#FAF3E7] text-sm mb-1">Trato Vecino a Vecino</h3>
              <p className="text-xs text-[#FAF3E7]/70 leading-relaxed">
                Sin intermediarios anónimos. Conoces a quien cocina para ti, saludas al recoger y apoyas la economía real de tu conjunto.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#62B869]/20 text-[#62B869] mb-3">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#FAF3E7] text-sm mb-1">Insignias & Cero Desperdicio</h3>
              <p className="text-xs text-[#FAF3E7]/70 leading-relaxed">
                El Sello Olla Verde garantiza que cada comida fue preparada a demanda, reduciendo a cero el desperdicio de alimentos.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4C430]/20 text-[#F4C430] mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#FAF3E7] text-sm mb-1">Frescura Estricta de 4h</h3>
              <p className="text-xs text-[#FAF3E7]/70 leading-relaxed">
                Las ollas expiran solas a las 4 horas de publicadas. Nunca pagas por comida congelada o recalentada de días atrás.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. BOTONES DE ACCIÓN RÁPIDA Y REGRESO DIRECTO                             */}
        {/* ========================================================================= */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#ending"
            className="flex items-center gap-2 rounded-full border border-[#F0822D] bg-[#F0822D] px-6 py-3 text-xs sm:text-sm font-bold text-[#2B2117] shadow-lg hover:bg-[#F4C430] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Regresar a la Cocina del Barrio</span>
          </Link>

          <Link
            href="/menu"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold text-[#FAF3E7] hover:bg-white/15 transition-colors"
          >
            <ShoppingBasket className="h-4 w-4 text-[#F4C430]" />
            <span>Ver Menú de Hoy (El Libretón)</span>
          </Link>

          <Link
            href="/cuenta"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold text-[#FAF3E7] hover:bg-white/15 transition-colors"
          >
            <ChefHat className="h-4 w-4 text-[#62B869]" />
            <span>Mi Cuenta / Iniciar Sesión</span>
          </Link>
        </div>

        {/* Nota de pie acogedora */}
        <p className="mt-10 text-center font-['Caveat',cursive] text-lg text-[#FAF3E7]/60">
          OllaCercana · Hecho con amor, a fuego lento y entre vecinos.
        </p>
      </div>
    </main>
  );
}
