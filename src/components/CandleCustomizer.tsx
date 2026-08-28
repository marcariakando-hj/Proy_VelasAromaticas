import React, { useState, useEffect } from "react";
import {
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  ShoppingBag,
  Check,
  RotateCcw,
  Palette,
  Layers,
  Leaf,
  Tag,
  Info,
  Sliders,
  Heart,
  ChevronRight,
  ShieldCheck,
  Clock,
  Feather
} from "lucide-react";
import { CandleProduct } from "../types";
import { woodSoundEngine } from "../utils/audioSynth";

interface CandleCustomizerProps {
  onAddCustomCandleToCart: (customCandle: CandleProduct) => void;
}

export interface VesselOption {
  id: string;
  name: string;
  subtitle: string;
  basePrice: number;
  color: string;
  borderColor: string;
  rimColor: string;
  waxColor: string;
  image: string;
  textureName: string;
  description: string;
}

export interface WaxColorOption {
  id: string;
  name: string;
  subtitle: string;
  hex: string;
  borderHex: string;
  tagColor: string;
  description: string;
  mood: string;
}

export interface WickOption {
  id: "madera" | "algodon";
  name: string;
  subtitle: string;
  priceAddon: number;
  description: string;
  hasAudio: boolean;
}

export interface BotanicalOption {
  id: string;
  name: string;
  category: "Salida" | "Corazón" | "Fondo";
  scentFamily: string;
  color: string;
  priceAddon: number;
  description: string;
  visualType:
    | "lavanda"
    | "naranja"
    | "canela"
    | "eucalipto"
    | "vainilla"
    | "jazmin"
    | "rosa"
    | "anis"
    | "cedro"
    | "romero"
    | "cafe"
    | "clavo";
}

