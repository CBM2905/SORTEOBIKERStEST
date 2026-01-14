"use client";

import { Award } from "@/app/types";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

interface AwardCardProps {
  award: Award;
  onSelect?: () => void;
}

export default function AwardCard({ award, onSelect }: AwardCardProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(award);
    router.push("/cart");
  };

  return (
    <div className="relative bg-gradient-to-br from-[#0d0d0d] via-[#0a0a0a] to-[#050505] border-2 border-[#1f1f1f] hover:border-[#d4af37]/30 rounded-3xl shadow-2xl hover:shadow-[#d4af37]/30 transition-all duration-500 overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/20 to-[#d4af37]/0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        {/* Badges Row */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="glass px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            <span className="text-xs font-bold text-[#d4af37] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              Disponible
            </span>
          </div>
          <div className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-xs font-bold text-[#050505] flex items-center gap-1">
              🔥 Más Vendido
            </span>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-[#0b0b0b] to-[#050505]">
          <img
            src={award.image}
            alt={award.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70" />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title & Description */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-2xl text-white group-hover:text-[#d4af37] transition-colors leading-tight">
              {award.title}
            </h3>
            <p className="text-[#bdb7a0] text-sm leading-relaxed line-clamp-2">
              {award.description}
            </p>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-[#1f1f1f]">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-[#8f876b]">Entrega inmediata</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-[#8f876b]">Sorteo verificado</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-[#8f876b] uppercase tracking-wider mb-1">Precio por ticket</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#d4af37]">
                    ${award.price?.toLocaleString('es-CO')}
                  </span>
                  <span className="text-sm text-[#bdb7a0] font-semibold">COP</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#8f876b]">Quedan pocas</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <p className="text-xs font-bold text-[#d4af37]">Sólo hoy</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAddToCart}
              className="group/btn relative w-full py-4 rounded-2xl font-bold text-base text-[#050505] bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b8860b] shadow-xl shadow-[#d4af37]/40 hover:shadow-2xl hover:shadow-[#d4af37]/60 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Comprar Ahora</span>
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            </button>
            
            {/* Trust Signal */}
            <p className="text-center text-xs text-[#8f876b] flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Compra 100% segura con protección al comprador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
