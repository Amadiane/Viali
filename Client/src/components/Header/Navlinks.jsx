import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";

const Navlinks = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "fr");
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  // ── Scroll listener : attaché UNE SEULE FOIS au montage, jamais ré-attaché ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Clic extérieur pour fermer le dropdown desktop : attaché une seule fois ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Touche Échap pour fermer recherche / menu mobile : attaché une seule fois ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setMobileActiveDropdown(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── Blocage du scroll body pendant que le menu mobile est ouvert ──
  // Effet dédié et isolé, avec cleanup garanti même si le composant est
  // démonté (changement de route) pendant que le menu est ouvert.
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup : si le composant disparaît (changement de page) alors que
    // le menu était ouvert, on remet TOUJOURS le scroll body à la normale.
    // C'est ce filet de sécurité qui manquait et qui obligeait à recharger
    // la page pour retrouver un site qui répond normalement.
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // ── Fermer le menu mobile et les dropdowns automatiquement à chaque ──
  // ── changement de route, pour éviter tout état "collé" après navigation ──
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileActiveDropdown(null);
    setActiveDropdown(null);
    setSearchOpen(false);
    document.body.style.overflow = "";
  }, [location.pathname]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const allPages = [
    { title: t("nav.home") || "Accueil", path: "/home",
      keywords: ["accueil", "home", "viali", "nouveau produit", "voir les produits",
                 "tartine", "capitaine", "contactez-nous", "slider", "carousel",
                 "dernières actualités", "partenaires", "gamme", "nos produits"] },

    { title: t("nav.missions") || "À propos", path: "/nosMissions",
      keywords: ["missions", "valeurs", "à propos", "apropos", "about",
                 "notre mission", "nos valeurs", "vision", "engagement",
                 "équipe viali", "qui sommes-nous", "histoire", "objectifs"] },

    { title: t("nav.news") || "Actualités", path: "/actualites",
      keywords: ["actualités", "news", "articles", "blog",
                 "dernières actualités", "dernière actualité", "dernieres actualites",
                 "presse", "communiqué", "événement", "annonce", "voir tout"] },

    { title: t("nav.rillettes") || "Rillettes", path: "/rillettes",
      keywords: ["rillettes", "sardine", "sardines", "poisson", "conserve",
                 "produits sardine", "gamme sardine", "boîte", "huile",
                 "ingrédients", "recette sardine"] },

    { title: t("nav.sauces") || "Sauces", path: "/sauces",
      keywords: ["sauces", "thon", "capitaine", "gingembre", "épices",
                 "tartine", "produits thon", "capitaine gingembré",
                 "gamme sauces", "recette thon"] },

    { title: t("nav.R&D") || "Recherche & Développement", path: "/professionalArea",
      keywords: ["recherche", "r&d", "développement", "innovation", "professionnel",
                 "espace professionnel", "partenariat", "collaboration",
                 "scientifique", "laboratoire", "investissement"] },

    { title: t("nav.pointsdevente") || "Points de Vente", path: "/salesPoints",
      keywords: ["points de vente", "vente", "distribution", "trouver",
                 "localisation", "carte", "magasin", "boutique",
                 "supermarché", "grossiste", "où acheter", "conakry"] },

    { title: t("nav.contact") || "Nous contacter", path: "/contacternous",
      keywords: ["contact", "message", "email", "téléphone", "nous contacter",
                 "envoyer", "formulaire", "adresse", "horaires", "whatsapp"] },

    { title: t("nav.partenaires") || "Partenaires", path: "/partner",
      keywords: ["partenaires", "partners", "nos partenaires",
                 "collaboration", "ils nous font confiance"] },

    { title: t("nav.team") || "Notre Équipe", path: "/notreEquipe",
      keywords: ["équipe", "team", "collaborateurs", "notre équipe",
                 "membres", "staff", "direction"] },
  ];

  const handleSearchChange = async (value) => {
    setSearchTerm(value);
    const q = value.trim();
    if (q.length === 0) { setSearchResults([]); return; }

    // Pages statiques (navigation)
    const staticResults = allPages
      .filter(page =>
        page.title.toLowerCase().includes(q.toLowerCase()) ||
        page.keywords.some(k => k.toLowerCase().includes(q.toLowerCase())) ||
        page.path.toLowerCase().includes(q.toLowerCase())
      )
      .map(p => ({ ...p, type: "Page" }));

    // Contenu dynamique depuis Django (tous les modèles)
    if (q.length >= 2) {
      try {
        const res = await fetch(`${CONFIG.API_SEARCH}?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const dynamic = await res.json();
          // Fusionner sans doublons (même path+title)
          const seen = new Set(staticResults.map(r => r.title + r.path));
          const merged = [
            ...staticResults,
            ...dynamic.filter(d => !seen.has(d.title + d.path))
          ];
          setSearchResults(merged.slice(0, 8));
          return;
        }
      } catch { /* fallback silencieux */ }
    }
    setSearchResults(staticResults.slice(0, 6));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim().toLowerCase();
    if (!q) return;
    // Cherche d'abord un match exact, sinon prend le premier résultat
    const exactMatch = allPages.find(p => p.title.toLowerCase() === q);
    const firstResult = allPages.find(p =>
      p.title.toLowerCase().includes(q) ||
      p.keywords.some(k => k.toLowerCase().includes(q))
    );
    const target = exactMatch || firstResult;
    if (target) navigate(target.path);
    setSearchTerm(""); setSearchOpen(false); setSearchResults([]); setMobileMenuOpen(false);
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchTerm(""); setSearchOpen(false); setSearchResults([]); setMobileMenuOpen(false);
  };

  const handleMouseEnter = (index) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(index);
  };
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };
  const toggleMobileDropdown = (index) => {
    setMobileActiveDropdown(mobileActiveDropdown === index ? null : index);
  };
  const handleMobileNavClick = (path) => {
    setMobileMenuOpen(false);
    setMobileActiveDropdown(null);
    document.body.style.overflow = "";
    navigate(path);
  };

  const navItems = [
    { title: t("nav.home"),    path: "/home" },
    { title: t("nav.missions"), path: "/nosMissions" },
    { title: t("nav.product"), path: "/productsPage" },
    { title: t("nav.news"), path: "/actualites" },
    {
      title: t("nav.profesionnalarea"),
      isDropdown: true,
      items: [
        { title: t("nav.R&D"),          path: "/professionalArea" },
        { title: t("nav.pointsdevente"), path: "/salesPoints" },
      ]
    },
    { title: t("nav.contact"), path: "/contacternous" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

        @keyframes glow-breath {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shine-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shimmer-text {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .nav-item {
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          letter-spacing: -0.01em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -6px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #F77F00, #FFC727);
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border-radius: 2px;
        }
        .nav-item:hover::after,
        .nav-item.active::after { transform: scaleX(1); }
        .nav-item:hover { color: #F77F00; }

        /* ── Logo texte VIALI ── */
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .viali-logo-text {
          font-family: 'Syne', 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--color-text-primary, #111);
          display: inline-block;
          position: relative;
          transition: transform 0.25s ease;
        }
        @media (min-width: 640px) {
          .viali-logo-text { font-size: 1.75rem; }
        }
        .viali-logo-text::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0; right: 0;
          height: 2px;
          background: #FF8C00;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .group:hover .viali-logo-text { transform: translateY(-1px); }
        .group:hover .viali-logo-text::after { transform: scaleX(1); }

        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(247,127,0,0.15);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.85);
          border-color: rgba(247,127,0,0.3);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px -6px rgba(247,127,0,0.2);
        }

        .dropdown-panel {
          animation: slide-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }

        .shine-effect { position: relative; overflow: hidden; }
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shine-sweep 3s infinite;
        }
      `}</style>

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl shadow-lg shadow-orange-500/5"
          : "bg-white/90 backdrop-blur-sm"
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-[56px] sm:h-[64px] lg:h-[72px]">

            {/* ── LOGO VIALI ── */}
            <NavLink to="/home" className="group relative z-10" style={{ textDecoration: "none" }}>
              <span className="viali-logo-text">
                <span style={{ color: "#FF8C00" }}>V</span>IALI
              </span>
            </NavLink>

            {/* ── NAVIGATION ── */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item, index) => {
                if (item.isDropdown) {
                  return (
                    <div key={index} className="relative"
                         onMouseEnter={() => handleMouseEnter(index)}
                         onMouseLeave={handleMouseLeave}>
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                        className={`nav-item px-5 py-2.5 text-[13px] uppercase text-gray-700 flex items-center gap-1.5 ${activeDropdown === index ? "text-[#F77F00]" : ""}`}>
                        <span>{item.title}</span>
                        <ChevronDown size={13}
                          className={`transition-all duration-300 ${activeDropdown === index ? "rotate-180" : ""}`}
                          strokeWidth={2.5}/>
                      </button>
                      {activeDropdown === index && (
                        <div className="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] bg-white/90 rounded-xl shadow-2xl shadow-orange-500/10 border border-orange-100/60 overflow-hidden">
                          {item.items.map((sub, i) => (
                            <NavLink key={i} to={sub.path} onClick={() => setActiveDropdown(null)}
                              className="block px-5 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-orange-50/60 hover:to-yellow-50/60 hover:text-[#F77F00] transition-all duration-300 border-b border-orange-50/40 last:border-b-0 hover:px-6"
                              style={{ fontFamily: "'Inter', sans-serif" }}>
                              {sub.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <NavLink key={index} to={item.path}
                    className={({ isActive }) => `nav-item px-5 py-2.5 text-[13px] uppercase ${isActive ? "text-[#F77F00] active" : "text-gray-700"}`}>
                    {item.title}
                  </NavLink>
                );
              })}
            </nav>

            {/* ── ACTIONS ── */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">

              {/* Search */}
              <button type="button" onClick={() => setSearchOpen(true)}
                className="glass-card p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 group">
                <Search size={16} className="text-[#F77F00] group-hover:scale-110 transition-transform sm:w-[18px] sm:h-[18px]" strokeWidth={2.5}/>
              </button>

              {/* Language */}
              <div className="hidden md:flex items-center gap-1 glass-card rounded-xl p-1">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                  <Globe size={14} className="text-[#F77F00]" strokeWidth={2.5}/>
                </div>
                {["fr", "en"].map((lang) => (
                  <button key={lang} type="button" onClick={() => changeLanguage(lang)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all duration-300 ${
                      language === lang
                        ? "bg-gradient-to-r from-[#FFC727] to-[#F77F00] text-white shadow-md shine-effect"
                        : "text-gray-600 hover:text-[#F77F00] hover:bg-orange-50/50"
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {lang}
                  </button>
                ))}
              </div>

              {/* Mobile burger */}
              <button type="button" onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden glass-card p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300">
                {mobileMenuOpen
                  ? <X size={18} className="text-[#F77F00]" strokeWidth={2.5}/>
                  : <Menu size={18} className="text-[#F77F00]" strokeWidth={2.5}/>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Ligne décorative */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-200/30 to-transparent"></div>
      </header>

      {/* ── MOBILE MENU ── */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
             onClick={() => setMobileMenuOpen(false)}></div>

        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Header mobile */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#FFC727] to-[#F77F00] p-3.5 flex items-center justify-between shadow-lg">
            <h2 style={{ fontFamily:"'Syne', 'Plus Jakarta Sans', sans-serif", fontWeight:800, fontSize:"1.3rem", color:"white", letterSpacing:"-0.03em", lineHeight:1 }}>
                <span style={{ opacity:0.85 }}>V</span>IALI
            </h2>
            <button type="button" onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all">
              <X size={18} className="text-white" strokeWidth={2.5}/>
            </button>
          </div>

          <nav className="p-3.5 space-y-2">
            {navItems.map((item, index) => {
              if (item.isDropdown) {
                return (
                  <div key={index} className="space-y-1.5">
                    <button type="button" onClick={() => toggleMobileDropdown(index)}
                      className="w-full flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-orange-100/50 hover:border-orange-200 hover:shadow-sm transition-all duration-300">
                      <span className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {item.title}
                      </span>
                      <ChevronDown size={16} strokeWidth={2.5}
                        className={`text-[#F77F00] transition-transform duration-300 ${mobileActiveDropdown === index ? "rotate-180" : ""}`}/>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${mobileActiveDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="ml-2.5 space-y-1 mt-1">
                        {item.items.map((sub, i) => (
                          <button key={i} type="button" onClick={() => handleMobileNavClick(sub.path)}
                            className="w-full text-left px-3.5 py-2 rounded-lg text-sm bg-orange-50/40 hover:bg-orange-50 text-gray-700 hover:text-[#F77F00] font-semibold transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}>
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <button key={index} type="button" onClick={() => handleMobileNavClick(item.path)}
                  className="w-full text-left p-2.5 bg-gray-50 rounded-lg border border-orange-100/50 hover:border-orange-200 hover:shadow-sm transition-all duration-300">
                  <span className="font-bold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Language mobile */}
          <div className="sticky bottom-0 p-3.5 bg-white border-t border-orange-100/50">
            <div className="glass-card rounded-lg p-2.5">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Globe size={14} className="text-[#F77F00]" strokeWidth={2.5}/>
                <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Langue</span>
              </div>
              <div className="flex gap-2">
                {["fr", "en"].map((lang) => (
                  <button key={lang} type="button" onClick={() => changeLanguage(lang)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-300 ${
                      language === lang
                        ? "bg-gradient-to-r from-[#FFC727] to-[#F77F00] text-white shadow-md"
                        : "bg-white text-gray-600 border border-orange-100"
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH MODAL ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"
               onClick={() => setSearchOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-2xl border border-orange-100/50 overflow-hidden"
               style={{ animation: "slide-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)" }}>
            <form onSubmit={handleSearchSubmit} className="p-4 sm:p-7">
              <div className="flex items-center gap-2.5 sm:gap-4 mb-3 sm:mb-5">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search size={18} className="text-[#F77F00] sm:w-[22px] sm:h-[22px]" strokeWidth={2.5}/>
                </div>
                <input type="text" value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 text-base sm:text-lg font-semibold text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-400"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  autoFocus/>
                <button type="button" onClick={() => setSearchOpen(false)}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-orange-50 transition-colors flex-shrink-0">
                  <X size={16} className="text-gray-500 sm:w-[18px] sm:h-[18px]" strokeWidth={2.5}/>
                </button>
              </div>
              {searchTerm.trim().length > 0 && (
                <div className="space-y-1 sm:space-y-1.5 max-h-80 sm:max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, idx) => (
                      <button key={idx} type="button" onClick={() => handleResultClick(result.path)}
                        className="w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-orange-50 transition-all duration-200 text-left border border-transparent hover:border-orange-100">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#F77F00] font-bold text-xs">{result.title.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {result.title}
                          </p>
                          {result.type && (
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                                  style={{ background: "rgba(255,140,0,0.1)", color: "#F77F00" }}>
                              {result.type}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#F77F00] font-semibold flex-shrink-0">→</span>
                      </button>
                    ))
                  ) : (
                    <div className="py-4 sm:py-6 text-center">
                      <p className="text-xs sm:text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Aucun résultat pour "<strong style={{ color: "#333" }}>{searchTerm}</strong>"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navlinks;