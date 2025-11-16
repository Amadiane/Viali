import React, { useEffect, useState } from "react";
import { Handshake, Zap, Sparkles, Award } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // ✅ Scroll vers le haut au chargement de la page
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(CONFIG.API_PARTNER_LIST);
        if (!response.ok) throw new Error("Erreur API");
        const data = await response.json();
        const partnerData = Array.isArray(data) ? data : data.results || [];
        setPartners(partnerData);
      } catch (error) {
        console.error("Erreur API partenaires:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden w-full">
      {/* Effets de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative pt-32 pb-16 text-center px-6 lg:px-20">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-orange-500/30 to-blue-500/30 blur-3xl scale-150 animate-pulse"></div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full mb-6 shadow-2xl shadow-orange-500/50 animate-pulse">
              <Handshake className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-4 tracking-tight">
              {t("partner.title")}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium mb-6">
              {t("partner.subtitle.part1")}{" "}
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
                {t("partner.subtitle.club")}
              </span>{" "}
              {t("partner.subtitle.part2")}
            </p>
          </div>
        </div>
      </div>

      {/* Section partenaires */}
      <div className="relative container mx-auto px-6 lg:px-20 pb-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3">
            {t("partner.section_title")}
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-semibold">{t("partner.section_subtitle")}</span>
            <Sparkles className="w-5 h-5 text-orange-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
            <span className="text-white text-lg mt-6 font-semibold">{t("partner.loading")}</span>
          </div>
        ) : partners.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-orange-500/30 px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Handshake className="w-12 h-12 text-orange-400" />
            </div>
            <p className="text-white text-2xl font-bold mb-2">{t("partner.no_partners_title")}</p>
            <p className="text-gray-400 text-lg">{t("partner.no_partners_text")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="relative group cursor-pointer"
                onClick={() => window.open(partner.website_url || '#', '_blank')}
              >
                <div className="relative bg-[#0f1729]/80 backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-orange-500/20 p-6">
                  <div className="relative w-full h-32 mb-4 flex items-center justify-center bg-white/5 rounded-xl">
                    <img
                      src={partner.cover_image_url || "/placeholder.png"}
                      alt={partner.name_en || partner.name_fr}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <h3 className="text-center text-white font-bold text-sm truncate">
                    {partner.name_en || partner.name_fr}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section CTA */}
      <div className="relative py-12 w-full">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-orange-500/30 rounded-3xl p-12 shadow-2xl">
            <div className="relative text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white">
                {t("partner.cta_title")}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
                {t("partner.cta_text.part1")}{" "}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
                  {t("partner.cta_text.club")}
                </span>{" "}
                {t("partner.cta_text.part2")}
              </p>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-lg shadow-2xl border-2 border-orange-400/50 text-white"
              >
                <Zap className="w-5 h-5 inline mr-2" />
                {t("partner.cta_button")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partner;
