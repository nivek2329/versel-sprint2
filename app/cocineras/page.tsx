"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AnimatedKitchenBackground from "@/components/AnimatedKitchenBackground";
import { DishItem, getStoredDishes } from "@/lib/ollacercana-store";
import { ArrowLeft, ArrowRight, ChefHat, MapPin, Search, Star, Utensils } from "lucide-react";

interface CookCard {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  complex: string;
  distance: string;
  rating: string;
  reviews: number;
  dishes: DishItem[];
}

export default function CocinerasPage() {
  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDishes(getStoredDishes()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const cooks = useMemo(() => {
    const groups = new Map<string, DishItem[]>();
    for (const dish of dishes) groups.set(dish.cookId, [...(groups.get(dish.cookId) ?? []), dish]);
    return [...groups.entries()].map(([id, items]): CookCard => {
      const first = items[0];
      return {
        id,
        name: first.cook,
        avatar: first.cookAvatar,
        bio: first.description,
        complex: first.residentialComplex,
        distance: first.distance,
        rating: first.rating,
        reviews: first.reviews,
        dishes: items,
      };
    }).filter((cook) => cook.name.toLowerCase().includes(query.toLowerCase()) || cook.complex.toLowerCase().includes(query.toLowerCase()) || cook.dishes.some((dish) => dish.name.toLowerCase().includes(query.toLowerCase())));
  }, [dishes, query]);

  return (
    <main data-theme-page className="relative min-h-screen overflow-x-hidden bg-[#20170f] font-['Outfit',sans-serif] text-[#2b2117]">
      <AnimatedKitchenBackground />
      <header className="relative z-10 border-b border-[#d9c19a] bg-[#f2e4c9]/95 px-4 py-3 shadow-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><Link href="/menu" aria-label="Volver al Libretón"><BrandLogo size="sm" /></Link><Link href="/cocineras-cercanas" className="inline-flex items-center gap-2 rounded-full border border-[#ad8a5e] px-4 py-2 text-sm font-semibold text-[#573c27] hover:bg-[#e8d1a3]"> <MapPin className="h-4 w-4"/> Ver mapa cercano</Link></div>
      </header>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="inline-flex items-center gap-2 rounded-full border border-[#d9c19a] bg-[#f4e8cf]/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#755438]"><ChefHat className="h-4 w-4 text-[#a84029]"/> Cocinas de la comunidad</p><h1 className="mt-3 font-['Caveat',cursive] text-5xl font-extrabold text-[#fff1d5] sm:text-6xl">Conoce a tus vecinas cocineras</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#f4e8cf]/85 sm:text-base">Descubre quién prepara cada plato, qué cocina comparte y en qué conjunto puedes encontrarla.</p></div>
          <label className="relative block w-full md:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#80694d]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, plato o conjunto" className="w-full rounded-full border border-[#c4a77d] bg-[#fff7e9] py-3 pl-10 pr-4 text-sm text-[#493323] placeholder:text-[#80694d] focus:outline-none focus:ring-2 focus:ring-[#c84b31]" /></label>
        </div>
        {cooks.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{cooks.map((cook, index) => (
          <article key={cook.id} className="group relative overflow-hidden rounded-[1.8rem] border-2 border-[#9b774f] bg-[#efe0c2] p-4 shadow-[0_18px_40px_rgba(35,20,10,.38)] transition-transform hover:-translate-y-1 sm:p-5">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#c84b31] via-[#e4aa4d] to-[#526f42]" />
            <div className="flex items-start gap-4 pt-2">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-[#a84029] bg-[#e4d0aa] shadow-md sm:h-24 sm:w-24"><Image src={cook.avatar} alt={cook.name} fill sizes="96px" className="object-cover" /></div>
              <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a84029]">Cocina vecinal</p><h2 className="font-['Caveat',cursive] text-3xl font-bold leading-tight text-[#493323]">{cook.name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-[#6a5037]"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#526f42]"/><span className="truncate">{cook.complex} · {cook.distance}</span></p><p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#79551e]"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-600"/>{cook.rating}<span className="font-normal text-[#80694d]">({cook.reviews} opiniones)</span></p></div>
            </div>
            <p className="mt-4 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-[#493323]">{cook.bio}</p>
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#bda078] pt-3"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52663d]"><Utensils className="h-4 w-4"/>{cook.dishes.length} {cook.dishes.length === 1 ? "plato publicado" : "platos publicados"}</span><Link href={`/cocineras/${cook.id}`} className="inline-flex items-center gap-1 rounded-full bg-[#526f42] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#405b32]">Ver perfil <ArrowRight className="h-3.5 w-3.5"/></Link></div>
            <div className="mt-3 flex gap-2 overflow-hidden">{cook.dishes.slice(0, 3).map((dish) => <div key={dish.id} className="relative h-16 flex-1 overflow-hidden rounded-xl border border-[#bda078] bg-[#e4d0aa]"><Image src={dish.image} alt={dish.name} fill sizes="180px" className="object-cover transition-transform group-hover:scale-105"/><span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">{dish.name}</span></div>)}</div>
          </article>
        ))}</div> : <section className="rounded-3xl border border-[#bda078] bg-[#f4e8cf] p-8 text-center"><p className="font-['Caveat',cursive] text-3xl font-bold">Todavía no encontramos cocineras con ese nombre.</p><button onClick={() => setQuery("")} className="mt-3 rounded-full bg-[#c84b31] px-4 py-2 text-sm font-bold text-white">Mostrar todas</button></section>}
        <Link href="/menu" className="mt-8 inline-flex items-center gap-2 font-semibold text-[#fff1d5] underline decoration-white/40 underline-offset-4"><ArrowLeft className="h-4 w-4"/> Volver al Libretón</Link>
      </div>
    </main>
  );
}
