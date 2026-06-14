import React, { useEffect, useState } from "react";
import { Package, AlertCircle, ChevronRight } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement...</span>
  </div>
);

const fixUrl = (url) => {
  if (!url) return null;
  return url.replace(/^image\/upload\//, "");
};

const SardineProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const { t, i18n } = useTranslation();
  const lang         = i18n.language;
  const location     = useLocation();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const res  = await fetch(CONFIG.API_SARDINE_PRODUCT_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setProducts(list.filter(p => p.is_active === true));
      } catch (err) {
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const get = (p, field) => p[`${field}_${lang}`] || p[`${field}_fr`] || "";

  return (
    <div className="min-h-screen bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ══ HEADER ══ */}
      <section className="relative bg-[#faf5ef] border-b border-orange-100 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-orange-300/10 rounded-full blur-2xl pointer-events-none"/>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 pt-28 pb-10 md:pt-44 md:pb-16 relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6">
            <span className="w-6 h-px bg-orange-500"/>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-500"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("sardine.ourProducts") || "NOS PRODUITS"}
            </p>
            <span className="w-6 h-px bg-orange-500"/>
          </div>

          <h1 className="font-black text-gray-900 tracking-tight leading-none"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span className="block text-lg sm:text-xl md:text-2xl font-semibold text-gray-400 mb-1 tracking-wide">
              {t("sardine.titleSub") || "Découvrez"}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              <span className="relative inline-block">
                <span className="relative z-10">{t("sardine.title") || "Sardines"}</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-3 sm:h-4 bg-orange-400/40 -z-0 -skew-x-2"/>
              </span>
            </span>
            <span className="block text-base sm:text-lg md:text-xl font-medium text-gray-500 mt-3 md:mt-4 italic tracking-normal"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("sardine.titleTagline") || "Artisanales · Naturelles · Guinéennes"}
            </span>
          </h1>
        </div>
      </section>

      {/* ══ ÉTATS ══ */}
      {loading && <LoadingSpinner />}

      {error && !loading && (
        <div className="max-w-2xl mx-auto text-center py-16 px-4">
          <div className="bg-red-50 rounded-2xl p-8 sm:p-12 border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t("sardine.errorTitle") || "Erreur"}</h3>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors">
              {t("sardine.retry") || "Réessayer"}
            </button>
          </div>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="max-w-2xl mx-auto text-center py-16 px-4">
          <Package className="w-14 h-14 text-gray-300 mx-auto mb-4"/>
          <h3 className="text-xl font-bold text-gray-900">{t("sardine.noProducts") || "Aucun produit"}</h3>
        </div>
      )}

      {/* ══ BLOCS PRODUITS ══ */}
      {!loading && !error && products.map((p, idx) => {
        const title      = get(p, "title");
        const ingredient = get(p, "ingredient");
        const rec1       = fixUrl(p.image_recette1_url || p.image_recette1);
        const hasRecipe  = !!(get(p, "ingredienttitle2") || get(p, "ingredientcontent") || rec1);
        const hasCarac   = !!(get(p, "caracteristique") || ingredient);

        return (
          <div key={p.id}>

            {/* ══════════════════════════════════════
                BLOC A — texte GAUCHE / image DROITE
            ══════════════════════════════════════ */}
            <section className={`grid grid-cols-1 md:grid-cols-2
              ${idx > 0 ? "border-t-4 border-[#faf5ef]" : "border-t border-orange-100"}`}>

              {/* GAUCHE : texte (1er dans le DOM = affiché en haut sur mobile) */}
              <div className="flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-20
                              py-12 md:py-20 bg-white gap-5 md:gap-7">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("sardine.ourProducts") || "NOS PRODUITS"}
                </p>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span className="inline-block bg-orange-400 px-3 py-1.5 sm:px-4 sm:py-2
                                   text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                                   font-black text-gray-900 leading-tight">
                    {title}
                  </span>
                </h2>
                {get(p, "content") && (
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    {get(p, "content")}
                  </p>
                )}
                <a href="/contacternous"
                   className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4
                              bg-gray-900 text-white font-bold rounded-full w-fit
                              hover:bg-orange-500 transition-all duration-300
                              shadow-lg hover:shadow-orange-500/25 hover:scale-105 text-sm sm:text-base"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("sardine.order") || "Commander ce produit"}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5"/>
                </a>
              </div>

              {/* DROITE : image principale */}
              <div className="relative bg-[#f5f0eb] overflow-hidden
                              h-64 sm:h-80 md:h-auto md:min-h-[500px]">
                {p.image_url
                  ? <img src={p.image_url} alt={title} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-orange-200"/>
                    </div>
                }
              </div>
            </section>

            {/* ══════════════════════════════════════
                BLOC B — image recette GAUCHE / ingrédients DROITE
            ══════════════════════════════════════ */}
            {hasRecipe && (
              <section className="bg-[#faf5ef] border-t border-orange-50">
                <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

                  {/* GAUCHE : image recette */}
                  {rec1 ? (
                    <div className="bg-[#f5f0eb] overflow-hidden h-64 sm:h-80 md:h-[650px]">
                      <img src={rec1} alt="Recette" className="w-full h-full object-cover"/>
                    </div>
                  ) : (
                    <div className="relative bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100
                                    h-48 sm:h-64 md:min-h-[400px] overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-300/40 rounded-full blur-3xl"/>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-200/50 rounded-full blur-3xl"/>
                    </div>
                  )}

                  {/* DROITE : contenu recette */}
                  <div className="flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-16
                                  py-10 md:py-12 gap-5 md:gap-6">
                    {get(p, "ingredienttitle1") && (
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500"
                         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {get(p, "ingredienttitle1")}
                      </p>
                    )}
                    {get(p, "ingredienttitle2") && (
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {get(p, "ingredienttitle2")}
                      </h3>
                    )}
                    {(get(p, "ingredienttitle3") || get(p, "ingredientcontent")) && (
                      <div>
                        {get(p, "ingredienttitle3") && (
                          <p className="font-semibold text-gray-800 text-sm sm:text-base mb-3"
                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {get(p, "ingredienttitle3")}
                          </p>
                        )}
                        {get(p, "ingredientcontent") && (
                          <ul className="space-y-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {get(p, "ingredientcontent").split("\n").filter(l => l.trim()).map((line, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-600 text-xs sm:text-sm leading-relaxed">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"/>
                                {line.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <a href="/contacternous"
                       className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm
                                  hover:gap-4 transition-all group w-fit"
                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("sardine.contactUs") || "Nous contacter"}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* ══════════════════════════════════════
                BLOC C — caractéristiques GAUCHE / image DROITE
                (intercalé après Bloc B → droite/gauche/droite = vrai zigzag)
            ══════════════════════════════════════ */}
            {hasCarac && (
              <section className="grid grid-cols-1 md:grid-cols-2 bg-white border-t border-gray-100">

                {/* GAUCHE : caractéristiques + ingrédients */}
                <div className="flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-20
                                py-10 md:py-16 gap-5 md:gap-7">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.caracteristiquesLabel") || "Caractéristiques"}
                  </p>
                  {get(p, "caracteristique") && (
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-md"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                      {get(p, "caracteristique")}
                    </p>
                  )}
                  {ingredient && (
                    <div className="border-l-4 border-orange-200 pl-4 sm:pl-5 py-1">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-2"
                         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("sardine.ingredients") || "Ingrédients"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        {ingredient}
                      </p>
                    </div>
                  )}
                </div>

                {/* DROITE : image produit */}
                <div className="relative bg-[#f5f0eb] overflow-hidden
                                h-56 sm:h-72 md:h-auto md:min-h-[400px]">
                  {p.image_url
                    ? <img src={p.image_url} alt={title} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-orange-200"/>
                      </div>
                  }
                </div>
              </section>
            )}

          </div>
        );
      })}

      {/* ══ AUTRES PRODUITS — 3 colonnes ══ */}
      {!loading && !error && products.length > 1 && (
        <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-16 bg-white border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-10 sm:mb-14"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Vous aimerez aussi
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
              {products.slice(0, 3).map((op) => {
                const otitle = get(op, "title");
                const oimg   = op.image_url;
                const ocarac = get(op, "caracteristique") || get(op, "content");
                return (
                  <div key={op.id} className="group flex flex-col gap-0">
                    {/* Image */}
                    <div className="w-full aspect-[4/3] overflow-hidden bg-[#f5f0eb] mb-5">
                      {oimg
                        ? <img src={oimg} alt={otitle}
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                               loading="lazy"/>
                        : <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-orange-200"/>
                          </div>
                      }
                    </div>
                    {/* Titre */}
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2
                                   group-hover:text-orange-500 transition-colors"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {otitle}
                    </h3>
                    {/* Caractéristique courte */}
                    {ocarac && (
                      <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        {ocarac}
                      </p>
                    )}
                    {/* CTA */}
                    <a href="/contacternous"
                       className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white
                                  text-sm font-bold rounded-full hover:bg-orange-500
                                  transition-all duration-300 hover:scale-105 w-fit shadow-md mt-auto"
                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Commander
                      <ChevronRight className="w-4 h-4"/>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ CTA ══ */}
      {!loading && !error && products.length > 0 && (
        <section className="py-14 sm:py-20 px-4 sm:px-8 bg-[#faf5ef] border-t border-orange-100 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ctaTitle") || "Intéressé par nos produits ?"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto text-sm sm:text-base"
             style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("sardine.ctaDesc") || "Contactez VIALI pour toute commande ou information."}
          </p>
          <a href="/contacternous"
             className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4
                        bg-orange-500 text-white font-bold rounded-full
                        hover:bg-orange-600 transition-all hover:scale-105
                        shadow-lg shadow-orange-500/30 text-sm sm:text-base"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ctaButton") || "Nous contacter"}
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5"/>
          </a>
        </section>
      )}
    </div>
  );
};

export default SardineProducts;