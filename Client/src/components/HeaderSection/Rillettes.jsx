import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Fish, Waves } from "lucide-react";

const Rillettes = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);

  const products = [
    {
      id: "sardine",
      route: "/sardineProduct",
      gradient: "from-[#FDB71A] via-[#F47920] to-[#E84E1B]",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(244,121,32,0.5)]",
      icon: "🐟",
      pattern: "bg-orange-500/10",
    },
    {
      id: "thon",
      route: "/thonProduct",
      gradient: "from-[#FEC603] via-[#FDB71A] to-[#F47920]",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(254,198,3,0.5)]",
      icon: "🐠",
      pattern: "bg-yellow-500/10",
    },
    {
      id: "capitaine",
      route: "/capitaineProduct",
      gradient: "from-[#F47920] via-[#E84E1B] to-[#D94419]",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(232,78,27,0.5)]",
      icon: "🐡",
      pattern: "bg-red-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Matching Actualites style */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center">
              <Fish className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight">
              {t("rillettes.title")}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("rillettes.subtitle")}
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
                {/* Hero Image Area with Gradient */}
                <div className="relative h-80 overflow-hidden">
                  {/* Animated Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.gradient} transition-transform duration-700 ${
                      hoveredCard === product.id ? "scale-110" : "scale-100"
                    }`}
                  >
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                    </div>
                    
                    {/* Wave Pattern */}
                    <div className="absolute bottom-0 left-0 right-0">
                      <Waves className="w-full h-24 text-white/10" />
                    </div>
                  </div>

                  {/* Icon Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`text-9xl transform transition-all duration-500 ${
                        hoveredCard === product.id
                          ? "scale-125 rotate-12"
                          : "scale-100 rotate-0"
                      }`}
                    >
                      {product.icon}
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
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Title */}
                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight transition-colors duration-300 ${
                      hoveredCard === product.id ? "text-[#F47920]" : ""
                    }`}
                  >
                    {t(`rillettes.products.${product.id}.name`)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 flex-1">
                    {t(`rillettes.products.${product.id}.description`)}
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-[#F47920] font-bold text-base md:text-lg">
                      {t("rillettes.discover")}
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
              {t("rillettes.info.title")}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t("rillettes.info.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rillettes;