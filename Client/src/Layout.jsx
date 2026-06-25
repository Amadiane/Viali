// import { Outlet, useLocation, Navigate } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Footer from "./components/Footer/Footer";
// import NavAdmin from "./components/Header/NavAdmin";
// import { I18nextProvider } from "react-i18next";
// import i18n from "./i18n";
// import React from "react";
// import { trackAction } from "./utils/tracker";

// const App = () => {
//   const location = useLocation();
//   const token = localStorage.getItem("access");

//   // 🔹 Tracker automatique des visites
//   React.useEffect(() => {
//     trackAction({
//       action_type: "visit",
//       page: location.pathname,
//     });
//   }, [location.pathname]);

//   // 🔹 Tracker global des clics
//   React.useEffect(() => {
//     const handleClick = (e) => {
//       const target = e.target;
//       const label = target.id || target.innerText || target.alt || "unknown";

//       trackAction({
//         action_type: "click",
//         page: location.pathname,
//         label,
//         tag: target.tagName,
//       });
//     };

//     document.addEventListener("click", handleClick);
//     return () => document.removeEventListener("click", handleClick);
//   }, [location.pathname]);

//   // 🔹 Tracker global des formulaires pour contact / mail
//   React.useEffect(() => {
//     const handleSubmit = (e) => {
//       const form = e.target;
//       if (!(form instanceof HTMLFormElement)) return;

//       // Détecter le type de formulaire via data-action ou id
//       const actionType = form.dataset.action || form.id;
//       if (actionType === "contactForm") {
//         trackAction({
//           action_type: "contact_submit",
//           page: location.pathname,
//           label: "Contact Form",
//         });
//       } else if (actionType === "mailForm") {
//         trackAction({
//           action_type: "mail_sent",
//           page: location.pathname,
//           label: "Mail Form",
//         });
//       }
//     };

//     document.addEventListener("submit", handleSubmit);
//     return () => document.removeEventListener("submit", handleSubmit);
//   }, [location.pathname]);

//   // ✅ Pages réservées à l'admin
//   const adminPaths = [
//     "/newsPost", "/listeContacts", "/listeRejoindre", "/listePostulantsCommunity",
//     "/listPartners", "/listeAbonnement", "/platformPost", "/valeurPost",
//     "/fondationPost", "/motPresidentPost", "/videoPost", "/photoPost",
//     "/documentPost", "/mediaPartenairePost", "/programPost",
//     "/dashboardAdmin", "/teamMessage", "/missionPost", "/activitiesPost",
//     "/homePost",
//     "/partnerPost", "/professionalAreaPost", "/thonRecipesPost", "/sardineRecipesPost",
//     "/sardineProductPost", "/thonProductPost", "/capitaineProductPost", "/gammePagePost",
//     "/rillettePost"
//   ];

//   const isAdminPage = adminPaths.includes(location.pathname);
//   const isLoginPage = location.pathname === "/login";

//   if (isAdminPage && !token) return <Navigate to="/login" replace />;

//   return (
//     <I18nextProvider i18n={i18n}>
//       {/* 🎨 GLOBAL MASONRY CSS - Appliqué à TOUTES les pages */}
//       <style>{`
//         /* ============================================
//            MASONRY LAYOUT GLOBAL - Grilles d'images
//            ============================================ */
        
//         /* Conteneur Masonry - Applique automatiquement le layout en colonnes */
//         .masonry-grid {
//           column-count: 1;
//           column-gap: 1.5rem;
          
//           /* Responsive breakpoints */
//           @media (min-width: 640px) {
//             column-count: 2;
//           }
          
//           @media (min-width: 768px) {
//             column-count: 3;
//           }
          
//           @media (min-width: 1024px) {
//             column-count: 4;
//           }
//         }
        
//         /* Items Masonry - Images en taille réelle */
//         .masonry-item {
//           break-inside: avoid;
//           page-break-inside: avoid;
//           margin-bottom: 1.5rem;
//           display: inline-block;
//           width: 100%;
//         }
        
//         /* Image en taille réelle avec aspect ratio préservé */
//         .masonry-item img {
//           width: 100%;
//           height: auto;
//           display: block;
//           border-radius: 0.75rem;
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
        
//         /* Hover effect */
//         .masonry-item:hover img {
//           transform: scale(1.02);
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
//                       0 10px 10px -5px rgba(0, 0, 0, 0.04);
//         }
        
//         /* Variantes de colonnes si besoin de forcer */
//         .masonry-cols-2 {
//           column-count: 1;
//           @media (min-width: 640px) { column-count: 2; }
//         }
        
//         .masonry-cols-3 {
//           column-count: 1;
//           @media (min-width: 640px) { column-count: 2; }
//           @media (min-width: 768px) { column-count: 3; }
//         }
        
