'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all border-b border-[#1a1a1a] ${
        scrolled 
          ? 'bg-[#050505]/95 backdrop-blur-lg shadow-xl' 
          : 'bg-[#050505]/90 backdrop-blur-md'
      }`}
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
              <span className="text-[#050505] font-extrabold text-lg">SB</span>
            </div>
            <div>
              <p className="text-lg font-bold text-white flex items-center gap-2">
                Sorteo Bikers
                <span className="hidden sm:inline px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] text-[10px] rounded-full font-bold uppercase">Oficial</span>
              </p>
              <p className="text-xs text-[#bdb7a0]">Sorteos transparentes y verificados</p>
            </div>
          </div>

          {/* Trust Badges - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-full">
              <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-[#bdb7a0]">Pagos Seguros</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-full">
              <span aria-hidden="true">🏆</span>
              <span className="text-xs font-semibold text-[#bdb7a0]">+500 Ganadores</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
