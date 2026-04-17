import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import NavAdmin from "./components/Header/NavAdmin";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import React from "react";
import { trackAction } from "./utils/tracker";

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  // 🔹 Tracker automatique des visites
  React.useEffect(() => {
    trackAction({
      action_type: "visit",
      page: location.pathname,
    });
  }, [location.pathname]);

  // 🔹 Tracker global des clics
  React.useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const label = target.id || target.innerText || target.alt || "unknown";

      trackAction({
        action_type: "click",
        page: location.pathname,
        label,
        tag: target.tagName,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [location.pathname]);

  // 🔹 Tracker global des formulaires pour contact / mail
  React.useEffect(() => {
    const handleSubmit = (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      // Détecter le type de formulaire via data-action ou id
      const actionType = form.dataset.action || form.id;
      if (actionType === "contactForm") {
        trackAction({
          action_type: "contact_submit",
          page: location.pathname,
          label: "Contact Form",
        });
      } else if (actionType === "mailForm") {
        trackAction({
          action_type: "mail_sent",
          page: location.pathname,
          label: "Mail Form",
        });
      }
    };

    document.addEventListener("submit", handleSubmit);
    return () => document.removeEventListener("submit", handleSubmit);
  }, [location.pathname]);

  // ✅ Pages réservées à l'admin
  const adminPaths = [
    "/newsPost", "/listeContacts", "/listeRejoindre", "/listePostulantsCommunity",
    "/listPartners", "/listeAbonnement", "/platformPost", "/valeurPost",
    "/fondationPost", "/motPresidentPost", "/videoPost", "/photoPost",
    "/documentPost", "/mediaPartenairePost", "/programPost",
    "/dashboardAdmin", "/teamMessage", "/missionPost", "/activitiesPost",
    "/homePost",
    "/partnerPost", "/professionalAreaPost", "/thonRecipesPost", "/sardineRecipesPost",
    "/sardineProductPost", "/thonProductPost", "/capitaineProductPost"
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  return (
    <I18nextProvider i18n={i18n}>
      {/* 🎨 GLOBAL MASONRY CSS - Appliqué à TOUTES les pages */}
      <style>{`
        /* ============================================
           MASONRY LAYOUT GLOBAL - Grilles d'images
           ============================================ */
        
        /* Conteneur Masonry - Applique automatiquement le layout en colonnes */
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
          
          /* Responsive breakpoints */
          @media (min-width: 640px) {
            column-count: 2;
          }
          
          @media (min-width: 768px) {
            column-count: 3;
          }
          
          @media (min-width: 1024px) {
            column-count: 4;
          }
        }
        
        /* Items Masonry - Images en taille réelle */
        .masonry-item {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
        }
        
        /* Image en taille réelle avec aspect ratio préservé */
        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 0.75rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Hover effect */
        .masonry-item:hover img {
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Variantes de colonnes si besoin de forcer */
        .masonry-cols-2 {
          column-count: 1;
          @media (min-width: 640px) { column-count: 2; }
        }
        
        .masonry-cols-3 {
          column-count: 1;
          @media (min-width: 640px) { column-count: 2; }
          @media (min-width: 768px) { column-count: 3; }
        }
        
        .masonry-cols-4 {
          column-count: 1;
          @media (min-width: 640px) { column-count: 2; }
          @media (min-width: 768px) { column-count: 3; }
          @media (min-width: 1024px) { column-count: 4; }
        }
        
        /* Gap personnalisables */
        .masonry-gap-sm { column-gap: 0.75rem; }
        .masonry-gap-md { column-gap: 1.5rem; }
        .masonry-gap-lg { column-gap: 2rem; }
        
        /* Item spacing personnalisables */
        .masonry-item-sm { margin-bottom: 0.75rem; }
        .masonry-item-md { margin-bottom: 1.5rem; }
        .masonry-item-lg { margin-bottom: 2rem; }
      `}</style>

      {isAdminPage ? (
        <div className="flex h-screen w-screen overflow-hidden bg-white relative">
          <NavAdmin />
          <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 bg-white ml-80">
            <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">
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