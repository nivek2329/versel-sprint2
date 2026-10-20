"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AccountNav from "@/components/AccountNav";
import OllaVerdeStamp from "@/components/OllaVerdeStamp";
import ChatModal from "@/components/modals/ChatModal";
import OllaChatMark from "@/components/OllaChatMark";
import { getStoredDishes, getStoredReservations, getStoredNotifications, getStoredReviews, saveReviews, saveReservations, sharesResidentialComplex, syncOllaVerdeProgressAfterCompletion, syncVecinoFielAfterCompletion, hasPendingChatMessage, Review } from "@/lib/ollacercana-store";
import {
  Clock,
  CheckCircle2,
  Star,
  PlusCircle,
  RotateCcw,
  MessageSquare,
  ShoppingBag,
  HelpCircle,
  Home,
  Upload,
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
  isLoggedIn: boolean;
  avatar?: string;
  kitchenPhoto?: string;
  isCocineraActive?: boolean;
  dataConsentAccepted?: boolean;
  isPaused?: boolean;
}

interface Reservation {
  id: string;
  dish: string;
  quantity: number;
  buyerName: string;
  buyerPhone: string;
  paymentMethod: string;
  price: string;
  status: "pending" | "confirmed" | "rejected" | "closed";
  rejectionReason?: string;
  rejectionComment?: string;
  expiresAt: number;
  createdTimestamp: number;
  cocineraConfirmedDelivery: boolean;
  cocineraConfirmedPayment: boolean;
  cocineraClosedAt?: number;
  compradorClosedAt?: number;
  isAutoClosed?: boolean;
  rated?: boolean;
  cookName?: string;
  cookResidentialComplex?: string;
  buyerResidentialComplex?: string;
  isSameResidentialComplex?: boolean;
  pickupTime?: string;
  paymentReceipt?: string;
  paymentReceiptName?: string;
  dishImage?: string;
  cookAvatar?: string;
}

const getDefaultReservations = (): Reservation[] => [
  {
    id: "RES-101",
    dish: "Guiso Tradicional en Cazuela",
    dishImage: "/images/menu_cazuela.jpg",
    cookName: "Doña Elena",
    quantity: 2,
    buyerName: "Carlos Rodríguez",
    buyerPhone: "3104567890",
    paymentMethod: "Nequi",
    price: "$34.000",
    status: "pending",
    expiresAt: Date.now() + 10 * 60 * 1000 - 15000,
    createdTimestamp: Date.now() - 15000,
    cocineraConfirmedDelivery: false,
    cocineraConfirmedPayment: false,
  },
  {
    id: "RES-102",
    dish: "Empanadas Artesanales",
    cookName: "Doña Rosa",
    quantity: 4,
    buyerName: "María Fernanda Gómez",
    buyerPhone: "3159876543",
    paymentMethod: "Efectivo",
    price: "$24.000",
    status: "confirmed",
    expiresAt: Date.now() + 600000,
    createdTimestamp: Date.now() - 3600000,
    cocineraConfirmedDelivery: false,
    cocineraConfirmedPayment: false,
  },
];

