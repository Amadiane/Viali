// ✅ Détection automatique selon le domaine
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://api.jorfofbasketclub.com";

const CONFIG = {
  BASE_URL,

  // Partners
  API_PARTNERS_LIST: `${BASE_URL}/api/partners/`,
  API_PARTNERS_DETAIL: (id: number) => `${BASE_URL}/api/partners/${id}/`,

  // Cloudinary
  CLOUDINARY_NAME: "dwuyq2eoz",
  CLOUDINARY_UPLOAD_PRESET: "default",
};

export default CONFIG;
