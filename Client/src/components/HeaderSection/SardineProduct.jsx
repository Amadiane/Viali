import React, { useEffect, useState } from "react";
import { Package, AlertCircle, ArrowLeft, ChevronRight, Clock, Users } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

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
  const [products, setProducts]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRecipe, setShowRecipe]           = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    const fetchProducts = async () => {
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
    };
    fetchProducts();
  }, []);

  const get = (p, field) => p[`${field}_${lang}`] || p[`${field}_fr`] || "";

  const openProduct = (p) => {
    setSelectedProduct(p);
    setShowRecipe(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeProduct = () => {
    setSelectedProduct(null);
    setShowRecipe(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openRecipe = () => {
    setShowRecipe(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeRecipe = () => {
    setShowRecipe(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ══════════════════════════════════════════════════════
  // PAGE RECETTE DÉTAILLÉE
  // ══════════════════════════════════════════════════════
  if (selectedProduct && showRecipe) {
    const p           = selectedProduct;
    const title       = get(p, "title");
    const rec1        = fixUrl(p.image_recette1_url || p.image_recette1);
    const rec2        = fixUrl(p.image_recette2_url || p.image_recette2);

    const recipeTitle   = get(p, "ingredienttitle2");
    const recipeLabel   = get(p, "ingredienttitle1");
    const ingredTitle   = get(p, "ingredienttitle3");
    const ingredContent = get(p, "ingredientcontent");
    const prepTitle     = get(p, "ingredienttitle4") || (lang === "fr" ? "Préparation" : "Preparation");
    const prepContent   = get(p, "ingredientcontent2");
    const prepTime      = get(p, "preptime");
    const servings      = get(p, "servings");

    const otherProducts = products.filter(op => op.id !== p.id).slice(0, 3);

    return (
      <div className="min-h-screen bg-white">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

        {/* ── HERO : grande image gauche + titre/ingrédients droite ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">
          {/* Image recette grand format */}
          <div className="relative overflow-hidden bg-[#f5f0eb] min-h-[400px] md:min-h-full">
            {rec1
              ? <img src={rec1} alt={recipeTitle || title} className="w-full h-full object-cover"/>
              : rec2
                ? <img src={rec2} alt={recipeTitle || title} className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center"><Package className="w-40 h-40 text-orange-200"/></div>
            }
          </div>

          {/* Droite : contenu recette */}
          <div className="bg-[#faf5ef] flex flex-col justify-center px-8 md:px-14 lg:px-16 pt-36 pb-16 md:pt-24">
            <button onClick={closeRecipe}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors mb-10 w-fit group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
              <span className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sardine.backToProduct") || "Retour au produit"}
              </span>
            </button>

            {recipeLabel && (
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-3"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {recipeLabel}
              </p>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {recipeTitle || title}
            </h1>

            {/* Métadonnées */}
            {(prepTime || servings) && (
              <div className="flex gap-6 mb-8">
                {prepTime && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Clock className="w-4 h-4 text-orange-400"/>
                    <span>{prepTime}</span>
                  </div>
                )}
                {servings && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Users className="w-4 h-4 text-orange-400"/>
                    <span>{servings}</span>
                  </div>
                )}
              </div>
            )}

            {/* Ingrédients */}
            {(ingredTitle || ingredContent) && (
              <div className="mb-8">
                <h2 className="text-lg font-black text-gray-900 mb-4"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {ingredTitle || (lang === "fr" ? "Ingrédients" : "Ingredients")}
                </h2>
                {ingredContent && (
                  <ul className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {ingredContent.split("\n").filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                        {line.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Préparation (si pas de bloc séparé dessous) */}
            {prepContent && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {prepTitle}
                </h2>
                <ol className="space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {prepContent.split("\n").filter(l => l.trim()).map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-500 text-xs font-black flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {line.trim()}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* ── Suggestions de recettes / autres produits ── */}
        {otherProducts.length > 0 && (
          <section className="py-20 px-8 md:px-14 lg:px-20 bg-white border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-12"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("sardine.otherRecipes") || "D'autres idées recettes"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {otherProducts.map((op) => {
                const otitle    = get(op, "title");
                const oRecTitle = get(op, "ingredienttitle2");
                const oRec1     = fixUrl(op.image_recette1_url || op.image_recette1);
                const oimg      = oRec1 || op.image_url;
                return (
                  <div key={op.id} className="group flex flex-col gap-4 cursor-pointer"
                       onClick={() => { openProduct(op); setTimeout(openRecipe, 50); }}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                      {oimg
                        ? <img src={oimg} alt={oRecTitle || otitle}
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
                        : <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16 text-gray-200"/></div>
                      }
                    </div>
                    <h3 className="text-base font-black text-gray-900 group-hover:text-orange-500 transition-colors leading-snug"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {oRecTitle || otitle}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-orange-500 font-bold text-sm group-hover:gap-2 transition-all"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("sardine.discoverRecipe") || "Découvrir la recette"}
                      <ChevronRight className="w-4 h-4"/>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // PAGE DÉTAIL PRODUIT
  // ══════════════════════════════════════════════════════
  if (selectedProduct) {
    const p           = selectedProduct;
    const title       = get(p, "title");
    const description = get(p, "content");
    const ingredient  = get(p, "ingredient");

    const rec1 = fixUrl(p.image_recette1_url || p.image_recette1);
    const rec2 = fixUrl(p.image_recette2_url || p.image_recette2);

    const hasRecipe = !!(get(p, "ingredienttitle2") || get(p, "ingredientcontent") || rec1);

    const ingredientSections = [1, 2, 3].map(n => ({
      title:   get(p, `ingredienttitle${n}`),
      content: get(p, `ingredientcontent${n}`),
    })).filter(s => s.title || s.content);

    const otherProducts = products.filter(op => op.id !== p.id).slice(0, 3);

    return (
      <div className="min-h-screen bg-white">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

        {/* ── BLOC 1 : Titre+Description GAUCHE / Image DROITE ── */}
        <section className="min-h-[100vh] grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-36 pb-12 md:pt-24 bg-white">
            <button onClick={closeProduct}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors mb-10 w-fit group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/>
              <span className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sardine.back") || "Retour aux produits"}
              </span>
            </button>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-tight mb-6"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {(() => {
                const words = title.split(" ");
                const mid = Math.ceil(words.length / 2);
                return (
                  <>
                    <span className="block"><span className="bg-orange-400/80 px-1 pb-0.5 inline">{words.slice(0, mid).join(" ")}</span></span>
                    {words.length > mid && <span className="block mt-2"><span className="bg-orange-400/80 px-1 pb-0.5 inline">{words.slice(mid).join(" ")}</span></span>}
                  </>
                );
              })()}
            </h1>

            {description && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {description}
              </p>
            )}

            <a href="/contacternous"
               className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all duration-300 w-fit shadow-lg hover:shadow-orange-500/30 hover:scale-105"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("sardine.order") || "Commander ce produit"}
            </a>

            {ingredient && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>{t("sardine.ingredients") || "Ingrédients"} : </strong>{ingredient}
                </p>
              </div>
            )}
          </div>

          <div className="relative bg-[#f5f0eb] flex items-center justify-center min-h-[800px] md:min-h-full overflow-hidden">
            {p.image_url
              ? <img src={p.image_url} alt={title} className="w-full h-full object-cover"/>
              : <Package className="w-40 h-40 text-orange-200"/>
            }
          </div>
        </section>

        {/* ── BLOC 2 : Recette 1 image gauche / cartes ingrédients droite ── */}
        {(rec1 || ingredientSections.length > 0) && (
          <section className="bg-[#faf5ef]">
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
              {/* Gauche : image recette 1 */}
              {rec1 ? (
                <div className="bg-[#f5f0eb] flex items-center justify-center h-[450px] md:h-[650px] overflow-hidden">
                  <img src={rec1} alt="Recette 1" className="w-full h-full object-cover"/>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 min-h-[400px] overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/40 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-200/50 rounded-full blur-3xl"></div>
                </div>
              )}

              {/* Droite : contenu recette */}
              <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-12 gap-6">

                {get(p, "ingredienttitle1") && (
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {get(p, "ingredienttitle1")}
                  </p>
                )}

                {get(p, "ingredienttitle2") && (
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {get(p, "ingredienttitle2")}
                  </h2>
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
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                            {line.trim()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* ── Bouton Découvrir la recette ── */}
                {hasRecipe && (
                  <button
                    onClick={openRecipe}
                    className="mt-2 inline-flex items-center gap-3 px-7 py-3.5 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-full hover:border-orange-400 hover:text-orange-500 transition-all duration-300 w-fit shadow-sm hover:shadow-md"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.discoverRecipe") || "Découvrir la recette"}
                    <ChevronRight className="w-4 h-4"/>
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── BLOC 3 : Vous aimerez aussi ── */}
        {otherProducts.length > 0 && (
          <section className="py-20 px-8 md:px-14 lg:px-20 bg-white border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-12"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("sardine.youMayAlsoLike") || "Vous aimerez aussi"}
            </p>
            <div className="grid grid-cols-3 w-full">
              {products.slice(-3).filter(op => op.id !== p.id).slice(0, 3).map((op, idx, arr) => {
                const otitle = get(op, "title");
                const oimg   = op.image_url;
                return (
                  <div key={op.id}
                       className={`group flex flex-col items-center gap-6 px-10 py-8 ${idx < arr.length - 1 ? "border-r border-gray-200" : ""}`}>
                    <div onClick={() => openProduct(op)}
                         className="w-full aspect-[4/3] overflow-hidden cursor-pointer">
                      {oimg
                        ? <img src={oimg} alt={otitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
                        : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Package className="w-20 h-20 text-gray-200"/></div>
                      }
                    </div>
                    <h3 className="text-center text-base font-black text-gray-900 group-hover:text-orange-500 transition-colors cursor-pointer leading-snug"
                        onClick={() => openProduct(op)}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {otitle}
                    </h3>
                    <button onClick={() => openProduct(op)}
                      className="px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all hover:scale-105"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("sardine.readMore") || "Lire la suite"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // PAGE LISTE
  // ══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

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

      <section className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-16">
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
          <div className="max-w-2xl mx-auto text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <h3 className="text-2xl font-bold text-gray-900">{t("sardine.noProducts") || "Aucun produit"}</h3>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {products.map(product => {
              const title = get(product, "title");
              const img   = product.image_url;
              return (
                <div key={product.id} className="group flex flex-col items-center gap-5">
                  <div onClick={() => openProduct(product)}
                       className="w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 cursor-pointer transition-all duration-300 hover:shadow-xl p-8 flex items-center justify-center">
                    {img
                      ? <img src={img} alt={title} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
                      : <Package className="w-24 h-24 text-gray-200"/>
                    }
                  </div>
                  <h2 className="text-center text-xl font-black text-gray-900 group-hover:text-orange-500 transition-colors cursor-pointer"
                      onClick={() => openProduct(product)}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h2>
                  <button onClick={() => openProduct(product)}
                    className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 text-sm shadow-md"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.readMore") || "Lire la suite"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

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