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
//   ];

//   const isAdminPage = adminPaths.includes(location.pathname);
//   const isLoginPage = location.pathname === "/login";
//   const token = localStorage.getItem("access");

//   if (isAdminPage && !token) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <I18nextProvider i18n={i18n}>
//       {/* 🌌 Fond global avec dégradé sombre type NBA */}
//       <div
//         className={`flex flex-col min-h-screen w-full text-white overflow-x-hidden ${
//           isAdminPage
//             ? "bg-white text-gray-900"
//             : "bg-gradient-to-b from-[#0a0e27] via-[#0b123a] to-[#050817]"
//         }`}
//       >
//         {/* Header visible uniquement sur les pages publiques */}
//         {!isAdminPage && !isLoginPage && <Header />}

//         {/* Sidebar admin */}
//         {/* {isAdminPage && (
//           <div className="w-[250px] bg-white text-gray-900 p-5 fixed h-full shadow-lg">
//             <NavAdmin />
//           </div>
//         )} */}
//         {isAdminPage && (
//         <div
//           className="fixed top-0 left-0 h-screen w-[230px] bg-white text-gray-900 
//                     shadow-xl border-r border-gray-200 z-50 flex flex-col justify-start items-stretch 
//                     m-0 p-0 overflow-y-auto"
//           style={{ transform: "none", rotate: "0deg" }}
//         >
//           <div className="px-0 py-0">
//           <NavAdmin />  
//           </div>
//         </div>
//       )}



//         {/* Contenu principal */}
//         <main
//   className={`flex-1 w-full ${
//     isAdminPage ? "ml-[220px] bg-gray-50 text-gray-900" : ""
//   } overflow-auto`}
// >
// <div className="max-w-[1600px] mx-auto w-full"></div>
//           <Outlet />
          
//         </main>

//         {/* Footer visible uniquement sur les pages publiques */}
//         {!isAdminPage && !isLoginPage && <Footer />}
//       </div>
//     </I18nextProvider>
//   );
// };

// export default App;




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
        // 🎯 Layout Admin - Fond sombre + Sidebar
        <div className="flex h-screen w-screen overflow-hidden bg-[#0a0e27]">
          {/* Sidebar Admin fixe */}
          <NavAdmin />
          
          {/* Zone de contenu principal avec scroll - CENTRÉ */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
            <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        // 🌐 Layout Public - Header + Footer
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-[#0a0e27] via-[#0b123a] to-[#050817] text-white overflow-x-hidden">
          {!isLoginPage && <Header />}
          
          <main className="flex-1 w-full">
            <Outlet />
          </main>
          
          {!isLoginPage && <Footer />}
        </div>
      )}
    </I18nextProvider>
  );
};
    
export default App;