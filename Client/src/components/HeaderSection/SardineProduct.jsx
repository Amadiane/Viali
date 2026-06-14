import React, { useEffect, useRef, useState } from "react";
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
  const lang     = i18n.language;
  const location = useLocation();

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
      <section className="bg-[#faf5ef] border-b border-orange-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-36 pb-10 md:pt-44 md:pb-14">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-3"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ourProducts") || "NOS PRODUITS"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.title") || "Sardines"}
          </h1>
        </div>
      </section>

      {/* ══ ÉTATS : loading / erreur / vide ══ */}
      {loading && <LoadingSpinner />}

      {error && !loading && (
        <div className="max-w-2xl mx-auto text-center py-16 px-6">
          <div className="bg-red-50 rounded-2xl p-12 border border-red-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t("sardine.errorTitle") || "Erreur"}</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors">
              {t("sardine.retry") || "Réessayer"}
            </button>
          </div>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="max-w-2xl mx-auto text-center py-16 px-6">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
          <h3 className="text-2xl font-bold text-gray-900">{t("sardine.noProducts") || "Aucun produit"}</h3>
        </div>
      )}

      {/* ══ BLOCS PRODUITS empilés ══ */}
      {!loading && !error && products.map((p, idx) => {
        const title      = get(p, "title");
        const ingredient = get(p, "ingredient");
        const rec1       = fixUrl(p.image_recette1_url || p.image_recette1);
        const hasRecipe  = !!(get(p, "ingredienttitle2") || get(p, "ingredientcontent") || rec1);
        const isEven     = idx % 2 === 0;

        return (
          <div key={p.id}>

            {/* ── BLOC A : Titre + description gauche / Image droite ── */}
            <section className={`grid grid-cols-1 md:grid-cols-2 min-h-[80vh] ${idx > 0 ? "border-t-4 border-[#faf5ef]" : "border-t border-orange-100"}`}>

              {/* Gauche : titre + description + CTA */}
              <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 bg-white gap-7">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("sardine.ourProducts") || "NOS PRODUITS"}
                </p>

                <h2 className="mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span className="inline-block bg-orange-400 px-4 py-2 text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                    {title}
                  </span>
                </h2>

                {get(p, "content") && (
                  <p className="text-base md:text-lg text-gray-600 leading-[1.85] max-w-md"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    {get(p, "content")}
                  </p>
                )}

                <a href="/contacternous"
                   className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all duration-300 w-fit shadow-lg hover:shadow-orange-500/25 hover:scale-105"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("sardine.order") || "Commander ce produit"}
                  <ChevronRight className="w-5 h-5"/>
                </a>
              </div>

              {/* Droite : image principale */}
              <div className="relative bg-[#f5f0eb] overflow-hidden min-h-[500px] md:min-h-full">
                {p.image_url
                  ? <img src={p.image_url} alt={title} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-40 h-40 text-orange-200"/>
                    </div>
                }
              </div>
            </section>

            {/* ── BLOC C : Caractéristiques texte gauche / image droite ── */}
            {(get(p, "caracteristique") || ingredient) && (
              <section className="grid grid-cols-1 md:grid-cols-2 bg-white border-t border-gray-100">

                {/* Gauche : caractéristique + ingrédients */}
                <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 gap-7">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.caracteristiquesLabel") || "Caractéristiques"}
                  </p>

                  {get(p, "caracteristique") && (
                    <p className="text-base md:text-lg text-gray-600 leading-[1.85] max-w-md"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                      {get(p, "caracteristique")}
                    </p>
                  )}

                  {ingredient && (
                    <div className="border-l-4 border-orange-200 pl-5 py-1">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-2"
                         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("sardine.ingredients") || "Ingrédients"}
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        {ingredient}
                      </p>
                    </div>
                  )}
                </div>

                {/* Droite : même image principale */}
                <div className="relative bg-[#f5f0eb] overflow-hidden min-h-[400px]">
                  {p.image_url
                    ? <img src={p.image_url} alt={title} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-32 h-32 text-orange-200"/>
                      </div>
                  }
                </div>
              </section>
            )}

            {/* ── BLOC B : Recette image gauche / ingrédients droite ── */}
            {hasRecipe && (
              <section className="bg-[#faf5ef]">
                <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                  {rec1 ? (
                    <div className="bg-[#f5f0eb] flex items-center justify-center h-[450px] md:h-[650px] overflow-hidden">
                      <img src={rec1} alt="Recette" className="w-full h-full object-cover"/>
                    </div>
                  ) : (
                    <div className="relative bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 min-h-[400px] overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/40 rounded-full blur-3xl"/>
                      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-200/50 rounded-full blur-3xl"/>
                    </div>
                  )}

                  <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-12 gap-6">
                    {get(p, "ingredienttitle1") && (
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500"
                         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {get(p, "ingredienttitle1")}
                      </p>
                    )}
                    {get(p, "ingredienttitle2") && (
                      <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {get(p, "ingredienttitle2")}
                      </h3>
                    )}
                    {(get(p, "ingredienttitle3") || get(p, "ingredientcontent")) && (
                      <div>
                        {get(p, "ingredienttitle3") && (
                          <p className="font-semibold text-gray-800 text-base mb-3"
                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {get(p, "ingredienttitle3")}
                          </p>
                        )}
                        {get(p, "ingredientcontent") && (
                          <ul className="space-y-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {get(p, "ingredientcontent").split("\n").filter(l => l.trim()).map((line, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"/>
                                {line.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <a href="/contacternous"
                       className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:gap-4 transition-all group"
                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("sardine.contactUs") || "Nous contacter"}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                    </a>
                  </div>
                </div>
              </section>
            )}

          </div>
        );
      })}

      {/* ══ CTA bas de page ══ */}
      {!loading && !error && products.length > 0 && (
        <section className="py-20 px-8 bg-[#faf5ef] border-t border-orange-100 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ctaTitle") || "Intéressé par nos produits ?"}
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("sardine.ctaDesc") || "Contactez VIALI pour toute commande ou information."}
          </p>
          <a href="/contacternous"
             className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ctaButton") || "Nous contacter"}<ChevronRight className="w-5 h-5"/>
          </a>
        </section>
      )}
    </div>
  );
};

export default SardineProducts;