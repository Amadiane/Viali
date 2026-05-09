import React, { useEffect, useState } from "react";
import { Package, Loader2, AlertCircle, ArrowLeft, ChevronRight } from "lucide-react";
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

const SardineProducts = () => {
  const [products, setProducts]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeProduct = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ══════════════════════════════════════════════════════
  // PAGE DÉTAIL — style La Sablaise
  // ══════════════════════════════════════════════════════
  if (selectedProduct) {
    const p           = selectedProduct;
    const title       = get(p, "title");
    const description = get(p, "content");
    const ingredient  = get(p, "ingredient");

    // URL des images recettes — vérifier les deux noms possibles
    const rec1 = p.image_recette1_url || p.image_recette1 || null;
    const rec2 = p.image_recette2_url || p.image_recette2 || null;

    // Sections ingrédients structurées
    const ingredientSections = [1, 2, 3].map(n => ({
      title:   get(p, `ingredienttitle${n}`),
      content: get(p, `ingredientcontent${n}`),
    })).filter(s => s.title || s.content);

    const otherProducts = products.filter(op => op.id !== p.id).slice(0, 3);

    return (
      <div className="min-h-screen bg-white">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

        {/* ── BLOC 1 : Titre+Description GAUCHE / Image DROITE ── */}
        <section className="min-h-[75vh] grid grid-cols-1 md:grid-cols-2">

          {/* Gauche */}
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
              {title}
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

            {/* Ingrédients simples */}
            {ingredient && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-gray-800 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <strong>{t("sardine.ingredients") || "Ingrédients"} : </strong>{ingredient}
                </p>
              </div>
            )}
          </div>

          {/* Droite : image */}
          <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 flex items-center justify-center min-h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107]/20 to-[#FF8C00]/20"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-200/40 rounded-full blur-3xl"></div>
            {p.image_url
              ? <img src={p.image_url} alt={title}
                     className="relative z-10 w-3/4 max-w-sm object-contain"
                     style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}/>
              : <Package className="w-40 h-40 text-orange-200 relative z-10"/>
            }
          </div>
        </section>

        {/* ── BLOC 2 : Sections ingrédients structurés ── */}
        {ingredientSections.length > 0 && (
          <section className="bg-[#faf5ef] py-16 px-8 md:px-14 lg:px-20 border-t border-orange-100">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-10"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              🧂 {t("sardine.ingredients") || "Ingrédients"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              {ingredientSections.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                  {s.title && (
                    <h3 className="font-black text-gray-900 text-lg mb-3"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {s.title}
                    </h3>
                  )}
                  {s.content && (
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                      {s.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── BLOC 3 : Idée recette ── */}
        {(rec1 || rec2) && (
          <section className="bg-[#faf5ef] border-t border-orange-100">

            <div className="px-8 md:px-14 pt-16 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-1"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                🍽️ {t("sardine.recipeLabel") || "Idée recette"}
              </p>
              <div className="w-12 h-0.5 bg-orange-400 rounded-full"></div>
            </div>

            {/* Recette 1 : image gauche / texte droite */}
            {rec1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
                <div className="relative overflow-hidden h-80 md:h-[500px]">
                  <img src={rec1} alt="Recette 1"
                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
                </div>
                <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 py-12">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-4"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.recipeWith") || "Une recette avec"}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h2>
                  {ingredient && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <strong className="text-gray-800">{t("sardine.ingredients") || "Ingrédients"} : </strong>{ingredient}
                    </p>
                  )}
                  <a href="/contacternous"
                     className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:gap-4 transition-all group"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.contactUs") || "Nous contacter"}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </a>
                </div>
              </div>
            )}

            {/* Recette 2 : texte gauche / image droite (inversé) */}
            {rec2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 items-stretch border-t border-orange-100">
                <div className="order-2 md:order-1 flex flex-col justify-center px-8 md:px-14 lg:px-20 py-12">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-4"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.anotherIdea") || "Autre idée recette"}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </h2>
                  <a href="/contacternous"
                     className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:gap-4 transition-all group"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sardine.contactUs") || "Nous contacter"}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </a>
                </div>
                <div className="order-1 md:order-2 relative overflow-hidden h-80 md:h-[500px]">
                  <img src={rec2} alt="Recette 2"
                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── BLOC 4 : Vous aimerez aussi ── */}
        {otherProducts.length > 0 && (
          <section className="py-20 px-8 md:px-14 lg:px-20 bg-white border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-12"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("sardine.youMayAlsoLike") || "Vous aimerez aussi"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl">
              {otherProducts.map(op => {
                const otitle = get(op, "title");
                const oimg   = op.image_url;
                return (
                  <div key={op.id} className="group flex flex-col items-center gap-4">
                    <div onClick={() => openProduct(op)}
                         className="w-full aspect-square bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 cursor-pointer transition-all duration-300 hover:shadow-xl p-8 flex items-center justify-center">
                      {oimg
                        ? <img src={oimg} alt={otitle} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
                        : <Package className="w-20 h-20 text-gray-200"/>
                      }
                    </div>
                    <h3 className="text-center text-base font-black text-gray-900 group-hover:text-orange-500 transition-colors cursor-pointer"
                        onClick={() => openProduct(op)}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {otitle}
                    </h3>
                    <button onClick={() => openProduct(op)}
                      className="px-7 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all hover:scale-105"
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