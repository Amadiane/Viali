import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Loader2,
  X,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import CONFIG from "../../config/config.js";

/* ─────────────────────────────────────────────
   Lightbox plein‑écran (Mansori)
───────────────────────────────────────────── */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Compteur */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-white text-sm font-semibold"
           style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {current + 1} / {images.length}
      </div>

      {/* Fermer */}
      <button
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
        onClick={onClose}
      >
        <X size={22} className="text-white" />
      </button>

      {/* Flèche gauche */}
      {images.length > 1 && (
        <button
          className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 z-10"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeft size={26} className="text-white" />
        </button>
      )}

      {/* Image principale */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          style={{ animation: "lb-fade .25s ease" }}
        />
      </div>

      {/* Flèche droite */}
      {images.length > 1 && (
        <button
          className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 z-10"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRight size={26} className="text-white" />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/40 backdrop-blur rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                i === current ? "border-[#FF8C00] scale-110" : "border-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Grille Masonry des images d'un article
───────────────────────────────────────────── */
const MasonryGallery = ({ images, onOpenLightbox }) => {
  if (!images || images.length === 0) return null;

  // Patterns de layout selon nb d'images
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    return "grid-cols-2 md:grid-cols-4";
  };

  const getItemClass = (index, count) => {
    if (count === 1) return "col-span-1 row-span-2 h-80";
    if (count === 2) return "col-span-1 h-64";
    if (count === 3) {
      if (index === 0) return "col-span-2 h-72";
      return "col-span-1 h-48";
    }
    // 4+: première image occupe 2 colonnes
    if (index === 0) return "col-span-2 row-span-2 h-64";
    return "col-span-1 h-32";
  };

  const visible   = images.slice(0, 5);
  const remaining = images.length - 5;

  return (
    <div className={`grid gap-2 mt-4 ${getGridClass(Math.min(images.length, 5))}`}>
      {visible.map((src, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-xl cursor-pointer group ${getItemClass(i, Math.min(images.length, 5))}`}
          onClick={() => onOpenLightbox(images, i)}
        >
          <img
            src={src}
            alt={`photo ${i + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.parentElement.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Images className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Badge "+N" sur la dernière image si il y en a plus */}
          {i === 4 && remaining > 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
              <span className="text-white text-2xl font-black"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                +{remaining}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────── */
const Actualites = () => {
  const { t, i18n } = useTranslation();

  const [newsList, setNewsList]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [lightbox, setLightbox]       = useState(null); // { images, index }

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

  // Collecte toutes les images d'un article (image_url + images[] si présent)
  const getArticleImages = (item) => {
    const imgs = [];
    if (item.image_url) imgs.push(item.image_url);
    if (Array.isArray(item.images)) imgs.push(...item.images);
    return [...new Set(imgs)]; // déduplique
  };

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
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes gradient-flow {
          0%,100% { background-position: 0%   50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 1; }
          50%  { transform: scale(1.1); opacity: .7; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-10px); }
        }
        @keyframes lb-fade {
          from { opacity: 0; transform: scale(.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16,1,0.3,1); }

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
          background: linear-gradient(90deg, transparent 0%, #FFC107 20%, #FF8C00 50%, #FFC107 80%, transparent 100%);
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(255,140,0,.3);
        }

        .whatsapp-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ══ Lightbox global ══ */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}

      <div className="min-h-screen bg-white pb-16">

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ isolation: "isolate", zIndex: 0 }}>
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1800&q=80&fit=crop"
              alt="Actualités"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65"></div>
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(135deg, rgba(255,140,0,.28) 0%, rgba(0,0,0,.05) 50%, rgba(255,193,7,.15) 100%)" }}></div>

          <div className="absolute top-8 right-[8%] w-72 h-72 border border-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-16 right-[10%] w-48 h-48 border border-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                <circle key={`${r}-${c}`} cx={c*25+5} cy={r*25+5} r="3"
                        fill="white" opacity={(r+c)%2===0?0.9:0.4}/>
              )))}
            </svg>
          </div>

          <div className="relative z-10 w-full mx-auto px-6 text-center"
               style={{ paddingTop: '120px', paddingBottom: '72px' }}>

            <div className="inline-flex items-center gap-2.5 px-5 py-2.5
                            bg-white/15 backdrop-blur-md border border-white/30
                            rounded-full mb-6 shadow-xl animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full animate-ping opacity-50"></div>
                <div className="relative w-7 h-7 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-sm font-bold text-white tracking-wide"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("news.badge_text")}
              </span>
            </div>

            <h1 className="font-black mb-4 tracking-tight text-white animate-slide-up drop-shadow-2xl whitespace-nowrap"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                  animationDelay: '0.1s',
                  textShadow: '0 4px 24px rgba(0,0,0,0.45)'
                }}>
              {t("news.title")}
            </h1>

            <div className="flex justify-center mb-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"
                   style={{ boxShadow: '0 0 14px rgba(255,193,7,.7)' }}></div>
            </div>

            <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("news.subtitle")}
            </p>
          </div>


        </section>

        {/* ══════════════════════════════ ARTICLES ══════════════════════════════ */}
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
              <p className="text-gray-600 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("news.noNewsDesc")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((item, index) => {
                const title   = getLocalizedField(item, "title");
                const content = getLocalizedField(item, "content");
                const isHero  = index === 0;
                const excerpt = content.slice(0, isHero ? 180 : 120) + "...";
                const articleImages = getArticleImages(item);

                return (
                  <article
                    key={item.id}
                    className={`group animate-slide-up ${isHero ? "md:col-span-2 lg:col-span-2" : ""}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 border-2 hover:-translate-y-2 flex flex-col h-full ${
                      isHero
                        ? "shadow-2xl hover:shadow-orange-500/40 border-orange-200 hover:border-[#FF8C00]"
                        : "shadow-lg hover:shadow-xl border-gray-100 hover:border-orange-200"
                    }`}>

                      {/* ── Image principale cliquable → lightbox ── */}
                      {item.image_url && (
                        <div
                          className={`relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 flex-shrink-0 cursor-pointer ${isHero ? "h-80 md:h-96" : "h-64"}`}
                          onClick={() => setLightbox({ images: articleImages, index: 0 })}
                        >
                          <img src={item.image_url} alt={title}
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                               loading="lazy"
                               onError={(e) => { e.target.style.display = "none"; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <Images className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          {isHero && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
                                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                              {t("news.featured")}
                            </div>
                          )}
                          {/* Indicateur nb d'images si > 1 */}
                          {articleImages.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                              <Images className="w-3.5 h-3.5" />
                              {articleImages.length}
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

                        <h3
                          className={`font-black text-gray-900 mb-3 group-hover:text-[#FF8C00] transition-colors duration-300 leading-tight cursor-pointer ${
                            isHero ? "text-xl md:text-2xl lg:text-3xl line-clamp-3" : "text-base md:text-lg line-clamp-2"
                          }`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          onClick={() => setSelectedNews(item)}
                        >
                          {title}
                        </h3>

                        <p className={`text-gray-600 leading-relaxed mb-4 flex-grow ${isHero ? "text-base md:text-lg line-clamp-4" : "text-sm line-clamp-3"}`}
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {excerpt}
                        </p>

                        <div
                          className={`flex items-center text-[#FF8C00] font-bold group/btn flex-shrink-0 cursor-pointer ${isHero ? "text-base md:text-lg" : "text-sm"}`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          onClick={() => setSelectedNews(item)}
                        >
                          <span>{t("news.readMore")}</span>
                          <ArrowRight className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-2 transition-transform duration-300" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════ MODAL ARTICLE ══════════════════════════════ */}
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

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-8 leading-tight gradient-text"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {getLocalizedField(selectedNews, "title")}
              </h1>

              {/* ── Galerie Masonry plein format dans la modal ── */}
              {(() => {
                const imgs = getArticleImages(selectedNews);
                return imgs.length > 0 ? (
                  <div className="mb-12">
                    <MasonryGallery
                      images={imgs}
                      onOpenLightbox={(images, index) => setLightbox({ images, index })}
                    />
                  </div>
                ) : null;
              })()}

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

        {/* ══════════════════════════════ WHATSAPP ══════════════════════════════ */}
        <a
          href="https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 group whatsapp-float"
          aria-label="Contactez-nous sur WhatsApp">
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
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>

      </div>
    </>
  );
};

export default Actualites;