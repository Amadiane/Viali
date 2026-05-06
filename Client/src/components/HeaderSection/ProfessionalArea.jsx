import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";
import { Search, Loader2, Sparkles, Zap, TrendingUp, Target, Lightbulb, Rocket, ArrowRight } from "lucide-react";

// Component to fetch and display ALL partners in infinite scrolling carousel
const PartnersPreview = ({ partners: propPartners }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si des partenaires spécifiques sont passés (depuis recherche.partners), on les utilise
    // Sinon fallback sur tous les partenaires
    const fetchPartners = async () => {
      try {
        if (propPartners && propPartners.length > 0) {
          setPartners(propPartners);
          setLoading(false);
          return;
        }
        const response = await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/`);
        if (!response.ok) throw new Error("Erreur");
        const data = await response.json();
        const partnerData = Array.isArray(data) ? data : data.results || [];
        // Partenaires filtrés depuis la recherche — voir rechercheData.partners
        const activePartners = partnerData.filter(
          partner => partner.is_active === true || partner.isActive === true
        );
        setPartners(activePartners);
      } catch (error) {
        console.error("Erreur partners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin" strokeWidth={2.5} />
      </div>
    );
  }

  if (partners.length === 0) return null;

  const halfLength = Math.ceil(partners.length / 2);
  const row1Partners = partners.slice(0, halfLength);
  const row2Partners = partners.slice(halfLength);
  const row1Duplicated = [...row1Partners, ...row1Partners, ...row1Partners];
  const row2Duplicated = [...row2Partners, ...row2Partners, ...row2Partners];

  return (
    <div className="space-y-8 overflow-hidden">
      <div className="relative">
        <div className="flex gap-8 animate-scroll-left">
          {row1Duplicated.map((partner, idx) => {
            const partnerImage = partner.cover_image_url || partner.cover_image;
            const partnerName = partner.name || partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
            return (
              <a
                key={`row1-${partner.id}-${idx}`}
                href={partner.website_url || "#"}
                target={partner.website_url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="flex-shrink-0 w-52 flex flex-col bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="w-full h-28 flex items-center justify-center p-4">
                  {partnerImage ? (
                    <img src={partnerImage} alt={partnerName}
                         className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                      <span className="text-gray-400 font-bold text-xs text-center px-2"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{partnerName}</span>
                    </div>
                  )}
                </div>
                <div className="w-full px-3 py-2 border-t border-gray-100 bg-gray-50 group-hover:bg-orange-50 transition-colors">
                  <p className="text-center text-xs font-black text-gray-700 group-hover:text-[#FF8C00] truncate transition-colors"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{partnerName}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <div className="relative">
        <div className="flex gap-8 animate-scroll-right">
          {row2Duplicated.map((partner, idx) => {
            const partnerImage = partner.cover_image_url || partner.cover_image;
            const partnerName = partner.name || partner.name_fr || partner.display_name || partner.name_en || "Partenaire";
            return (
              <a
                key={`row2-${partner.id}-${idx}`}
                href={partner.website_url || "#"}
                target={partner.website_url ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="flex-shrink-0 w-52 flex flex-col bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="w-full h-28 flex items-center justify-center p-4">
                  {partnerImage ? (
                    <img src={partnerImage} alt={partnerName}
                         className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                      <span className="text-gray-400 font-bold text-xs text-center px-2"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{partnerName}</span>
                    </div>
                  )}
                </div>
                <div className="w-full px-3 py-2 border-t border-gray-100 bg-gray-50 group-hover:bg-orange-50 transition-colors">
                  <p className="text-center text-xs font-black text-gray-700 group-hover:text-[#FF8C00] truncate transition-colors"
                     style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{partnerName}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Formulaire Contact Professionnel (intégré) ──
const ContactProForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    nom: "", email: "", entreprise: "", poste: "", sujet: "", message: ""
  });
  const [status, setStatus]     = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const sujets = [
    t("contact_pro.subject_rd")           || "Partenariat R&D",
    t("contact_pro.subject_collab")       || "Collaboration scientifique",
    t("contact_pro.subject_invest")       || "Investissement",
    t("contact_pro.subject_info")         || "Demande d'information",
    t("contact_pro.subject_commercial")   || "Proposition commerciale",
    t("contact_pro.subject_other")        || "Autre",
  ];

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setStatus("loading"); setErrorMsg("");
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/contact-professionnel/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ nom: "", email: "", entreprise: "", poste: "", sujet: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg(t("contact_pro.error") || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
            <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("contact_pro.badge") || "Espace Professionnel"}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("contact_pro.title") || "Travaillons ensemble"}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto"
             style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("contact_pro.subtitle") || "Vous êtes un professionnel, un investisseur ou un partenaire potentiel ? Contactez-nous directement."}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mx-auto mt-6"></div>
        </div>

        {status === "success" ? (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("contact_pro.success_title") || "Message envoyé !"}
            </h3>
            <p className="text-gray-500 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("contact_pro.success_desc") || "Notre équipe vous répondra dans les plus brefs délais."}
            </p>
            <button onClick={() => setStatus(null)}
              className="px-6 py-3 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 transition-all"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("contact_pro.send_another") || "Envoyer un autre message"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#FFC107] via-[#FF8C00] to-[#FF6B00]"></div>
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("contact_pro.label_name") || "Nom complet *"}
                  </label>
                  <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                    placeholder={t("contact_pro.ph_name") || "Jean Dupont"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition-all font-medium text-gray-800 bg-gray-50/50"
                    style={{ fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("contact_pro.label_email") || "Email professionnel *"}
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder={t("contact_pro.ph_email") || "jean@entreprise.com"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition-all font-medium text-gray-800 bg-gray-50/50"
                    style={{ fontFamily: "'Inter', sans-serif" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("contact_pro.label_company") || "Entreprise / Organisation"}
                  </label>
                  <input type="text" name="entreprise" value={form.entreprise} onChange={handleChange}
                    placeholder={t("contact_pro.ph_company") || "Nom de votre organisation"}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition-all font-medium text-gray-800 bg-gray-50/50"
                    style={{ fontFamily: "'Inter', sans-serif" }} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("contact_pro.label_position") || "Poste / Fonction"}
                  </label>
                  <input type="text" name="poste" value={form.poste} onChange={handleChange}
                    placeholder={t("contact_pro.ph_position") || "Directeur, Chercheur, Investisseur..."}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition-all font-medium text-gray-800 bg-gray-50/50"
                    style={{ fontFamily: "'Inter', sans-serif" }} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Sujet *
                </label>
                <select name="sujet" value={form.sujet} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition-all font-medium text-gray-800 bg-gray-50/50 cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <option value="">{t("contact_pro.select_subject") || "— Sélectionnez un sujet —"}</option>
                  {sujets.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Message *
                </label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                  placeholder={t("contact_pro.ph_message") || "Décrivez votre projet, votre proposition ou votre demande..."}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20 transition-all font-medium text-gray-800 bg-gray-50/50 resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }} />
                <p className="text-xs text-gray-400 text-right">{form.message.length} caractères</p>
              </div>

              {status === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 font-medium text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{errorMsg}</p>
                </div>
              )}

              <button type="submit" disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-black text-lg rounded-2xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {status === "loading" ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t("contact_pro.submitting") || "Envoi en cours..."}</>
                ) : (
                  <><ArrowRight className="w-5 h-5" /> {t("contact_pro.submit") || "Envoyer ma demande"}</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("contact_pro.privacy") || "Vos données sont traitées de manière confidentielle."}
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

const ProfessionalArea = () => {
  const { t, i18n } = useTranslation();
  const [recherche, setRecherche] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchRecherche();
  }, []);

  const fetchRecherche = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/recherche/`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      let rechercheData = Array.isArray(data) ? data[0] : data.results?.[0] || data;
      if (rechercheData) {
        for (let i = 1; i <= 5; i++) {
          const imageUrlKey = `image_${i}_url`;
          const imageKey = `image_${i}`;
          if (rechercheData[imageUrlKey]) rechercheData[imageKey] = rechercheData[imageUrlKey];
        }
      }
      setRecherche(rechercheData);
    } catch (err) {
      setError("Impossible de charger les informations de recherche");
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedField = (obj, fieldBase, sectionNum) => {
    if (!obj) return "";
    const currentLang = i18n.language;
    const fieldName = `${fieldBase}${sectionNum}_${currentLang}`;
    const fallbackField = `${fieldBase}${sectionNum}_fr`;
    return obj[fieldName] || obj[fallbackField] || "";
  };

  const sectionIcons = [Lightbulb, Target, TrendingUp, Rocket, Zap];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin mx-auto mb-4" strokeWidth={2.5} />
          <p className="text-gray-600 font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("common.loading") || "Chargement..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("common.error") || "Erreur"}
          </h2>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!recherche) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
            <Sparkles className="w-12 h-12 text-[#FF8C00]" strokeWidth={2.5} />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("research.noData") || "Aucune information disponible"}
          </h3>
          <p className="text-gray-600 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("research.noDataDesc") || "Le contenu de recherche sera bientôt disponible"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
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
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16,1,0.3,1); }

        .gradient-text {
          background: linear-gradient(135deg, #FFC107 0%, #FF8C00 50%, #FFC107 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .separator-line {
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #FFC107 20%, #FF8C00 50%, #FFC107 80%, transparent 100%);
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(255,140,0,.3);
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-left:hover { animation-play-state: paused; }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
        .animate-scroll-right:hover { animation-play-state: paused; }
      `}</style>

      <div className="min-h-screen bg-white pb-16">

        {/* ══════════════════════════════ HERO avec image ══════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ zIndex: 0 }}>

          {/* Image de fond — laboratoire / innovation / R&D (Unsplash, libre de droits) */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1800&q=80&fit=crop"
              alt="Espace Professionnel"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65"></div>
          {/* Teinte orange brand */}
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(135deg, rgba(255,140,0,.28) 0%, rgba(0,0,0,.05) 50%, rgba(255,193,7,.15) 100%)" }}></div>

          {/* Anneaux décoratifs */}
          <div className="absolute top-8 right-[8%] w-72 h-72 border border-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute top-16 right-[10%] w-48 h-48 border border-white/10 rounded-full pointer-events-none"></div>
          {/* Points déco */}
          <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                <circle key={`${r}-${c}`} cx={c*25+5} cy={r*25+5} r="3"
                        fill="white" opacity={(r+c)%2===0?0.9:0.4}/>
              )))}
            </svg>
          </div>

          {/* Contenu — commence sous la navbar (72px) + espace badge */}
          <div className="relative z-10 w-full mx-auto px-6 text-center"
               style={{ paddingTop: '120px', paddingBottom: '72px' }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5
                            bg-white/15 backdrop-blur-md border border-white/30
                            rounded-full mb-6 shadow-xl animate-slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full animate-ping opacity-50"></div>
                <div className="relative w-7 h-7 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-sm font-bold text-white tracking-wide"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("research.badge") || "Innovation & Excellence"}
              </span>
            </div>

            {/* Titre — 1 ligne, monospace cohérent */}
            <h1 className="font-black mb-4 tracking-tight text-white animate-slide-up drop-shadow-2xl whitespace-nowrap"
                style={{
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
                  animationDelay: '0.1s',
                  textShadow: '0 4px 24px rgba(0,0,0,0.45)'
                }}>
              {t("research.title") || "Recherche & Développement"}
            </h1>

            {/* Ligne décorative */}
            <div className="flex justify-center mb-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"
                   style={{ boxShadow: '0 0 14px rgba(255,193,7,.7)' }}></div>
            </div>

            {/* Sous-titre */}
            <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("research.subtitle") || "Découvrez nos axes de recherche et innovations"}
            </p>
          </div>

          {/* Vague blanche bas */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-16">
              <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* ══════════════════════════════ STATS ══════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-6 py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Lightbulb,  value: "5+",   label: t("research.stat1") || "Domaines" },
              { icon: Target,     value: "100%", label: t("research.stat2") || "Innovation" },
              { icon: TrendingUp, value: "24/7", label: t("research.stat3") || "Recherche" },
              { icon: Rocket,     value: "∞",    label: t("research.stat4") || "Possibilités" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-[#FF8C00] mb-2"
                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-gray-600 uppercase tracking-wide"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════ SECTIONS CONTENU ══════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 md:py-10 space-y-16">
          {[1, 2, 3, 4, 5].map((num) => {
            const title   = getLocalizedField(recherche, "title", num);
            const content = getLocalizedField(recherche, "content", num);
            const image   = recherche[`image_${num}`];

            if (!title && !content && !image) return null;

            const Icon = sectionIcons[num - 1];

            return (
              <article key={num} className="animate-slide-up" style={{ animationDelay: `${num * 0.1}s` }}>

                {/* Icon + Titre */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full"></div>
                  </div>
                  {title && (
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {title}
                    </h3>
                  )}
                </div>

                {/* Image pleine largeur */}
                {image && (
                  <div className="mb-6 rounded-3xl overflow-hidden bg-white">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-auto max-w-full object-contain"
                      style={{ maxHeight: 'none' }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full min-h-[400px] flex items-center justify-center p-12 bg-gradient-to-br from-orange-50 to-yellow-50">
                      <div className="text-center">
                        <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" strokeWidth={2} />
                        <p className="text-gray-500 font-semibold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          Image non disponible
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contenu texte */}
                {content && (
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-10 mb-6 border-l-4 border-[#FF8C00]">
                    <p className="text-gray-800 leading-relaxed text-xl md:text-2xl font-medium whitespace-pre-line m-0"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                      {content}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ══════════════════════════════ FORMULAIRE CONTACT PRO ══════════════════════════════ */}
        <ContactProForm />

        {/* ══════════════════════════════ PARTENAIRES ══════════════════════════════ */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                ILS NOUS ONT FAIT CONFIANCE
              </h2>
              <p className="text-2xl md:text-3xl font-bold mb-2"
                 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FF8C00' }}>
                pourquoi pas vous ?
              </p>
              <div className="flex justify-center mt-8">
                <svg width="120" height="80" viewBox="0 0 120 80" className="text-gray-900">
                  <path d="M10 10 Q 40 40, 70 10 T 110 30"
                        stroke="currentColor" strokeWidth="2" fill="none"
                        markerEnd="url(#arrowhead)"/>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="currentColor"/>
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Partenaires spécifiques à cette recherche, ou tous si non définis */}
            <PartnersPreview partners={recherche.partners || []} />


          </div>
        </section>

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

export default ProfessionalArea;