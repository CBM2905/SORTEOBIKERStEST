interface HeroSectionProps {
  title: string;
  subtitle: string;
  progress: number;
  bannerImage: string;
  ticketsNumber?: number;
  price?: string;
  currency?: string;
  onCheckDayClick?: () => void;
  onCheckNumbersClick?: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  progress,
  bannerImage,
  ticketsNumber,
  price,
  currency,
  onCheckDayClick,
  onCheckNumbersClick,
}: HeroSectionProps) {
  return (
    <section className="relative w-full bg-[#050505] overflow-hidden">
      {/* Subtle background - not distracting */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl -translate-x-1/2" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-3xl translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content - Clear hierarchy */}
          <div className="space-y-8">
            {/* Status badge - clear and simple */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d0d0d] border border-[#d4af37]/30 rounded-full">
              <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse-status" />
              <span className="text-sm font-medium text-[#d4af37]">Sorteo Activo</span>
            </div>

            {/* Main heading - clear, readable */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-[#bdb7a0] leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>

            {/* Stats - easy to scan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#d4af37]/30 transition-colors">
                <p className="text-xs uppercase tracking-wider text-[#8f876b] font-semibold mb-2">Avance</p>
                <p className="text-3xl font-bold text-white mb-3">{progress.toFixed(0)}%</p>
                <div className="h-2 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {ticketsNumber !== undefined && (
                <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#d4af37]/30 transition-colors">
                  <p className="text-xs uppercase tracking-wider text-[#8f876b] font-semibold mb-2">Boletas</p>
                  <p className="text-3xl font-bold text-white">
                    {ticketsNumber.toLocaleString('es-CO')}
                  </p>
                </div>
              )}

              {price && currency && (
                <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-5 hover:border-[#d4af37]/30 transition-colors">
                  <p className="text-xs uppercase tracking-wider text-[#8f876b] font-semibold mb-2">Precio</p>
                  <p className="text-3xl font-bold text-white">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(Number(price))}
                  </p>
                </div>
              )}
            </div>

            {/* CTAs - Clear and accessible */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onCheckDayClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#050505] font-bold rounded-xl hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#050505]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                ¿Qué día juega?
              </button>
              <button
                onClick={onCheckNumbersClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0d0d0d] border-2 border-[#2a2a2a] text-white font-bold rounded-xl hover:border-[#d4af37] hover:bg-[#0d0d0d] transition-all focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#050505]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Consulta números
              </button>
            </div>
          </div>

          {/* Right: Banner */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#1f1f1f] bg-[#0b0b0b] min-h-[360px] sm:min-h-[480px] lg:min-h-[560px] shadow-2xl flex items-center justify-center p-6">
              <img
                src={bannerImage}
                alt={title}
                className="h-full w-full object-contain"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
