// ✅ Détection automatique selon le domaine
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://api.viali-gn.com"; // ton URL backend Render

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,

  // PARTENAIRES
  API_PARTNER_LIST: `${BASE_URL}/api/partners/`,
  API_PARTNER_CREATE: `${BASE_URL}/api/partners/`, // ✅ POST ici
  API_PARTNER_UPDATE: (id) => `${BASE_URL}/api/partners/${id}/`, // ✅ PUT/PATCH
  API_PARTNER_DELETE: (id) => `${BASE_URL}/api/partners/${id}/`, // ✅ DELETE


    // 📰 NEWS CRUD
  API_NEWS_LIST: `${BASE_URL}/api/news/`,
  API_NEWS_CREATE: `${BASE_URL}/api/news/`,
  API_NEWS_UPDATE: (id) => `${BASE_URL}/api/news/${id}/`,
  API_NEWS_DELETE: (id) => `${BASE_URL}/api/news/${id}/`,


    // Valeurs
  API_VALEUR_LIST: `${BASE_URL}/api/values/`,
  API_VALEUR_CREATE: `${BASE_URL}/api/values/`,
  API_VALEUR_UPDATE: (id) => `${BASE_URL}/api/values/${id}/`,
  API_VALEUR_DELETE: (id) => `${BASE_URL}/api/values/${id}/`,

    // Missions
  API_MISSION_LIST: `${BASE_URL}/api/missions/`,
  API_MISSION_CREATE: `${BASE_URL}/api/missions/`,
  API_MISSION_UPDATE: (id) => `${BASE_URL}/api/missions/${id}/`,
  API_MISSION_DELETE: (id) => `${BASE_URL}/api/missions/${id}/`,



// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dwuyq2eoz",
CLOUDINARY_UPLOAD_PRESET: "default", // 👈 le nom exact de ton preset UNSIGNED
  
// CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 nom exact du preset créé
};

export default CONFIG;




