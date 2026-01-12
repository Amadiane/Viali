import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Droplets, Flame, Sparkles } from "lucide-react";

const Sauces = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    {
      id: "mayonnaise",
      route: "/mayonnaiseProduct",
      gradient: "from-[#FEC603] via-[#FDB71A] to-[#F9A825]",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(254,198,3,0.6)]",
      icon: <Droplets className="w-32 h-32" />,
      emoji: "🥄",
      bgColor: "bg-yellow-50",
      accentColor: "text-yellow-600",
      defaultFeatures: ["Crémeuse", "Sans conservateurs", "Traditionnelle"],
    },
    {
      id: "sauce-piquante",
      route: "/sauce-piquante",
      gradient: "from-[#E84E1B] via-[#D94419] to-[#C23616]",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(232,78,27,0.6)]",
      icon: <Flame className="w-32 h-32" />,
      emoji: "🌶️",
      bgColor: "bg-red-50",
      accentColor: "text-red-600",
      defaultFeatures: ["Épicée", "Artisanale", "Authentique"],
    },
    {
      id: "sauce-speciale",
      route: "/sauce-speciale",
      gradient: "from-[#F47920] via-[#E84E1B] to-[#FDB71A]",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(244,121,32,0.6)]",
      icon: <Sparkles className="w-32 h-32" />,
      emoji: "✨",
      bgColor: "bg-orange-50",
      accentColor: "text-orange-600",
      defaultFeatures: ["Exclusive", "Premium", "Polyvalente"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Matching Actualites style */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight">
              {t("sauces.title")}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("sauces.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content - Bento Grid Style */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 md:py-20">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="group cursor-pointer"
              onClick={() => navigate(product.route)}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`bg-white rounded-3xl overflow-hidden transition-all duration-500 border-2 border-gray-100 hover:border-transparent shadow-md hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col ${product.hoverShadow}`}
              >
                {/* Hero Image Area with Gradient and Sauce Effects */}
                <div className="relative h-80 overflow-hidden">
                  {/* Animated Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.gradient} transition-transform duration-700 ${
                      hoveredCard === product.id ? "scale-110" : "scale-100"
                    }`}
                  >
                    {/* Sauce Drip Effect - Circular blobs */}
                    <div className="absolute inset-0 opacity-30">
                      {/* Top drips */}
                      <div className="absolute top-0 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"></div>
                      <div className="absolute top-10 right-1/3 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                      
                      {/* Middle drips */}
                      <div className="absolute top-1/3 left-1/2 w-28 h-28 bg-white rounded-full blur-2xl animate-pulse delay-300"></div>
                      
                      {/* Bottom splash */}
                      <div className="absolute bottom-5 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-1/4 w-36 h-36 bg-white rounded-full blur-3xl animate-pulse delay-500"></div>
                    </div>

                    {/* Droplet Pattern - Smaller dots */}
                    <div className="absolute inset-0 opacity-20">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-white rounded-full"
                          style={{
                            top: `${20 + (i * 10) % 60}%`,
                            left: `${15 + (i * 15) % 70}%`,
                            animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Icon Display - Layered with emoji */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Background icon */}
                      <div
                        className={`text-white/30 transform transition-all duration-500 ${
                          hoveredCard === product.id
                            ? "scale-110 rotate-12"
                            : "scale-100 rotate-0"
                        }`}
                      >
                        {product.icon}
                      </div>
                      {/* Emoji overlay */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-8xl transform transition-all duration-500 ${
                          hoveredCard === product.id
                            ? "scale-125 -rotate-12"
                            : "scale-100 rotate-0"
                        }`}
                      >
                        {product.emoji}
                      </div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 transition-all duration-1000 ${
                      hoveredCard === product.id
                        ? "translate-x-full"
                        : "-translate-x-full"
                    }`}
                  ></div>

                  {/* Bottom Sauce Drip Decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-16">
                    <svg
                      viewBox="0 0 1200 120"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M0,0 C150,50 350,100 600,50 C850,0 1050,50 1200,0 L1200,120 L0,120 Z"
                        fill="white"
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Badge */}
                  <div className={`inline-flex items-center gap-2 ${product.bgColor} ${product.accentColor} px-4 py-2 rounded-full text-xs font-bold mb-4 w-fit`}>
                    <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                    {t(`sauces.products.${product.id}.badge`)}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight transition-colors duration-300 ${
                      hoveredCard === product.id ? "text-[#F47920]" : ""
                    }`}
                  >
                    {t(`sauces.products.${product.id}.name`)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 flex-1">
                    {t(`sauces.products.${product.id}.description`)}
                  </p>

                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(() => {
                      try {
                        const features = t(`sauces.products.${product.id}.features`, { returnObjects: true });
                        const featuresList = Array.isArray(features) ? features : product.defaultFeatures;
                        return featuresList.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {feature}
                          </span>
                        ));
                      } catch {
                        return product.defaultFeatures.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            {feature}
                          </span>
                        ));
                      }
                    })()}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-[#F47920] font-bold text-base md:text-lg">
                      {t("sauces.discover")}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${product.gradient} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-90`}
                    >
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 p-8 md:p-12 bg-gradient-to-r from-gray-50 to-orange-50 rounded-3xl border-2 border-gray-100">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              {t("sauces.info.title")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {t("sauces.info.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-3 h-3 bg-[#F47920] rounded-full"></div>
                <span className="font-semibold">{t("sauces.info.quality")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-3 h-3 bg-[#FDB71A] rounded-full"></div>
                <span className="font-semibold">{t("sauces.info.natural")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-3 h-3 bg-[#E84E1B] rounded-full"></div>
                <span className="font-semibold">{t("sauces.info.artisanal")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default Sauces;