export interface LabelStyleOption {
  id: "kraft" | "lino" | "negro" | "laser";
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const VESSELS: VesselOption[] = [
  {
    id: "arena",
    name: "Cerámica Arena Mate",
    subtitle: "Arcilla mineral con esmalte satinado cálido",
    basePrice: 28,
    color: "#E2D9CF",
    borderColor: "#C5B8AA",
    rimColor: "#D3C6B8",
    waxColor: "#FAF7F2",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    textureName: "Arena Artesanal",
    description: "Tono crudo atemporal que encaja en cualquier ambiente mediterráneo o nórdico.",
  },
  {
    id: "negra",
    name: "Cerámica Negra Carbón",
    subtitle: "Barro volcánico mate de alta temperatura",
    basePrice: 30,
    color: "#2C2825",
    borderColor: "#1E1B19",
    rimColor: "#3D3733",
    waxColor: "#FAF6EE",
    image: "https://images.unsplash.com/photo-1572726729437-343d6411ce9e?auto=format&fit=crop&w=800&q=80",
    textureName: "Carbón Satinado",
    description: "Elegancia contemporánea con un contraste dramático con la cera marfil o pastel.",
  },
  {
    id: "terracota",
    name: "Terracota Andina Rústica",
    subtitle: "Arcilla roja horneada de textura porosa",
    basePrice: 30,
    color: "#B86B53",
    borderColor: "#9B533E",
    rimColor: "#CB7B63",
    waxColor: "#FBF7F0",
    image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&w=800&q=80",
    textureName: "Tierra Quemada",
    description: "Inspirada en las alfarerías ancestrales, aporta máxima calidez orgánica al espacio.",
  },
  {
    id: "cristal-ambar",
    name: "Cristal Ámbar Boticario",
    subtitle: "Vidrio soplado artesanal con filtro de luz dorada",
    basePrice: 26,
    color: "#7E522C",
    borderColor: "#5F3C1E",
    rimColor: "#A66D3B",
    waxColor: "#F7F2E7",
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80",
    textureName: "Ámbar Traslúcido",
    description: "Estilo botánico clásico que proyecta destellos dorados hipnóticos cuando la mecha está encendida.",
  },
  {
    id: "blanco-piedra",
    name: "Cerámica Caliza Blanca",
    subtitle: "Porcelana mate con micropartículas de piedra",
    basePrice: 32,
    color: "#EDE8E1",
    borderColor: "#D6CECE",
    rimColor: "#F5F1EB",
    waxColor: "#FCFAF6",
    image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b8?auto=format&fit=crop&w=800&q=80",
    textureName: "Piedra Caliza",
    description: "Pureza arquitectónica y serenidad zen que magnifica la textura botánica en la superficie.",
  },
];

export const WAX_COLORS: WaxColorOption[] = [
  {
    id: "marfil",
    name: "Blanco Marfil (Natural)",
    subtitle: "Cera 100% de soja virgen sin tintes",
    hex: "#FAF7F2",
    borderHex: "#E5DEC9",
    tagColor: "#F4EFE6",
    description: "Tono crudo atemporal, orgánico y luminoso de la cera vegetal pura.",
    mood: "Pureza & Serenidad",
  },
  {
    id: "lavanda",
    name: "Lavanda Pastel",
    subtitle: "Pigmentos botánicos con matiz violeta suave",
    hex: "#E8E2F0",
    borderHex: "#D3C7E3",
    tagColor: "#DFD5EB",
    description: "Inspira relajación profunda y sosiego visual en dormitorios y áreas de meditación.",
    mood: "Calma & Sueño",
  },
  {
    id: "rosa",
    name: "Rosa Botánico",
    subtitle: "Infundido con tonos pétalo empolvado",
    hex: "#F5E5E8",
    borderHex: "#E6CCD2",
    tagColor: "#EED7DC",
    description: "Aura romántica y acogedora que resalta los toppings botánicos florales.",
    mood: "Amor & Ternura",
  },
  {
    id: "verde-salvia",
    name: "Verde Salvia",
    subtitle: "Verde herbal nórdico suave y balsámico",
    hex: "#E2EBE2",
    borderHex: "#C5D8C5",
    tagColor: "#D3E2D3",
    description: "Conexión con la naturaleza y frescura botánica que equilibra los ambientes.",
    mood: "Armonía & Vitalidad",
  },
  {
    id: "terracota",
    name: "Terracota Suave",
    subtitle: "Matiz arcilloso cálido y mineral",
    hex: "#EEDDD3",
    borderHex: "#DEC4B5",
    tagColor: "#E5D0C3",
    description: "Aporta calidez hogareña y una estética rústica andina muy reconfortante.",
    mood: "Tierra & Cobijo",
  },
  {
    id: "amarillo-miel",
    name: "Amarillo Miel",
    subtitle: "Tono dorado suave de miel y polen silvestre",
    hex: "#FBF2DB",
    borderHex: "#EBDDB7",
    tagColor: "#F3E8C7",
    description: "Irradia luz solar tenue, optimismo y bienestar en los rincones del hogar.",
    mood: "Energía Solar & Alegría",
  },
];

export const WICKS: WickOption[] = [
  {
    id: "madera",
    name: "Mecha de Madera FSC",
    subtitle: "Cerezo silvestre con crepitar acústico",
    priceAddon: 3,
    description: "Produce un suave sonido crujiente como chimenea en miniatura y una combustión pareja y aromática.",
    hasAudio: true,
  },
  {
    id: "algodon",
    name: "Algodón 100% Ecológico",
    subtitle: "Trenzado puro sin plomo ni metales pesados",
    priceAddon: 0,
    description: "Llama alta, silenciosa y constante ideal para rituales de lectura y meditación en silencio.",
    hasAudio: false,
  },
];

export const BOTANICALS: BotanicalOption[] = [
  {
    id: "lavanda",
    name: "Lavanda Silvestre",
    category: "Corazón",
    scentFamily: "Floral & Relajación",
    color: "#8E7CC3",
    priceAddon: 0,
    description: "Flores secas recolectadas a mano con propiedades relajantes y calmantes del sistema nervioso.",
    visualType: "lavanda",
  },
  {
    id: "naranja",
    name: "Rodajas de Naranja Seca",
    category: "Salida",
    scentFamily: "Cítrico Cálido",
    color: "#E69138",
    priceAddon: 0,
    description: "Deshidratada al sol; aporta alegría y una frescura cítrica chispeante al primer encendido.",
    visualType: "naranja",
  },
  {
    id: "canela",
    name: "Corteza de Canela de Ceylán",
    category: "Corazón",
    scentFamily: "Especiado Reconfortante",
    color: "#A64D29",
    priceAddon: 0,
    description: "Ramas enrolladas de canela que liberan un aura acogedora y estimulante en el hogar.",
    visualType: "canela",
  },
  {
    id: "eucalipto",
    name: "Eucalipto Andino",
    category: "Salida",
    scentFamily: "Balsámico & Aire Puro",
    color: "#6AA84F",
    priceAddon: 0,
    description: "Hojas enteras verde salvia que despejan el ambiente y aportan vitalidad respiratoria.",
    visualType: "eucalipto",
  },
  {
    id: "vainilla",
    name: "Vainilla Bourbon de Madagascar",
    category: "Fondo",
    scentFamily: "Gourmand Cálido",
    color: "#783F04",
    priceAddon: 1.5,
    description: "Vainas maceradas que aportan dulzura envolvente, persistente y hogareña durante horas.",
    visualType: "vainilla",
  },
  {
    id: "jazmin",
    name: "Flores de Jazmín Nocturno",
    category: "Corazón",
    scentFamily: "Floral Místico",
    color: "#D5A6BD",
    priceAddon: 1.5,
    description: "Capullos aromáticos que potencian la calma emocional y la armonía de los espacios.",
    visualType: "jazmin",
  },
  {
    id: "rosa",
    name: "Pétalos de Rosa Damascena",
    category: "Corazón",
    scentFamily: "Floral Romántico",
    color: "#C27BA0",
    priceAddon: 1.5,
    description: "Pétalos carmesí aterciopelados con fragancia suave, elegante y reconfortante.",
    visualType: "rosa",
  },
  {
    id: "anis",
    name: "Anís Estrellado Botánico",
    category: "Salida",
    scentFamily: "Especiado Místico",
    color: "#8C5835",
    priceAddon: 1.0,
    description: "Estrellas botánicas enteras con un toque anisado sutil que abre la mente.",
    visualType: "anis",
  },
  {
    id: "cedro",
    name: "Virutas de Cedro & Sándalo",
    category: "Fondo",
    scentFamily: "Amaderado Silvestre",
    color: "#7F6000",
    priceAddon: 1.0,
    description: "Astillas de maderas nobles que fijan la fragancia en el ambiente con aroma a bosque profundo.",
    visualType: "cedro",
  },
  {
    id: "romero",
    name: "Romero Silvestre Mediterráneo",
    category: "Salida",
    scentFamily: "Herbal Vigorizante",
    color: "#38761D",
    priceAddon: 0,
    description: "Agujas aromáticas que potencian la concentración, el enfoque y la claridad mental.",
    visualType: "romero",
  },
  {
    id: "cafe",
    name: "Granos de Café Arábica Tostado",
    category: "Fondo",
    scentFamily: "Intenso & Tostado",
    color: "#49311C",
    priceAddon: 1.0,
    description: "Granos seleccionados que aportan un fondo cálido, energizante y tostado irresistible.",
    visualType: "cafe",
  },
  {
    id: "clavo",
    name: "Clavo de Olor & Cardamomo",
    category: "Corazón",
    scentFamily: "Especiado Cálido",
    color: "#5C381E",
    priceAddon: 1.0,
    description: "Notas especiadas profundas que evocan momentos compartidos junto al fuego.",
    visualType: "clavo",
  },
];

export const LABEL_STYLES: LabelStyleOption[] = [
  {
    id: "kraft",
    name: "Papel Kraft Botánico",
    bgClass: "bg-[#D8C4B0] text-[#3D2E24]",
    textClass: "text-[#3D2E24]",
    borderClass: "border-[#B59E87]",
  },
  {
    id: "lino",
    name: "Lino Crudo Texturado",
    bgClass: "bg-[#F3EFE9] text-[#423D33]",
    textClass: "text-[#423D33]",
    borderClass: "border-[#D6CECE]",
  },
  {
    id: "negro",
    name: "Carbón Mate & Oro",
    bgClass: "bg-[#23201D] text-[#E5D7C2]",
    textClass: "text-[#E5D7C2]",
    borderClass: "border-[#4A433D]",
  },
  {
    id: "laser",
    name: "Grabado Madera Láser",
    bgClass: "bg-[#C4A482] text-[#3B2818]",
    textClass: "text-[#3B2818]",
    borderClass: "border-[#9E7B5A]",
  },
];

export const CandleCustomizer: React.FC<CandleCustomizerProps> = ({
  onAddCustomCandleToCart,
}) => {
  // Wizard & Form States
  const [selectedVessel, setSelectedVessel] = useState<VesselOption>(VESSELS[0]);
  const [selectedWaxColor, setSelectedWaxColor] = useState<WaxColorOption>(WAX_COLORS[0]);
  const [selectedWick, setSelectedWick] = useState<WickOption>(WICKS[0]);
  const [selectedBotanicals, setSelectedBotanicals] = useState<BotanicalOption[]>([
    BOTANICALS[0], // Lavanda
    BOTANICALS[1], // Naranja
    BOTANICALS[2], // Canela
  ]);
  const [labelTitle, setLabelTitle] = useState("Vela de Calma & Hogar");
  const [labelSubtitle, setLabelSubtitle] = useState("Vertida a mano con cera de soja virgen");
  const [labelStyle, setLabelStyle] = useState<LabelStyleOption>(LABEL_STYLES[0]);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);

