import React, { useEffect, useState } from "react";
import { Handshake, ExternalLink, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const LoadingSpinner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col justify-center items-center py-32">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#FF8C00] rounded-full animate-spin"></div>
      </div>
      <span className="text-gray-600 text-lg mt-6 font-semibold" 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Chargement...
      </span>
    </div>
  );
};

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setError(null);
        const response = await fetch(`${CONFIG.BASE_URL}/api/partners/`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const partnerData = Array.isArray(data) ? data : data.results || [];
        
        const activePartners = partnerData.filter(
          partner => partner.is_active === true || partner.isActive === true
        );
        
        setPartners(activePartners);
      } catch (error) {
        console.error("Erreur API partenaires:", error);
        setError(error.message || "Une erreur est survenue lors du chargement des partenaires");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handlePartnerClick = (websiteUrl) => {
    if (websiteUrl) {
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Réessayer
          </button>
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
        
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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
        
        {/* Hero Section - Style Contact avec titre centré */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("partner.badge_text")}
              </span>
            </div>

            {/* Titre principal avec gradient VIALI */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("partner.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("partner.subtitle")}
            </p>
          </div>

          {/* Ligne séparatrice stylée avec gradient animé */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-20">
          
          {partners.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
                <Handshake className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("partner.no_partners_title")}
              </h3>
              <p className="text-gray-600 text-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("partner.no_partners_text")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {partners.map((partner, idx) => {
                const partnerName = partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
                const partnerImage = partner.cover_image_url || partner.cover_image;
                
                return (
                  <div
                    key={partner.id}
                    onClick={() => handlePartnerClick(partner.website_url)}
                    className={`group animate-slide-up ${partner.website_url ? 'cursor-pointer' : ''}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    role={partner.website_url ? "button" : "article"}
                    tabIndex={partner.website_url ? 0 : undefined}
                    aria-label={partner.website_url ? `Visiter le site de ${partnerName}` : partnerName}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && partner.website_url) {
                        handlePartnerClick(partner.website_url);
                      }
                    }}
                  >
                    {/* Card Container */}
                    <div className="relative bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                      
                      {/* Image Container */}
                      <div className="relative aspect-square p-6 bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
                        {partnerImage ? (
                          <img
                            src={partnerImage}
                            alt={`Logo ${partnerName}`}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              console.error("❌ Erreur chargement image:", partnerImage);
                              e.target.style.display = 'none';
                              e.target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Handshake className={`w-20 h-20 text-gray-300 mx-auto ${partnerImage ? 'hidden' : ''}`} 
                                   strokeWidth={2} />
                        
                        {/* Hover Overlay avec icône externe */}
                        {partner.website_url && (
                          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 bg-white rounded-full p-3 shadow-xl">
                              <ExternalLink className="w-6 h-6 text-[#FF8C00]" strokeWidth={2.5} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Partner Name */}
                      <div className="px-4 py-4 bg-white border-t-2 border-gray-100 group-hover:bg-gradient-to-r group-hover:from-orange-50/50 group-hover:to-yellow-50/50 transition-all duration-300">
                        <h3 className="text-center text-sm font-bold text-gray-900 truncate group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {partnerName}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA Section - Ultra Modern avec charte VIALI */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Background decoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50/30 to-orange-50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FFC107]/20 to-[#FF8C00]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#FF8C00]/20 to-[#FFC107]/20 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            
            {/* Icon avec gradient VIALI */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl mb-8 shadow-xl shadow-orange-500/30 animate-slide-up">
              <Handshake className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Title avec gradient */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("partner.cta_title")}
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("partner.cta_description")}
            </p>

            {/* CTA Button avec gradient VIALI */}
            <a
              href="/contacternous"
              className="group inline-flex items-center gap-3 px-8 py-4 
                       bg-gradient-to-r from-[#FFC107] to-[#FF8C00] 
                       text-white font-bold text-lg rounded-xl 
                       shadow-2xl shadow-orange-500/40 
                       hover:shadow-orange-500/60 hover:scale-105
                       transition-all duration-500 animate-slide-up"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.3s' }}
            >
              <span>{t("partner.cta_button")}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" 
                          strokeWidth={2.5} />
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Partner;