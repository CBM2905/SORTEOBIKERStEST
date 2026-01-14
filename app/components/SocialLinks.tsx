import { WhatsAppIcon, InstagramIcon } from "./SocialIcons";

interface SocialLinksProps {
  whatsappLink: string;
  instagramLink: string;
}

export default function SocialLinks({ 
  whatsappLink, 
  instagramLink 
}: SocialLinksProps) {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] border-t border-[#1a1a1a]">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#d4af37] blur-3xl animate-float" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Testimonials Section */}
        <div className="mb-16 animate-fadeInUp">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Lo Que Dicen Nuestros Ganadores
            </h3>
            <p className="text-[#bdb7a0] text-lg">Testimonios reales de nuestra comunidad</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-lg font-bold text-[#050505]">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <p className="font-bold text-white">Ganador {i}</p>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#bdb7a0] text-sm leading-relaxed">
                  "Increíble experiencia! Todo el proceso fue transparente y rápido. 100% recomendado."
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Social CTA */}
        <div className="glass rounded-3xl p-8 sm:p-12 text-center mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] mb-4">
              <svg className="w-8 h-8 text-[#050505]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Únete a la Comunidad Bikers
            </h3>
            <p className="text-[#bdb7a0] text-lg leading-relaxed">
              Síguenos en redes sociales para novedades, sorteos exclusivos y mucho más
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={`https://api.whatsapp.com/send/?phone=57${whatsappLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/30"
              >
                <WhatsAppIcon />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Chat en WhatsApp</p>
                  <p className="text-xs text-white/80">Respuesta inmediata</p>
                </div>
              </a>

              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FD1D1D] hover:opacity-90 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-pink-500/30"
              >
                <InstagramIcon />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Sigue en Instagram</p>
                  <p className="text-xs text-white/80">Contenido exclusivo</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1a1a1a] pt-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-xs font-bold text-[#050505]">
                  SB
                </div>
                Sorteo Bikers
              </h4>
              <p className="text-sm text-[#8f876b] leading-relaxed">
                La plataforma de sorteos más confiable y transparente de Colombia.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#8f876b] hover:text-[#d4af37] transition-colors">Cómo participar</a></li>
                <li><a href="#" className="text-[#8f876b] hover:text-[#d4af37] transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="text-[#8f876b] hover:text-[#d4af37] transition-colors">Ganadores</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-[#8f876b] hover:text-[#d4af37] transition-colors">Preguntas frecuentes</a></li>
                <li><a href="#" className="text-[#8f876b] hover:text-[#d4af37] transition-colors">Contacto</a></li>
                <li><a href="#" className="text-[#8f876b] hover:text-[#d4af37] transition-colors">Política de privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-[#1a1a1a]">
            <p className="text-sm text-[#8f876b] mb-4">
              © 2026 Sorteo Bikers. Todos los derechos reservados.
            </p>
            <p className="text-xs text-[#6f6b5b]">
              Sorteos certificados y auditados. Juego responsable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
