// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import { Users, Trophy, Target, Shield, Star, Zap } from "lucide-react";
// import ChatBotNew from "../ChatBot/ChatbotNew";
// import CONFIG from "../../config/config.js"; // ✅ Même logique que Phototheque

// const NotreEquipe = () => {
//   const { t, i18n } = useTranslation();
//   const [membres, setMembres] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");

//   // 🧠 Scroll top
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // 🟢 Charger les associés
//   const fetchEquipe = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(CONFIG.API_TEAM_LIST); // nouveau endpoint
//       if (!res.ok) throw new Error("Erreur lors du chargement de l'équipe");

//       const data = await res.json();

//       // ✅ Normalisation des URLs Cloudinary
//       const normalizeUrl = (url) => {
//         if (!url) return null;
//         if (url.startsWith("http")) return url;
//         if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
//         return `${CONFIG.BASE_URL}/${url}`;
//       };

//       // ✅ On adapte les photos
//       const normalized = (data.results || data).map((m) => ({
//         ...m,
//         photo_url: normalizeUrl(m.photo_url || m.photo),
//       }));

//       setMembres(normalized);
//       setError("");
//     } catch (err) {
//       console.error("Erreur:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEquipe();
//   }, []);

//   // 🔍 Filtrage
//   const filteredMembres =
//     roleFilter === "all"
//       ? membres
//       : membres.filter((membre) => membre.role === roleFilter);

//   // 🔤 Traduire les rôles (ex: associés, manager, staff)
//   const getRoleText = (role) => {
//     const roles = {
//       associate: t("team.associate", "Associé"),
//       manager: t("team.manager", "Manager"),
//       staff: t("team.staff", "Staff"),
//       director: t("team.director", "Directeur"),
//     };
//     return roles[role] || role;
//   };

//   // 🧩 Icône selon rôle
//   const getRoleIcon = (role) => {
//     switch (role) {
//       case "associate":
//         return Users;
//       case "manager":
//         return Trophy;
//       case "staff":
//         return Shield;
//       case "director":
//         return Star;
//       default:
//         return Users;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
//         <div className="relative">
//           <div className="w-20 h-20 border-4 border-orange-500/30 rounded-full animate-ping absolute"></div>
//           <div className="w-20 h-20 border-4 border-t-orange-500 rounded-full animate-spin"></div>
//         </div>
//         <p className="text-white text-lg ml-6 font-semibold">
//           {t("team.loading", "Chargement...")}
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
//         <div className="bg-red-500/10 border-2 border-red-500/50 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md">
//           <div className="flex items-center gap-3 mb-2">
//             <Zap className="w-6 h-6 text-red-500" />
//             <p className="font-bold text-xl">{t("team.error", "Erreur")}</p>
//           </div>
//           <p className="text-gray-300">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0a0e27] pt-40 relative">
//       {/* 🌌 Effets de fond */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* 🧠 Titre */}
//       <div className="relative text-center pb-16">
//         <div className="relative inline-block">
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-blue-500/30 to-orange-500/30 blur-3xl scale-150 animate-pulse"></div>
//           <div className="relative">
//             <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
//               <Users className="w-12 h-12 text-white" />
//             </div>
//             <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-4">
//               {t("team.title", "Notre Équipe")}
//             </h1>
//             <p className="text-gray-300 text-lg max-w-3xl mx-auto">
//               {t(
//                 "team.subtitle",
//                 "Découvrez les associés qui font avancer notre entreprise."
//               )}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* 🎯 Filtres */}
//       <div className="flex justify-center mb-10 flex-wrap gap-4">
//         {[
//           { value: "all", label: t("team.all", "Tous"), icon: Users },
//           { value: "associate", label: t("team.associates", "Associés"), icon: Users },
//           { value: "manager", label: t("team.managers", "Managers"), icon: Trophy },
//           { value: "staff", label: t("team.staffs", "Staff"), icon: Shield },
//           { value: "director", label: t("team.directors", "Directeurs"), icon: Star },
//         ].map(({ value, label, icon: Icon }) => (
//           <button
//             key={value}
//             onClick={() => setRoleFilter(value)}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all border ${
//               roleFilter === value
//                 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500"
//                 : "bg-white/10 border-orange-500/20 text-gray-300 hover:border-orange-500/40"
//             }`}
//           >
//             <Icon size={18} />
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* 👥 Grille membres */}
//       <div className="w-[90%] mx-auto pb-20">
//         {filteredMembres.length === 0 ? (
//           <div className="text-center py-16 bg-white/5 rounded-3xl border border-orange-500/20">
//             <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
//             <p className="text-white font-bold text-xl">
//               {t("team.no_members", "Aucun membre trouvé")}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredMembres.map((membre) => {
//               const RoleIcon = getRoleIcon(membre.role);
//               return (
//                 <div
//                   key={membre.id}
//                   className="bg-[#10142c]/80 border border-orange-500/20 rounded-3xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
//                 >
//                   <div className="relative h-80">
//                     <img
//                       src={
//                         membre.photo_url ||
//                         "https://placehold.co/400x500/1a1a2e/ffffff?text=Photo"
//                       }
//                       alt={`${membre.full_name}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) =>
//                         (e.target.src =
//                           "https://placehold.co/400x500/1a1a2e/ffffff?text=Indisponible")
//                       }
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

