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
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 0; }
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
        
        .whatsapp-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section - TAILLE RÉDUITE */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("news.badge_text")}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("news.title")}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("news.subtitle")}
            </p>
          </div>

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
                      
                      {item.image_url && (
                        <div className={`relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 flex-shrink-0 ${
                          isHero ? "h-80 md:h-96" : "h-64"
                        }`}>
                          <img
                            src={item.image_url}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {isHero && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              {t("news.featured")}
                            </div>
                          )}
                        </div>
                      )}

                      <div className={`flex flex-col flex-grow ${isHero ? "p-6 md:p-8" : "p-5"}`}>
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

                        <h3 className={`font-black text-gray-900 mb-3 group-hover:text-[#FF8C00] transition-colors duration-300 leading-tight ${
                          isHero ? "text-2xl md:text-3xl lg:text-4xl line-clamp-3" : "text-lg md:text-xl line-clamp-2"
                        }`}
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {title}
                        </h3>

                        <p className={`text-gray-600 leading-relaxed mb-4 flex-grow ${
                          isHero ? "text-base md:text-lg line-clamp-4" : "text-sm line-clamp-3"
                        }`}
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {excerpt}
                        </p>

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

        {/* Modal */}
        {selectedNews && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in fade-in duration-300"
            onClick={() => setSelectedNews(null)}>
            <button
              className="fixed top-8 right-8 w-14 h-14 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] hover:scale-110 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl z-50"
              onClick={() => setSelectedNews(null)}>
              <X size={24} className="text-white" strokeWidth={2.5} />
            </button>

            <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24 md:py-32"
              onClick={(e) => e.stopPropagation()}>
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

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight gradient-text"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {getLocalizedField(selectedNews, "title")}
              </h1>

              {selectedNews.image_url && (
                <div className="relative w-full h-[400px] md:h-[600px] mb-12 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-2xl">
                  <img src={selectedNews.image_url} alt={getLocalizedField(selectedNews, "title")}
                    className="w-full h-full object-cover" />
                </div>
              )}

              <div className="prose prose-xl max-w-none">
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap"
                   style={{ fontFamily: "'Inter', sans-serif" }}>
                  {getLocalizedField(selectedNews, "content")}
                </p>
              </div>

              <button onClick={() => setSelectedNews(null)}
                className="mt-16 px-8 py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 inline-flex items-center gap-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ← {t("news.close")}
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 group whatsapp-float"
          aria-label="Contactez-nous sur WhatsApp"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-[pulse-ring_2s_ease-out_infinite]"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-[pulse-ring_2s_ease-out_infinite_0.5s]"></div>
          
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 
                        rounded-full shadow-2xl flex items-center justify-center
                        hover:scale-110 hover:shadow-green-500/50 transition-all duration-300
                        border-4 border-white">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Contactez-nous sur WhatsApp
              </p>
              <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                +224 613 509 180
              </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 
                          w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>
      </div>
    </>
  );
};

export default Actualites;