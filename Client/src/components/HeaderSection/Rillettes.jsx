import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, MessageCircle, Package, Sparkles } from "lucide-react";
import CONFIG from "../../config/config.js";

const getField = (obj, field, lang) =>
  obj?.[`${field}_${lang}`] || obj?.[`${field}_fr`] || "";

const WHATSAPP_LINK = "https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20commander%20vos%20rillettes";

// ─────────────────────────────────────────
// SVG Poisson par espèce
// ─────────────────────────────────────────
const SardineSVG = () => (
  <svg viewBox="0 0 200 100" className="w-28 sm:w-32 h-14 sm:h-16 opacity-80">
    <ellipse cx="100" cy="50" rx="72" ry="26" fill="#2d4a6b"/>
    <ellipse cx="116" cy="50" rx="42" ry="18" fill="#c8dde8" opacity="0.7"/>
    <ellipse cx="52" cy="50" rx="25" ry="21" fill="#253d58"/>
    <path d="M168 50 Q190 34 194 50 Q190 66 168 50Z" fill="#243f5c"/>
    <path d="M52 34 Q44 20 54 12 Q60 20 58 34Z" fill="#2a4560"/>
    <circle cx="44" cy="46" r="6" fill="#e8e8e8"/>
    <circle cx="44" cy="46" r="3" fill="#050810"/>
    <circle cx="46" cy="44" r="1.2" fill="white"/>
    {[0,1,2,3].map(i => (
      <path key={i} d={`M${80+i*18} 42 Q${89+i*18} 33 ${98+i*18} 42`}
            fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.9"/>
    ))}
    <path d="M100 35 Q102 50 100 65" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="4 3"/>
  </svg>
);

const ThonSVG = () => (
  <svg viewBox="0 0 200 100" className="w-28 sm:w-32 h-14 sm:h-16 opacity-80">
    <ellipse cx="100" cy="50" rx="75" ry="28" fill="#1a3a2a"/>
    <ellipse cx="118" cy="50" rx="44" ry="20" fill="#4a8a6a" opacity="0.55"/>
    <ellipse cx="50" cy="50" rx="27" ry="23" fill="#142e20"/>
    <path d="M172 50 Q196 32 200 50 Q196 68 172 50Z" fill="#0f2218"/>
    <path d="M50 32 Q42 16 54 8 Q62 18 60 32Z" fill="#1a3a2a"/>
    <circle cx="42" cy="45" r="7" fill="#d8e8d0"/>
    <circle cx="42" cy="45" r="3.5" fill="#050810"/>
    <circle cx="44" cy="43" r="1.2" fill="white"/>
    {[0,1,2,3].map(i => (
      <path key={i} d={`M${82+i*18} 42 Q${91+i*18} 32 ${100+i*18} 42`}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.9"/>
    ))}
    <path d="M100 34 Q102 50 100 66" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeDasharray="4 3"/>
  </svg>
);

const CapitaineSVG = () => (
  <svg viewBox="0 0 200 100" className="w-28 sm:w-32 h-14 sm:h-16 opacity-80">
    <ellipse cx="100" cy="50" rx="70" ry="24" fill="#5a3e28"/>
    <ellipse cx="115" cy="50" rx="40" ry="17" fill="#c8a882" opacity="0.6"/>
    <ellipse cx="54" cy="50" rx="25" ry="21" fill="#3e2a18"/>
    <path d="M168 50 Q190 34 193 50 Q190 66 168 50Z" fill="#3e2a18"/>
    <path d="M54 33 Q46 18 56 10 Q62 20 60 33Z" fill="#5a3e28"/>
    <circle cx="46" cy="46" r="6" fill="#f0e8d8"/>
    <circle cx="46" cy="46" r="3" fill="#1a0e08"/>
    <circle cx="48" cy="44" r="1.2" fill="white"/>
    {[0,1,2,3].map(i => (
      <path key={i} d={`M${78+i*18} 42 Q${87+i*18} 33 ${96+i*18} 42`}
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9"/>
    ))}
    <path d="M100 35 Q102 50 100 65" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" strokeDasharray="4 3"/>
  </svg>
);

const fishSVGs = { sardine: SardineSVG, thon: ThonSVG, capitaine: CapitaineSVG };

// ─────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────
const ProductCard = ({ id, title, description, imageUrl, route, onOrder, t }) => {
  const navigate = useNavigate();
  const FishSVG   = fishSVGs[id];

  return (
    <div className="group flex flex-col">
      <div
        onClick={() => navigate(route)}
        className="w-full aspect-[4/3] bg-[#f5ede3] overflow-hidden flex flex-col items-center justify-center relative mb-5 cursor-pointer transition-all duration-300 group-hover:shadow-lg rounded-xl"
      >
        {imageUrl
          ? <img src={imageUrl} alt={title}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
          : (
            <div className="flex flex-col items-center gap-3">
              <FishSVG />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {title}
              </span>
            </div>
          )
        }
        <div className="absolute inset-0 bg-orange-400/0 group-hover:bg-orange-400/8 transition-all duration-300"/>
      </div>

      <h2
        onClick={() => navigate(route)}
        className="text-xl sm:text-2xl font-black text-gray-900 mb-3 group-hover:text-orange-500 transition-colors cursor-pointer"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {title}
      </h2>

      {description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-6"
           style={{ fontFamily: "'Inter', sans-serif" }}>
          {description}
        </p>
      )}

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={() => navigate(route)}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 shadow-md"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {t("rillettes.viewProducts", "Voir les produits")}
          <ChevronRight className="w-4 h-4"/>
        </button>
        <button
          onClick={onOrder}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-green-400 hover:text-green-600 transition-all duration-300"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <MessageCircle className="w-4 h-4"/>
          {t("rillettes.orderWhatsapp", "Commander sur WhatsApp")}
        </button>
      </div>
    </div>
  );
};

// Skeleton card
const CardSkeleton = () => (
  <div className="flex flex-col gap-0 animate-pulse">
    <div className="w-full aspect-[4/3] bg-orange-100 mb-5 rounded-xl"/>
    <div className="h-7 w-40 bg-gray-100 rounded mb-3"/>
    <div className="h-4 w-full bg-gray-100 rounded mb-2"/>
    <div className="h-4 w-4/5 bg-gray-100 rounded mb-6"/>
    <div className="h-11 w-full bg-gray-100 rounded-full mb-3"/>
    <div className="h-11 w-full bg-gray-100 rounded-full"/>
  </div>
);

// Hero skeleton
const HeroSkeleton = () => (
  <div className="animate-pulse flex flex-col md:grid md:grid-cols-2 min-h-[70vh]">
    <div className="flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-20 py-16 gap-5 order-2 md:order-1">
      <div className="h-4 w-32 bg-orange-100 rounded"/>
      <div className="h-12 w-3/4 bg-gray-100 rounded"/>
      <div className="h-4 w-full bg-gray-100 rounded"/>
      <div className="h-4 w-5/6 bg-gray-100 rounded"/>
      <div className="h-12 w-48 bg-gray-100 rounded-full mt-4"/>
    </div>
    <div className="bg-orange-50 min-h-[280px] md:min-h-full order-1 md:order-2"/>
  </div>
);

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────
const Rillettes = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(CONFIG.API_RILLETTE_PAGE_LIST);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.results || [];
        setData(list[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const get = (field) => getField(data, field, lang);

  const handleWhatsApp = () => window.open(WHATSAPP_LINK, "_blank");

  // Navigation directe vers la page détail (skip la liste)
  const goToDetail = (route) => navigate(route, { state: { openDetail: true } });

  const products = [
    {
      id:          "sardine",
      route:       "/sardineProduct",
      title:       get("sardinetitle") || t("rillettes.sardine", "Sardine"),
      description: get("descriptionssardinerillette"),
      imageUrl:    data?.image_sardine_url,
    },
    {
      id:          "thon",
      route:       "/thonProduct",
      title:       get("thontitle") || t("rillettes.thon", "Thon"),
      description: get("descriptionsthonrillette"),
      imageUrl:    data?.image_thon_url,
    },
    {
      id:          "capitaine",
      route:       "/capitaineProducts",
      title:       get("capitainetitle") || t("rillettes.capitaine", "Capitaine"),
      description: get("descriptionscapitainerillette"),
      imageUrl:    data?.image_capitaine_url,
    },
  ];

  return (
    <div className="relative z-0 min-h-screen bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ══ BLOCK 1 — Hero moderne : texte gauche / image cover droite ══ */}
      {loading ? (
        <HeroSkeleton />
      ) : (
        <section className="relative z-0 flex flex-col md:grid md:grid-cols-2 min-h-[80vh] overflow-hidden isolate">

          {/* Cercle décoratif fond (desktop only) */}
          <div className="hidden md:block absolute -top-24 -left-24 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl pointer-events-none z-0"/>

          {/* Texte — en haut sur mobile, gauche sur desktop */}
          <div className="relative z-10 flex flex-col justify-center
                          px-5 sm:px-8 md:px-14 lg:px-20 xl:px-24
                          pt-28 sm:pt-32 md:pt-24
                          pb-10 sm:pb-12 md:pb-16
                          bg-white order-2 md:order-1">

            <div className="inline-flex items-center gap-2 mb-5 w-fit">
              <Sparkles className="w-4 h-4 text-orange-500"/>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("rillettes.label", "Nos gammes")}
              </p>
            </div>

            <h1 className="mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="inline-block bg-orange-400 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
                               text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem]
                               font-black text-gray-900 leading-tight">
                {get("title") || t("rillettes.title", "Rillettes & Tartinables")}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mb-8"
               style={{ fontFamily: "'Inter', sans-serif" }}>
              {get("descriptionstitle") || t("rillettes.subtitle", "Découvrez notre sélection de rillettes artisanales de la mer, préparées selon les traditions guinéennes.")}
            </p>

            {/* CTA hero */}
            <div className="flex flex-wrap gap-3">
              <a href="#products"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 w-fit shadow-lg"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("rillettes.viewProducts", "Voir les produits")}
                <ChevronRight className="w-4 h-4"/>
              </a>
              <button onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-green-400 hover:text-green-600 transition-all duration-300 w-fit"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <MessageCircle className="w-4 h-4"/>
                {t("rillettes.orderWhatsapp", "Commander sur WhatsApp")}
              </button>
            </div>
          </div>

          {/* Image cover — plein écran mobile, colonne desktop */}
          <div className="relative bg-[#f5f0eb] overflow-hidden order-1 md:order-2
                          w-full h-[70vw] sm:h-[60vw] md:h-auto md:min-h-[600px]">
            {data?.imagecoverrillette_url
              ? (
                <img
                  src={data.imagecoverrillette_url}
                  alt={get("title") || t("rillettes.title", "Rillettes")}
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

      {/* ══ BLOCK 2 — Grille produits ══ */}
      <section id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-14 sm:py-20">
        {error && (
          <div className="flex items-center gap-3 text-red-500 mb-8">
            <Package className="w-5 h-5"/>
            <span className="text-sm">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {loading
            ? [1,2,3].map(i => <CardSkeleton key={i}/>)
            : products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onOrder={handleWhatsApp}
                t={t}
              />
            ))
          }
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="bg-[#faf5ef] border-t border-orange-100 py-14 sm:py-20 px-4 sm:px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("rillettes.finalCtaTitle", "Prêt à commander ?")}
            </h2>
            <p className="text-gray-500 max-w-lg text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("rillettes.finalCtaDesc", "Contactez-nous directement sur WhatsApp pour passer votre commande.")}
            </p>
          </div>
          <button onClick={handleWhatsApp}
            className="shrink-0 inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5"/>
            {t("rillettes.orderWhatsapp", "Commander sur WhatsApp")}
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5"/>
          </button>
        </div>
      </section>

      {/* ══ WhatsApp flottant ══ */}
      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
         className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
         aria-label="Commander sur WhatsApp">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

export default Rillettes;