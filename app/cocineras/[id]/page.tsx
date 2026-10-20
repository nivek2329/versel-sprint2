"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AnimatedKitchenBackground from "@/components/AnimatedKitchenBackground";
import { DishItem, getStoredDishes } from "@/lib/ollacercana-store";
import OllaVerdeStamp from "@/components/OllaVerdeStamp";
import { ArrowLeft, ChefHat, Heart, MapPin, Star, Utensils } from "lucide-react";

export default function CocineraProfilePage() {
  const params = useParams<{ id: string }>();
  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDishes(getStoredDishes().filter((dish) => dish.cookId === params.id));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params.id]);

  const cook = dishes[0];

  return (
    <main data-theme-page className="relative min-h-screen overflow-x-hidden bg-[#30251e] font-['Outfit',sans-serif] text-[#2b2117]" style={{ backgroundImage: "radial-gradient(ellipse at 50% 8%,rgba(218,186,132,.24),transparent 38%),repeating-linear-gradient(92deg,rgba(12,8,6,.22) 0 2px,transparent 2px 58px),linear-gradient(135deg,#423025,#211913 55%,#483327)" }}>
      <AnimatedKitchenBackground />
      <header className="relative z-10 border-b-4 border-[#39261a] bg-[#ead5ac] px-4 py-3 shadow-[0_5px_15px_rgba(0,0,0,.4)] sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><Link href="/cocineras" aria-label="Volver a cocineras"><BrandLogo size="sm"/></Link><Link href="/cocineras" className="inline-flex items-center gap-2 rounded-xl border-2 border-[#725038] bg-[#f5e6c9] px-4 py-2 text-sm font-bold text-[#573c27] shadow-[inset_0_0_0_2px_rgba(255,255,255,.4)] hover:bg-white"><ArrowLeft className="h-4 w-4"/> Todas las cocineras</Link></div></header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-8 sm:pt-10">
        {!ready ? <div className="mx-auto max-w-2xl rounded-2xl border-[5px] border-[#64432d] bg-[#f4e8cf] p-8 text-center shadow-xl">Cargando perfil…</div> : !cook ? (
          <section className="mx-auto max-w-2xl rounded-2xl border-[7px] border-[#64432d] bg-[#f4e8cf] p-8 text-center shadow-[0_20px_45px_rgba(0,0,0,.5)]"><ChefHat className="mx-auto h-10 w-10 text-[#a84029]"/><h1 className="mt-3 font-['Caveat',cursive] text-3xl font-bold">No encontramos este perfil</h1><p className="mt-2 text-sm text-[#6a5037]">Puede que esta cocina ya no tenga platos publicados.</p><Link href="/cocineras" className="mt-5 inline-flex rounded-xl border-2 border-[#725038] bg-[#526f42] px-5 py-2.5 text-sm font-bold text-white">Ver cocineras</Link></section>
        ) : (
          <div className="relative mx-auto max-w-5xl pb-5">
            {/* Cuerdas del letrero colgante */}
            <div aria-hidden="true" className="absolute left-[17%] top-0 z-0 h-14 w-2 border-x border-[#c4a77d] bg-[repeating-linear-gradient(180deg,#e8d5ad_0_4px,#8c6847_4px_6px)] shadow sm:left-[22%] sm:h-20"/>
            <div aria-hidden="true" className="absolute right-[17%] top-0 z-0 h-14 w-2 border-x border-[#c4a77d] bg-[repeating-linear-gradient(180deg,#e8d5ad_0_4px,#8c6847_4px_6px)] shadow sm:right-[22%] sm:h-20"/>

            {/* Letrero superior de madera */}
            <section className="relative z-10 mx-auto w-[94%] rounded-[2rem] border-[7px] border-[#3c261a] px-4 pb-4 pt-5 shadow-[0_12px_25px_rgba(0,0,0,.5),inset_0_0_0_2px_rgba(232,202,153,.35)] sm:w-[82%] sm:px-8" style={{ backgroundImage: "repeating-linear-gradient(2deg,rgba(40,21,12,.18) 0 2px,transparent 2px 9px),linear-gradient(100deg,#754a2e,#a77445 18%,#68432c 52%,#9a6940 82%,#593923)" }}>
              <div className="rounded-[1.35rem] border-[5px] border-[#6a472e] bg-[#f2e4c9] px-4 py-3 text-center shadow-[inset_0_0_0_2px_rgba(255,255,255,.55)] sm:px-8 sm:py-4" style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.7),transparent 60%),repeating-linear-gradient(3deg,rgba(106,71,46,.05) 0 1px,transparent 1px 6px)" }}>
                <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#80694d] sm:text-xs">OllaCercana · Cocina del vecindario</p>
                <h1 className="mt-1 font-['Caveat',cursive] text-4xl font-extrabold leading-none text-[#493323] sm:text-6xl">{cook.cook}</h1>
                <p className="mt-1 font-['Caveat',cursive] text-lg font-bold text-[#526f42] sm:text-2xl">Una cocina de casa, cerca de ti</p>
              </div>
              <div aria-hidden="true" className="absolute -bottom-2 left-1/2 h-3 w-20 -translate-x-1/2 rounded-b-lg border-x-2 border-b-2 border-[#39261a] bg-[#70472d]"/>
            </section>

            {/* Navegación en tablillas de madera */}
            <nav aria-label="Secciones del perfil" className="relative z-10 mx-auto mt-3 grid w-full grid-cols-2 gap-2 rounded-xl border-[6px] border-[#3c261a] p-2 shadow-[0_9px_20px_rgba(0,0,0,.5)] sm:w-[92%] sm:grid-cols-4" style={{ backgroundImage: "repeating-linear-gradient(2deg,rgba(40,21,12,.2) 0 2px,transparent 2px 8px),linear-gradient(100deg,#70452b,#a36d40,#67412b)" }}>
              {[{ label: "Cocineras", href: "/cocineras" }, { label: "Su historia", href: "#historia" }, { label: "Sus platos", href: "#platos" }, { label: "Mapa cercano", href: "/cocineras-cercanas" }].map((item, index) => <a key={item.label} href={item.href} className={`rounded-xl border-2 border-[#3f2b20] px-3 py-2.5 text-center font-['Caveat',cursive] text-xl font-bold text-[#fff2d9] shadow-[inset_0_0_0_2px_rgba(255,255,255,.12),0_3px_5px_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 hover:brightness-110 sm:text-2xl ${index === 0 ? "bg-[#674a3c]" : index === 2 ? "bg-[#69704c]" : "bg-[#86553a]"}`}>{item.label}</a>)}
            </nav>

            {/* Tabla principal con tornillos y papel interior */}
            <article className="relative mx-auto mt-10 w-full border-[8px] border-[#38251a] px-3 pb-4 pt-9 shadow-[0_25px_60px_rgba(0,0,0,.55),inset_0_0_0_2px_rgba(218,179,125,.4)] sm:mt-14 sm:px-7 sm:pb-7 sm:pt-12" style={{ backgroundImage: "repeating-linear-gradient(1deg,rgba(41,22,13,.16) 0 2px,transparent 2px 10px),linear-gradient(100deg,#71472e,#976542 13%,#6f462e 48%,#986542 83%,#62402a)" }}>
              {["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"].map((position) => <span key={position} aria-hidden="true" className={`absolute ${position} z-20 grid h-6 w-6 place-items-center rounded-full border-2 border-[#4b3020] bg-[#dfc9a3] shadow-[inset_0_1px_2px_rgba(255,255,255,.9),0_2px_4px_rgba(0,0,0,.45)]`}><span className="h-3 w-[2px] rotate-45 bg-[#80694d]"/></span>)}
              <div aria-hidden="true" className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 -rotate-1 border-[5px] border-[#543723] bg-[#edd9b2] px-6 py-1.5 font-['Caveat',cursive] text-xl font-extrabold text-[#963e32] shadow-[0_4px_8px_rgba(0,0,0,.35)] sm:text-2xl">✿ Bienvenida a esta cocina ✿</div>

              <div className="relative border-[3px] border-[#73543a] bg-[#f8eee0] p-4 shadow-[inset_0_0_0_4px_rgba(177,138,96,.22),inset_0_0_35px_rgba(112,73,42,.1)] sm:p-7" style={{ backgroundImage: "radial-gradient(ellipse at 10% 0%,rgba(255,255,255,.65),transparent 35%),repeating-linear-gradient(0deg,rgba(112,73,42,.035) 0 1px,transparent 1px 6px)" }}>
                <div className="grid gap-6 md:grid-cols-[230px_minmax(0,1fr)] lg:gap-9">
                  <aside className="border-b-2 border-dashed border-[#c4a77d] pb-5 text-center md:border-b-0 md:border-r-2 md:pb-0 md:pr-6">
                    <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-[7px] border-[#583a29] bg-[#dfc9a3] shadow-[0_5px_12px_rgba(60,37,22,.35)] sm:h-48 sm:w-48"><Image src={cook.cookAvatar} alt={cook.cook} fill sizes="192px" className="object-cover"/></div>
                    <h2 className="mt-3 font-['Caveat',cursive] text-4xl font-extrabold text-[#526f42]">{cook.cook}</h2>
                    <p className="mt-1 inline-block rounded-full border border-dashed border-[#a65d54] bg-[#fff9f0] px-3 py-1 font-['Caveat',cursive] text-lg text-[#76534b]">Cocinera de mi barrio</p>
                    <div className="mt-4 space-y-2 text-left">
                      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#6b5942]"><MapPin className="h-5 w-5 shrink-0 text-[#526f42]"/><span className="min-w-0"><strong className="block text-[10px] uppercase tracking-wider text-[#927654]">Su conjunto</strong><span className="block truncate font-semibold">{cook.residentialComplex}</span></span></div>
                      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#6b5942]"><Star className="h-5 w-5 shrink-0 fill-amber-500 text-amber-600"/><span><strong className="block text-[10px] uppercase tracking-wider text-[#927654]">Reputación vecinal</strong><span className="font-semibold">{cook.rating} · {cook.reviews} opiniones</span></span></div>
                      <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[#6b5942]"><Utensils className="h-5 w-5 shrink-0 text-[#a84029]"/><span><strong className="block text-[10px] uppercase tracking-wider text-[#927654]">En su recetario</strong><span className="font-semibold">{dishes.length} {dishes.length === 1 ? "plato" : "platos"} publicados</span></span></div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <OllaVerdeStamp residentialComplex={cook.residentialComplex} />
                    </div>
                  </aside>

                  <div className="min-w-0">
                    <section id="historia" className="border-b-2 border-dashed border-[#c4a77d] pb-5">
                      <h2 className="rounded-full bg-[#d9c89d] px-4 py-2 text-center font-['Caveat',cursive] text-2xl font-extrabold text-[#493323] shadow-sm sm:text-3xl">La historia detrás del fogón</h2>
                      <p className="mt-3 font-['Caveat',cursive] text-xl leading-snug text-[#5b4030] sm:text-2xl">{cook.description}</p>
                    </section>
                    <section id="platos" className="pt-5">
                      <h2 className="font-['Caveat',cursive] text-3xl font-extrabold text-[#7b3c35] underline decoration-dashed decoration-[#b57b59] underline-offset-4 sm:text-4xl">Lo que sale de su cocina</h2>
                      <ul className="mt-4 space-y-3">{dishes.map((dish) => <li key={dish.id} className="flex gap-3 border-b border-dashed border-[#d0b996] pb-3 last:border-0">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[#9a8563] bg-[#e6dfc8] text-[#526f42]"><Utensils className="h-3.5 w-3.5"/></span>
                        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-x-3"><h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#493323]">{dish.name}</h3><span className="font-['Caveat',cursive] text-xl font-bold text-[#a84029]">{dish.formattedPrice} / porción</span></div><p className="mt-0.5 text-sm leading-relaxed text-[#6a5037]">{dish.description}</p><Link href="/menu" className="mt-1 inline-block font-['Caveat',cursive] text-lg font-bold text-[#526f42] underline decoration-dotted underline-offset-2 hover:text-[#a84029]">Encontrar este plato en El Libretón →</Link></div>
                      </li>)}</ul>
                    </section>
                    <p className="mt-5 border-l-4 border-[#a84029] bg-[#efe4cc] px-3 py-2 text-xs leading-relaxed text-[#6a5037]">La ubicación es aproximada. La dirección exacta se comparte después de que la cocinera confirme una reserva.</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </main>
  );
}
