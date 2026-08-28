import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Eye,
  EyeOff,
  Leaf,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Info,
  Clock,
  Heart
} from "lucide-react";
import { CandleProduct } from "../types";

interface HeroSectionProps {
  featuredCandles?: CandleProduct[];
  featuredCandle?: CandleProduct;
  onExploreCollection: () => void;
  onOpenCustomizer: () => void;
  onSelectCandle: (candle: CandleProduct) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredCandles = [],
  featuredCandle,
  onExploreCollection,
  onOpenCustomizer,
  onSelectCandle,
}) => {
  // Normalize candidate list of featured candles
  const candleList: CandleProduct[] =
    featuredCandles.length > 0
      ? featuredCandles
      : featuredCandle
      ? [featuredCandle]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasMultiple = candleList.length > 1;
  const currentCandle = candleList[currentIndex] || featuredCandle || {
    id: "default-candle",
    name: "Esencia de Otoño Nº 01",
    subtitle: "Lavanda Silvestre & Cítricos Cálidos",
    description: "Vela botánica elaborada a mano con cera de soja pura y mecha de madera.",
    price: 28,
    inStock: true,
    burnHours: 65,
    weightGrams: 280,
    category: "Relajación",
    botanicals: ["Lavanda", "Naranja", "Canela"],
    olfactoryPyramid: { salida: "Naranja & Bergamota", corazon: "Lavanda & Canela", fondo: "Cedro & Vainilla" },
    vesselColor: "#8C7A6B",
    vesselName: "Cerámica Terracota Mate",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    tagline: "Esencia de Otoño",
    artisanNote: "Vela botánica artesanal",
    ingredients: ["Cera de Soja", "Aceites Esenciales", "Madera FSC"],
    rating: 4.9,
    reviewsCount: 42,
    featured: true,
  };

  // Carousel Auto-play effect (6 seconds)
  useEffect(() => {
    if (!hasMultiple || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % candleList.length);
      setActiveHotspot(null);
    }, 6000);

    return () => clearInterval(interval);
  }, [hasMultiple, isPaused, candleList.length]);

  const handlePrev = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev === 0 ? candleList.length - 1 : prev - 1));
    setActiveHotspot(null);
  };

  const handleNext = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev + 1) % candleList.length);
    setActiveHotspot(null);
  };

  // Dynamic Hotspot definitions for current candle
  const hotspots = [
    {
      id: 0,
      title: "Mecha de Madera FSC",
      detail: "Madera de cerezo natural que produce un crepitar suave y relajante como chimenea en miniatura.",
      coords: "top-[40%] left-[49%]",
    },
    {
      id: 1,
      title: currentCandle.vesselName || "Vasija Cerámica Mate",
      detail: "Arcilla mineral torneada a mano con textura sedosa en tonos neutros cálidos, 100% reutilizable.",
      coords: "top-[68%] left-[44%]",
    },
    {
      id: 2,
      title: currentCandle.botanicals && currentCandle.botanicals.length > 0
        ? currentCandle.botanicals.slice(0, 2).join(" & ")
        : "Botánicos Deshidratados",
      detail: "Botánicos enteros recolectados a mano y deshidratados al sol para una infusión aromática pura.",
      coords: "top-[76%] left-[68%]",
    },
    {
      id: 3,
      title: "100% Cera de Soja Pura",
      detail: `Cera vegetal biodegradable sin toxinas, con combustión lenta de ${currentCandle.burnHours || 65} horas de duración.`,
      coords: "top-[54%] left-[32%]",
    },
  ];

  // Currently shown hotspot detail (either hovered or active clicked)
  const currentHotspotIndex = hoveredHotspot !== null ? hoveredHotspot : activeHotspot;

  return (
    <section className="relative overflow-hidden bg-[#FDFBF9] py-8 lg:py-12 border-b border-[#E5E0DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Main Bento Grid Container */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* BENTO TILE 1: Master Photography Showcase & Hotspot Explorer */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="col-span-12 lg:col-span-7 bg-[#F2EDE7] rounded-3xl relative overflow-hidden border border-[#E5E0DA] flex flex-col justify-between p-5 sm:p-7 min-h-[520px] lg:min-h-[580px] shadow-xs transition-all"
          >
            {/* Background Dot Pattern */}
            <div className="absolute inset-0 bento-dot-pattern opacity-45 pointer-events-none" />

            {/* Top Bar inside Showcase */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-[#E5E0DA] text-[#423D33] text-[10px] uppercase font-bold tracking-widest shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#D98B68]" />
                <span>
                  {hasMultiple
                    ? `Destacado ${currentIndex + 1} de ${candleList.length} • Pieza de Autor`
                    : "Edición Limitada • Pieza de Autor"}
                </span>
              </div>

              {/* Toggle Buttons: Clean View and Optical Zoom */}
              <div className="flex items-center gap-1.5">
                <button
                  id="toggle-clean-image-btn"
                  onClick={() => {
                    setShowHotspots(!showHotspots);
                    setActiveHotspot(null);
                    setHoveredHotspot(null);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-xs border transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                    !showHotspots
                      ? "bg-[#4A4541] text-white border-[#4A4541]"
                      : "bg-white/85 hover:bg-white text-[#423D33] border-[#E5E0DA]"
                  }`}
                  title={showHotspots ? "Ocultar marcas para ver la foto limpia" : "Mostrar marcas de detalle"}
                >
                  {!showHotspots ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[#D9C5B2]" />
                      <span>Imagen Limpia</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#8C7A6B]" />
                      <span>Ver Imagen Limpia</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="bg-white/85 hover:bg-white text-[#423D33] px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-xs border border-[#E5E0DA] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Ampliar detalle de textura"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span className="hidden sm:inline">{isZoomed ? "Vista General" : "Zoom 85mm"}</span>
                </button>
              </div>
            </div>

            {/* Photography Center Stage with Interactive Hotspots */}
            <div className="relative z-10 my-4 flex-1 flex flex-col items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full max-w-xl bg-[#EAE4DD] border border-[#D9C5B2] shadow-md group">
                <img
                  key={currentCandle.id}
                  src={currentCandle.image}
                  alt={`Vela artesanal ${currentCandle.name} elaborada con cera vegetal`}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isZoomed ? "scale-130 cursor-zoom-out" : "hover:scale-105 cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Hotspot buttons (Rendered only if showHotspots is true) */}
                {showHotspots &&
                  hotspots.map((spot) => {
                    const isSpotActive = currentHotspotIndex === spot.id;
                    return (
                      <button
                        key={spot.id}
                        onMouseEnter={() => setHoveredHotspot(spot.id)}
                        onMouseLeave={() => setHoveredHotspot(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                        }}
                        className={`absolute ${spot.coords} -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          isSpotActive
                            ? "bg-[#8C7A6B] text-white ring-4 ring-white/80 scale-115 shadow-lg opacity-100 z-30"
                            : "bg-white/80 text-[#423D33] ring-2 ring-black/10 backdrop-blur-xs opacity-30 hover:opacity-100 hover:scale-110 z-20"
                        }`}
                        title={spot.title}
                        aria-label={`Detalle: ${spot.title}`}
                      >
                        <span className="text-[11px] font-bold">{spot.id + 1}</span>
                      </button>
                    );
                  })}

                {/* Active Hotspot Caption Card (Shown on hover or click only) */}
                {showHotspots && currentHotspotIndex !== null && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md text-white p-3 rounded-xl border border-white/20 shadow-lg animate-fade-in z-30 pointer-events-auto">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#D9C5B2] flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-[#8C7A6B] text-white text-[9px] inline-flex items-center justify-center">
                          {currentHotspotIndex + 1}
                        </span>
                        <span>{hotspots[currentHotspotIndex].title}</span>
                      </p>
                      <button
                        onClick={() => {
                          setActiveHotspot(null);
                          setHoveredHotspot(null);
                        }}
                        className="text-stone-400 hover:text-white text-xs px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-stone-200 mt-1 leading-snug">
                      {hotspots[currentHotspotIndex].detail}
                    </p>
                  </div>
                )}

                {/* Carousel Navigation Arrow Controls (if 2+ products) */}
                {hasMultiple && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#423D33] flex items-center justify-center backdrop-blur-xs border border-[#E5E0DA] shadow-md transition-all cursor-pointer z-20 hover:scale-110"
                      title="Vela anterior"
                      aria-label="Vela anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#423D33] flex items-center justify-center backdrop-blur-xs border border-[#E5E0DA] shadow-md transition-all cursor-pointer z-20 hover:scale-110"
                      title="Siguiente vela"
                      aria-label="Siguiente vela"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Hotspot pills selector (when showHotspots is enabled) */}
              {showHotspots ? (
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      onMouseEnter={() => setHoveredHotspot(spot.id)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                      onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer border ${
                        currentHotspotIndex === spot.id
                          ? "bg-[#4A4541] text-white border-[#4A4541] font-bold shadow-xs"
                          : "bg-white/70 text-[#423D33]/80 border-[#E5E0DA] hover:bg-white hover:text-black"
                      }`}
                    >
                      {spot.id + 1}. {spot.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-center">
                  <span className="text-[11px] text-[#8C7A6B] italic">
                    Modo imagen limpia activo • Pasa el cursor sobre la foto o activa marcas para inspeccionar detalles
                  </span>
                </div>
              )}

              {/* Carousel Pagination Dots (if 2+ products) */}
              {hasMultiple && (
                <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-[#E5E0DA]/50">
                  {candleList.map((candle, idx) => (
                    <button
                      key={candle.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setActiveHotspot(null);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? "w-6 bg-[#8C7A6B]"
                          : "w-2 bg-[#D9C5B2] hover:bg-[#8C7A6B]/60"
                      }`}
                      title={candle.name}
                      aria-label={`Ver ${candle.name}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Info Bar inside Showcase */}
            <div className="relative z-10 pt-2 border-t border-[#E5E0DA]/80 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-[#423D33] font-normal leading-tight">
                  {currentCandle.name}
                </h1>
                <p className="text-xs text-[#423D33]/70 max-w-sm mt-0.5">
                  {currentCandle.subtitle || "Cerámica mate, cera de soja pura y mecha de madera natural."}
                </p>
              </div>

              <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-2xl sm:text-3xl font-serif font-light text-[#423D33]">
                  {currentCandle.price},00 €
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#8C7A6B] font-bold">
                  {currentCandle.inStock ? "Disponible en Ayllu" : "Edición Agotada"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT BENTO COLUMN: Multi-Card Grid */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-12 gap-4 lg:gap-6">
            {/* BENTO TILE 2: Olfactory Profile Master Card */}
            <div className="col-span-12 bg-[#8C7A6B] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full font-semibold">
                  {currentCandle.category || "Eco-Lujo Botánico"}
                </span>
                <span className="text-xs text-white/80 tracking-wider">
                  Prensado a mano
                </span>
              </div>

              <div className="space-y-2 my-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-normal">
                  Perfil Aromático
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic line-clamp-3">
                  "{currentCandle.description}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20 text-xs mt-2">
                <div>
                  <span className="block text-[9px] text-white/70 uppercase tracking-wider font-semibold">Salida</span>
                  <span className="font-medium text-white text-[11px] block truncate">
                    {currentCandle.olfactoryPyramid?.salida || "Cítricos Puros"}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-white/70 uppercase tracking-wider font-semibold">Corazón</span>
                  <span className="font-medium text-white text-[11px] block truncate">
                    {currentCandle.olfactoryPyramid?.corazon || "Flores Silvestres"}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-white/70 uppercase tracking-wider font-semibold">Fondo</span>
                  <span className="font-medium text-white text-[11px] block truncate">
                    {currentCandle.olfactoryPyramid?.fondo || "Maderas Nobles"}
                  </span>
                </div>
              </div>
            </div>

            {/* BENTO TILE 3: Eco Credentials (Col 5) */}
            <div className="col-span-5 bg-white border border-[#E5E0DA] rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-2 shadow-2xs">
              <div className="w-10 h-10 border border-[#D9C5B2] rounded-full flex items-center justify-center bg-[#FDFBF9] text-[#8C7A6B]">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#423D33]">
                100% Vegano
              </span>
              <span className="text-[9px] text-[#423D33]/60">
                Cera de Soja Pura
              </span>
            </div>

            {/* BENTO TILE 4: Clean Burn Hours (Col 7) */}
            <div className="col-span-7 bg-[#EAE4DD] border border-[#E5E0DA] rounded-3xl p-5 sm:p-6 flex flex-col justify-center shadow-2xs">
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-3xl sm:text-4xl font-serif text-[#423D33]">
                  {currentCandle.burnHours || 65}
                </span>
                <span className="text-xs text-[#423D33]/70 uppercase tracking-widest font-semibold">Horas</span>
              </div>
              <p className="text-[11px] text-[#423D33]/75 leading-tight">
                De quemado limpio y aroma envolvente sin toxinas.
              </p>
              <div className="mt-3 h-1.5 bg-[#D9C5B2] w-full rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-[#8C7A6B] rounded-full"></div>
              </div>
            </div>

            {/* BENTO TILE 5: Ceramic Vessel & Quick Actions (Col 12) */}
            <div className="col-span-12 bg-white border border-[#E5E0DA] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 max-w-xs">
                <p className="text-xs sm:text-sm font-semibold text-[#423D33]">
                  {currentCandle.vesselName || "Vasija de Cerámica Recargable"}
                </p>
                <p className="text-[11px] text-[#423D33]/65 leading-snug">
                  Diseño minimalista pensado para una segunda vida como macetero o taza de té.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="hero-view-product-btn"
                  onClick={() => onSelectCandle(currentCandle)}
                  className="bg-[#4A4541] hover:bg-[#35312E] text-white px-5 py-2.5 rounded-full text-[11px] uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Descubrir</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D98B68]" />
                </button>

                <button
                  id="hero-personalizar-btn"
                  onClick={onOpenCustomizer}
                  className="bg-[#F2EDE7] hover:bg-[#EAE4DD] text-[#423D33] px-4 py-2.5 rounded-full text-[11px] uppercase tracking-widest font-semibold border border-[#E5E0DA] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D98B68]" />
                  <span>Personalizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
