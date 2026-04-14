import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useTranslation } from "react-i18next";

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
  const dropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setMobileActiveDropdown(null);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, [searchOpen, mobileMenuOpen]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const allPages = [
    { title: t("nav.news"), path: "/actualites", keywords: ["news", "actualités"] },
    { title: t("nav.missions"), path: "/nosMissions", keywords: ["missions"] },
    { title: t("nav.team"), path: "/notreEquipe", keywords: ["équipe"] },
    { title: t("nav.partenaires"), path: "/partner", keywords: ["partenaires"] },
  ];

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 1) {
      const results = allPages.filter(page =>
        page.title.toLowerCase().includes(value.toLowerCase()) ||
        page.keywords.some(keyword => keyword.toLowerCase().includes(value.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(results);
    } else setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const exactMatch = allPages.find(page =>
      page.title.toLowerCase() === searchTerm.toLowerCase()
    );
    if (exactMatch) navigate(exactMatch.path);
    setSearchTerm("");
    setSearchOpen(false);
    setSearchResults([]);
    setMobileMenuOpen(false);
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchTerm("");
    setSearchOpen(false);
    setSearchResults([]);
    setMobileMenuOpen(false);
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
    navigate(path);
    setMobileMenuOpen(false);
    setMobileActiveDropdown(null);
  };

  const navItems = [
    { title: t("nav.home"), path: "/home"},
    {
      title: t("nav.Viali"),
      isDropdown: true,
      items: [
        { title: t("nav.missions"), path: "/nosMissions" },
        { title: t("nav.team"), path: "/notreEquipe" },
        { title: t("nav.partenaires"), path: "/partner" },
      ]
    },
    {
      title: t("nav.product"),
      isDropdown: true,
      items: [
        { title: t("nav.rillettes"), path: "/rillettes" },
        { title: t("nav.sauces"), path: "/sauces" },
      ]
    },
    { title: t("nav.news"), path: "/actualites" },
    {
      title: t("nav.profesionnalarea"),
      isDropdown: true,
      items: [
        { title: t("nav.R&D"), path: "/professionalArea" },
        { title: t("nav.pointsdevente"), path: "/salesPoints" },
      ]
    },
    { title: t("nav.contact"), path: "/contacternous" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        @keyframes glow-breath {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes shine-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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
          bottom: -6px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #F77F00, #FFC727);
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border-radius: 2px;
        }
        
        .nav-item:hover::after,
        .nav-item.active::after {
          transform: scaleX(1);
        }
        
        .nav-item:hover {
          color: #F77F00;
        }
        
        .logo-wrapper {
          position: relative;
          animation: subtle-float 4s ease-in-out infinite;
        }
        
        .logo-glow {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 199, 39, 0.4), transparent 70%);
          animation: glow-breath 3s ease-in-out infinite;
          z-index: -1;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(247, 127, 0, 0.15);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.85);
          border-color: rgba(247, 127, 0, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px -6px rgba(247, 127, 0, 0.2);
        }
        
        .dropdown-panel {
          animation: slide-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }
        
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shine-sweep 3s infinite;
        }
      `}</style>

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/70 backdrop-blur-xl shadow-lg shadow-orange-500/5" 
          : "bg-white/90 backdrop-blur-sm"
      }`}>
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* 🎯 LOGO OPTIMISÉ - Taille parfaite */}
            <NavLink to="/home" className="group relative z-10">
              <div className="logo-wrapper">
                <div className="logo-glow"></div>
                <div className="relative w-14 h-14 rounded-full overflow-hidden 
                              shadow-xl shadow-orange-500/20
                              ring-1 ring-orange-200/50 ring-offset-2
                              transition-all duration-500
                              group-hover:ring-orange-300
                              group-hover:ring-offset-3
                              group-hover:shadow-2xl
                              group-hover:shadow-orange-500/30
                              group-hover:scale-105">
                  <img 
                    src={logo} 
                    alt="VIALI" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </NavLink>

            {/* 🎯 NAVIGATION MINIMALISTE ÉLÉGANTE */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item, index) => {
                if (item.isDropdown) {
                  return (
                    <div 
                      key={index} 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(index)} 
                      onMouseLeave={handleMouseLeave}
                    >
                      <button className={`
                        nav-item px-5 py-2.5 text-[13px] uppercase
                        text-gray-700
                        flex items-center gap-1.5
                        ${activeDropdown === index ? 'text-[#F77F00]' : ''}
                      `}>
                        <span>{item.title}</span>
                        <ChevronDown 
                          size={13} 
                          className={`transition-all duration-300 ${
                            activeDropdown === index ? 'rotate-180' : ''
                          }`} 
                          strokeWidth={2.5}
                        />
                      </button>
                      
                      {activeDropdown === index && (
                        <div className="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px]
                                      bg-white/90 rounded-xl shadow-2xl shadow-orange-500/10
                                      border border-orange-100/60 overflow-hidden">
                          {item.items.map((sub, i) => (
                            <NavLink
                              key={i}
                              to={sub.path}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-5 py-3 text-[13px] font-semibold text-gray-700
                                       hover:bg-gradient-to-r hover:from-orange-50/60 hover:to-yellow-50/60
                                       hover:text-[#F77F00] transition-all duration-300
                                       border-b border-orange-50/40 last:border-b-0
                                       hover:px-6"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {sub.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => `
                      nav-item px-5 py-2.5 text-[13px] uppercase
                      ${isActive ? 'text-[#F77F00] active' : 'text-gray-700'}
                    `}
                  >
                    {item.title}
                  </NavLink>
                );
              })}
            </nav>

            {/* 🎯 ACTIONS PREMIUM */}
            <div className="flex items-center gap-2.5">
              
              {/* Search */}
              <button 
                onClick={() => setSearchOpen(true)} 
                className="glass-card p-2.5 rounded-xl transition-all duration-300 group"
              >
                <Search size={18} className="text-[#F77F00] group-hover:scale-110 transition-transform" 
                        strokeWidth={2.5} />
              </button>

              {/* Language */}
              <div className="hidden md:flex items-center gap-1 glass-card rounded-xl p-1">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg
                              flex items-center justify-center">
                  <Globe size={14} className="text-[#F77F00]" strokeWidth={2.5} />
                </div>
                {["fr", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase
                              transition-all duration-300
                              ${language === lang 
                                ? 'bg-gradient-to-r from-[#FFC727] to-[#F77F00] text-white shadow-md shine-effect' 
                                : 'text-gray-600 hover:text-[#F77F00] hover:bg-orange-50/50'
                              }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden glass-card p-2.5 rounded-xl transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-[#F77F00]" strokeWidth={2.5} />
                ) : (
                  <Menu size={20} className="text-[#F77F00]" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ligne subtile */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-200/30 to-transparent"></div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}>
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`} 
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div className={`absolute top-0 right-0 h-full w-[90%] max-w-sm
                       bg-white shadow-2xl transition-transform duration-500 overflow-y-auto
                       ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#FFC727] to-[#F77F00]
                        p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
                <img src={logo} alt="VIALI" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-black text-white" 
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                MENU
              </h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
            >
              <X size={22} className="text-white" strokeWidth={2.5} />
            </button>
          </div>

          <nav className="p-5 space-y-2.5">
            {navItems.map((item, index) => {
              if (item.isDropdown) {
                return (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => toggleMobileDropdown(index)}
                      className="w-full flex items-center justify-between p-3.5
                               bg-gray-50 rounded-xl border border-orange-100/50
                               hover:border-orange-200 hover:shadow-sm
                               transition-all duration-300"
                    >
                      <span className="font-bold text-gray-800 text-sm" 
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {item.title}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#F77F00] transition-transform duration-300 ${
                          mobileActiveDropdown === index ? "rotate-180" : ""
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${
                      mobileActiveDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="ml-3 space-y-1.5 mt-1.5">
                        {item.items.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => handleMobileNavClick(sub.path)}
                            className="w-full text-left px-4 py-2.5 rounded-lg text-sm
                                     bg-orange-50/40 hover:bg-orange-50
                                     text-gray-700 hover:text-[#F77F00]
                                     font-semibold transition-all duration-300"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleMobileNavClick(item.path)}
                  className="w-full text-left p-3.5
                           bg-gray-50 rounded-xl border border-orange-100/50
                           hover:border-orange-200 hover:shadow-sm
                           transition-all duration-300"
                >
                  <span className="font-bold text-gray-800 text-sm" 
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="sticky bottom-0 p-5 bg-white border-t border-orange-100/50">
            <div className="glass-card rounded-xl p-3.5">
              <div className="flex items-center justify-center gap-2 mb-2.5">
                <Globe size={16} className="text-[#F77F00]" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-gray-600"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                  Langue
                </span>
              </div>
              <div className="flex gap-2">
                {["fr", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase
                              transition-all duration-300
                              ${language === lang
                                ? 'bg-gradient-to-r from-[#FFC727] to-[#F77F00] text-white shadow-md'
                                : 'bg-white text-gray-600 border border-orange-100'
                              }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={() => setSearchOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-2xl 
                        shadow-2xl border border-orange-100/50 overflow-hidden"
               style={{ animation: 'slide-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}>
            <form onSubmit={handleSearchSubmit} className="p-7">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 bg-gradient-to-br from-orange-100 to-yellow-100
                              rounded-xl flex items-center justify-center">
                  <Search size={22} className="text-[#F77F00]" strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 text-lg font-semibold text-gray-800 bg-transparent
                           border-none outline-none placeholder:text-gray-400"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  <X size={18} className="text-gray-500" strokeWidth={2.5} />
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full flex items-center gap-3.5 p-3.5 rounded-xl
                               hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-yellow-50/50
                               transition-all duration-300 text-left
                               border border-transparent hover:border-orange-200/40"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-yellow-100
                                    flex items-center justify-center">
                        <span className="text-[#F77F00] font-bold text-base">
                          {result.title.charAt(0)}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700 text-sm"
                            style={{ fontFamily: "'Inter', sans-serif" }}>
                        {result.title}
                      </span>
                    </button>
                  ))}
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