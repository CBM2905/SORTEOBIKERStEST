/**
 * EJEMPLO: Cómo crear un nuevo componente
 * 
 * Este archivo muestra el patrón a seguir para crear nuevos componentes
 * de forma modular y profesional.
 */

// Paso 1: Importar tipos necesarios
// import { MiTipo } from '@/app/types';

// Paso 2: Definir la interfaz de props
interface FooterProps {
  year: number;
  companyName: string;
  links?: { label: string; href: string }[];
  onContactClick?: () => void;
}

/**
 * Footer Component
 * 
 * Componente que muestra el pie de página con enlaces y información
 * 
 * @example
 * <Footer
 *   year={2025}
 *   companyName="WizzPro"
 *   links={[{ label: "Home", href: "/" }]}
 *   onContactClick={handleContact}
 * />
 */
export default function Footer({
  year,
  companyName,
  links = [],
  onContactClick,
}: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyName}</h3>
            <p className="text-gray-400">
              Dinámicas digitales interactivas para tu marca
            </p>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact CTA */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <button
              onClick={onContactClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Contáctanos
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center">
            © {year} {companyName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * INSTRUCCIONES PARA USAR ESTE COMPONENTE:
 * 
 * 1. Copia este archivo a: app/components/Footer.tsx
 * 
 * 2. Agrega la exportación en app/components/index.ts:
 *    export { default as Footer } from "./Footer";
 * 
 * 3. Usa en page.tsx:
 *    import { Footer } from '@/app/components';
 *    
 *    export default function Home() {
 *      return (
 *        <>
 *          <main>... contenido ...</main>
 *          <Footer
 *            year={2025}
 *            companyName="WizzPro"
 *            links={[
 *              { label: "Home", href: "/" },
 *              { label: "Premios", href: "/prizes" },
 *            ]}
 *            onContactClick={() => console.log('Contact')}
 *          />
 *        </>
 *      );
 *    }
 */
