import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";
import { Search, Loader2, TrendingUp } from "lucide-react";

const ProfessionalArea = () => {
  const { t, i18n } = useTranslation();
  const [recherche, setRecherche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchRecherche();
  }, []);

  const fetchRecherche = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/recherche/`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      console.log("📦 Recherche data:", data);
      
      // Prendre le premier élément si c'est un tableau
      let rechercheData = Array.isArray(data) ? data[0] : data.results?.[0] || data;
      
      // Utiliser les URLs des images depuis le serializer
      if (rechercheData) {
        console.log("🔍 Recherche complète:", rechercheData);
        for (let i = 1; i <= 5; i++) {
          const imageUrlKey = `image_${i}_url`;
          const imageKey = `image_${i}`;
          
          // Utiliser image_X_url si disponible (depuis le serializer)
          if (rechercheData[imageUrlKey]) {
            rechercheData[imageKey] = rechercheData[imageUrlKey];
            console.log(`✅ Image ${i} URL:`, rechercheData[imageUrlKey]);
          }
        }
      }
      
      setRecherche(rechercheData);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de charger les informations de recherche");
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (obj, fieldBase, sectionNum) => {
    if (!obj) return "";
    const currentLang = i18n.language;
    const fieldName = `${fieldBase}${sectionNum}_${currentLang}`;
    const fallbackField = `${fieldBase}${sectionNum}_fr`;
    return obj[fieldName] || obj[fallbackField] || "";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{t("common.loading") || "Chargement..."}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("common.error") || "Erreur"}</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!recherche) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("research.noData") || "Aucune information disponible"}
          </h3>
          <p className="text-gray-600">
            {t("research.noDataDesc") || "Le contenu de recherche sera bientôt disponible"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A]/10 via-[#F47920]/10 to-[#E84E1B]/10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#FDB71A]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F47920]/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-3xl flex items-center justify-center shadow-2xl">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                {t("research.title") || "Recherche & Innovation"}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-medium leading-relaxed">
              {t("research.subtitle") || "Découvrez nos axes de recherche et innovations"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections - Nature Aliments Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-24">
          {[1, 2, 3, 4, 5].map((num) => {
            const title = getLocalizedField(recherche, "title", num);
            const content = getLocalizedField(recherche, "content", num);
            const image = recherche[`image_${num}`];
            
            // Skip empty sections
            if (!title && !content && !image) return null;

            // Alternate layout: odd sections (1,3,5) image left, even sections (2,4) image right
            const isReverse = num % 2 === 0;

            return (
              <div 
                key={num}
                className={`flex flex-col ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <div className="relative group">
                    {/* Decorative background */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500"></div>
                    
                    {/* Image container */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group-hover:shadow-[0_20px_60px_-15px_rgba(244,121,32,0.4)] transition-all duration-500">
                      {image ? (
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              console.error("❌ Erreur image:", image);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          {/* Placeholder si erreur */}
                          <div className="hidden w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-center">
                              <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 font-semibold">Image non disponible</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
                          <div className="text-center">
                            <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 font-semibold">Image à ajouter</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  {/* Section number badge */}
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 px-5 py-2 rounded-full border border-orange-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">{num}</span>
                    </div>
                    <span className="text-[#F47920] font-bold text-sm uppercase tracking-wide">
                      {t("research.section") || "Section"} {num}
                    </span>
                  </div>

                  {/* Title */}
                  {title && (
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                      {title}
                    </h2>
                  )}

                  {/* Divider */}
                  <div className="w-24 h-1 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-full"></div>

                  {/* Content */}
                  {content && (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {t("research.ctaTitle") || "Intéressé par nos recherches ?"}
          </h2>
          <p className="text-xl text-white/90 mb-10 font-medium">
            {t("research.ctaDesc") || "Contactez-nous pour en savoir plus sur nos projets de recherche et opportunités de collaboration"}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#F47920] rounded-xl font-bold text-lg shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t("common.contactUs") || "Nous contacter"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalArea;