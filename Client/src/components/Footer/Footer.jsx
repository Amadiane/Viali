import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Award,
  Users,
} from "lucide-react";


const Footer = () => {
  // 🧠 États pour la newsletter
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✉️ Fonction d’abonnement à la newsletter
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://jorfofdjangov.onrender.com/api/newsletter/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✓ Merci pour votre inscription !");
        setEmail("");
      } else {
        setMessage(
          data.error || data.message || "⚠ Une erreur est survenue. Réessayez."
        );
      }
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setMessage("⚠ Erreur de connexion. Réessayez.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };


  const partners = [
    { name: "Tekacom", icon: "💼", url: "https://www.facebook.com/profile.php?id=61553931658632" },
    { name: "Rahi Travels", icon: "✈️", url: "#" },
    { name: "Ville de Conakry", icon: "🏛️", url: "#" },
    { name: "Fédération Guinéenne de Basketball", icon: "🏀", url: "#" },
    { name: "Ministère de la Jeunesse et Sports", icon: "🏅", url: "#" }
  ];

  const quickLinks = [
    { label: "Accueil", href: "/" },
    { label: "Le Club", href: "/nosValeurs" },
    { label: "Équipes", href: "/notreEquipe" },
    { label: "Actualités", href: "/actualites" },
    { label: "Galerie", href: "/phototheque" },
    { label: "Contact", href: "/contacter-tamkine" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/profile.php?id=61558931259809", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "hover:text-pink-400" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com", color: "hover:text-red-400" }
  ];

  return (
    <footer className="relative bg-[#0a0e27] overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      {/* Section principale */}
      <div className="relative container mx-auto px-6 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* À propos */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-3xl shadow-2xl shadow-orange-500/50">
                  🏀
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">JORFOF BASKET</h3>
                <p className="text-xs text-orange-400 font-semibold">Excellence & Passion</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Club professionnel de basketball basé à Conakry, Guinée. Nous formons les champions de demain avec passion et détermination.
            </p>
            
            {/* Informations de contact */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-orange-500/20 hover:border-orange-500/40 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Conakry, Guinée</span>
              </div>
              <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-blue-500/20 hover:border-blue-500/40 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">+224 626 74 14 78</span>
              </div>
              <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">contact@jorfofbasket.com</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-lg"></div>
              <h4 className="relative text-lg font-black text-white pb-2 border-b-2 border-orange-500">
                Liens Rapides
              </h4>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-orange-400 transition-all duration-300 text-sm"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 mr-0 group-hover:mr-2 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partenaires */}
          <div>
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-lg"></div>
              <h4 className="relative text-lg font-black text-white pb-2 border-b-2 border-blue-500">
                Nos Partenaires
              </h4>
            </div>
            <ul className="space-y-3">
              {partners.map((partner, idx) => (
                <li key={idx}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 text-sm group cursor-pointer bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 hover:border-blue-500/40 transition-all"
                  >
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">{partner.icon}</span>
                    <span className="text-gray-400 group-hover:text-white transition-colors duration-300 leading-tight text-xs">
                      {partner.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Bouton devenir partenaire */}
            <a 
              href="/partner"
              className="relative mt-6 inline-block group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
              <div className="relative px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-sm font-bold hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 border border-orange-400/50">
                Devenir partenaire
              </div>
            </a>
          </div>

          {/* Newsletter */}
          <div>
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-lg"></div>
              <h4 className="relative text-lg font-black text-white pb-2 border-b-2 border-purple-500">
                Newsletter
              </h4>
            </div>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Restez informé de nos actualités, matchs et événements exclusifs.
            </p>
            
            <div className="space-y-3">
              <div className="relative group/input">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-lg opacity-0 group-hover/input:opacity-100 transition-opacity rounded-lg"></div>
                <div className="relative flex">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubscribe(e)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border-2 border-orange-500/30 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all duration-300 text-sm"
                    required
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubmitting}
                    className="px-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-r-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border-2 border-orange-500 border-l-0"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
              
              {message && (
                <div className={`text-xs font-semibold ${message.includes('✓') ? 'text-green-400' : 'text-red-400'} animate-pulse bg-white/5 rounded-lg p-2 border ${message.includes('✓') ? 'border-green-500/30' : 'border-red-500/30'}`}>
                  {message}
                </div>
              )}
            </div>

            {/* Stats rapides avec style e-sport */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="relative group/stat">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-orange-500/30 group-hover/stat:border-orange-500/60 transition-all">
                  <Award className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-orange-400">3+</p>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Années</p>
                </div>
              </div>
              <div className="relative group/stat">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-blue-500/30 group-hover/stat:border-blue-500/60 transition-all">
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-blue-400">100+</p>
                  <p className="text-xs text-gray-400 mt-1 font-semibold">Joueurs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="relative border-t-2 border-orange-500/20">
        <div className="container mx-auto px-6 lg:px-20 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 font-semibold">
              Suivez-nous sur les réseaux sociaux
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group/social"
                  >
                    <div className={`absolute inset-0 bg-orange-500/30 blur-lg opacity-0 group-hover/social:opacity-100 transition-opacity rounded-full`}></div>
                    <div className={`relative w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/10 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:shadow-lg hover:border-orange-500/50`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">Jorfof Basket Club</span>. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="/mentions-legales" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
                Mentions légales
              </a>
              <a href="/politique-confidentialite" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
                Confidentialité
              </a>
              <a href="/cgv" className="hover:text-orange-400 transition-colors duration-300 font-semibold">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;