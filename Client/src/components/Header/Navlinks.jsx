// import React, { useState, useEffect, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { Search, Menu, X, Globe, ChevronDown, Users, Image, Video, Handshake, Newspaper, Phone, Calendar, Info } from "lucide-react";
// import logo from "../../assets/logo.jpg";
// import { useTranslation } from "react-i18next";

// const Navlinks = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [searchResults, setSearchResults] = useState([]);
//   const { i18n, t } = useTranslation();
//   const [language, setLanguage] = useState(i18n.language || "fr");
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const searchRef = useRef(null);
//   const dropdownTimeoutRef = useRef(null);

//   // Détection du scroll et fermeture des menus
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
//     };
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape' && searchOpen) {
//         setSearchOpen(false);
//         setSearchResults([]);
//         setSearchTerm("");
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleKeyDown);
//       if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     };
//   }, [searchOpen]);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     setLanguage(lang);
//   };

//   // 🔍 Pages pour la recherche
//   const allPages = [
//     { title: t("nav.news"), path: "/actualites", keywords: ["news", "actualités"], icon: Newspaper },
//     { title: t("nav.president_word"), path: "/motPresident", keywords: ["président"], icon: Users },
//     { title: t("nav.missions"), path: "/nosMissions", keywords: ["missions"], icon: Info },
//     { title: t("nav.team"), path: "/notreEquipe", keywords: ["équipe"], icon: Users },
//     { title: t("nav.calendrier"), path: "/programs", keywords: ["calendrier"], icon: Calendar },
//     { title: t("nav.photos"), path: "/phototheque", keywords: ["photos"], icon: Image },
//     { title: t("nav.videos"), path: "/videotheque", keywords: ["vidéos"], icon: Video },
//     { title: t("nav.partenaires"), path: "/partner", keywords: ["partenaires"], icon: Handshake },
//     { title: t("nav.medias_partners"), path: "/mediaPartenaire", keywords: ["médias"], icon: Newspaper },
//     { title: t("nav.contact"), path: "/contacter-tamkine", keywords: ["contact"], icon: Phone },
//     { title: t("nav.community"), path: "/community", keywords: ["communauté"], icon: Users },
//   ];

//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     if (value.trim().length > 1) {
//       const results = allPages.filter(page => 
//         page.title.toLowerCase().includes(value.toLowerCase()) ||
//         page.keywords.some(keyword => keyword.toLowerCase().includes(value.toLowerCase()))
//       ).slice(0, 5);
//       setSearchResults(results);
//     } else setSearchResults([]);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;
//     const exactMatch = allPages.find(page =>
//       page.title.toLowerCase() === searchTerm.toLowerCase() ||
//       page.keywords.some(k => k.toLowerCase() === searchTerm.toLowerCase())
//     );
//     if (exactMatch) navigate(exactMatch.path);
//     else navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
//     setSearchTerm(""); setSearchOpen(false); setSearchResults([]);
//   };

//   const handleMouseEnter = (index) => {
//     if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
//     setActiveDropdown(index);
//   };
//   const handleMouseLeave = () => {
//     dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
//   };
//   const handleResultClick = (path) => {
//     navigate(path);
//     setSearchTerm(""); setSearchOpen(false); setSearchResults([]); setMobileMenuOpen(false);
//   };

//   const navItems = [
//     { title: t("nav.news"), path: "/actualites", icon: Newspaper },
//     {
//       title: t("nav.club"),
//       isDropdown: true,
//       icon: Users,
//       items: [
//         { title: t("nav.president_word"), path: "/motPresident" },
//         { title: t("nav.missions"), path: "/nosMissions" },
//         { title: t("nav.team"), path: "/notreEquipe" },
//       ]
//     },
//     { title: t("nav.calendrier"), path: "/programs", icon: Calendar },
//     {
//       title: t("nav.medias"),
//       isDropdown: true,
//       icon: Video,
//       items: [
//         { title: t("nav.photos"), path: "/phototheque" },
//         { title: t("nav.videos"), path: "/videotheque" },
//       ]
//     },
//     { title: t("nav.partenaires"), path: "/partner", icon: Handshake },
//     {
//       title: t("nav.join_us"),
//       isDropdown: true,
//       icon: Users,
//       items: [
//         { title: t("nav.contact"), path: "/contacter-tamkine" },
//         { title: t("nav.community"), path: "/community" },
//       ]
//     },
//     { title: t("nav.medias_partners"), path: "/mediaPartenaire", icon: Newspaper },
//   ];

//   return (
//     <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0e27]/95 backdrop-blur-lg shadow-2xl shadow-orange-500/10" : "bg-[#0a0e27]"}`}>
//       <div className="border-b border-orange-500/20">
//         <div className="w-full flex items-center justify-center">
//           <div className="flex items-center justify-between w-[95%] lg:w-[90%] xl:w-[85%] py-2">
//             <NavLink to="/actualites" className="flex items-center space-x-3 group">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-orange-500/30 blur-lg rounded-full group-hover:bg-orange-500/50 transition-all"></div>
//                 <img src={logo} alt="Jorfof Basket Club" className="relative h-12 w-12 rounded-full border-2 border-orange-500 shadow-lg object-cover group-hover:scale-105 transition-transform" />
//               </div>
//               <div className="hidden sm:block">
//                 <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 font-black text-xl tracking-tight">JORFOF BASKET CLUB</h1>
//                 <p className="text-gray-400 text-xs font-medium">{t("nav.slogan")}</p>
//               </div>
//             </NavLink>

//             <div className="hidden lg:flex items-center space-x-4">
//               <button onClick={() => navigate("/motPresident")} className="relative group overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
//                 <div className="relative px-5 py-2 bg-gradient-to-r from-orange-500/90 to-blue-600/90 hover:from-orange-500 hover:to-blue-600 rounded-lg text-white text-sm font-bold tracking-wide transition-all flex items-center gap-2">
//                   <Info size={16} />
//                   {t("nav.club_presentation")}
//                 </div>
//               </button>

//               <div className="relative">
//                 <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-orange-500/30 hover:border-orange-500/60 transition-all group">
//                   <Search size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />
//                 </button>
//               </div>

//               <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 border border-orange-500/20">
//                 <Globe size={16} className="text-orange-400 ml-2" />
//                 {["fr", "en"].map((lang) => (
//                   <button key={lang} onClick={() => changeLanguage(lang)}
//                     className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all ${
//                       language === lang ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg"
//                       : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
//                     {lang.toUpperCase()}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-all">
//               {mobileMenuOpen ? <X size={24} className="text-orange-400" /> : <Menu size={24} className="text-orange-400" />}
//             </button>
//           </div>
//         </div>
//       </div>

      

//       {/* Menu principal */}
//       <div className="border-b border-orange-500/10" ref={dropdownRef}>
//         <div className="w-full flex items-center justify-center">
//           <div className="w-[95%] lg:w-[90%] xl:w-[85%]">
//             <nav className="hidden lg:flex items-center justify-center space-x-1 py-3">
//               {navItems.map((item, index) =>
//                 item.isDropdown ? (
//                   <div key={index} className="relative" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
//                     <button className="relative px-4 py-2 text-sm font-bold tracking-wide uppercase transition-all group text-gray-300 hover:text-white flex items-center gap-1">
//                       <span>{item.title}</span>
//                       <ChevronDown size={14} className={`transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
//                     </button>
//                     {activeDropdown === index && (
//                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#101636] border-2 border-orange-500/30 rounded-xl shadow-2xl min-w-[220px] z-50">
//                         {item.items.map((sub, i) => (
//                           <NavLink key={i} to={sub.path} onClick={() => setActiveDropdown(null)}
//                             className="block px-4 py-3 text-sm text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 transition-all border-b border-orange-500/10 last:border-b-0">
//                             {sub.title}
//                           </NavLink>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <NavLink key={index} to={item.path}
//                     className={({ isActive }) =>
//                       `relative px-4 py-2 text-sm font-bold tracking-wide uppercase transition-all group ${
//                         isActive ? "text-orange-400" : "text-gray-300 hover:text-white"}`
//                     }>
//                     <span>{item.title}</span>
//                   </NavLink>
//                 )
//               )}
//             </nav>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navlinks;



import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown, Users, Image, Video, Handshake, Newspaper, Phone, Calendar, Info } from "lucide-react";
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

  // ✅ Scroll + fermeture des menus + blocage scroll mobile
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

    // Bloque le scroll quand le menu mobile est ouvert
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
    { title: t("nav.home"), path: "/home", icon: Newspaper },
    {
      title: t("nav.club"),
      isDropdown: true,
      icon: Users,
      items: [
        { title: t("nav.president_word"), path: "/motPresident" },
        { title: t("nav.missions"), path: "/nosMissions" },
        { title: t("nav.values"), path: "/nosValeurs" },
        { title: t("nav.team"), path: "/notreEquipe" },
      ]
    },
    { title: t("nav.calendrier"), path: "/programs", icon: Calendar },
    { title: t("nav.news"), path: "/actualites", icon: Newspaper },
    {
      title: t("nav.medias"),
      isDropdown: true,
      icon: Video,
      items: [
        { title: t("nav.photos"), path: "/phototheque" },
        { title: t("nav.videos"), path: "/videotheque" },
      ]
    },
    { title: t("nav.partenaires"), path: "/partner", icon: Handshake },
    {
      title: t("nav.join_us"),
      isDropdown: true,
      icon: Users,
      items: [
        { title: t("nav.contact"), path: "/contacter-tamkine" },
        { title: t("nav.community"), path: "/community" },
      ]
    },
    // { title: t("nav.homePost"), path: "/homePost", icon: Newspaper },
  ];

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0e27]/95 backdrop-blur-lg shadow-2xl shadow-orange-500/10" : "bg-[#0a0e27]"}`}>
        <div className="border-b border-orange-500/20">
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center justify-between w-[95%] lg:w-[90%] xl:w-[85%] py-2">
              {/* LOGO */}
              <NavLink to="/home" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 blur-lg rounded-full group-hover:bg-orange-500/50 transition-all"></div>
                  <img src={logo} alt="Jorfof Basket Club" className="relative h-12 w-12 rounded-full border-2 border-orange-500 shadow-lg object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-blue-500 font-black text-xl tracking-tight">JORFOF BASKET CLUB</h1>
                  <p className="text-gray-400 text-xs font-medium">{t("nav.slogan")}</p>
                </div>
              </NavLink>

              {/* ACTIONS (desktop) */}
              <div className="hidden lg:flex items-center space-x-4">
                <button onClick={() => navigate("/motPresident")} className="relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                  <div className="relative px-5 py-2 bg-gradient-to-r from-orange-500/90 to-blue-600/90 hover:from-orange-500 hover:to-blue-600 rounded-lg text-white text-sm font-bold tracking-wide transition-all flex items-center gap-2">
                    <Info size={16} />
                    {t("nav.club_presentation")}
                  </div>
                </button>

                <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-orange-500/30 hover:border-orange-500/60 transition-all group">
                  <Search size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1 border border-orange-500/20">
                  <Globe size={16} className="text-orange-400 ml-2" />
                  {["fr", "en"].map((lang) => (
                    <button key={lang} onClick={() => changeLanguage(lang)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-all ${
                        language === lang ? "bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"}`}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* MENU MOBILE */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-all">
                {mobileMenuOpen ? <X size={24} className="text-orange-400" /> : <Menu size={24} className="text-orange-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* NAV DESKTOP */}
        <div className="border-b border-orange-500/10 hidden lg:block" ref={dropdownRef}>
          <div className="w-full flex items-center justify-center">
            <div className="w-[95%] lg:w-[90%] xl:w-[85%]">
              <nav className="flex items-center justify-center space-x-1 py-3">
                {navItems.map((item, index) =>
                  item.isDropdown ? (
                    <div key={index} className="relative" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                      <button className="relative px-4 py-2 text-sm font-bold tracking-wide uppercase transition-all group text-gray-300 hover:text-white flex items-center gap-1">
                        <span>{item.title}</span>
                        <ChevronDown size={14} className={`transition-transform ${activeDropdown === index ? "rotate-180" : ""}`} />
                      </button>
                      {activeDropdown === index && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#101636] border-2 border-orange-500/30 rounded-xl shadow-2xl min-w-[220px] z-50">
                          {item.items.map((sub, i) => (
                            <NavLink key={i} to={sub.path} onClick={() => setActiveDropdown(null)}
                              className="block px-4 py-3 text-sm text-gray-300 hover:text-orange-400 hover:bg-orange-500/10 transition-all border-b border-orange-500/10 last:border-b-0">
                              {sub.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink key={index} to={item.path}
                      className={({ isActive }) =>
                        `relative px-4 py-2 text-sm font-bold tracking-wide uppercase transition-all group ${
                          isActive ? "text-orange-400" : "text-gray-300 hover:text-white"}`}>
                      <span>{item.title}</span>
                    </NavLink>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ MENU MOBILE AJOUTÉ */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileMenuOpen(false)}></div>

        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#0a0e27] border-l-2 border-orange-500/30 shadow-2xl transition-transform duration-300 overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="sticky top-0 bg-[#0a0e27] border-b border-orange-500/20 p-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500">MENU</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-all">
              <X size={24} className="text-orange-400" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              if (item.isDropdown) {
                return (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => toggleMobileDropdown(index)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-orange-500/20 hover:border-orange-500/40 transition-all text-gray-300 hover:text-white">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-orange-400" />
                        <span className="font-bold text-sm">{item.title}</span>
                      </div>
                      <ChevronDown size={18} className={`text-orange-400 transition-transform ${mobileActiveDropdown === index ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${mobileActiveDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="ml-4 space-y-1 mt-1">
                        {item.items.map((sub, i) => (
                          <button
                            key={i}
                            onClick={() => handleMobileNavClick(sub.path)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all">
                            <span className="text-sm">{sub.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <button key={index} onClick={() => handleMobileNavClick(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-orange-500/20 hover:border-orange-500/40 transition-all text-gray-300 hover:text-white">
                  <Icon size={20} className="text-orange-400" />
                  <span className="font-bold text-sm">{item.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navlinks;
