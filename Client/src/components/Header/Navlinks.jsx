import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown, Users, Image, Video, Handshake, Newspaper, Phone, Calendar, Info, Sparkles } from "lucide-react";
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
  const searchRef = useRef(null);
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
    { title: t("nav.news"), path: "/actualites", keywords: ["news", "actualités"], icon: Newspaper },
    { title: t("nav.president_word"), path: "/motPresident", keywords: ["président"], icon: Users },
    { title: t("nav.missions"), path: "/nosMissions", keywords: ["missions"], icon: Info },
    { title: t("nav.team"), path: "/notreEquipe", keywords: ["équipe"], icon: Users },
    { title: t("nav.calendrier"), path: "/programs", keywords: ["calendrier"], icon: Calendar },
    { title: t("nav.photos"), path: "/phototheque", keywords: ["photos"], icon: Image },
    { title: t("nav.videos"), path: "/videotheque", keywords: ["vidéos"], icon: Video },
    { title: t("nav.partenaires"), path: "/partner", keywords: ["partenaires"], icon: Handshake },
    { title: t("nav.acceuil"), path: "/Acceuil", keywords: ["acceuil"], icon: Newspaper },
    { title: t("nav.contact"), path: "/contacter-tamkine", keywords: ["contact"], icon: Phone },
    { title: t("nav.community"), path: "/community", keywords: ["communauté"], icon: Users },
    { title: t("nav.homePost"), path: "/homePost", keywords: ["Home"], icon: Users },
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
      page.title.toLowerCase() === searchTerm.toLowerCase() ||
      page.keywords.some(k => k.toLowerCase() === searchTerm.toLowerCase())
    );
    if (exactMatch) navigate(exactMatch.path);
    else navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
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
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
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
    { title: t("nav.home"), path: "/profesionnalarea" },
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
        { title: t("nav.R&D"), path: "/hi" },
        { title: t("nav.pointsdevente"), path: "/hi" },
      ]
    },
    { title: t("nav.contact"), path: "/contacternous" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; filter: blur(15px); }
          50% { opacity: 0.6; filter: blur(20px); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .logo-container {
          position: relative;
          animation: float-logo 4s ease-in-out infinite;
        }
        
        .logo-glow {
          position: absolute;
          inset: -10px;
          background: linear-gradient(135deg, #FFC727 0%, #F77F00 100%);
          border-radius: 24px;
          animation: glow-pulse 3s ease-in-out infinite;
          z-index: -1;
        }
        
        .nav-link {
          position: relative;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #FFC727, #F77F00);
          transition: width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border-radius: 2px;
        }
        
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        
        .dropdown-menu {
          animation: slide-down 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #FFC727 0%, #F77F00 100%);
          position: relative;
          overflow: hidden;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .btn-primary:hover::before {
          opacity: 1;
        }
        
        .btn-primary > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-orange-500/10" 
          : "bg-white"
      }`}>
        
        <div className="border-b border-orange-100/50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              
              {/* 🎯 LOGO + BASELINE */}
              <NavLink to="/home" className="flex items-center gap-3 group">
                <div className="logo-container">
                  <div className="logo-glow"></div>
                  <img 
                    src={logo} 
                    alt="VIALI" 
                    className="h-14 w-auto transition-all duration-500 group-hover:scale-110
                             filter drop-shadow-lg" 
                  />
                </div>
                {/* <div className="hidden sm:block border-l-2 border-orange-200 pl-3">
                  <p className="text-xs font-semibold text-gray-600 tracking-wider uppercase leading-tight"
                     style={{ fontFamily: "'Inter', sans-serif", maxWidth: '140px' }}>
                    De l'océan à votre assiette
                  </p>
                </div> */}
              </NavLink>

              {/* 🎯 NAVIGATION DESKTOP */}
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
                          nav-link px-5 py-2 text-sm font-bold uppercase
                          text-gray-700 hover:text-[#F77F00]
                          flex items-center gap-2
                          ${activeDropdown === index ? 'text-[#F77F00]' : ''}
                        `}>
                          <span>{item.title}</span>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-300 ${
                              activeDropdown === index ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        {activeDropdown === index && (
                          <div className="dropdown-menu absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[240px]
                                        bg-white rounded-xl shadow-2xl shadow-orange-500/10
                                        border border-orange-100 overflow-hidden">
                            {item.items.map((sub, i) => (
                              <NavLink
                                key={i}
                                to={sub.path}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-6 py-3.5 text-sm font-semibold text-gray-700
                                         hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50
                                         hover:text-[#F77F00] transition-all duration-300
                                         border-b border-orange-50 last:border-b-0
                                         hover:pl-8"
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
                        nav-link px-5 py-2 text-sm font-bold uppercase
                        ${isActive 
                          ? 'text-[#F77F00] active' 
                          : 'text-gray-700 hover:text-[#F77F00]'
                        }
                      `}
                    >
                      {item.title}
                    </NavLink>
                  );
                })}
              </nav>

              {/* 🎯 ACTIONS */}
              <div className="flex items-center gap-3">
                
                {/* Bouton À Propos */}
                {/* <button 
                  onClick={() => navigate("/motPresident")} 
                  className="hidden xl:flex items-center gap-2 px-6 py-2.5
                           btn-primary text-white text-sm font-bold uppercase
                           rounded-full shadow-lg shadow-orange-500/30
                           hover:shadow-xl hover:shadow-orange-500/40
                           hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <Info size={16} />
                  <span>À Propos</span>
                </button> */}

                {/* Search */}
                <button 
                  onClick={() => setSearchOpen(true)} 
                  className="p-3 rounded-xl bg-white border border-orange-200
                           hover:border-[#F77F00] hover:bg-orange-50
                           transition-all duration-300 shadow-sm hover:shadow-md
                           group"
                >
                  <Search size={20} className="text-[#F77F00] group-hover:scale-110 transition-transform" />
                </button>

                {/* Language */}
                <div className="hidden md:flex items-center gap-1 bg-white rounded-xl
                              border border-orange-200 p-1 shadow-sm">
                  <Globe size={16} className="text-[#F77F00] ml-2" />
                  {["fr", "en"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase
                                transition-all duration-300
                                ${language === lang 
                                  ? 'bg-gradient-to-r from-[#FFC727] to-[#F77F00] text-white shadow-md' 
                                  : 'text-gray-600 hover:text-[#F77F00] hover:bg-orange-50'
                                }`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Mobile Menu */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-3 rounded-xl bg-white border border-orange-200
                           hover:border-[#F77F00] hover:bg-orange-50
                           transition-all duration-300 shadow-sm"
                >
                  {mobileMenuOpen ? (
                    <X size={24} className="text-[#F77F00]" />
                  ) : (
                    <Menu size={24} className="text-[#F77F00]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`} 
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div className={`absolute top-0 right-0 h-full w-[90%] max-w-md
                       bg-white shadow-2xl transition-transform duration-500 overflow-y-auto
                       ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#FFC727] to-[#F77F00]
                        p-6 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <img src={logo} alt="VIALI" className="h-10 w-auto" />
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                MENU
              </h2>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30
                       transition-all duration-300"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          <nav className="p-6 space-y-3">
            {navItems.map((item, index) => {
              if (item.isDropdown) {
                return (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => toggleMobileDropdown(index)}
                      className="w-full flex items-center justify-between p-4
                               bg-gray-50 rounded-xl border border-orange-100
                               hover:border-[#F77F00] hover:shadow-md
                               transition-all duration-300"
                    >
                      <span className="font-bold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {item.title}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-[#F77F00] transition-transform duration-300 ${
                          mobileActiveDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${
                      mobileActiveDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="ml-4 space-y-2 mt-2">
                        {item.items.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => handleMobileNavClick(sub.path)}
                            className="w-full text-left px-4 py-3 rounded-xl
                                     bg-orange-50/50 hover:bg-orange-50
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
                  className="w-full text-left p-4
                           bg-gray-50 rounded-xl border border-orange-100
                           hover:border-[#F77F00] hover:shadow-md
                           transition-all duration-300 group"
                >
                  <span className="font-bold text-gray-800 group-hover:text-[#F77F00]
                               transition-colors" 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="sticky bottom-0 p-6 bg-white border-t border-orange-100">
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl">
              <Globe size={18} className="text-[#F77F00]" />
              <div className="flex gap-2 flex-1">
                {["fr", "en"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold uppercase
                              transition-all duration-300
                              ${language === lang
                                ? 'bg-gradient-to-r from-[#FFC727] to-[#F77F00] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:text-[#F77F00]'
                              }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl
                        border border-orange-100 overflow-hidden"
               style={{ animation: 'slide-down 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}>
            <form onSubmit={handleSearchSubmit} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Search size={24} className="text-[#F77F00]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 text-xl font-semibold text-gray-800 bg-transparent
                           border-none outline-none placeholder:text-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((result, idx) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleResultClick(result.path)}
                        className="w-full flex items-center gap-3 p-4 rounded-xl
                                 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50
                                 transition-all duration-300 text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100
                                      flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon size={20} className="text-[#F77F00]" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-[#F77F00]
                                     transition-colors"
                              style={{ fontFamily: "'Inter', sans-serif" }}>
                          {result.title}
                        </span>
                      </button>
                    );
                  })}
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