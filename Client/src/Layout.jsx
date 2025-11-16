import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";

const App = () => {
  const location = useLocation();
  
  const adminPaths = [
    "/createpost",
    "/listeContacts",
    "/listeRejoindre",
    "/listePostulantsCommunity",
    "/listPartners",
    "/listeAbonnement",
    "/platformPost",
    "/valeurPost",
    "/fondationPost",
    "/motPresidentPost",
    "/videoPost",
    "/photoPost",
    "/documentPost",
    "/mediaPartenairePost",
    "/programPost",
    "/dashboardAdmin",
    "/teamMessage",
    "/missionPost",
    "/activitiesPost",
    "/homePost",
    "/partnerPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";
  const token = localStorage.getItem("access");

  if (isAdminPage && !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      {isAdminPage ? (
        // 🎨 Layout Admin - Fond avec dégradé Viali + Sidebar
        <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-white relative">
          {/* Effets de fond lumineux comme dans NavAdmin */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#FDB71A]/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#F47920]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[#E84E1B]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Motif de points subtil */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, #F47920 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>

          <NavAdmin />
          
          <main className="relative flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ml-16 md:ml-20 lg:ml-72">
            <div className="min-h-screen w-full px-4 md:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        // 🌐 Layout Public - Dégradé Viali avec particules
        <div className="flex flex-col min-h-screen w-full relative
                        bg-gradient-to-br 
                        from-[#FDB71A] 
                        via-[#F47920] 
                        to-[#E84E1B]
                        text-white 
                        overflow-x-hidden">
          
          {/* Effets de fond lumineux pour layout public */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 left-0 w-[600px] h-[600px] bg-[#FDB71A]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-[#E84E1B]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>

          {/* Overlay avec texture */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.03) 10px,
                rgba(255, 255, 255, 0.03) 20px
              )
            `
          }}></div>

          {/* Particules décoratives */}
          <div className="absolute top-32 left-10 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm"></div>
          <div className="absolute top-64 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-96 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-64 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm" style={{ animationDelay: '2s' }}></div>
          
          {/* Header avec contraste pour la lisibilité */}
          {!isLoginPage && (
            <div className="relative z-10">
              <Header />
            </div>
          )}
          
          {/* Contenu principal */}
          <main className="relative flex-1 w-full z-10">
            <Outlet />
          </main>
          
          {/* Footer */}
          {!isLoginPage && (
            <div className="relative z-10">
              <Footer />
            </div>
          )}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;