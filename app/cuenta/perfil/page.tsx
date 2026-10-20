"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AnimatedKitchenBackground from "@/components/AnimatedKitchenBackground";
import AccountNav from "@/components/AccountNav";
import {
  Phone,
  UserCheck,
  CheckCircle2,
  KeyRound,
  CreditCard,
  Building,
  RefreshCw,
  HelpCircle,
  Home,
  Heart,
  Award,
  ArrowRight,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  phoneVerified?: boolean;
  role: "comprador" | "cocinera" | "admin";
  commercialName?: string;
  bio?: string;
  residentialComplex?: string;
  paymentMethods: string[];
  badges?: string[];
  isLoggedIn: boolean;
  avatar?: string;
  kitchenPhoto?: string;
  isCocineraActive?: boolean;
  dataConsentAccepted?: boolean;
  isPaused?: boolean;
}

export default function PerfilPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Profile Form State
  const [commercialName, setCommercialName] = useState("");
  const [bio, setBio] = useState("");
  const [residentialComplex, setResidentialComplex] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(["Efectivo", "Nequi"]);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // OTP Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const savedUserJson = localStorage.getItem("ollacercana_user");
    if (!savedUserJson) {
      router.replace("/cuenta/sesion-expirada");
      return;
    }
    try {
      const parsed: UserProfile = JSON.parse(savedUserJson);
      if (!parsed.isLoggedIn) {
        router.replace("/cuenta/sesion-expirada");
        return;
      }
      setUser(parsed);
      setCommercialName(parsed.commercialName || "Cocina de Doña Elena");
      setBio(parsed.bio || "Especialidad en guisos tradicionales a fuego lento y repostería artesanal.");
      setResidentialComplex(parsed.residentialComplex || "Torres del Norte - Apto 302");
      setEditPhone(parsed.phone);
      setSelectedPaymentMethods(parsed.paymentMethods || ["Efectivo", "Nequi"]);
      setCheckingSession(false);
    } catch (e) {
      console.error(e);
      router.replace("/cuenta/sesion-expirada");
    }
  }, [router]);

  // OTP timer tick
  useEffect(() => {
    if (!showOtpModal) return;
    const timer = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showOtpModal]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Profile Save Handler
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editPhone !== user.phone && /^3\d{9}$/.test(editPhone)) {
      setShowOtpModal(true);
      setOtpTimer(300);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      return;
    }

    const updated: UserProfile = {
      ...user,
      commercialName,
      bio,
      residentialComplex,
      phone: editPhone,
      paymentMethods: selectedPaymentMethods,
    };
    setUser(updated);
    localStorage.setItem("ollacercana_user", JSON.stringify(updated));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // OTP Verification Submit
  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length !== 6) {
      setOtpError("Ingresa el código completo de 6 dígitos.");
      return;
    }

    if (code === "000000") {
      setOtpError("Código incorrecto o expirado.");
      return;
    }

    if (!user) return;

    const updated: UserProfile = {
      ...user,
      phone: editPhone,
      commercialName,
      bio,
      residentialComplex,
      paymentMethods: selectedPaymentMethods,
    };
    setUser(updated);
    localStorage.setItem("ollacercana_user", JSON.stringify(updated));
    setShowOtpModal(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  if (checkingSession || !user) {
    return (
      <main data-theme-page className="relative min-h-screen w-full bg-[#14110f] flex items-center justify-center">
        <p className="text-stone-400 text-sm font-semibold">Cargando...</p>
      </main>
    );
  }

  return (
    <main data-theme-page className="relative min-h-screen w-full bg-[#14110f] text-[#f4efe6] font-['Outfit',sans-serif] overflow-x-hidden flex flex-col justify-between selection:bg-[#F0822D] selection:text-white">
      <AnimatedKitchenBackground />

      <header className="relative z-10 w-full pt-10 pb-6 px-6 flex flex-col items-center justify-center text-center">
        <Link href="/" className="cursor-pointer group transition-transform hover:scale-105">
          <BrandLogo size="lg" showTagline={true} taglineColor="text-stone-200 drop-shadow-md" />
        </Link>
      </header>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-black/75 backdrop-blur-xl border-2 border-[#8B5E34]/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60 space-y-8 my-6">
          <AccountNav user={user} current="perfil" />

          {/* Banner de Insignia Oficial: Vecino Fiel (HU-21) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#291b12] via-[#20150d] to-[#291b12] border border-[#a86538]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-500/60 bg-amber-950/60 text-amber-300 shadow-inner">
                <Heart className="h-6 w-6 text-[#c05621] fill-[#c05621]/40" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Insignia Oficial · HU-21</span>
                  {user.badges?.includes("Vecino Fiel") && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      🌟 Activo en Perfil
                    </span>
                  )}
                </div>
                <h4 className="font-['Caveat',cursive] text-2xl font-bold text-amber-100 leading-tight">
                  Pasaporte de Vecino Fiel
                </h4>
                <p className="text-xs text-stone-300">
                  {user.badges?.includes("Vecino Fiel")
                    ? "¡Tu perfil luce la insignia oficial por tu racha activa de consumo local!"
                    : "Completa 3 pedidos este mes con una misma cocinera para ganar la insignia oficial."}
                </p>
              </div>
            </div>
            <Link
              href="/vecino-fiel"
              className="shrink-0 bg-[#c05621] hover:bg-[#d9672e] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Ver mi Expediente</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-left border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="min-w-0 font-['Caveat',cursive] text-2xl font-bold text-[#F4C430] flex items-center gap-2">
                <UserCheck className="h-5 w-5 shrink-0 text-[#F0822D]" />
                Perfil & Datos Comerciales
              </h4>
              {profileSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Perfil Actualizado
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Nombre Comercial</label>
              <input
                type="text"
                value={commercialName}
                onChange={(e) => setCommercialName(e.target.value)}
                placeholder="ej: Cocina de Doña Elena"
                className="w-full bg-[#FBF3E7] border border-[#D9B68C] rounded-xl px-4 py-2.5 text-sm text-[#4A3222] placeholder-[#A88B6F] focus:border-[#F0822D] focus:ring-2 focus:ring-[#F0822D]/30 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">Presentación / Biografía</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-[#FBF3E7] border border-[#D9B68C] rounded-xl px-4 py-2.5 text-sm text-[#4A3222] placeholder-[#A88B6F] focus:border-[#F0822D] focus:ring-2 focus:ring-[#F0822D]/30 outline-none transition-all shadow-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#F0822D]" /> Conjunto Residencial / Barrio
              </label>
              <input
                type="text"
                value={residentialComplex}
                onChange={(e) => setResidentialComplex(e.target.value)}
                className="w-full bg-[#FBF3E7] border border-[#D9B68C] rounded-xl px-4 py-2.5 text-sm text-[#4A3222] placeholder-[#A88B6F] focus:border-[#F0822D] focus:ring-2 focus:ring-[#F0822D]/30 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#F0822D]" /> Teléfono (Modificar activa OTP)
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                maxLength={10}
                className="w-full bg-[#FBF3E7] border border-[#D9B68C] rounded-xl px-4 py-2.5 text-sm text-[#4A3222] placeholder-[#A88B6F] focus:border-[#F0822D] focus:ring-2 focus:ring-[#F0822D]/30 outline-none transition-all shadow-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#F0822D]" /> Medios de Pago
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {["Efectivo", "Nequi", "Llaves"].map((method) => {
                  const isSelected = selectedPaymentMethods.includes(method);
                  const imageSrc = method === "Nequi" ? "/images/nequi.jpg" : method === "Llaves" ? "/images/llaves.png" : "/images/efectivo.png";
                  return (
                    <button
                      type="button"
                      key={method}
                      aria-pressed={isSelected}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPaymentMethods(selectedPaymentMethods.filter((m) => m !== method));
                        } else {
                          setSelectedPaymentMethods([...selectedPaymentMethods, method]);
                        }
                      }}
                      className={`flex min-h-[72px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#F0822D]/15 border-[#F0822D] text-[#fff0d2] shadow-[0_0_0_1px_rgba(240,130,45,.15)]"
                          : "bg-black/30 border-white/20 text-stone-300 hover:border-[#F0822D]/70 hover:bg-black/45"
                      }`}
                    >
                      <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1 ${method === "Llaves" ? "bg-[#32005f]" : "bg-white"}`}>
                        <Image src={imageSrc} alt={`${method} como medio de pago`} fill sizes="44px" className="object-contain p-1" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">{method === "Nequi" ? "Nequi" : method}</span>
                        <span className={`mt-0.5 block text-[10px] font-medium ${isSelected ? "text-[#f3dfbf]" : "text-stone-400"}`}>{method === "Llaves" ? "Bre-B · transferencia" : method === "Nequi" ? "Transferencia digital" : "Pago al recoger"}</span>
                      </span>
                      <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${isSelected ? "border-[#f0822d] bg-[#f0822d] text-white" : "border-white/35 text-transparent"}`}>✓</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Guardar Perfil
            </button>
          </form>
        </div>
      </div>

      <footer className="relative z-10 w-full px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4 text-[#F0822D]" />
          <span>Volver a OllaCercana</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-6 text-xs font-bold tracking-widest uppercase text-stone-300">
          <Link
            href="/ayuda"
            className="hover:text-white flex items-center gap-2 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>Ayuda</span>
          </Link>

          <span className="text-[11px] text-stone-500 font-mono tracking-normal">v2.4</span>
        </div>
      </footer>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#1A1C1E] border border-[#F0822D]/40 rounded-3xl p-6 shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#F0822D]/20 border border-[#F0822D]/40 flex items-center justify-center text-[#F0822D] mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Verificación OTP Celular</h4>
              <p className="text-xs text-stone-400 mt-1">
                Código de 6 dígitos enviado al <span className="text-[#F0822D] font-mono">{editPhone}</span>
              </p>
            </div>

            {otpError && (
              <div className="w-full p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                {otpError}
              </div>
            )}

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updated = [...otpDigits];
                    updated[idx] = val;
                    setOtpDigits(updated);
                    if (val && idx < 5) {
                      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  className="h-11 w-9 text-center text-lg font-bold bg-[#FBF3E7] border border-[#D9B68C] rounded-xl focus:border-[#F0822D] focus:ring-2 focus:ring-[#F0822D]/30 text-[#4A3222] outline-none shadow-sm sm:h-12 sm:w-10"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono text-amber-400">Expira en: {formatTimer(otpTimer)}</span>
              <button
                type="button"
                onClick={() => {
                  setOtpTimer(300);
                  setOtpError("");
                  setOtpDigits(["", "", "", "", "", ""]);
                  alert("Nuevo código enviado.");
                }}
                className="text-[#F0822D] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reenviar
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-stone-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 py-2.5 rounded-xl bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs"
              >
                Validar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
