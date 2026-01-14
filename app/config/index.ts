/**
 * Configuración de la aplicación
 */

export const APP_CONFIG = {
  name: 'WizzPro',
  description: 'Dinámicas Digitales Interactivas',
  version: '1.0.0',
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const SOCIAL_LINKS = {
  whatsapp: {
    baseUrl: 'https://api.whatsapp.com/send/',
    areaCode: '57',
  },
  instagram: {
    baseUrl: 'https://www.instagram.com/',
  },
};

export const UI_CONFIG = {
  navbar: {
    height: '60px',
  },
  colors: {
    primary: 'blue-600',
    secondary: 'gray-900',
    success: 'green-500',
    error: 'red-600',
  },
};
    