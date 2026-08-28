import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CandleProduct,
  Collaborator,
  UserAccount,
  StoreOrder,
  BrandConfig,
  AromaItem,
  CartItem,
} from "../types";
import { CANDLE_COLLECTION, COLLABORATORS } from "../data/candles";
import defaultLogo from "../assets/images/ayllu_logo_1787870076474.jpg";

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  brandName: "Ayllu",
  slogan: "Velas con Aroma • Creación Artesanal",
  logoUrl: defaultLogo,
  aboutTagline: "Comunidad, Arte Botánico & Luz Consciente",
  aboutDescription:
    "Porque juntos somos más que un grupo: somos manos que crean, sueños que se unen y luces que inspiran. Cada vela que elaboramos lleva una parte de nuestra historia y nos recuerda que las mejores cosas nacen cuando crecemos en comunidad.",
  aboutDetailedStory:
    "Ayllu es una palabra ancestral quechua y aymara que describe el núcleo sagrado de la vida en comunidad: un tejido de artesanas, ilustradores y botánicos unidos por la reciprocidad (ayni) y el respeto a la tierra. Cada vela de cera de soja virgen es vertida artesanalmente a mano en pequeños lotes, acompañada por el crepitar relajante de mechas de madera silvestre y vestida con el arte vivo de jóvenes creadores locales.",
  contactEmail: "taller@aylluvelas.es",
  contactPhone: "+34 912 345 678",
  whatsappNumber: "+34 612 345 678",
  shippingFreeThreshold: 45,
  currencySymbol: "€",
};

export const DEFAULT_AROMAS: AromaItem[] = [
  {
    id: "aroma-lavanda",
    name: "Lavanda Silvestre Francesa",
    family: "Floral & Relajación",
    intensity: 4,
    notes: ["Lavandina de Provenza", "Manzanilla Romana", "Eucalipto dulce"],
    description: "Inductor natural del sueño, serenidad mental y reducción de la ansiedad.",
    accentColor: "#9B88A8",
  },
  {
    id: "aroma-citricos-canela",
    name: "Naranja Sanguina & Canela Ceilán",
    family: "Cálido & Especiado",
    intensity: 5,
    notes: ["Rodajas de naranja deshidratada", "Canela corteza pura", "Clavo de olor"],
    description: "Fragancia acogedora, hogareña y revitalizante con acordes cítricos tostados.",
    accentColor: "#D98B68",
  },
  {
    id: "aroma-sandalo-ambar",
    name: "Sándalo de Mysore & Ámbar Noble",
    family: "Madera & Místico",
    intensity: 4,
    notes: ["Sándalo pulido", "Resina de ámbar fósil", "Cedro del Atlas", "Incienso blanco"],
    description: "Profundidad meditativa terrosa para templanza, yoga y lectura consciente.",
    accentColor: "#8C7A6B",
  },
  {
    id: "aroma-vainilla-bourbon",
    name: "Vainilla Bourbon & Haba Tonka",
    family: "Gourmand & Suave",
    intensity: 3,
    notes: ["Vaina de vainilla infusionada", "Haba tonka tostada", "Azúcar moreno"],
    description: "Dulzura aterciopelada y reconfortante que envuelve el ambiente sin empalagar.",
    accentColor: "#C8A172",
  },
  {
    id: "aroma-bosque-eucalipto",
    name: "Eucalipto Andino & Menta Silvestre",
    family: "Fresco & Botánico",
    intensity: 4,
    notes: ["Hojas de eucalipto fresco", "Menta piperita", "Agujas de pino", "Brisa pura"],
    description: "Apertura de vías respiratorias, claridad mental y frescura biofílica pura.",
    accentColor: "#608058",
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "user-admin-1",
    name: "Sofia Alarcón",
    email: "admin@ayllu.es",
    password: "admin",
    role: "administrador",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+34 600 111 222",
    city: "Madrid",
    address: "Calle de los Artesanos 14, 2ºB",
    createdAt: "2024-01-15",
    status: "activo",
  },
  {
    id: "user-client-1",
    name: "Lucía Fernández",
    email: "cliente@ayllu.es",
    password: "cliente",
    role: "cliente",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "+34 655 444 333",
    city: "Barcelona",
    address: "Carrer del Pi 8, 1º",
    createdAt: "2024-02-10",
    status: "activo",
  },
];

export const INITIAL_ORDERS: StoreOrder[] = [
  {
    id: "AYL-9042",
    userId: "user-client-1",
    customerName: "Lucía Fernández",
    customerEmail: "cliente@ayllu.es",
    customerPhone: "+34 655 444 333",
    shippingAddress: "Carrer del Pi 8, 1º",
    shippingCity: "Barcelona",
    items: [
      {
        candle: CANDLE_COLLECTION[0],
        quantity: 1,
        customEngraving: "Paz para el hogar • Lucía",
        giftWrap: true,
      },
      {
        candle: CANDLE_COLLECTION[1],
        quantity: 1,
        giftWrap: false,
      },
    ],
    subtotal: 74,
    shippingCost: 0,
    total: 74,
    status: "En Elaboración",
    createdAt: "2026-08-25T14:30:00Z",
    paymentMethod: "Tarjeta de Crédito / Débito (Stripe)",
    notes: "Por favor envolver para regalo con dedicatoria especial.",
    trackingCode: "AYLLU-ES-89210",
  },
];

interface StoreContextType {
  // Brand
  brandConfig: BrandConfig;
  updateBrandConfig: (newConfig: Partial<BrandConfig>) => void;
  resetBrandConfig: () => void;

  // Products
  candles: CandleProduct[];
  addCandle: (candle: CandleProduct) => void;
  updateCandle: (id: string, updated: Partial<CandleProduct>) => void;
  deleteCandle: (id: string) => void;

  // Collaborators
  collaborators: Collaborator[];
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (id: string, updated: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;

  // Aromas
  aromas: AromaItem[];
  addAroma: (aroma: AromaItem) => void;
  updateAroma: (id: string, updated: Partial<AromaItem>) => void;
  deleteAroma: (id: string) => void;

  // Users & Auth
  users: UserAccount[];
  currentUser: UserAccount | null;
  loginUser: (email: string, password?: string) => { success: boolean; message: string };
  registerUser: (data: { name: string; email: string; password?: string; role?: "cliente" | "administrador" }) => { success: boolean; message: string };
  logoutUser: () => void;
  updateUserStatus: (userId: string, status: "activo" | "suspendido") => void;
  updateUserRole: (userId: string, role: "cliente" | "administrador") => void;
  deleteUser: (userId: string) => void;

  // Orders
  orders: StoreOrder[];
  createOrder: (orderData: Omit<StoreOrder, "id" | "createdAt">) => StoreOrder;
  updateOrderStatus: (orderId: string, status: StoreOrder["status"]) => void;
  deleteOrder: (orderId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Brand Config State
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    try {
      const saved = localStorage.getItem("ayllu_brand_config");
      return saved ? { ...DEFAULT_BRAND_CONFIG, ...JSON.parse(saved) } : DEFAULT_BRAND_CONFIG;
    } catch {
      return DEFAULT_BRAND_CONFIG;
    }
  });

  // Candles State
  const [candles, setCandles] = useState<CandleProduct[]>(() => {
    try {
      const saved = localStorage.getItem("ayllu_candles");
      return saved ? JSON.parse(saved) : CANDLE_COLLECTION;
    } catch {
      return CANDLE_COLLECTION;
    }
  });

