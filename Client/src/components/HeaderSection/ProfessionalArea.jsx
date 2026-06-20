import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CONFIG from "../../config/config.js";
import { Search, Loader2, Sparkles, Zap, TrendingUp, Target, Lightbulb, Rocket, ArrowRight, X, CheckCircle2, Layers, Settings, Cpu, Boxes, ShieldCheck, MapPin, Award } from "lucide-react";

// Component to fetch and display ALL partners in infinite scrolling carousel
const PartnersPreview = ({ partners: propPartners }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <section className="py-8 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full mb-3 sm:mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
            <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("contact_pro.badge") || "Espace Professionnel"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("contact_pro.title") || "Travaillons ensemble"}
          </h2>
          <p className="text-sm sm:text-lg text-gray-500 max-w-xl mx-auto"
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
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-12 space-y-4 sm:space-y-6">

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
                className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {status === "loading" ? (
                  <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> {t("contact_pro.submitting") || "Envoi en cours..."}</>
                ) : (
                  <><ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> {t("contact_pro.submit") || "Envoyer ma demande"}</>
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

// ── SVG flamme VIALI ──
const VialiFlame = ({ size = 60, opacity = 1, color1 = "#FFC107", color2 = "#FF8C00" }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 60 78" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
    <path
      d="M30 75 C10 55 8 35 18 18 C22 10 28 4 30 2 C32 4 38 10 42 18 C52 35 50 55 30 75Z"
      fill={`url(#flame-grad-${color1.replace('#','')})`}
    />
    <path
      d="M30 65 C16 48 15 32 22 20 C25 14 28 9 30 7 C32 9 35 14 38 20 C45 32 44 48 30 65Z"
      fill={`url(#flame-inner-${color2.replace('#','')})`}
      opacity="0.7"
    />
    <defs>
      <linearGradient id={`flame-grad-${color1.replace('#','')}`} x1="30" y1="2" x2="30" y2="75" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={color1} />
        <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id={`flame-inner-${color2.replace('#','')}`} x1="30" y1="7" x2="30" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor={color1} stopOpacity="0.4" />
      </linearGradient>
    </defs>
  </svg>
);

// ── SAVOIR-FAIRE — 4 cartes ──
const SavoirFaire = ({ t }) => {
  const cards = [
    {
      icon: Search,
      title: t("research.sf_title1") || "Étude de faisabilité technique",
      items: [
        t("research.sf1_item1") || "Nous proposons la meilleure analyse possible en tenant compte des différents enjeux.",
        t("research.sf1_item2") || "Une relation privilégiée avec nos partenaires (fournisseur d'emballage, fournisseur de machine, agence de création) nous permet de vous proposer une solution adaptée à vos besoins.",
      ],
    },
    {
      icon: TrendingUp,
      title: t("research.sf_title2") || "Modélisation financière & structuration d'investissement de projet",
      items: [
        t("research.sf2_item1") || "Réalisation d'étude de marché",
        t("research.sf2_item2") || "Conception de modèle financier & rédaction de Business plan",
        t("research.sf2_item3") || "Analyse de rentabilité",
        t("research.sf2_item4") || "Préparation à la levée de fonds",
      ],
    },
    {
      icon: Boxes,
      title: t("research.sf_title3") || "Formulation & sourcing matière première",
      items: [
        t("research.sf3_item1") || "Nous développons tout type de recettes : tartines de poissons, sauces (mayonnaise, ketchup, mixte, exotique, chaudes), piments, jus naturels, épices, confitures, etc.",
        t("research.sf3_item2") || "Sourcing matières premières et emballages : notre engagement est de mettre en avant le contenu local. 70% de nos partenaires sont des fournisseurs locaux.",
      ],
    },
    {
      icon: ShieldCheck,
      title: t("research.sf_title4") || "Fabrication, conditionnement et traçabilité",
      items: [
        t("research.sf4_item1") || "Fabrication et conditionnement sur la base de notre expertise et selon les critères validés par le client.",
        t("research.sf4_item2") || "Identification des produits à chaque étape de la production, de la réception des matières premières à la livraison des produits finis chez le client.",
      ],
    },
  ];

  return (
    <section className="py-8 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-full mb-3 sm:mb-6 shadow-sm">
            <Settings className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
            <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("research.sf_badge") || "Comment nous travaillons"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("research.sf_heading") || "Notre savoir-faire"}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full mx-auto"></div>
        </div>

        {/* Grille 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {cards.map(({ icon: Icon, title, items }, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl md:rounded-[1.75rem] p-6 sm:p-8 border border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FF8C00] flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3
                  className="text-base sm:text-lg font-black text-gray-900 leading-snug pt-1.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {title}
                </h3>
              </div>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"></div>
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── EXPERTISE INDUSTRIELLE — cercle central + 4 blocs avec icônes rondes colorées ──
const ExpertiseIndustrielle = ({ t }) => {
  const blocks = [
    {
      position: "top-left",
      color: "#0E9488",
      icon: Settings,
      title: t("research.exp_title1") || "Adaptabilité",
      items: [
        t("research.exp1_item1") || "Petite et moyenne série de production",
        t("research.exp1_item2") || "Maîtrise et réduction des coûts",
      ],
    },
    {
      position: "top-right",
      color: "#3F8F5C",
      icon: MapPin,
      title: t("research.exp_title2") || "Maîtrise de l'environnement local",
      items: [
        t("research.exp2_item1") || "Maîtrise du contexte local",
        t("research.exp2_item2") || "Ancrage institutionnel et relationnel",
        t("research.exp2_item3") || "Gestion des risques & durabilité",
        t("research.exp2_item4") || "Intégration des contraintes et opportunités",
      ],
    },
    {
      position: "bottom-left",
      color: "#3D3229",
      icon: ShieldCheck,
      title: t("research.exp_title3") || "Système qualité garantie",
      items: [
        t("research.exp3_item1") || "Respect des exigences réglementaires et industrielles",
        t("research.exp3_item2") || "Méthode HACCP",
        t("research.exp3_item3") || "Analyse laboratoire",
      ],
    },
    {
      position: "bottom-right",
      color: "#B5482F",
      icon: Layers,
      title: t("research.exp_title4") || "Approche axée contenu local",
      items: [
        t("research.exp4_item1") || "Utilisation prioritaire de ressources locales",
        t("research.exp4_item2") || "Collaboration avec des fournisseurs et sous-traitants locaux qualifiés",
        t("research.exp4_item3") || "Développement de la chaîne de valeur locale",
      ],
    },
  ];

  const BlockCard = ({ block, align }) => {
    const Icon = block.icon;
    return (
      <div className={`flex flex-col ${align === "right" ? "items-start text-left" : "items-end text-right"} max-w-[280px]`}>
        <div className={`flex items-center gap-3 mb-3 ${align === "right" ? "flex-row" : "flex-row-reverse"}`}>
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: block.color }}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-base font-black leading-snug" style={{ color: block.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {block.title}
          </p>
        </div>
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-2.5 ${align === "right" ? "flex-row" : "flex-row-reverse"}`}>
              <div className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: block.color }}></div>
              <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="py-8 sm:py-20 md:py-24 px-4 sm:px-6 bg-[#faf5ef]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-orange-200 rounded-full mb-3 sm:mb-6 shadow-sm">
            <Award className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
            <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("research.exp_badge") || "Notre force"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {t("research.exp_heading") || "Notre expertise industrielle"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("research.exp_subtitle") || "Quatre piliers qui font de VIALI un partenaire industriel fiable, agile et ancré localement."}
          </p>
        </div>

        {/* ── Desktop : grille 3 colonnes (texte | anneau réservé | texte) — empêche tout chevauchement ── */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div className="grid items-center gap-x-6 lg:gap-x-10" style={{ gridTemplateColumns: '1fr 290px 1fr' }}>

            {/* Colonne gauche — Adaptabilité (haut) + Système qualité (bas) */}
            <div className="flex flex-col gap-12 items-end text-right">
              <BlockCard block={blocks[0]} align="left" />
              <BlockCard block={blocks[2]} align="left" />
            </div>

            {/* Colonne centrale — anneau SVG */}
            <div className="flex justify-center">
              <svg width="280" height="280" viewBox="0 0 280 280" aria-hidden="true">
                {/* Segment teal — Adaptabilité (haut-gauche) */}
                <path d="M 140 22 A 118 118 0 0 0 22 140" fill="none" stroke="#0E9488" strokeWidth="42" />
                {/* Segment vert — Maîtrise environnement (haut-droite) */}
                <path d="M 140 22 A 118 118 0 0 1 258 140" fill="none" stroke="#3F8F5C" strokeWidth="42" />
                {/* Segment anthracite — Système qualité (bas-gauche) */}
                <path d="M 22 140 A 118 118 0 0 0 140 258" fill="none" stroke="#3D3229" strokeWidth="42" />
                {/* Segment brique — Contenu local (bas-droite) */}
                <path d="M 258 140 A 118 118 0 0 1 140 258" fill="none" stroke="#B5482F" strokeWidth="42" />

                {/* Séparateurs blancs entre segments */}
                <line x1="140" y1="20" x2="140" y2="62" stroke="white" strokeWidth="3" />
                <line x1="20" y1="140" x2="62" y2="140" stroke="white" strokeWidth="3" />
                <line x1="260" y1="140" x2="218" y2="140" stroke="white" strokeWidth="3" />
                <line x1="140" y1="260" x2="140" y2="218" stroke="white" strokeWidth="3" />

                {/* Arcs invisibles au rayon exact de l'anneau (r=118), servant de guide pour le texte courbé (textPath) */}
                <defs>
                  <path id="arcTL" d="M 22.45 129.72 A 118 118 0 0 1 129.72 22.45" fill="none" />
                  <path id="arcTR" d="M 150.28 22.45 A 118 118 0 0 1 257.55 129.72" fill="none" />
                  <path id="arcBL" d="M 22.45 150.28 A 118 118 0 0 0 129.72 257.55" fill="none" />
                  <path id="arcBR" d="M 150.28 257.55 A 118 118 0 0 0 257.55 150.28" fill="none" />
                  <linearGradient id="centerGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#FFC107" />
                    <stop offset="1" stopColor="#FF8C00" />
                  </linearGradient>
                </defs>

                {/* Labels qui suivent la courbe de l'anneau (comme sur le visuel de référence) */}
                <text fontSize="13" fontWeight="800" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="0.3">
                  <textPath href="#arcTL" startOffset="50%" textAnchor="middle">ADAPTABILITÉ</textPath>
                </text>
                <text fontSize="13" fontWeight="800" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="0.3">
                  <textPath href="#arcTR" startOffset="50%" textAnchor="middle">ENVIRONNEMENT</textPath>
                </text>
                <text fontSize="13" fontWeight="800" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="0.3">
                  <textPath href="#arcBL" startOffset="50%" textAnchor="middle">QUALITÉ</textPath>
                </text>
                <text fontSize="13" fontWeight="800" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif" letterSpacing="0.3">
                  <textPath href="#arcBR" startOffset="50%" textAnchor="middle">CONTENU</textPath>
                </text>

                {/* Cercle central orange — bien visible, label net et horizontal */}
                <circle cx="140" cy="140" r="68" fill="#faf5ef" />
                <circle cx="140" cy="140" r="62" fill="url(#centerGrad)" />
                <text x="140" y="135" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif">
                  EXPERTISE
                </text>
                <text x="140" y="153" textAnchor="middle" fontSize="14" fontWeight="900" fill="white" fontFamily="'Plus Jakarta Sans', sans-serif">
                  INDUSTRIELLE
                </text>
              </svg>
            </div>

            {/* Colonne droite — Maîtrise environnement (haut) + Contenu local (bas) */}
            <div className="flex flex-col gap-12 items-start text-left">
              <BlockCard block={blocks[1]} align="right" />
              <BlockCard block={blocks[3]} align="right" />
            </div>
          </div>
        </div>

        {/* ── Mobile : cartes empilées ── */}
        <div className="flex flex-col gap-6 md:hidden">
          {blocks.map((block, idx) => {
            const Icon = block.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: block.color }}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-base font-black" style={{ color: block.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {block.title}
                  </p>
                </div>
                <ul className="space-y-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: block.color }}></div>
                      <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── Image de section avec gestion propre de l'échec de chargement ──
// Si l'image ne charge pas (URL invalide, 404, etc.), le composant ne
// rend RIEN du tout plutôt que de laisser un conteneur vide à la place.
const ImageWithFallback = ({ image, title, num, onZoom, onFail }) => {
  const [failed, setFailed] = useState(false);

  if (!image || failed) return null;

  return (
    <div className="mb-2 sm:mb-6" style={{ position: "relative", lineHeight: 0 }}>
      <div style={{
        overflow: "hidden",
        borderRadius: 16,
        position: "relative",
        background: "#f9fafb",
      }}>
        <img
          src={image}
          alt={title || `Section ${num}`}
          className="section-img"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
          loading="lazy"
          onClick={onZoom}
          onError={() => { setFailed(true); onFail && onFail(); }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, #FFC107, #FF8C00)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
};

const ProfessionalArea = () => {
  const { t, i18n } = useTranslation();
  const [recherche, setRecherche] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── LIGHTBOX ──
  const [lightbox, setLightbox] = useState(null);

  // ── Suivi des images de section qui ont échoué au chargement ──
  const [failedImages, setFailedImages] = useState({});

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
          const imageKey    = `image_${i}`;
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
    const currentLang   = i18n.language;
    const fieldName     = `${fieldBase}${sectionNum}_${currentLang}`;
    const fallbackField = `${fieldBase}${sectionNum}_fr`;
    return obj[fieldName] || obj[fallbackField] || "";
  };

  const sectionIcons = [Lightbulb, Target, TrendingUp, Rocket, Zap];

  const heroBgImage = recherche?.image_5
    || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1800&q=80&fit=crop";

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
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes viali-pulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.32; transform: scale(1.06); }
        }
        @keyframes viali-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes viali-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes side-shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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

        .section-img {
          transition: transform .6s ease, box-shadow .4s;
          cursor: zoom-in;
        }
        .section-img:hover {
          transform: scale(1.015);
          box-shadow: 0 20px 60px rgba(255,140,0,.2);
        }

        .viali-side-panel {
          background: linear-gradient(160deg,
            #0d0500 0%,
            #1a0800 20%,
            #2a1000 40%,
            #1a0800 60%,
            #0d0500 100%
          );
          background-size: 200% 200%;
          animation: side-shimmer 8s ease infinite;
        }

        .viali-flame-float {
          animation: viali-float 4s ease-in-out infinite;
        }
        .viali-flame-float-delay {
          animation: viali-float 4s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        .viali-ring-pulse {
          animation: viali-pulse 3s ease-in-out infinite;
        }
        .viali-ring-pulse-delay {
          animation: viali-pulse 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .viali-spin-slow {
          animation: viali-rotate 20s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ zIndex: 0, minHeight: '100vh' }}>

          {/* ── FOND GLOBAL : brun-noir VIALI ── */}
          <div className="absolute inset-0 viali-side-panel" />

          {/* ── PANNEAUX LATÉRAUX DÉCORATIFS ── */}

          {/* ── Panneau GAUCHE ── */}
          {/* ── Panneau GAUCHE ── */}
          <div className="absolute left-0 top-0 bottom-0 w-[6%] sm:w-[9%] md:w-[13%]" style={{ zIndex: 1, overflow: 'hidden' }}>
            {/* Halo ambiant renforcé */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 40% 50%, rgba(255,193,7,0.45) 0%, transparent 65%)',
            }} />
            {/* Grille fine */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}
                 xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-left" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#FFC107" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-left)" />
            </svg>
            {/* Trait vertical doré lumineux */}
            <div style={{
              position: 'absolute', right: 0, top: '5%', bottom: '5%', width: 3,
              background: 'linear-gradient(to bottom, transparent, #FFC107 25%, #FFD700 50%, #FF8C00 75%, transparent)',
              opacity: 0.9,
              boxShadow: '0 0 12px rgba(255,193,7,0.6)',
            }} />
            {/* Flamme VIALI haute — grande et lumineuse */}
            <div className="viali-flame-float" style={{
              position: 'absolute', top: '6%', left: '50%', transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 0 8px rgba(255,193,7,0.8))',
            }}>
              <VialiFlame size={50} opacity={1} color1="#FFC107" color2="#FF8C00" />
            </div>
            {/* Cercles concentriques brillants */}
            <div className="viali-ring-pulse" style={{
              position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
            }}>
              {[52, 38, 24].map((d, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: d, height: d,
                  border: `2px solid ${i === 0 ? '#FFC107' : i === 1 ? '#FF8C00' : '#FFD700'}`,
                  borderRadius: '50%',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 1 - i * 0.2,
                  boxShadow: i === 0 ? '0 0 10px rgba(255,193,7,0.5)' : 'none',
                }} />
              ))}
              {/* Point central */}
              <div style={{
                position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                background: '#FFC107', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(255,193,7,0.9)',
              }} />
            </div>
            {/* Losange décoratif lumineux */}
            <div style={{
              position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, 0) rotate(45deg)',
              width: 22, height: 22,
              border: '2.5px solid #FFC107',
              opacity: 0.9,
              boxShadow: '0 0 10px rgba(255,193,7,0.5)',
            }} />
            {/* Flamme basse */}
            <div className="viali-flame-float-delay" style={{
              position: 'absolute', bottom: '7%', left: '50%', transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 0 6px rgba(255,140,0,0.7))',
            }}>
              <VialiFlame size={36} opacity={1} color1="#FF8C00" color2="#FFC107" />
            </div>
            {/* Points décoratifs lumineux */}
            <div style={{ position: 'absolute', bottom: '26%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 0.75, 0.5].map((op, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#FFC107', opacity: op,
                  boxShadow: `0 0 6px rgba(255,193,7,${op * 0.8})`,
                }} />
              ))}
            </div>
            {/* Texte vertical VIALI */}
            <div style={{
              position: 'absolute', bottom: '36%', left: '50%',
              transform: 'translateX(-50%) rotate(-90deg)',
              color: '#FFD700', fontSize: 10, fontWeight: 900,
              letterSpacing: '0.3em', opacity: 0.75, whiteSpace: 'nowrap',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textShadow: '0 0 8px rgba(255,193,7,0.6)',
            }}>
              VIALI
            </div>
            {/* Fondu vers le centre — léger */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%',
              background: 'linear-gradient(to right, transparent, rgba(13,5,0,0.5))',
            }} />
          </div>

          {/* ── Panneau DROIT ── */}
          <div className="absolute right-0 top-0 bottom-0 w-[6%] sm:w-[9%] md:w-[13%]" style={{ zIndex: 1, overflow: 'hidden' }}>
            {/* Halo ambiant renforcé */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 60% 50%, rgba(255,140,0,0.45) 0%, transparent 65%)',
            }} />
            {/* Grille fine */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}
                 xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-right" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#FF8C00" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-right)" />
            </svg>
            {/* Trait vertical doré lumineux */}
            <div style={{
              position: 'absolute', left: 0, top: '5%', bottom: '5%', width: 3,
              background: 'linear-gradient(to bottom, transparent, #FF8C00 25%, #FFC107 50%, #FF8C00 75%, transparent)',
              opacity: 0.9,
              boxShadow: '0 0 12px rgba(255,140,0,0.6)',
            }} />
            {/* Roue / cercle tournant lumineux */}
            <div className="viali-spin-slow" style={{
              position: 'absolute', top: '7%', left: '50%',
              transform: 'translate(-50%, 0)',
              filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.7))',
            }}>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 1 }}>
                <circle cx="25" cy="25" r="22" stroke="#FFC107" strokeWidth="2" strokeDasharray="6 3"/>
                <circle cx="25" cy="25" r="12" stroke="#FF8C00" strokeWidth="1.5" strokeDasharray="4 2"/>
                <circle cx="25" cy="25" r="4" fill="#FFC107"/>
                <circle cx="25" cy="25" r="4" fill="#FFC107" opacity="0.6" style={{ filter: 'blur(2px)' }}/>
              </svg>
            </div>
            {/* Flamme haute */}
            <div className="viali-flame-float-delay" style={{
              position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 0 8px rgba(255,140,0,0.8))',
            }}>
              <VialiFlame size={48} opacity={1} color1="#FF8C00" color2="#FFC107" />
            </div>
            {/* Cercles concentriques brillants */}
            <div className="viali-ring-pulse-delay" style={{
              position: 'absolute', top: '54%', left: '50%', transform: 'translate(-50%, -50%)',
            }}>
              {[52, 36, 22].map((d, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: d, height: d,
                  border: `2px solid ${i === 0 ? '#FF8C00' : i === 1 ? '#FFC107' : '#FFD700'}`,
                  borderRadius: '50%',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 1 - i * 0.2,
                  boxShadow: i === 0 ? '0 0 10px rgba(255,140,0,0.5)' : 'none',
                }} />
              ))}
              {/* Point central */}
              <div style={{
                position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                background: '#FF8C00', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 8px rgba(255,140,0,0.9)',
              }} />
            </div>
            {/* Flamme basse */}
            <div className="viali-flame-float" style={{
              position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.7))',
            }}>
              <VialiFlame size={38} opacity={1} color1="#FFC107" color2="#FF8C00" />
            </div>
            {/* Points décoratifs lumineux */}
            <div style={{ position: 'absolute', bottom: '24%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[0.5, 0.75, 1].map((op, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#FF8C00', opacity: op,
                  boxShadow: `0 0 6px rgba(255,140,0,${op * 0.8})`,
                }} />
              ))}
            </div>
            {/* Texte vertical R&D */}
            <div style={{
              position: 'absolute', bottom: '38%', left: '50%',
              transform: 'translateX(-50%) rotate(90deg)',
              color: '#FFB347', fontSize: 10, fontWeight: 900,
              letterSpacing: '0.3em', opacity: 0.75, whiteSpace: 'nowrap',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textShadow: '0 0 8px rgba(255,140,0,0.6)',
            }}>
              R&D
            </div>
            {/* Fondu vers le centre — léger */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%',
              background: 'linear-gradient(to left, transparent, rgba(13,5,0,0.5))',
            }} />
          </div>

          {/* ── IMAGE CENTRALE — image complète visible, fond flouté derrière ── */}
          <div className="absolute left-[6%] right-[6%] sm:left-[9%] sm:right-[9%] md:left-[13%] md:right-[13%]" style={{
            top: 0, bottom: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}>
            {/* Fond flouté (même image agrandie) pour remplir sans bandes noires */}
            <div style={{
              position: 'absolute', inset: '-10%',
              backgroundImage: `url(${heroBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              filter: 'blur(22px) brightness(0.45) saturate(0.7)',
              transform: 'scale(1.15)',
            }} />
            {/* Image principale en contain — tout le sujet visible */}
            <img
              src={heroBgImage}
              alt="Espace Professionnel"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center top',
              }}
            />
            {/* Fondu gauche vers panneau décoratif */}
            <div className="w-[5%] sm:w-[7%] md:w-[10%]" style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(13,5,0,0.95) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            {/* Fondu droite vers panneau décoratif */}
            <div className="w-[5%] sm:w-[7%] md:w-[10%]" style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              background: 'linear-gradient(to left, rgba(13,5,0,0.95) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            {/* Fondu bas pour fondre dans le contenu */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* ── Overlays texte ── */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" style={{ zIndex: 2 }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(255,140,0,.18) 0%, rgba(0,0,0,.02) 50%, rgba(255,193,7,.10) 100%)',
            zIndex: 2,
          }} />

          {/* Stripe bas */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
            background: 'linear-gradient(90deg, #FFC107, #FF8C00)',
            zIndex: 4,
          }} />

          {/* Éléments décoratifs fond (inchangés) */}
          <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none" style={{ zIndex: 3 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              {[0,1,2,3].map(r => [0,1,2,3].map(c => (
                <circle key={`${r}-${c}`} cx={c*25+5} cy={r*25+5} r="3"
                        fill="white" opacity={(r+c)%2===0?0.9:0.4}/>
              )))}
            </svg>
          </div>

          {/* ── CONTENU TEXTE HERO ── */}
          <div className="relative w-full mx-auto px-6 text-center flex flex-col items-center justify-center"
               style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px', zIndex: 5 }}>

            <div className="hidden md:inline-flex items-center gap-2.5 px-5 py-2.5
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

            <h1 className="font-black mb-4 tracking-tight text-white animate-slide-up drop-shadow-2xl px-2"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(1.85rem, 7vw, 3.5rem)',
                  lineHeight: 1.15,
                  animationDelay: '0.1s',
                  textShadow: '0 4px 24px rgba(0,0,0,0.45)',
                }}>
              {t("research.title") || "Recherche & Développement"}
            </h1>

            <div className="flex justify-center mb-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF8C00]"
                   style={{ boxShadow: '0 0 14px rgba(255,193,7,.7)' }}></div>
            </div>

            <p className="text-base md:text-lg text-white/80 font-medium max-w-2xl mx-auto animate-slide-up leading-relaxed"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("research.subtitle") || "Découvrez nos axes de recherche et innovations"}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════ STATS ══════════════════════════════ */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2 sm:py-6 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Lightbulb,  value: "4+",   label: t("research.stat1") || "Domaines" },
              { icon: Target,     value: "100%", label: t("research.stat2") || "Innovation" },
              { icon: TrendingUp, value: "24/7", label: t("research.stat3") || "Recherche" },
              { icon: Rocket,     value: "∞",    label: t("research.stat4") || "Possibilités" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-9 h-9 sm:w-14 sm:h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-lg sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Icon className="w-4.5 h-4.5 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-lg sm:text-3xl md:text-4xl font-black text-[#FF8C00] mb-0.5 sm:mb-2"
                       style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-sm font-bold text-gray-600 uppercase tracking-wide"
                       style={{ fontFamily: "'Inter', sans-serif" }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════ SECTIONS CONTENU ══════════════════════════════ */}
        {(() => {
          // Pré-calcule les 4 sections une seule fois, avec un test de contenu
          // strict (trim) pour éviter qu'un champ contenant juste un espace
          // ou une chaîne vide ne déclenche l'affichage d'un bloc vide.
          const sections = [1, 2, 3, 4].map((num) => {
            const title   = (getLocalizedField(recherche, "title", num) || "").trim();
            const content = (getLocalizedField(recherche, "content", num) || "").trim();
            const image   = recherche[`image_${num}`] || "";
            return { num, title, content, image, hasData: !!(title || content || image) };
          }).filter((s) => s.hasData);

          if (sections.length === 0) return null;

          return (
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-0 sm:py-2 md:py-6 space-y-4 sm:space-y-8 md:space-y-12">
              {sections.map(({ num, title, content, image }) => {
                const Icon = sectionIcons[num - 1];
                const imageFailed = failedImages[num];
                const hasVisibleImage = !!image && !imageFailed;

                // Si après échec de l'image il ne reste ni titre ni contenu,
                // cette section n'a plus rien à montrer : on ne la rend pas.
                if (!title && !content && !hasVisibleImage) return null;

                return (
                  <article key={num} className="animate-slide-up" style={{ animationDelay: `${num * 0.1}s` }}>

                    {title && (
                      <div className="mb-2 sm:mb-6">
                        <div className="hidden md:inline-flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] rounded-2xl flex items-center justify-center">
                            <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                          </div>
                          <div className="h-1 w-24 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] rounded-full"></div>
                        </div>
                        <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {title}
                        </h3>
                      </div>
                    )}

                    {image && (
                      <ImageWithFallback
                        image={image}
                        title={title}
                        num={num}
                        onZoom={() => setLightbox(image)}
                        onFail={() => setFailedImages((prev) => ({ ...prev, [num]: true }))}
                      />
                    )}

                    {content && (
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-3xl p-3 sm:p-8 md:p-10 border-l-4 border-[#FF8C00]">
                        <p className="text-sm sm:text-xl md:text-2xl text-gray-800 leading-relaxed font-medium whitespace-pre-line m-0"
                           style={{ fontFamily: "'Inter', sans-serif" }}>
                          {content}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          );
        })()}

        {/* ══════════════════════════════ NOTRE SAVOIR-FAIRE ══════════════════════════════ */}
        <SavoirFaire t={t} />

        {/* ══════════════════════════════ NOTRE EXPERTISE INDUSTRIELLE ══════════════════════════════ */}
        <ExpertiseIndustrielle t={t} />

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

            <PartnersPreview partners={recherche.partners || []} />
          </div>
        </section>

        {/* ══════════════════════════════ WHATSAPP ══════════════════════════════ */}
        <a href="https://wa.me/224610207407?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
           target="_blank" rel="noopener noreferrer"
           className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
           aria-label="Contactez-nous sur WhatsApp">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
          <div className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600
                          rounded-full shadow-2xl flex items-center justify-center
                          hover:scale-110 transition-all duration-300 border-[3px] sm:border-4 border-white">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
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

      {/* ══════════════════════════════ LIGHTBOX ══════════════════════════════ */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,.9)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
            animation: "fadeIn .25s ease",
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }}
            alt=""
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,.15)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={20} color="#fff" />
          </button>
        </div>
      )}
    </>
  );
};

export default ProfessionalArea;