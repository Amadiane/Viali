import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Phone } from "lucide-react";

const Rillettes = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const products = [
    {
      id:    "sardine",
      route: "/sardineProduct",
      emoji: "🐟",
    },
    {
      id:    "thon",
      route: "/thonProduct",
      emoji: "🐠",
    },
    {
      id:    "capitaine",
      route: "/capitaineProducts",
      emoji: "🐡",
    },
  ];

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20commander%20vos%20rillettes",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* ══ HERO ══ */}
      <section className="bg-[#faf5ef] border-b border-orange-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-36 pb-14 md:pt-44 md:pb-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-3"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("rillettes.label", "NOS GAMMES")}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("rillettes.title", "Rillettes & Tartinables")}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed"
             style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("rillettes.subtitle", "Découvrez notre sélection de rillettes artisanales de la mer, préparées selon les traditions des conserveries d'antan.")}
          </p>
        </div>
      </section>

      {/* ══ PRODUITS ══ */}
      <section id="products" className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              onNavigate={() => navigate(product.route)}
              onOrder={handleWhatsApp}
            />
          ))}
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="bg-[#faf5ef] border-t border-orange-100 py-20 px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("rillettes.final_cta_title", "Prêt à commander ?")}
            </h2>
            <p className="text-gray-500 max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("rillettes.final_cta_subtitle", "Contactez-nous directement sur WhatsApp pour passer votre commande.")}
            </p>
          </div>
          <button
            onClick={handleWhatsApp}
            className="shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Phone className="w-5 h-5"/>
            {t("rillettes.call_to_order", "Commander sur WhatsApp")}
            <ChevronRight className="w-5 h-5"/>
          </button>
        </div>
      </section>

      {/* ══ WhatsApp flottant ══ */}
      <a href="https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20commander%20vos%20rillettes"
         target="_blank" rel="noopener noreferrer"
         className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
         aria-label="Commander sur WhatsApp">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

// ─────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────
const ProductCard = ({ product, t, onNavigate, onOrder }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group flex flex-col gap-0 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image / zone visuelle */}
      <div
        onClick={onNavigate}
        className="w-full aspect-[4/3] bg-[#f5ede3] overflow-hidden flex items-center justify-center relative mb-5 transition-all duration-300 group-hover:shadow-lg"
      >
        <span className="text-8xl transition-transform duration-500 group-hover:scale-110 select-none">
          {product.emoji}
        </span>
        {/* Overlay hover */}
        <div className={`absolute inset-0 bg-orange-400/10 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}/>
      </div>

      {/* Titre */}
      <h2
        onClick={onNavigate}
        className="text-2xl font-black text-gray-900 mb-3 group-hover:text-orange-500 transition-colors cursor-pointer"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {t(`rillettes.products.${product.id}.name`, product.id)}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6"
         style={{ fontFamily: "'Inter', sans-serif" }}>
        {t(`rillettes.products.${product.id}.description`, "—")}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={onNavigate}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-105 shadow-md"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {t("rillettes.view_details", "Voir les produits")}
          <ChevronRight className="w-4 h-4"/>
        </button>

        <button
          onClick={onOrder}
          className="inline-flex items-center justify-center gap-2 px-7 py-3 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-full hover:border-green-400 hover:text-green-600 transition-all duration-300"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          {t("rillettes.quick_order", "Commander sur WhatsApp")}
        </button>
      </div>
    </div>
  );
};

export default Rillettes;