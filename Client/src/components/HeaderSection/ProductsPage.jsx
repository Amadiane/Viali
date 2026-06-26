import React, { useEffect, useState } from "react";
import { Package, AlertCircle, MessageCircle, ChevronRight } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const getField = (obj, field, lang) =>
  obj?.[`${field}_${lang}`] || obj?.[`${field}_fr`] || "";

const WHATSAPP_LINK = "https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations%20sur%20vos%20produits";

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
const GammeCard = ({ label, description, imageUrl, href, t }) => (
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
    <div className="flex flex-wrap gap-3">
      <a href={href}
         className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 w-fit shadow-md"
         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {t("gamme.discover", "Découvrir la gamme")}
        <ChevronRight className="w-4 h-4"/>
      </a>
      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
         className="inline-flex items-center justify-center gap-1.5 px-6 py-3 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-green-400 hover:text-green-600 transition-all duration-300 w-fit"
         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <MessageCircle className="w-4 h-4"/>
        {t("gamme.order", "Commander sur WhatsApp")}
      </a>
    </div>
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
        setErrorGamme(err.message || t("gamme.loadError", "Erreur de chargement"));
      } finally {
        setLoadingGamme(false);
      }
    })();
  }, []);

  const get = (field) => getField(gammeData, field, lang);

  const gammeCards = [
    {
      key:         "tartinables",
      label:       t("gamme.tartinables", lang === "fr" ? "Les Tartinables" : "Tartinables"),
      description: get("descriptionstatinale"),
      imageUrl:    gammeData?.image_tartinable_url,
      href:        "/rillettes",
    },
    {
      key:         "sauces",
      label:       t("gamme.sauces", lang === "fr" ? "Les Sauces" : "Sauces"),
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
        <section className="grid grid-cols-1 md:grid-cols-2 items-start">

          {/* Image — grande hauteur fixe (en vh) et object-cover sur TOUS les écrans,
              dans le même esprit immersif que la page "Nos Missions". */}
          <div className="relative bg-[#f5f0eb] overflow-hidden order-1 md:order-2
                          w-full mt-10 sm:mt-14 md:mt-0
                          h-[70vh] sm:h-[75vh] md:h-screen md:min-h-[640px]">
            {gammeData?.imagecoverproduct_url
              ? (
                <img
                  src={gammeData.imagecoverproduct_url}
                  alt={get("title") || t("gamme.heroTitle", "Nos gammes")}
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

          {/* Texte — sous l'image sur mobile, colonne gauche sur desktop */}
          <div className="flex flex-col justify-center
                          px-5 sm:px-8 md:px-14 lg:px-20 xl:px-28
                          pt-6 sm:pt-8 md:pt-0
                          pb-10 sm:pb-12 md:pb-0
                          md:h-screen md:min-h-[640px]
                          bg-white order-2 md:order-1">

            <h1 className="mb-4 sm:mb-6 md:mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="inline-block bg-orange-400
                               px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
                               text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]
                               font-black text-gray-900 leading-tight">
                {get("title") || t("gamme.heroTitle", "Nos produits")}
              </span>
            </h1>

            {get("descriptionstitle") && (
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed
                            mb-6 sm:mb-8 max-w-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {get("descriptionstitle")}
              </p>
            )}

            {/* CTA hero */}
            <div className="flex flex-wrap gap-3">
              <a href="/rillettes"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 w-fit shadow-lg"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("gamme.viewProducts", "Voir nos produits")}
                <ChevronRight className="w-4 h-4"/>
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-green-400 hover:text-green-600 transition-all duration-300 w-fit"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <MessageCircle className="w-4 h-4"/>
                {t("gamme.contactWhatsapp", "Commander sur WhatsApp")}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ══ BLOCK 2 — Tartinables | Poisson | Sauces ══ */}
      <section className="bg-[#f5ede3] pt-10 pb-14 sm:pt-14 sm:pb-20 md:py-24 px-4 sm:px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">

          {/* Heading */}
          <div className="mb-8 sm:mb-12 md:mb-16">
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
              {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[0]} t={t}/>}
            </div>
            <div className="flex items-start justify-center pt-2">
              <FishIllustration url={gammeData?.image_poisson_url}/>
            </div>
            <div className="flex justify-start pl-8 lg:pl-10">
              {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[1]} t={t}/>}
            </div>
          </div>

          {/* ── Mobile : cartes empilées SANS poisson (visuel trop encombré) ── */}
          <div className="flex flex-col gap-10 md:hidden">
            {/* Card Tartinables */}
            {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[0]} t={t}/>}

            {/* Card Sauces */}
            {loadingGamme ? <GammeCardSkeleton /> : <GammeCard {...gammeCards[1]} t={t}/>}
          </div>

        </div>
      </section>

      {/* ══ BLOCK 3 — CTA final ══ */}
      {!loadingGamme && !errorGamme && (
        <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-t border-gray-100 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("gamme.ctaTitle", "Envie de découvrir nos saveurs ?")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-sm sm:text-base"
             style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("gamme.ctaDesc", "Contactez VIALI directement sur WhatsApp pour passer votre commande ou en savoir plus sur nos produits.")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/30 text-sm sm:text-base"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5"/>
              {t("gamme.ctaButton", "Commander sur WhatsApp")}
            </a>
            <a href="/contacternous"
               className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-gray-400 transition-all text-sm sm:text-base"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("gamme.ctaContact", "Nous contacter")}
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5"/>
            </a>
          </div>
        </section>
      )}

      {/* ══ WHATSAPP — bouton flottant, petit sur mobile ══ */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
        <div className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600
                      rounded-full shadow-2xl flex items-center justify-center
                      hover:scale-110 transition-all duration-300
                      border-[3px] sm:border-4 border-white">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <div className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      pointer-events-none whitespace-nowrap">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
            <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Contactez-nous sur WhatsApp
            </p>
            <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
              Réponse rapide garantie
            </p>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </a>
    </div>
  );
};

export default ProductsPage;