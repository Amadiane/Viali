import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Fish, Sparkles } from "lucide-react";

const Rillettes = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    {
      id: "sardine",
      route: "/sardineProduct",
      icon: "🐟",
    },
    {
      id: "thon",
      route: "/thonProduct",
      icon: "🐠",
    },
    {
      id: "capitaine",
      route: "/capitaineProduct",
      icon: "🐡",
    },
  ];

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
          50% { transform: translateY(-10px) rotate(5deg); }
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
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section - Style Contact avec titre centré */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("rillettes.badge_text")}
              </span>
            </div>

            {/* Titre principal avec gradient VIALI */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("rillettes.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("rillettes.subtitle")}
            </p>
          </div>

          {/* Ligne séparatrice stylée avec gradient animé */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Main Content - Products Grid */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 md:py-20">
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <article
                key={product.id}
                className="group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(product.route)}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 border-2 border-gray-100 hover:border-orange-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                  
                  {/* Hero Image Area avec gradient VIALI */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
                    
                    {/* Animated Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] transition-transform duration-700 ${
                      hoveredCard === product.id ? "scale-110" : "scale-100"
                    }`}>
                      
                      {/* Decorative circles */}
                      <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                      
                      {/* Pattern overlay */}
                      <div className="absolute inset-0 opacity-10"
                           style={{ 
                             backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                             backgroundSize: '20px 20px'
                           }}>
                      </div>
                    </div>

                    {/* Icon Display avec animation */}
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
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    
                    {/* Title */}
                    <h3 className={`text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight transition-colors duration-300 ${
                      hoveredCard === product.id ? "text-[#FF8C00]" : ""
                    }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t(`rillettes.products.${product.id}.name`)}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 flex-1"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                      {t(`rillettes.products.${product.id}.description`)}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                      <span className="text-[#FF8C00] font-bold text-base md:text-lg"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("rillettes.discover")}
                      </span>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00] flex items-center justify-center transform transition-all duration-300 ${
                        hoveredCard === product.id ? "scale-110 rotate-45" : "scale-100 rotate-0"
                      } shadow-lg`}>
                        <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Info Section avec charte VIALI */}
          <div className="mt-16 p-8 md:p-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl border-2 border-orange-100 shadow-lg animate-slide-up"
               style={{ animationDelay: '0.4s' }}>
            <div className="max-w-3xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Fish className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("rillettes.info.title")}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t("rillettes.info.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rillettes;