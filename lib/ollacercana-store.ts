"use client";

// OllaCercana Central State Store & Persistence Layer
// Fulfills all Jira HU acceptance criteria (HU-01 to HU-24)

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  phoneVerified?: boolean;
  role: "comprador" | "cocinera" | "admin";
  commercialName?: string;
  bio?: string;
  residentialComplex?: string;
  paymentMethods?: string[];
  badges?: string[]; // e.g. "Vecino Fiel", "Conjunto Olla Verde", "Cocinera Destacada"
  isLoggedIn?: boolean;
  avatar?: string;
  kitchenPhoto?: string;
  isCocineraActive?: boolean;
  dataConsentAccepted?: boolean;
  isPaused?: boolean;
}

export interface DishItem {
  id: string;
  name: string;
  category: "Almuerzos" | "Sopas" | "Vegetariano" | "Postres";
  dietaryTags?: ("Vegetariano" | "Sin Gluten" | "Sin Lactosa" | "Vegano")[];
  badge?: string | null;
  price: number;
  formattedPrice: string;
  image: string;
  cook: string;
  cookId: string;
  cookAvatar: string;
  rating: string;
  reviews: number;
  distance: string;
  distanceMeters: number;
  residentialComplex: string;
  totalPortions: number;
  availablePortions: number;
  reservedPortions: number;
  status: "DISPONIBLE" | "AGOTADO" | "EXPIRADO" | "INHABILITADO";
  description: string;
  createdAt: string;
}

export const normalizeResidentialComplex = (value?: string): string => {
  if (!value?.trim()) return "";
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(apartamento|apto\.?|interior|torre|bloque|casa)\s*[#\w-]*\s*$/i, "")
    .replace(/^\s*(conjunto\s+residencial|conjunto|residencial|residencias|unidad\s+residencial)\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

export const sharesResidentialComplex = (first?: string, second?: string): boolean => {
  const normalizedFirst = normalizeResidentialComplex(first);
  const normalizedSecond = normalizeResidentialComplex(second);
  return Boolean(normalizedFirst && normalizedSecond && normalizedFirst === normalizedSecond);
};

export interface OllaVerdeDailyProgress {
  residentialComplex: string;
  date: string; // YYYY-MM-DD in local time
  portionsPublished: number;
  portionsSold: number;
  isDemo?: boolean;
}

export interface OllaVerdeAward {
  residentialComplex: string;
  normalizedComplex: string;
  validUntil: string;
  isDemo: boolean;
}

const OLLA_VERDE_PROGRESS_KEY = "ollacercana_olla_verde_progress_v1";

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDemoOllaVerdeProgress = (): OllaVerdeDailyProgress[] => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7 + index);
    return {
      residentialComplex: "Conjunto El Rosal",
      date: localDateKey(date),
      portionsPublished: 12,
      portionsSold: 12,
      isDemo: true,
    };
  });
};

export const getStoredOllaVerdeProgress = (): OllaVerdeDailyProgress[] => {
  if (typeof window === "undefined") return getDemoOllaVerdeProgress();
  const stored = localStorage.getItem(OLLA_VERDE_PROGRESS_KEY);
  if (!stored) {
    const demoProgress = getDemoOllaVerdeProgress();
    localStorage.setItem(OLLA_VERDE_PROGRESS_KEY, JSON.stringify(demoProgress));
    return demoProgress;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : getDemoOllaVerdeProgress();
  } catch {
    return getDemoOllaVerdeProgress();
  }
};

/** Earn the 7 PT stamp after selling every listed portion for 7 consecutive days. */
export const getActiveOllaVerdeAwards = (now = new Date()): OllaVerdeAward[] => {
  const progress = getStoredOllaVerdeProgress();
  const byComplex = new Map<string, OllaVerdeDailyProgress[]>();

  for (const day of progress) {
    const normalizedComplex = normalizeResidentialComplex(day.residentialComplex);
    if (!normalizedComplex || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) continue;
    const entries = byComplex.get(normalizedComplex) ?? [];
    entries.push(day);
    byComplex.set(normalizedComplex, entries);
  }

  const awards: OllaVerdeAward[] = [];
  for (const [normalizedComplex, entries] of byComplex) {
    const byDate = new Map<string, OllaVerdeDailyProgress>();
    for (const entry of entries) byDate.set(entry.date, entry);
    const successful = (day?: OllaVerdeDailyProgress) => Boolean(day && day.portionsPublished > 0 && day.portionsSold >= day.portionsPublished);
    const candidates = [...byDate.values()].filter(successful).sort((a, b) => b.date.localeCompare(a.date));
    for (const lastDay of candidates) {
      const achievementDate = new Date(`${lastDay.date}T12:00:00`);
      if (achievementDate > now) continue;
      const qualifyingWeek: OllaVerdeDailyProgress[] = [];
      let isFullWeek = true;
      for (let offset = 0; offset < 7; offset += 1) {
        const day = new Date(achievementDate);
        day.setDate(day.getDate() - offset);
        const progressForDay = byDate.get(localDateKey(day));
        if (!successful(progressForDay)) {
          isFullWeek = false;
          break;
        }
        qualifyingWeek.push(progressForDay!);
      }
      if (!isFullWeek) continue;

      // The seal remains valid for seven days after it is earned, even if a later day misses the goal.
      const validUntil = new Date(`${lastDay.date}T23:59:59`);
      validUntil.setDate(validUntil.getDate() + 7);
      if (now >= validUntil) continue;
      awards.push({
        residentialComplex: lastDay.residentialComplex,
        normalizedComplex,
        validUntil: validUntil.toISOString(),
        isDemo: qualifyingWeek.every((day) => day.isDemo === true),
      });
      break;
    }
  }
  return awards;
};

export const recordOllaVerdeDailyProgress = (entry: OllaVerdeDailyProgress): void => {
  if (typeof window === "undefined") return;
  const normalizedComplex = normalizeResidentialComplex(entry.residentialComplex);
  if (!normalizedComplex || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return;
  const progress = getStoredOllaVerdeProgress().filter((day) =>
    normalizeResidentialComplex(day.residentialComplex) !== normalizedComplex || day.date !== entry.date,
  );
  progress.push({ ...entry, isDemo: false });
  localStorage.setItem(OLLA_VERDE_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event("ollaverde-progress-updated"));
};

export interface Reservation {
  id: string;
  dishId: string;
  dishName: string;
  dishImage: string;
  cookId: string;
  cookAvatar?: string;
  cookName: string;
  cookResidentialComplex?: string;
  buyerResidentialComplex?: string;
  isSameResidentialComplex?: boolean;
  buyerName: string;
  buyerEmail: string;
  portions: number;
  pricePerPortion: number;
  originalPrice?: number;
  discountPercent?: number;
  discountAmount?: number;
  totalPrice: number;
  preferredPaymentMethod: "Efectivo" | "Nequi" | "Daviplata" | "Llaves";
  paymentReceipt?: string;
  paymentReceiptName?: string;
  pickupTime: string;
  status: "PENDIENTE" | "CONFIRMADO" | "RECHAZADA" | "EXPIRADA" | "COMPLETADA";
  buyerConfirmedDelivery?: boolean;
  cookConfirmedDelivery?: boolean;
  cookConfirmedPayment?: boolean;
  hasOpenReport?: boolean;
  completedAt?: string;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (10 min after creation)
}

export interface Review {
  id: string;
  cookId: string;
  reservationId: string;
  buyerName: string;
  rating: number; // 1..5
  comment: string;
  createdAt: string;
  status?: "Pendiente" | "Publicada";
}

export interface ChatMessage {
  id: string;
  reservationId: string;
  sender: string; // name or email
  text: string;
  timestamp: string;
}

export interface CommunityReport {
  id: string;
  reporterName: string;
  targetId: string; // dishId or cookId
  targetType: "publicacion" | "usuario";
  targetTitle: string;
  reason: string;
  explanation: string;
  evidenceImage?: string;
  status: "Abierto" | "Resuelto" | "Desestimado";
  createdAt: string;
}

export interface AppNotification {
  id: string;
  targetEmail: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// Default initial dataset
const INITIAL_DISHES: DishItem[] = [
  {
    id: "dish-1",
    name: "Ajiaco de la casa",
    category: "Sopas",
    dietaryTags: [],
    badge: "El favorito del barrio",
    price: 18000,
    formattedPrice: "$18.000",
    image: "/images/menu_ajiaco.jpg",
    cook: "Doña Rosa",
    cookId: "dona-rosa",
    cookAvatar: "/images/dona_rosa_mascot.jpg",
    rating: "4,9",
    reviews: 120,
    distance: "A 350 m",
    distanceMeters: 350,
    residentialComplex: "Conjunto San Luis",
    totalPortions: 6,
    availablePortions: 5,
    reservedPortions: 1,
    status: "DISPONIBLE",
    description: "Con tres tipos de papa, pollo desmechado tierno, guascas frescas y alcaparras.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "dish-2",
    name: "Bandeja casera",
    category: "Almuerzos",
    dietaryTags: [],
    badge: "Quedan 5 porciones",
    price: 22000,
    formattedPrice: "$22.000",
    image: "/images/menu_cazuela.jpg",
    cook: "Don Carlos",
    cookId: "don-carlos",
    cookAvatar: "/images/abuelita_3d_mascot.jpg",
    rating: "4,8",
    reviews: 95,
    distance: "A 600 m",
    distanceMeters: 600,
    residentialComplex: "Torres de Chapinero",
    totalPortions: 5,
    availablePortions: 5,
    reservedPortions: 0,
    status: "DISPONIBLE",
    description: "Frijoles de la casa con chicharrón crocante, plátano maduro en cubos y aguacate.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "dish-3",
    name: "Pollo guisado",
    category: "Almuerzos",
    dietaryTags: ["Sin Gluten"],
    badge: null,
    price: 17000,
    formattedPrice: "$17.000",
    image: "/images/dish_pollo_chalk.jpg",
    cook: "Doña Marta",
    cookId: "dona-marta",
    cookAvatar: "/images/dona_rosa_mascot.jpg",
    rating: "4,8",
    reviews: 87,
    distance: "A 800 m",
    distanceMeters: 800,
    residentialComplex: "Conjunto El Rosal",
    totalPortions: 4,
    availablePortions: 4,
    reservedPortions: 0,
    status: "DISPONIBLE",
    description: "Pierna pernil en salsa de tomate criollo, cebolla junca y papitas criollas doradas.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "dish-4",
    name: "Lentejas con arroz",
    category: "Vegetariano",
    dietaryTags: ["Vegetariano", "Vegano"],
    badge: null,
    price: 15000,
    formattedPrice: "$15.000",
    image: "/images/hero_plate_gourmet.jpg",
    cook: "María Elena",
    cookId: "maria-elena",
    cookAvatar: "/images/abuelita_3d_mascot.jpg",
    rating: "4,7",
    reviews: 73,
    distance: "A 1,2 km",
    distanceMeters: 1200,
    residentialComplex: "Altos del Salitre",
    totalPortions: 3,
    availablePortions: 1,
    reservedPortions: 2,
    status: "DISPONIBLE",
    description: "Lentejas estofadas a fuego lento, arroz blanco, tajadas doradas y ensalada de aguacate.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "dish-5",
    name: "Sancocho de pollo",
    category: "Sopas",
    dietaryTags: ["Sin Lactosa"],
    badge: "Recién preparado",
    price: 19000,
    formattedPrice: "$19.000",
    image: "/images/olla_dish_1.jpg",
    cook: "Don Luis",
    cookId: "don-luis",
    cookAvatar: "/images/dona_rosa_mascot.jpg",
    rating: "4,9",
    reviews: 101,
    distance: "A 1,1 km",
    distanceMeters: 1100,
    residentialComplex: "Residencias Colina",
    totalPortions: 4,
    availablePortions: 4,
    reservedPortions: 0,
    status: "DISPONIBLE",
    description: "Tres carnes doradas al carbón, yuca harinosa, plátano y mazorca con ají casero.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "dish-6",
    name: "Arroz con leche",
    category: "Postres",
    dietaryTags: ["Vegetariano"],
    badge: null,
    price: 6000,
    formattedPrice: "$6.000",
    image: "/images/menu_postre.jpg",
    cook: "Doña Lucía",
    cookId: "dona-lucia",
    cookAvatar: "/images/abuelita_3d_mascot.jpg",
    rating: "4,8",
    reviews: 64,
    distance: "A 900 m",
    distanceMeters: 900,
    residentialComplex: "Bosques de Granada",
    totalPortions: 5,
    availablePortions: 5,
    reservedPortions: 0,
    status: "DISPONIBLE",
    description: "Postre tradicional con uvas pasas maceradas y un toque dulce de panela raspada.",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    cookId: "dona-rosa",
    reservationId: "res-init-1",
    buyerName: "Carlos M.",
    rating: 5,
    comment: "¡El ajiaco estaba espectacular! Sabe exactamente como el de mi abuela. Llegó super caliente a la portería.",
    createdAt: "Ayer 1:30 PM",
  },
  {
    id: "rev-2",
    cookId: "dona-rosa",
    reservationId: "res-init-2",
    buyerName: "Andrea P.",
    rating: 5,
    comment: "Excelente atención y porciones abundantes. Las alcaparras y la crema de leche Venían empacadas por separado impecable.",
    createdAt: "Hace 2 días",
  },
  {
    id: "rev-3",
    cookId: "dona-rosa",
    reservationId: "res-init-3",
    buyerName: "Felipe T.",
    rating: 4,
    comment: "Muy buena sazón casera. 100% recomendado para los almuerzos del trabajo.",
    createdAt: "Hace 3 días",
  },
];

// Helper functions for persistent LocalStorage management
export const getStoredDishes = (): DishItem[] => {
  if (typeof window === "undefined") return INITIAL_DISHES;
  const stored = localStorage.getItem("ollacercana_dishes_v2");
  if (!stored) {
    localStorage.setItem("ollacercana_dishes_v2", JSON.stringify(INITIAL_DISHES));
    return INITIAL_DISHES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_DISHES;
  }
};

export const saveDishes = (dishes: DishItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ollacercana_dishes_v2", JSON.stringify(dishes));
};

export const getStoredReservations = (): Reservation[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("ollacercana_reservations_v2");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveReservations = (reservations: Reservation[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ollacercana_reservations_v2", JSON.stringify(reservations));
};

/** Recalculates a complex's daily Olla Verde progress after a completed sale. */
export const syncOllaVerdeProgressAfterCompletion = (reservation: Reservation): void => {
  if (typeof window === "undefined" || reservation.status !== "COMPLETADA") return;
  const complex = reservation.cookResidentialComplex;
  if (!complex) return;
  const completedAt = reservation.completedAt || reservation.createdAt;
  const date = localDateKey(new Date(completedAt));
  const publishedDishes = getStoredDishes().filter((dish) =>
    sharesResidentialComplex(dish.residentialComplex, complex) && localDateKey(new Date(dish.createdAt)) === date,
  );
  const portionsPublished = publishedDishes.reduce((total, dish) => total + dish.totalPortions, 0);
  if (portionsPublished <= 0) return;

  const portionsSold = getStoredReservations()
    .filter((item) => item.status === "COMPLETADA" && sharesResidentialComplex(item.cookResidentialComplex, complex))
    .filter((item) => localDateKey(new Date(item.completedAt || item.createdAt)) === date)
    .reduce((total, item) => total + item.portions, 0);

  recordOllaVerdeDailyProgress({ residentialComplex: complex, date, portionsPublished, portionsSold });
};

export const getStoredReviews = (): Review[] => {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  const stored = localStorage.getItem("ollacercana_reviews_v2");
  if (!stored) {
    localStorage.setItem("ollacercana_reviews_v2", JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_REVIEWS;
  }
};

export const saveReviews = (reviews: Review[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ollacercana_reviews_v2", JSON.stringify(reviews));
};

export const getStoredReports = (): CommunityReport[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("ollacercana_reports_v2");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveReports = (reports: CommunityReport[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ollacercana_reports_v2", JSON.stringify(reports));
};

export const getStoredMessages = (reservationId: string): ChatMessage[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`ollacercana_chat_${reservationId}`);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveMessages = (reservationId: string, msgs: ChatMessage[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(`ollacercana_chat_${reservationId}`, JSON.stringify(msgs));
};

// OC-243: ¿tiene esta conversación un mensaje pendiente de leer para el usuario actual?
// Se apoya en el puntero "último leído" (ollacercana_chat_read_{reservationId}_{email})
// que ChatModal ya guarda al abrir el chat.
export const hasPendingChatMessage = (
  reservationId: string,
  viewer: { email: string; name?: string; commercialName?: string }
): boolean => {
  if (typeof window === "undefined") return false;
  const history = getStoredMessages(reservationId);
  if (history.length === 0) return false;

  const lastMsg = history[history.length - 1];
  const viewerName = viewer.name || viewer.commercialName || viewer.email;
  const sentByViewer =
    lastMsg.sender === viewerName ||
    lastMsg.sender === viewer.commercialName ||
    lastMsg.sender === viewer.email;
  if (sentByViewer || lastMsg.sender === "Sistema OllaCercana") return false;

  const lastReadId = localStorage.getItem(`ollacercana_chat_read_${reservationId}_${viewer.email}`);
  return lastReadId !== lastMsg.id;
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    targetEmail: "comprador@ollacercana.com",
    title: "Reserva Confirmada",
    message: "¡Tu pedido de Guiso Tradicional en Cazuela ha sido confirmado por Doña Elena!",
    read: false,
    timestamp: "Hace 15 min",
  },
  {
    id: "notif-[#2]",
    targetEmail: "comprador@ollacercana.com",
    title: "Recordatorio de Recogida",
    message: "Faltan 15 minutos para la hora acordada de recogida en la portería.",
    read: false,
    timestamp: "Hace 1 hora",
  },
];

export const getStoredNotifications = (): AppNotification[] => {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  const stored = localStorage.getItem("ollacercana_notifications_v2");
  if (!stored) {
    localStorage.setItem("ollacercana_notifications_v2", JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifs: AppNotification[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("ollacercana_notifications_v2", JSON.stringify(notifs));
};

const BROWSER_NOTIFICATIONS_KEY = "ollacercana_browser_notifications_v1";

export const getBrowserNotificationsEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(BROWSER_NOTIFICATIONS_KEY) === "true";
};

export const setBrowserNotificationsEnabled = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(BROWSER_NOTIFICATIONS_KEY, String(enabled));
};

export const addNotification = (title: string, message: string, targetEmail: string = "usuario") => {
  const current = getStoredNotifications();
  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    targetEmail,
    title,
    message,
    read: false,
    timestamp: "Ahora mismo",
  };
  saveNotifications([newNotif, ...current]);

  if (getBrowserNotificationsEnabled() && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body: message, icon: "/brand/ollacercana-icon.svg", tag: newNotif.id });
    } catch (error) {
      console.warn("No fue posible mostrar el aviso del navegador.", error);
    }
  }
};

// ============================================================================
// HU-21: Participación en Retos Comunitarios e Insignias de Fidelidad (Vecino Fiel)
// Escenario 1: 3 reservas completadas en un mismo mes con la misma cocinera -> otorga insignia "Vecino Fiel"
// Escenario 3: Pasa un mes sin pedir a la misma cocinera -> contador de racha se reinicia
// ============================================================================

export interface VecinoFielCookStreak {
  cookId: string;
  cookName: string;
  cookAvatar?: string;
  cookResidentialComplex?: string;
  currentMonthOrders: number;
  isUnlocked: boolean; // >= 3 in current month
  completedDeliveries: Reservation[];
  lastOrderDate?: string;
  streakStatus: "ACTIVA" | "EN_PROGRESO" | "REINICIADA";
}

export interface VecinoFielSummary {
  isVecinoFiel: boolean;
  unlockedCooks: VecinoFielCookStreak[];
  inProgressCooks: VecinoFielCookStreak[];
  topCook?: VecinoFielCookStreak;
  totalCompletedThisMonth: number;
  allCookStreaks: VecinoFielCookStreak[];
}

export const getMonthKey = (dateStrOrObj?: string | Date): string => {
  const d = dateStrOrObj ? new Date(dateStrOrObj) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const getVecinoFielStatus = (buyerEmail?: string): VecinoFielSummary => {
  if (typeof window === "undefined") {
    return {
      isVecinoFiel: false,
      unlockedCooks: [],
      inProgressCooks: [],
      totalCompletedThisMonth: 0,
      allCookStreaks: [],
    };
  }

  const allReservations = getStoredReservations();
  const currentMonthKey = getMonthKey(new Date());

  // Determine buyer email: either passed or from logged in user or first reservation
  let targetEmail = buyerEmail?.trim().toLowerCase();
  if (!targetEmail) {
    try {
      const userJson = localStorage.getItem("ollacercana_user");
      if (userJson) {
        const u = JSON.parse(userJson);
        targetEmail = u.email?.trim().toLowerCase();
      }
    } catch {
      // fallback
    }
  }

  // Filter completed reservations for this buyer (or all completed if no specific email is found in demo)
  const buyerCompleted = allReservations.filter((r) => {
    if (r.status !== "COMPLETADA") return false;
    if (!targetEmail) return true;
    return r.buyerEmail?.trim().toLowerCase() === targetEmail;
  });

  // Group by cookId
  const byCook = new Map<string, Reservation[]>();
  buyerCompleted.forEach((res) => {
    const list = byCook.get(res.cookId) || [];
    list.push(res);
    byCook.set(res.cookId, list);
  });

  // Also include popular default cooks from demo dishes if not yet ordered
  const dishes = getStoredDishes();
  dishes.forEach((d) => {
    if (!byCook.has(d.cookId)) {
      byCook.set(d.cookId, []);
    }
  });

  const allCookStreaks: VecinoFielCookStreak[] = [];

  byCook.forEach((resList, cookId) => {
    const cookDish = dishes.find((d) => d.cookId === cookId);
    const cookName = resList[0]?.cookName || cookDish?.cook || `Cocinera ${cookId}`;
    const cookAvatar = resList[0]?.cookAvatar || cookDish?.cookAvatar || "/images/abuelita_3d_hq.jpg";
    const cookComplex = resList[0]?.cookResidentialComplex || cookDish?.residentialComplex || "Conjunto OllaCercana";

    // Orders in current calendar month
    const thisMonthOrders = resList.filter((r) => {
      const dateKey = getMonthKey(r.completedAt || r.createdAt);
      return dateKey === currentMonthKey;
    });

    // Orders in older months
    const olderOrders = resList.filter((r) => {
      const dateKey = getMonthKey(r.completedAt || r.createdAt);
      return dateKey !== currentMonthKey;
    });

    const currentCount = thisMonthOrders.length;
    const isUnlocked = currentCount >= 3;

    // Determine status (HU-21 Escenario 3: si pasa un mes sin pedir, racha se reinicia)
    let streakStatus: "ACTIVA" | "EN_PROGRESO" | "REINICIADA" = "EN_PROGRESO";
    if (isUnlocked) {
      streakStatus = "ACTIVA";
    } else if (currentCount === 0 && olderOrders.length > 0) {
      streakStatus = "REINICIADA";
    }

    const lastOrder = [...resList].sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime())[0];

    allCookStreaks.push({
      cookId,
      cookName,
      cookAvatar,
      cookResidentialComplex: cookComplex,
      currentMonthOrders: currentCount,
      isUnlocked,
      completedDeliveries: thisMonthOrders,
      lastOrderDate: lastOrder?.completedAt || lastOrder?.createdAt,
      streakStatus,
    });
  });

  // Sort: unlocked first, then highest current orders
  allCookStreaks.sort((a, b) => {
    if (a.isUnlocked && !b.isUnlocked) return -1;
    if (!a.isUnlocked && b.isUnlocked) return 1;
    return b.currentMonthOrders - a.currentMonthOrders;
  });

  const unlockedCooks = allCookStreaks.filter((c) => c.isUnlocked);
  const inProgressCooks = allCookStreaks.filter((c) => !c.isUnlocked);
  const totalCompletedThisMonth = buyerCompleted.filter((r) => getMonthKey(r.completedAt || r.createdAt) === currentMonthKey).length;

  return {
    isVecinoFiel: unlockedCooks.length > 0,
    unlockedCooks,
    inProgressCooks,
    topCook: allCookStreaks[0],
    totalCompletedThisMonth,
    allCookStreaks,
  };
};

export const syncVecinoFielAfterCompletion = (reservation: Reservation): void => {
  if (typeof window === "undefined" || reservation.status !== "COMPLETADA") return;

  const status = getVecinoFielStatus(reservation.buyerEmail);
  const streakForCook = status.allCookStreaks.find((c) => c.cookId === reservation.cookId);

  // If this order completed the 3rd delivery, grant badge to current user profile
  try {
    const userJson = localStorage.getItem("ollacercana_user");
    if (userJson) {
      const user: UserProfile = JSON.parse(userJson);
      const isTargetUser = !reservation.buyerEmail || user.email.toLowerCase() === reservation.buyerEmail.toLowerCase();
      if (isTargetUser) {
        const badges = new Set(user.badges || []);
        if (streakForCook && streakForCook.currentMonthOrders >= 3) {
          badges.add("Vecino Fiel");
          user.badges = Array.from(badges);
          localStorage.setItem("ollacercana_user", JSON.stringify(user));

          addNotification(
            "🌟 ¡Insignia y 5% de Descuento: Vecino Fiel!",
            `Has completado 3 entregas este mes con ${reservation.cookName}. Tu perfil ahora luce con orgullo el sello de Vecino Fiel y tienes un 5% de descuento en tu siguiente pedido de comida con ella.`,
            user.email
          );
        }
      }
    }
  } catch (err) {
    console.error("Error updating Vecino Fiel badge:", err);
  }

  window.dispatchEvent(new CustomEvent("vecinofiel-updated", { detail: { cookId: reservation.cookId } }));
};

export const getVecinoFielDiscountForCook = (
  cookIdOrName: string,
  buyerEmail?: string
): { hasDiscount: boolean; discountPercent: number; reason: string } => {
  if (typeof window === "undefined") return { hasDiscount: false, discountPercent: 0, reason: "" };

  const status = getVecinoFielStatus(buyerEmail);
  const normalizedTarget = cookIdOrName.toLowerCase().replace(/\s+/g, "-");

  const cookStreak = status.unlockedCooks.find(
    (c) =>
      c.cookId === cookIdOrName ||
      c.cookId === normalizedTarget ||
      c.cookName.toLowerCase() === cookIdOrName.toLowerCase()
  );

  if (cookStreak && cookStreak.isUnlocked) {
    return {
      hasDiscount: true,
      discountPercent: 5,
      reason: `Beneficio Vecino Fiel: 5% de descuento con ${cookStreak.cookName}`,
    };
  }

  return { hasDiscount: false, discountPercent: 0, reason: "" };
};

