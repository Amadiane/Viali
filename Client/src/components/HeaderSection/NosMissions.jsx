import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, AlertCircle, Award, Crosshair, Sparkles } from "lucide-react";
import CONFIG from "../../config/config.js";

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

const NosMissions = () => {
  const { t, i18n } = useTranslation();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
    return `${CONFIG.BASE_URL}/${url}`;
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_MISSION_LIST);

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const missionData = Array.isArray(data) ? data : data.results || [];

        const activeMissions = missionData.filter(
          (mission) => mission.is_active === true || mission.isActive === true
        );

        const normalized = activeMissions.map((m) => ({
          ...m,
          image_url: normalizeUrl(m.image_url || m.image),
        }));

        setMissions(normalized);
      } catch (err) {
        console.error("Erreur API Missions:", err);
        setError(
          err.message ||
            "Une erreur est survenue lors du chargement des missions"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

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
                {t("missions.badge_text")}
              </span>
            </div>

            {/* Titre principal avec gradient VIALI */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("missions.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("missions.subtitle")}
            </p>
          </div>

          {/* Ligne séparatrice stylée avec gradient animé */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-20">
          
          {missions.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
                <Target className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("missions.empty")}
              </h3>
              <p className="text-gray-600 text-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("missions.empty_desc")}
              </p>
            </div>
          ) : (
            <div className="space-y-32">
              {missions.map((mission, missionIndex) => {
                const title = mission[`title_${i18n.language}`] || mission.title_fr || mission.title_en || "";
                const contentValeur = mission[`content_valeur_${i18n.language}`] || mission.content_valeur_fr || "";
                const contentMission = mission[`content_mission_${i18n.language}`] || mission.content_mission_fr || "";

                const valeurParts = contentValeur.split(/\[RIGHT\]/i);
                const valeurLeft = valeurParts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
                const valeurRight = valeurParts[1]?.trim() || "";
                const valeurRightItems = valeurRight
                  .split(/\n+/)
                  .map((line) => line.trim())
                  .filter((line) => line.length > 2);

                const missionParts = contentMission.split(/\[RIGHT\]/i);
                const missionLeft = missionParts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
                const missionRight = missionParts[1]?.trim() || "";
                const missionRightItems = missionRight
                  .split(/\n+/)
                  .map((line) => line.trim())
                  .filter((line) => line.length > 2);

                return (
                  <article key={mission.id} className="group animate-slide-up" 
                          style={{ animationDelay: `${missionIndex * 0.1}s` }}>
                    
                    {/* Titre de la mission avec gradient */}
                    {title && (
                      <div className="mb-12 text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {title}
                        </h2>
                      </div>
                    )}

                    {/* Image de la mission */}
                    {mission.image_url && (
                      <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100">
                        <img
                          src={mission.image_url}
                          alt={title}
                          className="w-full h-[400px] md:h-[600px] object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-24">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* CARD VALEUR */}
                        {(valeurLeft || valeurRightItems.length > 0) && (
                          <div className="group/card">
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-orange-200 h-full flex flex-col">
                              
                              {/* Header Valeur */}
                              <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                  <Award className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1"
                                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {t("missions.values")}
                                  </h3>
                                  <p className="text-sm text-gray-500 font-semibold"
                                     style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {t("missions.values_desc")}
                                  </p>
                                </div>
                              </div>

                              {/* Contenu Valeur */}
                              <div className="flex-1 space-y-8">
                                {valeurLeft && (
                                  <div className="relative pl-6">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFC107] to-[#FF8C00] rounded-full"></div>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                      {valeurLeft}
                                    </p>
                                  </div>
                                )}

                                {valeurRightItems.length > 0 && (
                                  <div className="space-y-4">
                                    {valeurRightItems.map((item, idx) => {
                                      const words = item.trim().split(" ");
                                      const boldWords = words.slice(0, 2).join(" ");
                                      const restOfText = words.slice(2).join(" ");

                                      return (
                                        <div key={idx} className="flex gap-4 items-start group/item">
                                          <div className="flex-shrink-0 mt-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00] shadow-sm"></div>
                                          </div>
                                          <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1"
                                             style={{ fontFamily: "'Inter', sans-serif" }}>
                                            <span className="font-bold text-gray-900">
                                              {boldWords}
                                            </span>
                                            {restOfText && ` ${restOfText}`}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CARD MISSION */}
                        {(missionLeft || missionRightItems.length > 0) && (
                          <div className="group/card">
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-orange-200 h-full flex flex-col">
                              
                              {/* Header Mission */}
                              <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                  <Crosshair className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1"
                                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {t("missions.mission")}
                                  </h3>
                                  <p className="text-sm text-gray-500 font-semibold"
                                     style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {t("missions.mission_desc")}
                                  </p>
                                </div>
                              </div>

                              {/* Contenu Mission */}
                              <div className="flex-1 space-y-8">
                                {missionLeft && (
                                  <div className="relative pl-6">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF8C00] to-[#FFC107] rounded-full"></div>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                      {missionLeft}
                                    </p>
                                  </div>
                                )}

                                {missionRightItems.length > 0 && (
                                  <div className="space-y-4">
                                    {missionRightItems.map((item, idx) => {
                                      const words = item.trim().split(" ");
                                      const boldWords = words.slice(0, 2).join(" ");
                                      const restOfText = words.slice(2).join(" ");

                                      return (
                                        <div key={idx} className="flex gap-4 items-start group/item">
                                          <div className="flex-shrink-0 mt-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FFC107] shadow-sm"></div>
                                          </div>
                                          <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1"
                                             style={{ fontFamily: "'Inter', sans-serif" }}>
                                            <span className="font-bold text-gray-900">
                                              {boldWords}
                                            </span>
                                            {restOfText && ` ${restOfText}`}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Séparateur entre missions */}
                    {missionIndex < missions.length - 1 && (
                      <div className="mt-24 pt-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full"></div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default NosMissions;