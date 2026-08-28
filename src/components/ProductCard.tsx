import React from "react";
import { Flame, Clock, Star, Plus, Eye, Sparkles } from "lucide-react";
import { CandleProduct } from "../types";

interface ProductCardProps {
  candle: CandleProduct;
  onSelect: (candle: CandleProduct) => void;
  onAddToCart: (candle: CandleProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  candle,
  onSelect,
  onAddToCart,
}) => {
  return (
    <div
      id={`product-card-${candle.id}`}
      className="group flex flex-col bg-white rounded-3xl border border-[#E5E0DA] overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-[#EAE4DD] overflow-hidden cursor-pointer" onClick={() => onSelect(candle)}>
        <img
          src={candle.image}
          alt={candle.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Category Pill */}
        <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold text-[#423D33] uppercase tracking-widest border border-[#E5E0DA] shadow-2xs">
          {candle.category}
        </div>

        {/* Burn Time Badge */}
        <div className="absolute top-3.5 right-3.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white flex items-center gap-1 shadow-2xs">
          <Clock className="w-3 h-3 text-[#D9C5B2]" />
          <span>{candle.burnHours}h</span>
        </div>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(candle);
            }}
            className="px-4 py-2 rounded-full bg-white text-[#423D33] text-xs font-semibold shadow-md hover:bg-[#F2EDE7] flex items-center gap-1.5 cursor-pointer transform translate-y-2 group-hover:translate-y-0 transition-all uppercase tracking-wider text-[10px]"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C7A6B]" />
            <span>Ver Notas</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Rating and Vessel */}
          <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#8C7A6B] text-[#8C7A6B]" />
              <span className="font-semibold text-[#423D33]">{candle.rating}</span>
              <span className="text-[11px] text-[#423D33]/60">({candle.reviewsCount})</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#F2EDE7] px-2 py-0.5 rounded-full text-[#423D33]/80 border border-[#E5E0DA]">
              {candle.vesselName}
            </span>
          </div>

          {/* Titles */}
          <h3
            onClick={() => onSelect(candle)}
            className="font-serif text-xl font-normal text-[#423D33] group-hover:text-[#8C7A6B] transition-colors cursor-pointer leading-tight"
          >
            {candle.name}
          </h3>
          <p className="text-xs text-[#423D33]/70 line-clamp-2 leading-relaxed">
            {candle.subtitle}
          </p>

          {/* Botanical tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {candle.botanicals.map((botanical, idx) => (
              <span
                key={idx}
                className="text-[9px] uppercase tracking-wider bg-[#FDFBF9] text-[#423D33]/80 px-2 py-0.5 rounded-full border border-[#E5E0DA]"
              >
                {botanical}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="pt-3 border-t border-[#E5E0DA] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block font-semibold">Edición</span>
            <span className="text-lg font-serif font-light text-[#423D33]">
              {candle.price},00 €
            </span>
          </div>

          <button
            id={`add-to-cart-btn-${candle.id}`}
            onClick={() => onAddToCart(candle)}
            className="px-4 py-2 rounded-full bg-[#4A4541] hover:bg-[#35312E] text-white text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
            aria-label={`Añadir ${candle.name} a la cesta`}
          >
            <Plus className="w-3.5 h-3.5 text-[#D9C5B2]" />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