//                     {/* Badge rôle */}
//                     <div className="absolute top-4 right-4 bg-orange-500/90 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
//                       <RoleIcon size={14} />
//                       {getRoleText(membre.role)}
//                     </div>
//                   </div>

//                   <div className="p-4 text-center">
//                     <h3 className="text-xl font-bold text-white mb-1">
//                       {membre.full_name}
//                     </h3>
//                     <p className="text-orange-400 font-semibold text-sm mb-2">
//                       {membre.position_fr || getRoleText(membre.role)}
//                     </p>
//                     {membre[`bio_${i18n.language}`] && (
//                       <p className="text-gray-400 text-sm line-clamp-3">
//                         {membre[`bio_${i18n.language}`]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* 🤖 Chatbot */}
//       <div className="fixed bottom-6 right-6 z-50">
//         <ChatBotNew />
//       </div>
//     </div>
//   );
// };

// export default NotreEquipe;



import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Trophy,
  Target,
  Shield,
  Star,
  Sparkles,
  AlertCircle,
  Zap,
  Award,
  Building2,
} from "lucide-react";
import CONFIG from "../../config/config.js";

// 🎨 Centralisation des couleurs VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
};

// 🎯 Composants réutilisables
const GradientIcon = ({ icon: Icon, size = "md", animate = false }) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16 md:w-20 md:h-20",
    lg: "w-20 h-20 md:w-24 md:h-24",
  };
  
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8 md:w-10 md:h-10",
    lg: "w-10 h-10 md:w-12 md:h-12",
  };

  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r from-[${COLORS.gradientStart}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientEnd}] blur-2xl opacity-40 ${animate ? 'animate-pulse' : ''}`}></div>
        <div className={`relative ${sizes[size]} bg-gradient-to-br from-[${COLORS.gradientStart}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientEnd}] rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-400/50 transform hover:scale-105 transition-transform duration-300`}>
          <Icon className={`${iconSizes[size]} text-white`} />
        </div>
      </div>
    </div>
  );
};

const GradientText = ({ children, className = "" }) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[${COLORS.gradientEnd}] via-[${COLORS.gradientMid}] to-[${COLORS.gradientStart}] ${className}`}>
    {children}
  </span>
);

const GradientBadge = ({ icon: Icon, text }) => (
  <div className="px-4 py-2.5 md:px-6 md:py-3 bg-white/90 backdrop-blur-md rounded-full border-2 border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#F47920]" />
      <span className="font-bold text-sm md:text-base text-gray-700">{text}</span>
    </div>
  </div>
);

const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col justify-center items-center py-16 md:py-20">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-700 text-base md:text-lg mt-6 font-semibold">{text}</span>
  </div>
);

