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
    "/newsPost",
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
    "/professionalAreaPost",
    "/thonRecipesPost",
    "/sardineRecipesPost",
    "/sardineProductPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";
  const token = localStorage.getItem("access");

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  return (
    <I18nextProvider i18n={i18n}>
      {isAdminPage ? (
        // Layout Admin avec couleurs VIALI
        <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-white relative">
          <NavAdmin />
          <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
            <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        // Layout Public avec mêmes couleurs VIALI
        <div className="flex flex-col min-h-screen w-full 
                        bg-gradient-to-br 
                        from-orange-50 
                        via-yellow-50 
                        to-white
                        text-white 
                        overflow-x-hidden">
          {!isLoginPage && <Header logoColor="#fff" />}
          <main className="flex-1 w-full px-4 md:px-6">
            <Outlet />
          </main>
          {!isLoginPage && <Footer />}
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;




// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
// import NavAdmin from "./components/Header/NavAdmin";
// import { I18nextProvider } from "react-i18next";
// import i18n from "./i18n";
// import React from "react";

// const App = () => {
//   const location = useLocation();

//   const adminPaths = [
//     "/createpost",
//     "/listeContacts",
//     "/listeRejoindre",
//     "/listePostulantsCommunity",
//     "/listPartners",
//     "/listeAbonnement",
//     "/platformPost",
//     "/valeurPost",
//     "/fondationPost",
//     "/motPresidentPost",
//     "/videoPost",
//     "/photoPost",
//     "/documentPost",
//     "/mediaPartenairePost",
//     "/programPost",
//     "/dashboardAdmin",
//     "/teamMessage",
//     "/missionPost",
//     "/activitiesPost",
//     "/homePost",
//     "/partnerPost",
//   ];

//   const isAdminPage = adminPaths.includes(location.pathname);
//   const isLoginPage = location.pathname === "/login";
//   const token = localStorage.getItem("access");

//   if (isAdminPage && !token) return <Navigate to="/login" replace />;

//   return (
//     <I18nextProvider i18n={i18n}>
//       {isAdminPage ? (
//         // 🎨 Layout Admin - Mêmes couleurs que DashboardAdmin
//         <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white relative overflow-hidden">
//           {/* Effets de fond lumineux - exactement comme DashboardAdmin */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#FDB71A] to-[#F47920] opacity-20 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-[#F47920] to-[#E84E1B] opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//             <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-[#E84E1B] to-[#FDB71A] opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
//           </div>

//           {/* Motif de points décoratifs - exactement comme DashboardAdmin */}
//           <div className="absolute inset-0 opacity-30 pointer-events-none">
//             <div className="absolute top-20 left-10 w-2 h-2 bg-[#F47920] rounded-full animate-ping"></div>
//             <div className="absolute top-40 right-20 w-3 h-3 bg-[#FDB71A] rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
//             <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-[#E84E1B] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
//             <div className="absolute bottom-20 right-1/4 w-3 h-3 bg-[#F47920] rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
//           </div>

//           <NavAdmin />
          
//           {/* Main container - SANS margin pour permettre le centrage complet */}
//           <main className="relative w-full min-h-screen">
//             <Outlet />
//           </main>
//         </div>
//       ) : (
//         // 🌐 Layout Public - Dégradé Viali avec particules
//         <div className="flex flex-col min-h-screen w-full relative
//                         bg-gradient-to-br 
//                         from-[#FDB71A] 
//                         via-[#F47920] 
//                         to-[#E84E1B]
//                         text-white 
//                         overflow-x-hidden">
          
//           {/* Effets de fond lumineux pour layout public */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             <div className="absolute -top-40 left-0 w-[600px] h-[600px] bg-[#FDB71A]/20 rounded-full blur-3xl animate-pulse"></div>
//             <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
//             <div className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-[#E84E1B]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
//           </div>

//           {/* Overlay avec texture */}
//           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
//             backgroundImage: `
//               repeating-linear-gradient(
//                 45deg,
//                 transparent,
//                 transparent 10px,
//                 rgba(255, 255, 255, 0.03) 10px,
//                 rgba(255, 255, 255, 0.03) 20px
//               )
//             `
//           }}></div>

//           {/* Particules décoratives */}
//           <div className="absolute top-32 left-10 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm pointer-events-none"></div>
//           <div className="absolute top-64 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
//           <div className="absolute top-96 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm pointer-events-none" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute bottom-64 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm pointer-events-none" style={{ animationDelay: '1.5s' }}></div>
//           <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-white/40 rounded-full animate-pulse shadow-sm pointer-events-none" style={{ animationDelay: '2s' }}></div>
          
//           {/* Header avec contraste pour la lisibilité */}
//           {!isLoginPage && (
//             <div className="relative z-10">
//               <Header logoColor="#ffffff" />
//             </div>
//           )}
          
//           {/* Contenu principal */}
//           <main className="relative flex-1 w-full z-10">
//             <Outlet />
//           </main>
          
//           {/* Footer */}
//           {!isLoginPage && (
//             <div className="relative z-10">
//               <Footer />
//             </div>
//           )}
//         </div>
//       )}
//     </I18nextProvider>
//   );
// };

// export default App;