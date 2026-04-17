import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, AlertCircle, Award, Crosshair, Sparkles, Zap, TrendingUp } from "lucide-react";
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

  // Smart content parser - extracts [LEFT] and [RIGHT] sections
  const parseContent = (content) => {
    if (!content) return { left: "", items: [] };

    const parts = content.split(/\[RIGHT\]/i);
    const leftContent = parts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
    const rightContent = parts[1]?.replace(/\[RIGHT\]/i, "").trim() || "";

    // Parse right content into items (separated by double newline)
    const items = rightContent
      .split(/\n\n+/)
      .map((block) => block.trim())
      .filter((block) => block.length > 5)
      .map((block) => {
        // Split each block into lines
        const lines = block.split(/\n/).map(l => l.trim()).filter(l => l);
        
        if (lines.length === 0) return null;
        
        // First line is the title, rest is description
        const title = lines[0];
        const description = lines.slice(1).join(" ");
        
        return { title, description };
      })
      .filter(item => item !== null);

    return { left: leftContent, items };
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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

        .mission-card {
          position: relative;
          overflow: hidden;
        }

        .mission-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.1), transparent);
          transition: left 0.5s;
        }

        .mission-card:hover::before {
          left: 100%;
        }

        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-yellow-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-100/30 to-yellow-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-[1200px] mx-auto px-6 text-center">
            
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 
                          bg-white/80 backdrop-blur-md
                          border-2 border-orange-200 rounded-full mb-8 shadow-lg animate-slide-up">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-gray-800"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("missions.badge_text") || "Notre Vision"}
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("missions.title") || "Nos Missions"}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("missions.subtitle") || "Découvrez nos valeurs fondamentales et notre engagement pour l'excellence"}
            </p>
          </div>

          {/* Ligne séparatrice */}
          <div className="max-w-[1200px] mx-auto px-6 mt-16">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">
          
          {missions.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
                <Target className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("missions.empty") || "Aucune mission disponible"}
              </h3>
              <p className="text-gray-600 text-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("missions.empty_desc") || "Revenez bientôt pour découvrir nos missions"}
              </p>
            </div>
          ) : (
            <div className="space-y-32">
              {missions.map((mission, missionIndex) => {
                const title = mission[`title_${i18n.language}`] || mission.title_fr || mission.title_en || "";
                
                // Parse content using smart parser
                const contentValeur = mission[`content_valeur_${i18n.language}`] || mission.content_valeur_fr || "";
                const contentMission = mission[`content_mission_${i18n.language}`] || mission.content_mission_fr || "";
                
                const valeurData = parseContent(contentValeur);
                const missionData = parseContent(contentMission);

                return (
                  <article key={mission.id} className="animate-slide-up" 
                          style={{ animationDelay: `${missionIndex * 0.1}s` }}>
                    
                    {/* Image de la mission */}
                    {mission.image_url && (
                      <div className="mb-20 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 via-yellow-400/20 to-orange-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100 group-hover:border-orange-200 transition-all duration-500">
                          <img
                            src={mission.image_url}
                            alt={title}
                            className="w-full h-[400px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                      </div>
                    )}

                    {/* Cards Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                      
                      {/* CARD VALEUR */}
                      {(valeurData.left || valeurData.items.length > 0) && (
                        <div className="mission-card group/card">
                          <div className="relative bg-gradient-to-br from-white via-orange-50/30 to-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-orange-300 h-full flex flex-col overflow-hidden">
                            
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
                            
                            {/* Header Valeur */}
                            <div className="relative flex items-start gap-4 mb-8">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl blur opacity-50"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg floating-icon">
                                  <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  {t("missions.values") || "Nos Valeurs"}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-transparent rounded-full"></div>
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider"
                                     style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Excellence
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Contenu Valeur */}
                            <div className="relative flex-1 space-y-8">
                              {valeurData.left && (
                                <div className="relative group/quote">
                                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFC107] via-[#FF8C00] to-[#FFC107] rounded-full"></div>
                                  <div className="pl-6 pr-2">
                                    <p className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                      {valeurData.left}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {valeurData.items.length > 0 && (
                                <div className="space-y-5">
                                  {valeurData.items.map((item, idx) => (
                                    <div key={idx} className="group/item p-4 rounded-xl hover:bg-orange-50/70 transition-all duration-300 border border-transparent hover:border-orange-100">
                                      <div className="flex gap-3 items-start">
                                        <div className="flex-shrink-0 mt-1.5">
                                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00] shadow-sm"></div>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-900 font-black text-base mb-2"
                                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            {item.title}
                                          </p>
                                          {item.description && (
                                            <p className="text-gray-600 text-sm leading-relaxed"
                                               style={{ fontFamily: "'Inter', sans-serif" }}>
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Footer badge */}
                            <div className="mt-6 pt-6 border-t border-orange-100">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Excellence
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CARD MISSION */}
                      {(missionData.left || missionData.items.length > 0) && (
                        <div className="mission-card group/card">
                          <div className="relative bg-gradient-to-br from-white via-yellow-50/30 to-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-yellow-300 h-full flex flex-col overflow-hidden">
                            
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-bl-full"></div>
                            
                            {/* Header Mission */}
                            <div className="relative flex items-start gap-4 mb-8">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-2xl blur opacity-50"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-2xl flex items-center justify-center shadow-lg floating-icon" style={{ animationDelay: '0.2s' }}>
                                  <Crosshair className="w-8 h-8 text-white" strokeWidth={2.5} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  {t("missions.mission") || "Notre Mission"}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider"
                                     style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Impact
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Contenu Mission */}
                            <div className="relative flex-1 space-y-8">
                              {missionData.left && (
                                <div className="relative group/quote">
                                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF8C00] via-[#FFC107] to-[#FF8C00] rounded-full"></div>
                                  <div className="pl-6 pr-2">
                                    <p className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed"
                                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                      {missionData.left}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {missionData.items.length > 0 && (
                                <div className="space-y-5">
                                  {missionData.items.map((item, idx) => (
                                    <div key={idx} className="group/item p-4 rounded-xl hover:bg-yellow-50/70 transition-all duration-300 border border-transparent hover:border-yellow-100">
                                      <div className="flex gap-3 items-start">
                                        <div className="flex-shrink-0 mt-1.5">
                                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FFC107] shadow-sm"></div>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-900 font-black text-base mb-2"
                                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            {item.title}
                                          </p>
                                          {item.description && (
                                            <p className="text-gray-600 text-sm leading-relaxed"
                                               style={{ fontFamily: "'Inter', sans-serif" }}>
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Footer badge */}
                            <div className="mt-6 pt-6 border-t border-yellow-100">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-600" strokeWidth={2.5} />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Impact
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Séparateur entre missions */}
                    {missionIndex < missions.length - 1 && (
                      <div className="mt-20 pt-8">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
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