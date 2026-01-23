import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Loader2,
  X,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import CONFIG from "../../config/config.js";

const Actualites = () => {
  const { t, i18n } = useTranslation();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_NEWS_LIST);
        if (!response.ok) throw new Error("Erreur HTTP : " + response.status);

        const data = await response.json();
        
        const activeNews = data.filter(item => item.is_active === true || item.isActive === true);
        
        const sorted = activeNews.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNewsList(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getLocalizedField = (item, base) => {
    const lang = i18n.language;
    return item[`${base}_${lang}`] || item[`${base}_fr`] || item[base] || "";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getReadTime = (content) => {
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-gray-600 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("news.loading")}
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
            <X className="w-10 h-10 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("news.errorTitle")}
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {t("news.retry")}
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
        
        {/* Hero Section - Style Contact */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("news.badge_text")}
              </span>
            </div>

            {/* Titre principal avec gradient VIALI */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("news.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("news.subtitle")}
            </p>
          </div>

          {/* Ligne séparatrice stylée avec gradient animé */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 md:py-12">
          {newsList.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
                <Sparkles className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("news.noNews")}
              </h3>
              <p className="text-gray-600 text-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("news.noNewsDesc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((item, index) => {
                const title = getLocalizedField(item, "title");
                const content = getLocalizedField(item, "content");
                const isHero = index === 0;
                const excerpt = content.slice(0, isHero ? 180 : 120) + "...";

                return (
                  <article
                    key={item.id}
                    className={`group cursor-pointer animate-slide-up ${
                      isHero ? "md:col-span-2 lg:col-span-2" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 border-2 hover:-translate-y-2 flex flex-col h-full ${
                      isHero 
                        ? "shadow-2xl hover:shadow-orange-500/40 border-orange-200 hover:border-[#FF8C00]" 
                        : "shadow-lg hover:shadow-xl border-gray-100 hover:border-orange-200"
                    }`}>
                      
                      {/* Image */}
                      {item.image_url && (
                        <div className={`relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 flex-shrink-0 ${
                          isHero ? "h-80 md:h-96" : "h-64"
                        }`}>
                          <img
                            src={item.image_url}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Hero Badge avec gradient VIALI */}
                          {isHero && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              {t("news.featured")}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className={`flex flex-col flex-grow ${isHero ? "p-6 md:p-8" : "p-5"}`}>
                        
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-shrink-0"
                             style={{ fontFamily: "'Inter', sans-serif" }}>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                            <time>{formatDate(item.created_at)}</time>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                            <span>{getReadTime(content)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className={`font-black text-gray-900 mb-3 group-hover:text-[#FF8C00] transition-colors duration-300 leading-tight ${
                          isHero ? "text-2xl md:text-3xl lg:text-4xl line-clamp-3" : "text-lg md:text-xl line-clamp-2"
                        }`}
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {title}
                        </h3>

                        {/* Excerpt */}
                        <p className={`text-gray-600 leading-relaxed mb-4 flex-grow ${
                          isHero ? "text-base md:text-lg line-clamp-4" : "text-sm line-clamp-3"
                        }`}
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {excerpt}
                        </p>

                        {/* Read More */}
                        <div className={`flex items-center text-[#FF8C00] font-bold group/btn flex-shrink-0 ${
                          isHero ? "text-base md:text-lg" : "text-sm"
                        }`}
                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          <span>{t("news.readMore")}</span>
                          <ArrowRight className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-2 transition-transform duration-300" 
                                      strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal - Modern Full Screen */}
        {selectedNews && (
          <div
            className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in fade-in duration-300"
            onClick={() => setSelectedNews(null)}
          >
            {/* Close Button avec gradient VIALI */}
            <button
              className="fixed top-8 right-8 w-14 h-14 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] hover:scale-110 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl z-50"
              onClick={() => setSelectedNews(null)}
              aria-label={t("news.close")}
            >
              <X size={24} className="text-white" strokeWidth={2.5} />
            </button>

            <div
              className="max-w-4xl mx-auto px-6 lg:px-12 py-24 md:py-32"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6"
                   style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                  <time>{formatDate(selectedNews.created_at)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                  <span>{getReadTime(getLocalizedField(selectedNews, "content"))}</span>
                </div>
              </div>

              {/* Title avec gradient */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight gradient-text"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {getLocalizedField(selectedNews, "title")}
              </h1>

              {/* Image */}
              {selectedNews.image_url && (
                <div className="relative w-full h-[400px] md:h-[600px] mb-12 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-2xl">
                  <img
                    src={selectedNews.image_url}
                    alt={getLocalizedField(selectedNews, "title")}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-xl max-w-none">
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap"
                   style={{ fontFamily: "'Inter', sans-serif" }}>
                  {getLocalizedField(selectedNews, "content")}
                </p>
              </div>

              {/* Back Button avec gradient VIALI */}
              <button
                onClick={() => setSelectedNews(null)}
                className="mt-16 px-8 py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 inline-flex items-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                ← {t("news.close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Actualites;