import { Award } from "@/app/types";
import AwardCard from "@/app/components/AwardCard";

interface AwardsSectionProps {
  awards: Award[];
  onAwardSelect?: (award: Award) => void;
  onAwardBuy?: (award: Award) => void;
}

export default function AwardsSection({ 
  awards, 
  onAwardSelect,
  onAwardBuy,
}: AwardsSectionProps) {
  const award = awards && awards.length > 0 ? awards[0] : null;

  if (!award) return null;

  return (
    <section className="relative py-16 sm:py-20 px-4 bg-[#050505]">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#d4af37]/20 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header - Clear and scannable */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Participa en el Sorteo
          </h2>
          <p className="text-lg text-[#bdb7a0] max-w-2xl mx-auto">
            Compra tu ticket ahora y forma parte de nuestra comunidad ganadora
          </p>
        </div>

        {/* Product Card */}
        <div className="max-w-xl mx-auto mb-12">
          <AwardCard
            award={award}
            onSelect={() => onAwardSelect?.(award)}
          />
          {onAwardBuy && (
            <div className="mt-6 text-center">
              <button
                onClick={() => onAwardBuy(award)}
                className="px-6 py-3 bg-[#d4af37] text-black rounded-lg font-medium hover:opacity-90 transition"
              >
                Comprar Ticket
              </button>
            </div>
          )}
        </div>

        {/* Trust Indicators - Clear benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-6 text-center hover:border-[#d4af37]/30 transition-colors">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#d4af37]/10 mb-4">
              <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-2">100% Seguro</h3>
            <p className="text-sm text-[#8f876b]">Pago encriptado y verificado</p>
          </div>
          
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-6 text-center hover:border-[#d4af37]/30 transition-colors">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#d4af37]/10 mb-4">
              <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-2">Entrega Instantánea</h3>
            <p className="text-sm text-[#8f876b]">Recibe tu ticket al momento</p>
          </div>
          
          <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-6 text-center hover:border-[#d4af37]/30 transition-colors">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#d4af37]/10 mb-4">
              <svg className="w-6 h-6 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-white mb-2">Sorteo Verificado</h3>
            <p className="text-sm text-[#8f876b]">Transparente y auditado</p>
          </div>
        </div>
      </div>
    </section>
  );
}
