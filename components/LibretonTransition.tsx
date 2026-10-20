"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// ============================================================================
// MATRIZ DE TRANSICIONES COHERENTES (ORIGEN ➔ DESTINO ➔ VIDEO EXACTO)
// ============================================================================
const TRANSITIONS_MAP: { from: string; to: string; videoSrc: string }[] = [
  // 1. Portada ➔ Libretón
  { from: "/", to: "/menu", videoSrc: "/videos/portada_menu.mp4" },

  // 2. Portada ➔ Mapa
  { from: "/", to: "/cocineras-cercanas", videoSrc: "/videos/portada_mapa.mp4" },

  // 3. Menú ➔ Cocineras / Mapa
  { from: "/menu", to: "/cocineras-cercanas", videoSrc: "/videos/menu_cocineras.mp4" },
  { from: "/menu", to: "/cocineras", videoSrc: "/videos/menu_cocineras.mp4" },

  // 4. Menú ➔ Login / Cuenta (el video original)
  { from: "/menu", to: "/cuenta", videoSrc: "/videos/libreton_transicion.mp4" },
  { from: "/menu", to: "/cuenta/registro", videoSrc: "/videos/libreton_transicion.mp4" },
];

const OVERLAY_ID = "libreton-page-turn-overlay";
const FADE_OUT_MS = 380;

type Phase = "idle" | "playing" | "exiting";

function getTransitionVideo(fromPath: string, toPath: string, anchor: HTMLAnchorElement): string | null {
  const cleanFrom = fromPath.replace(/\/+$/, "") || "/";
  const cleanTo = toPath.replace(/\/+$/, "") || "/";

  if (cleanFrom === cleanTo) return null;

  // Botones de retroceso NO reproducen video
  const textLabel = (anchor.getAttribute("aria-label") || anchor.innerText || "").toLowerCase();
  if (
      textLabel.includes("volver") ||
      textLabel.includes("regresar") ||
      textLabel.includes("atrás") ||
      textLabel.includes("atras") ||
      anchor.hasAttribute("data-no-transition")
  ) {
    return null;
  }

  const match = TRANSITIONS_MAP.find((item) => item.from === cleanFrom && item.to === cleanTo);
  return match ? match.videoSrc : null;
}

export default function LibretonTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>("/videos/portada_menu.mp4");
  const busyRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pendingHref = useRef<string | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Termina la transición y oculta la cortina
  const finish = useCallback(() => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    setPhase("exiting");
    window.setTimeout(() => {
      pendingHref.current = null;
      busyRef.current = false;
      setPhase("idle");
    }, FADE_OUT_MS);
  }, []);

  // Inicia la reproducción y navegación
  const run = useCallback(
      (href: string, videoSrc: string) => {
        busyRef.current = true;
        pendingHref.current = href;
        setActiveVideoSrc(videoSrc);
        router.push(href);
        setPhase("playing");

        // Seguro inicial generoso (12 segundos) por si la metadata tarda en leerse
        safetyTimerRef.current = setTimeout(() => {
          if (busyRef.current) finish();
        }, 12000);
      },
      [router, finish]
  );

  // Lee la duración real del video y ajusta el seguro para que NUNCA lo corte antes
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const durationMs = videoRef.current.duration * 1000;

    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

    // El seguro solo saltará si el video se traba 2 segundos DESPUÉS de su duración total
    safetyTimerRef.current = setTimeout(() => {
      if (busyRef.current) finish();
    }, durationMs + 2000);
  };

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (busyRef.current) return;

      if (
          window.localStorage.getItem("ollacercana_page_transition") === "false" ||
          window.localStorage.getItem("ollacercana_reduce_motion") === "true"
      ) {
        return;
      }

      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = e.target as HTMLElement | null;
      const anchor = el?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let targetUrl: URL;
      try {
        targetUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;

      const videoToPlay = getTransitionVideo(window.location.pathname, targetUrl.pathname, anchor);
      if (!videoToPlay) return;

      e.preventDefault();
      run(targetUrl.pathname + targetUrl.search, videoToPlay);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, [run]);

  useEffect(() => {
    if (phase !== "playing") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    const playPromise = v.play();
    if (playPromise) playPromise.catch(() => finish());
  }, [phase, activeVideoSrc, finish]);

  const active = phase !== "idle";

  return (
      <>
        {children}

        {active && (
            <div
                id={OVERLAY_ID}
                aria-hidden="true"
                className="fixed inset-0 z-[999] pointer-events-auto bg-[#EFE0C2]"
                style={{ opacity: phase === "exiting" ? 0 : 1, transition: `opacity ${FADE_OUT_MS}ms ease` }}
            >
              <video
                  ref={videoRef}
                  src={activeVideoSrc}
                  muted
                  playsInline
                  autoPlay
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={finish}
                  className="h-full w-full object-cover"
              />
            </div>
        )}
      </>
  );
}
