import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Target,
  AlertCircle,
  Award,
  Crosshair,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Linkedin,
  Handshake,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import CONFIG from "../../config/config.js";

/* ════════════════════════════════════════════════════════════════
   FONT_BASE — police unique appliquée partout (titres + corps)
   afin d'avoir une cohérence typographique totale sur la page.
════════════════════════════════════════════════════════════════ */
const FONT_HEAD = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#FF8C00] rounded-full animate-spin"></div>
    </div>
    <span
      className="text-gray-500 text-base mt-6 font-semibold tracking-wide uppercase"
      style={{ fontFamily: FONT_HEAD }}
    >
      Chargement...
    </span>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   PROPOSITION DE VALEURS — diagramme circulaire 3 segments
   (Qualité / Prix / Ressources locales) + version mobile en cartes.
════════════════════════════════════════════════════════════════ */
const PropositionValeurs = ({ t }) => (
  <section className="py-20 px-4 sm:px-6 md:py-24 bg-[#faf5ef]" style={{ boxShadow: 'inset 0 12px 24px -12px rgba(0,0,0,0.04)' }}>
    <div className="max-w-[1200px] mx-auto">
      {/* Badge cohérent avec le reste de la page */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-orange-200 rounded-full shadow-sm">
          <div className="w-6 h-6 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-gray-700" style={{ fontFamily: FONT_HEAD }}>
            {t("missions.value_prop_badge") || "Notre engagement"}
          </span>
        </div>
      </div>

      {/* Titre */}
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 text-center mb-3"
        style={{ fontFamily: FONT_HEAD }}
      >
        {t("missions.value_prop_title") || "Notre proposition de valeurs"}
      </h2>
      <p
        className="text-center text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16 text-base leading-relaxed"
        style={{ fontFamily: FONT_BODY }}
      >
        {t("missions.value_prop_subtitle") ||
          "Trois piliers guident chacune de nos décisions, du choix des matières premières jusqu'au produit fini."}
      </p>

      {/* ═══ DESKTOP : 3 colonnes (texte gauche | cercle | texte droite) + bas centré ═══ */}
      <div className="hidden md:block max-w-5xl mx-auto">

        {/* Ligne du haut : texte gauche | cercle SVG | texte droite */}
        <div className="flex items-center gap-0">

          {/* Colonne gauche — Qualité (alignée à droite du bloc, proche du cercle) */}
          <div className="flex-1 flex flex-col items-end text-right pr-10">
            {/* Pastille couleur + titre */}
            <div className="flex items-center gap-2.5 mb-3 flex-row-reverse">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#F97316" }}></div>
              <p className="text-base lg:text-lg font-black" style={{ color: "#F97316", fontFamily: FONT_HEAD }}>
                {t("missions.vp_quality_title") || "Qualité supérieure"}
              </p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]" style={{ fontFamily: FONT_BODY }}>
              {t("missions.vp_quality_desc") ||
                "Processus de production aux normes industrielles, contrôles qualité stricts et recettes élaborées pour garantir un goût et une sécurité alimentaire irréprochables."}
            </p>
            {/* Ligne de connexion vers le cercle */}
            <div className="flex items-center mt-5 gap-2">
              <div className="h-px w-10 rounded-full" style={{ backgroundColor: "#F97316", opacity: 0.4 }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F97316" }}></div>
            </div>
          </div>

          {/* Cercle SVG central */}
          <div className="flex-shrink-0">
            <svg width="260" height="260" viewBox="0 0 220 220" aria-hidden="true">
              {/* Arc orange — haut-droite (Qualité) */}
              <path d="M 110 22 A 88 88 0 0 1 198 110"
                fill="none" stroke="#F97316" strokeWidth="22" strokeLinecap="round" />
              {/* Arc bordeaux — droite-bas (Prix) */}
              <path d="M 198 110 A 88 88 0 0 1 44 171"
                fill="none" stroke="#7C2D12" strokeWidth="22" strokeLinecap="round" />
              {/* Arc marine — bas-gauche (Ressources) */}
              <path d="M 44 171 A 88 88 0 0 1 110 22"
                fill="none" stroke="#1E3A5F" strokeWidth="22" strokeLinecap="round" />
              {/* Flèche orange (haut) */}
              <polygon points="107,20 117,20 112,10" fill="#F97316" />
              {/* Flèche bordeaux (droite-bas) */}
              <polygon points="196,118 201,108 208,115" fill="#7C2D12" />
              {/* Flèche marine (bas-gauche) */}
              <polygon points="37,174 47,178 39,186" fill="#1E3A5F" />
              {/* Ombre intérieure subtile */}
              <circle cx="110" cy="110" r="63" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              {/* Cercle blanc intérieur */}
              <circle cx="110" cy="110" r="60" fill="white" />
              {/* Texte centré */}
              <text x="110" y="101" textAnchor="middle" fontSize="10.5" fontWeight="700"
                fill="#374151" fontFamily="'Plus Jakarta Sans', sans-serif">Notre</text>
              <text x="110" y="115" textAnchor="middle" fontSize="10.5" fontWeight="700"
                fill="#374151" fontFamily="'Plus Jakarta Sans', sans-serif">proposition</text>
              <text x="110" y="129" textAnchor="middle" fontSize="10.5" fontWeight="700"
                fill="#374151" fontFamily="'Plus Jakarta Sans', sans-serif">de valeurs</text>
            </svg>
          </div>

          {/* Colonne droite — Prix compétitifs (alignée à gauche, proche du cercle) */}
          <div className="flex-1 flex flex-col items-start text-left pl-10">
            {/* Pastille couleur + titre */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: "#7C2D12" }}></div>
              <p className="text-base lg:text-lg font-black" style={{ color: "#7C2D12", fontFamily: FONT_HEAD }}>
                {t("missions.vp_price_title") || "Prix compétitifs"}
              </p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]" style={{ fontFamily: FONT_BODY }}>
              {t("missions.vp_price_desc") ||
                "Optimisation de la chaîne logistique et réduction des intermédiaires pour offrir un produit de haute qualité à un prix accessible au plus grand nombre."}
            </p>
            {/* Ligne de connexion vers le cercle */}
            <div className="flex items-center mt-5 gap-2 flex-row-reverse">
              <div className="h-px w-10 rounded-full" style={{ backgroundColor: "#7C2D12", opacity: 0.4 }}></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#7C2D12" }}></div>
            </div>
          </div>
        </div>

        {/* Bas — Ressources locales (centré sous le cercle) */}
        <div className="text-center mt-2 pb-2">
          {/* Ligne de connexion verticale */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1E3A5F" }}></div>
              <div className="w-px h-6 rounded-full" style={{ backgroundColor: "#1E3A5F", opacity: 0.3 }}></div>
            </div>
          </div>
          <p className="text-base lg:text-lg font-black mb-3" style={{ color: "#1E3A5F", fontFamily: FONT_HEAD }}>
            {t("missions.vp_local_title") || "Ressources locales"}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mx-auto max-w-sm" style={{ fontFamily: FONT_BODY }}>
            {t("missions.vp_local_desc") ||
              "Utilisation de matières premières issues de l'agriculture guinéenne, assurant la fraîcheur, la traçabilité et le soutien direct aux producteurs locaux."}
          </p>
        </div>
      </div>

      {/* ── Mobile : anneau SVG compact + cartes empilées ── */}
      <div className="md:hidden">
        <div className="flex justify-center mb-8">
          <svg width="160" height="160" viewBox="0 0 220 220" aria-hidden="true">
            <path d="M 110 22 A 88 88 0 0 1 198 110" fill="none" stroke="#F97316" strokeWidth="24" strokeLinecap="round" />
            <path d="M 198 110 A 88 88 0 0 1 44 171" fill="none" stroke="#7C2D12" strokeWidth="24" strokeLinecap="round" />
            <path d="M 44 171 A 88 88 0 0 1 110 22" fill="none" stroke="#1E3A5F" strokeWidth="24" strokeLinecap="round" />
            <polygon points="107,20 117,20 112,10" fill="#F97316" />
            <polygon points="196,118 201,108 208,115" fill="#7C2D12" />
            <polygon points="37,174 47,178 39,186" fill="#1E3A5F" />
            <circle cx="110" cy="110" r="63" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            <circle cx="110" cy="110" r="60" fill="white" />
            <text x="110" y="101" textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151" fontFamily="'Plus Jakarta Sans', sans-serif">Notre</text>
            <text x="110" y="115" textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151" fontFamily="'Plus Jakarta Sans', sans-serif">proposition</text>
            <text x="110" y="129" textAnchor="middle" fontSize="10" fontWeight="700" fill="#374151" fontFamily="'Plus Jakarta Sans', sans-serif">de valeurs</text>
          </svg>
        </div>
        <div className="flex flex-col gap-4 px-2">
          {[
            {
              color: "#F97316",
              title: t("missions.vp_quality_title") || "Qualité supérieure",
              desc: t("missions.vp_quality_desc") || "Processus de production aux normes industrielles, contrôles qualité stricts pour une sécurité alimentaire irréprochable.",
            },
            {
              color: "#7C2D12",
              title: t("missions.vp_price_title") || "Prix compétitifs",
              desc: t("missions.vp_price_desc") || "Optimisation de la chaîne logistique pour offrir un produit de haute qualité à un prix accessible.",
            },
            {
              color: "#1E3A5F",
              title: t("missions.vp_local_title") || "Ressources locales",
              desc: t("missions.vp_local_desc") || "Matières premières issues de l'agriculture guinéenne, fraîches et tracées, soutenant les producteurs locaux.",
            },
          ].map(({ color, title, desc }) => (
            <div key={title} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: color, minHeight: "44px" }} />
              <div>
                <p className="text-sm font-bold mb-1" style={{ color, fontFamily: FONT_HEAD }}>{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: FONT_BODY }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const NosMissions = () => {
  const { t, i18n } = useTranslation();
  const [missions, setMissions] = useState([]);
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Nettoyer et reconstruire toute URL Cloudinary
  const cleanUrl = (url) => {
    if (!url) return null;
    const s = String(url).trim();
    // Cas 1 : URL https:// imbriquée → extraire
    const idx = s.indexOf("https://");
    if (idx > 0) return s.slice(idx);
    // Cas 2 : URL complète propre
    if (s.startsWith("http")) return s;
    // Cas 3 : chemin relatif Cloudinary pur → reconstruire
    if (s.startsWith("image/upload/") || /^v\d+\//.test(s)) {
      return `https://res.cloudinary.com/${CONFIG.CLOUDINARY_NAME}/${s}`;
    }
    // Cas 4 : juste le public_id (ex: "missions_cover/xyz.jpg")
    if (s.includes("/") && !s.startsWith("/")) {
      return `https://res.cloudinary.com/${CONFIG.CLOUDINARY_NAME}/image/upload/${s}`;
    }
    return null;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setError(null);
        const [missionsRes, teamRes, partnersRes, recherchePartnersRes] = await Promise.all([
          fetch(CONFIG.API_MISSION_LIST),
          fetch(CONFIG.API_TEAM_LIST),
          fetch(`${CONFIG.BASE_URL}/api/partners/`),
          fetch(`${CONFIG.BASE_URL}/api/recherche-partners/`),
        ]);
        if (!missionsRes.ok || !teamRes.ok || !partnersRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const [missionsData, teamData, partnersData, recherchePartnersData] = await Promise.all([
          missionsRes.json(),
          teamRes.json(),
          partnersRes.json(),
          recherchePartnersRes.ok ? recherchePartnersRes.json() : Promise.resolve([]),
        ]);
        const missionArray = Array.isArray(missionsData) ? missionsData : missionsData.results || [];
        const activeMissions = missionArray
          .filter((m) => m.is_active === true || m.isActive === true)
          .map((m) => ({
            ...m,
            image_url: cleanUrl(m.image_url) || cleanUrl(m.image) || null,
            // Essayer cover_image_url, puis cover_image (champ brut) en fallback
            cover_image_url: cleanUrl(m.cover_image_url) || cleanUrl(m.cover_image) || null,
          }));

        const teamArray = Array.isArray(teamData) ? teamData : teamData.results || [];
        const activeTeam = teamArray
          .filter((m) => m.is_active === true)
          .map((m) => ({ ...m, photo_url: cleanUrl(m.photo_url || m.photo) || m.photo_url || m.photo }));
        // Partenaires globaux
        const partnerArray = Array.isArray(partnersData) ? partnersData : partnersData.results || [];
        const activeGlobalPartners = partnerArray.filter((p) => p.is_active === true || p.isActive === true);

        // Partenaires R&D (recherche-partners) — normalisés pour avoir cover_image_url et name
        const recherchePartnerArray = Array.isArray(recherchePartnersData)
          ? recherchePartnersData
          : recherchePartnersData.results || [];
        const activeRecherchePartners = recherchePartnerArray
          .filter((p) => p.is_active === true)
          .map((p) => ({
            ...p,
            // Normaliser pour être compatible avec l'affichage existant
            name_fr: p.name,
            display_name: p.name,
            cover_image_url: p.cover_image_url || p.cover_image,
          }));

        // Fusion sans doublons (par name)
        const existingNames = new Set(activeGlobalPartners.map((p) => (p.name_fr || p.display_name || "").toLowerCase()));
        const uniqueRecherchePartners = activeRecherchePartners.filter(
          (p) => !existingNames.has((p.name || "").toLowerCase())
        );
        const activePartners = [...activeGlobalPartners, ...uniqueRecherchePartners];
        setMissions(activeMissions);
        setTeam(activeTeam);
        setPartners(activePartners);
      } catch (err) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const parseContent = (content) => {
    if (!content) return { left: "", items: [] };
    const parts = content.split(/\[RIGHT\]/i);
    const leftContent = parts[0]?.replace(/\[LEFT\]/i, "").trim() || "";
    const rightContent = parts[1]?.replace(/\[RIGHT\]/i, "").trim() || "";
    const items = rightContent
      .split(/\n\n+/)
      .map((b) => b.trim())
      .filter((b) => b.length > 5)
      .map((block) => {
        const lines = block.split(/\n/).map((l) => l.trim()).filter((l) => l);
        if (!lines.length) return null;
        return { title: lines[0], description: lines.slice(1).join(" ") };
      })
      .filter(Boolean);
    return { left: leftContent, items };
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: FONT_HEAD }}>
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: FONT_BODY }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 transition-all"
            style={{ fontFamily: FONT_HEAD }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes gradient-flow {
          0%,100% { background-position: 0%   50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px)  rotate(0deg); }
          33%     { transform: translateY(-8px) rotate(2deg); }
          66%     { transform: translateY(-4px) rotate(-1deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .6; }
          100% { transform: scale(1.7); opacity: 0;  }
        }

        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        .gradient-text {
          background: linear-gradient(135deg, #FFC107 0%, #FF8C00 40%, #FF6B00 70%, #FFC107 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .separator-line {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #FFC107 30%, #FF8C00 50%, #FFC107 70%, transparent 100%);
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
        }

        /* Card Mission pleine largeur */
        .mission-full-card {
          background: #ffffff;
        }

        /* Card Valeur */
        .valeur-card {
          background: linear-gradient(135deg, #fff 0%, #fff8f0 50%, #fff 100%);
        }

        .float-icon       { animation: float 4s ease-in-out infinite; }
        .float-icon-delay { animation: float 4s ease-in-out infinite; animation-delay: 1s; }

        .glow-btn { position: relative; overflow: hidden; }
        .glow-btn::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,.25);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width .6s, height .6s;
        }
        .glow-btn:hover::before { width: 300px; height: 300px; }

        /* Force la cohérence typographique sur tous les enfants par défaut */
        .viali-page, .viali-page * {
          font-family: ${FONT_BODY};
        }
        .viali-page h1, .viali-page h2, .viali-page h3, .viali-page h4 {
          font-family: ${FONT_HEAD};
        }
      `}</style>

      <div className="viali-page min-h-screen bg-white pb-0">
        {/* ══════════════════════════════ HERO — Texte gauche / Cover droite ══════════════════════════════ */}
        {(() => {
          const firstCover = missions.find((m) => m.cover_image_url)?.cover_image_url;

          return (
            <section className="grid grid-cols-1 md:grid-cols-2 items-stretch bg-white pt-[72px]">
              {/* ── Colonne gauche : texte ── */}
              <div
                className="flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 bg-white order-2 md:order-1"
                style={{ position: "sticky", top: "72px", alignSelf: "start" }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-full mb-6 md:mb-8 shadow-sm w-fit animate-slide-up">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full animate-ping opacity-50"></div>
                    <div className="relative w-6 h-6 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700" style={{ fontFamily: FONT_HEAD }}>
                    {t("missions.badge_text") || "Notre Vision & Engagement"}
                  </span>
                </div>

                {/* Titre — fond coloré style La Sablaise */}
                <div className="mb-5 md:mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                  <div className="inline-block bg-[#FF8C00]/15 px-3 py-1 mb-1">
                    <h1
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight"
                      style={{ fontFamily: FONT_HEAD }}
                    >
                      {t("missions.title") || "Nos Missions"}
                    </h1>
                  </div>
                </div>

                {/* Sous-titre */}
                <p
                  className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg animate-slide-up"
                  style={{ fontFamily: FONT_BODY, animationDelay: "0.2s" }}
                >
                  {t("missions.subtitle") || "Nous travaillons chaque jour pour atteindre nos objectifs et nos valeurs"}
                </p>

                {/* Ligne décorative */}
                <div
                  className="mt-7 md:mt-8 h-1 w-20 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00] animate-slide-up"
                  style={{ animationDelay: "0.25s" }}
                ></div>
              </div>

              {/* ── Colonne droite : image ── */}
              <div className="bg-gray-50 order-1 md:order-2">
                {firstCover ? (
                  <img
                    key={firstCover}
                    src={firstCover}
                    alt="Nos missions VIALI"
                    className="w-full h-full object-cover max-h-[60vw] sm:max-h-[420px] md:max-h-none"
                  />
                ) : (
                  <div className="w-full h-full min-h-[280px] md:min-h-[500px] bg-[#f5f5f5]"></div>
                )}
              </div>
            </section>
          );
        })()}

        {/* ══════════════════════════════ MISSIONS ══════════════════════════════ */}
        {/* Wrapper avec fondu bas pour transition douce vers le cream */}
        <div className="relative bg-white">
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, transparent, #faf5ef)' }}></div>
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16 md:py-24">
          {missions.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-100">
                <Target className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900" style={{ fontFamily: FONT_HEAD }}>
                Aucune mission disponible
              </h3>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-20 md:space-y-28">
              {missions.map((mission, missionIndex) => {
                const title =
                  mission[`title_${i18n.language}`] || mission.title_fr || mission.title_en || "";
                const contentValeur = mission[`content_valeur_${i18n.language}`] || mission.content_valeur_fr || "";
                const contentMission = mission[`content_mission_${i18n.language}`] || mission.content_mission_fr || "";

                const valeurData = parseContent(contentValeur);
                const missionData = parseContent(contentMission);

                const hasValeur = valeurData.left || valeurData.items.length > 0;
                const hasMission = missionData.left || missionData.items.length > 0;

                return (
                  <article
                    key={mission.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${missionIndex * 0.12}s` }}
                  >
                    {/* ── LAYOUT INTELLIGENT ──
                        • Les deux → grille 2 colonnes
                        • Mission seule → pleine largeur premium
                        • Valeur seule  → pleine largeur
                    ── */}

                    {hasValeur && hasMission ? (
                      /* ═══ DEUX CARDS CÔTE À CÔTE ═══ */
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* CARD VALEUR */}
                        <div className="valeur-card relative rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border border-orange-100 hover:border-orange-300 hover:-translate-y-1 overflow-hidden">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-400/10 to-transparent rounded-bl-[4rem] pointer-events-none"></div>
                          <div className="flex items-start gap-4 mb-6 md:mb-8 relative">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl blur-md opacity-40"></div>
                              <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg float-icon">
                                <Award className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: FONT_HEAD }}>
                                {t("missions.values") || "Nos Valeurs"}
                              </h3>

                            </div>
                          </div>
                          <div className="space-y-4 md:space-y-5 relative">
                            {valeurData.left && (
                              <div className="relative pl-5">
                                <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-gradient-to-b from-[#FFC107] to-[#FF8C00] rounded-full"></div>
                                <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                                  {valeurData.left}
                                </p>
                              </div>
                            )}
                            {valeurData.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex gap-3 items-start p-4 rounded-2xl hover:bg-orange-50/80 transition-all border border-transparent hover:border-orange-100"
                              >
                                <div className="flex-shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"></div>
                                <div>
                                  <p className="font-black text-gray-900 mb-1" style={{ fontFamily: FONT_HEAD }}>
                                    {item.title}
                                  </p>
                                  {item.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>

                        {/* CARD MISSION */}
                        <div className="mission-full-card relative rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border border-yellow-100 hover:border-yellow-300 hover:-translate-y-1 overflow-hidden">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-bl-[4rem] pointer-events-none"></div>
                          <div className="flex items-start gap-4 mb-6 md:mb-8 relative">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-2xl blur-md opacity-40"></div>
                              <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-2xl flex items-center justify-center shadow-lg float-icon-delay">
                                <Crosshair className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: FONT_HEAD }}>
                                {t("missions.mission") || "Notre Mission"}
                              </h3>

                            </div>
                          </div>
                          <div className="space-y-4 md:space-y-5 relative">
                            {missionData.left && (
                              <div className="relative pl-5">
                                <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-gradient-to-b from-[#FF8C00] to-[#FFC107] rounded-full"></div>
                                <p className="text-base md:text-lg font-bold text-gray-800 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                                  {missionData.left}
                                </p>
                              </div>
                            )}
                            {missionData.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex gap-3 items-start p-4 rounded-2xl hover:bg-yellow-50/80 transition-all border border-transparent hover:border-yellow-100"
                              >
                                <div className="flex-shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FFC107]"></div>
                                <div>
                                  <p className="font-black text-gray-900 mb-1" style={{ fontFamily: FONT_HEAD }}>
                                    {item.title}
                                  </p>
                                  {item.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      </div>
                    ) : hasMission ? (
                      /* ═══════════════════════════════════════════════════════════
                         CARD MISSION SEULE — PLEINE LARGEUR ULTRA MODERNE
                      ═══════════════════════════════════════════════════════════ */
                      <div className="relative rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-orange-100 hover:shadow-orange-200/50 hover:-translate-y-1 transition-all duration-500">
                        {/* Fond blanc */}
                        <div className="absolute inset-0 bg-white"></div>
                        {/* Mesh radial très subtil */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "radial-gradient(ellipse 70% 60% at 95% 5%, rgba(255,193,7,.05) 0%, transparent 55%), radial-gradient(ellipse 50% 70% at 5% 95%, rgba(255,140,0,.04) 0%, transparent 55%)",
                          }}
                        ></div>

                        {/* Anneaux décoratifs top-right */}
                        <div className="absolute top-0 right-0 w-[420px] h-[420px] opacity-[0.12] pointer-events-none hidden sm:block">
                          <svg viewBox="0 0 420 420" fill="none">
                            <circle cx="380" cy="40" r="200" stroke="url(#rg2)" strokeWidth="1.5" />
                            <circle cx="380" cy="40" r="145" stroke="url(#rg2)" strokeWidth="1" />
                            <circle cx="380" cy="40" r="90" stroke="url(#rg2)" strokeWidth="0.8" />
                            <defs>
                              <linearGradient id="rg2" x1="0" y1="0" x2="1" y2="1">
                                <stop stopColor="#FFC107" />
                                <stop offset="1" stopColor="#FF8C00" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        {/* Grille de points bottom-left */}
                        <div className="absolute bottom-10 left-10 opacity-[0.12] pointer-events-none hidden sm:block">
                          <svg width="110" height="110" viewBox="0 0 110 110">
                            {[0, 1, 2, 3, 4].map((row) =>
                              [0, 1, 2, 3, 4].map((col) => (
                                <circle
                                  key={`${row}-${col}`}
                                  cx={col * 22 + 3}
                                  cy={row * 22 + 3}
                                  r="3.5"
                                  fill="#FF8C00"
                                  opacity={(row + col) % 2 === 0 ? 1 : 0.45}
                                />
                              ))
                            )}
                          </svg>
                        </div>

                        {/* Contenu */}
                        <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16">
                          {/* En-tête : icône + titre */}
                          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6 mb-8 md:mb-12">
                            {/* Icône avec glow + pulse */}
                            <div className="relative flex-shrink-0 self-start">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-3xl blur-2xl opacity-45 scale-[1.3]"></div>
                              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-3xl flex items-center justify-center shadow-2xl float-icon-delay">
                                <Crosshair className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                              </div>
                              <div
                                className="absolute inset-0 rounded-3xl border-2 border-orange-400/50"
                                style={{ animation: "pulse-ring 2.2s cubic-bezier(0,0,.2,1) infinite" }}
                              ></div>
                            </div>

                            {/* Titre */}
                            <div className="flex-1">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 bg-gradient-to-r from-[#FFC107]/20 to-[#FF8C00]/20 border border-orange-200 rounded-full">
                                <Zap className="w-3 h-3 text-orange-600" strokeWidth={3} />
                                <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest" style={{ fontFamily: FONT_BODY }}>
                                  Impact
                                </span>
                              </div>
                              <h3
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight"
                                style={{ fontFamily: FONT_HEAD }}
                              >
                                {t("missions.mission") || "Notre Mission"}
                              </h3>
                              <div
                                className="mt-4 h-1 w-28 rounded-full"
                                style={{
                                  background: "linear-gradient(90deg, #FFC107, #FF8C00, #FF6B00)",
                                  backgroundSize: "200% 100%",
                                  animation: "gradient-flow 3s ease-in-out infinite",
                                }}
                              ></div>
                            </div>
                          </div>

                          {/* Texte principal */}
                          <div className="space-y-6 md:space-y-8 max-w-5xl">
                            {missionData.left && (
                              <div className="relative pl-6">
                                <div className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#FF8C00] via-[#FFC107] to-[#FF8C00] rounded-full"></div>
                                <p
                                  className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-relaxed"
                                  style={{ fontFamily: FONT_BODY }}
                                >
                                  {missionData.left}
                                </p>
                              </div>
                            )}

                            {/* Items en grille 2 colonnes */}
                            {missionData.items.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {missionData.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="group flex gap-4 items-start p-5 rounded-2xl bg-white/75 backdrop-blur-sm border border-orange-100 hover:border-orange-300 hover:bg-white hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 hover:-translate-y-0.5"
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FF8C00] flex items-center justify-center shadow-md">
                                        <ChevronRight className="w-4 h-4 text-white" strokeWidth={3} />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-black text-gray-900 mb-1 text-base" style={{ fontFamily: FONT_HEAD }}>
                                        {item.title}
                                      </p>
                                      {item.description && (
                                        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>


                        </div>
                      </div>
                    ) : hasValeur ? (
                      /* ═══ CARD VALEUR SEULE — PLEINE LARGEUR ═══ */
                      <div className="valeur-card relative rounded-[1.75rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-2xl border border-orange-100 hover:border-orange-300 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="flex items-start gap-4 mb-6 md:mb-8">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl blur opacity-40"></div>
                            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg float-icon">
                              <Award className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900" style={{ fontFamily: FONT_HEAD }}>
                              {t("missions.values") || "Nos Valeurs"}
                            </h3>
                            <div className="h-0.5 w-12 bg-gradient-to-r from-[#FFC107] to-transparent rounded-full mt-2"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {valeurData.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 items-start p-5 rounded-2xl bg-white/80 border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all"
                            >
                              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00] mt-2 flex-shrink-0"></div>
                              <div>
                                <p className="font-black text-gray-900 mb-1" style={{ fontFamily: FONT_HEAD }}>
                                  {item.title}
                                </p>
                                {item.description && (
                                  <p className="text-sm text-gray-500" style={{ fontFamily: FONT_BODY }}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* ── IMAGE après les cards ── */}
                    {mission.image_url && (
                      <div className="mt-8 md:mt-12 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl">
                        <img
                          src={mission.image_url}
                          alt={title}
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: "none" }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* ── Séparateur ── */}
                    {missionIndex < missions.length - 1 && (
                      <div className="mt-16 md:mt-24 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center border border-white shadow">
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
        </div>{/* fin wrapper fondu missions */}

        {/* ══════════════════════════════ PROPOSITION DE VALEURS ══════════════════════════════ */}
        <PropositionValeurs t={t} />

        {/* ══════════════════════════════ ÉQUIPE ══════════════════════════════ */}
        {team.length > 0 && (
          <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-50/80 via-orange-50/20 to-yellow-50/20">
            <div className="max-w-[1600px] mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-orange-200 rounded-full mb-5 md:mb-6 shadow-lg">
                  <Users className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-gray-700" style={{ fontFamily: FONT_HEAD }}>
                    {t("missions.team_badge") || "Notre Équipe"}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: FONT_HEAD }}>
                  {t("missions.team_title") || "L'équipe qui fait la différence"}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mx-auto"></div>
              </div>
              <div className="space-y-10 md:space-y-12">
                {team.slice(0, 5).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {team.slice(0, 5).map((membre, idx) => (
                      <article key={membre.id} className="group animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
                          <img
                            src={membre.photo_url || "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"}
                            alt={membre.full_name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          {membre.linkedin && (
                            <a
                              href={membre.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                            >
                              <Linkedin className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                            </a>
                          )}
                        </div>
                        <div className="text-center">
                          <h3
                            className="text-sm sm:text-base font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: FONT_HEAD }}
                          >
                            {membre.full_name}
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold" style={{ fontFamily: FONT_BODY }}>
                            {membre[`position_${i18n.language}`] || membre.position_fr || membre.position_en || "Membre"}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {team.slice(5, 8).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {team.slice(5, 8).map((membre) => (
                      <article key={membre.id} className="group">
                        <div className="relative mb-4 sm:mb-5 overflow-hidden rounded-2xl sm:rounded-3xl aspect-[3/4] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
                          <img
                            src={membre.photo_url || "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"}
                            alt={membre.full_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="text-center">
                          <h3
                            className="text-base sm:text-lg font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: FONT_HEAD }}
                          >
                            {membre.full_name}
                          </h3>
                          <p className="text-sm text-gray-500 font-semibold" style={{ fontFamily: FONT_BODY }}>
                            {membre[`position_${i18n.language}`] || membre.position_fr || membre.position_en || "Membre"}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════ PARTENAIRES ══════════════════════════════ */}
        {partners.length > 0 && (
          <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-full mb-5 md:mb-6 shadow-sm">
                  <Handshake className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-gray-700" style={{ fontFamily: FONT_HEAD }}>
                    {t("missions.partners_badge") || "Nos Partenaires"}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: FONT_HEAD }}>
                  {t("missions.partners_title") || "Ils nous font confiance"}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {partners.map((partner, idx) => {
                  const lang = i18n.language;
                  const partnerName =
                    (lang === "en" ? partner.name_en : partner.name_fr) ||
                    partner.name_fr ||
                    partner.name_en ||
                    partner.display_name ||
                    partner.name ||
                    "Partenaire";
                  const partnerImage = partner.cover_image_url || partner.cover_image;
                  return (
                    <a
                      key={partner.id}
                      href={partner.website_url || "#"}
                      target={partner.website_url ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`group animate-slide-up ${partner.website_url ? "cursor-pointer" : ""}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-square p-4 sm:p-6 bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
                          {partnerImage ? (
                            <img
                              src={partnerImage}
                              alt={`Logo ${partnerName}`}
                              className="w-full h-full object-contain transition-transform group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <Handshake className="w-20 h-20 text-gray-300 mx-auto" strokeWidth={2} />
                          )}
                          {partner.website_url && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center bg-gradient-to-t from-orange-500/10 to-transparent">
                              <div className="bg-white rounded-full p-3 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                <ExternalLink className="w-6 h-6 text-[#FF8C00]" strokeWidth={2.5} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-t border-gray-100 group-hover:bg-orange-50/50 transition-colors">
                          <h3
                            className="text-center text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#FF8C00] transition-colors"
                            style={{ fontFamily: FONT_HEAD }}
                          >
                            {partnerName}
                          </h3>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════ BANDE CTA LÉGÈRE ══════════════════════════════ */}
        <section className="py-12 px-4 sm:px-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: FONT_HEAD }}>
                {t("missions.cta_title") || "Envie de découvrir nos produits ?"}
              </p>
              <p className="text-sm text-gray-500" style={{ fontFamily: FONT_BODY }}>
                {t("missions.cta_desc") || "Notre équipe vous répond rapidement sur WhatsApp."}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white hover:scale-105 transition-all duration-300 shadow-md"
                style={{ fontFamily: FONT_HEAD, background: 'linear-gradient(135deg, #FFC107, #FF8C00)' }}
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
                {t("missions.cta_whatsapp") || "Nous contacter"}
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ WHATSAPP — bouton flottant ══════════════════════════════ */}
        <a
          href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Contactez-nous sur WhatsApp"
        >
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 border-4 border-white">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <div className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: FONT_HEAD }}>
                Contactez-nous sur WhatsApp
              </p>
              <p className="text-xs text-gray-300" style={{ fontFamily: FONT_BODY }}>
                Réponse rapide garantie
              </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>
      </div>
    </>
  );
};

export default NosMissions;