const NotreEquipe = () => {
  const { t, i18n } = useTranslation();
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  // Scroll vers le haut
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Normalisation URL
  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
    return `${CONFIG.BASE_URL}/${url}`;
  };

  // Fetch Équipe
  useEffect(() => {
    const fetchEquipe = async () => {
      try {
        setError(null);
        const res = await fetch(CONFIG.API_TEAM_LIST);
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        const teamData = Array.isArray(data) ? data : data.results || [];
        const normalized = teamData.map((m) => ({
          ...m,
          photo_url: normalizeUrl(m.photo_url || m.photo),
        }));
        setMembres(normalized);
      } catch (err) {
        console.error("Erreur API Équipe:", err);
        setError(err.message || "Une erreur est survenue lors du chargement de l'équipe");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipe();
  }, []);

  // Filtrage
  const filteredMembres =
    roleFilter === "all"
      ? membres
      : membres.filter((membre) => membre.role === roleFilter);

  // Traduire les rôles
  const getRoleText = (role) => {
    const roles = {
      associate: t("team.associate", "Associé"),
      manager: t("team.manager", "Manager"),
      staff: t("team.staff", "Staff"),
      director: t("team.director", "Directeur"),
    };
    return roles[role] || role;
  };

  // Icône selon rôle
  const getRoleIcon = (role) => {
    switch (role) {
      case "associate":
        return Users;
      case "manager":
        return Trophy;
      case "staff":
        return Shield;
      case "director":
        return Star;
      default:
        return Users;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Effets décoratifs optimisés */}
        <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#E84E1B]/20 to-[#FDB71A]/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 md:pt-44 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-6">
              <GradientIcon icon={Users} size="lg" animate />
            </div>

            {/* Title */}
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <GradientText>{t("team.title", "Notre Équipe")}</GradientText>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed font-medium mb-8">
              Découvrez les{" "}
              <GradientText className="font-black">
                associés
              </GradientText>{" "}
              qui font avancer notre entreprise avec passion et expertise
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <GradientBadge icon={Users} text={`${membres.length || '0'} Membres`} />
              <GradientBadge icon={Building2} text="Excellence & Professionnalisme" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-center mb-6 md:mb-10 flex-wrap gap-3 md:gap-4">
          {[
            { value: "all", label: t("team.all", "Tous"), icon: Users },
            { value: "associate", label: t("team.associates", "Associés"), icon: Users },
            { value: "manager", label: t("team.managers", "Managers"), icon: Trophy },
            { value: "staff", label: t("team.staffs", "Staff"), icon: Shield },
            { value: "director", label: t("team.directors", "Directeurs"), icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setRoleFilter(value)}
              className={`flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base ${
                roleFilter === value
                  ? "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section 
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20"
        aria-labelledby="team-title"
      >
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full mb-4 border border-orange-200">
            <Sparkles className="w-4 h-4 text-[#F47920]" />
            <span className="text-xs md:text-sm font-bold text-gray-700">
              Les talents qui nous portent
            </span>
            <Sparkles className="w-4 h-4 text-[#F47920]" />
          </div>
          
          <h2 id="team-title" className="text-3xl sm:text-4xl md:text-5xl font-black mb-2">
            <GradientText>Rencontrez Notre Équipe</GradientText>
          </h2>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text={t("team.loading", "Chargement...")} />}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border-2 border-red-200 shadow-lg">
              <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 text-base md:text-lg mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                aria-label="Réessayer le chargement"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMembres.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-200">
                <Users className="w-10 h-10 md:w-12 md:h-12 text-[#F47920]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t("team.no_members", "Aucun membre trouvé")}
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                Aucun membre ne correspond à ce filtre
              </p>
            </div>
          </div>
        )}

        {/* Team Grid */}
        {!loading && !error && filteredMembres.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredMembres.map((membre) => {
              const RoleIcon = getRoleIcon(membre.role);
              return (
                <article
                  key={membre.id}
                  className="group cursor-pointer"
                  role="article"
                  aria-label={membre.full_name}
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 shadow-md hover:shadow-xl h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                      <img
                        src={
                          membre.photo_url ||
                          "https://placehold.co/400x500/FDB71A/ffffff?text=Photo"
                        }
                        alt={membre.full_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) =>
                          (e.target.src =
                            "https://placehold.co/400x500/F47920/ffffff?text=Indisponible")
                        }
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Badge rôle */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <RoleIcon size={14} />
                        {getRoleText(membre.role)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6 flex-1 flex flex-col gap-2 bg-gradient-to-r from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300">
                      {/* Name */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#F47920] transition-colors">
                        {membre.full_name}
                      </h3>
                      
                      {/* Position */}
                      <p className="text-[#F47920] font-semibold text-sm md:text-base">
                        {membre[`position_${i18n.language}`] || membre.position_fr || getRoleText(membre.role)}
                      </p>
                      
                      {/* Bio */}
                      {membre[`bio_${i18n.language}`] && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                          {membre[`bio_${i18n.language}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section 
        className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-white overflow-hidden"
        aria-labelledby="cta-title"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A]/5 via-[#F47920]/5 to-[#E84E1B]/5"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border-2 border-orange-200 overflow-hidden">
              {/* Decorative gradients */}
              <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-[#E84E1B]/20 to-[#FDB71A]/20 rounded-full blur-3xl"></div>

              <div className="relative text-center">
                {/* Icon */}
                <div className="mb-6">
                  <GradientIcon icon={Award} size="md" />
                </div>

                {/* Title */}
                <h2 id="cta-title" className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6">
                  <GradientText>Rejoignez Notre Équipe</GradientText>
                </h2>

                {/* Description */}
                <p className="text-base md:text-lg lg:text-xl text-gray-800 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                  Faites partie d'une{" "}
                  <GradientText className="font-black">
                    équipe passionnée
                  </GradientText>{" "}
                  et contribuez à notre succès collectif
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="group relative inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-xl font-bold text-base md:text-lg shadow-xl shadow-orange-400/40 text-white hover:shadow-2xl hover:shadow-orange-400/50 transition-shadow duration-300"
                  aria-label="Découvrir notre équipe"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Découvrir L'Équipe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotreEquipe;