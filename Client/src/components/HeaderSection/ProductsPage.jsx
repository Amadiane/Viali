import React, { useEffect, useState } from "react";
import { Package, AlertCircle, ChevronRight } from "lucide-react";

// ── Mock config / i18n stubs (replace with your real imports) ──
const CONFIG = { API_SARDINE_PRODUCT_LIST: "/api/products/sardines" };
const useTranslation = () => ({
  t: (key, fallback) => fallback || key,
  i18n: { language: "fr" },
});

// ─────────────────────────────────────────
// Helpers (copied from SardineProducts)
// ─────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-600 text-lg mt-6 font-medium">Chargement…</span>
  </div>
);

// ─────────────────────────────────────────
// Fish SVG illustration (vintage engraving)
// ─────────────────────────────────────────
const FishIllustration = () => (
  <svg viewBox="0 0 220 480" fill="none" xmlns="http://www.w3.org/2000/svg"
       className="w-48 md:w-56 h-auto" aria-hidden="true">
    {/* body */}
    <ellipse cx="110" cy="240" rx="46" ry="160" fill="none" stroke="#1a1a1a" strokeWidth="1.4"/>
    {/* scales – hatched lines */}
    {[180,160,140,120,100,80,60,40].map((y, i) => (
      <path key={i}
        d={`M${110 - 20 + i * 1} ${y} Q110 ${y - 14} ${110 + 20 - i * 1} ${y}`}
        stroke="#1a1a1a" strokeWidth="0.9" fill="none"/>
    ))}
    {/* dorsal fin */}
    <path d="M95 180 Q80 120 110 100 Q140 120 125 180" stroke="#1a1a1a" strokeWidth="1.2" fill="none"/>
    {/* tail */}
    <path d="M96 400 Q60 440 55 460 Q110 430 110 430 Q110 430 165 460 Q160 440 124 400 Z"
          stroke="#1a1a1a" strokeWidth="1.2" fill="none"/>
    {/* pectoral fin */}
    <path d="M90 240 Q65 255 68 280 Q88 265 100 260" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
    {/* eye */}
    <circle cx="110" cy="100" r="7" stroke="#1a1a1a" strokeWidth="1.2" fill="none"/>
    <circle cx="110" cy="100" r="3" fill="#1a1a1a"/>
    {/* mouth */}
    <path d="M103 114 Q110 120 117 114" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
    {/* lateral line */}
    <path d="M110 130 Q112 240 110 380" stroke="#1a1a1a" strokeWidth="0.8" strokeDasharray="4 3" fill="none"/>
    {/* fin detail lines */}
    {[0,1,2,3,4].map(i => (
      <line key={i} x1={98 + i * 6} y1={185 - i * 5} x2={102 + i * 5} y2={175 - i * 4}
            stroke="#1a1a1a" strokeWidth="0.7"/>
    ))}
  </svg>
);

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
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
    // wire up to your router / state as needed
    window.location.href = `/produits/${p.id}`;
  };

  // ── Gamme cards data ──────────────────────
  const gammes = [
    {
      key: "tartinables",
      label: "Les Tartinables",
      description:
        "Retrouvez différents poissons et crustacés sous forme de rillettes et tartinables, comme la sardine, le maquereau, le thon, la langoustine, le crabe, le homard, la noix de Saint-Jacques, l'anchois ou le saumon.",
      image: "/images/tartinables.jpg", // replace with real path or image_url
      href: "/rillettes",
    },
    {
      key: "sauces",
      label: "Les Sauces",
      description:
        "Découvrez nos sauces artisanales à base de poissons et fruits de mer, élaborées dans notre atelier pour sublimer vos plats du quotidien.",
      image: "/images/sauces.jpg", // replace with real path or image_url
      href: "/rillettes",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ══════════════════════════════════════════
          BLOCK 1 — Sardine product list
          (exact replica of SardineProducts list view)
      ══════════════════════════════════════════ */}
      <section className="bg-[#faf5ef] border-b border-orange-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-36 pb-10 md:pt-44 md:pb-14">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-3"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ourProducts", "NOS PRODUITS")}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.title", "Sardines")}
          </h1>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="bg-red-50 rounded-2xl p-12 border border-red-100">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t("sardine.errorTitle", "Erreur")}
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button onClick={() => window.location.reload()}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors">
                {t("sardine.retry", "Réessayer")}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <h3 className="text-2xl font-bold text-gray-900">
              {t("sardine.noProducts", "Aucun produit")}
            </h3>
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
                    {t("sardine.readMore", "Lire la suite")}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA bar — kept from original */}
      {!loading && !error && products.length > 0 && (
        <section className="py-20 px-8 bg-[#faf5ef] border-t border-orange-100 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ctaTitle", "Intéressé par nos produits ?")}
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("sardine.ctaDesc", "Contactez VIALI pour toute commande ou information.")}
          </p>
          <a href="/contacternous"
             className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("sardine.ctaButton", "Nous contacter")}
            <ChevronRight className="w-5 h-5"/>
          </a>
        </section>
      )}

      {/* ══════════════════════════════════════════
          BLOCK 2 — Tartinables & Sauces gammes
          Inspired by the screenshot layout:
          card | fish | card
      ══════════════════════════════════════════ */}
      <section className="bg-[#f5ede3] py-24 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">

          {/* Section heading */}
          <div className="mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-3"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Nos gammes
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              À découvrir aussi
            </h2>
          </div>

          {/* 3-column layout: card | fish | card */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-10 md:gap-0">

            {/* ── Card 1 : Tartinables ── */}
            <GammeCard gamme={gammes[0]} />

            {/* ── Centre : fish illustration ── */}
            <div className="hidden md:flex items-center justify-center px-10 pt-4">
              <FishIllustration />
            </div>

            {/* ── Card 2 : Sauces ── */}
            <GammeCard gamme={gammes[1]} />

          </div>
        </div>
      </section>
    </div>
  );
};

// ─────────────────────────────────────────
// Gamme card (reusable)
// ─────────────────────────────────────────
const GammeCard = ({ gamme }) => (
  <div className="flex flex-col gap-5">
    {/* Image */}
    <div className="w-full aspect-[4/3] overflow-hidden rounded-none bg-gray-100">
      {gamme.image
        ? <img src={gamme.image} alt={gamme.label}
               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
        : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50">
            <Package className="w-20 h-20 text-orange-200"/>
          </div>
        )
      }
    </div>

    {/* Text */}
    <h3 className="text-2xl font-black text-gray-900"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {gamme.label}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed max-w-sm"
       style={{ fontFamily: "'Inter', sans-serif" }}>
      {gamme.description}
    </p>

    {/* CTA */}
    <a href={gamme.href}
       className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 w-fit mt-1 shadow-md"
       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      Découvrir la gamme
    </a>
  </div>
);

export default ProductsPage;