// ============================================================
// CONFIGURATION DU SITE — Haingo Couture
// Valeurs lues depuis .env (préfixées VITE_) avec fallback statique.
// ============================================================

const get = (key, fallback) => {
  const v = import.meta.env[key]
  return v !== undefined && v !== '' ? v : fallback
}

const splitHours = (value, fallback) => {
  if (!value) return fallback
  return value.split(';').map((entry) => {
    const [days, time] = entry.split(',')
    return { days: (days || '').trim(), time: (time || '').trim() }
  })
}

export const siteConfig = {
  name: get('VITE_SITE_NAME', 'Haingo Couture'),
  tagline: get('VITE_SITE_TAGLINE', "L'élégance et la simplicité"),

  // --- Coordonnées ---
  phone: get('VITE_PHONE', '+261 34 04 950 34'),
  whatsapp: get('VITE_WHATSAPP', '261340495034'),
  email: get('VITE_EMAIL', 'haingomalal@gmail.com'),
  facebook: get('VITE_FACEBOOK', ''),
  instagram: get('VITE_INSTAGRAM', ''),
  tiktok: get('VITE_TIKTOK', ''),

  // --- Adresse ---
  address: {
    line1: get('VITE_ADDRESS_LINE1', 'Bazar Kely'),
    line2: get('VITE_ADDRESS_LINE2', 'Toamasina (Tamatave)'),
    country: get('VITE_ADDRESS_COUNTRY', 'Madagascar'),
  },

  // --- Localisation (Google Maps) ---
  location: {
    lat: Number(get('VITE_MAP_LAT', '-18.155389')) || -18.155389,
    lng: Number(get('VITE_MAP_LNG', '49.401917')) || 49.401917,
    dms: get('VITE_MAP_DMS', '18°09\'19.4"S 49°24\'06.9"E'),
    link: get('VITE_MAP_LINK', 'https://www.google.com/maps/search/?api=1&query=-18.155389,49.401917'),
    embed: get('VITE_MAP_EMBED', 'https://www.google.com/maps?q=-18.155389,49.401917&z=16&output=embed'),
  },

  // --- Horaires ---
  hours: splitHours(
    get('VITE_HOURS', ''),
    [
      { days: 'Lundi – Vendredi', time: '08h00 – 17h00' },
      { days: 'Samedi', time: '08h00 – 13h00' },
      { days: 'Dimanche', time: 'Fermé' },
    ],
  ),

  // --- Accès administrateur (verifie via /api/login, aucun secret en dur ici) ---
  admin: {
    identifiant: '', // renseigne via ADMIN_USER sur le serveur
    motDePasse: '', // renseigne via ADMIN_PASS_HASH sur le serveur
  },

  // --- Envoi du formulaire de contact (vers l'admin) ---
  contactFormEndpoint: get(
    'VITE_CONTACT_FORM_ENDPOINT',
    'https://formsubmit.co/ajax/haingomalal@gmail.com',
  ),

  // URL des images (dans public/creations/)
  galleryBase: get('VITE_GALLERY_BASE', '/creations/'),
  logo: get('VITE_LOGO', '/logo.png'),
  icon: get('VITE_ICON', '/icon.png'),
}
