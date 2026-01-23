import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import CONFIG from "../../config/config.js";
import Logo from "../../assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(CONFIG.API_NEWSLETTER_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ " + t("footer.newsletter.success"));
        setEmail("");
      } else {
        setMessage(
          data.error || data.message || "⚠ " + t("footer.newsletter.error")
        );
      }
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setMessage("⚠ " + t("footer.newsletter.connection_error"));
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const quickLinks = [
    { label: t("footer.links.home"), href: "/home" },
    { label: t("footer.links.products"), href: "/sardineProduct" },
    { label: t("footer.links.about"), href: "/nosMissions" },
    { label: t("footer.links.news"), href: "/actualites" },
    { label: t("footer.links.contact"), href: "/contacternous" },
  ];

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      url: "https://www.facebook.com/profile.php?id=100063491919629", 
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://www.instagram.com/viali_gn?igsh=YjQ5dWphaTV5bHJ1&utm_source=qr", 
    },
    { 
      name: "YouTube", 
      icon: Youtube, 
      url: "#", 
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .gradient-text-footer {
          background: linear-gradient(135deg, #FFC107 0%, #FF8C00 50%, #FFC107 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <footer className="relative bg-white border-t-2 border-gray-100">
        
        {/* Section principale */}
        <div className="container mx-auto px-6 lg:px-20 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* À propos - Logo VIALI */}
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-100">
                  <img src={Logo} alt="VIALI Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-black gradient-text-footer"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    VIALI
                  </h3>
                  <p className="text-xs text-gray-600 font-semibold"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t("footer.tagline")}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("footer.description")}
              </p>

              {/* Coordonnées */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                  <MapPin className="w-5 h-5 text-[#FF8C00] flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-gray-700 text-sm font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t("footer.contact.address")}
                  </span>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-orange-100">
                  <Phone className="w-5 h-5 text-[#FF8C00] flex-shrink-0" strokeWidth={2.5} />
                  <a href="tel:+224610207407" 
                     className="text-gray-700 text-sm font-medium hover:text-[#FF8C00] transition-colors"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    +224 610 20 74 07
                  </a>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                  <Mail className="w-5 h-5 text-[#FF8C00] flex-shrink-0" strokeWidth={2.5} />
                  <a href="mailto:contact@viali-gn.com"
                     className="text-gray-700 text-sm font-medium hover:text-[#FF8C00] transition-colors"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    contact@viali-gn.com
                  </a>
                </div>
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-6 pb-3 border-b-2 border-orange-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("footer.quick_links")}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-[#FF8C00] text-sm font-medium transition-colors duration-300 flex items-center gap-2 group"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                                  strokeWidth={2.5} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-6 pb-3 border-b-2 border-orange-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("footer.follow_us")}
              </h4>
              
              <p className="text-gray-600 text-sm mb-6"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("footer.social_description")}
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a 
                      key={idx} 
                      href={social.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-[#FFC107] hover:to-[#FF8C00] border-2 border-orange-200 hover:border-[#FF8C00] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      aria-label={t("footer.visit_social", { social: social.name })}
                    >
                      <Icon className="w-5 h-5 text-[#FF8C00] group-hover:text-white transition-colors" 
                            strokeWidth={2.5} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-6 pb-3 border-b-2 border-orange-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("footer.newsletter.title")}
              </h4>

              <p className="text-gray-600 text-sm mb-6"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                {t("footer.newsletter.description")}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    placeholder={t("footer.newsletter.placeholder")}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-[#FF8C00] focus:ring-4 focus:ring-orange-100 outline-none text-gray-900 font-medium transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-[#FFC107] to-[#FF8C00] text-white font-bold rounded-xl hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                      <span>{t("footer.newsletter.sending")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" strokeWidth={2.5} />
                      <span>{t("footer.newsletter.subscribe")}</span>
                    </>
                  )}
                </button>
              </form>

              {message && (
                <div className={`text-xs mt-3 font-semibold p-3 rounded-lg ${
                  message.includes("✓") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t-2 border-gray-100 bg-gradient-to-r from-orange-50/30 to-yellow-50/30 py-6">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm font-medium"
                 style={{ fontFamily: "'Inter', sans-serif" }}>
                © {new Date().getFullYear()} <span className="font-black gradient-text-footer">VIALI</span>. {t("footer.rights_reserved")}
              </p>
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                <span className="text-gray-600 text-sm font-semibold"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("footer.quality_badge")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;