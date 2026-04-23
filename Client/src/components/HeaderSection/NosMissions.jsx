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
  ChevronRight
} from "lucide-react";
import CONFIG from "../../config/config.js";

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center py-32">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#FF8C00] rounded-full animate-spin"></div>
    </div>
    <span className="text-gray-500 text-base mt-6 font-semibold tracking-wide uppercase"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      Chargement...
    </span>
  </div>
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

  const normalizeUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${CONFIG.BASE_URL}${url}`;
    return `${CONFIG.BASE_URL}/${url}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setError(null);
        const [missionsRes, teamRes, partnersRes] = await Promise.all([
          fetch(CONFIG.API_MISSION_LIST),
          fetch(CONFIG.API_TEAM_LIST),
          fetch(`${CONFIG.BASE_URL}/api/partners/`)
        ]);
        if (!missionsRes.ok || !teamRes.ok || !partnersRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        const [missionsData, teamData, partnersData] = await Promise.all([
          missionsRes.json(),
          teamRes.json(),
          partnersRes.json()
        ]);
        const missionArray = Array.isArray(missionsData) ? missionsData : missionsData.results || [];
        const activeMissions = missionArray
          .filter(m => m.is_active === true || m.isActive === true)
          .map(m => ({ ...m, image_url: normalizeUrl(m.image_url || m.image) }));
        const teamArray = Array.isArray(teamData) ? teamData : teamData.results || [];
        const activeTeam = teamArray
          .filter(m => m.is_active === true)
          .map(m => ({ ...m, photo_url: normalizeUrl(m.photo_url || m.photo) }));
        const partnerArray = Array.isArray(partnersData) ? partnersData : partnersData.results || [];
        const activePartners = partnerArray.filter(p => p.is_active === true || p.isActive === true);
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
      .split(/\n\n+/).map(b => b.trim()).filter(b => b.length > 5)
      .map(block => {
        const lines = block.split(/\n/).map(l => l.trim()).filter(l => l);
        if (!lines.length) return null;
        return { title: lines[0], description: lines.slice(1).join(" ") };
      }).filter(Boolean);
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
          <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
          <button onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 transition-all"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
      `}</style>

      <div className="min-h-screen bg-white pb-16">

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        {(() => {
          // Image fixe "À propos" — équipe professionnelle en collaboration, libre de droits (Unsplash)
          const heroImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1800&q=80&fit=crop";

          return (
            <section className="relative min-h-[520px] md:min-h-[600px] flex flex-col justify-center overflow-hidden">

              {/* ── Image de fond ── */}
              <div className="absolute inset-0">
                <img src={heroImage} alt="À propos VIALI"
                     className="w-full h-full object-cover object-center" />
              </div>
              {/* Overlay sombre pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65"></div>
              {/* Teinte orange brand */}
              <div className="absolute inset-0"
                   style={{ background: "linear-gradient(135deg, rgba(255,140,0,.30) 0%, rgba(0,0,0,.05) 50%, rgba(255,193,7,.18) 100%)" }}></div>

              {/* Anneaux décoratifs */}
              <div className="absolute top-8 right-[8%] w-72 h-72 border border-white/10 rounded-full pointer-events-none"></div>
              <div className="absolute top-16 right-[10%] w-48 h-48 border border-white/08 rounded-full pointer-events-none"></div>
              {/* Points déco bottom-left */}
              <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                    <circle key={`${r}-${c}`} cx={c*25+5} cy={r*25+5} r="3"
                            fill="white" opacity={(r+c)%2===0?0.9:0.4}/>
                  )))}
                </svg>
              </div>

              {/* ── Contenu ── */}
              <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center pt-32 pb-20 md:pt-40 md:pb-24">

                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5
                                bg-white/15 backdrop-blur-md border border-white/30
                                rounded-full mb-8 shadow-xl animate-slide-up">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full animate-ping opacity-50"></div>
                    <div className="relative w-7 h-7 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("missions.badge_text") || "Notre Vision & Engagement"}
                  </span>
                </div>

                {/* Titre blanc */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white animate-slide-up drop-shadow-2xl"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s',
                             textShadow: '0 4px 24px rgba(0,0,0,0.45)' }}>
                  {t("missions.title") || "Nos Missions"}
                </h1>

                {/* Ligne décorative */}
                <div className="flex justify-center mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"
                       style={{ boxShadow: '0 0 14px rgba(255,193,7,.7)' }}></div>
                </div>

                {/* Sous-titre */}
                <p className="text-lg md:text-xl text-white/80 font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed"
                   style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
                  {t("missions.subtitle") || "Découvrez nos valeurs fondamentales, notre équipe passionnée et nos partenaires de confiance"}
                </p>
              </div>

              {/* Vague blanche bas */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-16">
                  <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" fill="white"/>
                </svg>
              </div>
            </section>
          );
        })()}

        {/* ══════════════════════════════ MISSIONS ══════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24">

          {missions.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-100">
                <Target className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Aucune mission disponible
              </h3>
            </div>
          ) : (
            <div className="space-y-28">
              {missions.map((mission, missionIndex) => {
                const title          = mission[`title_${i18n.language}`]          || mission.title_fr          || mission.title_en          || "";
                const contentValeur  = mission[`content_valeur_${i18n.language}`]  || mission.content_valeur_fr  || "";
                const contentMission = mission[`content_mission_${i18n.language}`] || mission.content_mission_fr || "";

                const valeurData  = parseContent(contentValeur);
                const missionData = parseContent(contentMission);

                const hasValeur  = valeurData.left  || valeurData.items.length  > 0;
                const hasMission = missionData.left || missionData.items.length > 0;

                return (
                  <article key={mission.id} className="animate-slide-up"
                           style={{ animationDelay: `${missionIndex * 0.12}s` }}>

                    {/* ── LAYOUT INTELLIGENT ──
                        • Les deux → grille 2 colonnes
                        • Mission seule → pleine largeur premium
                        • Valeur seule  → pleine largeur
                    ── */}

                    {hasValeur && hasMission ? (
                      /* ═══ DEUX CARDS CÔTE À CÔTE ═══ */
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* CARD VALEUR */}
                        <div className="valeur-card relative rounded-[2rem] p-10 md:p-12 shadow-xl hover:shadow-2xl
                                        transition-all duration-500 border border-orange-100 hover:border-orange-300 hover:-translate-y-1 overflow-hidden">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-400/10 to-transparent rounded-bl-[4rem] pointer-events-none"></div>
                          <div className="flex items-start gap-4 mb-8 relative">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl blur-md opacity-40"></div>
                              <div className="relative w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg float-icon">
                                <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {t("missions.values") || "Nos Valeurs"}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="h-0.5 w-10 bg-gradient-to-r from-[#FFC107] to-transparent rounded-full"></div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Excellence</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-5 relative">
                            {valeurData.left && (
                              <div className="relative pl-5">
                                <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-gradient-to-b from-[#FFC107] to-[#FF8C00] rounded-full"></div>
                                <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  {valeurData.left}
                                </p>
                              </div>
                            )}
                            {valeurData.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-start p-4 rounded-2xl hover:bg-orange-50/80 transition-all border border-transparent hover:border-orange-100">
                                <div className="flex-shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"></div>
                                <div>
                                  <p className="font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</p>
                                  {item.description && <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 pt-6 border-t border-orange-100/80 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-orange-400" strokeWidth={2.5} />
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Excellence</span>
                          </div>
                        </div>

                        {/* CARD MISSION */}
                        <div className="mission-full-card relative rounded-[2rem] p-10 md:p-12 shadow-xl hover:shadow-2xl
                                        transition-all duration-500 border border-yellow-100 hover:border-yellow-300 hover:-translate-y-1 overflow-hidden">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-bl-[4rem] pointer-events-none"></div>
                          <div className="flex items-start gap-4 mb-8 relative">
                            <div className="relative flex-shrink-0">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-2xl blur-md opacity-40"></div>
                              <div className="relative w-16 h-16 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-2xl flex items-center justify-center shadow-lg float-icon-delay">
                                <Crosshair className="w-8 h-8 text-white" strokeWidth={2.5} />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {t("missions.mission") || "Notre Mission"}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="h-0.5 w-10 bg-gradient-to-r from-[#FF8C00] to-transparent rounded-full"></div>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Impact</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-5 relative">
                            {missionData.left && (
                              <div className="relative pl-5">
                                <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-gradient-to-b from-[#FF8C00] to-[#FFC107] rounded-full"></div>
                                <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                  {missionData.left}
                                </p>
                              </div>
                            )}
                            {missionData.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-start p-4 rounded-2xl hover:bg-yellow-50/80 transition-all border border-transparent hover:border-yellow-100">
                                <div className="flex-shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FFC107]"></div>
                                <div>
                                  <p className="font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</p>
                                  {item.description && <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-8 pt-6 border-t border-yellow-100/80 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Impact</span>
                          </div>
                        </div>

                      </div>

                    ) : hasMission ? (

                      /* ═══════════════════════════════════════════════════════════
                         CARD MISSION SEULE — PLEINE LARGEUR ULTRA MODERNE
                      ═══════════════════════════════════════════════════════════ */
                      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-orange-100
                                      hover:shadow-orange-200/50 hover:-translate-y-1 transition-all duration-500">

                        {/* Fond blanc */}
                        <div className="absolute inset-0 bg-white"></div>
                        {/* Mesh radial très subtil */}
                        <div className="absolute inset-0 pointer-events-none"
                             style={{ background: "radial-gradient(ellipse 70% 60% at 95% 5%, rgba(255,193,7,.05) 0%, transparent 55%), radial-gradient(ellipse 50% 70% at 5% 95%, rgba(255,140,0,.04) 0%, transparent 55%)" }}></div>

                        {/* Anneaux décoratifs top-right */}
                        <div className="absolute top-0 right-0 w-[420px] h-[420px] opacity-[0.12] pointer-events-none">
                          <svg viewBox="0 0 420 420" fill="none">
                            <circle cx="380" cy="40" r="200" stroke="url(#rg2)" strokeWidth="1.5"/>
                            <circle cx="380" cy="40" r="145" stroke="url(#rg2)" strokeWidth="1"/>
                            <circle cx="380" cy="40" r="90"  stroke="url(#rg2)" strokeWidth="0.8"/>
                            <defs>
                              <linearGradient id="rg2" x1="0" y1="0" x2="1" y2="1">
                                <stop stopColor="#FFC107"/>
                                <stop offset="1" stopColor="#FF8C00"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        {/* Grille de points bottom-left */}
                        <div className="absolute bottom-10 left-10 opacity-[0.12] pointer-events-none">
                          <svg width="110" height="110" viewBox="0 0 110 110">
                            {[0,1,2,3,4].map(row =>
                              [0,1,2,3,4].map(col => (
                                <circle key={`${row}-${col}`}
                                  cx={col * 22 + 3} cy={row * 22 + 3} r="3.5"
                                  fill="#FF8C00" opacity={(row + col) % 2 === 0 ? 1 : 0.45}
                                />
                              ))
                            )}
                          </svg>
                        </div>

                        {/* Contenu */}
                        <div className="relative z-10 p-10 md:p-14 lg:p-16">

                          {/* En-tête : icône + titre */}
                          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">

                            {/* Icône avec glow + pulse */}
                            <div className="relative flex-shrink-0 self-start">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-3xl blur-2xl opacity-45 scale-[1.3]"></div>
                              <div className="relative w-20 h-20 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] rounded-3xl flex items-center justify-center shadow-2xl float-icon-delay">
                                <Crosshair className="w-10 h-10 text-white" strokeWidth={2.5} />
                              </div>
                              <div className="absolute inset-0 rounded-3xl border-2 border-orange-400/50"
                                   style={{ animation: "pulse-ring 2.2s cubic-bezier(0,0,.2,1) infinite" }}></div>
                            </div>

                            {/* Titre */}
                            <div className="flex-1">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3
                                              bg-gradient-to-r from-[#FFC107]/20 to-[#FF8C00]/20
                                              border border-orange-200 rounded-full">
                                <Zap className="w-3 h-3 text-orange-600" strokeWidth={3} />
                                <span className="text-[11px] font-black text-orange-600 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  Impact
                                </span>
                              </div>
                              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight"
                                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {t("missions.mission") || "Notre Mission"}
                              </h3>
                              <div className="mt-4 h-1 w-28 rounded-full"
                                   style={{ background: "linear-gradient(90deg, #FFC107, #FF8C00, #FF6B00)", backgroundSize: "200% 100%", animation: "gradient-flow 3s ease-in-out infinite" }}>
                              </div>
                            </div>
                          </div>

                          {/* Texte principal */}
                          <div className="space-y-8 max-w-5xl">
                            {missionData.left && (
                              <div className="relative">
                                {/* Guillemet décoratif */}
                                <span className="absolute -top-6 -left-2 text-9xl font-black text-orange-200/50 leading-none select-none pointer-events-none"
                                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>"</span>
                                <div className="relative pl-6">
                                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#FF8C00] via-[#FFC107] to-[#FF8C00] rounded-full"></div>
                                  <p className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed"
                                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {missionData.left}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Items en grille 2 colonnes */}
                            {missionData.items.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {missionData.items.map((item, idx) => (
                                  <div key={idx}
                                       className="group flex gap-4 items-start p-5 rounded-2xl
                                                  bg-white/75 backdrop-blur-sm
                                                  border border-orange-100 hover:border-orange-300
                                                  hover:bg-white hover:shadow-xl hover:shadow-orange-100/50
                                                  transition-all duration-300 hover:-translate-y-0.5">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FF8C00] flex items-center justify-center shadow-md">
                                        <ChevronRight className="w-4 h-4 text-white" strokeWidth={3} />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-black text-gray-900 mb-1 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        {item.title}
                                      </p>
                                      {item.description && (
                                        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Footer badges */}
                          <div className="mt-12 pt-8 border-t border-orange-100/60 flex flex-wrap items-center gap-6">
                            {[
                              { icon: <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"></div>, label: "Mission" },
                              { icon: <TrendingUp className="w-4 h-4 text-orange-400" strokeWidth={2.5} />, label: "Engagement" },
                              { icon: <Zap className="w-4 h-4 text-yellow-500" strokeWidth={2.5} />, label: "Impact" },
                            ].map(({ icon, label }) => (
                              <div key={label} className="flex items-center gap-2">
                                {icon}
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  {label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    ) : hasValeur ? (

                      /* ═══ CARD VALEUR SEULE — PLEINE LARGEUR ═══ */
                      <div className="valeur-card relative rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-orange-100
                                      hover:border-orange-300 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <div className="flex items-start gap-4 mb-8">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl blur opacity-40"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center shadow-lg float-icon">
                              <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {t("missions.values") || "Nos Valeurs"}
                            </h3>
                            <div className="h-0.5 w-12 bg-gradient-to-r from-[#FFC107] to-transparent rounded-full mt-2"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {valeurData.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start p-5 rounded-2xl bg-white/80 border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all">
                              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00] mt-2 flex-shrink-0"></div>
                              <div>
                                <p className="font-black text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</p>
                                {item.description && <p className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>{item.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    ) : null}

                    {/* ── IMAGE après les cards ── */}
                    {mission.image_url && (
                      <div className="mt-12 rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl">
                        <img
                          src={mission.image_url}
                          alt={title}
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: 'none' }}
                          loading="lazy"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {/* ── Séparateur ── */}
                    {missionIndex < missions.length - 1 && (
                      <div className="mt-24 flex items-center gap-4">
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

        {/* ══════════════════════════════ ÉQUIPE ══════════════════════════════ */}
        {team.length > 0 && (
          <section className="py-24 px-6 bg-gradient-to-br from-gray-50/80 via-orange-50/20 to-yellow-50/20">
            <div className="max-w-[1600px] mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md border border-orange-200 rounded-full mb-6 shadow-lg">
                  <Users className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notre Équipe</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  L'équipe qui fait la différence
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mx-auto"></div>
              </div>
              <div className="space-y-12">
                {team.slice(0, 5).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {team.slice(0, 5).map((membre, idx) => (
                      <article key={membre.id} className="group animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="relative mb-4 overflow-hidden rounded-3xl aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
                          <img src={membre.photo_url || "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"}
                               alt={membre.full_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          {membre.linkedin && (
                            <a href={membre.linkedin} target="_blank" rel="noopener noreferrer"
                               className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg">
                              <Linkedin className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                            </a>
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-base font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {membre.full_name}
                          </h3>
                          <p className="text-xs text-gray-500 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {team.slice(5, 8).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {team.slice(5, 8).map((membre) => (
                      <article key={membre.id} className="group">
                        <div className="relative mb-5 overflow-hidden rounded-3xl aspect-[3/4] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
                          <img src={membre.photo_url || "https://placehold.co/600x800/F5F5F5/CCCCCC?text=Photo"}
                               alt={membre.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-[#FF8C00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {membre.full_name}
                          </h3>
                          <p className="text-sm text-gray-500 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {membre.position_fr || membre[`position_${i18n.language}`] || "Membre"}
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
          <section className="py-24 px-6">
            <div className="max-w-[1600px] mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-full mb-6 shadow-sm">
                  <Handshake className="w-5 h-5 text-[#FF8C00]" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nos Partenaires</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Ils nous font confiance
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {partners.map((partner, idx) => {
                  const partnerName  = partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
                  const partnerImage = partner.cover_image_url || partner.cover_image;
                  return (
                    <div key={partner.id}
                         onClick={() => partner.website_url && window.open(partner.website_url, "_blank")}
                         className={`group animate-slide-up ${partner.website_url ? 'cursor-pointer' : ''}`}
                         style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                        <div className="aspect-square p-6 bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
                          {partnerImage
                            ? <img src={partnerImage} alt={`Logo ${partnerName}`} className="w-full h-full object-contain transition-transform group-hover:scale-110" loading="lazy" />
                            : <Handshake className="w-20 h-20 text-gray-300 mx-auto" strokeWidth={2} />
                          }
                          {partner.website_url && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center bg-gradient-to-t from-orange-500/10 to-transparent">
                              <div className="bg-white rounded-full p-3 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                <ExternalLink className="w-6 h-6 text-[#FF8C00]" strokeWidth={2.5} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-3 bg-white border-t border-gray-100 group-hover:bg-orange-50/50 transition-colors">
                          <h3 className="text-center text-sm font-bold text-gray-900 truncate group-hover:text-[#FF8C00] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {partnerName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════ CTA FINAL ══════════════════════════════ */}
        {/* <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00] via-[#FFA500] to-[#FFC107]"></div>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,0,0,.08) 0%, transparent 50%)" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-white/10 rounded-full pointer-events-none"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 shadow-xl border border-white/30">
              <Handshake className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Rejoignez l'aventure VIALI
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
               style={{ fontFamily: "'Inter', sans-serif" }}>
              Découvrez comment nous pouvons travailler ensemble pour créer de la valeur
            </p>
            <a href="/contacternous"
               className="glow-btn group inline-flex items-center gap-3 px-8 py-4
                          bg-white text-[#FF8C00] font-black text-lg rounded-2xl
                          shadow-2xl hover:scale-105 transition-all duration-300"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span>Contactez-nous</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" strokeWidth={2.5} />
            </a>
          </div>
        </section> */}

        {/* ══════════════════════════════ WHATSAPP ══════════════════════════════ */}
        <a href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
           target="_blank" rel="noopener noreferrer"
           className="fixed bottom-6 right-6 z-50 group"
           aria-label="Contactez-nous sur WhatsApp">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600
                          rounded-full shadow-2xl flex items-center justify-center
                          hover:scale-110 transition-all duration-300 border-4 border-white">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <div className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contactez-nous sur WhatsApp</p>
              <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>Réponse rapide garantie</p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>

      </div>
    </>
  );
};

export default NosMissions;