import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Trophy, Target, Shield, Star, Zap } from "lucide-react";
import ChatBotNew from "../ChatBot/ChatbotNew";
import CONFIG from "../../config/config.js"; // ✅ Même logique que Phototheque

const NotreEquipe = () => {
  const { t, i18n } = useTranslation();
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // 🧠 Scroll top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 🟢 Charger les membres
  const fetchEquipe = async () => {
    try {
      setLoading(true);
      const res = await fetch(CONFIG.API_EQUIPE_LIST); // même logique que Phototheque
      if (!res.ok) throw new Error("Erreur lors du chargement de l'équipe");

      const data = await res.json();

      // ✅ Normalisation des URLs Cloudinary
      const normalizeUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
        return `${CONFIG.BASE_URL}/${url}`;
      };

      // ✅ On adapte les photos
      const normalized = (data.results || data).map((m) => ({
        ...m,
        photo_url: normalizeUrl(m.photo_url || m.photo),
      }));

      setMembres(normalized);
      setError("");
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipe();
  }, []);

  // 🔍 Filtrage
  const filteredMembres =
    roleFilter === "all"
      ? membres
      : membres.filter((membre) => membre.role === roleFilter);

  // 🔤 Traduire les rôles
  const getRoleText = (role) => {
    const roles = {
      player: t("team.player", "Joueur"),
      coach: t("team.coach", "Entraîneur"),
      assistant: t("team.assistant", "Assistant"),
      staff: t("team.staff", "Staff technique"),
      manager: t("team.manager", "Manager"),
    };
    return roles[role] || role;
  };

  // 🧩 Icône selon rôle
  const getRoleIcon = (role) => {
    switch (role) {
      case "player":
        return Trophy;
      case "coach":
        return Target;
      case "staff":
        return Shield;
      default:
        return Users;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-500/30 rounded-full animate-ping absolute"></div>
          <div className="w-20 h-20 border-4 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg ml-6 font-semibold">
          {t("team.loading", "Chargement...")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-red-500/10 border-2 border-red-500/50 text-white p-6 rounded-2xl shadow-2xl backdrop-blur-xl max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-red-500" />
            <p className="font-bold text-xl">{t("team.error", "Erreur")}</p>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] pt-40 relative">
      {/* 🌌 Effets de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 🧠 Titre */}
      <div className="relative text-center pb-16">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-blue-500/30 to-orange-500/30 blur-3xl scale-150 animate-pulse"></div>
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-4">
              {t("team.title", "Notre Équipe")}
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              {t(
                "team.subtitle",
                "Découvrez les membres qui font battre le cœur du club."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 Filtres */}
      <div className="flex justify-center mb-10 flex-wrap gap-4">
        {[
          { value: "all", label: t("team.all", "Tous"), icon: Users },
          { value: "player", label: t("team.players", "Joueurs"), icon: Trophy },
          { value: "coach", label: t("team.coaches", "Entraîneurs"), icon: Target },
          { value: "staff", label: t("team.staffs", "Staffs"), icon: Shield },
        ].map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setRoleFilter(value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all border ${
              roleFilter === value
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500"
                : "bg-white/10 border-orange-500/20 text-gray-300 hover:border-orange-500/40"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* 👥 Grille membres */}
      <div className="w-[90%] mx-auto pb-20">
        {filteredMembres.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-orange-500/20">
            <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <p className="text-white font-bold text-xl">
              {t("team.no_members", "Aucun membre trouvé")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembres.map((membre) => {
              const RoleIcon = getRoleIcon(membre.role);
              return (
                <div
                  key={membre.id}
                  className="bg-[#10142c]/80 border border-orange-500/20 rounded-3xl shadow-xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="relative h-80">
                    <img
                      src={
                        membre.photo_url ||
                        "https://placehold.co/400x500/1a1a2e/ffffff?text=Photo"
                      }
                      alt={`${membre.first_name} ${membre.last_name}`}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/400x500/1a1a2e/ffffff?text=Indisponible")
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Badge rôle */}
                    <div className="absolute top-4 right-4 bg-orange-500/90 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                      <RoleIcon size={14} />
                      {getRoleText(membre.role)}
                    </div>

                    {/* Badge numéro */}
                    {membre.number && (
                      <div className="absolute top-4 left-4 bg-blue-500/90 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                        #{membre.number}
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {membre.first_name} {membre.last_name}
                    </h3>
                    <p className="text-orange-400 font-semibold text-sm mb-2">
                      {membre.position || getRoleText(membre.role)}
                    </p>
                    {membre[`bio_${i18n.language}`] && (
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {membre[`bio_${i18n.language}`]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🤖 Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBotNew />
      </div>
    </div>
  );
};

export default NotreEquipe;
