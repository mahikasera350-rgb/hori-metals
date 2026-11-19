/**
 * Hori Metals — Central Business Configuration
 *
 * Official Brand & Contact Information
 */

const phoneRaw = '919111934512';
const phoneDisplay = '+91 9111934512';

export const BUSINESS = {
  name: 'Hori Metals',
  tagline: 'Brass · Copper · Sacred Pooja Articles',
  city: 'Ujjain',
  state: 'Madhya Pradesh',
  pincode: '456001',
  address: 'Near Mahakaleshwar Corridor, Freeganj, Ujjain, Madhya Pradesh — 456001',

  /** Display-formatted phone */
  phone: phoneDisplay,
  /** Digits-only for tel: and wa.me links */
  phoneRaw: phoneRaw,

  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@horimetals.com',

  whatsAppUrl: `https://wa.me/${phoneRaw}`,
  instagramHandle: '@horimetals',
  instagramUrl: 'https://www.instagram.com/horimetals/',

  hours: 'Monday – Saturday: 10:00 AM – 8:30 PM IST',
} as const;