//         .masonry-cols-4 {
//           column-count: 1;
//           @media (min-width: 640px) { column-count: 2; }
//           @media (min-width: 768px) { column-count: 3; }
//           @media (min-width: 1024px) { column-count: 4; }
//         }
        
//         /* Gap personnalisables */
//         .masonry-gap-sm { column-gap: 0.75rem; }
//         .masonry-gap-md { column-gap: 1.5rem; }
//         .masonry-gap-lg { column-gap: 2rem; }
        
//         /* Item spacing personnalisables */
//         .masonry-item-sm { margin-bottom: 0.75rem; }
//         .masonry-item-md { margin-bottom: 1.5rem; }
//         .masonry-item-lg { margin-bottom: 2rem; }
//       `}</style>

//       {isAdminPage ? (
//         <div className="flex h-screen w-screen overflow-hidden bg-white relative">
//           <NavAdmin />
//           <main className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 bg-white ml-80">
//             <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       ) : (
//         <div className="flex flex-col min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">
//           {!isLoginPage && <Header logoColor="#000" />}
//           <main className="flex-1 w-full px-4 md:px-6">
//             <Outlet />
//           </main>
//           {!isLoginPage && <Footer />}
//         </div>
//       )}
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
import React, { useState, useEffect } from "react";
import { trackAction } from "./utils/tracker";

const PREVIEW_STORAGE_KEY = "viali_preview_access";
const PREVIEW_PASSWORD = import.meta.env.VITE_PREVIEW_PASSWORD;

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  const [previewUnlocked, setPreviewUnlocked] = useState(
    () => localStorage.getItem(PREVIEW_STORAGE_KEY) === PREVIEW_PASSWORD
  );
  const [previewInput, setPreviewInput] = useState("");
  const [previewError, setPreviewError] = useState(false);

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
    "/sardineProductPost", "/thonProductPost", "/capitaineProductPost", "/gammePagePost",
    "/rillettePost"
  ];

  const isAdminPage = adminPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  if (isAdminPage && !token) return <Navigate to="/login" replace />;

  // 🔒 Gate "Coming Soon" — bloque tout sauf /login et les pages admin (déjà protégées par token)
  const isExemptFromGate = isLoginPage || isAdminPage;

  if (!previewUnlocked && !isExemptFromGate) {
    const handlePreviewSubmit = (e) => {
      e.preventDefault();
      if (previewInput === PREVIEW_PASSWORD) {
        localStorage.setItem(PREVIEW_STORAGE_KEY, previewInput);
        setPreviewUnlocked(true);
        setPreviewError(false);
      } else {
        setPreviewError(true);
      }
    };

    return (
      <div style={comingSoonStyles.container}>
        <div style={comingSoonStyles.card}>
          <h1 style={comingSoonStyles.title}>VIALI</h1>
          <p style={comingSoonStyles.subtitle}>Le site arrive très bientôt.</p>
          <p style={comingSoonStyles.text}>
            Nous préparons quelque chose de spécial pour vous.
          </p>

          <form onSubmit={handlePreviewSubmit} style={comingSoonStyles.form}>
            <input
              type="password"
              value={previewInput}
              onChange={(e) => setPreviewInput(e.target.value)}
              placeholder="Accès équipe"
              style={comingSoonStyles.input}
            />
            <button type="submit" style={comingSoonStyles.button}>
              Accéder
            </button>
          </form>
          {previewError && (
            <p style={comingSoonStyles.error}>Mot de passe incorrect.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <style>{`
        .masonry-grid {
          column-count: 1;
          column-gap: 1.5rem;
        }
        .masonry-item {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
        }
        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 0.75rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .masonry-item:hover img {
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                      0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .masonry-cols-2 { column-count: 1; }
        .masonry-cols-3 { column-count: 1; }
        .masonry-cols-4 { column-count: 1; }
        .masonry-gap-sm { column-gap: 0.75rem; }
        .masonry-gap-md { column-gap: 1.5rem; }
        .masonry-gap-lg { column-gap: 2rem; }
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

const comingSoonStyles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    fontFamily: "sans-serif",
    padding: "20px",
  },
  card: {
    textAlign: "center",
    maxWidth: "420px",
  },
  title: {
    color: "#f97316",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "8px",
    letterSpacing: "2px",
  },
  subtitle: {
    color: "#ffffff",
    fontSize: "1.25rem",
    marginBottom: "8px",
  },
  text: {
    color: "#94a3b8",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#fff",
    minWidth: "200px",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f97316",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#f87171",
    marginTop: "12px",
    fontSize: "0.9rem",
  },
};

export default App;