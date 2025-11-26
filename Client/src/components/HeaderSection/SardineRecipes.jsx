import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ArrowRight, AlertCircle, Zap } from "lucide-react";
import CONFIG from "../../config/config.js";

// Spinner pour le chargement
const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-16 md:py-20">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-700 text-base md:text-lg mt-6 font-semibold">{text}</span>
  </div>
);

const SardineRecipes = () => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalisation URL Cloudinary
  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
    return `${CONFIG.BASE_URL}/${url}`;
  };

  // Fetch des recettes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_SARDINE_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const recipeData = Array.isArray(data) ? data : data.results || [];
        setRecipes(
          recipeData.map((r) => ({
            ...r,
            image_url: normalizeUrl(r.image_url || r.image),
          }))
        );
      } catch (err) {
        console.error("Erreur API Sardine Recipes:", err);
        setError(err.message || "Une erreur est survenue lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) return <LoadingSpinner text={t("recipes.loading", "Chargement...")} />;
  if (error) return (
    <div className="text-center py-16">
      <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
      <p className="text-red-600 font-bold mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition"
      >
        {t("recipes.retry", "Réessayer")}
      </button>
    </div>
  );
  if (recipes.length === 0) return (
    <div className="text-center py-16">
      <p className="text-gray-600 font-bold">{t("recipes.empty", "Aucune recette trouvée")}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-12">
        {t("recipes.title", "Recettes de Sardine")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative aspect-video overflow-hidden bg-gray-50 group-hover:bg-orange-50 transition-colors">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe[`title_${i18n.language}`] || recipe.title_fr}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => e.target.src = "https://placehold.co/600x400/FDB71A/ffffff?text=Recette"}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-400/30 font-bold">
                  {t("recipes.no_image", "Pas d'image")}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/70 via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <div className="flex items-center gap-1.5 text-white font-bold text-xs md:text-sm">
                  <span>{t("recipes.view_more", "Voir plus")}</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6 flex-1 flex flex-col gap-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2">
                {recipe[`title_${i18n.language}`] || recipe.title_fr}
              </h3>
              <p className="text-gray-600 text-sm md:text-base line-clamp-3 flex-1">
                {recipe[`content_${i18n.language}`] || recipe.content_fr}
              </p>
              {recipe.created_at && (
                <div className="flex items-center gap-2 text-gray-500 pt-3 border-t border-gray-200 group-hover:border-orange-200 transition-colors">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium">
                    {new Date(recipe.created_at).toLocaleDateString(i18n.language, { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SardineRecipes;
