import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Target, AlertCircle, Award, Crosshair } from "lucide-react";
import CONFIG from "../../config/config.js";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement...</span>
  </div>
);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Titre centré avec ligne visible */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <div className="text-center">
            {/* Titre et icône centrés */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-2xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight">
                {t("missions.title", "NOS MISSIONS")}
              </h1>
            </div>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-500 font-light">
              {t("missions.subtitle", "Vision, Valeurs & Objectifs")}
            </p>
          </div>
        </div>
        
        {/* Ligne de séparation horizontale bien visible */}
        <div className="w-full">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full shadow-sm"></div>
          </div>
        </div>
      </section>

      {/* Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-20">
        
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-red-50 rounded-2xl p-12 border border-red-100">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && missions.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t("missions.empty", "Aucune mission trouvée")}
              </h3>
              <p className="text-gray-600">
                {t(
                  "missions.empty_desc",
                  "Revenez bientôt pour découvrir nos nouvelles missions"
                )}
              </p>
            </div>
          </div>
        )}

        {/* Liste des Missions */}
        {!loading && !error && missions.length > 0 && (
          <div className="space-y-32">
            {missions.map((mission, missionIndex) => {
              const title = mission[`title_${i18n.language}`] || mission.title_fr || mission.title_en || "";
              const contentValeur = mission[`content_valeur_${i18n.language}`] || mission.content_valeur_fr || "";
              const contentMission = mission[`content_mission_${i18n.language}`] || mission.content_mission_fr || "";

              // Traiter le contenu VALEUR
              const valeurParts = contentValeur.split(/\[RIGHT\]/i);
              const valeurLeft = valeurParts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
              const valeurRight = valeurParts[1]?.trim() || "";
              const valeurRightItems = valeurRight
                .split(/\n+/)
                .map((line) => line.trim())
                .filter((line) => line.length > 2);

              // Traiter le contenu MISSION
              const missionParts = contentMission.split(/\[RIGHT\]/i);
              const missionLeft = missionParts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
              const missionRight = missionParts[1]?.trim() || "";
              const missionRightItems = missionRight
                .split(/\n+/)
                .map((line) => line.trim())
                .filter((line) => line.length > 2);

              return (
                <article key={mission.id} className="group">
                  {/* Titre principal de la mission */}
                  {title && (
                    <div className="mb-12 text-center">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B]">
                        {title}
                      </h2>
                    </div>
                  )}

                  {/* Image de la mission */}
                  {mission.image_url && (
                    <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={mission.image_url}
                        alt={title}
                        className="w-full h-[400px] md:h-[600px] object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-24">
                    {/* Layout côte à côte - Desktop, Stack - Mobile */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* CARD VALEUR - Gauche */}
                      {(valeurLeft || valeurRightItems.length > 0) && (
                        <div className="group relative">
                          {/* Gradient border effect on hover */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
                          
                          <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent h-full flex flex-col">
                            {/* Header Valeur */}
                            <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-200">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#F9A825] rounded-xl blur opacity-50"></div>
                                <div className="relative w-14 h-14 bg-gradient-to-br from-[#FDB71A] to-[#F9A825] rounded-xl flex items-center justify-center shadow-lg">
                                  <Award className="w-7 h-7 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                                  {t("missions.values", "NOS VALEURS")}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                  {t("missions.values_desc", "Ce qui nous guide")}
                                </p>
                              </div>
                            </div>

                            {/* Contenu Valeur */}
                            <div className="flex-1 space-y-8">
                              {/* Texte principal */}
                              {valeurLeft && (
                                <div className="relative">
                                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FDB71A] to-[#F9A825] rounded-full"></div>
                                  <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed pl-6">
                                    {valeurLeft}
                                  </p>
                                </div>
                              )}

                              {/* Liste à puces */}
                              {valeurRightItems.length > 0 && (
                                <div className="space-y-4">
                                  {valeurRightItems.map((item, idx) => {
                                    const words = item.trim().split(" ");
                                    const boldWords = words.slice(0, 2).join(" ");
                                    const restOfText = words.slice(2).join(" ");

                                    return (
                                      <div key={idx} className="flex gap-4 items-start group/item">
                                        <div className="flex-shrink-0 mt-1.5">
                                          <div className="relative">
                                            <div className="absolute inset-0 bg-[#FDB71A] rounded-full blur-sm opacity-50 group-hover/item:opacity-100 transition-opacity"></div>
                                            <div className="relative w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FDB71A] to-[#F9A825] shadow-sm"></div>
                                          </div>
                                        </div>
                                        <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1">
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

                            {/* Decorative corner */}
                            <div className="absolute bottom-8 right-8 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Award className="w-full h-full text-[#FDB71A]" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CARD MISSION - Droite */}
                      {(missionLeft || missionRightItems.length > 0) && (
                        <div className="group relative">
                          {/* Gradient border effect on hover */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F47920] via-[#E84E1B] to-[#D94419] rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
                          
                          <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent h-full flex flex-col">
                            {/* Header Mission */}
                            <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-200">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#F47920] to-[#E84E1B] rounded-xl blur opacity-50"></div>
                                <div className="relative w-14 h-14 bg-gradient-to-br from-[#F47920] to-[#E84E1B] rounded-xl flex items-center justify-center shadow-lg">
                                  <Crosshair className="w-7 h-7 text-white" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                                  {t("missions.mission", "NOTRE MISSION")}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                  {t("missions.mission_desc", "Notre raison d'être")}
                                </p>
                              </div>
                            </div>

                            {/* Contenu Mission */}
                            <div className="flex-1 space-y-8">
                              {/* Texte principal */}
                              {missionLeft && (
                                <div className="relative">
                                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F47920] to-[#E84E1B] rounded-full"></div>
                                  <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed pl-6">
                                    {missionLeft}
                                  </p>
                                </div>
                              )}

                              {/* Liste à puces */}
                              {missionRightItems.length > 0 && (
                                <div className="space-y-4">
                                  {missionRightItems.map((item, idx) => {
                                    const words = item.trim().split(" ");
                                    const boldWords = words.slice(0, 2).join(" ");
                                    const restOfText = words.slice(2).join(" ");

                                    return (
                                      <div key={idx} className="flex gap-4 items-start group/item">
                                        <div className="flex-shrink-0 mt-1.5">
                                          <div className="relative">
                                            <div className="absolute inset-0 bg-[#F47920] rounded-full blur-sm opacity-50 group-hover/item:opacity-100 transition-opacity"></div>
                                            <div className="relative w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#F47920] to-[#E84E1B] shadow-sm"></div>
                                          </div>
                                        </div>
                                        <p className="text-gray-700 text-base md:text-lg leading-relaxed flex-1">
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

                            {/* Decorative corner */}
                            <div className="absolute bottom-8 right-8 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
                              <Crosshair className="w-full h-full text-[#F47920]" />
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Séparateur entre missions */}
                  {missionIndex < missions.length - 1 && (
                    <div className="mt-24 pt-8">
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default NosMissions;