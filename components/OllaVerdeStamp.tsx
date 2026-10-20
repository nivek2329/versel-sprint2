"use client";

import { useEffect, useState } from "react";
import { getActiveOllaVerdeAwards, OllaVerdeAward, sharesResidentialComplex } from "@/lib/ollacercana-store";

interface OllaVerdeStampProps {
  residentialComplex?: string;
  compact?: boolean;
  className?: string;
}

export default function OllaVerdeStamp({ residentialComplex, compact = false, className = "" }: OllaVerdeStampProps) {
  const [awards, setAwards] = useState<OllaVerdeAward[]>([]);

  useEffect(() => {
    const refreshAwards = () => setAwards(getActiveOllaVerdeAwards());
    refreshAwards();
    window.addEventListener("ollaverde-progress-updated", refreshAwards);
    window.addEventListener("storage", refreshAwards);
    return () => {
      window.removeEventListener("ollaverde-progress-updated", refreshAwards);
      window.removeEventListener("storage", refreshAwards);
    };
  }, []);

  const award = awards.find((item) => sharesResidentialComplex(item.residentialComplex, residentialComplex));
  if (!award) return null;

  const expiry = new Date(award.validUntil).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  return (
    <span
      title={`Sello oficial Olla Verde · 7 PT. ${award.residentialComplex} completó la meta de vender todas sus porciones durante 7 días consecutivos. Vigente hasta el ${expiry}.${award.isDemo ? " Ejemplo de demostración." : ""}`}
      aria-label={`Sello Olla Verde de 7 PT para ${award.residentialComplex}${award.isDemo ? ", ejemplo de demostración" : ""}`}
      className={`inline-block select-none transition-transform duration-200 hover:scale-105 ${className}`}
    >
      <img
        src="/images/sello_olla_verde.png"
        alt={`Sello Olla Verde · 7 PT (${award.residentialComplex})`}
        className={`object-contain drop-shadow-[0_2px_5px_rgba(0,0,0,0.18)] ${
          compact ? "h-9 w-auto" : "h-16 w-auto"
        }`}
        loading="lazy"
      />
    </span>
  );
}
