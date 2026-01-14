# ⚡ Quick Start - Comienza Aquí

## 🎯 5 Minutos para Entender Todo

### 1️⃣ La Estructura (1 minuto)
```
app/
├── components/    ← Los 7 componentes UI
├── constants/     ← Datos de la rifa
├── types/         ← Tipos TypeScript
├── config/        ← Variables globales
├── hooks/         ← Lógica reutilizable
├── utils/         ← Funciones auxiliares
├── page.tsx       ← Página principal (solo ensambla)
└── layout.tsx     ← Estructura HTML
```

### 2️⃣ El Flujo (2 minutos)

```
┌─────────────────────────────────────┐
│  app/constants/raffleData.ts        │
│  Aquí están todos los datos         │
└────────────┬────────────────────────┘
             │
        ┌────▼────────────────────┐
        │  app/page.tsx           │
        │  Ensambla los           │
        │  componentes aquí       │
        └────┬────────────────────┘
             │
    ┌────────┼────────────┬──────────┐
    ▼        ▼            ▼          ▼
┌────────┐┌──────────┐┌────────┐┌─────────┐
│Navbar  ││HeroSec.  ││Awards  ││Socials  │
└────────┘└──────────┘└────────┘└─────────┘
```

### 3️⃣ Los Componentes (2 minutos)

**Navbar.tsx** - Barra superior
```tsx
<Navbar onLoginClick={handleLogin} />
```

**HeroSection.tsx** - Sección principal
```tsx
<HeroSection
  title="MT 09 YAMT 2026"
  progress={77.31}
  bannerImage={url}
/>
```

**AwardsSection.tsx** - Grid de premios
```tsx
<AwardsSection
  awards={raffleData.awards}
  onAwardSelect={handleSelect}
/>
```

**SocialLinks.tsx** - Redes sociales
```tsx
<SocialLinks
  whatsappLink="3174885708"
  instagramLink="https://..."
/>
```

---

## 🔧 Cómo Modificar Datos

### Cambiar datos de la rifa
Edita `app/constants/raffleData.ts`:
```typescript
export const raffleData: RaffleData = {
  title: "TU NUEVO TITULO",  // ← Cambiar aquí
  description: "Tu descripción",
  progress: 77.31,
  // ... resto de datos
};
```

### Agregar nuevo premio
```typescript
awards: [
  // ... premios existentes
  {
    id: 9999,
    title: "Nuevo Premio",
    description: "Descripción",
    image: "https://...",
  },
],
```

---

## ➕ Cómo Agregar un Nuevo Componente

### Paso 1: Crear archivo
Crea `app/components/MiComponente.tsx`:
```tsx
interface MiComponenteProps {
  titulo: string;
}

export default function MiComponente({ titulo }: MiComponenteProps) {
  return <div className="...">
    <h2>{titulo}</h2>
  </div>;
}
```

### Paso 2: Exportar en index
Agrega en `app/components/index.ts`:
```tsx
export { default as MiComponente } from "./MiComponente";
```

### Paso 3: Usar en page.tsx
```tsx
import { MiComponente } from '@/app/components';

export default function Home() {
  return (
    <>
      <Navbar />
      <MiComponente titulo="Hola" />
    </>
  );
}
```

---

## 🎨 Cómo Cambiar Estilos

Todos los estilos usan **Tailwind CSS**:

```tsx
// Cambiar colores
className="bg-blue-600 hover:bg-blue-700"  // Usa estos

// Cambiar tamaños
className="text-lg md:text-2xl lg:text-4xl"  // Responsive

// Cambiar espacios
className="p-4 mb-8 pt-20"  // Padding, margin

// Combinar
className="bg-white rounded-lg shadow-lg hover:shadow-xl"
```

**Referencia Tailwind:** https://tailwindcss.com/docs

---

## 🪝 Custom Hooks

Disponibles en `app/hooks/index.ts`:

```tsx
import { useNavigation, useAwardActions } from '@/app/hooks';

export default function MiComponente() {
  const { handleLogin } = useNavigation();
  const { handleBuyAward } = useAwardActions();
  
  return (
    <button onClick={() => handleBuyAward(123)}>
      Comprar
    </button>
  );
}
```

---

## 🛠️ Funciones Útiles

En `app/utils/index.ts`:

```tsx
import { 
  formatCurrency, 
  buildWhatsAppUrl,
  truncateText 
} from '@/app/utils';

// Formatear dinero
formatCurrency("1600", "COP")  // → $1.600

// Crear URL WhatsApp
buildWhatsAppUrl("573174885708")  // → https://...

// Truncar texto
truncateText("Texto muy largo...", 20)  // → "Texto muy largo..."
```

---

## 📝 Tipos TypeScript

En `app/types/index.ts`:

```tsx
interface Award {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface RaffleData {
  title: string;
  progress: number;
  awards: Award[];
  // ... más propiedades
}
```

Úsalos en tus componentes:
```tsx
import { Award } from '@/app/types';

function MiComponente(award: Award) {
  return <div>{award.title}</div>;
}
```

---

## ⚙️ Configuración Global

En `app/config/index.ts`:

```tsx
export const APP_CONFIG = {
  name: 'WizzPro',
  version: '1.0.0',
};

export const SOCIAL_LINKS = {
  whatsapp: { baseUrl: 'https://...' },
  instagram: { baseUrl: 'https://...' },
};
```

Úsalo:
```tsx
import { APP_CONFIG } from '@/app/config';

console.log(APP_CONFIG.name);  // WizzPro
```

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm run start

# Linter
npm run lint

# Formatear código
npm run format
```

---

## 📚 Dónde Buscar Ayuda

| Pregunta | Archivo |
|----------|---------|
| ¿Cómo está organizado? | `ESTRUCTURA.md` |
| ¿Cómo agrego un componente? | `GUIA_DESARROLLO.md` |
| ¿Cómo funciona el flujo? | `ARQUITECTURA.md` |
| ¿Ejemplo de componente? | `EJEMPLO_COMPONENTE.tsx` |
| ¿Resumen completo? | `README_REFACTORING.md` |

---

## ✅ Checklist Básico

- [ ] Entendí la estructura
- [ ] Cambié los datos en `raffleData.ts`
- [ ] Creé un componente nuevo
- [ ] Ejecuté `npm run dev`
- [ ] Vi los cambios en localhost:3000

---

## 💬 Preguntas Frecuentes

**P: ¿Por qué separar componentes?**  
R: Para reutilizarlos, testearlos y mantener el código limpio.

**P: ¿Dónde pongo la lógica?**  
R: En hooks (`app/hooks/`) o en el componente si es simple.

**P: ¿Dónde pongo los datos?**  
R: En constantes (`app/constants/`) o en un backend/API.

**P: ¿Qué es TypeScript?**  
R: Te ayuda a escribir código más seguro con tipos.

**P: ¿Puedo cambiar los colores?**  
R: Sí, usa Tailwind CSS en los `className`.

---

## 🎯 Tu Primera Tarea

1. Abre `app/constants/raffleData.ts`
2. Cambia el `title` a tu texto
3. Cambia el `progress` a otro número
4. Ejecuta `npm run dev`
5. Ve los cambios en http://localhost:3000

**¡Eso es! 🎉**

---

**Más detalles en los otros archivos de documentación.**

**¡Bienvenido a tu proyecto profesional! 🚀**
