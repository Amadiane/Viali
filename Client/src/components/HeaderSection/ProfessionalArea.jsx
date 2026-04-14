import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";
import { Search, Loader2, Sparkles, Zap, TrendingUp, Target, Lightbulb, Rocket, ArrowRight } from "lucide-react";

// Component to fetch and display ALL partners in infinite scrolling carousel
const PartnersPreview = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${CONFIG.BASE_URL}/api/partners/`);
        if (!response.ok) throw new Error("Erreur");
        
        const data = await response.json();
        const partnerData = Array.isArray(data) ? data : data.results || [];
        const activePartners = partnerData.filter(
          partner => partner.is_active === true || partner.isActive === true
        );
        
        // Take ALL active partners
        setPartners(activePartners);
      } catch (error) {
        console.error("Erreur partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin" strokeWidth={2.5} />
      </div>
    );
  }

  if (partners.length === 0) return null;

  // Split partners into 2 rows
  const halfLength = Math.ceil(partners.length / 2);
  const row1Partners = partners.slice(0, halfLength);
  const row2Partners = partners.slice(halfLength);

  // Duplicate for infinite scroll
  const row1Duplicated = [...row1Partners, ...row1Partners, ...row1Partners];
  const row2Duplicated = [...row2Partners, ...row2Partners, ...row2Partners];

  return (
    <div className="space-y-8 overflow-hidden">
      {/* Row 1 - Scroll Left */}
      <div className="relative">
        <div className="flex gap-8 animate-scroll-left">
          {row1Duplicated.map((partner, idx) => {
            const partnerImage = partner.cover_image_url || partner.cover_image;
            const partnerName = partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
            
            return (
              <div
                key={`row1-${partner.id}-${idx}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-6 bg-white rounded-2xl border-2 border-gray-100"
              >
                {partnerImage ? (
                  <img
                    src={partnerImage}
                    alt={partnerName}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                    <span className="text-gray-400 font-bold text-sm text-center px-2"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {partnerName}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 - Scroll Right (reverse) */}
      <div className="relative">
        <div className="flex gap-8 animate-scroll-right">
          {row2Duplicated.map((partner, idx) => {
            const partnerImage = partner.cover_image_url || partner.cover_image;
            const partnerName = partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
            
            return (
              <div
                key={`row2-${partner.id}-${idx}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-6 bg-white rounded-2xl border-2 border-gray-100"
              >
                {partnerImage ? (
                  <img
                    src={partnerImage}
                    alt={partnerName}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                    <span className="text-gray-400 font-bold text-sm text-center px-2"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {partnerName}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
      
      let rechercheData = Array.isArray(data) ? data[0] : data.results?.[0] || data;
      
      if (rechercheData) {
        for (let i = 1; i <= 5; i++) {
          const imageUrlKey = `image_${i}_url`;
          const imageKey = `image_${i}`;
          if (rechercheData[imageUrlKey]) {
            rechercheData[imageKey] = rechercheData[imageUrlKey];
          }
        }
      }
      
      setRecherche(rechercheData);
    } catch (err) {
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

  const sectionIcons = [Lightbulb, Target, TrendingUp, Rocket, Zap];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-gray-600 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("common.loading") || "Chargement..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("common.error") || "Erreur"}
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!recherche) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
            <Sparkles className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("research.noData") || "Aucune information disponible"}
          </h3>
          <p className="text-gray-600 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("research.noDataDesc") || "Le contenu de recherche sera bientôt disponible"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        
        @keyframes scroll-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
        
        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FFC107 0%, #FF8C00 50%, #FFC107 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        
        .separator-line {
          height: 3px;
          background: linear-gradient(90deg, 
            transparent 0%,
            #FFC107 20%,
            #FF8C00 50%,
            #FFC107 80%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(255, 140, 0, 0.3);
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section - Style Actualités */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("research.badge") || "Innovation & Excellence"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("research.title") || "Recherche & Développement"}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("research.subtitle") || "Découvrez nos axes de recherche et innovations"}
            </p>
          </div>

          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Stats Grid - Style Actualités */}
        <section className="max-w-[1200px] mx-auto px-6 pb-16 md:pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Lightbulb, value: "5+", label: t("research.stat1") || "Domaines" },
              { icon: Target, value: "100%", label: t("research.stat2") || "Innovation" },
              { icon: TrendingUp, value: "24/7", label: t("research.stat3") || "Recherche" },
              { icon: Rocket, value: "∞", label: t("research.stat4") || "Possibilités" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-[#FF8C00] mb-2"
                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-gray-600 uppercase tracking-wide"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Content Sections - Full Visibility */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 md:py-12 space-y-32">
          {[1, 2, 3, 4, 5].map((num) => {
            const title = getLocalizedField(recherche, "title", num);
            const content = getLocalizedField(recherche, "content", num);
            const image = recherche[`image_${num}`];
            
            if (!title && !content && !image) return null;

            const Icon = sectionIcons[num - 1];

            return (
              <article
                key={num}
                className="animate-slide-up"
                style={{ animationDelay: `${num * 0.1}s` }}
              >
                {/* Icon + Title */}
                <div className="mb-10">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full"></div>
                  </div>
                  
                  {title && (
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {title}
                    </h3>
                  )}
                </div>

                {/* Image - Full Size, Fully Visible */}
                {image && (
                  <div className="mb-10 rounded-3xl overflow-hidden bg-white">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-auto max-w-full object-contain"
                      style={{ maxHeight: 'none' }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    
                    <div className="hidden w-full min-h-[400px] flex items-center justify-center p-12 bg-gradient-to-br from-orange-50 to-yellow-50">
                      <div className="text-center">
                        <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" strokeWidth={2} />
                        <p className="text-gray-500 font-semibold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Image non disponible
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content - All Text Fully Visible */}
                {content && (
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-10 md:p-12 mb-10 border-l-4 border-[#FF8C00]">
                    <div className="prose prose-lg md:prose-xl max-w-none">
                      <p className="text-gray-800 leading-relaxed text-xl md:text-2xl font-medium whitespace-pre-line m-0"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        {content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div>
                  <a
                    href="/contacternous"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white rounded-2xl font-black text-lg md:text-xl"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <span>{t("research.contactCta") || "Discutons de ce service"}</span>
                    <ArrowRight className="w-6 h-6" strokeWidth={3} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Partners Section - Style Nature Aliments */}
        <section className="bg-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            
            {/* Title - Style Nature Aliments */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ILS NOUS ONT FAIT CONFIANCE
              </h2>
              <p className="text-2xl md:text-3xl font-bold mb-2"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FF8C00' }}>
                pourquoi pas vous ?
              </p>
              {/* Arrow decoration */}
              <div className="flex justify-center mt-8">
                <svg width="120" height="80" viewBox="0 0 120 80" className="text-gray-900">
                  <path d="M10 10 Q 40 40, 70 10 T 110 30" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="none"
                        markerEnd="url(#arrowhead)"/>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="currentColor"/>
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Partners Grid - First 4 */}
            <PartnersPreview />

            {/* CTA to see all partners */}
            <div className="text-center mt-16">
              <a
                href="/partner"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white rounded-2xl font-black text-xl"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span>Voir tous nos partenaires</span>
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ProfessionalArea;