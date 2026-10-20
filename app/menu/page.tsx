"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import OllaVerdeStamp from "@/components/OllaVerdeStamp";
import {
  getStoredDishes,
  getStoredReviews,
  sharesResidentialComplex,
  DishItem,
  Review,
  UserProfile,
} from "@/lib/ollacercana-store";
import ReputationModal from "@/components/modals/ReputationModal";
import ReportModal from "@/components/modals/ReportModal";
import ChatModal from "@/components/modals/ChatModal";
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
  Compass,
  CookingPot,
  Bike,
  ShieldCheck,
  Leaf,
  Footprints,
  Users,
  Recycle,
  X,
  ZoomIn,
  Settings,
  Menu,
  Wallet,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  cook: string;
  price: number;
  image: string;
  quantity: number;
  dishId?: string;
  residentialComplex?: string;
}

export default function MenuPage() {
  const router = useRouter();
  const [menuTheme, setMenuTheme] = useState<"light" | "dark">("light");
  const [themeReady, setThemeReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "rating-desc" | "reviews-desc">("recommended");
  const [minimumRating, setMinimumRating] = useState(0);
  const [reviewSentiment, setReviewSentiment] = useState<"all" | "positive" | "negative">("all");
  const [featuredCooksOnly, setFeaturedCooksOnly] = useState(false);
  const [publishedReviews, setPublishedReviews] = useState<Review[]>([]);
  const [withinTwoKm, setWithinTwoKm] = useState(true);
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storedDishesList, setStoredDishesList] = useState<DishItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [storyboardOpen, setStoryboardOpen] = useState(false);
  const [recipeToShow, setRecipeToShow] = useState<string | null>(null);

  // Spec Modal States
  const [reputationCook, setReputationCook] = useState<{ name: string; avatar: string; id: string } | null>(null);
  const [reportTarget, setReportTarget] = useState<{ title: string; id: string; type: "publicacion" | "usuario" } | null>(null);
  const [chatReservationId, setChatReservationId] = useState<string | null>(null);
  const [ratingTarget, setRatingTarget] = useState<{ reservationId: string; cookId: string } | null>(null);

  // El usuario inicia como null (sin sesión activa)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  React.useEffect(() => {
    setStoredDishesList(getStoredDishes());
    setPublishedReviews(getStoredReviews().filter((review) => review.status !== "Pendiente"));
    try {
      const storedUser = window.localStorage.getItem("ollacercana_user");
      const parsedUser = storedUser ? (JSON.parse(storedUser) as UserProfile & { isLoggedIn?: boolean }) : null;
      if (parsedUser?.isLoggedIn) {
        setIsAuthenticated(true);
        setCurrentUser(parsedUser);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
    const savedTheme = window.localStorage.getItem("ollacercana_menu_theme");
    if (savedTheme === "dark" || savedTheme === "light") setMenuTheme(savedTheme);
    setThemeReady(true);
  }, []);

  React.useEffect(() => {
    if (themeReady) window.localStorage.setItem("ollacercana_menu_theme", menuTheme);
  }, [menuTheme, themeReady]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);

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
      cookAvatar: "https://images.unsplash.com/photo-1556911073-a517e752729c?auto=format&fit=crop&crop=faces&w=480&h=480&q=85",
      rating: "4,9",
      reviews: "120",
      distance: "A 350 m",
      residentialComplex: "Conjunto San Luis",
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
      cookAvatar: "/images/comunidad/vecino_1.jpg",
      rating: "4,8",
      reviews: "95",
      distance: "A 600 m",
      residentialComplex: "Torres de Chapinero",
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
      cookAvatar: "https://images.unsplash.com/photo-1635368892977-0100146f12bb?auto=format&fit=crop&crop=faces&w=480&h=480&q=85",
      rating: "4,8",
      reviews: "87",
      distance: "A 800 m",
      residentialComplex: "Conjunto El Rosal",
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
      cookAvatar: "https://images.unsplash.com/photo-1756061010801-55a394340f41?auto=format&fit=crop&crop=faces&w=480&h=480&q=85",
      rating: "4,7",
      reviews: "73",
      distance: "A 1,2 km",
      residentialComplex: "Altos del Salitre",
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
      cookAvatar: "/images/comunidad/vecino_4.jpg",
      rating: "4,9",
      reviews: "101",
      distance: "A 1,1 km",
      residentialComplex: "Residencias Colina",
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
      cookAvatar: "https://images.unsplash.com/photo-1489089905289-5c91ae6e2544?auto=format&fit=crop&crop=faces&w=480&h=480&q=85",
      rating: "4,8",
      reviews: "64",
      distance: "A 900 m",
      residentialComplex: "Bosques de Granada",
    },
  ];

  const addToCart = (dish: DishItem | (typeof dishes)[0]) => {
    if (!requireAuthentication()) return;
    setCart((prev) => {
      const numId = typeof dish.id === "number" ? dish.id : parseInt(String(dish.id).replace(/\D/g, "")) || 999;
      const existing = prev.find((item) => item.id === numId);
      if (existing) {
        return prev.map((item) =>
            item.id === numId ? { ...item, quantity: item.quantity + 1, residentialComplex: dish.residentialComplex } : item
        );
      }
      return [
        ...prev,
        {
          id: numId,
          name: dish.name,
          cook: dish.cook,
          price: dish.price,
          image: dish.image,
          quantity: 1,
          dishId: String(dish.id),
          residentialComplex: dish.residentialComplex,
        },
      ];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    if (delta > 0 && !requireAuthentication()) return;
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

  const dynamicDishes: DishItem[] =
      storedDishesList.length > 0
          ? storedDishesList
          : dishes.map((d) => ({
            id: `dish-${d.id}`,
            name: d.name,
            category: d.category as any,
            dietaryTags: (d.category === "Vegetariano"
                ? ["Vegetariano", "Vegano"]
                : d.name.includes("Pollo")
                    ? ["Sin Gluten"]
                    : []) as any,
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
            residentialComplex: d.residentialComplex,
            totalPortions: 5,
            availablePortions: d.badge === "Quedan 5" ? 5 : d.name.includes("Lentejas") ? 1 : 4,
            reservedPortions: 1,
            status: "DISPONIBLE" as const,
            description: "Delicioso plato casero preparado hoy.",
            createdAt: new Date().toISOString(),
          }));

  const cookReviewsFor = (dish: DishItem) => publishedReviews.filter((review) => review.cookId === dish.cookId);
  const getDishRating = (dish: DishItem) => Number.parseFloat(String(dish.rating).replace(",", ".")) || 0;
  const isFeaturedCook = (dish: DishItem) => {
    const reviews = cookReviewsFor(dish);
    if (!reviews.length) return false;
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return average >= 4.8 && reviews.length >= 3;
  };

  const filteredDishes = dynamicDishes
      .filter((dish) => {
        const matchesCategory =
            activeFilter === "Todos" || activeFilter === "Filtros" || dish.category === activeFilter;
        const matchesTag =
            selectedDietaryTag === "Todos" ||
            (dish.dietaryTags && dish.dietaryTags.includes(selectedDietaryTag as any));
        const matchesSearch =
            dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.cook.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAvailability = !availableOnly || (dish.status === "DISPONIBLE" && dish.availablePortions > 0);
        const matchesDistance = !withinTwoKm || dish.distanceMeters <= 2000;
        const matchesRating = getDishRating(dish) >= minimumRating;
        const cookReviews = cookReviewsFor(dish);
        const matchesSentiment =
            reviewSentiment === "all" ||
            cookReviews.some((review) => (reviewSentiment === "positive" ? review.rating >= 4 : review.rating <= 2));
        const matchesFeatured = !featuredCooksOnly || isFeaturedCook(dish);
        return (
            matchesCategory &&
            matchesTag &&
            matchesSearch &&
            matchesAvailability &&
            matchesDistance &&
            matchesRating &&
            matchesSentiment &&
            matchesFeatured
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "rating-desc") return getDishRating(b) - getDishRating(a);
        if (sortBy === "reviews-desc") return b.reviews - a.reviews;
        return 0;
      });

  const recipeNotes: Record<
      string,
      {
        badge: string;
        ingredients: string[];
        steps: string[];
        price: string;
        phrase: string;
        image?: string;
      }
  > = {
    "Ajiaco de la casa": {
      badge: "El sabor de Bogotá",
      ingredients: [
        "1 pollo (en piezas)",
        "3 papas (picas)",
        "1 mazorca de maíz",
        "1 cebolla larga; 2 dientes de ajo",
        "1 rama de cilantro; sal, pimienta y aguacate (opcional)",
      ],
      steps: [
        "En una olla grande, cocina el pollo con agua, sal y un diente de ajo. Cuando esté listo, retíralo y desmenúzalo.",
        "En el mismo caldo, añade las papas, la mazorca y la cebolla larga. Cocina hasta que estén tiernas.",
        "Incorpora el pollo y el cilantro picado. Ajusta la sal y la pimienta.",
      ],
      price: "$18.000",
      phrase: "Un plato lleno de tradición",
      image: "/images/menu_ajiaco.jpg",
    },
    "Bandeja casera": {
      badge: "Tradición en cada bocado",
      ingredients: [
        "Frijoles de la casa",
        "Chicharrón crocante",
        "Arroz y arepa",
        "Aguacate",
        "Tajadas de plátano (opcional)",
      ],
      steps: [
        "Cocina los frijoles con especias.",
        "Fríe el chicharrón hasta que quede crocante y prepara el arroz con las tajadas de plátano.",
        "Sirve todo junto con aguacate.",
      ],
      price: "$22.000",
      phrase: "Comida típica que enamora",
      image: "/images/menu_cazuela.jpg",
    },
    "Pollo guisado": {
      badge: "Sabor casero de siempre",
      ingredients: [
        "1 pollo (en piezas)",
        "1 cebolla y 2 tomates",
        "1 zanahoria y 2 papas",
        "Ajo, comino, sal y pimienta",
        "Aceite",
      ],
      steps: [
        "Sofríe la cebolla, el ajo y el tomate.",
        "Añade el pollo y dóralo. Incorpora la zanahoria, las papas y agua.",
        "Cocina a fuego medio hasta que esté tierno. Ajusta la sal, la pimienta y el comino.",
      ],
      price: "$17.000",
      phrase: "Hecho con mucho cariño",
      image: "/images/dish_pollo_chalk.jpg",
    },
    "Lentejas con arroz": {
      badge: "Nutritivo y delicioso",
      ingredients: [
        "1 taza de lentejas",
        "1/2 taza de arroz",
        "1 cebolla y 1 tomate",
        "1 zanahoria",
        "Ajo, sal, pimienta y laurel",
      ],
      steps: [
        "Lava las lentejas y ponlas a cocinar. Sofríe la cebolla, el tomate y la zanahoria.",
        "Añade las lentejas, el arroz y el laurel. Deja cocinar hasta que todo esté tierno.",
        "Ajusta la sal y la pimienta.",
      ],
      price: "$15.000",
      phrase: "Simple, pero muy bueno",
    },
    "Sancocho de pollo": {
      badge: "Calientito y tradicional",
      ingredients: [
        "Pollo (en piezas)",
        "Yuca y plátano verde",
        "Papa y mazorca de maíz",
        "Cebolla, ajo y cilantro",
        "Sal y pimienta",
      ],
      steps: [
        "Cocina el pollo con agua, cebolla, ajo y sal.",
        "Añade la yuca, el plátano, la papa y la mazorca. Cocina a fuego medio hasta que estén tiernos.",
        "Rectifica la sazón y agrega cilantro al final.",
      ],
      price: "$17.000",
      phrase: "El sabor de la finca",
      image: "/images/olla_dish_1.jpg",
    },
    "Arroz con leche": {
      badge: "Un clásico de la casa",
      ingredients: [
        "1 taza de arroz",
        "1 litro de leche",
        "1/2 taza de azúcar",
        "1 rama de canela",
        "Vainilla y pasas (opcional)",
      ],
      steps: [
        "Lava el arroz y ponlo a cocinar con la leche. Añade la canela y el azúcar.",
        "Revuelve constantemente para que no se pegue.",
        "Cuando esté cremoso, agrega vainilla y pasas. Deja enfriar y sirve.",
      ],
      price: "$10.000",
      phrase: "Un postre de siempre",
      image: "/images/menu_postre.jpg",
    },
    "Arepas con queso": {
      badge: "El gusto de lo simple",
      ingredients: ["Maíz amarillo", "Agua", "Sal", "Queso campesino o costeño", "Mantequilla (opcional)"],
      steps: [
        "Mezcla el maíz con agua y sal.",
        "Forma las arepas y cocina en sartén o parrilla.",
        "Añade el queso, deja que se derrita y sirve caliente.",
      ],
      price: "$8.000",
      phrase: "Tradición en cada mordida",
    },
    "Empanadas de carne": {
      badge: "Crujientes y deliciosas",
      ingredients: ["Harina de maíz", "Carne molida", "Cebolla y pimentón", "Huevo", "Sal y especias"],
      steps: [
        "Sofríe la carne con la cebolla y el pimentón.",
        "Forma las empanadas con la masa, rellena y cierra bien.",
        "Fríe u hornea hasta que estén doradas.",
      ],
      price: "$12.000",
      phrase: "Un bocado de felicidad",
    },
  };

  const requireAuthentication = () => {
    if (isAuthenticated) return true;
    setAuthPromptOpen(true);
    return false;
  };

  const openReservation = (dish: DishItem) => {
    if (!requireAuthentication()) return;
    const numericId = typeof dish.id === "number" ? dish.id : parseInt(String(dish.id).replace(/\D/g, ""), 10) || 999;
    const existing = cart.find((item) => item.id === numericId);
    const nextCart = existing
        ? cart.map((item) =>
            item.id === numericId
                ? { ...item, quantity: item.quantity + 1, residentialComplex: dish.residentialComplex }
                : item
        )
        : [
          ...cart,
          {
            id: numericId,
            dishId: String(dish.id),
            name: dish.name,
            cook: dish.cook,
            price: dish.price,
            image: dish.image,
            quantity: 1,
            residentialComplex: dish.residentialComplex,
          },
        ];
    setCart(nextCart);
    window.localStorage.setItem("ollacercana_menu_cart", JSON.stringify(nextCart));
    router.push("/pedido");
  };

  const openOrder = () => {
    if (!requireAuthentication()) return;
    router.push("/pedido");
  };

  React.useEffect(() => {
    const handleAssistantRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ intent: "add" | "reserve"; dish: string }>).detail;
      const normalizedDish = detail.dish
          .toLocaleLowerCase("es")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      const dish = dynamicDishes.find((item) => {
        const normalizedName = item.name
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        return (
            normalizedName === normalizedDish ||
            normalizedName.includes(normalizedDish) ||
            normalizedDish.includes(normalizedName)
        );
      });
      const sendResult = (success: boolean, reason?: string) =>
          window.dispatchEvent(
              new CustomEvent("ollacercana:assistant-result", { detail: { ...detail, success, reason } })
          );

      if (!dish) {
        sendResult(false, "not-found");
        return;
      }
      if (dish.status !== "DISPONIBLE" || dish.availablePortions <= 0) {
        sendResult(false, "unavailable");
        return;
      }
      if (!requireAuthentication()) {
        sendResult(false, "login");
        return;
      }
      if (detail.intent === "add") addToCart(dish);
      else openReservation(dish);
      sendResult(true);
    };

    window.addEventListener("ollacercana:assistant-request", handleAssistantRequest);
    return () => window.removeEventListener("ollacercana:assistant-request", handleAssistantRequest);
  }, [dynamicDishes, isAuthenticated]);

  React.useEffect(() => {
    if (!cartReady) return;
    const params = new URLSearchParams(window.location.search);
    const intent = params.get("ayudaAccion");
    const dish = params.get("plato");
    if ((intent !== "add" && intent !== "reserve") || !dish) return;

    window.history.replaceState(null, "", "/menu");
    window.dispatchEvent(new CustomEvent("ollacercana:assistant-request", { detail: { intent, dish } }));
  }, [cartReady, dynamicDishes, isAuthenticated]);

  const showReferenceRecipes =
      activeFilter === "Todos" &&
      selectedDietaryTag === "Todos" &&
      searchQuery.trim() === "" &&
      !availableOnly &&
      sortBy === "recommended" &&
      withinTwoKm &&
      minimumRating === 0 &&
      reviewSentiment === "all" &&
      !featuredCooksOnly;
  const sideRecipeDish = showReferenceRecipes
      ? filteredDishes.find((dish) => dish.name === "Lentejas con arroz")
      : undefined;
  const mainRecipeDishes = showReferenceRecipes
      ? filteredDishes.filter((dish) => dish.name !== "Lentejas con arroz")
      : filteredDishes;

  const renderRecipeCard = (name: string, dish?: DishItem, compact = false, featured = false, lowerRow = false) => {
    const sameCommunity = Boolean(
        dish && sharesResidentialComplex(currentUser?.residentialComplex, dish.residentialComplex)
    );
    const isSeedRecipe = /^dish-[1-6]$/.test(dish?.id ?? "");
    const note =
        (isSeedRecipe ? recipeNotes[name] : undefined) ??
        (dish
            ? {
              badge: dish.badge || "De la cocina del barrio",
              ingredients: [],
              steps: [],
              price: dish.formattedPrice,
              phrase: `Preparado por ${dish.cook}`,
              image: dish.image,
            }
            : undefined);
    if (!note) return null;
    const image = note.image;
    const price = dish?.formattedPrice || note.price || `$${dish?.price.toLocaleString("es-CO") ?? ""}`;

    return (
        <article
            key={dish?.id ?? name}
            className={`relative overflow-visible rounded-[3px] bg-[#93724d] p-1 pt-3 shadow-[0_8px_15px_rgba(47,25,12,.3)] transition-transform hover:-translate-y-1 hover:rotate-0 ${
                compact
                    ? lowerRow
                        ? name === "Empanadas de carne"
                            ? "min-h-[273px]"
                            : "min-h-[293px]"
                        : "min-h-[230px]"
                    : featured
                        ? "min-h-[350px]"
                        : "min-h-[250px]"
            }`}
            style={{
              transform: `rotate(${
                  ["Ajiaco de la casa", "Pollo guisado", "Arroz con leche", "Empanadas de carne"].includes(name)
                      ? "-0.8deg"
                      : "0.7deg"
              })`,
              backgroundImage:
                  "linear-gradient(145deg,rgba(87,51,26,.95),rgba(56,33,18,.96)), repeating-linear-gradient(8deg,rgba(37,22,13,.18) 0 2px,transparent 2px 8px)",
            }}
        >
          <div
              aria-hidden="true"
              className="absolute -top-1 left-1/2 z-20 h-6 w-[72px] -translate-x-1/2 -rotate-2 border-x border-[#bda06a]/70 bg-[#d8bd82]/90 shadow-sm"
          />
          <div
              className={`menu-paper relative flex h-full flex-col bg-[#efe0c2] p-2.5 pb-2 text-[#2b2117] shadow-[inset_0_0_18px_rgba(117,78,38,.18)] [clip-path:polygon(1%_1%,97%_0%,100%_3%,99%_97%,96%_100%,3%_99%,0%_96%,1%_4%)] ${
                  compact
                      ? lowerRow
                          ? name === "Empanadas de carne"
                              ? "min-h-[265px]"
                              : "min-h-[285px]"
                          : "min-h-[222px]"
                      : featured
                          ? "min-h-[334px]"
                          : "min-h-[242px]"
              }`}
              style={{
                backgroundImage:
                    "radial-gradient(ellipse at 12% 12%,rgba(255,250,225,.52),transparent 38%),radial-gradient(ellipse at 90% 88%,rgba(164,120,65,.14),transparent 42%),repeating-linear-gradient(2deg,rgba(91,69,43,.025) 0 1px,transparent 1px 4px)",
              }}
          >
            <div className={`relative pr-[27%] ${compact ? "min-h-[38px]" : "min-h-[42px]"}`}>
              <h3
                  className={`font-['Caveat',cursive] font-bold leading-[.86] tracking-tight text-[#2b2117] ${
                      compact ? "text-[20px]" : "text-[22px]"
                  }`}
              >
                {name}
              </h3>
              <div className="mt-1 h-[2px] w-[88%] -rotate-[2deg] bg-[#5b4a38]" />
              <div className="absolute right-0 top-0 max-w-[29%] -rotate-3 text-center font-['Caveat',cursive] text-[13px] leading-[.9] text-[#5b4a38]">
                <span className="mr-1 text-[#c84b31]">•</span>
                {note.badge}
              </div>
            </div>

            <div
                className={`relative mt-1 grid items-center gap-2 ${
                    compact
                        ? "grid-cols-[minmax(0,1fr)_64px] xl:grid-cols-[minmax(0,1fr)_92px]"
                        : "grid-cols-[minmax(0,1fr)_70px] xl:grid-cols-[minmax(0,1fr)_104px]"
                }`}
            >
              <div
                  className={`min-w-0 font-['Caveat',cursive] ${
                      compact || featured ? "text-[12px] leading-tight" : "text-[13px] leading-tight"
                  }`}
              >
                <p className="line-clamp-1 text-[#5b4a38]">
                  {dish?.description || `Preparado en casa por ${dish?.cook || "una cocinera del barrio"}.`}
                </p>
                {dish ? (
                    <Link
                        href={`/cocineras/${dish.cookId}`}
                        className="mt-1 block truncate text-[12px] font-bold text-[#52663d] underline decoration-dotted underline-offset-2 hover:text-[#a84029]"
                    >
                      Por {dish.cook}
                    </Link>
                ) : (
                    <p className="mt-1 truncate text-[12px] font-bold text-[#52663d]">Por cocina vecina</p>
                )}
              </div>
              <div
                  className={`relative mt-2 overflow-hidden rounded-[47%_53%_51%_49%/45%_42%_58%_55%] border-[3px] border-[#6b5037] bg-[#e6d4b0] shadow-[0_3px_5px_rgba(66,43,24,.25)] ${
                      compact ? "h-[64px] w-[64px] xl:h-[92px] xl:w-[92px]" : "h-[70px] w-[70px] xl:h-[104px] xl:w-[104px]"
                  }`}
              >
                {image ? (
                    <Image src={image} alt={name} fill sizes="94px" className="object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_25%,#f3e7ce,#cbb58e)] p-2 text-center font-['Caveat',cursive] text-[12px] leading-tight text-[#735b3d] xl:text-[14px]">
                      Foto pendiente
                    </div>
                )}
              </div>
            </div>

            {dish && (
                <button
                    type="button"
                    onClick={() => setRecipeToShow(name)}
                    className="mt-1 self-start border-b border-dashed border-[#806747] font-['Caveat',cursive] text-sm font-bold text-[#6a5037] transition hover:text-[#a84029] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B31]"
                >
                  Ver en el recetario →
                </button>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-1">
              <div className="flex min-w-0 items-center gap-1.5 rounded-md border border-[#75865a]/60 bg-[#dce4ce] px-2 py-0.5 text-[10px] font-bold text-[#42542e]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                <span>Cocina limpia & manipulación verificada</span>
              </div>
              {dish && <OllaVerdeStamp residentialComplex={dish.residentialComplex} compact={compact} />}
              {sameCommunity && (
                  <span
                      title={`Cocinera y comprador pertenecen a ${dish?.residentialComplex}`}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#687a49] bg-[#f2edcf] px-2 py-0.5 text-[10px] font-extrabold text-[#43552e]"
                  >
                <Home className="h-3 w-3" /> Mismo conjunto
              </span>
              )}
            </div>

            {dish && (
                <div className="mt-1 grid grid-cols-2 gap-1 rounded-lg border border-[#aa8b5e] bg-[#f7eddb] p-1.5 font-sans text-[10px] leading-tight text-[#493323]">
                  <div className="flex min-w-0 items-start gap-1.5 rounded-md bg-white/65 px-1.5 py-1">
                    <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-[#a84029]" />
                    <span className="min-w-0">
                  <span className="block font-semibold text-[#80694d]">Distancia aproximada</span>
                  <span className="block truncate font-bold">{dish.distance?.trim() || "Por confirmar"}</span>
                </span>
                  </div>
                  <div className="flex min-w-0 items-start gap-1.5 rounded-md bg-white/65 px-1.5 py-1">
                    <Home className="mt-px h-3.5 w-3.5 shrink-0 text-[#52663d]" />
                    <span className="min-w-0">
                  <span className="block font-semibold text-[#80694d]">Conjunto</span>
                  <span className="block truncate font-bold" title={dish.residentialComplex}>
                    {dish.residentialComplex?.trim() || "Por confirmar"}
                  </span>
                </span>
                  </div>
                </div>
            )}

            {dish && !compact && (
                <div className="mt-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    {["Efectivo", "Nequi", "Llaves"].map((method) => (
                        <span
                            key={method}
                            className="inline-flex items-center gap-1 rounded-full border border-[#aa8b5e] bg-[#f7eddb] px-2 py-0.5 text-[9px] font-bold text-[#5b4a38]"
                        >
                    <Wallet className="h-2.5 w-2.5 text-[#80694d]" />
                          {method}
                  </span>
                    ))}
                  </div>
                  <p className="text-[9px] leading-tight text-[#80694d]">
                    El dinero se entrega directamente a la cocinera en efectivo o transferencia acordada.
                  </p>
                </div>
            )}

            <div className="mt-auto flex items-end justify-between gap-2 border-t border-dashed border-[#aa8b5e] pt-1.5">
              {dish ? (
                  <button
                      onClick={() => openReservation(dish)}
                      aria-label={`Reservar ${dish.name} por ${price} por porción`}
                      title="Consultar disponibilidad y reservar"
                      className={`font-['Caveat',cursive] font-bold leading-none text-[#5b3020] underline decoration-[#5b3020] decoration-1 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B31] ${
                          compact ? "text-[22px]" : "text-[25px]"
                      }`}
                  >
                    {price}
                  </button>
              ) : (
                  <span
                      className={`font-['Caveat',cursive] font-bold leading-none text-[#5b3020] underline decoration-[#5b3020] decoration-1 underline-offset-2 ${
                          compact ? "text-[22px]" : "text-[25px]"
                      }`}
                  >
                {price}
              </span>
              )}
              <span className="font-['Caveat',cursive] text-[13px] leading-none text-[#5b4a38]">/ Porción</span>
            </div>

            {dish && (
                <div className="mt-2 flex items-center justify-between gap-1.5 pt-1.5 border-t border-dashed border-[#aa8b5e]">
                  <button
                      onClick={() => addToCart(dish)}
                      className="flex-1 py-1.5 px-2.5 rounded-full bg-[#C84B31] hover:bg-[#a83e29] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                  <button
                      type="button"
                      onClick={() => openReservation(dish)}
                      className="flex-1 rounded-full border border-[#75865a]/60 bg-[#dce4ce] px-2.5 py-1.5 text-xs font-bold text-[#42542e] shadow-sm transition-all hover:bg-[#cdd9b9] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#42542e]"
                      aria-label={`Reservar ${dish.name} con ${dish.cook}`}
                  >
                    Reservar
                  </button>
                </div>
            )}

            <div
                className={`mt-1 flex items-center gap-1 font-['Caveat',cursive] italic leading-none text-[#5b4a38] ${
                    compact ? "text-[12px]" : "text-[15px]"
                }`}
            >
              <Heart className="h-3.5 w-3.5 shrink-0 stroke-[1.7]" />
              <span>{note.phrase}</span>
            </div>

            {dish && (
                <div className="sr-only">
                  <button onClick={() => setReportTarget({ title: dish.name, id: dish.id, type: "publicacion" })}>
                    Reportar {dish.name}
                  </button>
                  <button
                      onClick={() => setReputationCook({ name: dish.cook, avatar: dish.cookAvatar, id: dish.cookId })}
                  >
                    Ver reputación de {dish.cook}
                  </button>
                </div>
            )}
          </div>
        </article>
    );
  };

  return (
      <div
          data-theme-page
          data-menu-theme={menuTheme}
          className="menu-theme-root relative min-h-screen overflow-x-clip bg-[#cba679] font-['Patrick_Hand',cursive] text-[#35251a] selection:bg-[#C84B31] selection:text-white"
      >
        <style jsx global>{`
        [data-menu-theme="dark"] {
          color-scheme: dark;
        }
        [data-menu-theme="dark"] .menu-paper {
          background-color: #3a3025 !important;
          border-color: #715a3e !important;
          color: #f0e3ce !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.38), inset 0 0 22px rgba(0, 0, 0, 0.18) !important;
        }
        [data-menu-theme="dark"] .menu-paper :is(h1, h2, h3, h4, p, li, span) {
          color: #f0e3ce !important;
        }
        [data-menu-theme="dark"] .menu-paper .menu-accent {
          color: #c9d6a8 !important;
        }
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
        [data-menu-theme="dark"] .menu-paper input {
          background-color: #493b2d !important;
          color: #f0e3ce !important;
        }
      `}</style>

        {/* Fondo de madera cálida */}
        <div
            aria-hidden="true"
            className={`fixed inset-0 z-0 bg-[#cba679] bg-cover bg-center bg-no-repeat transition-[filter] duration-300 ${
                menuTheme === "dark" ? "brightness-[.58]" : ""
            }`}
            style={{ backgroundImage: "url('/images/libreton_bg_tiles_ref.png')" }}
        />

        {/* ── 1. BARRA SUPERIOR ── */}
        <header className="menu-paper sticky top-0 z-40 border-b border-[#a67b50]/50 bg-[#f5e9d2]/75 px-3 py-2 shadow-[0_3px_12px_rgba(44,23,11,.18)] backdrop-blur-md sm:px-4 md:px-8">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-1 sm:gap-4">
            <Link href="/" className="group shrink-0 flex items-center">
              <BrandLogo size="sm" showTagline={false} />
            </Link>

            <div
                className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#b99770]/65 bg-[#f6ead4]/75 px-3 py-1.5 text-xs font-semibold text-[#453321] sm:flex"
                aria-label="Zona de muestra"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>Bogotá · Zona de muestra</span>
            </div>

            <label className="relative hidden min-w-[180px] max-w-[270px] flex-1 lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#795f43]" />
              <input
                  aria-label="Buscar platos"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca un plato..."
                  className="w-full rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 py-2 pl-9 pr-3 font-['Patrick_Hand',cursive] text-sm text-[#493323] placeholder:text-[#80694d] focus:outline-none focus:ring-2 focus:ring-[#c84b31]/50"
              />
            </label>

            <nav className="hidden items-center gap-5 whitespace-nowrap text-xs font-semibold text-[#453321] xl:flex">
              <a href="#explorar" className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors">
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
              <Link href="/cocineras" className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors">
                <Users className="w-3.5 h-3.5" />
                <span>Nuestras cocineras</span>
              </Link>
              <Link
                  href="/cuenta/reservas"
                  className="flex items-center gap-1.5 hover:text-[#C84B31] transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Mis pedidos</span>
              </Link>
            </nav>

            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={mobileMenuOpen}
                aria-controls="menu-mobile-nav"
                aria-label="Abrir menú de navegación"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 px-3 text-xs font-bold text-[#453321] transition-colors hover:bg-[#fff6e8] xl:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Link
                  href="/cuenta/ajustes"
                  aria-label="Abrir ajustes"
                  title="Ajustes"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 text-[#493323] transition-colors hover:bg-[#fff6e8] sm:h-9 sm:w-9"
              >
                <Settings className="h-4 w-4" />
              </Link>

              <a
                  href="#cart-section"
                  aria-label={`Ir a tu pedido. ${totalCartCount} porciones en la canasta.`}
                  className="relative rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 p-1.5 text-[#453321] transition-colors hover:bg-[#fff6e8] sm:p-2"
              >
                <ShoppingBag className="h-4 w-4 text-[#493323] sm:h-5 sm:w-5" />
                {totalCartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#C84B31] text-[10px] font-bold text-white shadow-xs">
                  {totalCartCount}
                </span>
                )}
              </a>

              {/* BOTÓN DINÁMICO: Iniciar sesión O Perfil del usuario */}
              {isAuthenticated && currentUser ? (
                  <Link
                      href="/cuenta/perfil"
                      className="flex items-center gap-1 rounded-full border border-[#b99770]/60 bg-[#fff7e9]/75 py-1 pl-1 pr-1.5 text-xs font-semibold text-[#453321] transition-colors hover:bg-[#fff6e8] sm:gap-2 sm:pl-1.5 sm:pr-2.5"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden relative border border-stone-300">
                      <Image
                          src={currentUser.avatar || "/images/comunidad/vecino_2.jpg"}
                          alt={currentUser.name}
                          fill
                          className="object-cover"
                      />
                    </div>
                    <span className="hidden md:inline truncate max-w-[110px]">{currentUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-stone-500" />
                  </Link>
              ) : (
                  <Link
                      href="/cuenta"
                      aria-label="Iniciar sesión"
                  className="flex items-center gap-1.5 rounded-full bg-[#C84B31] hover:bg-[#a83e29] px-2 sm:px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
                  >
                    <User className="w-3.5 h-3.5 text-white" />
                    <span className="hidden min-[420px]:inline">Iniciar sesión</span>
                  </Link>
              )}
            </div>
          </div>

          {mobileMenuOpen && (
              <nav
                  id="menu-mobile-nav"
                  className="mx-auto mt-3 grid w-full max-w-[1400px] grid-cols-2 gap-2 border-t border-[#a67b50]/40 pt-3 text-xs font-bold text-[#453321] xl:hidden"
              >
                <a
                    href="#explorar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#fff7e9]/80 border border-[#b99770]/50 px-3"
                >
                  <Compass className="h-4 w-4 text-[#C84B31]" />
                  <span>Explorar</span>
                </a>
                <Link
                    href="/cocineras-cercanas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#fff7e9]/80 border border-[#b99770]/50 px-3"
                >
                  <CookingPot className="h-4 w-4 text-[#C84B31]" />
                  <span>Cocinas cercanas</span>
                </Link>
                <Link
                    href="/cocineras"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#fff7e9]/80 border border-[#b99770]/50 px-3"
                >
                  <Users className="h-4 w-4 text-[#C84B31]" />
                  <span>Nuestras cocineras</span>
                </Link>
                <Link
                    href="/cuenta/reservas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#fff7e9]/80 border border-[#b99770]/50 px-3"
                >
                  <ClipboardList className="h-4 w-4 text-[#C84B31]" />
                  <span>Mis pedidos</span>
                </Link>
              </nav>
          )}
        </header>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main className="relative z-10 mx-auto max-w-[1400px] space-y-4 px-3 pb-6 pt-3 sm:space-y-5 sm:px-4 sm:pt-4 md:px-8 md:pb-8 md:pt-[52px]">
          {/* HERO CHALKBOARD ROW */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="menu-paper lg:col-span-8 relative overflow-hidden border border-[#9b774f] bg-[#efe0c2] p-4 shadow-[0_12px_28px_rgba(46,27,13,.32),inset_0_0_28px_rgba(117,78,38,.16)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] sm:p-6 md:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[220px]">
              <div
                  aria-hidden="true"
                  className="absolute -top-1 left-1/2 z-20 h-7 w-24 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm"
              />
              <div className="absolute top-2 left-10 flex items-center gap-2 z-10">
                <div className="w-3 h-3 rounded-full bg-[#b78a59] border-2 border-[#765638] shadow-inner" />
                <div className="w-0.5 h-4 bg-[#98754d] shadow-xs" />
              </div>
              <div className="absolute top-2 right-16 flex items-center gap-2 z-10">
                <div className="w-3 h-3 rounded-full bg-[#b78a59] border-2 border-[#765638] shadow-inner" />
                <div className="w-0.5 h-4 bg-[#98754d] shadow-xs" />
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden z-20">
                <div className="w-32 h-32 bg-[#C84B31] border-2 border-[#8e442c] rotate-45 translate-x-12 -translate-y-16 shadow-lg flex items-end justify-center pb-2">
                  <div className="w-full h-full bg-[radial-gradient(#fff_20%,transparent_20%)] bg-[size:10px_10px] opacity-30" />
                </div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg
                          viewBox="0 0 64 64"
                          className="w-10 h-10 stroke-[#C84B31] fill-none stroke-[2.5] stroke-linecap-round"
                      >
                        <path d="M16 28h32v20a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V28z" />
                        <path d="M12 28h40" />
                        <path d="M8 32h8M48 32h8" />
                        <path d="M24 16c2-3 0-6 2-9M32 16c2-3 0-6 2-9M40 16c2-3 0-6 2-9" className="stroke-[#65834d]" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="font-['Caveat',cursive] text-3xl sm:text-5xl md:text-6xl font-bold text-[#2b2117] tracking-wide leading-none">
                        Hoy se come rico.
                      </h1>
                      <div className="w-48 h-1.5 bg-[#C84B31] rounded-full mt-1 rotate-[-1deg]" />
                    </div>
                  </div>

                  <p className="text-[#5b4a38] font-['Caveat',cursive] text-xl sm:text-2xl pt-2 font-normal">
                    Comida de casa, hecha por tus vecinos.
                  </p>
                </div>

                <div className="flex md:flex-col items-center gap-4 self-end md:self-center shrink-0">
                  <div className="hidden sm:block text-[#856b4d] opacity-80 rotate-12">
                    <svg viewBox="0 0 40 100" className="w-8 h-20 stroke-[#856b4d] fill-none stroke-[2]">
                      <ellipse cx="20" cy="20" rx="14" ry="18" />
                      <path d="M20 38v55" />
                    </svg>
                  </div>

                  <div className="px-4 py-2 rounded-full bg-[#dce4ce] border-2 border-dashed border-[#75865a] text-[#52663d] font-['Caveat',cursive] text-xl font-bold rotate-[-4deg] shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#65834d]" />
                    <span>¡Recién hecho!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="menu-paper lg:col-span-4 relative overflow-hidden border border-[#9b774f] bg-[#efe0c2] p-4 shadow-[0_10px_22px_rgba(46,27,13,.28)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] flex flex-col justify-center text-center space-y-2 sm:space-y-3 sm:p-6 min-h-[120px] sm:min-h-[180px]">
              <div
                  aria-hidden="true"
                  className="absolute -top-1 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm"
              />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                <div className="w-3 h-3 rounded-full bg-[#b78a59] border-2 border-[#765638]" />
              </div>

              <h2 className="font-['Caveat',cursive] text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b2117] leading-tight">
                La hora del almuerzo
              </h2>
              <p className="font-['Caveat',cursive] text-lg text-[#5b4a38]">Encuentra tu favorito cerca de casa. ♡</p>
            </div>
          </section>

          {/* ── GRID PRINCIPAL: ANTOJO, FILTROS, PLATOS Y BARRA LATERAL ── */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2.9fr)_minmax(0,1fr)] xl:gap-8">
            <section className="relative min-w-0 space-y-[22px]">
              {/* ANTOJO DEL DÍA */}
              <div className="menu-paper relative overflow-hidden border border-[#9b774f] bg-[#e8d1a3]/95 p-5 text-[#2b2117] shadow-[0_10px_24px_rgba(46,27,13,.3),inset_0_0_20px_rgba(117,78,38,.12)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] space-y-4">
                <div
                    aria-hidden="true"
                    className="absolute -top-1 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm"
                />
                <div className="flex items-center justify-between border-b border-[#ae9066] pb-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Flame className="w-5 h-5 text-[#F0822D]" />
                    <h3 className="whitespace-nowrap font-['Caveat',cursive] text-2xl font-bold text-[#493323]">Antojo del Día</h3>
                    <span className="text-xs bg-[#dce4ce] text-[#52663d] border border-[#75865a]/50 px-2.5 py-0.5 rounded-full font-bold">
                    Platos de cocinas cercanas
                  </span>
                  </div>
                  <span className="text-xs text-[#80694d] font-['Patrick_Hand',cursive] hidden sm:inline">
                  Disponibles ahora mismo
                </span>
                </div>

                <div className="-mx-1 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-1 pb-2 scrollbar-none sm:mx-0 sm:gap-2.5 sm:px-0 sm:snap-none">
                  {[
                    { name: "Doña Rosa", dish: "Ajiaco de la casa", dist: "350 m", rating: "4,9", img: "https://images.unsplash.com/photo-1556911073-a517e752729c?auto=format&fit=crop&crop=faces&w=480&h=480&q=85" },
                    { name: "Don Carlos", dish: "Bandeja casera", dist: "600 m", rating: "4,8", img: "/images/comunidad/vecino_1.jpg" },
                    { name: "Doña Marta", dish: "Pollo guisado", dist: "800 m", rating: "4,8", img: "https://images.unsplash.com/photo-1635368892977-0100146f12bb?auto=format&fit=crop&crop=faces&w=480&h=480&q=85" },
                    { name: "María Elena", dish: "Lentejas estofadas", dist: "1,2 km", rating: "4,7", img: "https://images.unsplash.com/photo-1756061010801-55a394340f41?auto=format&fit=crop&crop=faces&w=480&h=480&q=85" },
                    { name: "Don Luis", dish: "Sancocho de pollo", dist: "1,1 km", rating: "4,9", img: "/images/comunidad/vecino_4.jpg" },
                    { name: "Doña Lucía", dish: "Arroz con leche", dist: "900 m", rating: "4,8", img: "https://images.unsplash.com/photo-1489089905289-5c91ae6e2544?auto=format&fit=crop&crop=faces&w=480&h=480&q=85" },
                    { name: "Doña Carmen", dish: "Tamales tolimenses", dist: "450 m", rating: "4,9", img: "https://images.unsplash.com/photo-1759679124833-83c668839eaa?auto=format&fit=crop&crop=faces&w=480&h=480&q=85" },
                    { name: "Don Pedro", dish: "Sudado criollo", dist: "700 m", rating: "4,8", img: "https://images.unsplash.com/photo-1556908153-a685b0352d59?auto=format&fit=crop&crop=faces&w=480&h=480&q=85" },
                  ].map((cook, idx) => (
                      <div
                          key={idx}
                          className="menu-paper menu-subpaper relative min-w-[min(78vw,280px)] max-w-[280px] shrink-0 snap-start bg-[#f5e9d2] border border-[#c4a77d] hover:border-[#C84B31]/70 p-3 shadow-[0_3px_6px_rgba(73,47,25,.14)] flex flex-col justify-between transition-all group sm:min-w-[170px] sm:max-w-[180px] sm:snap-align-none sm:p-2.5"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <img src={cook.img} alt={cook.name} className="w-9 h-9 rounded-full object-cover border border-[#98774e]" />
                            <span className="text-[10px] bg-[#dce4ce] text-[#52663d] font-bold px-2 py-0.5 rounded-full border border-[#75865a]/50">
                          ★ {cook.rating}
                        </span>
                          </div>
                          <div>
                            <h4 className="font-['Caveat',cursive] text-base font-bold text-[#2b2117] group-hover:text-[#a84029] transition-colors">
                              {cook.dish}
                            </h4>
                            <p className="text-[11px] text-[#5b4a38] line-clamp-1">Cocina de {cook.name}</p>
                            <span className="text-[10px] text-[#80694d] block mt-0.5">A {cook.dist}</span>
                          </div>
                        </div>
                        {dynamicDishes.find((d) => d.cook === cook.name) ? (
                            <button
                                onClick={() => {
                                  const foundDish = dynamicDishes.find((d) => d.cook === cook.name);
                                  if (!foundDish) return;
                                  openReservation(foundDish);
                                }}
                                className="mt-2 w-full rounded-full bg-[#C84B31] py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-[#a83e29] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2117]"
                            >
                              Agregar al pedido
                            </button>
                        ) : (
                            <Link
                                href="/cocineras-cercanas"
                                className="mt-2 w-full rounded-full border border-[#80694d]/50 bg-[#fff7e9]/70 py-1.5 text-center text-[11px] font-bold text-[#493323] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B31]"
                            >
                              Ver cocinas
                            </Link>
                        )}
                      </div>
                  ))}
                </div>
              </div>

              {/* BUSCADOR Y FILTROS */}
              <div id="explorar" className="flex w-full flex-col items-stretch gap-3">
                <label className="relative block w-full lg:hidden">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#795f43]" />
                  <input
                      aria-label="Buscar platos"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Busca un plato..."
                      className="w-full rounded-full border border-[#b99770]/60 bg-[#fff7e9]/85 py-2 pl-9 pr-3 font-['Patrick_Hand',cursive] text-sm text-[#493323] placeholder:text-[#80694d] focus:outline-none focus:ring-2 focus:ring-[#c84b31]/50"
                  />
                </label>
                <div className="flex w-full flex-wrap items-center justify-between gap-2 pb-1">
                  {[
                    { id: "Todos", label: "Todos", icon: Utensils },
                    { id: "Almuerzos", label: "Almuerzos", icon: Utensils },
                    { id: "Sopas", label: "Sopas", icon: Soup },
                    { id: "Vegetariano", label: "Vegetariano", icon: Vegan },
                    { id: "Postres", label: "Postres", icon: Cake },
                    { id: "Filtros", label: "Filtros", icon: SlidersHorizontal },
                  ].map((btn) => {
                    const Icon = btn.icon;
                    const isActive = btn.id === "Filtros" ? filtersOpen : activeFilter === btn.id;
                    return (
                        <button
                            key={btn.id}
                            onClick={() => (btn.id === "Filtros" ? setFiltersOpen((open) => !open) : setActiveFilter(btn.id))}
                            aria-expanded={btn.id === "Filtros" ? filtersOpen : undefined}
                            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
                                isActive
                                    ? "bg-[#C84B31] text-white shadow-md shadow-red-950/20"
                                    : "border border-white/70 bg-white/55 text-[#493323] hover:bg-white/85"
                            }`}
                        >
                          <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#C84B31]"}`} />
                          <span>{btn.label}</span>
                        </button>
                    );
                  })}
                </div>
              </div>

              {filtersOpen && (
                  <div
                      className="menu-paper grid grid-cols-1 gap-4 rounded-xl border border-[#b99770]/70 bg-[#fff7e9]/95 p-4 text-sm text-[#493323] shadow-lg sm:grid-cols-2 xl:grid-cols-4"
                      role="region"
                      aria-label="Opciones de filtro"
                  >
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8c39c] bg-white/65 px-3 py-2">
                      <input
                          type="checkbox"
                          checked={availableOnly}
                          onChange={(event) => setAvailableOnly(event.target.checked)}
                          className="accent-[#C84B31]"
                      />
                      Solo platos disponibles
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8c39c] bg-white/65 px-3 py-2">
                      <input
                          type="checkbox"
                          checked={withinTwoKm}
                          onChange={(event) => setWithinTwoKm(event.target.checked)}
                          className="accent-[#C84B31]"
                      />
                      Cocinas a menos de 2 km
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8c39c] bg-white/65 px-3 py-2">
                      <input
                          type="checkbox"
                          checked={featuredCooksOnly}
                          onChange={(event) => setFeaturedCooksOnly(event.target.checked)}
                          className="accent-[#C84B31]"
                      />
                      <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-600" /> Solo cocineras destacadas
                  </span>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-semibold">Ordenar platos</span>
                      <select
                          value={sortBy}
                          onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                          className="rounded-lg border border-[#b99770] bg-white px-3 py-2 text-[#493323] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31]"
                      >
                        <option value="recommended">Recomendados</option>
                        <option value="rating-desc">Mejor promedio de estrellas</option>
                        <option value="reviews-desc">Más calificaciones</option>
                        <option value="price-asc">Menor precio</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-semibold">Calificación mínima</span>
                      <select
                          value={minimumRating}
                          onChange={(event) => setMinimumRating(Number(event.target.value))}
                          className="rounded-lg border border-[#b99770] bg-white px-3 py-2 text-[#493323] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31]"
                      >
                        <option value={0}>Todas las estrellas</option>
                        <option value={4}>4 estrellas o más</option>
                        <option value={3}>3 estrellas o más</option>
                        <option value={2}>2 estrellas o más</option>
                        <option value={1}>1 estrella o más</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-semibold">Opiniones de la cocinera</span>
                      <select
                          value={reviewSentiment}
                          onChange={(event) => setReviewSentiment(event.target.value as typeof reviewSentiment)}
                          className="rounded-lg border border-[#b99770] bg-white px-3 py-2 text-[#493323] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31]"
                      >
                        <option value="all">Todas las opiniones</option>
                        <option value="positive">Con opiniones positivas (4–5★)</option>
                        <option value="negative">Con opiniones negativas (1–2★)</option>
                      </select>
                    </label>
                    <p className="self-center text-xs leading-relaxed text-[#725d48] sm:col-span-2">
                      Las opiniones se consultan por cocinera. “Destacada” usa el criterio: promedio de 4,8 o más y al menos 3 opiniones publicadas.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                          setAvailableOnly(false);
                          setWithinTwoKm(true);
                          setSortBy("recommended");
                          setMinimumRating(0);
                          setReviewSentiment("all");
                          setFeaturedCooksOnly(false);
                        }}
                        className="w-fit self-center rounded-full px-3 py-2 font-semibold text-[#a84029] underline decoration-dotted underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31]"
                    >
                      Limpiar filtros
                    </button>
                  </div>
              )}

              <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 pb-1 text-sm">
                <span className="mr-1 shrink-0 font-bold text-[#57412b]">Opciones de alimentación:</span>
                {["Todos", "Vegetariano", "Sin Gluten", "Sin Lactosa", "Vegano"].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setSelectedDietaryTag(tag)}
                        aria-pressed={selectedDietaryTag === tag}
                        className={`min-h-9 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            selectedDietaryTag === tag
                                ? "bg-[#F0822D] text-white shadow-sm"
                                : "border border-white/75 bg-white/55 text-[#493323] hover:bg-white/85"
                        }`}
                    >
                      {tag}
                    </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e0c49a]/70 pb-2">
                <div className="space-y-1">
                  <h2 className="flex items-center gap-3 font-['Caveat',cursive] text-4xl font-bold text-[#2c1b10] drop-shadow-sm md:text-5xl">
                    <span>¿Qué se te antoja hoy?</span>
                    <svg aria-hidden="true" viewBox="0 0 54 12" className="mt-2 h-3 w-14 text-[#C84B31]">
                      <path
                          d="M2 8 C12 2, 19 10, 29 5 S44 4, 52 5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                      />
                    </svg>
                  </h2>
                </div>
              </div>

              {/* RECETARIO / CARDS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mainRecipeDishes.map((dish, index) => renderRecipeCard(dish.name, dish, index >= 3, index < 3, index >= 3))}
                {showReferenceRecipes && renderRecipeCard("Arepas con queso", undefined, true, false, true)}
                {filteredDishes.length === 0 && (
                    <div
                        className="menu-paper col-span-full rounded-xl border border-[#b99770]/70 bg-[#fff7e9]/90 p-6 text-center text-[#493323]"
                        role="status"
                    >
                      <p className="font-['Caveat',cursive] text-2xl font-bold">No encontramos platos con esa búsqueda.</p>
                      <p className="mt-1 text-sm">Prueba otro nombre o limpia los filtros para ver más opciones.</p>
                      <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setActiveFilter("Todos");
                            setSelectedDietaryTag("Todos");
                            setAvailableOnly(false);
                            setSortBy("recommended");
                            setWithinTwoKm(true);
                          }}
                          className="mt-3 rounded-full bg-[#C84B31] px-4 py-2 text-sm font-bold text-white hover:bg-[#a83e29] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2117]"
                      >
                        Mostrar todos los platos
                      </button>
                    </div>
                )}
              </div>
              <p className="menu-paper -mt-2 rounded-lg border border-[#b99770]/60 bg-[#fff7e9]/85 px-3 py-2 text-[11px] leading-snug text-[#493323] sm:text-xs">
                Si tienes una alergia, confirma ingredientes y posibles trazas directamente con quien cocina antes de reservar.
              </p>
            </section>

            {/* BARRA LATERAL (Mascota + Carrito) */}
            <aside className="space-y-4 lg:-mt-4">
              <div className="menu-paper relative overflow-hidden border border-[#9b774f] bg-[#e8d1a3] p-5 pt-7 text-center text-[#2b2117] shadow-[0_10px_24px_rgba(46,27,13,.32),inset_0_0_20px_rgba(117,78,38,.14)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_100%,2%_99%,0%_96%,1%_4%)] space-y-4">
                <div
                    aria-hidden="true"
                    className="absolute -top-1 left-1/2 z-20 h-6 w-20 -translate-x-1/2 -rotate-2 border-x border-[#b99655]/70 bg-[#d6b776]/90 shadow-sm"
                />
                <div className="absolute top-2 left-6 w-3 h-3 rounded-full bg-[#b78a59] border border-[#765638]" />
                <div className="absolute top-2 right-6 w-3 h-3 rounded-full bg-[#b78a59] border border-[#765638]" />

                <span className="font-['Caveat',cursive] text-2xl font-bold text-[#2b2117] block">Ubica tu antojo</span>

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
                  <MapPin className="w-4 h-4" />
                  <span>Ver Mapa →</span>
                </Link>
              </div>

              <div
                  id="cart-section"
                  className="menu-paper relative space-y-1 border border-[#a58150] bg-[#e8d1a3] p-2.5 pt-4 shadow-[0_12px_24px_rgba(45,25,13,.38),inset_0_0_25px_rgba(120,77,38,.18)] [clip-path:polygon(1%_1%,98%_0%,100%_3%,99%_97%,97%_99%,3%_100%,1%_97%,0%_4%)] font-['Patrick_Hand',cursive]"
                  style={{
                    backgroundImage:
                        "radial-gradient(ellipse at 15% 10%, rgba(255,255,235,.48), transparent 35%), repeating-linear-gradient(4deg, rgba(117,77,41,.035) 0px, rgba(117,77,41,.035) 1px, transparent 2px, transparent 5px)",
                  }}
              >
                <div
                    aria-hidden="true"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 -rotate-2 w-20 h-6 bg-[#d6b776]/90 border-x border-[#b99655]/70 shadow-sm"
                />
                <div className="flex items-center justify-between border-b border-[#ae9066] pb-2">
                  <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#C84B31]" />
                    <span>Tu pedido</span>
                  </h3>
                  {cart.length > 0 && (
                      <button onClick={clearCart} className="text-xs text-[#68472e] hover:text-[#C84B31] transition-colors">
                        Vaciar
                      </button>
                  )}
                </div>

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
                              <Image src={item.image} alt={item.name} fill className="object-cover sepia grayscale-[0.3]" />
                            </div>

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-stone-500">{item.cook}</p>
                              <p className="text-xs font-extrabold text-[#C84B31]">
                                ${(item.price * item.quantity).toLocaleString("es-CO")}
                              </p>
                            </div>

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
                              <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 ml-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="space-y-1 border-t border-dashed border-[#ae9066] pt-2 text-[11px] text-[#493323]">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">${subtotal.toLocaleString("es-CO")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Entrega estimada (350 m)</span>
                        <span className="font-semibold">${deliveryFee.toLocaleString("es-CO")}</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-[#ae9066] pt-1.5 text-xs font-extrabold text-[#a84029]">
                        <span>Total estimado</span>
                        <span className="text-lg font-extrabold">${total.toLocaleString("es-CO")}</span>
                      </div>
                    </div>
                )}

                <button
                    disabled={cart.length === 0}
                    onClick={openOrder}
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

        {/* SECCIÓN OLLA VERDE */}
        <section
            id="olla-verde"
            className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-10 text-[#2b2117] md:px-8"
            aria-labelledby="comunidad-title"
        >
          <div className="relative isolate min-h-[430px] overflow-hidden rounded-[26px] border-[5px] border-[#d6bd91] bg-[#342319] shadow-[0_16px_34px_rgba(46,27,13,.32)] md:min-h-[390px]">
            <Image
                src="/images/kitchen_background.jpg"
                alt="Cocina cálida de casa con mesa de madera"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#24180f]/90 via-[#24180f]/65 to-[#24180f]/15" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#24180f]/55 to-transparent" />

            <div className="relative z-10 grid min-h-[430px] items-end gap-7 p-5 sm:p-8 md:min-h-[390px] md:grid-cols-[1fr_310px] md:items-center md:p-10">
              <div className="max-w-xl pb-1 text-left text-[#fff4dc]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#fff0d1]/35 bg-[#22170f]/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#f1d59b] backdrop-blur-sm">
                <Home className="h-3.5 w-3.5" /> Una cocina en cada cuadra
              </span>
                <h2
                    id="comunidad-title"
                    className="mt-4 font-['Caveat',cursive] text-5xl font-bold leading-[.92] drop-shadow-md sm:text-6xl md:text-7xl"
                >
                  El sabor de casa,
                  <br />
                  <span className="text-[#f3cf83]">más cerca.</span>
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#fff5e2]/95 sm:text-base">
                  Descubre lo que preparan tus vecinas, reserva tu porción en OllaCercana y comparte la mesa con tu comunidad.
                </p>
                <button
                    type="button"
                    onClick={() => document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#f7c269] bg-[#bd492c] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#a83e29] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Utensils className="h-4 w-4" /> Ver platos del día <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
              </div>

              <figure className="relative mx-auto w-full max-w-[290px] rotate-[1deg]">
                <div className="relative aspect-[.92] overflow-visible bg-transparent">
                  <Image
                      src="/images/sello_olla_verde.png"
                      alt="Sello Olla Verde: distintivo del conjunto"
                      fill
                      sizes="(max-width: 768px) 82vw, 290px"
                      className="object-contain object-center drop-shadow-[0_12px_12px_rgba(20,13,8,.4)]"
                  />
                </div>
                <figcaption className="mt-3 rounded-lg border border-[#fff0d1]/25 bg-[#24180f]/65 px-3 py-2 text-center text-xs leading-relaxed text-[#fff4dc] backdrop-blur-sm">
                  Se obtiene cuando el conjunto vende todas las porciones publicadas durante la semana.
                </figcaption>
              </figure>
            </div>
          </div>

          <figure className="menu-paper overflow-hidden border-[5px] border-[#d6bd91] bg-[#efe0c2] p-2 shadow-[0_10px_24px_rgba(46,27,13,.22)] sm:p-3">
            <figcaption className="flex flex-col gap-2 px-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#52663d]">La idea detrás del sello</span>
                <p className="font-['Caveat',cursive] text-2xl font-bold leading-tight text-[#2b2117]">
                  Una meta que se cocina entre todos
                </p>
              </div>
              <button
                  type="button"
                  onClick={() => setStoryboardOpen(true)}
                  className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-[#75865a]/60 bg-[#dce4ce] px-4 py-2 text-xs font-bold text-[#42542e] transition hover:bg-[#cdd9b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#493323] sm:self-center"
              >
                <ZoomIn className="h-4 w-4" /> Ampliar lámina
              </button>
            </figcaption>
            <button
                type="button"
                onClick={() => setStoryboardOpen(true)}
                aria-label="Ampliar la lámina sobre la comunidad Olla Verde"
                className="relative block aspect-[16/9] w-full overflow-hidden border border-[#ae9066] bg-[#f8f0e0] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#52663d]"
            >
              <Image
                  src="/images/olla_verde_storyboard.jpg"
                  alt="Lámina ilustrada sobre Olla Verde"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.015]"
              />
            </button>
            <p className="px-3 pb-2 pt-2 text-center text-xs text-[#6e563b]">
              Del esfuerzo de las cocineras al reconocimiento compartido del vecindario.
            </p>
          </figure>

          <div className="menu-paper relative overflow-hidden border border-[#bda078] bg-[#efe0c2] shadow-[0_8px_18px_rgba(46,27,13,.16)]">
            <div className="flex flex-col gap-4 border-b border-dashed border-[#ae9066] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a84029]">Sencillo, como en casa</span>
                <h3 className="font-['Caveat',cursive] text-3xl font-bold leading-tight">De la olla a tu mesa</h3>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-[#5b4a38]">
                Todo ocurre dentro de OllaCercana: encuentras, reservas y acuerdas con la cocinera de tu zona.
              </p>
            </div>
            <ol className="grid divide-y divide-dashed divide-[#ae9066] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-4">
              <li className="flex items-center gap-3 py-3 sm:px-4 sm:py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c88359]/60 bg-[#f3ddc2] font-['Caveat',cursive] text-xl font-bold text-[#a84029]">
                1
              </span>
                <span className="text-xs leading-snug text-[#5b4a38]">
                <strong className="block text-sm text-[#2b2117]">Explora el libretón</strong>Conoce los platos y quién los cocina.
              </span>
              </li>
              <li className="flex items-center gap-3 py-3 sm:px-4 sm:py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#75865a]/60 bg-[#dce4ce] font-['Caveat',cursive] text-xl font-bold text-[#52663d]">
                2
              </span>
                <span className="text-xs leading-snug text-[#5b4a38]">
                <strong className="block text-sm text-[#2b2117]">Reserva tu porción</strong>Coordina los detalles por la plataforma.
              </span>
              </li>
              <li className="flex items-center gap-3 py-3 sm:px-4 sm:py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c4a77d] bg-[#f5e9d2] font-['Caveat',cursive] text-xl font-bold text-[#80694d]">
                3
              </span>
                <span className="text-xs leading-snug text-[#5b4a38]">
                <strong className="block text-sm text-[#2b2117]">Disfruta y comparte</strong>Acuerda la entrega directamente con tu vecina.
              </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border-2 border-[#9b774f] bg-[#e8d1a3] px-5 py-5 shadow-[0_8px_20px_rgba(46,27,13,.18)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Link href="/vecino-fiel" className="group flex items-center gap-4 transition-transform hover:scale-[1.01]">
            <span className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-full border-2 border-[#c88359] bg-[#f3ddc2] text-[#a84029] shadow-sm group-hover:bg-[#ebd0b0]">
              <Heart className="h-6 w-6 text-[#c05621] fill-[#c05621]/20 group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-1 -right-1 bg-[#2b2117] text-amber-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-amber-600">
                3/3
              </span>
            </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a84029]">Insignia y Reto HU-21</span>
                  <span className="rounded bg-[#2b2117] px-1.5 py-0.5 text-[9px] font-bold text-amber-200 uppercase">
                  Ver expediente
                </span>
                </div>
                <p className="font-['Caveat',cursive] text-2xl font-bold leading-none text-[#2b2117] group-hover:text-[#a84029] transition-colors">
                  Vecino Fiel · Reconocimiento del Barrio
                </p>
                <p className="mt-1 text-xs text-[#5b4a38]">
                  Completa 3 entregas en un mes con la misma cocinera y gana la insignia oficial con{" "}
                  <strong className="text-[#a84029]">5% de descuento</strong> en tu siguiente pedido.{" "}
                  <span className="font-bold underline decoration-[#a84029] ml-1">Consulta tu racha aquí →</span>
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                  href="/vecino-fiel"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#a84029] bg-[#a84029] px-4 py-2.5 text-xs font-bold text-amber-50 shadow-sm transition hover:bg-[#8e3521]"
              >
                Ver mi Pasaporte
              </Link>
              <Link
                  href="/cuenta/registro"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#75865a]/70 bg-[#dce4ce] px-4 py-2.5 text-xs font-bold text-[#42542e] transition hover:bg-[#cdd9b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#493323]"
              >
                ¿Cocinas para tu barrio? <ChevronDown className="h-4 w-4 -rotate-90" />
              </Link>
            </div>
          </div>
        </section>

        {/* MODAL STORYBOARD */}
        {storyboardOpen && (
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="storyboard-dialog-title"
                className="fixed inset-0 z-[90] flex items-center justify-center bg-[#17110c]/90 p-3 backdrop-blur-sm sm:p-6"
                onClick={() => setStoryboardOpen(false)}
            >
              <div
                  className="relative w-full max-w-6xl rounded-xl border-2 border-[#d6bd91] bg-[#f3e6cc] p-2 shadow-2xl sm:p-3"
                  onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-3 px-2 pb-2">
                  <h2 id="storyboard-dialog-title" className="font-['Caveat',cursive] text-xl font-bold text-[#493323] sm:text-2xl">
                    Olla Verde · una meta compartida
                  </h2>
                  <button
                      type="button"
                      onClick={() => setStoryboardOpen(false)}
                      aria-label="Cerrar lámina"
                      className="rounded-full bg-[#493323] p-2 text-white transition hover:bg-[#6d4931] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52663d]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative h-[min(76vh,850px)] w-full">
                  <Image
                      src="/images/olla_verde_storyboard.jpg"
                      alt="Lámina ilustrada completa de la iniciativa Olla Verde"
                      fill
                      sizes="96vw"
                      className="object-contain"
                  />
                </div>
              </div>
            </div>
        )}

        {/* MODAL RECETARIO */}
        {recipeToShow &&
            (() => {
              const selectedDish = dynamicDishes.find((dish) => dish.name === recipeToShow);
              const recipe = recipeNotes[recipeToShow] ?? {
                badge: "Receta del barrio",
                ingredients: [],
                steps: [],
                price: selectedDish?.formattedPrice ?? "",
                phrase: selectedDish?.cook ?? "",
                image: selectedDish?.image,
              };
              return (
                  <div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="recipe-dialog-title"
                      className="fixed inset-0 z-[85] flex items-center justify-center bg-[#17110c]/80 p-3 backdrop-blur-sm sm:p-6"
                      onClick={() => setRecipeToShow(null)}
                  >
                    <div
                        className="menu-paper relative max-h-[90vh] w-full max-w-xl overflow-y-auto border-2 border-[#9b774f] bg-[#efe0c2] p-5 text-[#2b2117] shadow-2xl sm:p-7"
                        onClick={(event) => event.stopPropagation()}
                    >
                      <div aria-hidden="true" className="absolute -top-1 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 bg-[#d6b776]/90 shadow-sm" />
                      <div className="flex items-start justify-between gap-4 border-b border-dashed border-[#ae9066] pb-3">
                        <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a84029]">
                      Del recetario vecinal
                    </span>
                          <h2 id="recipe-dialog-title" className="font-['Caveat',cursive] text-3xl font-bold">
                            {recipeToShow}
                          </h2>
                          <p className="text-xs text-[#6a5037]">Una receta compartida por {selectedDish?.cook || "la comunidad"}</p>
                        </div>
                        <button
                            type="button"
                            aria-label="Cerrar receta"
                            onClick={() => setRecipeToShow(null)}
                            className="rounded-full bg-[#493323] p-2 text-white transition hover:bg-[#6d4931]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-4 pt-4 sm:grid-cols-2">
                        <section>
                          <h3 className="mb-2 font-['Caveat',cursive] text-xl font-bold underline decoration-dashed">Ingredientes</h3>
                          {recipe.ingredients.length ? (
                              <ul className="space-y-1 text-sm">
                                {recipe.ingredients.map((ingredient) => (
                                    <li key={ingredient}>– {ingredient}</li>
                                ))}
                              </ul>
                          ) : (
                              <p className="text-sm">{selectedDish?.description || "Consulta los ingredientes con la cocinera."}</p>
                          )}
                        </section>
                        <section>
                          <h3 className="mb-2 font-['Caveat',cursive] text-xl font-bold underline decoration-dashed">Preparación</h3>
                          {recipe.steps.length ? (
                              <ol className="space-y-2 text-sm">
                                {recipe.steps.map((step, index) => (
                                    <li key={step}>
                                      <span className="mr-1 font-bold">{index + 1}.</span>
                                      {step}
                                    </li>
                                ))}
                              </ol>
                          ) : (
                              <p className="text-sm">
                                Esta publicación no incluye la preparación. Puedes preguntarle a {selectedDish?.cook || "la cocinera"} por el
                                chat después de reservar.
                              </p>
                          )}
                        </section>
                      </div>
                      <p className="mt-4 border-t border-dashed border-[#ae9066] pt-3 text-xs leading-relaxed text-[#6a5037]">
                        Si tienes alergias o restricciones alimentarias, confirma ingredientes y posibles trazas directamente con quien
                        cocina.
                      </p>
                    </div>
                  </div>
              );
            })()}

        {/* AVISO DE AUTENTICACIÓN REQUERIDA */}
        {authPromptOpen && (
            <aside
                role="dialog"
                aria-labelledby="auth-prompt-title"
                aria-describedby="auth-prompt-description"
                className="fixed bottom-4 left-4 right-4 z-[70] mx-auto w-auto max-w-sm rounded-2xl border-2 border-[#9b774f] bg-[#fff5df] p-4 text-[#493323] shadow-[0_12px_36px_rgba(35,22,12,.4)] sm:left-auto sm:right-6 sm:bottom-6"
            >
              <button
                  type="button"
                  onClick={() => setAuthPromptOpen(false)}
                  aria-label="Cerrar aviso"
                  className="absolute right-3 top-3 rounded-full p-1 text-[#80694d] transition hover:bg-[#ead9ba] hover:text-[#493323] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31]"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="pr-7">
                <h2 id="auth-prompt-title" className="font-['Caveat',cursive] text-2xl font-bold leading-tight">
                  Un momentico…
                </h2>
                <p id="auth-prompt-description" className="mt-1 text-sm leading-snug text-[#5b4a38]">
                  Para añadir platos, reservar o continuar con tu pedido, primero inicia sesión o crea tu cuenta.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex flex-1 gap-2">
                  <Link
                      href="/cuenta"
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-[#C84B31] px-3 py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#a83e29] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#493323]"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                      href="/cuenta/registro"
                      className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#80694d] bg-[#f2e5cc] px-3 py-2 text-center text-xs font-bold text-[#493323] transition hover:bg-white"
                  >
                    Crear cuenta
                  </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setAuthPromptOpen(false)}
                    className="min-h-10 rounded-full px-3 py-2 text-sm font-semibold text-[#6d5941] transition hover:bg-[#ead9ba] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C84B31]"
                >
                  Ahora no
                </button>
              </div>
            </aside>
        )}

        {/* MODALES JIRA */}
        <ReputationModal
            isOpen={!!reputationCook}
            onClose={() => setReputationCook(null)}
            cookName={reputationCook?.name || "Cocinera"}
            cookAvatar={reputationCook?.avatar}
            cookId={reputationCook?.id}
        />

        {currentUser && (
            <>
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

              {ratingTarget && (
                  <RatingModal
                      key={ratingTarget.reservationId}
                      isOpen={!!ratingTarget}
                      onClose={() => setRatingTarget(null)}
                      reservationId={ratingTarget?.reservationId || ""}
                      cookId={ratingTarget?.cookId || ""}
                      currentUser={currentUser}
                  />
              )}
            </>
        )}
      </div>
  );
}