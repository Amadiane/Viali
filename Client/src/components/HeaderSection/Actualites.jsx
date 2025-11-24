import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, Zap, X, Sparkles, Calendar, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CONFIG from "../../config/config.js";
import ChatBotNew from "../ChatBot/ChatbotNew";

// 🎨 Centralisation des couleurs VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
};

// 🎯 Composants réutilisables
const GradientIcon = ({ icon: Icon, size = "md", animate = false }) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16 md:w-20 md:h-20",
    lg: "w-20 h-20 md:w-24 md:h-24",
  };
  
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8 md:w-10 md:h-10",
    lg: "w-10 h-10 md:w-12 md:h-12",
  };

  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r from-[${COLORS.gradientStart}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientEnd}] blur-2xl opacity-40 ${animate ? 'animate-pulse' : ''}`}></div>
        <div className={`relative ${sizes[size]} bg-gradient-to-br from-[${COLORS.gradientStart}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientEnd}] rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-400/50 transform hover:scale-105 transition-transform duration-300`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
    </div>
  );
};

const GradientText = ({ children, className = "" }) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[${COLORS.gradientEnd}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientStart}] ${className}`}>
    {children}
  </span>
);

const GradientBadge = ({ icon: Icon, text }) => (
  <div className="px-4 py-2.5 md:px-6 md:py-3 bg-white/90 backdrop-blur-md rounded-full border-2 border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#F47920]" />
      <span className="font-bold text-sm md:text-base text-gray-700">{text}</span>
    </div>
  </div>
);

const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-16 md:py-20">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-700 text-base md:text-lg mt-6 font-semibold">{text}</span>
  </div>
);

const Actualites = () => {
  const { t } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const navigate = useNavigate();

  // Scroll top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fonctions de localisation
  const getLocalizedField = (item, base) => {
    return item[`display_${base}`] || item[base] || "";
  };

  const getImageUrl = (url) => url || "/placeholder.png";

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_NEWS_LIST);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNewsList(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [navigate]);

  // Filtrage des news
  const filteredNews = newsList.filter((n) => {
    const title = getLocalizedField(n, "title").toLowerCase();
    const content = getLocalizedField(n, "content").toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || content.includes(q);
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const openNewsModal = (news) => {
    setSelectedNews(news);
    document.body.style.overflow = 'hidden';
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Effets décoratifs */}
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#E84E1B]/20 to-[#FDB71A]/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-6">
              <GradientIcon icon={TrendingUp} size="lg" animate />
            </div>

            {/* Title */}
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <GradientText>{t("Actualités")}</GradientText>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed font-medium mb-8">
              {t("Retrouvez les dernières nouvelles du")}{" "}
              <GradientText className="font-black">
                {t("Viali")}
              </GradientText>
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {/* <GradientBadge icon={Calendar} text={`${newsList.length} Articles`} /> */}
              <GradientBadge icon={Sparkles} text="Mises à jour régulières" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("Rechercher une actualité...")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all duration-300 text-gray-800 font-medium"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {loading ? (
          <LoadingSpinner text={t("Chargement des actualités...")} />
        ) : error ? (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border-2 border-red-200 shadow-lg">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 md:w-12 md:h-12 text-red-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-200">
                <Search className="w-10 h-10 md:w-12 md:h-12 text-[#F47920]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t("Aucune actualité trouvée")}
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                {t("Essayez de modifier votre recherche")}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Section Header
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full mb-4 border border-orange-200">
                <Sparkles className="w-4 h-4 text-[#F47920]" />
                <span className="text-xs md:text-sm font-bold text-gray-700">
                  {t("Dernières nouvelles")}
                </span>
                <Sparkles className="w-4 h-4 text-[#F47920]" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">
                <GradientText>{t("Toutes nos actualités")}</GradientText>
              </h2>
            </div> */}

            News Grid
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {currentNews.map((news, index) => (
                <article
                  key={news.id}
                  className="group cursor-pointer"
                  onClick={() => openNewsModal(news)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-2xl h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300">
                      <img
                        src={getImageUrl(news.image_url)}
                        alt={getLocalizedField(news, "title")}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Read More Badge */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-[#F47920] font-bold text-sm">
                          {t("Lire plus")} →
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Date Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center bg-gradient-to-r from-orange-50 to-yellow-50 px-3 py-1.5 rounded-lg border border-orange-200">
                          <Clock className="w-3.5 h-3.5 text-[#F47920] mr-1.5" />
                          <span className="text-xs font-bold text-gray-700">
                            {formatDate(news.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-3 line-clamp-2 group-hover:text-[#F47920] transition-colors">
                        {getLocalizedField(news, "title")}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm md:text-base line-clamp-3 flex-1">
                        {getLocalizedField(news, "content")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-6 mt-12">
                {/* Page Info */}
                <div className="text-sm md:text-base font-semibold text-gray-600">
                  Page <span className="text-[#F47920] font-bold">{currentPage}</span> sur{" "}
                  <span className="text-[#F47920] font-bold">{totalPages}</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 md:p-3 rounded-xl border-2 transition-all duration-300 ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-orange-200 text-[#F47920] hover:bg-orange-50 hover:scale-105'
                    }`}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? 'bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg scale-105'
                                : 'border-2 border-gray-200 text-gray-600 hover:border-orange-200 hover:text-[#F47920] hover:bg-orange-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="flex items-center px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 md:p-3 rounded-xl border-2 transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-orange-200 text-[#F47920] hover:bg-orange-50 hover:scale-105'
                    }`}
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {selectedNews && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto"
          onClick={closeNewsModal}
        >
          <div 
            className="bg-white max-w-4xl w-full rounded-3xl overflow-hidden border-2 border-orange-200 shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeNewsModal} 
              className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-orange-50 transition-all duration-300 z-10 border-2 border-orange-200 hover:scale-110"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            {/* Image */}
            {selectedNews.image_url && (
              <div className="relative w-full h-72 md:h-96 overflow-hidden">
                <img
                  src={getImageUrl(selectedNews.image_url)}
                  alt={getLocalizedField(selectedNews, "title")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
            )}

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Date Badge */}
              <div className="flex items-center bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-2 rounded-lg border border-orange-200 mb-6 inline-flex">
                <Clock className="w-4 h-4 text-[#F47920] mr-2" />
                <span className="text-sm font-bold text-gray-700">
                  {formatDate(selectedNews.created_at)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
                {getLocalizedField(selectedNews, "title")}
              </h2>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {getLocalizedField(selectedNews, "content")}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={closeNewsModal}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {t("Fermer")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ChatBot */}
      <div className="fixed bottom-6 right-6 z-40">
        <ChatBotNew />
      </div>
    </div>
  );
};

export default Actualites;