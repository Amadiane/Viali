import React, { useEffect, useState } from "react";
import { Handshake, Zap, Sparkles, Award, ExternalLink, Building2, TrendingUp, AlertCircle } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

// 🎨 Centralisation des couleurs VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
};

// 🎯 Composants réutilisables
const GradientIcon = ({ icon: Icon, size = "md", animate = false }) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16 md:w-20 md:h-20",
    lg: "w-20 h-20 md:w-24 md:h-24",
  };
  
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8 md:w-10 md:h-10",
    lg: "w-10 h-10 md:w-12 md:h-12",
  };

  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r from-[${COLORS.gradientStart}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientEnd}] blur-2xl opacity-40 ${animate ? 'animate-pulse' : ''}`}></div>
        <div className={`relative ${sizes[size]} bg-gradient-to-br from-[${COLORS.gradientStart}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientEnd}] rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-400/50 transform hover:scale-105 transition-transform duration-300`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
    </div>
  );
};

const GradientText = ({ children, className = "" }) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[${COLORS.gradientEnd}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientStart}] ${className}`}>
    {children}
  </span>
);

const GradientBadge = ({ icon: Icon, text }) => (
  <div className="px-4 py-2.5 md:px-6 md:py-3 bg-white/90 backdrop-blur-md rounded-full border-2 border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#F47920]" />
      <span className="font-bold text-sm md:text-base text-gray-700">{text}</span>
    </div>
  </div>
);

const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-16 md:py-20">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-700 text-base md:text-lg mt-6 font-semibold">{text}</span>
  </div>
);

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
        
        // ✅ FILTRER uniquement les partenaires actifs (comme dans Actualites.jsx)
        const activePartners = partnerData.filter(
          partner => partner.is_active === true || partner.isActive === true
        );
        
        console.log(`📊 Partenaires totaux: ${partnerData.length}, Actifs: ${activePartners.length}`);
        
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Effets décoratifs optimisés */}
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#E84E1B]/20 to-[#FDB71A]/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-6">
              <GradientIcon icon={Handshake} size="lg" animate />
            </div>

            {/* Title */}
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <GradientText>{t("partner.title")}</GradientText>
            </h1>

            {/* Subtitle avec meilleur contraste */}
            <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed font-medium mb-8">
              {t("partner.subtitle.part1")}{" "}
              <GradientText className="font-black">
                {t("partner.subtitle.club")}
              </GradientText>{" "}
              {t("partner.subtitle.part2")}
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <GradientBadge icon={Building2} text={`${partners.length || '50+'} Partenaires`} />
              <GradientBadge icon={TrendingUp} text="Croissance Continue" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
        aria-labelledby="partners-title"
      >
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full mb-4 border border-orange-200">
            <Sparkles className="w-4 h-4 text-[#F47920]" />
            <span className="text-xs md:text-sm font-bold text-gray-700">
              {t("partner.section_subtitle")}
            </span>
            <Sparkles className="w-4 h-4 text-[#F47920]" />
          </div>
          
          <h2 id="partners-title" className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">
            <GradientText>{t("partner.section_title")}</GradientText>
          </h2>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text={t("partner.loading")} />}

        {/* Error State */}
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
                aria-label="Réessayer le chargement"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && partners.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-200">
                <Handshake className="w-10 h-10 md:w-12 md:h-12 text-[#F47920]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t("partner.no_partners_title")}
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                {t("partner.no_partners_text")}
              </p>
            </div>
          </div>
        )}

        {/* Partners Grid - Animations simplifiées pour performance */}
        {!loading && !error && partners.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className="group cursor-pointer"
                onClick={() => partner.website_url && window.open(partner.website_url, "_blank", "noopener,noreferrer")}
                role="button"
                tabIndex={0}
                aria-label={`Visiter le site de ${partner.display_name}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && partner.website_url) {
                    window.open(partner.website_url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-xl">
                  {/* Image Container */}
                  <div className="relative aspect-square p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300">
                    <img
                      src={partner.cover_image_url || "/placeholder.png"}
                      alt={`Logo de ${partner.display_name}, partenaire officiel`}
                      className="relative w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Hover overlay simplifié */}
                    {partner.website_url && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#F47920]/90 via-[#F47920]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 md:pb-4">
                        <div className="flex items-center gap-1.5 text-white font-bold text-xs md:text-sm">
                          <span>Visiter</span>
                          <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Partner Name */}
                  <div className="px-3 py-2.5 md:px-4 md:py-3 bg-gradient-to-r from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300 border-t border-gray-100">
                    <h3 className="text-center text-gray-800 font-bold text-xs sm:text-sm truncate group-hover:text-[#F47920] transition-colors">
                      {partner.display_name}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section 
        className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden"
        aria-labelledby="cta-title"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A]/5 via-[#F47920]/5 to-[#E84E1B]/5"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border-2 border-orange-200 overflow-hidden">
              {/* Decorative gradients optimisés */}
              <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-[#E84E1B]/20 to-[#FDB71A]/20 rounded-full blur-3xl"></div>

              <div className="relative text-center">
                {/* Icon */}
                <div className="mb-6">
                  <GradientIcon icon={Award} size="md" />
                </div>

                {/* Title */}
                <h2 id="cta-title" className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6">
                  <GradientText>{t("partner.cta_title")}</GradientText>
                </h2>

                {/* Description avec meilleur contraste */}
                <p className="text-base md:text-lg lg:text-xl text-gray-800 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                  {t("partner.cta_text.part1")}{" "}
                  <GradientText className="font-black">
                    {t("partner.cta_text.club")}
                  </GradientText>{" "}
                  {t("partner.cta_text.part2")}
                </p>

                {/* CTA Button avec animation simplifiée */}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="group relative inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-xl font-bold text-base md:text-lg shadow-xl shadow-orange-400/40 text-white hover:shadow-2xl hover:shadow-orange-400/50 transition-shadow duration-300"
                  aria-label={t("partner.cta_button")}
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{t("partner.cta_button")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;