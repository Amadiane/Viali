import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Navigation, Store, Sparkles, Phone, Clock, ArrowRight, ExternalLink, Handshake, MessageCircle } from "lucide-react";
import salesHeroImage from "../../assets/Viali rayon presentoir.png";

const SalesPoints = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes gradient-flow {
          0%,100% { background-position: 0%   50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 1; }
          50%  { transform: scale(1.05); opacity: .7; }
          100% { transform: scale(1.1);  opacity: 0; }
        }

        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16,1,0.3,1); }

        .gradient-text {
          background: linear-gradient(135deg, #FFC107 0%, #FF8C00 50%, #FFC107 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .separator-line {
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #FFC107 20%, #FF8C00 50%, #FFC107 80%, transparent 100%);
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(255,140,0,.3);
        }

        .pulse-pin { animation: pulse-ring 2s ease-out infinite; }

        .map-container {
          position: relative;
          width: 100%;
          height: 420px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,.15);
        }
        @media (min-width: 640px) {
          .map-container { height: 500px; }
        }
        @media (min-width: 1024px) {
          .map-container { height: 700px; }
        }
        .map-container iframe {
          width: 100%;
          border: 0;
          margin-top: -80px;
          height: calc(100% + 80px);
        }
        .map-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 80px;
          background: white;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>

      <div className="min-h-screen bg-white pb-6 sm:pb-12 md:pb-16">

        {/* ══════════════════════════════ HERO avec image ══════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ isolation: "isolate", zIndex: 0 }}>

          {/* Image de fond — présentoir produits VIALI en magasin */}
          <div className="absolute inset-0">
            <img
              src={salesHeroImage}
              alt="Présentoir de produits VIALI en magasin"
              className="w-full h-full object-cover object-[center_25%]"
            />
          </div>
          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65"></div>
          {/* Teinte orange brand */}
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(135deg, rgba(255,140,0,.28) 0%, rgba(0,0,0,.05) 50%, rgba(255,193,7,.15) 100%)" }}></div>

          {/* Anneaux décoratifs */}
          <div className="absolute top-8 right-[8%] w-72 h-72 border border-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-16 right-[10%] w-48 h-48 border border-white/10 rounded-full pointer-events-none"></div>
          {/* Points déco */}
          <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                <circle key={`${r}-${c}`} cx={c*25+5} cy={r*25+5} r="3"
                        fill="white" opacity={(r+c)%2===0?0.9:0.4}/>
              )))}
            </svg>
          </div>

          {/* Contenu — sous la navbar (72px) + espace badge */}
          <div className="relative z-10 w-full mx-auto px-6 text-center"
               style={{ paddingTop: '100px', paddingBottom: '64px' }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5
                            bg-white/15 backdrop-blur-md border border-white/30
                            rounded-full mb-6 shadow-xl animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full animate-ping opacity-50"></div>
                <div className="relative w-7 h-7 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-sm font-bold text-white tracking-wide"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.badge") || "Trouvez-nous"}
              </span>
            </div>

            {/* Titre — s'adapte sur 1 ou 2 lignes selon l'écran */}
            <h1 className="font-black mb-4 tracking-tight text-white animate-slide-up drop-shadow-2xl px-2"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 'clamp(1.85rem, 7vw, 3.5rem)',
                  lineHeight: 1.15,
                  animationDelay: '0.1s',
                  textShadow: '0 4px 24px rgba(0,0,0,0.45)'
                }}>
              {t("sales.title") || "Nos Points de Vente"}
            </h1>

            {/* Ligne décorative */}
            <div className="flex justify-center mb-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"
                   style={{ boxShadow: '0 0 14px rgba(255,193,7,.7)' }}></div>
            </div>

            {/* Sous-titre */}
            <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("sales.subtitle") || "Découvrez où trouver nos produits près de chez vous"}
            </p>
          </div>

          {/* Bordure basse nette — remplace l'ancienne vague sinusoïdale */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFC107] via-[#FF8C00] to-[#FFC107]"></div>
        </section>

        {/* ══════════════════════════════ STATS ══════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-3 gap-3 sm:gap-5 md:gap-6">
            {[
              { icon: Store, value: t("sales.stat1_value") || "15+",             label: t("sales.stat1_label") || "Points de vente" },
              { icon: MapPin, value: t("sales.stat2_value") || "Toute la Guinée", label: t("sales.stat2_label") || "Couverture nationale" },
              { icon: Clock,  value: t("sales.stat3_value") || "7j/7",            label: t("sales.stat3_label") || "Service disponible" },
            ].map(({ icon: Icon, value, label }, idx) => (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-6 md:p-8 text-center border sm:border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 shadow-md">
                  <Icon className="w-4.5 h-4.5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-base sm:text-xl md:text-3xl font-black text-gray-900 mb-0.5 sm:mb-1 md:mb-2 leading-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {value}
                </h3>
                <p className="text-[11px] sm:text-sm md:text-base text-gray-600 font-semibold leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════ DEVENIR DISTRIBUTEUR ══════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="animate-slide-up relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-orange-100 sm:border-2 shadow-md sm:shadow-xl bg-white"
               style={{ animationDelay: '0.35s' }}>

            {/* Fond clair + touches brand subtiles */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50"></div>
            <div className="absolute inset-0 opacity-40"
                 style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(255,193,7,.18) 0%, transparent 55%)" }}></div>
            <div className="absolute inset-0 opacity-30"
                 style={{ background: "radial-gradient(ellipse at 85% 80%, rgba(255,140,0,.18) 0%, transparent 55%)" }}></div>

            <div className="relative px-4 sm:px-10 md:px-14 py-5 sm:py-12 md:py-16">
              <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-10 lg:gap-16">

                {/* Icône + accroche */}
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-lg sm:rounded-3xl flex items-center justify-center shadow-md sm:shadow-lg mx-auto">
                    <Handshake className="w-5 h-5 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" strokeWidth={2.2} />
                  </div>
                </div>

                {/* Texte */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 bg-white border border-orange-200 rounded-full mb-2 sm:mb-4 shadow-sm">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF8C00]" strokeWidth={2.5} />
                    <span className="text-[10px] sm:text-xs font-bold text-[#FF8C00] uppercase tracking-wider"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("sales.distrib_badge") || "Opportunité d'affaires"}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1.5 sm:mb-3 leading-tight"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("sales.distrib_title") || "Devenez Distributeur VIALI"}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t("sales.distrib_desc") || "Rejoignez notre réseau de distribution et développez votre activité avec des produits de qualité, un accompagnement dédié et des conditions commerciales avantageuses."}
                  </p>
                </div>

                {/* Actions CTA */}
                <div className="flex flex-col gap-2 sm:gap-3 w-full lg:w-auto flex-shrink-0">
                  <a
                    href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20devenir%20distributeur%20de%20vos%20produits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-7 py-2.5 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-2xl font-bold text-sm sm:text-base hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 whitespace-nowrap"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    <span>{t("sales.distrib_whatsapp") || "Discuter sur WhatsApp"}</span>
                  </a>

                  <a
                    href="/contacternous"
                    className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-7 py-2.5 sm:py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white rounded-lg sm:rounded-2xl font-bold text-sm sm:text-base hover:scale-105 hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    <span>{t("sales.distrib_contact") || "Faire une demande"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ CARTE ══════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-16 md:mb-20">
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>

            {/* Header section */}
            <div className="text-center mb-6 sm:mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-[#FF8C00] rounded-2xl pulse-pin"></div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.map_title") || "Carte Interactive"}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("sales.map_desc") || "Explorez notre réseau de distribution sur la carte"}
              </p>
            </div>

            {/* Map */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1a_RVgU0Rr5vqzRqAm8KPPUHoFQQaVAw&ehbc=2E312F"
                title="Points de vente VIALI"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-5 sm:mt-8">
              <a
                href="https://www.google.com/maps/d/edit?mid=1a_RVgU0Rr5vqzRqAm8KPPUHoFQQaVAw&usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:scale-105 hover:shadow-xl transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span>{t("sales.open_map") || "Ouvrir dans Google Maps"}</span>
              </a>

              <a
                href="/contacternous"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-white text-[#FF8C00] border-2 border-[#FF8C00] rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-orange-50 transition-all"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span>{t("sales.contact") || "Nous contacter"}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ WHATSAPP ══════════════════════════════ */}
        <a href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
           target="_blank" rel="noopener noreferrer"
           className="fixed bottom-6 right-6 z-50 group"
           aria-label="Contactez-nous sur WhatsApp">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600
                          rounded-full shadow-2xl flex items-center justify-center
                          hover:scale-110 transition-all duration-300 border-4 border-white">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <div className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contactez-nous sur WhatsApp</p>
              <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>Réponse rapide garantie</p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>

      </div>
    </>
  );
};

export default SalesPoints;