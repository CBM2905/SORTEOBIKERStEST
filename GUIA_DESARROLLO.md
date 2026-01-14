# Guía Rápida de Desarrollo

## 🏗️ Estructura Profesional y Modular

Tu proyecto ahora tiene una estructura escalable y profesional:

```
app/
├── components/      ← Componentes reutilizables
├── constants/       ← Datos y constantes
├── types/          ← Interfaces TypeScript
├── config/         ← Configuración global
├── hooks/          ← Custom hooks
├── utils/          ← Funciones auxiliares
├── layout.tsx      ← Estructura HTML principal
└── page.tsx        ← Página de inicio
```

## 🎯 Componentes Disponibles

### Navbar
```tsx
<Navbar onLoginClick={handleLogin} />
```

### HeroSection
```tsx
<HeroSection
  title="MT 09 YAMT 2026"
  subtitle="Lo nuevo de Yamaha"
  progress={77.31}
  bannerImage={bannerUrl}
  onCheckDayClick={handleCheckDay}
  onCheckNumbersClick={handleCheckNumbers}
/>
```

### AwardsSection
```tsx
<AwardsSection
  awards={raffleData.awards}
  onAwardSelect={handleAwardSelect}
/>
```

### SocialLinks
```tsx
<SocialLinks
  whatsappLink="3174885708"
  instagramLink="https://instagram.com/..."
/>
```

## 📝 Cómo Agregar Un Nuevo Componente

1. **Crear el archivo** en `app/components/MiComponente.tsx`:
```tsx
interface MiComponenteProps {
  titulo: string;
  onAccion?: () => void;
}

export default function MiComponente({ titulo, onAccion }: MiComponenteProps) {
  return <div>{titulo}</div>;
}
```

2. **Exportarlo** en `app/components/index.ts`:
```tsx
export { default as MiComponente } from "./MiComponente";
```

3. **Usarlo** en `page.tsx`:
```tsx
import { MiComponente } from '@/app/components';

export default function Home() {
  return <MiComponente titulo="Hola" />;
}
```

## 🎨 Estilos

- Usa **Tailwind CSS** para todos los estilos
- Mantén los colores consistentes
- Haz componentes responsive (mobile, tablet, desktop)

## 🔧 Configuración

Edita `app/config/index.ts` para cambiar:
- URLs de APIs
- Colores principales
- Textos comunes

## 🪝 Custom Hooks

Disponibles en `app/hooks/index.ts`:
- `useNavigation()` - Para navegación y login
- `useAwardActions()` - Para acciones de premios

## 📚 Utilidades

Disponibles en `app/utils/index.ts`:
- `formatCurrency()` - Formatear dinero
- `buildWhatsAppUrl()` - Construir URL de WhatsApp
- `isValidPhoneNumber()` - Validar teléfono
- `truncateText()` - Truncar texto

## ✅ Buenas Prácticas

- ✅ Props tipadas con TypeScript
- ✅ Componentes pequeños y enfocados
- ✅ Datos en constantes, no hardcodeados
- ✅ Usar callbacks para eventos
- ✅ Lazy loading para imágenes
- ✅ Nombres descriptivos

## 🚀 Siguiente Paso

Ahora puedes:
1. Agregar funcionalidad de compra
2. Conectar a un backend/API
3. Agregar autenticación
4. Agregar más secciones
5. Implementar carrito de compras

¡El proyecto está listo para crecer! 🎉
