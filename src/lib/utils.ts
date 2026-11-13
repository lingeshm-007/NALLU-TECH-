export const PHONE_NUMBER = '+91 8248949759';
export const WHATSAPP_NUMBER = '918248949759';
export const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Nallu+Tech,/@11.5416413,79.1292909,488m/data=!3m1!1e3!4m6!3m5!1s0x3bab4721f742a30b:0xe674301feac43ab4!8m2!3d11.541912!4d79.1315204!16s%2Fg%2F11c7pc27g7?entry=ttu';

export function formatINR(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'Price on Enquiry';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getWhatsAppUrl(productName?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  let message = 'Hello NALLU TECH, I would like to enquire about your battery and inverter products.';
  if (productName && productName.trim().length > 0) {
    message = `Hello NALLU TECH, I would like to enquire about ${productName.trim()}.`;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

