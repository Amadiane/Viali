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
    "/thonProductPost",
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";
  const token = localStorage.getItem("access");

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  return (
    <I18nextProvider i18n={i18n}>
      {isAdminPage ? (
        // Layout Admin avec background blanc
        <div className="flex h-screen w-screen overflow-hidden bg-white relative">
          <NavAdmin />
          <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
            <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        // Layout Public avec background blanc
        <div className="flex flex-col min-h-screen w-full 
                        bg-white
                        text-gray-900 
                        overflow-x-hidden">
          {!isLoginPage && <Header logoColor="#000" />}
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