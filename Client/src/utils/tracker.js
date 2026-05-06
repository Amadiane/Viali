





// src/utils/tracker.js
import CONFIG from "../config/config";

/**
 * Tracke une action sur le site (visit, click, etc.)
 * @param {Object} params
 * @param {string} params.action_type - Type d'action : "visit", "click", etc.
 * @param {string} params.page - URL ou chemin de la page
 * @param {string} [params.element] - Nom ou ID de l'élément cliqué
 * @param {string} [params.tag] - Tag HTML de l'élément cliqué
 * @param {Object} [params.meta] - Infos supplémentaires optionnelles
 */
export const trackAction = async ({ action_type, page, element, tag, meta }) => {
  if (!action_type) return;

  try {
    await fetch(`${CONFIG.BASE_URL}/api/track/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type,
        page,
        label: element,
        tag,
        meta,
      }),
    });
  } catch (err) {
    console.error("Erreur tracking:", err);
  }
};
