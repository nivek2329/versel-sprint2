"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCommunityPortrait } from "@/lib/community-portraits";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { LogOut, UserCheck, ShoppingBag, ChefHat, Bell, ShieldCheck, UtensilsCrossed, Settings, Menu, X, ChevronRight } from "lucide-react";

// Barra de navegación compartida por las páginas de /cuenta (perfil, pedidos,
// avisos, cocina, admin). Las conversaciones se abren desde cada pedido:
// ahora cada sección es su propia página, y esta barra solo muestra los
// accesos que le corresponden al rol de la persona logueada.
// Navegación compartida con una paleta de papel y tinta del Libretón.

type NavKey = "perfil" | "reservas" | "avisos" | "cocina" | "admin";

interface AccountNavUser {
  name: string;
  email: string;
  role: "comprador" | "cocinera" | "admin";
  avatar?: string;
}

interface AccountNavProps {
  user: AccountNavUser;
  current: NavKey;
  unreadCount?: number;
}

interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  icon: ReactNode;
  activeClass: string;
}

export default function AccountNav({ user, current, unreadCount = 0 }: AccountNavProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("ollacercana_user");
    router.push("/cuenta");
  };

  const items: NavItem[] = [
    {
      key: "perfil",
      href: "/cuenta/perfil",
      label: "Perfil",
      icon: <UserCheck className="w-4 h-4" />,
      activeClass: "bg-[#c84b31] text-white shadow-md",
    },
  ];

  if (user.role === "comprador") {
    items.push(
      {
        key: "reservas",
        href: "/cuenta/reservas",
        label: "Mis Pedidos",
        icon: <ShoppingBag className="w-4 h-4" />,
        activeClass: "bg-[#526f42] text-white shadow-md",
      },
      {
        key: "avisos",
        href: "/cuenta/avisos",
        label: "Avisos",
        icon: <Bell className="w-4 h-4" />,
        activeClass: "bg-[#80694d] text-white shadow-md",
      }
    );
  } else if (user.role === "cocinera") {
    items.push(
      {
        key: "cocina",
        href: "/cuenta/cocina",
        label: "Modo Cocinera",
        icon: <ChefHat className="w-4 h-4" />,
        activeClass: "bg-[#526f42] text-white shadow-md",
      },
      {
        key: "avisos",
        href: "/cuenta/avisos",
        label: "Avisos",
        icon: <Bell className="w-4 h-4" />,
        activeClass: "bg-[#80694d] text-white shadow-md",
      }
    );
  } else if (user.role === "admin") {
    items.push(
      {
        key: "admin",
        href: "/cuenta/admin",
        label: "Admin",
        icon: <ShieldCheck className="w-4 h-4" />,
        activeClass: "bg-[#526f42] text-white shadow-md",
      },
      {
        key: "avisos",
        href: "/cuenta/avisos",
        label: "Avisos",
        icon: <Bell className="w-4 h-4" />,
        activeClass: "bg-[#80694d] text-white shadow-md",
      }
    );
  }

  const currentItem = items.find((item) => item.key === current);

  return (
    <>
      <div className="relative flex min-h-14 items-center justify-between rounded-2xl border-[3px] border-[#57351f] bg-[linear-gradient(115deg,#9a6032,#75431f_45%,#a66b38)] px-3 py-2 shadow-[0_5px_0_rgba(30,20,14,.28),inset_0_1px_0_rgba(255,224,174,.4)] sm:px-4">
        <button type="button" onClick={() => setMenuOpen(true)} aria-haspopup="dialog" aria-expanded={menuOpen} aria-label="Abrir navegación de cuenta" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5c18c]/60 bg-[#f3e6cb] text-[#493323] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d18c]">
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="pointer-events-none min-w-0 flex-1 truncate px-1 text-center font-['Caveat',cursive] text-lg font-bold text-[#fff0d2] min-[380px]:text-xl sm:text-3xl">{currentItem?.label ?? "Mi cuenta"}</h2>
        <div className="ml-auto hidden h-10 w-10 shrink-0 overflow-hidden rounded-full min-[380px]:block border-2 border-[#e5c18c] bg-[#f3e6cb] shadow-inner" aria-label={`Sesión de ${user.name}`} title={user.name}>
          <Image src={user.avatar || getCommunityPortrait(user.email)} alt={`Foto de ${user.name}`} width={40} height={40} className="h-full w-full object-cover" />
        </div>
      </div>

      {mounted && menuOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex" role="presentation">
          <button type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-[#17130f]/65 backdrop-blur-[2px]" />
          <aside role="dialog" aria-modal="true" aria-labelledby="account-menu-title" className="relative flex h-full w-[min(86vw,340px)] flex-col border-r-[7px] border-[#57351f] bg-[#f3e6cb] text-[#34251a] shadow-[18px_0_45px_rgba(0,0,0,.35)]">
            <div className="flex items-center justify-between border-b-2 border-[#c7a779] bg-[linear-gradient(115deg,#9a6032,#75431f_45%,#a66b38)] px-5 py-5 text-[#fff0d2]">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#e5c18c] bg-[#f3e6cb]"><Image src={user.avatar || getCommunityPortrait(user.email)} alt={`Foto de ${user.name}`} width={44} height={44} className="h-full w-full object-cover" /></span>
                <div className="min-w-0">
                  <h2 id="account-menu-title" className="truncate font-['Caveat',cursive] text-2xl font-bold">{user.name}</h2>
                  <p className="truncate text-xs text-[#f3dfbf]">{user.role === "comprador" ? "Comprador" : user.role === "cocinera" ? "Cocinera" : "Administración"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="rounded-lg p-2 text-[#fff0d2] transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X className="h-5 w-5" /></button>
            </div>

            <nav aria-label="Navegación de cuenta" className="flex-1 space-y-2 overflow-y-auto p-4">
              {items.map((item) => (
                <Link key={item.key} href={item.href} onClick={() => setMenuOpen(false)} aria-current={current === item.key ? "page" : undefined} className={`relative flex min-h-12 items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-bold transition ${current === item.key ? "border-[#687a49] bg-[#dce4ce] text-[#354725] shadow-sm" : "border-transparent text-[#5b4936] hover:border-[#d2bb96] hover:bg-white/70"}`}>
                  {item.icon}<span>{item.label}</span>
                  {item.key === "avisos" && unreadCount > 0 && <span className="ml-auto min-w-5 rounded-full bg-[#bd482b] px-1.5 py-0.5 text-center text-[10px] text-white">{unreadCount}</span>}
                  {current === item.key && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              ))}
            </nav>

            <div className="space-y-2 border-t-2 border-[#c7a779] bg-[#ead7b5] p-4">
              <Link href="/cuenta/ajustes" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl border border-[#c5a477] bg-[#f7eddb] px-3.5 text-sm font-semibold text-[#493323] transition hover:bg-white"><Settings className="h-4 w-4" /> Ajustes</Link>
              <Link href="/menu" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl border border-[#75865a]/50 bg-[#dce4ce] px-3.5 text-sm font-semibold text-[#42542e] transition hover:bg-[#cdd9b9]"><UtensilsCrossed className="h-4 w-4" /> Ver platos</Link>
              <button type="button" onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-[#6a391f] bg-[#493323] px-3.5 text-sm font-semibold text-[#fff5df] transition hover:bg-[#6d4931]"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
              <p className="truncate px-1 pt-1 text-[11px] text-[#80694d]">{user.email}</p>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
