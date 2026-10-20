"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChatMessage,
  getStoredDishes,
  getStoredMessages,
  getStoredReservations,
  Reservation,
  saveMessages,
  saveReservations,
  syncOllaVerdeProgressAfterCompletion,
  syncVecinoFielAfterCompletion,
  UserProfile,
} from "@/lib/ollacercana-store";
import { Clock, Lock, CheckCircle2, X, Send, UserRound } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string | null;
  currentUser: UserProfile;
  onOpenRatingModal?: (reservationId: string, cookId: string) => void;
}

export default function ChatModal({
  isOpen,
  onClose,
  reservationId,
  currentUser,
  onOpenRatingModal,
}: ChatModalProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load reservation & chat history
  useEffect(() => {
    if (!reservationId || !isOpen) return;
    const reservations = getStoredReservations();
    const found = reservations.find((r) => r.id === reservationId);
    if (found) {
      setReservation(found);
      const history = getStoredMessages(found.id);
      if (history.length === 0) {
        // Initial automatic welcome message from cook
        const initialMsgs: ChatMessage[] = [
          {
            id: `msg-init-${Date.now()}`,
            reservationId: found.id,
            sender: found.cookName,
            text: `¡Hola ${found.buyerName}! Gracias por tu reserva de ${found.portions} porción(es) de ${found.dishName}. Tu pedido estará listo para las ${found.pickupTime}.`,
            timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
          },
        ];
        saveMessages(found.id, initialMsgs);
        setMessages(initialMsgs);
        localStorage.setItem(`ollacercana_chat_read_${found.id}_${currentUser.email}`, initialMsgs[initialMsgs.length - 1].id);
      } else {
        setMessages(history);
        const viewerName = currentUser.name || currentUser.commercialName || currentUser.email;
        const lastIncoming = [...history].reverse().find((message) => message.sender !== viewerName && message.sender !== currentUser.commercialName && message.sender !== currentUser.email && message.sender !== "Sistema OllaCercana");
        if (lastIncoming) localStorage.setItem(`ollacercana_chat_read_${found.id}_${currentUser.email}`, history[history.length - 1].id);
      }
    }
  }, [reservationId, isOpen, currentUser.commercialName, currentUser.email, currentUser.name]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Countdown timer for 10-min confirmation (HU-12)
  useEffect(() => {
    if (!reservation || reservation.status !== "PENDIENTE") return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(reservation.expiresAt).getTime();
      const diff = expiry - now;
      if (diff <= 0) {
        setTimeLeftStr("Expirado");
        // Auto expire if 10 mins passed
        const reservations = getStoredReservations();
        const updated = reservations.map((r) =>
          r.id === reservation.id ? { ...r, status: "EXPIRADA" as const } : r
        );
        saveReservations(updated);
        setReservation((prev) => (prev ? { ...prev, status: "EXPIRADA" } : null));
      } else {
        const mins = Math.floor(diff / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftStr(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  if (!isOpen || !reservation) return null;

  const isReadOnly =
    reservation.status === "COMPLETADA" ||
    reservation.status === "RECHAZADA" ||
    reservation.status === "EXPIRADA";
  const matchingDish = getStoredDishes().find((dish) => dish.id === reservation.dishId || dish.name.toLocaleLowerCase("es") === reservation.dishName.toLocaleLowerCase("es"));
  const cookAvatar = reservation.cookAvatar || matchingDish?.cookAvatar || (reservation.cookId === "dona-rosa" ? "/images/dona_rosa_mascot.jpg" : "/images/abuelita_3d_mascot.jpg");

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text || text.trim().length === 0 || isReadOnly) return;

    const senderName = currentUser.name || currentUser.commercialName || currentUser.email || "Usuario";

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      reservationId: reservation.id,
      sender: senderName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveMessages(reservation.id, updated);
    if (!textToSend) setInputMessage("");
  };

  const handleConfirmDelivery = () => {
    const reservations = getStoredReservations();
    const completedAt = new Date().toISOString();
    const updated = reservations.map((r) => {
      if (r.id === reservation.id) {
        return {
          ...r,
          status: "COMPLETADA" as const,
          completedAt,
          buyerConfirmedDelivery: true,
          cookConfirmedDelivery: true,
        };
      }
      return r;
    });
    saveReservations(updated);
    const completedReservation = updated.find((item) => item.id === reservation.id);
    if (completedReservation) {
      syncOllaVerdeProgressAfterCompletion(completedReservation);
      syncVecinoFielAfterCompletion(completedReservation);
    }
    setReservation((prev) => (prev ? { ...prev, status: "COMPLETADA", completedAt } : null));

    // System message in chat
    const sysMsg: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      reservationId: reservation.id,
      sender: "Sistema OllaCercana",
      text: "Entrega confirmada y completada con éxito. ¡Gracias por apoyar la cocina vecinal!",
      timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedMsgs = [...messages, sysMsg];
    setMessages(updatedMsgs);
    saveMessages(reservation.id, updatedMsgs);
    window.setTimeout(onClose, 1200);

    // Open rating modal for buyer (HU-15)
    if (onOpenRatingModal) {
      setTimeout(() => {
        onOpenRatingModal(reservation.id, reservation.cookId);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171912]/75 p-2 backdrop-blur-sm animate-fadeIn sm:p-5">
      <div role="dialog" aria-modal="true" aria-labelledby="reservation-chat-title" className="relative flex h-[min(88dvh,820px)] max-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[22px] border-[9px] border-[#55331e] bg-[linear-gradient(135deg,#9a6032,#73431f_38%,#a66b38_66%,#69401f)] p-1.5 text-[#34251a] shadow-[0_24px_80px_rgba(0,0,0,.55)] sm:rounded-[28px] sm:border-[11px] sm:p-2.5">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[13px] border border-[#d4b07d]/70 bg-[#f3e6cb]">
        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 border-b-[5px] border-[#59351f] bg-[linear-gradient(115deg,#9a6032,#75431f_38%,#a66b38_62%,#68401f)] px-4 py-3 text-[#fff0d2] sm:px-6 sm:py-4">
          <span aria-hidden="true" className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full border border-[#4c2c1a] bg-[#d5b17d] shadow-inner" />
          <span aria-hidden="true" className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-[#4c2c1a] bg-[#d5b17d] shadow-inner" />
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#f1d7ab] bg-[#f3e6cb] shadow-md sm:h-14 sm:w-14">
              {cookAvatar ? <img src={cookAvatar} alt={`Foto de ${reservation.cookName}`} className="h-full w-full object-cover" /> : <UserRound className="m-auto h-7 w-7 text-[#80694d]" />}
            </div>
            <div className="min-w-0">
              <h3 id="reservation-chat-title" className="font-['Caveat',cursive] text-xl font-bold text-[#fff0d2] sm:text-2xl">
                {reservation.cookName}
              </h3>
              <p className="break-words text-xs text-[#f3dfbf]">
                {reservation.dishName} · Pedido #{reservation.id.slice(-4)} · {reservation.portions} porción/es · ${reservation.totalPrice.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar conversación"
            className="shrink-0 rounded-full border border-[#f1d7ab]/35 p-2 text-[#fff0d2] transition-colors hover:bg-[#4e321f]/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reservation Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c8ab7f] bg-[#e7dbc1] px-4 py-3 text-xs sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                reservation.status === "PENDIENTE"
                  ? "bg-amber-500 animate-pulse"
                  : reservation.status === "COMPLETADA"
                  ? "bg-[#526f42]"
                  : "bg-[#a84029]"
              }`}
            />
            <span className="font-semibold text-[#493323]">Estado: {reservation.status === "PENDIENTE" ? "Esperando confirmación" : reservation.status === "CONFIRMADO" ? "Pedido confirmado" : reservation.status === "COMPLETADA" ? "Pedido recibido · chat cerrado" : reservation.status === "RECHAZADA" ? "Solicitud rechazada" : "Solicitud expirada"}</span>
          </div>

          {reservation.status === "PENDIENTE" && timeLeftStr && (
            <span className="flex items-center gap-1 rounded-full border border-[#d4a64a] bg-[#fff0cf] px-2.5 py-0.5 font-mono text-[11px] text-[#70430c]">
              <Clock className="h-3 w-3 text-[#a45d19]" />
              <span>Tiempo: {timeLeftStr}</span>
            </span>
          )}

          {reservation.status === "CONFIRMADO" && currentUser.role === "comprador" && (
            <button
              onClick={handleConfirmDelivery}
              className="flex items-center gap-1 rounded-lg bg-[#526f42] px-3 py-2 text-xs font-semibold text-white shadow transition-all hover:bg-[#40572e]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Marcar como recibido y cerrar chat</span>
            </button>
          )}
          {reservation.status === "PENDIENTE" && <span className="text-[11px] text-[#725b42]">La cocinera debe confirmar antes de preparar el pedido.</span>}
        </div>

        {/* Chat Messages */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(135deg,#e8dfca,#f5ecdb_48%,#e6dcc7)] p-4 sm:p-6">
          {messages.map((msg) => {
            const isMe = msg.sender === (currentUser.name || currentUser.commercialName || currentUser.email);
            const isSys = msg.sender === "Sistema OllaCercana";

            if (isSys) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <span className="inline-block rounded-full border border-[#82996b] bg-[#e4efd8] px-3 py-1 text-xs text-[#40572e]">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="mb-0.5 px-1 text-[10px] font-semibold text-[#80694d]">
                  {msg.sender} • {msg.timestamp}
                </div>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                    isMe
                      ? "rounded-tr-none bg-[#a8432a] font-medium text-white shadow-md"
                      : "rounded-tl-none border border-[#c8ab7f] bg-[#fffaf0] text-[#34251a] shadow-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Read-Only Banner (HU-23) */}
        {isReadOnly ? (
          <div className="flex items-center justify-center gap-1.5 border-t border-[#a8bc93] bg-[#e4efd8] p-3 text-center text-xs font-medium text-[#40572e]">
            <Lock className="h-3.5 w-3.5 text-[#526f42]" />
            <span>Esta conversación ha finalizado y se encuentra en modo solo lectura. (HU-23)</span>
          </div>
        ) : (
          <div className="space-y-2 border-t border-[#c8ab7f] bg-[#f3e6cb] p-3 sm:p-4">
            {/* Quick replies */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {["Ya salí a entregar", "Estoy en la portería", "Confirmo pago recibido", "¡Muchas gracias!"].map((quick) => (
                <button
                  key={quick}
                  onClick={() => handleSendMessage(quick)}
                  className="whitespace-nowrap rounded-full border border-[#75865a]/60 bg-[#dce4ce] px-2.5 py-1 text-[#42542e] transition-all hover:bg-[#cdd9b9] font-medium"
                >
                  {quick}
                </button>
              ))}
            </div>

            {/* Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
                className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="min-w-0 flex-1 rounded-xl border border-[#b89a6f] bg-white px-3.5 py-3 text-sm text-[#30251b] placeholder:text-[#9b8668] focus:outline-none focus:ring-2 focus:ring-[#526f42]"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-[#a8432a] px-4 py-2 text-sm font-bold text-white shadow transition-all hover:bg-[#8e3522]"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
