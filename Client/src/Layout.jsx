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
const LAUNCH_DATE = "2026-07-15T00:00:00";

const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("access");

  const [previewUnlocked, setPreviewUnlocked] = useState(
    () => localStorage.getItem(PREVIEW_STORAGE_KEY) === PREVIEW_PASSWORD
  );
  const [previewInput, setPreviewInput] = useState("");
  const [previewError, setPreviewError] = useState(false);

  React.useEffect(() => {
    trackAction({
      action_type: "visit",
      page: location.pathname,
    });
  }, [location.pathname]);

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

    return <ComingSoon onSubmit={handlePreviewSubmit} value={previewInput} onChange={setPreviewInput} error={previewError} />;
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

const ComingSoon = ({ onSubmit, value, onChange, error }) => {
  const [timeLeft, setTimeLeft] = useState({ days: "--", hours: "--", min: "--", sec: "--" });

  useEffect(() => {
    const target = new Date("2026-07-15T00:00:00").getTime();

    const update = () => {
      const now = new Date().getTime();
      let diff = target - now;
      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const sec = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours: String(hours).padStart(2, "0"),
        min: String(min).padStart(2, "0"),
        sec: String(sec).padStart(2, "0"),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f2e",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <svg
        style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "220px", opacity: 0.15 }}
        viewBox="0 0 680 220"
        preserveAspectRatio="none"
      >
        <path d="M0,140 Q170,90 340,140 T680,140 L680,220 L0,220 Z" fill="#D85A30" />
        <path d="M0,170 Q170,130 340,170 T680,170 L680,220 L0,220 Z" fill="#1D9E75" />
      </svg>

      <svg
        style={{ position: "absolute", top: "60px", right: "8%", width: "90px", height: "90px", opacity: 0.12 }}
        viewBox="0 0 100 60"
      >
        <ellipse cx="45" cy="30" rx="35" ry="16" fill="#ffffff" />
        <path d="M75,30 L98,15 L98,45 Z" fill="#ffffff" />
        <circle cx="20" cy="26" r="3" fill="#0a1f2e" />
      </svg>

      <svg
        style={{
          position: "absolute",
          top: "180px",
          left: "6%",
          width: "60px",
          height: "60px",
          opacity: 0.08,
          transform: "scaleX(-1)",
        }}
        viewBox="0 0 100 60"
      >
        <ellipse cx="45" cy="30" rx="35" ry="16" fill="#ffffff" />
        <path d="M75,30 L98,15 L98,45 Z" fill="#ffffff" />
        <circle cx="20" cy="26" r="3" fill="#0a1f2e" />
      </svg>

      <div style={{ position: "relative", zIndex: 1, fontSize: "36px", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>
        <span style={{ color: "#F0997B" }}>VIALI</span>
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "48px", height: "2px", background: "#F0997B", marginBottom: "24px" }} />

      <h1 style={{ position: "relative", zIndex: 1, fontSize: "24px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px" }}>
        Le lancement arrive bientôt
      </h1>
      <p
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "15px",
          color: "#B4D4C9",
          maxWidth: "380px",
          margin: "0 0 32px",
          lineHeight: 1.6,
        }}
      >
        Nous préparons quelque chose de spécial. Revenez très vite pour découvrir le nouveau site.
      </p>

      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "12px", marginBottom: "36px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { value: timeLeft.days, label: "jours" },
          { value: timeLeft.hours, label: "heures" },
          { value: timeLeft.min, label: "min" },
          { value: timeLeft.sec, label: "sec" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              padding: "14px 16px",
              minWidth: "64px",
            }}
          >
            <div style={{ fontSize: "24px", fontWeight: 600, color: "#ffffff" }}>{item.value}</div>
            <div style={{ fontSize: "11px", color: "#B4D4C9", marginTop: "2px" }}>{item.label}</div>
          </div>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        style={{ position: "relative", zIndex: 1, display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
      >
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Accès équipe"
          style={{
            width: "200px",
            padding: "10px 14px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.08)",
            border: "0.5px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#D85A30",
            color: "#ffffff",
            border: "none",
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Accéder
        </button>
      </form>
      {error && (
        <p style={{ position: "relative", zIndex: 1, color: "#F09595", marginTop: "12px", fontSize: "13px" }}>
          Mot de passe incorrect.
        </p>
      )}
    </div>
  );
};

export default App;