# Estructura del Proyecto

Este es un proyecto Next.js profesional y modular para WizzPro.

## Estructura de Carpetas

```
app/
├── components/              # Componentes reutilizables
│   ├── Navbar.tsx          # Barra de navegación
│   ├── HeroSection.tsx      # Sección principal/hero
│   ├── AwardsSection.tsx    # Sección de premios
│   ├── AwardCard.tsx        # Tarjeta individual de premio
│   ├── SocialLinks.tsx      # Enlaces a redes sociales
│   ├── SocialIcons.tsx      # Iconos SVG para redes
│   └── index.ts            # Exportar todos los componentes
├── constants/              # Constantes de la aplicación
│   └── raffleData.ts       # Datos de la rifa
├── types/                  # Tipos TypeScript
│   └── index.ts           # Interfaces y tipos
├── layout.tsx             # Layout principal
├── page.tsx               # Página de inicio
└── globals.css            # Estilos globales
```

## Convenciones

- **Componentes**: PascalCase (ej: `Navbar.tsx`)
- **Archivos**: kebab-case para utilidades, PascalCase para componentes
- **Props**: Tipadas con TypeScript
- **Estado**: Controlado con hooks (useState, useCallback)

## Componentes

### Navbar
Barra de navegación fija con logo y botón de login.
- Props: `onLoginClick` (callback)

### HeroSection
Sección principal con título, descripción y botones de acción.
- Props: `title`, `subtitle`, `progress`, `bannerImage`, callbacks

### AwardsSection
Grid de premios disponibles.
- Props: `awards` (Award[]), `onAwardSelect` (callback)

### AwardCard
Tarjeta individual de premio (componente interno).
- Props: `award`, `onSelect`, `onBuy`

### SocialLinks
Enlaces a redes sociales (WhatsApp, Instagram).
- Props: `whatsappLink`, `instagramLink`

## Tipos

```typescript
interface Award {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface RaffleData {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  progress: number;
  tickets_number: number;
  whatsapp_link: string;
  instagram_link: string;
  awards: Award[];
  bannerImage: string;
}
```

## Cómo Agregar Nueva Funcionalidad

1. **Crear un nuevo componente** en `app/components/`
2. **Exportarlo** en `app/components/index.ts`
3. **Importarlo** en `page.tsx` o donde sea necesario
4. **Pasar los datos** desde las constantes

## Para Mantener la Modularidad

- ✅ Componentes pequeños y reutilizables
- ✅ Props bien tipadas
- ✅ Datos separados en constantes
- ✅ Funciones callback para eventos
- ✅ Estilos con Tailwind CSS
- ✅ TypeScript para type safety
