/**
 * Funciones utilitarias
 */

/**
 * Formatea un número como moneda
 */
export function formatCurrency(value: string | number, currency: string = 'COP'): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(number);
}

/**
 * Construye una URL de WhatsApp
 */
export function buildWhatsAppUrl(phoneNumber: string, message?: string): string {
  const baseUrl = 'https://api.whatsapp.com/send/';
  const params = new URLSearchParams({
    phone: phoneNumber,
    ...(message && { text: message }),
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Valida un número de teléfono
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, length: number = 50): string {
  return text.length > length ? `${text.substring(0, length)}...` : text;
}
