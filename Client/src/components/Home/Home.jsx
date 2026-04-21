import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";
import { 
  Loader, 
  AlertCircle, 
  ArrowRight,
  Newspaper,
  Phone,
  Mail,
  Sparkles,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Handshake,
  Target,
  Gem,
  Award
} from "lucide-react";

const Home = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [data, setData] = useState({
    news: [],
    products: [],
    team: [],
    partners: [],
    missions: [],
    values: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sardineRes, thonRes, newsRes, teamRes, partnersRes, missionsRes, valuesRes] = await Promise.all([
          fetch(`${CONFIG.BASE_URL}/api/sardine-products/`),
          fetch(`${CONFIG.BASE_URL}/api/thon-products/`),
          fetch(`${CONFIG.BASE_URL}/api/news/`),
          fetch(`${CONFIG.BASE_URL}/api/equipe-members/`),
          fetch(`${CONFIG.BASE_URL}/api/partners/`),
          fetch(`${CONFIG.BASE_URL}/api/missions/`),
          fetch(`${CONFIG.BASE_URL}/api/values/`)
        ]);

        const sardineData = await sardineRes.json();
        const thonData = await thonRes.json();
        const newsData = await newsRes.json();
        const teamData = await teamRes.json();
        const partnersData = await partnersRes.json();
        const missionsData = await missionsRes.json();
        const valuesData = await valuesRes.json();

        const activeSardine = (Array.isArray(sardineData) ? sardineData : sardineData.results || [])
          .filter(item => item.is_active === true).slice(0, 3);
        const activeThon = (Array.isArray(thonData) ? thonData : thonData.results || [])
          .filter(item => item.is_active === true).slice(0, 3);
        const activeNews = (Array.isArray(newsData) ? newsData : newsData.results || [])
          .filter(item => item.is_active === true)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
        const activeTeam = (Array.isArray(teamData) ? teamData : teamData.results || [])
          .filter(item => item.is_active === true).slice(0, 3);
        const activePartners = (Array.isArray(partnersData) ? partnersData : partnersData.results || [])
          .filter(item => item.is_active === true).slice(0, 6);
        const activeMissions = (Array.isArray(missionsData) ? missionsData : missionsData.results || [])
          .filter(item => item.is_active === true).slice(0, 1);
        const activeValues = (Array.isArray(valuesData) ? valuesData : valuesData.results || [])
          .filter(item => item.is_active === true).slice(0, 3);

        setData({
          products: [...activeSardine, ...activeThon],
          news: activeNews,
          team: activeTeam,
          partners: activePartners,
          missions: activeMissions,
          values: activeValues
        });
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data.products.length]);

  const getLocalized = (obj, field) => {
    const lang = i18n.language || "fr";
    return obj?.[`${field}_${lang}`] || obj?.[`${field}_fr`] || obj?.[`${field}_en`] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#FF8C00] animate-spin mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-gray-600 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("home.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-20 h-20 text-[#FF8C00] mx-auto mb-4" strokeWidth={2.5} />
          <h2 className="text-2xl font-black text-gray-900" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("home.error")}
          </h2>
        </div>
      </div>
    );
  }

  const currentProduct = data.products[currentSlide];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.8s ease-in-out; }
        .gradient-text {
          background: linear-gradient(135deg, #FFC107 0%, #FF8C00 50%, #FFC107 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* HERO Half Screen - Product Showcase */}
      <section className="relative h-[50vh] min-h-[400px] w-screen overflow-hidden -ml-[50vw] left-1/2">
        {data.products.length > 0 && currentProduct && (
          <div className="absolute inset-0 w-full h-full">
              
              {/* Background Image - Full Screen Cover */}
              <div className="absolute inset-0 w-full h-full animate-fade-in" key={currentSlide}>
                {currentProduct.image_url ? (
                  <>
                    <div 
                      className="w-full h-full"
                      style={{ 
                        backgroundImage: `url(${currentProduct.image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    {/* Lighter overlay - ONLY from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FFC107] to-[#FF8C00]"></div>
                )}
              </div>

              {/* Content - BOTTOM LEFT */}
              <div className="absolute inset-x-0 bottom-0 pb-12 px-6 md:px-12 lg:px-20">
                <div className="max-w-[1400px] mx-auto">
                  <div className="max-w-2xl">
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-3 animate-slide-up">
                      <Sparkles className="w-4 h-4 text-[#FFC107]" strokeWidth={2.5} />
                      <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("home.new_product")}
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight animate-slide-up leading-tight"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
                      {getLocalized(currentProduct, "name")}
                    </h1>
                    
                    <p className="text-base md:text-lg text-white/90 font-medium mb-6 animate-slide-up leading-relaxed"
                       style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
                      {getLocalized(currentProduct, "description")?.slice(0, 100)}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-3 animate-slide-up"
                         style={{ animationDelay: '0.3s' }}>
                      <button onClick={() => navigate('/rillettes')}
                        className="group px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold text-base rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center gap-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <Package className="w-5 h-5" strokeWidth={2.5} />
                        <span>{t("home.view_products")}</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
                      </button>
                      
                      <button onClick={() => navigate('/contacternous')}
                        className="px-6 py-3 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-base rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <Mail className="w-5 h-5" strokeWidth={2.5} />
                        <span>{t("home.contact_us")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              {data.products.length > 1 && (
                <>
                  <button onClick={() => setCurrentSlide((prev) => (prev - 1 + data.products.length) % data.products.length)}
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10">
                    <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
                  </button>
                  
                  <button onClick={() => setCurrentSlide((prev) => (prev + 1) % data.products.length)}
                    className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10">
                    <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
                  </button>

                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {data.products.map((_, idx) => (
                      <button key={idx} onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
      </section>

      {/* Rest of content with bg-white */}
      <div className="bg-white">

        {/* NEWS SECTION - Priority display */}
        {data.news.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg">
                    <Newspaper className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {t("home.latest_news")}
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mt-2"></div>
                  </div>
                </div>
                <button onClick={() => navigate('/actualites')}
                  className="hidden md:flex items-center gap-2 text-[#FF8C00] font-bold hover:gap-3 transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span>{t("home.view_all")}</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {data.news.map((item) => (
                  <article key={item.id} className="group cursor-pointer" onClick={() => navigate('/actualites')}>
                    <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-orange-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                      {item.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img src={item.image_url} alt={getLocalized(item, "title")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Calendar className="w-3 h-3 text-[#FF8C00]" strokeWidth={2.5} />
                          <time>{new Date(item.created_at).toLocaleDateString(i18n.language)}</time>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {getLocalized(item, "title")}
                        </h3>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50/30 to-orange-50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FFC107]/20 to-[#FF8C00]/20 rounded-full blur-3xl"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl mb-8 shadow-xl">
              <Phone className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 gradient-text"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("home.cta_final_title")}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
               style={{ fontFamily: "'Inter', sans-serif" }}>
              Vous avez des questions ? Nous sommes là pour vous accompagner dans tous vos projets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contacternous"
                 className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold text-lg rounded-xl shadow-2xl hover:scale-105 transition-all"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Mail className="w-5 h-5" strokeWidth={2.5} />
                <span>{t("home.contact_us")}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" strokeWidth={2.5} />
              </a>
              <a href="tel:+224610207407"
                 className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-orange-200 text-[#FF8C00] font-bold text-lg rounded-xl hover:border-[#FF8C00] hover:shadow-lg transition-all"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Phone className="w-5 h-5" strokeWidth={2.5} />
                <span>+224 610 20 74 07</span>
              </a>
            </div>
          </div>
        </section>

        {/* WhatsApp Floating Button - Premium Style */}
        <a
          href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Contactez-nous sur WhatsApp"
        >
          {/* Pulse rings effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
          
          {/* Main button */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 
                        rounded-full shadow-2xl flex items-center justify-center
                        hover:scale-110 hover:shadow-green-500/50 transition-all duration-300
                        border-4 border-white">
            <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          
          {/* Tooltip on hover - Desktop only */}
          <div className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Contactez-nous sur WhatsApp
              </p>
              <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                Réponse rapide garantie
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

export default Home;