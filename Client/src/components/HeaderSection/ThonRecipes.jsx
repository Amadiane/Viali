import React, { useEffect, useState } from "react";
import { Fish, Loader2, AlertCircle } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const GradientText = ({ children, className = "" }) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] ${className}`}>
    {children}
  </span>
);

const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-16 md:py-20">
    <Loader2 className="animate-spin text-orange-500" size={40} />
    <span className="text-gray-700 text-base md:text-lg mt-6 font-semibold">{text}</span>
  </div>
);

const ThonRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_THON_LIST);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.results || [];
        // On assure que chaque recette a bien un champ image_url
        const normalized = list.map(r => ({ ...r, image_url: r.image_url || r.image || "/placeholder.png" }));
        setRecipes(normalized);
      } catch (err) {
        console.error("Erreur API ThonRecipes:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des recettes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden py-24 md:py-32 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Fish className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <GradientText>{t("thon.title") || "Recettes de Thon"}</GradientText>
          </h1>
          <p className="text-base md:text-lg text-gray-800 max-w-2xl mx-auto">
            {t("thon.subtitle") || "Découvrez nos délicieuses recettes à base de thon."}
          </p>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Loading */}
        {loading && <LoadingSpinner text={t("thon.loading") || "Chargement..."} />}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border-2 border-red-200 shadow-lg">
              <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && recipes.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl">
              <Fish className="w-20 h-20 md:w-24 md:h-24 text-orange-500 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t("thon.no_recipes_title") || "Aucune recette trouvée"}
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                {t("thon.no_recipes_text") || "Veuillez revenir plus tard pour découvrir nos recettes de thon."}
              </p>
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-square p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title_fr || "Recette de thon"}
                    className="relative w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <h3 className="text-center text-gray-800 font-bold text-sm md:text-base truncate">
                    {recipe.title_fr}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ThonRecipes;
