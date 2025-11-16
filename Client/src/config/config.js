// ✅ Détection automatique selon le domaine
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://api.jorfofbasketclub.com"; // ton URL backend Render

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,

  // PARTENAIRES
  API_PARTNER_LIST: `${BASE_URL}/api/partners/`,
  API_PARTNER_CREATE: `${BASE_URL}/api/partners/`, // ✅ POST ici
  API_PARTNER_UPDATE: (id) => `${BASE_URL}/api/partners/${id}/`, // ✅ PUT/PATCH
  API_PARTNER_DELETE: (id) => `${BASE_URL}/api/partners/${id}/`, // ✅ DELETE



// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dwuyq2eoz",
CLOUDINARY_UPLOAD_PRESET: "default", // 👈 le nom exact de ton preset UNSIGNED
  
// CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 nom exact du preset créé
};

export default CONFIG;




