import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Navigation, Store, Sparkles, Phone, Clock, ArrowRight, ExternalLink } from "lucide-react";

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
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
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
          background: linear-gradient(90deg, 
            transparent 0%,
            #FFC107 20%,
            #FF8C00 50%,
            #FFC107 80%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(255, 140, 0, 0.3);
        }
        
        .pulse-pin {
          animation: pulse-ring 2s ease-out infinite;
        }
        
        .map-container {
          position: relative;
          width: 100%;
          height: 700px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .map-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
          margin-top: -80px;
          height: calc(100% + 80px);
        }
        
        /* Overlay to hide Google Maps header */
        .map-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: white;
          z-index: 10;
          pointer-events: none;
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <MapPin className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.badge") || "Trouvez-nous"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("sales.title") || "Nos Points de Vente"}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("sales.subtitle") || "Découvrez où trouver nos produits près de chez vous"}
            </p>
          </div>

          {/* Separator Line */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="max-w-7xl mx-auto px-6 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 text-center border-2 border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.stat1_value") || "15+"}
              </h3>
              <p className="text-gray-600 font-semibold"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("sales.stat1_label") || "Points de vente"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 text-center border-2 border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.stat2_value") || "Toute la Guinée"}
              </h3>
              <p className="text-gray-600 font-semibold"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("sales.stat2_label") || "Couverture nationale"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 text-center border-2 border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.stat3_value") || "7j/7"}
              </h3>
              <p className="text-gray-600 font-semibold"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("sales.stat3_label") || "Service disponible"}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center relative">
                  <Navigation className="w-6 h-6 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-[#FF8C00] rounded-2xl pulse-pin"></div>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("sales.map_title") || "Carte Interactive"}
              </h2>
              <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("sales.map_desc") || "Explorez notre réseau de distribution sur la carte"}
              </p>
            </div>

            {/* Map Container */}
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1a_RVgU0Rr5vqzRqAm8KPPUHoFQQaVAw&ehbc=2E312F"
                title="Points de vente VIALI"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Map Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="https://www.google.com/maps/d/edit?mid=1a_RVgU0Rr5vqzRqAm8KPPUHoFQQaVAw&usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white rounded-2xl font-bold text-lg"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <ExternalLink className="w-5 h-5" strokeWidth={2.5} />
                <span>{t("sales.open_map") || "Ouvrir dans Google Maps"}</span>
              </a>

              <a
                href="/contacternous"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#FF8C00] border-2 border-[#FF8C00] rounded-2xl font-bold text-lg"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <Phone className="w-5 h-5" strokeWidth={2.5} />
                <span>{t("sales.contact") || "Nous contacter"}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SalesPoints;