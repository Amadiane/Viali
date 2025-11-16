import { NavLink, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import Loginbtn from "./Loginbtn";
import { useState, useEffect } from "react";
import { 
  Home, FileText, Calendar, Video, Image, Users, 
  Newspaper, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Shield, Zap, TrendingUp
} from "lucide-react";

const NavAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getIcon = (path) => {
    const icons = {
      "/dashboardAdmin": <Home className="w-5 h-5" />,
      "/createpost": <Newspaper className="w-5 h-5" />,
      "/programPost": <Calendar className="w-5 h-5" />,
      "/videoPost": <Video className="w-5 h-5" />,
      "/photoPost": <Image className="w-5 h-5" />,
      "/partnerPost": <Users className="w-5 h-5" />,
      "/teamMessage": <Users className="w-5 h-5" />,
      "/missionPost": <Shield className="w-5 h-5" />,
      "/valeurPost": <Zap className="w-5 h-5" />,
      "/motPresidentPost": <FileText className="w-5 h-5" />,
      "/listeContacts": <Users className="w-5 h-5" />,
      "/listePostulantsCommunity": <Users className="w-5 h-5" />,
      "/listeAbonnement": <Users className="w-5 h-5" />,
      "/homePost": <Home className="w-5 h-5" />,
      "default": <FileText className="w-5 h-5" />
    };
    return icons[path] || icons["default"];
  };

  const navCategories = [
    {
      title: "Principal",
      items: [
        { path: "/dashboardAdmin", label: "Tableau de bord" },
      ]
    },
    {
      title: "Contenu",
      items: [
        { path: "/homePost", label: "Home" },
        { path: "/createpost", label: "Actualités" },
        { path: "/programPost", label: "Calendrier" },
        { path: "/videoPost", label: "Videothèque" },
        { path: "/photoPost", label: "Photothèque" },
      ]
    },
    {
      title: "Équipe & Partenaires",
      items: [
        { path: "/partnerPost", label: "Partenaires" },
        { path: "/teamMessage", label: "Equipe" },
        { path: "/missionPost", label: "Missions" },
        { path: "/valeurPost", label: "Valeurs" },
        { path: "/motPresidentPost", label: "Mot du President" },
        { path: "/listeContacts", label: "Liste Contacts" },
        { path: "/listePostulantsCommunity", label: "Liste Community" },
        { path: "/listeAbonnement", label: "Liste Abonnement" },
      ]
    },
  ];

  const handleMobileMenuClose = () => {
    if (windowWidth < 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <>
      <aside 
        className={`${
          isSidebarCollapsed ? 'w-16 md:w-20' : 'w-64 md:w-72'
        } transition-all duration-300 ease-in-out h-screen bg-white/90 backdrop-blur-md shadow-2xl shadow-orange-400/30 fixed left-0 top-0 z-50 flex flex-col border-r-4 border-[#F47920]/30 relative overflow-hidden`}
      >
        {/* Effets de fond lumineux - exactement comme DashboardAdmin */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-0 w-40 h-40 bg-gradient-to-br from-[#FDB71A] to-[#F47920] opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-0 w-40 h-40 bg-gradient-to-br from-[#F47920] to-[#E84E1B] opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-20 left-1/2 w-40 h-40 bg-gradient-to-br from-[#E84E1B] to-[#FDB71A] opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Motif de points décoratifs - comme DashboardAdmin */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-4 w-2 h-2 bg-[#F47920] rounded-full animate-ping"></div>
          <div className="absolute top-40 right-4 w-2 h-2 bg-[#FDB71A] rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-4 w-2 h-2 bg-[#E84E1B] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* En-tête avec logo Viali et bouton de réduction */}
        <div className={`relative py-4 md:py-6 px-2 md:px-4 border-b-2 border-[#FDB71A]/20 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center bg-gradient-to-r from-orange-50/80 to-yellow-50/80 backdrop-blur-sm`}>
          
          {!isSidebarCollapsed && (
            <div className="relative flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                {/* Halo lumineux comme DashboardAdmin */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-40 blur-lg rounded-xl animate-pulse"></div>
                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-2xl shadow-orange-400/60">
                  <span className="font-black text-white drop-shadow-lg">V</span>
                  {/* Effet de brillance */}
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white/40 rounded-full blur-md animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-black bg-gradient-to-r from-[#F47920] to-[#E84E1B] bg-clip-text text-transparent tracking-tight">VIALI ADMIN</h3>
                <p className="text-xs text-[#F47920] font-semibold">Dashboard</p>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="relative group/toggle z-10"
            aria-label={isSidebarCollapsed ? "Étendre le menu" : "Réduire le menu"}
          >
            <div className="absolute inset-0 bg-[#F47920]/20 blur-md opacity-0 group-hover/toggle:opacity-100 transition-opacity rounded-lg"></div>
            <div className="relative p-1.5 md:p-2 rounded-lg bg-white/80 backdrop-blur-md border-2 border-[#F47920]/30 hover:border-[#F47920] transition-all shadow-lg shadow-orange-400/20">
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#F47920]" />
              ) : (
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-[#F47920]" />
              )}
            </div>
          </button>
        </div>

        {/* Navigation links avec un scroll */}
        <nav className="relative flex-1 overflow-y-auto py-3 md:py-4 px-2 md:px-3 custom-scrollbar bg-gradient-to-b from-white/50 to-orange-50/50 backdrop-blur-sm">
          {navCategories.map((category, index) => (
            <div key={index} className={`mb-4 md:mb-6 ${isSidebarCollapsed ? 'text-center' : ''}`}>
              {!isSidebarCollapsed && (
                <div className="relative inline-block mb-2 md:mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A]/10 to-[#F47920]/10 blur-sm rounded"></div>
                  <h3 className="relative text-xs font-black text-gray-700 uppercase tracking-wider px-2 md:px-3 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-[#F47920]" />
                    {t(category.title)}
                  </h3>
                </div>
              )}
              <div className="space-y-1 md:space-y-2">
                {category.items.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={handleMobileMenuClose}
                    className={({ isActive }) => `
                      relative block group/link overflow-hidden
                      ${isSidebarCollapsed ? 'px-0' : 'px-2 md:px-4'} 
                      py-2 md:py-3 rounded-xl transition-all duration-300
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Effet de fond pour l'élément actif - style glassmorphism comme DashboardAdmin */}
                        {isActive && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] opacity-30 blur-md"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] shadow-2xl shadow-orange-400/50"></div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-lg"></div>
                          </>
                        )}
                        
                        {/* Effet de fond pour le hover - style glassmorphism */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-md opacity-0 group-hover/link:opacity-100 transition-opacity border-2 border-[#F47920]/0 group-hover/link:border-[#F47920]/30 rounded-xl shadow-lg shadow-orange-400/0 group-hover/link:shadow-orange-400/20"></div>
                        )}

                        <div className={`relative flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                          <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover/link:text-[#F47920]'} transition-colors`}>
                            {getIcon(path)}
                          </div>
                          {!isSidebarCollapsed && (
                            <span className={`ml-2 md:ml-3 font-bold text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                              isActive ? 'text-white drop-shadow-md' : 'text-gray-700 group-hover/link:text-[#F47920]'
                            } transition-colors`}>
                              {t(label)}
                            </span>
                          )}
                          {isActive && !isSidebarCollapsed && (
                            <Shield className="w-3 h-3 md:w-4 md:h-4 text-white ml-auto drop-shadow-lg" />
                          )}
                        </div>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Section pour la déconnexion - style glassmorphism */}
        <div className={`relative mt-auto p-2 md:p-4 border-t-2 border-[#FDB71A]/20 bg-gradient-to-t from-orange-50/80 to-transparent backdrop-blur-sm ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          
          {!isSidebarCollapsed ? (
            <div className="relative flex items-center justify-between w-full bg-white/80 backdrop-blur-md border-2 border-[#FDB71A]/30 rounded-xl p-2 md:p-3 shadow-2xl shadow-orange-400/30">
              <div className="flex items-center">
                <div className="relative">
                  {/* Halo lumineux */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-40 blur-md rounded-full animate-pulse"></div>
                  <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white flex items-center justify-center shadow-lg shadow-orange-400/50">
                    <span className="font-black text-base md:text-lg drop-shadow-md">A</span>
                  </div>
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm font-bold text-gray-800">Admin</p>
                  <p className="text-xs text-[#F47920] font-semibold hidden md:block">admin@viali.com</p>
                </div>
              </div>
              <button className="relative group/logout">
                <div className="absolute inset-0 bg-red-500/20 blur-md opacity-0 group-hover/logout:opacity-100 transition-opacity rounded-lg"></div>
                <div className="relative p-1.5 md:p-2 bg-red-50 rounded-lg border-2 border-red-300 hover:border-red-500 hover:bg-red-100 transition-all shadow-lg shadow-red-400/20">
                  <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                </div>
              </button>
            </div>
          ) : (
            <button className="relative group/logout">
              <div className="absolute inset-0 bg-red-500/20 blur-md opacity-0 group-hover/logout:opacity-100 transition-opacity rounded-lg"></div>
              <div className="relative p-2 md:p-3 bg-red-50 rounded-lg border-2 border-red-300 hover:border-red-500 hover:bg-red-100 transition-all shadow-lg shadow-red-400/20">
                <LogOut className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Bouton pour mobile pour ouvrir/fermer le menu avec couleurs Viali */}
      <button
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group/mobile ${
          isSidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300 lg:hidden`}
        onClick={() => setSidebarCollapsed(false)}
        aria-label="Ouvrir le menu"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] opacity-40 blur-xl animate-pulse rounded-full"></div>
        <div className="relative bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white p-3 md:p-4 rounded-full shadow-2xl shadow-orange-500/60 border-2 border-white group-hover/mobile:scale-110 transition-transform">
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </button>

      {/* Overlay pour fermer le menu sur mobile */}
      {!isSidebarCollapsed && windowWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-[#E84E1B]/40 via-[#F47920]/40 to-[#FDB71A]/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(251, 146, 60, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FDB71A 0%, #F47920 50%, #E84E1B 100%);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #F47920 0%, #E84E1B 100%);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #F47920 rgba(251, 146, 60, 0.1);
        }
      `}</style>
    </>
  );
};

// Composant pour le layout principal de l'admin
const AdminLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex bg-gradient-to-br from-orange-50 via-yellow-50 to-white min-h-screen">
      <NavAdmin />
      <main className="ml-16 md:ml-20 lg:ml-72 flex-1 transition-all duration-300 ease-in-out w-full">
        <Routes>
          <Route path="/home" element={<div className="p-4 md:p-6"><h1 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-[#F47920] to-[#E84E1B] bg-clip-text text-transparent">Tableau de bord</h1></div>} />
          <Route path="/platformPost" element={<div className="p-4 md:p-6"><h1 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-[#F47920] to-[#E84E1B] bg-clip-text text-transparent">Gestion des plateformes</h1></div>} />
          <Route path="*" element={<div className="p-4 md:p-6"><h1 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-[#F47920] to-[#E84E1B] bg-clip-text text-transparent">Page non trouvée</h1></div>} />
        </Routes>
      </main>
    </div>
  );
};

export { AdminLayout };
export default NavAdmin;