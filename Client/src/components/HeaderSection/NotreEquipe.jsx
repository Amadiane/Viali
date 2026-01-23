import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  AlertCircle,
  Loader2,
  Sparkles,
  Linkedin,
} from "lucide-react";
import CONFIG from "../../config/config.js";

const NotreEquipe = () => {
  const { t, i18n } = useTranslation();
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const normalizeUrl = (url) => {
      if (!url) return null;
      if (url.startsWith("http")) return url;
      if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
      return `${CONFIG.BASE_URL}/${url}`;
    };

    const fetchEquipe = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_TEAM_LIST);
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        const teamData = Array.isArray(data) ? data : data.results || [];
        
        const activeMembres = teamData.filter(membre => membre.is_active === true);
        
        const normalized = activeMembres.map((m) => ({
          ...m,
          photo_url: normalizeUrl(m.photo_url || m.photo),
        }));
        
        setMembres(normalized);
      } catch (err) {
        console.error("Erreur API Équipe:", err);
        setError(err.message || "Une erreur est survenue lors du chargement de l'équipe");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-gray-600 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("team.loading")}
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
          50% { transform: translateY(-5px); }
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
                {t("team.badge_text")}
              </span>
            </div>

            {/* Titre principal avec gradient VIALI */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("team.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("team.subtitle")}
            </p>
          </div>

          {/* Ligne séparatrice stylée avec gradient animé */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-20">
          
          {membres.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
                <Users className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("team.no_members")}
              </h3>
              <p className="text-gray-600 text-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                L'équipe sera bientôt disponible
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Ligne 1: 5 personnes */}
              {membres.slice(0, 5).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {membres.slice(0, 5).map((membre, idx) => (
                    <article
                      key={membre.id}
                      className="group animate-slide-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="relative mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 border-2 border-gray-100 hover:border-orange-200">
                        <img
                          src={
                            membre.photo_url ||
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                          }
                          alt={membre.full_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                          }
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* LinkedIn badge - Apparaît au hover */}
                        {membre.linkedin && (
                          <a
                            href={membre.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <Linkedin className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                          </a>
                        )}
                      </div>

                      <div className="text-center">
                        <h3 className="text-base md:text-lg font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {membre.full_name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 font-semibold"
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Ligne 2: 3 personnes (membres 6-8) - Plus grandes */}
              {membres.slice(5, 8).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {membres.slice(5, 8).map((membre, idx) => (
                    <article
                      key={membre.id}
                      className="group animate-slide-up"
                      style={{ animationDelay: `${(idx + 5) * 0.1}s` }}
                    >
                      <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 aspect-[3/4] shadow-xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 border-2 border-gray-100 hover:border-orange-200">
                        <img
                          src={
                            membre.photo_url ||
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                          }
                          alt={membre.full_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                          }
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {membre.linkedin && (
                          <a
                            href={membre.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <Linkedin className="w-6 h-6 text-[#FF8C00]" strokeWidth={2.5} />
                          </a>
                        )}
                      </div>

                      <div className="text-center">
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {membre.full_name}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 font-semibold"
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Ligne 3: Membres supplémentaires */}
              {membres.slice(8).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {membres.slice(8).map((membre, idx) => (
                    <article
                      key={membre.id}
                      className="group animate-slide-up"
                      style={{ animationDelay: `${(idx + 8) * 0.1}s` }}
                    >
                      <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-yellow-50 aspect-[3/4] shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 border-2 border-gray-100 hover:border-orange-200">
                        <img
                          src={
                            membre.photo_url ||
                            "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"
                          }
                          alt={membre.full_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src =
                              "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo")
                          }
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {membre.linkedin && (
                          <a
                            href={membre.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <Linkedin className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                          </a>
                        )}
                      </div>

                      <div className="text-center">
                        <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {membre.full_name}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 font-semibold"
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default NotreEquipe;