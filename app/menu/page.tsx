"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import {
  getStoredDishes,
  DishItem,
  UserProfile,
} from "@/lib/ollacercana-store";
import ReservePortionModal from "@/components/modals/ReservePortionModal";
import ReputationModal from "@/components/modals/ReputationModal";
import ReportModal from "@/components/modals/ReportModal";
import ChatModal from "@/components/modals/ChatModal";
import PhoneVerificationModal from "@/components/modals/PhoneVerificationModal";
import RatingModal from "@/components/modals/RatingModal";
import {
  Search,
  MapPin,
  ShoppingBag,
  User,
  Heart,
  Star,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  Utensils,
  Soup,
  Vegan,
  Cake,
  SlidersHorizontal,
  Home,
  ClipboardList,
  Sparkles,
  CheckCircle2,
  ChefHat,
  Flag,
  Flame,
  Bell,
  Compass,
  CookingPot,
  Bike,
  Sun,
  Moon,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  cook: string;
  price: number;
  image: string;
  quantity: number;
}

export default function MenuPage() {
  const [menuTheme, setMenuTheme] = useState<"light" | "dark">("light");
  const [themeReady, setThemeReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [storedDishesList, setStoredDishesList] = useState<DishItem[]>([]);

  // Spec Modal States
  const [reserveModalDish, setReserveModalDish] = useState<DishItem | null>(null);
  const [reputationCook, setReputationCook] = useState<{ name: string; avatar: string; id: string } | null>(null);
  const [reportTarget, setReportTarget] = useState<{ title: string; id: string; type: "publicacion" | "usuario" } | null>(null);
  const [chatReservationId, setChatReservationId] = useState<string | null>(null);
  const [phoneVerifyOpen, setPhoneVerifyOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{ reservationId: string; cookId: string } | null>(null);

  const currentUser: UserProfile = {
    name: "Ana María",
    email: "anamaria@example.com",
    phone: "3001234567",
    phoneVerified: true,
    role: "comprador",
    residentialComplex: "Conjunto San Luis",
  };

  React.useEffect(() => {
    setStoredDishesList(getStoredDishes());
    const savedTheme = window.localStorage.getItem("ollacercana_menu_theme");
    if (savedTheme === "dark" || savedTheme === "light") setMenuTheme(savedTheme);
    setThemeReady(true);
  }, []);

  React.useEffect(() => {
    if (themeReady) window.localStorage.setItem("ollacercana_menu_theme", menuTheme);
  }, [menuTheme, themeReady]);

  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: "Ajiaco de la casa",
      cook: "Doña Rosa",
      price: 18000,
      image: "/images/menu_ajiaco.jpg",
      quantity: 1,
    },
  ]);
  const [cartReady, setCartReady] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedCart = window.localStorage.getItem("ollacercana_menu_cart");
      if (savedCart) {
        try {
          const parsedCart: unknown = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) setCart(parsedCart as CartItem[]);
        } catch {
          window.localStorage.removeItem("ollacercana_menu_cart");
        }
      }
      setCartReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (cartReady) {
      window.localStorage.setItem("ollacercana_menu_cart", JSON.stringify(cart));
    }
  }, [cart, cartReady]);

  const dishes = [
    {
      id: 1,
      name: "Ajiaco de la casa",
      category: "Sopas",
      badge: "El favorito ♡",
      price: 18000,
      formattedPrice: "$18.000",
      image: "/images/menu_ajiaco.jpg",
      cook: "Doña Rosa",
      cookAvatar: "/images/dona_rosa_mascot.jpg",
      rating: "4,9",
      reviews: "120",
      distance: "A 350 m",
    },
    {
      id: 2,
      name: "Bandeja casera",
      category: "Almuerzos",
      badge: "Quedan 5",
      price: 22000,
      formattedPrice: "$22.000",
      image: "/images/menu_cazuela.jpg",
      cook: "Don Carlos",
      cookAvatar: "/images/abuelita_3d_mascot.jpg",
      rating: "4,8",
      reviews: "95",
      distance: "A 600 m",
    },
    {
      id: 3,
      name: "Pollo guisado",
      category: "Almuerzos",
      badge: null,
      price: 17000,
      formattedPrice: "$17.000",
      image: "/images/dish_pollo_chalk.jpg",
      cook: "Doña Marta",
      cookAvatar: "/images/dona_rosa_mascot.jpg",
      rating: "4,8",
      reviews: "87",
      distance: "A 800 m",
    },
    {
      id: 4,
      name: "Lentejas con arroz",
      category: "Vegetariano",
      badge: null,
      price: 15000,
      formattedPrice: "$15.000",
      image: "/images/hero_plate_gourmet.jpg",
      cook: "María Elena",
      cookAvatar: "/images/abuelita_3d_mascot.jpg",
      rating: "4,7",
      reviews: "73",
      distance: "A 1,2 km",
    },
    {
      id: 5,
      name: "Sancocho de pollo",
      category: "Sopas",
      badge: "Hecho hoy ♡",
      price: 19000,
      formattedPrice: "$19.000",
      image: "/images/olla_dish_1.jpg",
      cook: "Don Luis",
      cookAvatar: "/images/dona_rosa_mascot.jpg",
      rating: "4,9",
      reviews: "101",
      distance: "A 1,1 km",
    },
    {
      id: 6,
      name: "Arroz con leche",
      category: "Postres",
      badge: null,
      price: 6000,
      formattedPrice: "$6.000",
      image: "/images/menu_postre.jpg",
      cook: "Doña Lucía",
      cookAvatar: "/images/abuelita_3d_mascot.jpg",
      rating: "4,8",
      reviews: "64",
      distance: "A 900 m",
    },
  ];

  const addToCart = (dish: (typeof dishes)[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          cook: dish.cook,
          price: dish.price,
          image: dish.image,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 3000 : 0;
  const total = subtotal + deliveryFee;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Combine static dishes with dynamic dishes from local store
  const dynamicDishes: DishItem[] = (storedDishesList.length > 0 ? storedDishesList : dishes.map((d) => ({
    id: `dish-${d.id}`,
    name: d.name,
    category: d.category as any,
    dietaryTags: (d.category === "Vegetariano" ? ["Vegetariano", "Vegano"] : (d.name.includes("Pollo") ? ["Sin Gluten"] : [])) as any,
    badge: d.badge,
    price: d.price,
    formattedPrice: d.formattedPrice,
    image: d.image,
    cook: d.cook,
    cookId: d.cook.toLowerCase().replace(/\s+/g, "-"),
    cookAvatar: d.cookAvatar,
    rating: d.rating,
    reviews: parseInt(d.reviews),
    distance: d.distance,
    distanceMeters: parseInt(d.distance),
    residentialComplex: "Conjunto San Luis",
    totalPortions: 5,
    availablePortions: d.badge === "Quedan 5" ? 5 : (d.name.includes("Lentejas") ? 1 : 4),
    reservedPortions: 1,
    status: "DISPONIBLE" as const,
    description: "Delicioso plato casero preparado hoy.",
    createdAt: new Date().toISOString(),
  })));

  const filteredDishes = dynamicDishes.filter((dish) => {
    const matchesCategory =
      activeFilter === "Todos" || activeFilter === "Filtros" || dish.category === activeFilter;
    const matchesTag =
      selectedDietaryTag === "Todos" ||
      (dish.dietaryTags && dish.dietaryTags.includes(selectedDietaryTag as any));
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.cook.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTag && matchesSearch;
  });

  const recipeNotes: Record<string, {
    badge: string;
    ingredients: string[];
    steps: string[];
    price: string;
    phrase: string;
    image?: string;
  }> = {
    "Ajiaco de la casa": {
      badge: "El sabor de Bogotá",
      ingredients: ["1 pollo (en piezas)", "3 papas (picas)", "1 mazorca de maíz", "1 cebolla larga; 2 dientes de ajo", "1 rama de cilantro; sal, pimienta y aguacate (opcional)"],
      steps: ["En una olla grande, cocina el pollo con agua, sal y un diente de ajo. Cuando esté listo, retíralo y desmenúzalo.", "En el mismo caldo, añade las papas, la mazorca y la cebolla larga. Cocina hasta que estén tiernas.", "Incorpora el pollo y el cilantro picado. Ajusta la sal y la pimienta."],
      price: "$18.000", phrase: "Un plato lleno de tradición", image: "/images/menu_ajiaco.jpg",
    },
    "Bandeja casera": {
      badge: "Tradición en cada bocado",
      ingredients: ["Frijoles de la casa", "Chicharrón crocante", "Arroz y arepa", "Aguacate", "Tajadas de plátano (opcional)"],
      steps: ["Cocina los frijoles con especias.", "Fríe el chicharrón hasta que quede crocante y prepara el arroz con las tajadas de plátano.", "Sirve todo junto con aguacate."],
      price: "$22.000", phrase: "Comida típica que enamora", image: "/images/menu_cazuela.jpg",
    },
    "Pollo guisado": {
      badge: "Sabor casero de siempre",
      ingredients: ["1 pollo (en piezas)", "1 cebolla y 2 tomates", "1 zanahoria y 2 papas", "Ajo, comino, sal y pimienta", "Aceite"],
      steps: ["Sofríe la cebolla, el ajo y el tomate.", "Añade el pollo y dóralo. Incorpora la zanahoria, las papas y agua.", "Cocina a fuego medio hasta que esté tierno. Ajusta la sal, la pimienta y el comino."],
      price: "$17.000", phrase: "Hecho con mucho cariño", image: "/images/dish_pollo_chalk.jpg",
    },
    "Lentejas con arroz": {
      badge: "Nutritivo y delicioso",
      ingredients: ["1 taza de lentejas", "1/2 taza de arroz", "1 cebolla y 1 tomate", "1 zanahoria", "Ajo, sal, pimienta y laurel"],
      steps: ["Lava las lentejas y ponlas a cocinar. Sofríe la cebolla, el tomate y la zanahoria.", "Añade las lentejas, el arroz y el laurel. Deja cocinar hasta que todo esté tierno.", "Ajusta la sal y la pimienta."],
      price: "$15.000", phrase: "Simple, pero muy bueno",
    },
    "Sancocho de pollo": {
      badge: "Calientito y tradicional",
      ingredients: ["Pollo (en piezas)", "Yuca y plátano verde", "Papa y mazorca de maíz", "Cebolla, ajo y cilantro", "Sal y pimienta"],
      steps: ["Cocina el pollo con agua, cebolla, ajo y sal.", "Añade la yuca, el plátano, la papa y la mazorca. Cocina a fuego medio hasta que estén tiernos.", "Rectifica la sazón y agrega cilantro al final."],
      price: "$17.000", phrase: "El sabor de la finca", image: "/images/olla_dish_1.jpg",
    },
    "Arroz con leche": {
      badge: "Un clásico de la casa",
      ingredients: ["1 taza de arroz", "1 litro de leche", "1/2 taza de azúcar", "1 rama de canela", "Vainilla y pasas (opcional)"],
      steps: ["Lava el arroz y ponlo a cocinar con la leche. Añade la canela y el azúcar.", "Revuelve constantemente para que no se pegue.", "Cuando esté cremoso, agrega vainilla y pasas. Deja enfriar y sirve."],
      price: "$10.000", phrase: "Un postre de siempre", image: "/images/menu_postre.jpg",
    },
    "Arepas con queso": {
      badge: "El gusto de lo simple",
      ingredients: ["Maíz amarillo", "Agua", "Sal", "Queso campesino o costeño", "Mantequilla (opcional)"],
      steps: ["Mezcla el maíz con agua y sal.", "Forma las arepas y cocina en sartén o parrilla.", "Añade el queso, deja que se derrita y sirve caliente."],
      price: "$8.000", phrase: "Tradición en cada mordida",
    },
    "Empanadas de carne": {
      badge: "Crujientes y deliciosas",
      ingredients: ["Harina de maíz", "Carne molida", "Cebolla y pimentón", "Huevo", "Sal y especias"],
      steps: ["Sofríe la carne con la cebolla y el pimentón.", "Forma las empanadas con la masa, rellena y cierra bien.", "Fríe u hornea hasta que estén doradas."],
      price: "$12.000", phrase: "Un bocado de felicidad",
    },
  };

  const showReferenceRecipes = activeFilter === "Todos" && selectedDietaryTag === "Todos" && searchQuery.trim() === "";
  const sideRecipeDish = showReferenceRecipes ? filteredDishes.find((dish) => dish.name === "Lentejas con arroz") : undefined;
  const mainRecipeDishes = showReferenceRecipes
    ? filteredDishes.filter((dish) => dish.name !== "Lentejas con arroz")
    : filteredDishes;

  const marqueeItemsRow1 = [
    { title: "Ajiaco Santafereño", subtitle: "Doña Carmen • Salitre", image: "/images/menu_ajiaco.jpg", badge: "Sopas" },
    { title: "Bandeja Criolla", subtitle: "Señora Martha • El Rosal", image: "/images/menu_cazuela.jpg", badge: "Almuerzos" },
    { title: "Pollo al Romero", subtitle: "Chef Luisa • Modelo", image: "/images/hero_plate_gourmet.jpg", badge: "Especiales" },
    { title: "Flan de Caramelo", subtitle: "Abuela Beatriz • Torre 3", image: "/images/menu_postre.jpg", badge: "Postres" },
    { title: "Pollo Guisado", subtitle: "Doña Marta • Norte", image: "/images/dish_pollo_chalk.jpg", badge: "Guisos" },
    { title: "Sancocho Trifásico", subtitle: "Don Luis • Colina", image: "/images/olla_dish_1.jpg", badge: "Sopas" },
  ];

  const marqueeItemsRow2 = [
    { title: "Abuela OllaCercana", subtitle: "Mascota Oficial", image: "/images/abuelita_3d_mascot.jpg", badge: "Comunidad" },
    { title: "Doña Rosa Mascot", subtitle: "Sazón de Hogar", image: "/images/dona_rosa_mascot.jpg", badge: "Cocinas" },
    { title: "Sancocho de Gallina", subtitle: "Cocina Tradicional", image: "/images/menu_ajiaco.jpg", badge: "Recetas" },
    { title: "Cazuela Paisa", subtitle: "María Elena • Salitre", image: "/images/olla_dish_2.jpg", badge: "Guisos" },
    { title: "Pollo Dorado", subtitle: "Doña Marta • El Rosal", image: "/images/hero_plate_gourmet.jpg", badge: "Almuerzos" },
    { title: "Postres de Natas", subtitle: "Doña Lucía • Torre 2", image: "/images/menu_postre.jpg", badge: "Dulces" },
  ];

  const renderRecipeCard = (name: string, dish?: DishItem, compact = false, featured = false, lowerRow = false) => {
    const note = recipeNotes[name];
    if (!note) return null;
    const image = note.image;
    const price = note.price || dish?.formattedPrice || `$${dish?.price.toLocaleString("es-CO") ?? ""}`;

    return (
      <article
        key={dish?.id ?? name}
        className={`relative overflow-visible rounded-[3px] bg-[#93724d] p-1 pt-3 shadow-[0_8px_15px_rgba(47,25,12,.3)] transition-transform hover:-translate-y-1 hover:rotate-0 ${compact ? (lowerRow ? (name === "Empanadas de carne" ? "min-h-[273px]" : "min-h-[293px]") : "min-h-[230px]") : featured ? "min-h-[350px]" : "min-h-[250px]"}`}
        style={{
          transform: `rotate(${["Ajiaco de la casa", "Pollo guisado", "Arroz con leche", "Empanadas de carne"].includes(name) ? "-0.8deg" : "0.7deg"})`,
          backgroundImage: "linear-gradient(145deg,rgba(87,51,26,.95),rgba(56,33,18,.96)), repeating-linear-gradient(8deg,rgba(37,22,13,.18) 0 2px,transparent 2px 8px)",
        }}
      >
        <div aria-hidden="true" className="absolute -top-1 left-1/2 z-20 h-6 w-[72px] -translate-x-1/2 -rotate-2 border-x border-[#bda06a]/70 bg-[#d8bd82]/90 shadow-sm" />
        <div
          className={`menu-paper relative flex h-full flex-col bg-[#efe0c2] p-2.5 pb-2 text-[#2b2117] shadow-[inset_0_0_18px_rgba(117,78,38,.18)] [clip-path:polygon(1%_1%,97%_0%,100%_3%,99%_97%,96%_100%,3%_99%,0%_96%,1%_4%)] ${compact ? (lowerRow ? (name === "Empanadas de carne" ? "min-h-[265px]" : "min-h-[285px]") : "min-h-[222px]") : featured ? "min-h-[334px]" : "min-h-[242px]"}`}
          style={{ backgroundImage: "radial-gradient(ellipse at 12% 12%,rgba(255,250,225,.52),transparent 38%),radial-gradient(ellipse at 90% 88%,rgba(164,120,65,.14),transparent 42%),repeating-linear-gradient(2deg,rgba(91,69,43,.025) 0 1px,transparent 1px 4px)" }}
        >
          <div className={`relative pr-[27%] ${compact ? "min-h-[38px]" : "min-h-[42px]"}`}>
            <h3 className={`font-['Caveat',cursive] font-bold leading-[.86] tracking-tight text-[#2b2117] ${compact ? "text-[20px]" : "text-[22px]"}`}>{name}</h3>
            <div className="mt-1 h-[2px] w-[88%] -rotate-[2deg] bg-[#5b4a38]" />
            <div className="absolute right-0 top-0 max-w-[29%] -rotate-3 text-center font-['Caveat',cursive] text-[13px] leading-[.9] text-[#5b4a38]">
              <span className="mr-1 text-[#c84b31]">•</span>{note.badge}
            </div>
          </div>

          <div className={`relative mt-1 grid gap-1.5 ${compact ? "grid-cols-[minmax(0,1fr)_64px] xl:grid-cols-[minmax(0,1fr)_92px]" : "grid-cols-[minmax(0,1fr)_70px] xl:grid-cols-[minmax(0,1fr)_104px]"}`}>
            <div className={`min-w-0 font-['Caveat',cursive] ${compact || featured ? "text-[10px] leading-[.94]" : "text-[11px] leading-[.96]"}`}>
              <h4 className="mb-0.5 font-bold underline decoration-[#806747] underline-offset-2">Ingredientes:</h4>
              {note.ingredients.length ? (
                <ul className="space-y-[1px]">
                  {note.ingredients.map((ingredient) => <li key={ingredient} className="flex gap-1"><span>–</span><span>{ingredient}</span></li>)}
                </ul>
              ) : (
                <p>{dish?.description || ""}</p>
              )}
            </div>
            <div className={`relative mt-2 overflow-hidden rounded-[47%_53%_51%_49%/45%_42%_58%_55%] border-[3px] border-[#6b5037] bg-[#e6d4b0] shadow-[0_3px_5px_rgba(66,43,24,.25)] ${compact ? "h-[64px] w-[64px] xl:h-[92px] xl:w-[92px]" : "h-[70px] w-[70px] xl:h-[104px] xl:w-[104px]"}`}>
              {image ? (
                <Image src={image} alt={name} fill sizes="94px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_25%,#f3e7ce,#cbb58e)] p-2 text-center font-['Caveat',cursive] text-[12px] leading-tight text-[#735b3d] xl:text-[14px]">
                  Foto pendiente
                </div>
              )}
            </div>
          </div>

          <div className={`mt-1 border-t border-dashed border-[#aa8b5e] pt-1 font-['Caveat',cursive] ${compact || featured ? "text-[10px] leading-[.94]" : "text-[11px] leading-[.96]"}`}>
            <h4 className="mb-0.5 font-bold underline decoration-[#806747] underline-offset-2">Preparación:</h4>
            <ol className="space-y-[1px]">
              {note.steps.map((step, index) => <li key={step} className="flex gap-1"><span className="shrink-0">{index + 1}.</span><span>{step}</span></li>)}
            </ol>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-dashed border-[#aa8b5e] pt-1.5">
            {dish ? (
              <button onClick={() => setReserveModalDish(dish)} title="Reservar porciones (HU-11)" className={`font-['Caveat',cursive] font-bold leading-none text-[#5b3020] underline decoration-[#5b3020] decoration-1 underline-offset-2 ${compact ? "text-[22px]" : "text-[25px]"}`}>
                {price}
              </button>
            ) : (
              <span className={`font-['Caveat',cursive] font-bold leading-none text-[#5b3020] underline decoration-[#5b3020] decoration-1 underline-offset-2 ${compact ? "text-[22px]" : "text-[25px]"}`}>{price}</span>
            )}
            <span className="font-['Caveat',cursive] text-[13px] leading-none text-[#5b4a38]">/ Porción</span>
          </div>
          <div className={`mt-1 flex items-center gap-1 font-['Caveat',cursive] italic leading-none text-[#5b4a38] ${compact ? "text-[12px]" : "text-[15px]"}`}>
            <Heart className="h-3.5 w-3.5 shrink-0 stroke-[1.7]" />
            <span>{note.phrase}</span>
          </div>

          {dish && (
            <div className="sr-only">
              <button onClick={() => setReportTarget({ title: dish.name, id: dish.id, type: "publicacion" })}>Reportar {dish.name}</button>
              <button onClick={() => setReputationCook({ name: dish.cook, avatar: dish.cookAvatar, id: dish.cookId })}>Ver reputación de {dish.cook}</button>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div data-menu-theme={menuTheme} className="menu-theme-root relative min-h-screen overflow-x-clip bg-[#cba679] font-['Patrick_Hand',cursive] text-[#35251a] selection:bg-[#C84B31] selection:text-white">
      <style jsx global>{`
        [data-menu-theme="dark"] { color-scheme: dark; }
        [data-menu-theme="dark"] .menu-paper {
          background-color: #3a3025 !important;
          border-color: #715a3e !important;
          color: #f0e3ce !important;
          box-shadow: 0 10px 24px rgba(0,0,0,.38), inset 0 0 22px rgba(0,0,0,.18) !important;
        }
        [data-menu-theme="dark"] .menu-paper :is(h1,h2,h3,h4,p,li,span) { color: #f0e3ce !important; }
        [data-menu-theme="dark"] .menu-paper .menu-accent { color: #c9d6a8 !important; }
        [data-menu-theme="dark"] .menu-paper .menu-badge {
          background-color: #46513b !important;
          border-color: #71805d !important;
          color: #edf0dc !important;
        }
        [data-menu-theme="dark"] .menu-paper [class*="bg-[#dce4ce]"] {
          background-color: #46513b !important;
          border-color: #71805d !important;
          color: #edf0dc !important;
        }
        [data-menu-theme="dark"] .menu-paper .menu-subpaper {
          background-color: #493b2d !important;
          border-color: #776044 !important;
        }
        [data-menu-theme="dark"] .menu-paper input { background-color: #493b2d !important; color: #f0e3ce !important; }
      `}</style>
      
      {/* Warm wooden tabletop with a checked kitchen cloth in the corner */}
      <div aria-hidden="true" className={`fixed inset-0 z-0 bg-[#cba679] bg-cover bg-center bg-no-repeat transition-[filter] duration-300 ${menuTheme === "dark" ? "brightness-[.58]" : ""}`} style={{ backgroundImage: "url('/images/libreton_bg_tiles_ref.png')" }} />

      {/* ── 1. TOP NAVIGATION BAR ── */}
      <header className="menu-paper sticky top-0 z-40 border-b border-[#a67b50]/50 bg-[#f5e9d2]/75 px-3 py-2 shadow-[0_3px_12px_rgba(44,23,11,.18)] backdrop-blur-md sm:px-4 md:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-1 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="group shrink-0 flex items-center">
            <BrandLogo size="sm" showTagline={false} />
          </Link>

          {/* Location Selector */}
          <div className="hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#b99770]/65 bg-[#f6ead4]/75 px-3 py-1.5 text-xs font-semibold text-[#453321] transition-colors hover:bg-[#fff6e8] sm:flex">
            <MapPin className="w-3.5 h-3.5 text-[#C84B31]" />
            <span>Bogotá · Tu barrio</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
          </div>

          <label className="relative hidden min-w-[180px] max-w-[270px] flex-1 lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#795f43]" />
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Busca un plato..." className="w-full rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 py-2 pl-9 pr-3 font-['Patrick_Hand',cursive] text-sm text-[#493323] placeholder:text-[#80694d] focus:outline-none focus:ring-2 focus:ring-[#c84b31]/50" />
          </label>

          {/* Center Search Link & Nav */}
          <nav className="hidden items-center gap-5 whitespace-nowrap text-xs font-semibold text-[#453321] xl:flex">
            <a
              href="#explorar"
              className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorar</span>
            </a>
            <Link
              href="/cocineras-cercanas"
              className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
            >
              <CookingPot className="w-3.5 h-3.5" />
              <span>Cocinas cercanas</span>
            </Link>
            <Link
              href="/cuenta/reservas"
              className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Mis pedidos</span>
            </Link>
          </nav>

          {/* Right User Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button type="button" onClick={() => setMenuTheme((current) => current === "light" ? "dark" : "light")} aria-label={menuTheme === "light" ? "Activar modo oscuro" : "Activar modo claro"} title={menuTheme === "light" ? "Modo oscuro" : "Modo claro"} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 text-[#493323] transition-colors hover:bg-[#fff6e8] sm:h-9 sm:w-9">
              {menuTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            {/* Cart Icon */}
            <a
              href="#cart-section"
              className="relative rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 p-1.5 text-[#453321] transition-colors hover:bg-[#fff6e8] sm:p-2"
            >
                <Bell className="h-4 w-4 text-[#493323] sm:h-5 sm:w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#C84B31] text-[10px] font-bold text-white shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </a>

            {/* User Profile */}
            <Link
              href="/cuenta/perfil"
              className="flex items-center gap-1 rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 py-1 pl-1 pr-1.5 text-xs font-semibold text-[#453321] transition-colors hover:bg-[#fff6e8] sm:gap-2 sm:pl-1.5 sm:pr-2.5"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden relative border border-stone-300">
                <Image
                  src="/images/dona_rosa_mascot.jpg"
                  alt="Ana María Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden md:inline">Ana María</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER WITH Subtle Brick/Paper Wall Background ── */}
      <main className="relative z-10 mx-auto max-w-[1400px] space-y-5 px-4 pb-6 pt-4 md:px-8 md:pb-8 md:pt-[52px]">
        {/* ── 2. HERO CHALKBOARD HANGING BANNERS ROW ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Large Hanging Chalkboard Sign */}
          <div className="menu-paper lg:col-span-8 relative overflow-hidden border border-[#9b774f] bg-[#efe0c2] p-6 shadow-[0_12px_28px_rgba(46,27,13,.32),inset_0_0_28px_rgba(117,78,38,.16)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] md:p-8 flex flex-col justify-between min-h-[220px]">
            <div aria-hidden="true" className="absolute -top-1 left-1/2 z-20 h-7 w-24 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
            {/* Hanging Hooks & Rope Details on Top */}
            <div className="absolute top-2 left-10 flex items-center gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-[#b78a59] border-2 border-[#765638] shadow-inner" />
              <div className="w-0.5 h-4 bg-[#98754d] shadow-xs" />
            </div>
            <div className="absolute top-2 right-16 flex items-center gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-[#b78a59] border-2 border-[#765638] shadow-inner" />
              <div className="w-0.5 h-4 bg-[#98754d] shadow-xs" />
            </div>

            {/* Red Checkered Napkin Hanging Accent over top-right corner */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden z-20">
              <div className="w-32 h-32 bg-[#C84B31] border-2 border-[#8e442c] rotate-45 translate-x-12 -translate-y-16 shadow-lg flex items-end justify-center pb-2">
                <div className="w-full h-full bg-[radial-gradient(#fff_20%,transparent_20%)] bg-[size:10px_10px] opacity-30" />
              </div>
            </div>

            {/* Chalkboard Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-3">
                  {/* Steaming pot chalk drawing icon */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-10 h-10 stroke-[#C84B31] fill-none stroke-[2.5] stroke-linecap-round"
                    >
                      <path d="M16 28h32v20a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V28z" />
                      <path d="M12 28h40" />
                      <path d="M8 32h8M48 32h8" />
                      {/* Steam lines */}
                      <path d="M24 16c2-3 0-6 2-9M32 16c2-3 0-6 2-9M40 16c2-3 0-6 2-9" className="stroke-[#65834d]" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-['Caveat',cursive] text-4xl sm:text-5xl md:text-6xl font-bold text-[#2b2117] tracking-wide leading-none">
                      Hoy se come rico.
                    </h1>
                    {/* Chalk underline stroke */}
                    <div className="w-48 h-1.5 bg-[#C84B31] rounded-full mt-1 rotate-[-1deg]" />
                  </div>
                </div>

                <p className="text-[#5b4a38] font-['Caveat',cursive] text-xl sm:text-2xl pt-2 font-normal">
                  Comida de casa, hecha por tus vecinos.
                </p>
              </div>

              {/* Hand Drawn Spoon & Fresh Badge */}
              <div className="flex md:flex-col items-center gap-4 self-end md:self-center shrink-0">
                {/* Chalk spoon doodle */}
                <div className="hidden sm:block text-[#856b4d] opacity-80 rotate-12">
                  <svg viewBox="0 0 40 100" className="w-8 h-20 stroke-[#856b4d] fill-none stroke-[2]">
                    <ellipse cx="20" cy="20" rx="14" ry="18" />
                    <path d="M20 38v55" />
                  </svg>
                </div>

                {/* Badge: ¡Recién hecho! */}
                <div className="px-4 py-2 rounded-full bg-[#dce4ce] border-2 border-dashed border-[#75865a] text-[#52663d] font-['Caveat',cursive] text-xl font-bold rotate-[-4deg] shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#65834d]" />
                  <span>¡Recién hecho!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Smaller Hanging Chalkboard Banner */}
          <div className="menu-paper lg:col-span-4 relative overflow-hidden border border-[#9b774f] bg-[#efe0c2] p-6 shadow-[0_10px_22px_rgba(46,27,13,.28)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] flex flex-col justify-center text-center space-y-3 min-h-[180px]">
            <div aria-hidden="true" className="absolute -top-1 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
            {/* Hanging Rope detail */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-[#b78a59] border-2 border-[#765638]" />
            </div>

            <h2 className="font-['Caveat',cursive] text-3xl md:text-4xl font-bold text-[#2b2117] leading-tight">
              La hora del almuerzo
            </h2>
            <p className="font-['Caveat',cursive] text-lg text-[#5b4a38]">
              Encuentra tu favorito cerca de casa. ♡
            </p>
          </div>
        </section>

        {/* ── 4. DISH GRID SECTION & RIGHT SIDEBAR ── */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2.9fr)_minmax(0,1fr)] xl:gap-8">
          {/* LEFT 8 COLS: ANTOJO DEL DÍA, SEARCH, FILTERS & DISH CARDS GRID */}
          <section className="relative min-w-0 space-y-[22px]">

            {/* ── ANTOJO DEL DÍA (HIGHLIGHT STRIP DE 8 COCINERAS CERCA DE TI) ── */}
            <div className="menu-paper relative overflow-hidden border border-[#9b774f] bg-[#e8d1a3]/95 p-5 text-[#2b2117] shadow-[0_10px_24px_rgba(46,27,13,.3),inset_0_0_20px_rgba(117,78,38,.12)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] space-y-4">
              <div aria-hidden="true" className="absolute -top-1 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
              <div className="flex items-center justify-between border-b border-[#ae9066] pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#F0822D]" />
                  <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#493323]">Antojo del Día</h3>
                  <span className="text-xs bg-[#dce4ce] text-[#52663d] border border-[#75865a]/50 px-2.5 py-0.5 rounded-full font-bold">
                    8 Cocineras cerca de ti
                  </span>
                </div>
                <span className="text-xs text-[#80694d] font-['Patrick_Hand',cursive] hidden sm:inline">Disponibles ahora mismo</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Doña Rosa", dish: "Ajiaco de la casa", dist: "350 m", rating: "4,9", img: "/images/dona_rosa_mascot.jpg" },
                  { name: "Don Carlos", dish: "Bandeja casera", dist: "600 m", rating: "4,8", img: "/images/abuelita_3d_mascot.jpg" },
                  { name: "Doña Marta", dish: "Pollo guisado", dist: "800 m", rating: "4,8", img: "/images/dona_rosa_mascot.jpg" },
                  { name: "María Elena", dish: "Lentejas estofadas", dist: "1,2 km", rating: "4,7", img: "/images/abuelita_3d_mascot.jpg" },
                  { name: "Don Luis", dish: "Sancocho de pollo", dist: "1,1 km", rating: "4,9", img: "/images/dona_rosa_mascot.jpg" },
                  { name: "Doña Lucía", dish: "Arroz con leche", dist: "900 m", rating: "4,8", img: "/images/abuelita_3d_mascot.jpg" },
                  { name: "Doña Carmen", dish: "Tamales tolimenses", dist: "450 m", rating: "4,9", img: "/images/dona_rosa_mascot.jpg" },
                  { name: "Don Pedro", dish: "Sudado criollo", dist: "700 m", rating: "4,8", img: "/images/abuelita_3d_mascot.jpg" },
                ].map((cook, idx) => (
                  <div
                    key={idx}
                    className="menu-paper menu-subpaper relative bg-[#f5e9d2] border border-[#c4a77d] hover:border-[#C84B31]/70 p-3 shadow-[0_4px_8px_rgba(73,47,25,.16)] flex flex-col justify-between transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <img src={cook.img} alt={cook.name} className="w-9 h-9 rounded-full object-cover border border-[#98774e]" />
                        <span className="text-[10px] bg-[#dce4ce] text-[#52663d] font-bold px-2 py-0.5 rounded-full border border-[#75865a]/50">
                          ★ {cook.rating}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-['Caveat',cursive] text-base font-bold text-[#2b2117] group-hover:text-[#a84029] transition-colors">{cook.name}</h4>
                        <p className="text-[11px] text-[#5b4a38] line-clamp-1">{cook.dish}</p>
                        <span className="text-[10px] text-[#80694d] block mt-0.5">A {cook.dist}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const foundDish = dishes.find((d) => d.cook === cook.name) || dishes[0];
                        addToCart(foundDish);
                        setOrderModalOpen(true);
                      }}
                      className="mt-2 w-full py-1.5 rounded-full bg-[#C84B31] hover:bg-[#a83e29] text-white font-bold text-[11px] transition-all cursor-pointer shadow-sm"
                    >
                      Pedir Antojo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 3. SEARCH & FILTERS ROW ── */}
            <div id="explorar" className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
              <label className="relative block w-full lg:hidden">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#795f43]" />
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Busca un plato..." className="w-full rounded-full border border-[#b99770]/60 bg-[#fff7e9]/85 py-2 pl-9 pr-3 font-['Patrick_Hand',cursive] text-sm text-[#493323] placeholder:text-[#80694d] focus:outline-none focus:ring-2 focus:ring-[#c84b31]/50" />
              </label>
              <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "Todos", label: "Todos", icon: Utensils },
                  { id: "Almuerzos", label: "Almuerzos", icon: Utensils },
                  { id: "Sopas", label: "Sopas", icon: Soup },
                  { id: "Vegetariano", label: "Vegetariano", icon: Vegan },
                  { id: "Postres", label: "Postres", icon: Cake },
                  { id: "Filtros", label: "Filtros", icon: SlidersHorizontal },
                ].map((btn) => {
                  const Icon = btn.icon;
                  const isActive = activeFilter === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => setActiveFilter(btn.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                        isActive
                          ? "bg-[#C84B31] text-white shadow-md shadow-red-950/20"
                          : "border border-white/70 bg-white/55 text-[#493323] hover:bg-white/85"
                      }`}
                    >
                      <Icon className={`h-3 w-3 ${isActive ? "text-white" : "text-[#C84B31]"}`} />
                      <span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#f6e8cf]/90 bg-[#f8ecd7]/45 px-2.5 py-1.5 text-[11px] font-semibold text-[#fff7e9] shadow-sm">
                <MapPin className="h-3.5 w-3.5" />
                <span>Cocinas a menos de 2 km</span>
              </div>
            </div>

            {/* ── DIETARY TAGS FILTER ROW (HU-08) ── */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="shrink-0 font-bold text-[#57412b]">Etiquetas Dietéticas (HU-06):</span>
              {["Todos", "Vegetariano", "Sin Gluten", "Sin Lactosa", "Vegano"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedDietaryTag(tag)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    selectedDietaryTag === tag
                      ? "bg-[#F0822D] text-white shadow-sm"
                      : "border border-white/75 bg-white/55 text-[#493323] hover:bg-white/85"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* Section Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e0c49a]/70 pb-2">
              <div className="space-y-1">
                <h2 className="flex items-center gap-3 font-['Caveat',cursive] text-3xl font-bold text-[#2c1b10] drop-shadow-sm md:text-4xl">
                  <span>¿Qué se te antoja hoy?</span>
                  <svg aria-hidden="true" viewBox="0 0 54 12" className="mt-2 h-3 w-14 text-[#C84B31]">
                    <path d="M2 8 C12 2, 19 10, 29 5 S44 4, 52 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </h2>
              </div>
            </div>

            {/* Recipe-note layout. Existing dish handlers stay attached to each published dish. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mainRecipeDishes.map((dish, index) => renderRecipeCard(dish.name, dish, index >= 3, index < 3, index >= 3))}
              {showReferenceRecipes && renderRecipeCard("Arepas con queso", undefined, true, false, true)}
            </div>

            {/* Kept mounted as the original listing markup so its existing actions remain available. */}
            <div className="hidden grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="relative rounded-lg shadow-[0_14px_28px_rgba(47,25,12,0.42)] hover:shadow-[0_18px_34px_rgba(47,25,12,0.48)] transition-all flex flex-col justify-between h-full group bg-[#55351f] p-2 pt-4 rotate-[-0.3deg] hover:rotate-0 hover:-translate-y-1"
                  style={{ backgroundImage: "repeating-linear-gradient(8deg, rgba(58,29,14,.22) 0px, rgba(58,29,14,.22) 2px, transparent 3px, transparent 9px), linear-gradient(135deg, #714325, #3c2113 52%, #82532f)" }}
                >
                  <div aria-hidden="true" className="absolute z-20 top-0 left-1/2 -translate-x-1/2 -rotate-2 w-24 h-7 bg-[#d6b776]/90 border-x border-[#b99655]/70 shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
                  {/* Torn, aged recipe paper on a kitchen table */}
                  <div className="menu-paper relative bg-[#e8d1a3] border border-[#a58150] p-2.5 pt-5 text-[#38271c] flex-1 flex flex-col justify-between min-h-[315px] shadow-[inset_0_0_22px_rgba(108,68,30,0.22)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_99%,3%_100%,1%_97%,0%_4%)]" style={{ backgroundImage: "radial-gradient(ellipse at 15% 10%, rgba(255,255,235,.48), transparent 35%), radial-gradient(ellipse at 95% 88%, rgba(135,82,35,.18), transparent 38%), repeating-linear-gradient(4deg, rgba(117,77,41,.035) 0px, rgba(117,77,41,.035) 1px, transparent 2px, transparent 5px)" }}>
                      <div className="relative pt-1 min-h-[3.1rem]">
                        <div className="min-w-0 max-w-[68%]">
                        <h3 className="font-['Caveat',cursive] text-[1.55rem] font-bold leading-[0.92] text-[#38271c] group-hover:text-[#6b321f] transition-colors">
                          {dish.name}
                        </h3>
                        <div className="mt-1 w-4/5 border-b-2 border-[#513626] rotate-[-2deg]" />
                        </div>

                        {dish.badge ? (
                          <span className="absolute right-0 top-1 max-w-[34%] px-2 py-1 rounded-full border border-dashed border-[#68472e] text-[#493323] font-['Caveat',cursive] text-[0.92rem] leading-[0.95] text-center -rotate-3 whitespace-normal">
                            {dish.badge}
                          </span>
                        ) : (
                          null
                        )}
                      </div>

                      <div className="grid grid-cols-[1.15fr_.85fr] gap-2 items-center min-h-[150px] border-y border-dashed border-[#927148] py-3 my-2">
                        <div className="min-w-0">
                          <p className="font-['Caveat',cursive] text-sm font-bold text-[#68472e] underline decoration-[#68472e] underline-offset-2">Apunte de {dish.cook}</p>
                          {dish.description && <p className="font-['Caveat',cursive] text-[13px] leading-[1.08] text-[#38271c] mt-1">{dish.description}</p>}
                        </div>
                        <div className="relative w-full aspect-square overflow-hidden shrink-0 rotate-[1deg]">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover sepia-[0.72] grayscale-[0.45] contrast-[0.82] brightness-[1.1] saturate-[0.5] mix-blend-multiply opacity-80 transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* Price and handwritten serving note */}
                      <div className="flex items-end justify-between z-10 pt-2 pb-1 shrink-0 border-t border-dashed border-[#927148]">
                        <div>
                          <span className="font-['Caveat',cursive] text-2xl font-bold text-[#a84c2f] leading-none block">
                            {dish.formattedPrice}
                          </span>
                          {/* Stock Urgency Badge HU-16 */}
                          {dish.availablePortions === 1 && (
                              <span className="text-[10px] font-bold text-red-800 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full inline-flex mt-1 animate-pulse items-center gap-1">
                              <Flame className="w-3 h-3 text-red-600" />
                              <span>Última porción disponible</span>
                            </span>
                          )}
                        </div>

                        {/* Report Dish Button (HU-18) */}
                        <button
                          onClick={() => setReportTarget({ title: dish.name, id: dish.id, type: "publicacion" })}
                          className="text-stone-500 hover:text-red-700 text-xs font-['Caveat',cursive] flex items-center gap-1 transition-colors"
                          title="Reportar publicación (HU-18)"
                        >
                          <Flag className="w-3 h-3 text-red-400" />
                          <span>Reportar</span>
                        </button>
                      </div>
                      {/* Cook info and reservation action on the bottom edge of the note */}
                      <div className="w-full bg-[#dfc18a] p-2 flex items-center justify-between gap-2 border-t border-[#947046] shrink-0 z-10 text-stone-900 shadow-[inset_0_2px_5px_rgba(89,54,24,0.18)]">
                    <div
                      onClick={() => setReputationCook({ name: dish.cook, avatar: dish.cookAvatar, id: dish.cookId })}
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group/cook hover:opacity-90 transition-opacity"
                      title="Ver reputación y opiniones (HU-22)"
                    >
                      {/* Cook Avatar Circle */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-200 shrink-0 bg-stone-100 shadow-xs relative">
                        <img
                          src={dish.cookAvatar}
                          alt={dish.cook}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/dona_rosa_mascot.jpg";
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Cook Name, Rating, and Distance */}
                      <div className="min-w-0 flex flex-col justify-center">
                        <p className="text-xs font-bold text-stone-900 truncate leading-tight group-hover/cook:text-[#F0822D]">
                          {dish.cook} <span className="text-[10px] text-amber-600 underline">Ver Reputación</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium pt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {dish.rating} ({dish.reviews})
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="truncate">📍 {dish.distance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reserve Portion Button (HU-11, HU-14) */}
                    <button
                      onClick={() => setReserveModalDish(dish)}
                      className="px-3 py-2 rounded-full bg-[#F0822D] hover:bg-[#d97224] text-white flex items-center justify-center gap-1 transition-all shadow-md active:scale-95 shrink-0 text-xs font-bold"
                      title="Reservar porciones (HU-11)"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Reservar</span>
                    </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT 4 COLS: SIDEBAR (Cocina Invitada + Tu Pedido) */}
          <aside className="space-y-4 lg:-mt-4">
            {/* 1. MASCOTA / COCINA INVITADA PANEL */}
            <div className="menu-paper relative overflow-hidden border border-[#9b774f] bg-[#e8d1a3] p-5 pt-7 text-center text-[#2b2117] shadow-[0_10px_24px_rgba(46,27,13,.32),inset_0_0_20px_rgba(117,78,38,.14)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] space-y-4">
              <div aria-hidden="true" className="absolute -top-1 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
              {/* Rope hanging loops */}
              <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-[#b78a59] border border-[#765638]" />
              <div className="absolute top-2 right-6 w-3 h-3 rounded-full bg-[#b78a59] border border-[#765638]" />

              <span className="font-['Caveat',cursive] text-2xl font-bold text-[#2b2117] block">
                Nuestra Mascota
              </span>

              {/* Official 3D Pixar Mascot Character Portrait */}
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-[3px] border-[#795c3c] shadow-[0_4px_10px_rgba(66,43,24,.28)] bg-[#d6bd91]">
                <Image
                  src="/images/abuelita_3d_mascot.jpg"
                  alt="Abuela OllaCercana - Mascot"
                  fill
                  className="object-cover scale-110 object-center"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-['Caveat',cursive] text-2xl md:text-3xl font-bold text-[#52663d] leading-tight">
                  Abuela OllaCercana ♡
                </h4>
                <p className="font-['Caveat',cursive] text-[#5b4a38] text-lg leading-snug">
                  La calidez y sazón de nuestra comunidad.
                </p>
              </div>

              <Link
                href="/cocineras-cercanas"
                className="w-full py-2.5 rounded-full bg-[#C84B31] hover:bg-[#a83e29] text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-md"
              >
                <span>Conócela →</span>
              </Link>
            </div>

            {/* 2. CART SUMMARY PANEL ("TU PEDIDO") */}
            <div
              id="cart-section"
              className="menu-paper relative space-y-1 border border-[#a58150] bg-[#e8d1a3] p-2.5 pt-4 shadow-[0_12px_24px_rgba(45,25,13,.38),inset_0_0_25px_rgba(120,77,38,.18)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_99%,3%_100%,1%_97%,0%_4%)] font-['Patrick_Hand',cursive]"
              style={{ backgroundImage: "radial-gradient(ellipse at 15% 10%, rgba(255,255,235,.48), transparent 35%), repeating-linear-gradient(4deg, rgba(117,77,41,.035) 0px, rgba(117,77,41,.035) 1px, transparent 2px, transparent 5px)" }}
            >
              <div aria-hidden="true" className="absolute -top-1 left-1/2 -translate-x-1/2 -rotate-2 w-20 h-6 bg-[#d6b776]/90 border-x border-[#b99655]/70 shadow-sm" />
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#ae9066] pb-2">
                <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C84B31]" />
                  <span>Tu pedido</span>
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-[#68472e] hover:text-[#C84B31] transition-colors"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs space-y-2">
                  <p>Tu pedido está vacío.</p>
                  <p className="text-[11px] font-['Caveat',cursive] text-stone-500 text-base">
                    Agrega un delicioso plato casero con el botón +
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-1 border-b border-dashed border-[#ae9066]"
                    >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#98774e] shadow-sm">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover sepia grayscale-[0.3]"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone-500">{item.cook}</p>
                        <p className="text-xs font-extrabold text-[#C84B31]">
                          ${(item.price * item.quantity).toLocaleString("es-CO")}
                        </p>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full bg-[#ead8b8] hover:bg-[#d4bc93] text-stone-800 flex items-center justify-center font-bold text-xs border border-[#b99a70]"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-[#ead8b8] hover:bg-[#d4bc93] text-stone-800 flex items-center justify-center font-bold text-xs border border-[#b99a70]"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation Summary */}
              {cart.length > 0 && (
                <div className="space-y-1 border-t border-dashed border-[#ae9066] pt-2 text-[11px] text-[#493323]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega estimada (350 m)</span>
                    <span className="font-semibold">
                      ${deliveryFee.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-[#ae9066] pt-1.5 text-xs font-extrabold text-[#a84029]">
                    <span>Total estimado</span>
                    <span className="text-lg font-extrabold">
                      ${total.toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                disabled={cart.length === 0}
                onClick={() => setOrderModalOpen(true)}
                className={`w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                  cart.length > 0
                    ? "bg-[#b8442c] hover:bg-[#9b3824] text-white cursor-pointer rotate-[-1deg]"
                    : "bg-[#d3bf9e] text-stone-500 cursor-not-allowed"
                }`}
              >
                <span>¡A comer! →</span>
              </button>
            </div>

            {showReferenceRecipes && sideRecipeDish && renderRecipeCard(sideRecipeDish.name, sideRecipeDish, true)}
            {showReferenceRecipes && renderRecipeCard("Empanadas de carne", undefined, true, false, true)}
          </aside>
        </div>
      </main>

      {/* ── 5. INFINITE COOK & DISH MARQUEE SECTION ── */}
      <section className="menu-paper relative z-10 mx-3 my-12 w-auto overflow-hidden border border-[#9b774f] bg-[#e8d1a3]/95 py-12 text-[#2b2117] shadow-[0_14px_30px_rgba(46,27,13,.34),inset_0_0_24px_rgba(117,78,38,.14)] md:mx-8 [clip-path:polygon(1%_1%,98%_0%,100%_2%,99%_98%,97%_100%,2%_99%,0%_97%,1%_3%)]">
        <div aria-hidden="true" className="absolute left-1/2 top-0 z-20 h-7 w-28 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#52663d] inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dce4ce] border border-[#75865a]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#F0822D]" />
            <span>NUESTRAS COCINERAS Y PLATILLOS ESTRELLA</span>
          </span>
          <h2 className="font-['Caveat',cursive] text-3xl md:text-4xl font-extrabold text-[#2b2117]">
            Comunidad de Sabor Vecinal
          </h2>
          <p className="text-[#5b4a38] text-xs sm:text-sm max-w-xl mx-auto">
            Platos criollos preparados en la mañana por las vecinas de tu conjunto residencial y barrio.
          </p>
        </div>

        {/* Marquee Row 1: Right to Left */}
        <div className="relative w-full overflow-hidden mb-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-left flex gap-6">
            {[...marqueeItemsRow1, ...marqueeItemsRow1].map((item, idx) => (
              <div
                key={`m1-${idx}`}
                className="menu-paper menu-subpaper w-60 shrink-0 bg-[#f5e9d2] border border-[#c4a77d] p-3 flex items-center gap-3 shadow-[0_5px_12px_rgba(73,47,25,.18)] group hover:border-[#C84B31]/60 transition-all cursor-pointer"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#98774e]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-[10px] font-semibold text-[#52663d] block uppercase tracking-wider">{item.badge}</span>
                  <h4 className="font-['Caveat',cursive] text-base font-bold text-[#2b2117] truncate">{item.title}</h4>
                  <p className="text-[11px] text-[#80694d] truncate">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2: Left to Right */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-right flex gap-6">
            {[...marqueeItemsRow2, ...marqueeItemsRow2].map((item, idx) => (
              <div
                key={`m2-${idx}`}
                className="menu-paper menu-subpaper w-60 shrink-0 bg-[#f5e9d2] border border-[#c4a77d] p-3 flex items-center gap-3 shadow-[0_5px_12px_rgba(73,47,25,.18)] group hover:border-[#75865a]/70 transition-all cursor-pointer"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[#98774e]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-[10px] font-semibold text-[#a84029] block uppercase tracking-wider">{item.badge}</span>
                  <h4 className="font-['Caveat',cursive] text-base font-bold text-[#2b2117] truncate">{item.title}</h4>
                  <p className="text-[11px] text-[#80694d] truncate">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. BENTO GRID SECTION (EXACT STRUCTURAL LAYOUT REFERENCE MATCH) ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8 text-[#2b2117]">
        
        {/* Bento Row 1: Large Top Hero Highlight Card (Studio Pley Stuodic -> Experiencia OllaCercana) */}
        <div className="menu-paper relative overflow-hidden border border-[#9b774f] bg-[#e8d1a3] p-8 shadow-[0_14px_30px_rgba(46,27,13,.34),inset_0_0_26px_rgba(117,78,38,.14)] [clip-path:polygon(1%_1%,98%_0%,100%_2%,99%_98%,97%_100%,2%_99%,0%_97%,1%_3%)] flex flex-col md:flex-row items-center justify-between gap-8 md:p-12">
          <div aria-hidden="true" className="absolute left-1/2 top-0 z-20 h-7 w-24 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
          <div className="space-y-4 max-w-xl text-left z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a84029] px-3.5 py-1 bg-[#f3ddc2] border border-[#c88359]/50 inline-block">
              COMIDA DE CASA • A UN PASO DE TU PUERTA
            </span>
            <h2 className="font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2b2117] leading-tight">
              Experiencia OllaCercana: <br />
              <span className="text-[#52663d]">Sabor Auténtico de Barrio</span>
            </h2>
            <p className="text-[#5b4a38] text-xs sm:text-sm leading-relaxed">
              Conectamos el sazón tradicional de las cocineras de tu conjunto residencial con vecinos que buscan almuerzos saludables, caseros y recién hechos todos los días.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("explorar");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-full bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-950/40 cursor-pointer"
              >
                Explorar Platos del Día
              </button>
              <Link
                href="/cocineras-cercanas"
                className="px-6 py-3 rounded-full bg-[#dce4ce] border border-[#75865a]/60 text-[#52663d] hover:bg-[#cdd9b9] font-bold text-xs uppercase tracking-wider transition-all"
              >
                Conocer Cocineras →
              </Link>
            </div>
          </div>

          {/* Right Visual Element (Pot Graphic / Hero Dish Plate) */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 overflow-hidden border-[5px] border-[#d6bd91] shadow-[0_8px_18px_rgba(46,27,13,.28)] shrink-0 group">
            <img src="/images/hero_plate_gourmet.jpg" alt="Pollo Dorado al Romero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b2117]/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-bold text-[#f3ddc2] font-['Caveat',cursive] text-lg">
                Receta de la Abuela Luisa ♡
              </span>
            </div>
          </div>
        </div>

        {/* Bento Row 2: 3 Even Columns (Horere Ckonus, Nobe Fis, Umramed Piliiee) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="menu-paper border border-[#bda078] bg-[#efe0c2] p-6 space-y-3 shadow-[0_8px_18px_rgba(46,27,13,.2)] text-left hover:border-[#C84B31]/60 transition-all">
            <div className="w-10 h-10 bg-[#f3ddc2] border border-[#c88359]/50 flex items-center justify-center text-[#a84029]">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-['Caveat',cursive] font-bold text-xl text-[#2b2117]">1. Explora el Libretón</h3>
            <p className="text-xs text-[#5b4a38] leading-relaxed">
              Consulta las ofertas diarias preparadas por las vecinas de tu sector cada mañana.
            </p>
            <span className="text-[11px] font-bold text-[#a84029] uppercase tracking-wider block pt-2">
              Ver Menú del Día →
            </span>
          </div>

          <div className="menu-paper border border-[#bda078] bg-[#efe0c2] p-6 space-y-3 shadow-[0_8px_18px_rgba(46,27,13,.2)] text-left hover:border-[#75865a]/70 transition-all">
            <div className="w-10 h-10 bg-[#dce4ce] border border-[#75865a]/50 flex items-center justify-center text-[#52663d]">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="font-['Caveat',cursive] font-bold text-xl text-[#2b2117]">2. Reserva Tu Porción</h3>
            <p className="text-xs text-[#5b4a38] leading-relaxed">
              Sin intermediarios ni comisiones abusivas. Paga directo por Nequi o Efectivo.
            </p>
            <span className="text-[11px] font-bold text-[#52663d] uppercase tracking-wider block pt-2">
              Reserva Fácil →
            </span>
          </div>

          <div className="menu-paper border border-[#bda078] bg-[#efe0c2] p-6 space-y-3 shadow-[0_8px_18px_rgba(46,27,13,.2)] text-left hover:border-[#C84B31]/60 transition-all">
            <div className="w-10 h-10 bg-[#dce4ce] border border-[#75865a]/50 flex items-center justify-center text-[#52663d]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-['Caveat',cursive] font-bold text-xl text-[#2b2117]">3. Entrega Vecinal</h3>
            <p className="text-xs text-[#5b4a38] leading-relaxed">
              Recibe tu comida caliente en la portería o puerta de tu departamento.
            </p>
            <span className="text-[11px] font-bold text-[#a84029] uppercase tracking-wider block pt-2">
              Sin Complicaciones →
            </span>
          </div>
        </div>

        {/* Bento Row 3: 3 Image-Heavy Showcase Cards (Oescio, Pos, Wiveest) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-64 overflow-hidden border-[5px] border-[#d6bd91] shadow-[0_8px_18px_rgba(46,27,13,.25)] group">
            <img src="/images/menu_ajiaco.jpg" alt="Ajiaco Santafereño" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b2117]/90 via-[#2b2117]/25 to-transparent p-6 flex flex-col justify-end text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0822D]">SOPAS TRADICIONALES</span>
              <h4 className="font-bold text-lg text-white">Ajiaco Santafereño</h4>
              <p className="text-xs text-stone-300 font-light">Pollo desmechado, 3 tipos de papa, guascas y alcaparras.</p>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden border-[5px] border-[#d6bd91] shadow-[0_8px_18px_rgba(46,27,13,.25)] group">
            <img src="/images/menu_cazuela.jpg" alt="Bandeja Criolla" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b2117]/90 via-[#2b2117]/25 to-transparent p-6 flex flex-col justify-end text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#62B869]">PLATOS DE MONTAÑA</span>
              <h4 className="font-bold text-lg text-white">Bandeja Criolla</h4>
              <p className="text-xs text-stone-300 font-light">Carne jugosa, arroz fresco, plátano maduro y aguacate.</p>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden border-[5px] border-[#d6bd91] shadow-[0_8px_18px_rgba(46,27,13,.25)] group">
            <img src="/images/dish_pollo_chalk.jpg" alt="Pollo Guisado" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b2117]/90 via-[#2b2117]/25 to-transparent p-6 flex flex-col justify-end text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">SAZÓN DE HOGAR</span>
              <h4 className="font-bold text-lg text-white">Pollo Guisado en Salsa</h4>
              <p className="text-xs text-stone-300 font-light">Receta criolla a fuego lento con cilantro fresco.</p>
            </div>
          </div>
        </div>

        {/* Bento Row 4: Lower Asymmetric Block (Buns Conmeap, Saips in Sore, Moabinloes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Block 1: Garantía & Pasos (Buns Conmeap) */}
          <div className="menu-paper lg:col-span-4 border border-[#bda078] bg-[#efe0c2] p-6 text-left space-y-4 shadow-[0_8px_18px_rgba(46,27,13,.2)] flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#52663d]">COMPROMISO OLLACERCANA</span>
              <h4 className="font-['Caveat',cursive] font-bold text-2xl text-[#2b2117]">Comida Real y Saludable</h4>
              <p className="text-xs text-[#5b4a38] leading-relaxed">
                Cada plato es preparado en cocinas familiares que cumplen con altos estándares de higiene y sazón de hogar.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-dashed border-[#ae9066] text-xs text-[#493323]">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#62B869]" />
                <span>100% Ingredientes de la plaza local</span>
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#62B869]" />
                <span>Sin preservantes ni caldos artificiales</span>
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#62B869]" />
                <span>Apoyo directo a mujeres de tu vecindario</span>
              </p>
            </div>
          </div>

          {/* Block 2: 4 Micro Badge Grid (Saips in Sore Seyiaing) */}
          <div className="menu-paper lg:col-span-4 border border-[#bda078] bg-[#efe0c2] p-6 text-left space-y-4 shadow-[0_8px_18px_rgba(46,27,13,.2)] flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#a84029]">PILARES COMUNITARIOS</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#f5e9d2] border border-[#c4a77d] space-y-1">
                <CheckCircle2 className="h-5 w-5 text-[#52663d]" />
                <p className="text-xs font-bold text-[#2b2117]">Higiene</p>
                <p className="text-[10px] text-[#80694d]">Revisión constante</p>
              </div>
              <div className="p-3 bg-[#f5e9d2] border border-[#c4a77d] space-y-1">
                <Home className="h-5 w-5 text-[#52663d]" />
                <p className="text-xs font-bold text-[#2b2117]">Cercanía</p>
                <p className="text-[10px] text-[#80694d]">En tu mismo barrio</p>
              </div>
              <div className="p-3 bg-[#f5e9d2] border border-[#c4a77d] space-y-1">
                <Heart className="h-5 w-5 text-[#a84029]" />
                <p className="text-xs font-bold text-[#2b2117]">Amor</p>
                <p className="text-[10px] text-[#80694d]">Recetas de la abuela</p>
              </div>
              <div className="p-3 bg-[#f5e9d2] border border-[#c4a77d] space-y-1">
                <Bike className="h-5 w-5 text-[#52663d]" />
                <p className="text-xs font-bold text-[#2b2117]">Ecológico</p>
                <p className="text-[10px] text-[#80694d]">Entregas a pie</p>
              </div>
            </div>
          </div>

          {/* Block 3: Historias de Hogar (Moabinloes) */}
          <div className="lg:col-span-4 relative overflow-hidden border-[5px] border-[#d6bd91] shadow-[0_8px_18px_rgba(46,27,13,.25)] group min-h-[220px]">
            <img src="/images/dona_rosa_mascot.jpg" alt="Doña Rosa Mascot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b2117]/90 via-[#2b2117]/40 to-transparent p-6 flex flex-col justify-end text-left space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#dce4ce]">TESTIMONIO DE HOGAR</span>
              <p className="text-xs font-serif italic text-stone-200">
                “Cocinar para mis vecinos es compartir el amor de mi familia. Cada plato lleva lo mejor de mí.”
              </p>
              <p className="text-xs font-bold text-[#F0822D] pt-1">— Doña Rosa, Cocinera Vecinal</p>
            </div>
          </div>
        </div>

        {/* Bottom Banner Callout: Únete como Cocinera */}
        <div className="menu-paper relative overflow-hidden border border-[#9b774f] bg-[#e8d1a3] p-8 shadow-[0_12px_26px_rgba(46,27,13,.3)] [clip-path:polygon(1%_1%,98%_0%,100%_2%,99%_98%,97%_100%,2%_99%,0%_97%,1%_3%)] flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div aria-hidden="true" className="absolute -top-1 left-1/2 z-20 h-6 w-24 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm" />
          <div className="space-y-1">
            <h3 className="font-['Caveat',cursive] text-2xl font-bold text-[#2b2117]">¿Eres apasionada por la cocina casera?</h3>
            <p className="text-xs text-[#5b4a38]">
              Únete a nuestra red de cocineras de barrio y comparte tu sazón con los vecinos de tu conjunto.
            </p>
          </div>
          <Link
            href="/cuenta"
            className="px-6 py-3.5 rounded-full bg-[#F0822D] hover:bg-[#d97224] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shrink-0"
          >
            Unirme como Cocinera →
          </Link>
        </div>
      </section>

      {/* ── CHECKOUT ORDER CONFIRMATION MODAL ── */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-stone-300 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F0822D] flex items-center justify-center mx-auto">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Tu pedido está en la canasta
              </h3>
              <p className="text-xs text-stone-500">
                Esta lista todavía no envía pedidos. Elige una cocinera cercana para revisar su oferta y crear una reserva.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-stone-700">
                  <span>
                    {item.quantity}x {item.name} ({item.cook})
                  </span>
                  <span className="font-bold">
                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-2 flex justify-between font-extrabold text-[#C84B31] text-sm">
                <span>Total estimado</span>
                <span>${total.toLocaleString("es-CO")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/cocineras-cercanas"
                onClick={() => {
                  window.localStorage.setItem("ollacercana_menu_cart", JSON.stringify(cart));
                  setOrderModalOpen(false);
                }}
                className="w-full py-3.5 rounded-full bg-[#62B869] hover:bg-[#529d58] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>Buscar cocinera y reservar</span>
              </Link>

              <button
                onClick={() => setOrderModalOpen(false)}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800"
              >
                Seguir pidiendo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── JIRA SPECIFICATION MODALS ── */}
      <ReservePortionModal
        isOpen={!!reserveModalDish}
        onClose={() => setReserveModalDish(null)}
        dish={reserveModalDish}
        currentUser={currentUser}
        onReservationCreated={(resId) => {
          setStoredDishesList(getStoredDishes());
          setChatReservationId(resId);
        }}
        onRequestPhoneVerification={() => setPhoneVerifyOpen(true)}
      />

      <ReputationModal
        isOpen={!!reputationCook}
        onClose={() => setReputationCook(null)}
        cookName={reputationCook?.name || "Cocinera"}
        cookAvatar={reputationCook?.avatar}
        cookId={reputationCook?.id}
      />

      <ReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetTitle={reportTarget?.title || ""}
        targetId={reportTarget?.id || ""}
        targetType={reportTarget?.type || "publicacion"}
        currentUser={currentUser}
      />

      <ChatModal
        isOpen={!!chatReservationId}
        onClose={() => setChatReservationId(null)}
        reservationId={chatReservationId}
        currentUser={currentUser}
        onOpenRatingModal={(resId, cId) => setRatingTarget({ reservationId: resId, cookId: cId })}
      />

      <PhoneVerificationModal
        isOpen={phoneVerifyOpen}
        onClose={() => setPhoneVerifyOpen(false)}
        phone={currentUser.phone}
        onVerified={() => {
          currentUser.phoneVerified = true;
        }}
      />

      <RatingModal
        isOpen={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        reservationId={ratingTarget?.reservationId || ""}
        cookId={ratingTarget?.cookId || ""}
        currentUser={currentUser}
      />
    </div>
  );
}
