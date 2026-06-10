import React, { useEffect, useState } from "react";
import { Package, AlertCircle, ChevronRight } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const getField = (obj, field, lang) =>
  obj?.[`${field}_${lang}`] || obj?.[`${field}_fr`] || "";

// ─────────────────────────────────────────
// Poisson — image depuis l'API ou fallback SVG simple
// ─────────────────────────────────────────
const FishIllustration = ({ url }) => {
  if (url) {
    return (
      <img
        src={url}
        alt="Poisson"
        className="w-44 md:w-52 h-auto object-contain"
        style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.18))" }}
      />
    );
  }
  // Fallback SVG sardine colorée si image pas encore uploadée
  return (
    <svg viewBox="0 0 180 520" xmlns="http://www.w3.org/2000/svg"
         className="w-36 md:w-44 h-auto" aria-hidden="true">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#2d4a6b"/>
          <stop offset="40%"  stopColor="#4a7a9b"/>
          <stop offset="70%"  stopColor="#8ab4cc"/>
          <stop offset="100%" stopColor="#c8dde8"/>
        </linearGradient>
        <linearGradient id="belly" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c0d8e4"/>
          <stop offset="50%"  stopColor="#e8f4f8"/>
          <stop offset="100%" stopColor="#f4f9fb"/>
        </linearGradient>
      </defs>
      {/* Corps */}
      <ellipse cx="90" cy="265" rx="40" ry="190" fill="url(#bg)"/>
      <ellipse cx="106" cy="265" rx="24" ry="178" fill="url(#belly)" opacity="0.85"/>
      {/* Tête */}
      <ellipse cx="90" cy="85" rx="34" ry="48" fill="#253d58"/>
      <path d="M90 42 Q104 50 102 62 Q90 54 78 62 Q76 50 90 42Z" fill="#1e3347"/>
      {/* Oeil */}
      <circle cx="102" cy="76" r="12" fill="#e8e8e8"/>
      <circle cx="103" cy="76" r="8"  fill="#1a2a3a"/>
      <circle cx="103" cy="76" r="4"  fill="#050810"/>
      <circle cx="106" cy="73" r="2"  fill="white"/>
      {/* Bouche */}
      <path d="M76 100 Q72 108 76 116" fill="none" stroke="#152636" strokeWidth="1.5"/>
      {/* Ouïe */}
      <path d="M70 95 Q66 118 68 142 Q76 130 80 112 Q82 98 78 90Z" fill="#1e3347" opacity="0.65"/>
      {/* Nageoire dorsale */}
      <path d="M76 98 Q52 58 56 28 Q60 8 70 16 Q78 26 82 52 Q86 72 88 98Z" fill="#2a4560" opacity="0.9"/>
      {[0,1,2,3,4,5].map(i=>(
        <line key={i} x1={83-i*3} y1={97-i*6} x2={70-i*4} y2={20+i*5}
              stroke="#1a3050" strokeWidth="0.9" opacity="0.7"/>
      ))}
      {/* Queue */}
      <path d="M68 448 Q38 478 28 500 Q55 484 90 478 Q125 484 152 500 Q142 478 112 448Z" fill="#243f5c"/>
      {[0,1,2,3,4].map(i=>(
        <line key={i} x1={70+i*10} y1={450} x2={33+i*30} y2={497}
              stroke="#1a3050" strokeWidth="1" opacity="0.8"/>
      ))}
      {/* Nageoire pectorale */}
      <path d="M66 162 Q40 175 36 202 Q46 188 63 182 Q70 174 70 164Z" fill="#3a6080" opacity="0.85"/>
      {/* Nageoire ventrale */}
      <path d="M78 308 Q60 328 62 352 Q72 334 82 324Z" fill="#3a6080" opacity="0.8"/>
      {/* Nageoire anale */}
      <path d="M80 398 Q63 416 65 436 Q74 420 84 411Z" fill="#3a6080" opacity="0.8"/>
      {/* Écailles */}
      {[135,158,181,204,227,250,273,296,319,342,365,388,412].map((y,row)=>(
        [0,1,2].map(col=>{
          const x = 70+col*20-(row%2)*10;
          return <path key={`${row}-${col}`}
            d={`M${x} ${y} Q${x+8} ${y-10} ${x+16} ${y}`}
            fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.9"/>
        })
      ))}
      {/* Ligne latérale */}
      <path d="M90 135 Q92 285 90 445"
            fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeDasharray="5 4"/>
      {/* Bande dorsale */}
      <path d="M66 95 Q56 200 58 400 Q62 412 68 410 Q70 200 74 96Z" fill="#1e3650" opacity="0.3"/>
    </svg>
  );
};

