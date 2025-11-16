// ✅ Détection automatique selon le domaine
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://api.jorfofbasketclub.com"; // ton URL backend Render

const CONFIG = {
  BASE_URL,
  API_LOGIN: `/api/login/`,

  // 🖼️ Photothèque
  API_PHOTO_LIST: `${BASE_URL}/api/photos/`,
  API_PHOTO_DETAIL: (id) => `${BASE_URL}/api/photos/${id}/`,

  // ✅ Albums
  API_ALBUM_LIST: `${BASE_URL}/api/albums/`,
  API_ALBUM_DETAIL: (id) => `${BASE_URL}/api/albums/${id}/`,


  // 🎬 Vidéothèque (Cloudinary)
  API_VIDEO_LIST: `${BASE_URL}/api/videos/`,
  API_VIDEO_DETAIL: (id) => `${BASE_URL}/api/videos/${id}/`,
  API_VIDEO_CREATE: `${BASE_URL}/api/videos/`,
  API_VIDEO_UPDATE: (id) => `${BASE_URL}/api/videos/${id}/`,
  API_VIDEO_DELETE: (id) => `${BASE_URL}/api/videos/${id}/`,

  // 📰 News (Cloudinary)
  API_NEWS_LIST: `${BASE_URL}/api/news/`,
  API_NEWS_DETAIL: (id) => `${BASE_URL}/api/news/${id}/`,
  /* optionally */
  API_NEWS_CREATE: `${BASE_URL}/api/news/`,
  API_NEWS_UPDATE: (id) => `${BASE_URL}/api/news/${id}/`,
  API_NEWS_DELETE: (id) => `${BASE_URL}/api/news/${id}/`,


  //Match
  API_MATCH_LIST: `${BASE_URL}/api/matches/`,
  API_MATCH_CREATE: `${BASE_URL}/api/matches/`,
  API_MATCH_UPDATE: (id) => `${BASE_URL}/api/matches/${id}/`,
  API_MATCH_DELETE: (id) => `${BASE_URL}/api/matches/${id}/`,


  // 🤝 Partners
// 🤝 Partners
API_PARTNER_LIST: `${BASE_URL}/api/partners/`,
API_PARTNER_DETAIL: (id) => `${BASE_URL}/api/partners/${id}/`,
API_PARTNER_CREATE: `${BASE_URL}/api/partners/`,
API_PARTNER_UPDATE: (id) => `${BASE_URL}/api/partners/${id}/`,
API_PARTNER_DELETE: (id) => `${BASE_URL}/api/partners/${id}/`,


// 👇 ajoute ces lignes à la fin du CONFIG existant
// 🏀 Équipe (membres, coachs, staff)
API_EQUIPE_LIST: `${BASE_URL}/api/equipe/`,
API_EQUIPE_DETAIL: (id) => `${BASE_URL}/api/equipe/${id}/`,
API_EQUIPE_CREATE: `${BASE_URL}/api/equipe/`,
API_EQUIPE_UPDATE: (id) => `${BASE_URL}/api/equipe/${id}/`,
API_EQUIPE_DELETE: (id) => `${BASE_URL}/api/equipe/${id}/`,



// 🌍 Missions
API_MISSION_LIST: `${BASE_URL}/api/missions/`,
API_MISSION_DETAIL: (id) => `${BASE_URL}/api/missions/${id}/`,
API_MISSION_CREATE: `${BASE_URL}/api/missions/`,
API_MISSION_UPDATE: (id) => `${BASE_URL}/api/missions/${id}/`,
API_MISSION_DELETE: (id) => `${BASE_URL}/api/missions/${id}/`,


// 🌟 Valeurs
API_VALEUR_LIST: `${BASE_URL}/api/valeurs/`,
API_VALEUR_DETAIL: (id) => `${BASE_URL}/api/valeurs/${id}/`,
API_VALEUR_CREATE: `${BASE_URL}/api/valeurs/`,
API_VALEUR_UPDATE: (id) => `${BASE_URL}/api/valeurs/${id}/`,
API_VALEUR_DELETE: (id) => `${BASE_URL}/api/valeurs/${id}/`,


// 💬 Mot du Président
// 🧑‍💼 Mot du Président
API_MOTPRESIDENT_LIST: `${BASE_URL}/api/mot-president/`,
API_MOTPRESIDENT_DETAIL: (id) => `${BASE_URL}/api/mot-president/${id}/`,
API_MOTPRESIDENT_CREATE: `${BASE_URL}/api/mot-president/`,
API_MOTPRESIDENT_UPDATE: (id) => `${BASE_URL}/api/mot-president/${id}/`,
API_MOTPRESIDENT_DELETE: (id) => `${BASE_URL}/api/mot-president/${id}/`,

// 👥 Community
API_COMMUNITY_LIST: `${BASE_URL}/api/community/`,
API_COMMUNITY_DETAIL: (id) => `${BASE_URL}/api/community/${id}/`,
API_COMMUNITY_CREATE: `${BASE_URL}/api/community/`,
API_COMMUNITY_UPDATE: (id) => `${BASE_URL}/api/community/${id}/`,
API_COMMUNITY_DELETE: (id) => `${BASE_URL}/api/community/${id}/`,
API_COMMUNITY_REPLY: (id) => `${BASE_URL}/api/community/${id}/reply/`,


  // 🏀 Contacts
API_CONTACT_LIST: `${BASE_URL}/api/contacts/`,
API_CONTACT_CREATE: `${BASE_URL}/api/contacts/`,
API_CONTACT_DETAIL: (id) => `${BASE_URL}/api/contacts/${id}/`,
API_CONTACT_REPLY: (id) => `${BASE_URL}/api/contacts/${id}/reply/`,


  // 📰 Newsletter
  API_NEWSLETTER_LIST: `${BASE_URL}/api/newsletter/`,
  API_NEWSLETTER_CREATE: `${BASE_URL}/api/newsletter/`,
  API_NEWSLETTER_REPLY: (id) => `${BASE_URL}/api/newsletter/${id}/reply/`,

// ✅ API Home
API_HOME_LIST: `${BASE_URL}/api/home/`,
API_HOME_DETAIL: (id) => `${BASE_URL}/api/home/${id}/`,
API_HOME_CREATE: `${BASE_URL}/api/home/`,
API_HOME_UPDATE: (id) => `${BASE_URL}/api/home/${id}/`,
API_HOME_DELETE: (id) => `${BASE_URL}/api/home/${id}/`,

API_HOME_FULL: `${BASE_URL}/api/home-full/`,



// 📸 Dossier media (pour les images directes)
MEDIA_URL: `${BASE_URL}/media/`,

CLOUDINARY_NAME: "dwuyq2eoz",
CLOUDINARY_UPLOAD_PRESET: "default", // 👈 le nom exact de ton preset UNSIGNED
  
// CLOUDINARY_UPLOAD_PRESET: "ml_default", // 👈 nom exact du preset créé
};

export default CONFIG;