export default function ReservasPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [compradorSubTab, setCompradorSubTab] = useState<"activas" | "historial">("activas");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeChatReservationId, setActiveChatReservationId] = useState<string | null>(null);
  const [ratingResId, setRatingResId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [receiptBusyId, setReceiptBusyId] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState<{ reservationId: string; message: string } | null>(null);

  useEffect(() => {
    const savedUserJson = localStorage.getItem("ollacercana_user");
    if (!savedUserJson) {
      router.replace("/cuenta/sesion-expirada");
      return;
    }
    let parsed: UserProfile;
    try {
      parsed = JSON.parse(savedUserJson);
      if (!parsed.isLoggedIn) {
        router.replace("/cuenta/sesion-expirada");
        return;
      }
    } catch (e) {
      console.error(e);
      router.replace("/cuenta/sesion-expirada");
      return;
    }

    if (parsed.role !== "comprador") {
      router.replace("/cuenta/acceso-denegado");
      return;
    }

    setUser(parsed);

    const savedResJson = localStorage.getItem("ollacercana_reservations");
    let loadedRes: Reservation[] = [];
    if (savedResJson) {
      try {
        loadedRes = JSON.parse(savedResJson);
      } catch (e) {
        loadedRes = getDefaultReservations();
      }
    } else {
      loadedRes = getDefaultReservations();
    }

    try {
      const storeV2 = getStoredReservations();
      const storedDishes = getStoredDishes();
      storeV2.forEach((sr) => {
        if (!loadedRes.some((r) => r.id === sr.id)) {
          const cookResidentialComplex = sr.cookResidentialComplex || storedDishes.find((dish) => dish.id === sr.dishId)?.residentialComplex || "";
          loadedRes.unshift({
            id: sr.id,
            dish: sr.dishName,
            dishImage: sr.dishImage,
            cookName: sr.cookName || "Doña Rosa",
            quantity: sr.portions,
            buyerName: sr.buyerName,
            buyerPhone: "3001234567",
            paymentMethod: sr.preferredPaymentMethod,
            cookResidentialComplex,
            buyerResidentialComplex: sr.buyerResidentialComplex || parsed.residentialComplex,
            isSameResidentialComplex: sr.isSameResidentialComplex ?? sharesResidentialComplex(parsed.residentialComplex, cookResidentialComplex),
            paymentReceipt: sr.paymentReceipt,
            paymentReceiptName: sr.paymentReceiptName,
            price: `$${sr.totalPrice.toLocaleString("es-CO")}`,
            status:
              sr.status === "PENDIENTE"
                ? "pending"
                : sr.status === "CONFIRMADO"
                ? "confirmed"
                : sr.status === "RECHAZADA"
                ? "rejected"
                : "closed",
            expiresAt: new Date(sr.expiresAt).getTime(),
            createdTimestamp: new Date(sr.createdAt).getTime(),
            cocineraConfirmedDelivery: !!sr.cookConfirmedDelivery,
            cocineraConfirmedPayment: !!sr.cookConfirmedPayment,
            pickupTime: sr.pickupTime,
          });
        }
      });
    } catch (e) {
      console.error(e);
    }

    // Sembrar las reservas de demostración en el store real (ollacercana_reservations_v2)
    // para que el chat (que solo lee de ese store) las pueda encontrar y abrir.
    try {
      const storeNow = getStoredReservations();
      const demoSeeds = [
        {
          id: "RES-101",
          dishId: "RES-101",
          dishName: "Guiso Tradicional en Cazuela",
          dishImage: "",
          cookId: "dona-elena",
          cookName: "Doña Elena",
          buyerName: "Carlos Rodríguez",
          buyerEmail: "carlos.rodriguez@ollacercana.com",
          portions: 2,
          pricePerPortion: 17000,
          totalPrice: 34000,
          preferredPaymentMethod: "Nequi" as const,
          pickupTime: "15-20 min",
          status: "PENDIENTE" as const,
          createdAt: new Date(Date.now() - 15000).toISOString(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000 - 15000).toISOString(),
        },
        {
          id: "RES-102",
          dishId: "RES-102",
          dishName: "Empanadas Artesanales",
          dishImage: "",
          cookId: "dona-rosa",
          cookName: "Doña Rosa",
          buyerName: "María Fernanda Gómez",
          buyerEmail: "maria.fernanda.gomez@ollacercana.com",
          portions: 4,
          pricePerPortion: 6000,
          totalPrice: 24000,
          preferredPaymentMethod: "Efectivo" as const,
          pickupTime: "15-20 min",
          status: "CONFIRMADO" as const,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          expiresAt: new Date(Date.now() + 600000).toISOString(),
        },
      ];
      const missingSeeds = demoSeeds.filter((d) => !storeNow.some((r) => r.id === d.id));
      if (missingSeeds.length > 0) {
        saveReservations([...storeNow, ...missingSeeds]);
      }
    } catch (e) {
      console.error(e);
    }

    const catalogueDishes = getStoredDishes();
    const enrichedReservations = loadedRes.map((reservation) => {
      const relatedDish = catalogueDishes.find((dish) =>
        dish.name.toLocaleLowerCase("es") === reservation.dish.toLocaleLowerCase("es")
      );
      return {
        ...reservation,
        dishImage: reservation.dishImage || relatedDish?.image || "",
        cookAvatar: reservation.cookAvatar || relatedDish?.cookAvatar || "",
      };
    });
    setReservations(enrichedReservations);

    try {
      setUnreadCount(getStoredNotifications().filter((n) => (n.targetEmail === parsed.email || n.targetEmail === "usuario") && !n.read).length);
    } catch (e) {
      console.error(e);
    }

    setCheckingSession(false);
  }, [router]);

  // Timer Ticks (24h auto-close)
  useEffect(() => {
    const timer = setInterval(() => {
      setReservations((prev) => {
        let changed = false;
        const updated = prev.map((res) => {
          if (res.status === "confirmed" && (res.cocineraConfirmedDelivery || res.compradorClosedAt)) {
            const ageHours = (Date.now() - res.createdTimestamp) / (1000 * 3600);
            if (ageHours >= 24 && !res.isAutoClosed) {
              changed = true;
              return { ...res, status: "closed" as const, isAutoClosed: true };
            }
          }
          return res;
        });
        if (changed) {
          localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getRemainingTime = (expiresAt: number) => {
    const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSimulateCompradorConfirm = (resId: string) => {
    const selectedReservation = reservations.find((reservation) => reservation.id === resId);
    if (selectedReservation && selectedReservation.paymentMethod !== "Efectivo" && !selectedReservation.paymentReceipt) return;
    const updated = reservations.map((r) => {
      if (r.id === resId) {
        const compradorTimestamp = Date.now();
        return {
          ...r,
          compradorClosedAt: compradorTimestamp,
          status: "closed" as const,
        };
      }
      return r;
    });
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
    const completedAt = new Date().toISOString();
    const savedReservations = getStoredReservations().map((reservation) => reservation.id === resId ? {
      ...reservation,
      status: "COMPLETADA" as const,
      completedAt,
      buyerConfirmedDelivery: true,
    } : reservation);
    saveReservations(savedReservations);
    const completedReservation = savedReservations.find((reservation) => reservation.id === resId);
    if (completedReservation) {
      syncOllaVerdeProgressAfterCompletion(completedReservation);
      syncVecinoFielAfterCompletion(completedReservation);
    }
    setRatingStars(0);
    setRatingComment("");
    setRatingError("");
    setRatingSubmitted(false);
    setRatingResId(resId);
  };

  const handlePaymentReceiptUpload = async (resId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setReceiptError(null);
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setReceiptError({ reservationId: resId, message: "Adjunta una imagen o un archivo PDF." });
      event.target.value = "";
      return;
    }

    let receiptData: string;
    if (file.type === "application/pdf") {
      if (file.size > 350 * 1024) {
        setReceiptError({ reservationId: resId, message: "El PDF debe pesar menos de 350 KB." });
        event.target.value = "";
        return;
      }
      receiptData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("No se pudo leer el PDF."));
        reader.onerror = () => reject(new Error("No se pudo leer el comprobante. Intenta de nuevo."));
        reader.readAsDataURL(file);
      }).catch((reason: unknown) => {
        setReceiptError({ reservationId: resId, message: reason instanceof Error ? reason.message : "No se pudo leer el comprobante." });
        return "";
      });
      if (!receiptData) return;
    } else {
      if (file.size > 8 * 1024 * 1024) {
        setReceiptError({ reservationId: resId, message: "La imagen original debe pesar menos de 8 MB." });
        event.target.value = "";
        return;
      }
      try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        receiptData = canvas.toDataURL("image/jpeg", 0.62);
        if (Math.ceil((receiptData.length * 3) / 4) > 350 * 1024) {
          setReceiptError({ reservationId: resId, message: "La imagen sigue siendo pesada después de comprimirla. Adjunta una captura más pequeña." });
          event.target.value = "";
          return;
        }
      } catch {
        setReceiptError({ reservationId: resId, message: "No pude leer esa imagen. Prueba con otra captura." });
        event.target.value = "";
        return;
      }
    }

    setReceiptBusyId(resId);
    const updated = reservations.map((reservation) => reservation.id === resId
      ? { ...reservation, paymentReceipt: receiptData, paymentReceiptName: file.name }
      : reservation);
    try {
      const storedV2 = getStoredReservations().map((reservation) => reservation.id === resId
        ? { ...reservation, paymentReceipt: receiptData, paymentReceiptName: file.name }
        : reservation);
      saveReservations(storedV2);
      localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
      setReservations(updated);
      setReceiptError(null);
    } catch {
      setReceiptError({ reservationId: resId, message: "No se pudo guardar el comprobante. Intenta con un archivo más liviano." });
    } finally {
      setReceiptBusyId(null);
      event.target.value = "";
    }
  };

  const handleRatingSubmit = () => {
    if (!ratingResId) return;
    if (ratingStars < 1) {
      setRatingError("Debe seleccionar al menos una estrella");
      return;
    }
    if (!ratingComment.trim()) {
      setRatingError("Por favor escribir un comentario");
      return;
    }
    const reservation = getStoredReservations().find((item) => item.id === ratingResId);
    const reviews = getStoredReviews();
    if (reservation && !reviews.some((review) => review.reservationId === reservation.id)) {
      const review: Review = {
        id: `review-${Date.now()}`,
        cookId: reservation.cookId,
        reservationId: reservation.id,
        buyerName: user?.name || "Vecino",
        rating: ratingStars,
        comment: ratingComment.trim(),
        createdAt: new Date().toLocaleDateString("es-CO"),
        status: "Pendiente",
      };
      saveReviews([review, ...reviews]);
    }
    const updated = reservations.map((r) => (r.id === ratingResId ? { ...r, rated: true } : r));
    setReservations(updated);
    localStorage.setItem("ollacercana_reservations", JSON.stringify(updated));
    setRatingSubmitted(true);
    setRatingError("");
  };

  const activeReservations = reservations.filter((reservation) => reservation.status === "pending" || reservation.status === "confirmed");
  const historyReservations = reservations.filter((reservation) => reservation.status === "closed" || reservation.status === "rejected");
  const visibleReservations = reservations.filter((reservation) => compradorSubTab === "activas"
    ? reservation.status === "pending" || reservation.status === "confirmed"
    : reservation.status === "closed" || reservation.status === "rejected");
  const completedTotal = reservations
    .filter((reservation) => reservation.status === "closed")
    .reduce((sum, reservation) => sum + Number(reservation.price.replace(/[^0-9]/g, "")), 0);
  const activeTotal = activeReservations
    .reduce((sum, reservation) => sum + Number(reservation.price.replace(/[^0-9]/g, "")), 0);
  const formatCurrency = (amount: number) => `$${amount.toLocaleString("es-CO")}`;

  if (checkingSession || !user) {
    return (
      <main data-theme-page className="relative min-h-screen w-full bg-[#14110f] flex items-center justify-center">
        <p className="text-stone-400 text-sm font-semibold">Cargando...</p>
      </main>
    );
  }

  return (
    <main data-theme-page className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-[#25271f] font-['Outfit',sans-serif] text-[#f4efe6] selection:bg-[#F0822D] selection:text-white">
      <header className="relative z-10 flex h-14 w-full items-center justify-start px-4 sm:px-7">
        <Link href="/" aria-label="OllaCercana, ir al inicio" className="group inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0822D]">
          <img src="/brand/ollacercana-icon.svg" alt="OllaCercana" className="h-10 w-10 object-contain drop-shadow-md" />
        </Link>
      </header>

      <div className="relative z-10 w-full flex-1 px-0">
        <div className="relative mx-auto min-h-[calc(100dvh-180px)] w-full overflow-hidden rounded-[30px] border-[10px] border-[#55331e] bg-[#414231] shadow-[0_24px_70px_rgba(0,0,0,.55),inset_0_0_0_2px_rgba(224,185,123,.35)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(4deg, transparent 0 28px, rgba(232,190,129,.14) 29px, transparent 31px), linear-gradient(100deg, rgba(255,255,255,.08), transparent 28%, rgba(0,0,0,.22) 74%, transparent)" }} />
          <div className="relative px-4 py-5 sm:px-7 sm:py-6">
          <AccountNav user={user} current="reservas" unreadCount={unreadCount} />

          <div className="mt-7 grid items-start gap-6 text-left xl:grid-cols-[minmax(0,1fr)_290px]">
          <section className="min-w-0 space-y-6">
            <h1 className="sr-only">Mis pedidos</h1>

            {/* Sub-tabs: Reservas Activas vs Historial de Reservas */}
            <div className="flex flex-wrap items-center gap-3 rounded-[18px] border-[4px] border-[#57351f] bg-[linear-gradient(115deg,#80502d,#59371f_50%,#80502d)] p-2.5 shadow-[0_6px_0_rgba(30,20,14,.3),inset_0_1px_0_rgba(255,224,174,.35)]">
              <button
                onClick={() => setCompradorSubTab("activas")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  compradorSubTab === "activas"
                    ? "bg-[#66704d] text-white shadow"
                    : "border border-[#d7c09c] bg-[#f3e6cb] text-[#493323] hover:bg-white"
                }`}
              >
                Reservas Activas ({reservations.filter((r) => r.status === "pending" || r.status === "confirmed").length})
              </button>
              <button
                onClick={() => setCompradorSubTab("historial")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  compradorSubTab === "historial"
                    ? "bg-[#a8432a] text-white shadow"
                    : "border border-[#d7c09c] bg-[#f3e6cb] text-[#493323] hover:bg-white"
                }`}
              >
                Historial y Volver a Pedir ({reservations.filter((r) => r.status === "closed" || r.status === "rejected").length})
              </button>
            </div>

            {visibleReservations.length === 0 ? (
              <div className="space-y-4 rounded-2xl border-4 border-[#684326] bg-[#e9d5ae] p-10 text-center text-[#38281b] shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#bd9360] bg-[#f7edda] text-[#96512c] shadow-inner">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-lg font-bold">{compradorSubTab === "activas" ? "No tienes pedidos activos" : "Tu historial está vacío"}</h5>
                  <p className="mx-auto max-w-sm text-sm text-[#725b42]">
                    Explora El Libretón de platos caseros preparados hoy por tus vecinas.
                  </p>
                </div>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#6a391f] bg-[#a8432a] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#8e3522]"
                >
                  <span>Ir a El Libretón</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleReservations
                  .map((res) => (
                    <div
                      key={res.id}
                      className="group relative rounded-[20px] border-[5px] border-[#57351f] bg-[linear-gradient(135deg,#9a6032,#73431f_36%,#a66b38_66%,#69401f)] p-2 shadow-[0_8px_0_rgba(30,20,14,.35),inset_0_1px_0_rgba(255,224,174,.45)] transition-transform hover:-translate-y-0.5"
                    >
                      <span aria-hidden="true" className="absolute -left-2 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[#4a2b1b] bg-[#b78a5a] shadow-inner" />
                      <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[#4a2b1b] bg-[#b78a5a] shadow-inner" />
                      <div className="space-y-4 rounded-[12px] border border-[#d4b07d]/70 bg-[#f3e6cb] p-4 pt-5 text-[#34251a] sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dashed border-[#ae9066] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#F0822D] font-bold">{res.id}</span>
                            <span className="text-xs text-[#80694d]">
                              · Cocina de <strong className="text-[#52663d]">{res.cookName || "Doña Elena"}</strong>
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="relative h-[68px] w-[82px] shrink-0 overflow-hidden rounded-xl border border-[#d7c09c] bg-[#efe0c2]">
                              {res.dishImage ? <Image src={res.dishImage} alt={res.dish} fill sizes="82px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-[#9a7149]"><ShoppingBag className="h-7 w-7" /></div>}
                            </div>
                            <div>
                              <h5 className="text-lg font-bold text-[#2b2117]">{res.dish}</h5>
                              <p className="mt-0.5 text-xs text-[#80694d]">Preparado por {res.cookName || "Doña Elena"}</p>
                            </div>
                          </div>
                          {res.isSameResidentialComplex && <span title={`Tú y ${res.cookName || "la cocinera"} pertenecen a ${res.cookResidentialComplex || res.buyerResidentialComplex}`} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#687a49] bg-[#edf0dc] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#43552e]"><Home className="h-3.5 w-3.5" /> Mismo conjunto</span>}
                          <div className="mt-2"><OllaVerdeStamp residentialComplex={res.cookResidentialComplex} compact /></div>
                        </div>

                        <div className="flex items-center gap-2">
                          {res.status === "pending" && (
                            <span className="px-3 py-1 rounded-full bg-[#fff0cf] border border-[#d6a248] text-[#70430c] text-xs font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Quedan: {getRemainingTime(res.expiresAt)}
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              res.status === "pending"
                                ? "bg-[#fff0cf] text-[#70430c] border border-[#d6a248]"
                                : res.status === "confirmed"
                                ? "bg-[#e4efd8] text-[#304522] border border-[#82996b]"
                                : res.status === "closed"
                                ? "bg-[#e3e8eb] text-[#394b55] border border-[#82919a]"
                                : "bg-[#f5ded7] text-[#763725] border border-[#ad6c59]"
                            }`}
                          >
                            {res.status === "pending"
                              ? "En Espera"
                              : res.status === "confirmed"
                              ? "Confirmado"
                              : res.status === "closed"
                              ? "Completado"
                              : "Rechazado"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#6a5037]">
                        <div>
                          <span className="text-[#80694d] block text-[10px] uppercase">Cantidad</span>
                          <span className="font-semibold text-[#2b2117]">{res.quantity} porción(es)</span>
                        </div>
                        <div>
                          <span className="text-[#80694d] block text-[10px] uppercase">Medio de Pago</span>
                          <span className="font-semibold text-[#70430c]">{res.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-[#80694d] block text-[10px] uppercase">Recogida Est.</span>
                          <span className="font-semibold text-[#2b2117]">{res.pickupTime || "15-20 min"}</span>
                        </div>
                        <div>
                          <span className="text-[#80694d] block text-[10px] uppercase">Total</span>
                          <span className="font-bold text-[#9b3f22]">{res.price}</span>
                        </div>
                      </div>

                      <div aria-label="Proceso del pedido" className="rounded-xl border border-[#c4a77d] bg-[#f7eddb] p-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#80694d]">Así avanza tu pedido</p>
                        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                          {["Solicitud enviada", "Cocinera confirma", res.paymentMethod === "Efectivo" ? "Pago al recoger" : res.paymentReceipt ? "Comprobante enviado" : "Adjunta comprobante", "Preparación y entrega", "Recibido"].map((step, index) => {
                            const activeStep = res.status === "closed" ? 4 : res.status === "confirmed" ? (res.cocineraConfirmedDelivery ? 3 : res.paymentMethod === "Efectivo" ? (res.cocineraConfirmedPayment ? 2 : 1) : res.paymentReceipt ? 2 : 1) : 0;
                            const done = index <= activeStep;
                            const current = !done && ((res.status === "pending" && index === 1) || (res.status === "confirmed" && index === activeStep + 1));
                            return <li key={step} className={`flex items-center gap-1.5 text-[10px] leading-tight ${done ? "text-[#304522]" : current ? "text-[#70430c]" : "text-[#594735]"}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${done ? "border-[#708b59] bg-[#e4efd8] text-[#304522]" : current ? "border-[#d6a248] bg-[#fff0cf] text-[#70430c]" : "border-[#9b8567] bg-[#f5e9d2] text-[#594735]"}`}>{done ? "✓" : index + 1}</span>{step}</li>;
                          })}
                        </ol>
                        {res.paymentReceipt && <a href={res.paymentReceipt} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] font-bold text-[#304522] underline underline-offset-2">Comprobante adjunto: {res.paymentReceiptName || "ver archivo"}</a>}
                      </div>

                      {res.status === "confirmed" && res.paymentMethod !== "Efectivo" && !res.paymentReceipt && (
                        <div className="rounded-xl border border-[#d4a64a] bg-[#fff4dc] p-4 text-[#5b3d1f]">
                          <p className="text-sm font-bold">La cocinera confirmó tu pedido</p>
                          <p className="mt-1 text-xs leading-relaxed">Ahora coordina y realiza el pago por {res.paymentMethod}. Cuando lo hayas hecho, adjunta aquí el comprobante para que la cocinera pueda revisarlo.</p>
                          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#b98a52] bg-white px-4 py-3 text-sm font-bold text-[#493323] shadow-sm transition hover:bg-[#f7eddb]">
                            <Upload className="h-4 w-4 text-[#a84029]" />
                            <span>{receiptBusyId === res.id ? "Guardando comprobante…" : "Adjuntar comprobante"}</span>
                            <input type="file" accept="image/*,application/pdf" className="sr-only" disabled={receiptBusyId === res.id} onChange={(event) => void handlePaymentReceiptUpload(res.id, event)} />
                          </label>
                          {receiptError?.reservationId === res.id && receiptBusyId === null && <p role="alert" className="mt-2 text-xs font-semibold text-red-800">{receiptError.message}</p>}
                        </div>
                      )}
                      {res.status === "confirmed" && res.paymentMethod !== "Efectivo" && res.paymentReceipt && (
                        <p className="rounded-lg border border-[#a8bc93] bg-[#eaf2e3] px-3 py-2 text-xs font-semibold text-[#304522]">Comprobante enviado. La cocinera puede revisarlo antes de continuar.</p>
                      )}

                      {res.status === "rejected" && (
                        <div className="p-3 rounded-xl bg-[#f5ded7] border border-[#ad6c59] text-[#763725] text-xs">
                          <strong>Motivo de rechazo:</strong> {res.rejectionReason || "Sin porciones disponibles"}
                          {res.rejectionComment && <p className="text-[11px] text-[#763725] italic mt-1">"{res.rejectionComment}"</p>}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-dashed border-[#d7c09c]">
                        <button
                          onClick={() => setActiveChatReservationId(res.id)}
                          className="relative px-4 py-2 rounded-xl border border-[#6a391f] bg-[#a8432a] text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#8e3522]"
                        >
                          {user && hasPendingChatMessage(res.id, user) && (
                            <span
                              aria-label="Mensaje pendiente"
                              className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#f7eddb] bg-[#e8542f]"
                            />
                          )}
                          <OllaChatMark className="h-6 w-7" />
                          <span>{res.status === "closed" || res.status === "rejected" ? "Ver conversación" : "Chat con cocinera"}</span>
                        </button>

                        {compradorSubTab === "historial" && (
                          <Link
                            href="/menu"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0822D] to-[#E06F1A] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Volver a Pedir</span>
                          </Link>
                        )}

                        {res.status === "confirmed" && !res.compradorClosedAt && (res.paymentMethod === "Efectivo" || !!res.paymentReceipt) && (
                          <button
                            onClick={() => handleSimulateCompradorConfirm(res.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Marcar pedido recibido y cerrar chat</span>
                          </button>
                        )}
                        {res.status === "confirmed" && !res.compradorClosedAt && res.paymentMethod !== "Efectivo" && !res.paymentReceipt && (
                          <p className="w-full text-right text-[11px] font-semibold text-[#80512b]">Adjunta el comprobante antes de marcar el pedido como recibido.</p>
                        )}
                      </div>

                      {res.status === "confirmed" && res.compradorClosedAt && !res.cocineraClosedAt && (
                          <div className="p-2.5 rounded-lg bg-[#fff1d2] border border-[#dfbd72] text-[#70430c] text-[11px] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Confirmación pendiente por la cocinera.</span>
                        </div>
                      )}

                      {res.status === "closed" && (
                        <div className="p-3 rounded-xl bg-[#eaf2e3] border border-[#a8bc93] flex items-center justify-between text-xs text-[#304522]">
                          <span className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-[#526c3b]" />
                            Transacción completada {res.isAutoClosed ? "(Cierre automático por 24h)" : ""}
                          </span>

                          {!res.rated ? (
                            <button
                              onClick={() => { setRatingStars(0); setRatingComment(""); setRatingError(""); setRatingSubmitted(false); setRatingResId(res.id); }}
                              className="px-4 py-1.5 rounded-lg bg-[#526c3b] hover:bg-[#40572e] text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              Calificar
                            </button>
                          ) : (
                            <span className="text-[#8a6743] font-mono">★ Reseña enviada · pendiente de publicación</span>
                          )}
                        </div>
                      )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <div className="rounded-[22px] border-[5px] border-[#57351f] bg-[linear-gradient(115deg,#9a6032,#75431f_38%,#a66b38_62%,#68401f)] p-2 shadow-[0_8px_0_rgba(30,20,14,.35),inset_0_1px_0_rgba(255,224,174,.45)]">
              <div className="rounded-[13px] border border-[#d4b07d]/70 bg-[#f3e6cb] text-[#34251a]">
              <div className="border-b border-dashed border-[#b99767] bg-[#ead7b5] px-5 py-4">
                <h2 className="font-['Caveat',cursive] text-2xl font-bold text-[#432b1b]">Resumen de pedidos</h2>
                <p className="text-xs text-[#80694d]">Tus compras del vecindario, siempre a mano.</p>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between text-sm"><span className="text-[#725b42]">Pedidos activos</span><strong className="rounded-full bg-[#e8f0df] px-2.5 py-1 text-[#40572e]">{activeReservations.length}</strong></div>
                <div className="flex items-center justify-between text-sm"><span className="text-[#725b42]">En el historial</span><strong className="rounded-full bg-[#f4e4d0] px-2.5 py-1 text-[#80512b]">{historyReservations.length}</strong></div>
                <div className="border-t border-dashed border-[#c9a879] pt-4">
                  <p className="text-xs text-[#80694d]">{compradorSubTab === "activas" ? "Valor de pedidos activos" : "Total de pedidos completados"}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-[#a74427]">{formatCurrency(compradorSubTab === "activas" ? activeTotal : completedTotal)}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#80694d]">El pago se acuerda directamente con cada cocinera. OllaCercana no procesa pagos.</p>
                </div>
                <Link href="/menu" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bd482b] px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-[#a83a21]"><PlusCircle className="h-4 w-4" /> Buscar algo rico</Link>
              </div>
              </div>
            </div>
            <div className="rounded-[22px] border-[5px] border-[#57351f] bg-[linear-gradient(115deg,#80502d,#59371f_50%,#80502d)] p-2 shadow-[0_8px_0_rgba(30,20,14,.3),inset_0_1px_0_rgba(255,224,174,.35)]">
              <div className="rounded-[13px] border border-[#d4b07d]/70 bg-[#f3e6cb] p-5 text-[#34251a]">
              <p className="font-['Caveat',cursive] text-2xl font-bold text-[#493323]">Compra con confianza</p>
              <ul className="mt-4 space-y-3 text-sm text-[#493626]">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#526c3b]" /> Sigue cada paso de tu pedido.</li>
                <li className="flex gap-2"><MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#bd482b]" /> Coordina la entrega dentro de la plataforma.</li>
                <li className="flex gap-2"><Star className="mt-0.5 h-4 w-4 shrink-0 text-[#bd7b24]" /> Califica cuando la compra se complete.</li>
              </ul>
              <Link href="/ayuda" className="mt-4 inline-flex text-sm font-bold text-[#8e3f28] underline underline-offset-4">¿Necesitas ayuda?</Link>
              </div>
            </div>
          </aside>
          </div>
          </div>
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

      {ratingResId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="rating-title" className="max-w-md w-full bg-[#f4e8cf] border-2 border-[#b89a6f] text-[#30251b] rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 id="rating-title" className="font-['Caveat',cursive] text-3xl font-bold">Cuéntanos cómo te fue</h4>
            <p className="text-sm text-[#6a5037]">Tu opinión ayuda a que el barrio elija con confianza. Pedido {ratingResId}.</p>

            {ratingSubmitted ? (
              <div role="status" className="space-y-4">
                <p className="rounded-xl border border-emerald-700/30 bg-emerald-100 p-4 text-center text-sm font-semibold text-emerald-900">Tu reseña se publicará al cumplirse la ventana</p>
                <button onClick={() => setRatingResId(null)} className="w-full rounded-xl bg-[#526f42] py-3 text-sm font-bold text-white">Cerrar</button>
              </div>
            ) : <>
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => { setRatingStars(star); setRatingError(""); }}
                  aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`}
                  aria-pressed={star === ratingStars}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform"
                >
                  <Star className={`w-7 h-7 ${star <= ratingStars ? "fill-amber-400" : "text-stone-700"}`} />
                </button>
              ))}
            </div>

            <label htmlFor="review-comment" className="block text-left text-sm font-semibold">Comentario <span className="font-normal text-[#80694d]">(obligatorio)</span></label>
            <textarea id="review-comment" rows={3} maxLength={400} value={ratingComment} onChange={(event) => { setRatingComment(event.target.value); if (event.target.value.trim()) setRatingError(""); }} placeholder="¿Qué te gustó del sabor, la porción o la atención?" required className="w-full resize-y rounded-xl border border-[#b89a6f] bg-white/75 p-3 text-sm text-[#30251b] placeholder:text-[#9b8668] focus:outline-none focus:ring-2 focus:ring-[#526f42]" />
            {ratingError && <p role="alert" className="text-sm font-semibold text-red-700">{ratingError}</p>}

            <div className="flex gap-3">
              <button onClick={() => setRatingResId(null)} className="flex-1 rounded-xl border border-[#8f795b] py-3 text-sm font-semibold text-[#57452f]">Ahora no</button>
              <button onClick={handleRatingSubmit} className="flex-1 rounded-xl bg-[#526f42] py-3 text-sm font-bold text-white hover:bg-[#415a35]">Enviar reseña</button>
            </div>
            </>}
          </div>
        </div>
      )}

      {user && (
        <ChatModal
          isOpen={!!activeChatReservationId}
          onClose={() => {
            const sharedReservations = getStoredReservations();
            const completedInThisChat = sharedReservations.some((reservation) => reservation.id === activeChatReservationId && reservation.status === "COMPLETADA");
            setReservations((previous) => previous.map((item) => {
              const shared = sharedReservations.find((reservation) => reservation.id === item.id);
              if (item.id === activeChatReservationId && shared?.status === "COMPLETADA") return { ...item, status: "closed" };
              return item;
            }));
            if (completedInThisChat) setCompradorSubTab("historial");
            setActiveChatReservationId(null);
          }}
          reservationId={activeChatReservationId}
          currentUser={user}
          onOpenRatingModal={(resId) => setRatingResId(resId)}
        />
      )}
    </main>
  );
}