// ─────────────────────────────────────────
// Gamme card
// ─────────────────────────────────────────
const GammeCard = ({ label, description, imageUrl, href }) => (
  <div className="flex flex-col gap-0">
    <div className="w-[380px] max-w-full aspect-[4/3] overflow-hidden bg-[#e8ddd4] mb-5">
      {imageUrl
        ? <img src={imageUrl} alt={label}
               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
        : <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-orange-200"/>
          </div>
      }
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {label}
    </h3>
    {description && (
      <p className="text-gray-600 text-sm leading-relaxed mb-5 w-[380px] max-w-full"
         style={{ fontFamily: "'Inter', sans-serif" }}>
        {description}
      </p>
    )}
    <a href={href}
       className="inline-flex items-center justify-center px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 w-fit shadow-md"
       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      Découvrir la gamme
    </a>
  </div>
);

// Skeletons
const Block1Skeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
    <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 py-24 gap-6">
      <div className="h-4 w-28 bg-orange-100 rounded"/>
      <div className="h-12 w-3/4 bg-gray-100 rounded"/>
      <div className="h-4 w-full bg-gray-100 rounded"/>
      <div className="h-4 w-5/6 bg-gray-100 rounded"/>
      <div className="h-12 w-44 bg-gray-100 rounded-full"/>
    </div>
    <div className="bg-orange-50 min-h-[400px]"/>
  </div>
);

const GammeCardSkeleton = () => (
  <div className="flex flex-col gap-5 animate-pulse">
    <div className="w-[380px] max-w-full aspect-[4/3] bg-orange-100 rounded"/>
    <div className="h-7 w-48 bg-orange-100 rounded"/>
    <div className="h-4 w-full bg-orange-50 rounded"/>
    <div className="h-4 w-4/5 bg-orange-50 rounded"/>
    <div className="h-10 w-44 bg-orange-100 rounded-full"/>
  </div>
);

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [gammeData,    setGammeData]    = useState(null);
  const [loadingGamme, setLoadingGamme] = useState(true);
  const [errorGamme,   setErrorGamme]   = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(CONFIG.API_GAMME_PAGE_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setGammeData(list[0] || null);
      } catch (err) {
        setErrorGamme(err.message || "Erreur de chargement");
      } finally {
        setLoadingGamme(false);
      }
    })();
  }, []);

  const get = (field) => getField(gammeData, field, lang);

  const gammeCards = [
    {
      key:         "tartinables",
      label:       lang === "fr" ? "Les Tartinables" : "Tartinables",
      description: get("descriptionstatinale"),
      imageUrl:    gammeData?.image_tartinable_url,
      href:        "/rillettes",
    },
    {
      key:         "sauces",
      label:       lang === "fr" ? "Les Sauces" : "Sauces",
      description: get("descriptionsSauces"),
      imageUrl:    gammeData?.image_sauce_url,
      href:        "/rillettes",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ══ BLOCK 1 — Hero texte gauche / image droite ══ */}
      {loadingGamme ? (
        <Block1Skeleton />
      ) : errorGamme ? (
        <div className="flex items-center justify-center py-32">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5"/>
            <span className="text-sm">{errorGamme}</span>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
          <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-36 pb-16 md:pt-24 bg-white">
            {/* <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-4"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("gamme.ourProducts", "NOS PRODUITS")}
            </p> */}
            <h1 className="mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="inline-block bg-orange-400 px-5 py-3 text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-tight">
                {get("title") || "Nos produits"}
              </span>
            </h1>
            {get("descriptionstitle") && (
              <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {get("descriptionstitle")}
              </p>
            )}
            <a href="/sardines"
               className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all duration-300 w-fit shadow-lg hover:shadow-orange-500/30 hover:scale-105"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("gamme.discover", "Découvrir nos sardines")}
              <ChevronRight className="w-5 h-5"/>
            </a>
          </div>
          <div className="relative bg-[#f5f0eb] flex items-center justify-center min-h-[500px] md:min-h-full overflow-hidden">
            {gammeData?.imagecoverproduct_url
              ? <img src={gammeData.imagecoverproduct_url} alt={get("title") || "Nos gammes"}
                     className="w-full h-full object-cover"/>
              : <Package className="w-40 h-40 text-orange-200"/>
            }
          </div>
        </section>
      )}

      {/* ══ BLOCK 2 — Tartinables | Poisson | Sauces ══ */}
      <section className="bg-[#f5ede3] py-24 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">

          <div className="mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-3"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("gamme.label", "Nos gammes")}
            </p>
            {loadingGamme
              ? <div className="h-10 w-64 bg-orange-100 rounded animate-pulse"/>
              : <h2 className="text-4xl md:text-5xl font-black text-gray-900"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("gamme.title", "À découvrir aussi")}
                </h2>
            }
          </div>

          {/* card | poisson | card */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_1fr] items-start gap-0">
            {/* Tartinables — vers le centre */}
            <div className="flex justify-end pr-10">
              {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[0]} />}
            </div>
            {/* Poisson depuis l'API */}
            <div className="hidden md:flex items-start justify-center pt-2">
              <FishIllustration url={gammeData?.image_poisson_url} />
            </div>
            {/* Sauces — vers le centre */}
            <div className="flex justify-start pl-10">
              {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[1]} />}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProductsPage;