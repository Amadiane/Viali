import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart, Shield, Star, Zap, CheckCircle, ArrowRight, Sparkles, Calendar, Award,
} from "lucide-react";
import CONFIG from "../../config/config.js";

const NosValeurs = () => {
  const { t, i18n } = useTranslation();
  const [valeur, setValeur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchValeur = async () => {
      try {
        const response = await fetch(`${CONFIG.API_VALEUR_LIST}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des valeurs");
        
        const data = await response.json();
        const valeurs = data.results || data;

        console.log("📦 Données valeurs reçues :", valeurs);

        if (Array.isArray(valeurs) && valeurs.length > 0) {
          const v = valeurs[0];

          // ✅ Normaliser l'URL image
          const normalizeUrl = (url) => {
            if (!url) return null;
            if (url.startsWith("http")) return url;
            if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
            return `${CONFIG.BASE_URL}/${url}`;
          };

          setValeur({
            ...v,
            image_url: normalizeUrl(v.image_url || v.image),
          });
        } else {
          setValeur(null);
        }
      } catch (err) {
        console.error("Erreur NosValeurs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchValeur();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-semibold">{t("values.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border-2 border-red-500/50 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-red-500" />
            <p className="font-bold text-xl">{t("values.error")}</p>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!valeur) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-orange-500/30 px-8 max-w-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Heart className="w-12 h-12 text-orange-400" />
          </div>
          <p className="text-white text-2xl font-bold mb-2">{t("values.empty")}</p>
          <p className="text-gray-400 text-lg">{t("values.empty_desc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] w-full">
      {/* Effets de fond lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Compact */}
      <div className="relative pt-40 pb-12 text-center w-full">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-orange-500/30 to-blue-500/30 blur-3xl scale-150 animate-pulse"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full mb-4 shadow-2xl shadow-orange-500/50">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3 tracking-tight">
              {t("values.title")}
            </h1>
            
            <div className="relative w-24 h-1 mx-auto mt-4 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Valeur Principale - Grand Format */}
      <div className="relative w-full flex items-center justify-center pb-16">
        <div className="w-[95%] lg:w-[90%] xl:w-[85%] max-w-7xl">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
            
            {/* Card principale */}
            <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl">
              
              {/* Image Hero en grand */}
              <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
                {valeur.image_url ? (
                  <img
                    src={valeur.image_url}
                    alt={valeur[`title_${i18n.language}`] || valeur.title_fr}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/1920x1080/1a1a2e/ffffff?text=Nos+Valeurs")
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-32 h-32 text-orange-400/30" />
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-[#0f1729]/80 to-transparent"></div>
                
                {/* Badge date flottant */}
                {valeur.created_at && (
                  <div className="absolute top-6 right-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/50 blur-xl rounded-2xl"></div>
                      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-3 rounded-2xl shadow-2xl border-2 border-blue-400/50">
                        <div className="flex items-center gap-3 text-white">
                          <Calendar className="w-5 h-5" />
                          <div>
                            <p className="text-xs opacity-80 uppercase tracking-wide">{t("values.published")}</p>
                            <p className="text-sm font-black">
                              {new Date(valeur.created_at).toLocaleDateString(i18n.language, { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Titre superposé sur l'image */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-5xl">
                    <div className="inline-flex items-center gap-3 mb-4 bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 px-4 py-2 rounded-full">
                      <Award className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300 text-sm font-bold uppercase tracking-wide">
                        {t("values.our_core")}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                      {valeur[`title_${i18n.language}`] || valeur.title_fr}
                    </h2>
                    
                    <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 via-blue-500 to-transparent rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Contenu détaillé */}
              <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-5xl mx-auto">
                  
                  {/* Citation ou intro */}
                  <div className="relative mb-12">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-blue-500 rounded-full"></div>
                    <blockquote className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-semibold leading-relaxed italic pl-8">
                      {valeur[`description_${i18n.language}`] || valeur.description_fr}
                    </blockquote>
                  </div>

                  {/* Stats ou points clés */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="relative group/stat">
                      <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/5 backdrop-blur-sm border-2 border-orange-500/30 rounded-2xl p-6 text-center hover:border-orange-500/60 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Heart className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-3xl font-black text-white mb-2">100%</p>
                        <p className="text-gray-400 font-semibold text-sm uppercase tracking-wide">{t("values.respect")}</p>
                      </div>
                    </div>

                    <div className="relative group/stat">
                      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/5 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-6 text-center hover:border-blue-500/60 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Shield className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-3xl font-black text-white mb-2">1er</p>
                        <p className="text-gray-400 font-semibold text-sm uppercase tracking-wide">{t("values.integrity")}</p>
                      </div>
                    </div>

                    <div className="relative group/stat">
                      <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/5 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-6 text-center hover:border-purple-500/60 transition-all">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Star className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-3xl font-black text-white mb-2">∞</p>
                        <p className="text-gray-400 font-semibold text-sm uppercase tracking-wide">{t("values.excellence")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Principes clés */}
                  <div className="mb-12">
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-orange-400" />
                      {t("values.key_principles")}
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        t("values.principle_1"),
                        t("values.principle_2"),
                        t("values.principle_3"),
                        t("values.principle_4")
                      ].map((principle, index) => (
                        <div key={index} className="flex items-start gap-4 group/item">
                          <div className="relative flex-shrink-0 mt-1">
                            <div className="absolute inset-0 bg-orange-500/30 blur-lg rounded-full group-hover/item:bg-orange-500/50 transition-all"></div>
                            <div className="relative w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <p className="text-gray-300 text-lg leading-relaxed flex-1 group-hover/item:text-white transition-colors">
                            {principle}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-orange-500/10 to-blue-500/10 backdrop-blur-sm border-2 border-orange-500/30 rounded-2xl p-8 text-center">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                        {t("values.cta_title")}
                      </h3>
                      <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                        {t("values.cta_text")}
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-4">
                        <a
                          href="/contacter-tamkine"
                          className="relative group/btn overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                          <div className="relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-lg shadow-2xl border-2 border-orange-400/50 group-hover/btn:scale-105 transition-transform text-white">
                            <span>{t("values.contact_us")}</span>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </a>
                        
                        <a
                          href="/community"
                          className="relative group/btn overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/10 blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                          <div className="relative px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-orange-500/50 rounded-xl font-bold text-lg hover:bg-white/20 group-hover/btn:scale-105 transition-all text-white">
                            {t("values.join_us")}
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NosValeurs;