  // Interactive Live Simulation States
  const [isLit, setIsLit] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [viewMode, setViewMode] = useState<"top" | "front">("top");
  const [activeStep, setActiveStep] = useState<number>(1);

  // Audio syncer with candle burning state
  useEffect(() => {
    if (isLit && selectedWick.id === "madera") {
      woodSoundEngine.start();
      woodSoundEngine.setVolume(0.35);
      setIsPlayingAudio(true);
    } else {
      woodSoundEngine.stop();
      setIsPlayingAudio(false);
    }

    return () => {
      woodSoundEngine.stop();
    };
  }, [isLit, selectedWick]);

  const toggleFlame = () => {
    setIsLit((prev) => !prev);
  };

  const toggleSound = () => {
    if (isPlayingAudio) {
      woodSoundEngine.stop();
      setIsPlayingAudio(false);
    } else {
      woodSoundEngine.start();
      woodSoundEngine.setVolume(0.35);
      setIsPlayingAudio(true);
    }
  };

  // Botanical toggle handler (Min 2, Max 5)
  const toggleBotanical = (bot: BotanicalOption) => {
    const exists = selectedBotanicals.some((b) => b.id === bot.id);
    if (exists) {
      if (selectedBotanicals.length > 2) {
        setSelectedBotanicals(selectedBotanicals.filter((b) => b.id !== bot.id));
      }
    } else {
      if (selectedBotanicals.length < 5) {
        setSelectedBotanicals([...selectedBotanicals, bot]);
      }
    }
  };

  // Dynamic Olfactory Pyramid Generation
  const salidaNotes = selectedBotanicals.filter((b) => b.category === "Salida");
  const corazonNotes = selectedBotanicals.filter((b) => b.category === "Corazón");
  const fondoNotes = selectedBotanicals.filter((b) => b.category === "Fondo");

  // Dynamic Price Calculation
  const basePrice = selectedVessel.basePrice;
  const wickPrice = selectedWick.priceAddon;
  const botanicalsAddon = selectedBotanicals.reduce((sum, b) => sum + b.priceAddon, 0);
  const labelPrice = 2.0; // standard custom label
  const giftWrapPrice = includeGiftWrap ? 3.0 : 0.0;
  const totalPrice = Number((basePrice + wickPrice + botanicalsAddon + labelPrice + giftWrapPrice).toFixed(2));

  // Reset to default balanced recipe
  const handleResetRecipe = () => {
    setSelectedVessel(VESSELS[0]);
    setSelectedWaxColor(WAX_COLORS[0]);
    setSelectedWick(WICKS[0]);
    setSelectedBotanicals([BOTANICALS[0], BOTANICALS[1], BOTANICALS[2]]);
    setLabelTitle("Vela de Calma & Hogar");
    setLabelSubtitle("Vertida a mano con cera de soja virgen");
    setLabelStyle(LABEL_STYLES[0]);
    setIncludeGiftWrap(false);
    setIsLit(false);
  };

  // Submit Bespoke Candle to Shopping Cart
  const handleAddToCart = () => {
    const bespokeCandle: CandleProduct = {
      id: `bespoke-candle-${Date.now()}`,
      name: labelTitle.trim() || `Vela Personalizada ${selectedVessel.name}`,
      subtitle: `${selectedBotanicals.map((b) => b.name).join(" • ")}`,
      tagline: `Creación exclusiva en ${selectedVessel.name} (${selectedWaxColor.name})`,
      price: totalPrice,
      weightGrams: 320,
      burnHours: selectedWick.id === "madera" ? 65 : 60,
      image: selectedVessel.image,
      vesselColor: selectedVessel.color,
      vesselName: selectedVessel.name,
      category: "Personalizada",
      olfactoryPyramid: {
        salida: salidaNotes.map((n) => n.name).join(", ") || "Cítricos frescos",
        corazon: corazonNotes.map((n) => n.name).join(", ") || "Flores y especias suaves",
        fondo: fondoNotes.map((n) => n.name).join(", ") || "Maderas y resinas botánicas",
      },
      ingredients: [
        "100% Cera de Soja Virgen sin OGM",
        `Tono de Cera: ${selectedWaxColor.name}`,
        selectedWick.name,
        ...selectedBotanicals.map((b) => b.name),
        "Aceites esenciales puros prensados en frío",
      ],
      botanicals: selectedBotanicals.map((b) => b.name),
      description: `Vela botánica formulada a medida. Vasija de ${selectedVessel.name} con cera en tono ${selectedWaxColor.name} y ${selectedWick.name}. Contiene ${selectedBotanicals.map((b) => b.name).join(", ")}.`,
      artisanNote: `Grabado / Etiqueta: "${labelTitle}" — ${labelSubtitle} | Cera: ${selectedWaxColor.name}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      featured: true,
      waxColorName: selectedWaxColor.name,
      waxColorHex: selectedWaxColor.hex,
      wickType: selectedWick.name,
      customLabelTitle: labelTitle,
      customLabelSubtitle: labelSubtitle,
    };

    onAddCustomCandleToCart(bespokeCandle);
  };

  return (
    <section
      id="personalizar-section"
      className="py-16 bg-[#FAF7F2] border-b border-[#E5E0DA] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E5E0DA] text-[#8C7A6B] text-[10px] uppercase font-bold tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D98B68]" />
            <span>Creación Botánica • Personalización Total</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#423D33] font-normal tracking-tight">
            Personaliza tu Vela Botánica
          </h2>
          <p className="text-xs sm:text-sm text-[#423D33]/75 leading-relaxed">
            Diseña una pieza sensorial única. Elige la vasija artesanal, el tono de la cera vegetal, el tipo de mecha, combina botánicos aromáticos y escribe tu dedicatoria.
          </p>
        </div>

        {/* Quick Stepper Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2">
          {[
            { step: 1, title: "1. Vasija" },
            { step: 2, title: "2. Tono de Cera" },
            { step: 3, title: "3. Mecha" },
            { step: 4, title: "4. Botánicos" },
            { step: 5, title: "5. Etiqueta" },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStep === item.step
                  ? "bg-[#4A4541] text-white shadow-xs"
                  : "bg-white text-[#423D33]/70 border border-[#E5E0DA] hover:bg-[#F2EDE7]"
              }`}
            >
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* TWO-PANEL INTERACTIVE WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Step-by-Step Customizer Controls (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0DA] shadow-xs space-y-8">
            {/* STEP 1: SELECCIÓN DE VASIJA Y BASE */}
            <div className={`space-y-4 ${activeStep !== 1 && "hidden sm:block"}`}>
              <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C7A6B] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#423D33]">
                    Selección de Vasija y Base Mineral
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#8C7A6B]">
                  {selectedVessel.basePrice}€ base
                </span>
              </div>

              <p className="text-xs text-[#423D33]/70">
                Todas nuestras vasijas son moldeadas o sopladas artesanalmente y 100% reutilizables una vez consumida la cera.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VESSELS.map((vessel) => {
                  const isSelected = selectedVessel.id === vessel.id;
                  return (
                    <div
                      key={vessel.id}
                      onClick={() => setSelectedVessel(vessel)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "border-[#8C7A6B] bg-[#FAF7F2] ring-2 ring-[#8C7A6B]/30 shadow-xs"
                          : "border-[#E5E0DA] bg-white hover:border-[#8C7A6B]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: vessel.color }}
                          />
                          <span className="font-serif font-bold text-xs text-[#423D33]">
                            {vessel.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#8C7A6B] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#423D33]/70 line-clamp-2 leading-relaxed">
                        {vessel.subtitle}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-[#8C7A6B] font-semibold border-t border-[#E5E0DA]/50">
                        <span>{vessel.textureName}</span>
                        <span>{vessel.basePrice}€</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SELECTOR DE TONO DE CERA */}
            <div className={`space-y-4 ${activeStep !== 2 && "hidden sm:block"}`}>
              <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C7A6B] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#8C7A6B]" />
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#423D33]">
                      Tono & Color de la Cera
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C7A6B] border border-[#E5E0DA]">
                  {selectedWaxColor.name}
                </span>
              </div>

              <p className="text-xs text-[#423D33]/70">
                Selecciona la tonalidad para la cera de soja vegetal. La vista previa 2D de la superficie se actualizará al instante reflejando la armonía con los botánicos.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WAX_COLORS.map((wax) => {
                  const isSelected = selectedWaxColor.id === wax.id;
                  return (
                    <div
                      key={wax.id}
                      onClick={() => setSelectedWaxColor(wax)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "border-[#8C7A6B] bg-[#FAF7F2] ring-2 ring-[#8C7A6B]/30 shadow-xs"
                          : "border-[#E5E0DA] bg-white hover:border-[#8C7A6B]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* Color Swatch Circle */}
                          <div
                            className="w-5 h-5 rounded-full border-2 shadow-xs shrink-0 flex items-center justify-center"
                            style={{
                              backgroundColor: wax.hex,
                              borderColor: wax.borderHex,
                            }}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#423D33]" />
                            )}
                          </div>
                          <span className="font-serif font-bold text-xs text-[#423D33] leading-tight">
                            {wax.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#8C7A6B] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-[#423D33]/70 line-clamp-2 leading-relaxed">
                        {wax.description}
                      </p>

                      <div className="pt-1 flex items-center justify-between text-[9px] text-[#8C7A6B] font-semibold border-t border-[#E5E0DA]/50">
                        <span className="uppercase tracking-wider">{wax.mood}</span>
                        <span className="text-[#608058] font-bold">100% Soja</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: MECHA Y EXPERIENCIA SENSORIAL */}
            <div className={`space-y-4 ${activeStep !== 3 && "hidden sm:block"}`}>
              <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C7A6B] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#423D33]">
                    Mecha & Experiencia Acústica
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#8C7A6B]">
                  {selectedWick.priceAddon > 0 ? `+${selectedWick.priceAddon}€` : "Incluida"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WICKS.map((wick) => {
                  const isSelected = selectedWick.id === wick.id;
                  return (
                    <div
                      key={wick.id}
                      onClick={() => setSelectedWick(wick)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative space-y-2 ${
                        isSelected
                          ? "border-[#8C7A6B] bg-[#FAF7F2] ring-2 ring-[#8C7A6B]/30 shadow-xs"
                          : "border-[#E5E0DA] bg-white hover:border-[#8C7A6B]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame
                            className={`w-4 h-4 ${
                              wick.id === "madera" ? "text-[#D98B68]" : "text-[#8C7A6B]"
                            }`}
                          />
                          <span className="font-serif font-bold text-sm text-[#423D33]">
                            {wick.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#8C7A6B]">
                          {wick.priceAddon > 0 ? `+${wick.priceAddon}€` : "Incluida"}
                        </span>
                      </div>

                      <p className="text-xs text-[#423D33]/70 leading-relaxed">
                        {wick.description}
                      </p>

                      {wick.hasAudio && (
                        <div className="pt-2 flex items-center gap-2 text-[11px] text-[#D98B68] font-semibold">
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          <span>Habilita sonido de crepitación al encender</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: FORMULACIÓN OLFATIVA Y BOTÁNICOS */}
            <div className={`space-y-4 ${activeStep !== 4 && "hidden sm:block"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0DA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C7A6B] text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#423D33]">
                    Botánicos Aromáticos & Pirámide
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F2EDE7] text-[#423D33] font-bold">
                    {selectedBotanicals.length}/5 seleccionados (Mín. 2)
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#423D33]/70">
                Selecciona entre 2 y 5 botánicos deshidratados reales. Se superpondrán armónicamente sobre el tono de cera seleccionado en la vista previa.
              </p>

              {/* Botanicals Interactive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {BOTANICALS.map((bot) => {
                  const isSelected = selectedBotanicals.some((b) => b.id === bot.id);
                  return (
                    <button
                      key={bot.id}
                      onClick={() => toggleBotanical(bot)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                        isSelected
                          ? "bg-[#4A4541] text-white border-[#4A4541] shadow-xs"
                          : "bg-[#FDFBF9] text-[#423D33] border-[#E5E0DA] hover:border-[#8C7A6B]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: bot.color }}
                        />
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/20 text-[#FAF7F2]"
                              : "bg-[#EAE4DD] text-[#8C7A6B]"
                          }`}
                        >
                          {bot.category}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="font-serif font-bold text-xs block leading-tight">
                          {bot.name}
                        </span>
                        <span
                          className={`text-[10px] block truncate ${
                            isSelected ? "text-stone-300" : "text-[#8C7A6B]"
                          }`}
                        >
                          {bot.scentFamily}
                        </span>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] border-t border-white/10">
                        <span className={isSelected ? "text-stone-300" : "text-[#423D33]/60"}>
                          {bot.priceAddon > 0 ? `+${bot.priceAddon}€` : "Incluido"}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-[#D9C5B2]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Olfactory Pyramid Preview Box */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0DA] space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B] block">
                  Estructura de la Pirámide Olfativa Resultante
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-[#E5E0DA] space-y-1">
                    <span className="text-[10px] font-bold text-[#D98B68] uppercase block">
                      Salida (0 - 20 min)
                    </span>
                    <p className="text-xs font-medium text-[#423D33]">
                      {salidaNotes.length > 0
                        ? salidaNotes.map((n) => n.name).join(", ")
                        : "Notas iniciales suaves"}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#E5E0DA] space-y-1">
                    <span className="text-[10px] font-bold text-[#8C7A6B] uppercase block">
                      Corazón (Cuerpo Principal)
                    </span>
                    <p className="text-xs font-medium text-[#423D33]">
                      {corazonNotes.length > 0
                        ? corazonNotes.map((n) => n.name).join(", ")
                        : "Flores y especias equilibradas"}
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#E5E0DA] space-y-1">
                    <span className="text-[10px] font-bold text-[#423D33] uppercase block">
                      Fondo (Permanencia)
                    </span>
                    <p className="text-xs font-medium text-[#423D33]">
                      {fondoNotes.length > 0
                        ? fondoNotes.map((n) => n.name).join(", ")
                        : "Resinas de soja y maderas puras"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 5: PERSONALIZACIÓN DE ETIQUETA Y MENSAJE */}
            <div className={`space-y-4 ${activeStep !== 5 && "hidden sm:block"}`}>
              <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#8C7A6B] text-white text-xs font-bold flex items-center justify-center">
                    5
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#423D33]">
                    Personalización de Etiqueta & Dedicatoria
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#8C7A6B]">+2.00€</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#423D33] mb-1">
                    Título o Nombre de la Vela
                  </label>
                  <input
                    type="text"
                    maxLength={32}
                    value={labelTitle}
                    onChange={(e) => setLabelTitle(e.target.value)}
                    placeholder="Ej. Vela de Sofía, Calma & Paz..."
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
                  />
                  <span className="text-[10px] text-[#8C7A6B] mt-0.5 block">
                    Se imprimirá en tipografía serif de autor ({labelTitle.length}/32 caracteres)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#423D33] mb-1">
                    Dedicatoria o Subtítulo
                  </label>
                  <input
                    type="text"
                    maxLength={48}
                    value={labelSubtitle}
                    onChange={(e) => setLabelSubtitle(e.target.value)}
                    placeholder="Ej. Para iluminar tus momentos de paz..."
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E5E0DA] bg-white text-[#423D33] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
                  />
                  <span className="text-[10px] text-[#8C7A6B] mt-0.5 block">
                    Ideal para regalos memorables ({labelSubtitle.length}/48 caracteres)
                  </span>
                </div>
              </div>

              {/* Label Texture Style Selector */}
              <div>
                <label className="block text-xs font-bold text-[#423D33] mb-2">
                  Estilo de Etiqueta & Papel
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LABEL_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setLabelStyle(style)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        labelStyle.id === style.id
                          ? "border-[#8C7A6B] ring-2 ring-[#8C7A6B]/30 bg-[#FAF7F2]"
                          : "border-[#E5E0DA] bg-white"
                      }`}
                    >
                      <span>{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift Wrap option */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5E0DA] cursor-pointer hover:bg-[#F2EDE7] transition-colors">
                  <input
                    type="checkbox"
                    checked={includeGiftWrap}
                    onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8C7A6B] focus:ring-[#8C7A6B]"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-xs text-[#423D33] block">
                      Envoltura de Regalo Botánica con Ramas Secas & Lazo de Lino (+3.00€)
                    </span>
                    <span className="text-[10px] text-[#8C7A6B]">
                      Caja rígida reciclable, papel kraft y tarjeta personalizada caligrafiada a mano.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Reset & Stepper Buttons */}
            <div className="pt-4 border-t border-[#E5E0DA] flex items-center justify-between">
              <button
                onClick={handleResetRecipe}
                className="text-xs text-[#8C7A6B] hover:text-[#423D33] flex items-center gap-1.5 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer receta por defecto</span>
              </button>

              <div className="flex items-center gap-2">
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                    className="px-3.5 py-1.5 rounded-full border border-[#E5E0DA] text-xs font-semibold text-[#423D33] hover:bg-[#F2EDE7] cursor-pointer"
                  >
                    Anterior
                  </button>
                )}
                {activeStep < 5 && (
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                    className="px-4 py-1.5 rounded-full bg-[#4A4541] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#35312E] cursor-pointer"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic Layered Preview & Simulation (Col 5) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E5E0DA] shadow-lg relative overflow-hidden space-y-5">
              {/* Preview Header & View Mode Switcher */}
              <div className="flex items-center justify-between border-b border-[#E5E0DA] pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B]">
                      Vista Previa en Vivo 2D
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-2xs"
                      style={{ backgroundColor: selectedWaxColor.hex }}
                      title={`Cera: ${selectedWaxColor.name}`}
                    />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#423D33]">
                    {selectedVessel.name}
                  </h4>
                </div>

                <div className="flex items-center gap-1 bg-[#F2EDE7] p-1 rounded-full border border-[#E5E0DA]">
                  <button
                    onClick={() => setViewMode("top")}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      viewMode === "top"
                        ? "bg-[#4A4541] text-white shadow-xs"
                        : "text-[#423D33]/70 hover:text-[#423D33]"
                    }`}
                  >
                    Cera & Botánicos
                  </button>
                  <button
                    onClick={() => setViewMode("front")}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      viewMode === "front"
                        ? "bg-[#4A4541] text-white shadow-xs"
                        : "text-[#423D33]/70 hover:text-[#423D33]"
                    }`}
                  >
                    Vasija & Etiqueta
                  </button>
                </div>
              </div>

              {/* DYNAMIC CANVAS / LAYERED STAGE */}
              <div className="relative aspect-square rounded-3xl bg-[#F5F0EB] border border-[#E5E0DA] overflow-hidden flex items-center justify-center p-4 shadow-inner">
                {/* VIEW 1: TOP-DOWN WAX SURFACE WITH DYNAMIC BOTANICALS & WICK */}
                {viewMode === "top" ? (
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500">
                    {/* Outer Ceramic Vessel Rim */}
                    <div
                      className="absolute inset-0 rounded-full border-8 shadow-inner transition-colors duration-500"
                      style={{
                        backgroundColor: selectedVessel.color,
                        borderColor: selectedVessel.borderColor,
                      }}
                    />

                    {/* Inner Soy Wax Surface Layer (Updates in real time to selectedWaxColor.hex) */}
                    <div
                      className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-full border border-black/5 flex items-center justify-center overflow-hidden transition-colors duration-500 shadow-inner"
                      style={{ backgroundColor: selectedWaxColor.hex }}
                    >
                      {/* Subtle Wax Melt Texture & Shadow Ring */}
                      <div className="absolute inset-0 rounded-full bg-radial from-transparent to-black/10 pointer-events-none" />

                      {/* Warm Ambient Glow when Lit */}
                      {isLit && (
                        <div className="absolute inset-0 rounded-full bg-radial from-[#FAD02C]/40 via-[#F39C12]/20 to-transparent animate-pulse pointer-events-none" />
                      )}

                      {/* DYNAMIC BOTANICALS RENDERED ORGANICALLY AROUND THE WICK */}
                      <div className="absolute inset-0 pointer-events-none">
                        {selectedBotanicals.map((bot, idx) => {
                          // Coordinates array for balanced botanical distribution
                          const positions = [
                            { top: "20%", left: "28%", rot: "-25deg", scale: 1 },
                            { top: "22%", right: "24%", rot: "45deg", scale: 1.1 },
                            { bottom: "24%", left: "22%", rot: "110deg", scale: 0.95 },
                            { bottom: "20%", right: "26%", rot: "-65deg", scale: 1.05 },
                            { top: "54%", left: "14%", rot: "15deg", scale: 0.9 },
                          ];
                          const pos = positions[idx % positions.length];

                          return (
                            <div
                              key={bot.id}
                              style={{
                                position: "absolute",
                                ...pos,
                                transform: `rotate(${pos.rot}) scale(${pos.scale})`,
                              }}
                              className="transition-all duration-700 animate-fade-in filter drop-shadow-md"
                            >
                              {/* RENDER DYNAMIC BOTANICAL SVG GRAPHIC */}
                              {bot.visualType === "lavanda" && (
                                <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
                                  <path d="M50 90 Q48 50 50 10" stroke="#4A6B35" strokeWidth="3" />
                                  <ellipse cx="50" cy="18" rx="8" ry="12" fill="#8E7CC3" opacity="0.9" />
                                  <ellipse cx="44" cy="30" rx="7" ry="10" fill="#7C69AC" opacity="0.9" />
                                  <ellipse cx="56" cy="34" rx="7" ry="10" fill="#9B89D4" opacity="0.9" />
                                  <ellipse cx="46" cy="46" rx="6" ry="9" fill="#8E7CC3" opacity="0.85" />
                                  <ellipse cx="54" cy="50" rx="6" ry="9" fill="#7C69AC" opacity="0.85" />
                                  <path d="M48 65 Q35 60 30 55" stroke="#4A6B35" strokeWidth="2" />
                                  <path d="M52 58 Q65 52 70 48" stroke="#4A6B35" strokeWidth="2" />
                                </svg>
                              )}

                              {bot.visualType === "naranja" && (
                                <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                                  <circle cx="50" cy="50" r="45" fill="#E69138" stroke="#D35400" strokeWidth="3" />
                                  <circle cx="50" cy="50" r="38" fill="#F39C12" />
                                  <circle cx="50" cy="50" r="8" fill="#E67E22" />
                                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                    <line
                                      key={i}
                                      x1="50"
                                      y1="50"
                                      x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
                                      y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
                                      stroke="#FDEBD0"
                                      strokeWidth="2"
                                      opacity="0.8"
                                    />
                                  ))}
                                </svg>
                              )}

                              {bot.visualType === "canela" && (
                                <svg width="46" height="46" viewBox="0 0 100 100" fill="none">
                                  <rect x="25" y="10" width="18" height="80" rx="6" fill="#8D4925" stroke="#5C2D13" strokeWidth="2" />
                                  <line x1="28" y1="15" x2="28" y2="85" stroke="#A0522D" strokeWidth="2" />
                                  <rect x="40" y="16" width="16" height="74" rx="5" fill="#A0522D" stroke="#5C2D13" strokeWidth="2" />
                                  <line x1="44" y1="20" x2="44" y2="85" stroke="#CD853F" strokeWidth="1.5" />
                                </svg>
                              )}

                              {bot.visualType === "eucalipto" && (
                                <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
                                  <path d="M20 80 Q50 50 80 20" stroke="#5A7D52" strokeWidth="2" />
                                  <ellipse cx="40" cy="55" rx="14" ry="10" fill="#789A6F" transform="rotate(-30 40 55)" />
                                  <ellipse cx="60" cy="35" rx="13" ry="9" fill="#8BAF82" transform="rotate(25 60 35)" />
                                  <ellipse cx="75" cy="22" rx="10" ry="7" fill="#9FC196" />
                                </svg>
                              )}

                              {bot.visualType === "vainilla" && (
                                <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
                                  <path d="M15 85 Q50 60 85 20" stroke="#3D2314" strokeWidth="5" strokeLinecap="round" />
                                  <path d="M25 88 Q60 55 90 28" stroke="#2B180D" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                              )}

                              {bot.visualType === "jazmin" && (
                                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                                  <circle cx="50" cy="50" r="6" fill="#F4D03F" />
                                  <ellipse cx="50" cy="30" rx="8" ry="15" fill="#FAF6EE" stroke="#E5E0DA" />
                                  <ellipse cx="50" cy="70" rx="8" ry="15" fill="#FAF6EE" stroke="#E5E0DA" />
                                  <ellipse cx="30" cy="50" rx="15" ry="8" fill="#FAF6EE" stroke="#E5E0DA" />
                                  <ellipse cx="70" cy="50" rx="15" ry="8" fill="#FAF6EE" stroke="#E5E0DA" />
                                </svg>
                              )}

                              {bot.visualType === "rosa" && (
                                <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
                                  <circle cx="50" cy="50" r="18" fill="#A93226" opacity="0.9" />
                                  <circle cx="50" cy="50" r="12" fill="#C0392B" />
                                  <circle cx="50" cy="50" r="6" fill="#CD6155" />
                                </svg>
                              )}

                              {bot.visualType === "anis" && (
                                <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
                                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                                    <ellipse
                                      key={i}
                                      cx="50"
                                      cy="30"
                                      rx="6"
                                      ry="16"
                                      fill="#6E472B"
                                      stroke="#4D2E17"
                                      strokeWidth="1.5"
                                      transform={`rotate(${ang} 50 50)`}
                                    />
                                  ))}
                                  <circle cx="50" cy="50" r="10" fill="#4D2E17" />
                                </svg>
                              )}

                              {bot.visualType === "cedro" && (
                                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                                  <path d="M20 30 L45 15 L70 35 L50 50 Z" fill="#8D6E63" stroke="#5D4037" />
                                  <path d="M35 55 L75 40 L85 70 L40 85 Z" fill="#A1887F" stroke="#5D4037" />
                                </svg>
                              )}

                              {bot.visualType === "romero" && (
                                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                                  <line x1="20" y1="80" x2="80" y2="20" stroke="#33691E" strokeWidth="2.5" />
                                  <line x1="40" y1="60" x2="25" y2="45" stroke="#558B2F" strokeWidth="2" />
                                  <line x1="50" y1="50" x2="65" y2="35" stroke="#558B2F" strokeWidth="2" />
                                  <line x1="65" y1="35" x2="50" y2="20" stroke="#689F38" strokeWidth="2" />
                                </svg>
                              )}

                              {bot.visualType === "cafe" && (
                                <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                                  <ellipse cx="50" cy="50" rx="26" ry="18" fill="#3E2723" stroke="#1B0000" strokeWidth="2" />
                                  <path d="M50 32 Q42 50 50 68" stroke="#1B0000" strokeWidth="3" />
                                </svg>
                              )}

                              {bot.visualType === "clavo" && (
                                <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                                  <circle cx="50" cy="35" r="14" fill="#4E342E" stroke="#3E2723" />
                                  <rect x="44" y="45" width="12" height="40" rx="4" fill="#3E2723" />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* CENTER WICK (WOODEN OR COTTON) */}
                      <div className="relative z-20 flex flex-col items-center justify-center">
                        {selectedWick.id === "madera" ? (
                          <div
                            className="w-4 h-9 sm:w-5 sm:h-11 rounded-sm shadow-md flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: "#5C3A21",
                              backgroundImage:
                                "linear-gradient(to right, #4A2E1A, #7A4E2C, #4A2E1A)",
                              border: "1px solid #3B2211",
                            }}
                          >
                            <span className="w-0.5 h-full bg-black/30" />
                          </div>
                        ) : (
                          <div className="w-2.5 h-6 rounded-full bg-[#333333] border border-black/40 flex flex-col items-center">
                            <span className="w-1.5 h-2 bg-[#111111] rounded-full" />
                          </div>
                        )}

                        {/* DYNAMIC FLAME COMPONENT WHEN LIT */}
                        {isLit && (
                          <div className="absolute -top-7 z-30 flex flex-col items-center pointer-events-none">
                            <div className="relative w-8 h-12">
                              <div className="absolute inset-0 bg-radial from-[#FFF3A8] via-[#FFAE19] to-[#E65100] rounded-full blur-[1px] animate-flicker transform origin-bottom" />
                              <div className="absolute bottom-1 left-2.5 right-2.5 h-5 bg-radial from-white via-[#81D4FA] to-transparent rounded-full" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* VIEW 2: FRONT CONTAINER VIEW WITH REAL-TIME LABEL RENDERING */
                  <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex flex-col items-center justify-end transition-all duration-500">
                    {/* Vessel Body */}
                    <div
                      className="relative w-56 h-60 rounded-t-xl rounded-b-3xl shadow-xl flex flex-col items-center justify-center p-4 transition-colors duration-500"
                      style={{
                        backgroundColor: selectedVessel.color,
                        borderColor: selectedVessel.borderColor,
                        borderWidth: "3px",
                      }}
                    >
                      {/* Top Ceramic Lip / Rim */}
                      <div
                        className="absolute -top-3 left-0 right-0 h-6 rounded-t-full border-t-2 border-b-2 shadow-inner"
                        style={{
                          backgroundColor: selectedVessel.rimColor,
                          borderColor: selectedVessel.borderColor,
                        }}
                      />

                      {/* Top Wick & Flame peering over lip */}
                      <div className="absolute -top-8 z-20 flex flex-col items-center">
                        {isLit && (
                          <div className="w-7 h-10 bg-radial from-[#FFF3A8] via-[#FFAE19] to-[#E65100] rounded-full blur-[0.5px] animate-flicker" />
                        )}
                        <div
                          className={`w-3 h-4 rounded-xs ${
                            selectedWick.id === "madera" ? "bg-[#5C3A21]" : "bg-[#333]"
                          }`}
                        />
                      </div>

                      {/* REAL-TIME BESPOKE LABEL OVER VESSEL */}
                      <div
                        className={`w-44 p-3 rounded-xl border text-center shadow-md space-y-1.5 transition-all ${labelStyle.bgClass} ${labelStyle.borderClass}`}
                      >
                        <div className="border-b border-current/20 pb-1">
                          <span className="text-[8px] uppercase tracking-[0.2em] font-bold block opacity-75">
                            AYLLU • 100% Cera de Soja
                          </span>
                        </div>

                        <div className="py-1">
                          <h5 className="font-serif font-bold text-xs sm:text-sm leading-tight">
                            {labelTitle.trim() || "Vela Personalizada"}
                          </h5>
                          <p className="text-[9px] italic mt-0.5 opacity-85 leading-tight">
                            {labelSubtitle.trim() || "Edición Exclusiva"}
                          </p>
                        </div>

                        <div className="pt-1 border-t border-current/20 flex items-center justify-between text-[8px] opacity-75 font-semibold">
                          <span>{selectedWick.name.split(" ")[0]}</span>
                          <span>320g • {selectedWaxColor.name.split(" ")[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SIMULATION ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Flame Toggle Button */}
                <button
                  onClick={toggleFlame}
                  className={`py-2.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    isLit
                      ? "bg-[#D98B68] text-white ring-2 ring-[#D98B68]/40"
                      : "bg-[#4A4541] text-white hover:bg-[#35312E]"
                  }`}
                >
                  <Flame className={`w-4 h-4 ${isLit ? "animate-bounce text-yellow-200" : ""}`} />
                  <span>{isLit ? "Apagar Vela" : "Encender Vela"}</span>
                </button>

                {/* Wood Sound Crackle Toggle */}
                {selectedWick.id === "madera" ? (
                  <button
                    onClick={toggleSound}
                    className={`py-2.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      isPlayingAudio
                        ? "bg-[#FAF7F2] text-[#D98B68] border-[#D98B68] ring-2 ring-[#D98B68]/20"
                        : "bg-white text-[#423D33] border-[#E5E0DA] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {isPlayingAudio ? (
                      <Volume2 className="w-4 h-4 text-[#D98B68] animate-pulse" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-[#8C7A6B]" />
                    )}
                    <span>{isPlayingAudio ? "Silenciar" : "Crepitar Madera"}</span>
                  </button>
                ) : (
                  <div className="py-2.5 px-3 rounded-2xl bg-[#F2EDE7] text-[#8C7A6B] text-[11px] font-semibold text-center flex items-center justify-center">
                    <span>Mecha silenciosa</span>
                  </div>
                )}
              </div>

              {/* LIVE RECIPE SUMMARY & PRICING BAR */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5E0DA] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#423D33]">Total Configuración:</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#423D33]">
                      {totalPrice.toFixed(2)}€
                    </span>
                    <span className="block text-[9px] text-[#608058] font-semibold">
                      IVA incluido • Envío gratis desde 50€
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#423D33]/80 space-y-1 border-t border-[#E5E0DA] pt-2">
                  <p className="flex justify-between">
                    <span>Vasija: {selectedVessel.name}</span>
                    <span>{basePrice}€</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                        style={{ backgroundColor: selectedWaxColor.hex }}
                      />
                      <span>Cera: {selectedWaxColor.name}</span>
                    </span>
                    <span className="text-[#608058] font-medium">Incluido</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Mecha: {selectedWick.name}</span>
                    <span>+{wickPrice}€</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Botánicos ({selectedBotanicals.length}): {selectedBotanicals.map((b) => b.name).join(", ")}</span>
                    <span>+{botanicalsAddon.toFixed(2)}€</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Personalización de Etiqueta: "{labelTitle}"</span>
                    <span>+{labelPrice.toFixed(2)}€</span>
                  </p>
                  {includeGiftWrap && (
                    <p className="flex justify-between text-[#D98B68] font-semibold">
                      <span>Envoltura Botánica de Regalo</span>
                      <span>+3.00€</span>
                    </p>
                  )}
                </div>

                {/* FINAL ACTION: ENCARGAR VELA PERSONALIZADA */}
                <button
                  id="order-custom-candle-btn"
                  onClick={handleAddToCart}
                  className="w-full py-3 px-6 rounded-full bg-[#4A4541] hover:bg-[#35312E] text-white text-xs uppercase font-bold tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D9C5B2]" />
                  <span>Encargar Vela Personalizada</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
