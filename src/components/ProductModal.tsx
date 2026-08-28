import React, { useState } from "react";
import { X, Flame, Clock, Star, ShieldCheck, Heart, Sparkles, Check, Gift, PenLine, Palette, MapPin } from "lucide-react";
import { CandleProduct } from "../types";
import { useStore } from "../context/StoreContext";

interface ProductModalProps {
  candle: CandleProduct | null;
  onClose: () => void;
  onAddToCart: (candle: CandleProduct, quantity: number, customEngraving?: string, giftWrap?: boolean) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  candle,
  onClose,
  onAddToCart,
}) => {
  const { collaborators } = useStore();
  if (!candle) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"olfato" | "ingredientes" | "ritual">("olfato");
  const [customEngraving, setCustomEngraving] = useState("");
  const [enableEngraving, setEnableEngraving] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const matchedArtist = collaborators.find(
    (c) => c.associatedCandleId === candle.id || c.associatedCandleName?.toLowerCase() === candle.name.toLowerCase()
  );

  const handleAdd = () => {
    onAddToCart(candle, quantity, enableEngraving ? customEngraving : undefined, giftWrap);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D2824]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        id="product-detail-modal"
        className="relative bg-[#FDFBF9] w-full max-w-4xl rounded-3xl border border-[#E5E0DA] shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#423D33] border border-[#E5E0DA] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Product Photography & Details */}
        <div className="md:w-1/2 bg-[#F2EDE7] relative flex flex-col justify-between overflow-hidden">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <img
              src={candle.image}
              alt={candle.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2824]/70 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest mb-1">
                {candle.vesselName}
              </span>
              <p className="text-xs text-white/90 font-light leading-relaxed">
                {candle.artisanNote}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration & Olfactory Breakdown */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Badges & Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C7A6B]">
                  {candle.category}
                </span>
                <span className="text-[#E5E0DA]">•</span>
                <div className="flex items-center gap-1 text-[11px] text-[#423D33]/70">
                  <Star className="w-3 h-3 fill-[#8C7A6B] text-[#8C7A6B]" />
                  <span className="font-bold text-[#423D33]">{candle.rating}</span>
                  <span>({candle.reviewsCount} reseñas)</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#423D33]">
                {candle.name}
              </h2>
              <p className="text-xs text-[#423D33]/70 mt-1 italic">
                {candle.subtitle}
              </p>
            </div>

            {/* Matched Collaborator Credit Badge */}
            {matchedArtist && (
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E5E0DA]">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white shadow-2xs shrink-0">
                  <img
                    src={matchedArtist.image}
                    alt={matchedArtist.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3 h-3 text-[#D98B68]" />
                    <span className="text-[10px] uppercase font-bold text-[#8C7A6B] tracking-wider">
                      Diseño en Colaboración
                    </span>
                  </div>
                  <p className="text-xs font-serif font-bold text-[#423D33] truncate">
                    {matchedArtist.name} • {matchedArtist.location}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Specs Bento Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F2EDE7] text-center border border-[#E5E0DA] text-xs">
              <div>
                <span className="block text-[9px] uppercase text-[#8C7A6B] font-bold tracking-wider">Contenido</span>
                <span className="font-medium text-[#423D33]">{candle.weightGrams} g</span>
              </div>
              <div className="border-x border-[#E5E0DA]">
                <span className="block text-[9px] uppercase text-[#8C7A6B] font-bold tracking-wider">Duración</span>
                <span className="font-medium text-[#423D33]">{candle.burnHours}+ h</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-[#8C7A6B] font-bold tracking-wider">Mecha</span>
                <span className="font-medium text-[#423D33]">Madera FSC</span>
              </div>
            </div>

            {/* Tabs for Olfactory / Ingredients / Ritual */}
            <div>
              <div className="flex border-b border-[#E5E0DA] text-xs">
                <button
                  onClick={() => setActiveTab("olfato")}
                  className={`pb-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                    activeTab === "olfato"
                      ? "text-[#423D33] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#8C7A6B]"
                      : "text-[#423D33]/50 hover:text-[#423D33]"
                  }`}
                >
                  Pirámide
                </button>
                <button
                  onClick={() => setActiveTab("ingredientes")}
                  className={`pb-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                    activeTab === "ingredientes"
                      ? "text-[#423D33] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#8C7A6B]"
                      : "text-[#423D33]/50 hover:text-[#423D33]"
                  }`}
                >
                  Botánicos
                </button>
                <button
                  onClick={() => setActiveTab("ritual")}
                  className={`pb-2 px-3 text-[11px] font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
                    activeTab === "ritual"
                      ? "text-[#423D33] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#8C7A6B]"
                      : "text-[#423D33]/50 hover:text-[#423D33]"
                  }`}
                >
                  Ritual
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-3 text-xs leading-relaxed text-[#423D33]/80">
                {activeTab === "olfato" && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0DA]">
                      <span className="font-bold text-[#8C7A6B] uppercase text-[9px] block tracking-wider">
                        Salida Lumínica
                      </span>
                      <p className="text-[#423D33] font-medium">{candle.olfactoryPyramid.salida}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0DA]">
                      <span className="font-bold text-[#8C7A6B] uppercase text-[9px] block tracking-wider">
                        Corazón Botánico
                      </span>
                      <p className="text-[#423D33] font-medium">{candle.olfactoryPyramid.corazon}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0DA]">
                      <span className="font-bold text-[#8C7A6B] uppercase text-[9px] block tracking-wider">
                        Fondo Amaderado & Cálido
                      </span>
                      <p className="text-[#423D33] font-medium">{candle.olfactoryPyramid.fondo}</p>
                    </div>
                  </div>
                )}

                {activeTab === "ingredientes" && (
                  <ul className="space-y-1.5 list-disc pl-4 text-[#423D33]/80 text-[11px]">
                    {candle.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                    <li className="text-[#608058] font-medium">
                      100% libre de parafina, ftalatos y fragancias sintéticas agresivas.
                    </li>
                  </ul>
                )}

                {activeTab === "ritual" && (
                  <div className="space-y-1.5 text-[#423D33]/80 text-[11px]">
                    <p>
                      <strong>Primera quemada:</strong> Deja encendida la vela entre 2 y 3 horas hasta que la piscina líquida llegue a los bordes de la cerámica.
                    </p>
                    <p>
                      <strong>Corte de mecha:</strong> Retira la ceniza superior dejándola a unos 3-4 mm antes de cada nuevo encendido.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-2 pt-2 border-t border-[#E5E0DA]">
              {/* Custom engraving toggle */}
              <div className="rounded-2xl border border-[#E5E0DA] p-3 bg-white space-y-2">
                <label className="flex items-center justify-between text-xs font-semibold text-[#423D33] cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5 text-[#8C7A6B]" />
                    <span className="text-[11px]">Grabado en Cerámica (+3,00 €)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={enableEngraving}
                    onChange={(e) => setEnableEngraving(e.target.checked)}
                    className="accent-[#8C7A6B] w-3.5 h-3.5 rounded cursor-pointer"
                  />
                </label>
                {enableEngraving && (
                  <input
                    type="text"
                    maxLength={32}
                    placeholder="Ej: Para María con amor • Hogar Cálido"
                    value={customEngraving}
                    onChange={(e) => setCustomEngraving(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E5E0DA] bg-[#FDFBF9] focus:outline-none focus:ring-1 focus:ring-[#8C7A6B]"
                  />
                )}
              </div>

              {/* Gift wrap option */}
              <label className="flex items-center justify-between text-xs font-semibold text-[#423D33] p-3 rounded-2xl border border-[#E5E0DA] bg-white cursor-pointer">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span className="text-[11px]">Envoltorio de Regalo con Lavanda & Cordel (+2,00 €)</span>
                </span>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="accent-[#8C7A6B] w-3.5 h-3.5 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-[#E5E0DA] flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-[#E5E0DA] rounded-full bg-white px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#423D33] hover:text-black cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center text-xs font-medium text-[#423D33]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#423D33] hover:text-black cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Total and Add Button */}
            <button
              id="confirm-add-to-cart-btn"
              onClick={handleAdd}
              disabled={isAdded}
              className={`flex-1 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                isAdded
                  ? "bg-[#608058] text-white"
                  : "bg-[#4A4541] hover:bg-[#35312E] text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Añadido a la Cesta!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D9C5B2]" />
                  <span>Añadir • {candle.price * quantity + (enableEngraving ? 3 : 0) + (giftWrap ? 2 : 0)},00 €</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