  // Collaborators State
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    try {
      const saved = localStorage.getItem("ayllu_collaborators");
      return saved ? JSON.parse(saved) : COLLABORATORS;
    } catch {
      return COLLABORATORS;
    }
  });

  // Aromas State
  const [aromas, setAromas] = useState<AromaItem[]>(() => {
    try {
      const saved = localStorage.getItem("ayllu_aromas");
      return saved ? JSON.parse(saved) : DEFAULT_AROMAS;
    } catch {
      return DEFAULT_AROMAS;
    }
  });

  // Users State
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem("ayllu_users");
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current Auth User
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem("ayllu_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    try {
      const saved = localStorage.getItem("ayllu_orders");
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem("ayllu_brand_config", JSON.stringify(brandConfig));
  }, [brandConfig]);

  useEffect(() => {
    localStorage.setItem("ayllu_candles", JSON.stringify(candles));
  }, [candles]);

  useEffect(() => {
    localStorage.setItem("ayllu_collaborators", JSON.stringify(collaborators));
  }, [collaborators]);

  useEffect(() => {
    localStorage.setItem("ayllu_aromas", JSON.stringify(aromas));
  }, [aromas]);

  useEffect(() => {
    localStorage.setItem("ayllu_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ayllu_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("ayllu_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("ayllu_orders", JSON.stringify(orders));
  }, [orders]);

  // Brand actions
  const updateBrandConfig = (newConfig: Partial<BrandConfig>) => {
    setBrandConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetBrandConfig = () => {
    setBrandConfig(DEFAULT_BRAND_CONFIG);
  };

  // Candle actions
  const addCandle = (candle: CandleProduct) => {
    setCandles((prev) => [candle, ...prev]);
  };

  const updateCandle = (id: string, updated: Partial<CandleProduct>) => {
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCandle = (id: string) => {
    setCandles((prev) => prev.filter((c) => c.id !== id));
  };

  // Collaborator actions
  const addCollaborator = (collab: Collaborator) => {
    setCollaborators((prev) => [...prev, collab]);
  };

  const updateCollaborator = (id: string, updated: Partial<Collaborator>) => {
    setCollaborators((prev) =>
      prev.map((collab) => (collab.id === id ? { ...collab, ...updated } : collab))
    );
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  // Aroma actions
  const addAroma = (aroma: AromaItem) => {
    setAromas((prev) => [...prev, aroma]);
  };

  const updateAroma = (id: string, updated: Partial<AromaItem>) => {
    setAromas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAroma = (id: string) => {
    setAromas((prev) => prev.filter((a) => a.id !== id));
  };

  // User actions
  const loginUser = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!found) {
      return { success: false, message: "No se encontró ningún usuario con este correo electrónico." };
    }

    if (found.status === "suspendido") {
      return { success: false, message: "Esta cuenta está temporalmente suspendida por administración." };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, message: "Contraseña incorrecta. Por favor verifique sus datos." };
    }

    setCurrentUser(found);
    return { success: true, message: `¡Bienvenido/a de nuevo, ${found.name}!` };
  };

  const registerUser = (data: {
    name: string;
    email: string;
    password?: string;
    role?: "cliente" | "administrador";
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: "Ya existe una cuenta registrada con este correo electrónico." };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || "123456",
      role: data.role || "cliente",
      createdAt: new Date().toISOString().split("T")[0],
      status: "activo",
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: `Cuenta creada exitosamente. ¡Bienvenido/a, ${newUser.name}!` };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserStatus = (userId: string, status: "activo" | "suspendido") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    if (currentUser?.id === userId && status === "suspendido") {
      setCurrentUser(null);
    }
  };

  const updateUserRole = (userId: string, role: "cliente" | "administrador") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  // Order actions
  const createOrder = (orderData: Omit<StoreOrder, "id" | "createdAt">): StoreOrder => {
    const newOrder: StoreOrder = {
      ...orderData,
      id: `AYL-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      trackingCode: `AYLLU-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: StoreOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <StoreContext.Provider
      value={{
        brandConfig,
        updateBrandConfig,
        resetBrandConfig,
        candles,
        addCandle,
        updateCandle,
        deleteCandle,
        collaborators,
        addCollaborator,
        updateCollaborator,
        deleteCollaborator,
        aromas,
        addAroma,
        updateAroma,
        deleteAroma,
        users,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        updateUserStatus,
        updateUserRole,
        deleteUser,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
