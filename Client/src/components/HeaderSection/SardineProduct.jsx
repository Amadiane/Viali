import React, { useEffect, useState } from "react";
import { Fish, Loader2, AlertCircle } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const GradientText = ({ children, className = "" }) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] ${className}`}>
    {children}
  </span>
);

const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-16 md:py-20">
    <Loader2 className="animate-spin text-orange-500" size={40} />
    <span className="text-gray-700 text-base md:text-lg mt-6 font-semibold">{text}</span>
  </div>
);

const SardineProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_SARDINE_PRODUCT_LIST);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.results || [];
        setProducts(list);
      } catch (err) {
        console.error("Erreur API SardineProducts:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden py-24 md:py-32 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Fish className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <GradientText>{t("sardine.title") || "Produits de Sardine"}</GradientText>
          </h1>
          <p className="text-base md:text-lg text-gray-800 max-w-2xl mx-auto">
            {t("sardine.subtitle") || "Découvrez nos produits à base de sardine."}
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {loading && <LoadingSpinner text={t("sardine.loading") || "Chargement..."} />}

        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border-2 border-red-200 shadow-lg">
              <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Erreur de chargement</h3>
              <p className="text-gray-600 text-base md:text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl">
              <Fish className="w-20 h-20 md:w-24 md:h-24 text-orange-500 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Aucun produit trouvé</h3>
              <p className="text-gray-600 text-base md:text-lg">
                Veuillez revenir plus tard pour découvrir nos produits de sardine.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-square p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white">
                  <img
                    src={product.image_url || "/placeholder.png"}
                    alt={product.title_fr || "Produit de sardine"}
                    className="relative w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-1">
                  <h3 className="text-center text-gray-800 font-bold text-sm md:text-base truncate">{product.title_fr}</h3>
                  <p className="text-center text-gray-500 text-sm md:text-base truncate">{product.title_en}</p>
                  <p className="text-gray-600 text-sm md:text-base">{product.content_fr}</p>
                  <p className="text-gray-600 text-sm md:text-base">{product.content_en}</p>
                  <p className={`text-center font-semibold ${product.is_active ? "text-green-600" : "text-red-500"}`}>
                    {product.is_active ? "Actif" : "Inactif"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SardineProducts;
