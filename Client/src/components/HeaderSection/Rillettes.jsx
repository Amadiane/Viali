import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Fish, Sparkles, ShoppingCart, Phone, Star, CheckCircle, TrendingUp, Users } from "lucide-react";

const Rillettes = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    {
      id: "sardine",
      route: "/sardineProduct",
      icon: "🐟",
      badge: "Bestseller",
      rating: 4.9,
      orders: "500+"
    },
    {
      id: "thon",
      route: "/thonProduct",
      icon: "🐠",
      badge: "Premium",
      rating: 4.8,
      orders: "400+"
    },
    {
      id: "capitaine",
      route: "/capitaineProducts",
      icon: "🐡",
      badge: "Nouveau",
      rating: 5.0,
      orders: "200+"
    },
  ];

  const handleWhatsAppOrder = () => {
    window.open("https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20commander%20vos%20rillettes", "_blank");
  };

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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
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
        
        .product-icon {
          animation: float 4s ease-in-out infinite;
        }
        
        .whatsapp-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-badge {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section - ULTRA CTA FOCUSED */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-orange-50/50">
          <div className="max-w-[1200px] mx-auto px-6">
            
            <div className="text-center mb-12">
              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 
                            bg-gradient-to-r from-green-50 to-emerald-50
                            border-2 border-green-300 rounded-full mb-6 shadow-lg animate-slide-up pulse-badge">
                <TrendingUp className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                <span className="text-sm font-black text-green-700"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  🔥 {t("rillettes.urgency_badge")} 🔥
                </span>
              </div>

              {/* Titre CONVERSION-FOCUSED */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
                {t("rillettes.title")}
              </h1>
              
              {/* Value Proposition */}
              <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-8 animate-slide-up"
                 style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
                {t("rillettes.subtitle")}
              </p>

              {/* PRIMARY CTA - Hero Level */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
                   style={{ animationDelay: '0.3s' }}>
                <button
                  onClick={handleWhatsAppOrder}
                  className="group px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 flex items-center gap-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                  <span>{t("rillettes.cta_order_now")}</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white border-2 border-orange-200 text-[#FF8C00] font-bold text-lg rounded-xl hover:border-[#FF8C00] hover:shadow-lg transition-all duration-300"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("rillettes.cta_browse")}
                </button>
              </div>
            </div>

            {/* Social Proof Bar */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto animate-slide-up"
                 style={{ animationDelay: '0.4s' }}>
              <div className="text-center p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" strokeWidth={2.5} />
                  ))}
                </div>
                <p className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  4.9/5
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("rillettes.social_rating")}
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                <Users className="w-6 h-6 text-[#FF8C00] mx-auto mb-2" strokeWidth={2.5} />
                <p className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  1000+
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("rillettes.social_customers")}
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" strokeWidth={2.5} />
                <p className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  100%
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("rillettes.social_quality")}
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Products Grid - CONVERSION OPTIMIZED */}
        <div id="products" className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 md:py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <article
                key={product.id}
                className="group cursor-pointer animate-slide-up relative"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 border-2 border-gray-100 hover:border-orange-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                  
                  {/* Badge + Rating */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {product.badge}
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" strokeWidth={2.5} />
                      <span className="text-xs font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Hero Image Area */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
                    <div className={`absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] transition-transform duration-700 ${
                      hoveredCard === product.id ? "scale-110" : "scale-100"
                    }`}>
                      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                      <div className="absolute inset-0 opacity-10"
                           style={{ 
                             backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                             backgroundSize: '20px 20px'
                           }}>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-9xl transform transition-all duration-500 product-icon ${
                        hoveredCard === product.id ? "scale-125" : "scale-100"
                      }`}>
                        {product.icon}
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 transition-all duration-1000 ${
                      hoveredCard === product.id ? "translate-x-full" : "-translate-x-full"
                    }`}></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    
                    {/* Orders Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                      <span className="text-sm font-bold text-green-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {product.orders} {t("rillettes.orders_count")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight transition-colors duration-300 ${
                      hoveredCard === product.id ? "text-[#FF8C00]" : ""
                    }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t(`rillettes.products.${product.id}.name`)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-base leading-relaxed mb-6 flex-1"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t(`rillettes.products.${product.id}.description`)}
                    </p>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(product.route)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <span>{t("rillettes.view_details")}</span>
                        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppOrder();
                        }}
                        className="w-full px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                        <span>{t("rillettes.quick_order")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Trust Section - CONVERSION BOOSTER */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl border-2 border-orange-100 p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("rillettes.trust_1_title")}
                </h3>
                <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("rillettes.trust_1_desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Fish className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("rillettes.trust_2_title")}
                </h3>
                <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("rillettes.trust_2_desc")}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("rillettes.trust_3_title")}
                </h3>
                <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("rillettes.trust_3_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section - URGENCY */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-3xl p-12 md:p-16 text-center shadow-2xl">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("rillettes.final_cta_title")}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("rillettes.final_cta_subtitle")}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleWhatsAppOrder}
                  className="px-10 py-5 bg-white text-[#FF8C00] font-bold text-xl rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Phone className="w-6 h-6" strokeWidth={2.5} />
                  <span>{t("rillettes.call_to_order")}</span>
                  <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>

              <p className="text-white/80 text-sm mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                ⚡ {t("rillettes.urgency_footer")} ⚡
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20commander%20vos%20rillettes"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group whatsapp-float"
          aria-label="Commander sur WhatsApp">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-[pulse-ring_2s_ease-out_infinite]"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-[pulse-ring_2s_ease-out_infinite_0.5s]"></div>
          
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 
                        rounded-full shadow-2xl flex items-center justify-center
                        hover:scale-110 hover:shadow-green-500/50 transition-all duration-300
                        border-4 border-white">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("rillettes.whatsapp_tooltip")}
              </p>
              <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                +224 613 509 180
              </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 
                          w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>
      </div>
    </>
  );
};

export default Rillettes;