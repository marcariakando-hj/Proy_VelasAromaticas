export interface OlfactoryPyramid {
  salida: string;
  corazon: string;
  fondo: string;
}

export interface CandleProduct {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  price: number;
  weightGrams: number;
  burnHours: number;
  image: string;
  vesselColor: string;
  vesselName: string;
  category: 'Relajación' | 'Cálido & Especiado' | 'Madera & Místico' | 'Fresco & Vital' | string;
  olfactoryPyramid: OlfactoryPyramid;
  ingredients: string[];
  botanicals: string[];
  description: string;
  artisanNote: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  featured?: boolean;
  waxColorName?: string;
  waxColorHex?: string;
  wickType?: string;
  customLabelTitle?: string;
  customLabelSubtitle?: string;
}

export interface CartItem {
  candle: CandleProduct;
  quantity: number;
  customEngraving?: string;
  giftWrap?: boolean;
  woodenMatchesSample?: boolean;
  customDetails?: {
    vesselName?: string;
    waxColorName?: string;
    waxColorHex?: string;
    wickName?: string;
    botanicalsList?: string[];
    labelTitle?: string;
    labelSubtitle?: string;
  };
}

export interface BespokeFormula {
  candleName: string;
  olfactoryPyramid: OlfactoryPyramid;
  description: string;
  vesselRecommendation: string;
  burningRitual: string;
  moodAlignment: string;
  soundAmbience: string;
  customNotes?: string[];
  chosenVesselColor?: string;
  chosenSize?: string;
}

export interface CandleReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  location: string;
  candleName: string;
  verified: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  artistInspiration: string;
  technique: string;
  designMeaning: string;
  aromaDesignRelation: string;
  quote: string;
  image: string;
  associatedCandleId?: string;
  associatedCandleName?: string;
  discipline: string;
  paletteColors: string[];
}

export type UserRole = 'cliente' | 'administrador';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
  status: 'activo' | 'suspendido';
}

export type OrderStatus = 'Pendiente' | 'En Elaboración' | 'Enviado' | 'Entregado' | 'Cancelado';

export interface StoreOrder {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
  notes?: string;
  trackingCode?: string;
}

export interface BrandConfig {
  brandName: string;
  slogan: string;
  logoUrl: string;
  aboutTagline: string;
  aboutDescription: string;
  aboutDetailedStory: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  shippingFreeThreshold: number;
  currencySymbol: string;
}

export interface AromaItem {
  id: string;
  name: string;
  family: string;
  intensity: number; // 1-5
  notes: string[];
  description: string;
  accentColor: string;
}

