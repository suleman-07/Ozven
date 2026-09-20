/**
 * Storefront contact config.
 * Update these values for production.
 */
export const SITE_PHONE_DISPLAY = '(555) 010-1234'
export const SITE_PHONE_TEL = 'tel:+15550101234'
/** Digits only, country code included (no +) — used for wa.me links */
export const SITE_WHATSAPP_NUMBER =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) || '15550101234'
export const SITE_WHATSAPP_URL = `https://wa.me/${SITE_WHATSAPP_NUMBER}`
export const SITE_EMAIL = 'sales@ozven.com'
export const SITE_EMAIL_HREF = 'mailto:sales@ozven.com'
