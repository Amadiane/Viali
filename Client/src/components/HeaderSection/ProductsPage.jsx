import React, { useEffect, useState } from "react";
import { Package, AlertCircle } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const getField = (obj, field, lang) =>
  obj?.[`${field}_${lang}`] || obj?.[`${field}_fr`] || "";

// ─────────────────────────────────────────
// Fish Illustration
// ─────────────────────────────────────────
const FishIllustration = ({ url }) => {
  if (url) {
    return (
      <img src={url} alt="Poisson"
           className="w-24 sm:w-32 md:w-44 h-auto object-contain"
           style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.18))" }}/>
    );
  }
  return (
    <svg viewBox="0 0 180 520" xmlns="http://www.w3.org/2000/svg"
         className="w-20 sm:w-28 md:w-36 h-auto" aria-hidden="true">
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
      <ellipse cx="90" cy="265" rx="40" ry="190" fill="url(#bg)"/>
      <ellipse cx="106" cy="265" rx="24" ry="178" fill="url(#belly)" opacity="0.85"/>
      <ellipse cx="90" cy="85" rx="34" ry="48" fill="#253d58"/>
      <path d="M90 42 Q104 50 102 62 Q90 54 78 62 Q76 50 90 42Z" fill="#1e3347"/>
      <circle cx="102" cy="76" r="12" fill="#e8e8e8"/>
      <circle cx="103" cy="76" r="8" fill="#1a2a3a"/>
      <circle cx="103" cy="76" r="4" fill="#050810"/>
      <circle cx="106" cy="73" r="2" fill="white"/>
      <path d="M76 98 Q52 58 56 28 Q60 8 70 16 Q78 26 82 52 Q86 72 88 98Z" fill="#2a4560" opacity="0.9"/>
      <path d="M68 448 Q38 478 28 500 Q55 484 90 478 Q125 484 152 500 Q142 478 112 448Z" fill="#243f5c"/>
      <path d="M66 162 Q40 175 36 202 Q46 188 63 182 Q70 174 70 164Z" fill="#3a6080" opacity="0.85"/>
      {[135,158,181,204,227,250,273,296,319,342,365,388,412].map((y,row)=>(
        [0,1,2].map(col=>{
          const x = 70+col*20-(row%2)*10;
          return <path key={`${row}-${col}`}
            d={`M${x} ${y} Q${x+8} ${y-10} ${x+16} ${y}`}
            fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.9"/>
        })
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────
// Gamme Card
// ─────────────────────────────────────────
const GammeCard = ({ label, description, imageUrl, href }) => (
  <div className="flex flex-col gap-0 w-full max-w-sm mx-auto md:mx-0">
    {/* Image */}
    <div className="w-full aspect-[4/3] overflow-hidden bg-[#e8ddd4] mb-4">
      {imageUrl
        ? <img src={imageUrl} alt={label}
               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
        : <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-orange-200"/>
          </div>
      }
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {label}
    </h3>
    {description && (
      <p className="text-gray-600 text-sm leading-relaxed mb-4"
         style={{ fontFamily: "'Inter', sans-serif" }}>
        {description}
      </p>
    )}
    <a href={href}
       className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 w-fit shadow-md"
       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      Découvrir la gamme
    </a>
  </div>
);

// Skeletons
const Block1Skeleton = () => (
  <div className="animate-pulse flex flex-col md:grid md:grid-cols-2 min-h-[60vh]">
    <div className="flex flex-col justify-center px-5 sm:px-8 md:px-20 py-16 gap-5">
      <div className="h-10 w-3/4 bg-gray-100 rounded"/>
      <div className="h-4 w-full bg-gray-100 rounded"/>
      <div className="h-4 w-5/6 bg-gray-100 rounded"/>
    </div>
    <div className="bg-orange-50 min-h-[280px] md:min-h-full"/>
  </div>
);

const GammeCardSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse w-full max-w-sm mx-auto md:mx-0">
    <div className="w-full aspect-[4/3] bg-orange-100 rounded"/>
    <div className="h-6 w-40 bg-orange-100 rounded"/>
    <div className="h-4 w-full bg-orange-50 rounded"/>
    <div className="h-4 w-4/5 bg-orange-50 rounded"/>
    <div className="h-10 w-40 bg-orange-100 rounded-full"/>
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
        <div className="flex items-center justify-center py-20 px-4">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0"/>
            <span className="text-sm">{errorGamme}</span>
          </div>
        </div>
      ) : (
        <section className="flex flex-col md:grid md:grid-cols-2 min-h-[80vh]">

          {/* Texte — en haut sur mobile */}
          <div className="flex flex-col justify-center
                          px-5 sm:px-8 md:px-14 lg:px-20 xl:px-28
                          pt-28 sm:pt-32 md:pt-24
                          pb-10 sm:pb-12 md:pb-16
                          bg-white order-2 md:order-1">

            <h1 className="mb-6 sm:mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="inline-block bg-orange-400
                               px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
                               text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]
                               font-black text-gray-900 leading-tight">
                {get("title") || "Nos produits"}
              </span>
            </h1>

            {get("descriptionstitle") && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed
                            mb-0 max-w-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {get("descriptionstitle")}
              </p>
            )}
          </div>

          {/* Image — plein écran sur mobile, colonne sur desktop */}
          <div className="relative bg-[#f5f0eb] overflow-hidden order-1 md:order-2
                          w-full h-[70vw] sm:h-[60vw] md:h-auto md:min-h-[600px]">
            {gammeData?.imagecoverproduct_url
              ? (
                <img
                  src={gammeData.imagecoverproduct_url}
                  alt={get("title") || "Nos gammes"}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )
              : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-24 h-24 sm:w-32 sm:h-32 text-orange-200"/>
                </div>
              )
            }
          </div>
        </section>
      )}

      {/* ══ BLOCK 2 — Tartinables | Poisson | Sauces ══ */}
      <section className="bg-[#f5ede3] py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">

          {/* Heading */}
          <div className="mb-10 sm:mb-14 md:mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-2 sm:mb-3"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("gamme.label", "Nos gammes")}
            </p>
            {loadingGamme
              ? <div className="h-8 sm:h-10 w-48 sm:w-64 bg-orange-100 rounded animate-pulse"/>
              : <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("gamme.title", "À découvrir aussi")}
                </h2>
            }
          </div>

          {/* ── Desktop : card | poisson | card ── */}
          <div className="hidden md:grid md:grid-cols-[1fr_160px_1fr] items-start gap-0">
            <div className="flex justify-end pr-8 lg:pr-10">
              {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[0]} />}
            </div>
            <div className="flex items-start justify-center pt-2">
              <FishIllustration url={gammeData?.image_poisson_url}/>
            </div>
            <div className="flex justify-start pl-8 lg:pl-10">
              {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[1]} />}
            </div>
          </div>

          {/* ── Mobile / Tablette : cartes empilées + poisson entre les deux ── */}
          <div className="flex flex-col gap-10 md:hidden">
            {/* Card Tartinables */}
            {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[0]} />}

            {/* Poisson séparateur */}
            <div className="flex justify-center py-2">
              <FishIllustration url={gammeData?.image_poisson_url}/>
            </div>

            {/* Card Sauces */}
            {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[1]} />}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProductsPage;