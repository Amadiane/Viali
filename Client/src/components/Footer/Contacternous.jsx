import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Mail, User, MessageSquare, Tag, CheckCircle, AlertCircle, Phone, MapPin, Clock, Sparkles } from "lucide-react";
import ChatBotNew from "../ChatBot/ChatbotNew";
import CONFIG from "../../config/config.js";

const Contacternous = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const apiUrl = CONFIG.API_CONTACT_CREATE;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setResponseMessage("✅ " + t("contact.success_message"));
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await res.json();
        setResponseMessage(
          errorData?.detail || "❌ " + t("contact.error_message")
        );
      }
    } catch (error) {
      console.error("Erreur envoi :", error);
      setResponseMessage("⚠️ " + t("contact.connection_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccess = responseMessage.includes("✅");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
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
          background: linear-gradient(90deg, 
            transparent 0%,
            #FFC107 20%,
            #FF8C00 50%,
            #FFC107 80%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: gradient-flow 3s ease-in-out infinite;
          box-shadow: 0 2px 8px rgba(255, 140, 0, 0.3);
        }
        
        .input-focus {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .input-focus:focus {
          border-color: #FF8C00;
          box-shadow: 0 0 0 4px rgba(255, 140, 0, 0.1);
        }
        
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shine-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shine-sweep 3s infinite;
        }
        
        @keyframes shine-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        .whatsapp-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="min-h-screen bg-white pb-16">
        
        {/* Hero Section - Centré */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-gradient-to-r from-orange-50 to-yellow-50
                          border border-orange-200 rounded-full mb-6 shadow-sm animate-slide-up">
              <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {t("contact.badge_text")}
              </span>
            </div>

            {/* Titre principal avec gradient VIALI - TAILLE RÉDUITE */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("contact.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
               style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.2s' }}>
              {t("contact.subtitle")}
            </p>
          </div>

          {/* 🔥 LIGNE SÉPARATRICE STYLÉE AVEC GRADIENT ANIMÉ 🔥 */}
          <div className="max-w-[1200px] mx-auto px-6 mt-12">
            <div className="separator-line rounded-full"></div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-20">
          
          {/* Message de notification */}
          {responseMessage && (
            <div className={`mb-8 animate-slide-up ${
              isSuccess 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            } border-2 rounded-2xl p-5 flex items-center gap-3 shadow-sm`}>
              {isSuccess ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" strokeWidth={2.5} />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" strokeWidth={2.5} />
              )}
              <span className={`font-semibold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                {responseMessage}
              </span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Colonne Gauche - Info Cards */}
            <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              
              {/* Carte coordonnées */}
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-xl">
                <h2 className="text-2xl font-black text-gray-900 mb-6"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t("contact.our_info")}
                </h2>
                
                <div className="space-y-5">
                  
                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 
                                bg-gradient-to-br from-orange-50 to-yellow-50 
                                rounded-2xl border border-orange-100
                                hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] 
                                  rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Mail className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("contact.email")}
                      </h3>
                      <a href="mailto:contact@viali-gn.com" 
                         className="text-gray-600 hover:text-[#FF8C00] transition-colors text-sm"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        contact@viali-gn.com
                      </a>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-start gap-4 p-4 
                                bg-gradient-to-br from-yellow-50 to-orange-50 
                                rounded-2xl border border-orange-100
                                hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] 
                                  rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Phone className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("contact.phone")}
                      </h3>
                      <a href="tel:+224610207407" 
                         className="text-gray-600 hover:text-[#FF8C00] transition-colors text-sm"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        +224 610 20 74 07
                      </a>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div className="flex items-start gap-4 p-4 
                                bg-gradient-to-br from-orange-50 to-yellow-50 
                                rounded-2xl border border-orange-100
                                hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FF8C00] 
                                  rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("contact.address")}
                      </h3>
                      <p className="text-gray-600 text-sm"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        {t("contact.address_value")}
                      </p>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="flex items-start gap-4 p-4 
                                bg-gradient-to-br from-yellow-50 to-orange-50 
                                rounded-2xl border border-orange-100
                                hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C00] to-[#FFC107] 
                                  rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {t("contact.hours")}
                      </h3>
                      <p className="text-gray-600 text-sm"
                         style={{ fontFamily: "'Inter', sans-serif" }}>
                        {t("contact.hours_value")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte info */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 
                            rounded-3xl border-2 border-orange-100 p-6 shadow-lg">
                <div className="flex items-start gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-[#FF8C00] flex-shrink-0" strokeWidth={2.5} />
                  <h3 className="text-lg font-bold text-gray-900"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("contact.need_help")}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed"
                   style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t("contact.help_text")}
                </p>
              </div>
            </div>

            {/* Colonne Droite - Formulaire */}
            <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl p-8 md:p-10">
                
                {/* En-tête */}
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {t("contact.form_title")}
                  </h2>
                  <p className="text-gray-600 text-lg"
                     style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t("contact.form_subtitle")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Nom et Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700"
                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <User className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                        {t("contact.name_label")} <span className="text-[#FF8C00]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder={t("contact.name_placeholder")}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl 
                                 input-focus outline-none text-gray-900 font-medium bg-white"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700"
                             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <Mail className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                        {t("contact.email_label")} <span className="text-[#FF8C00]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder={t("contact.email_placeholder")}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl 
                                 input-focus outline-none text-gray-900 font-medium bg-white"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700"
                           style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <MessageSquare className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                      {t("contact.subject_label")} <span className="text-[#FF8C00]">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder={t("contact.subject_placeholder")}
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl 
                               input-focus outline-none text-gray-900 font-medium bg-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Catégorie */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700"
                           style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <Tag className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                      {t("contact.category_label")}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl 
                               input-focus outline-none text-gray-900 font-medium bg-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="general">{t("contact.category_general")}</option>
                      <option value="support">{t("contact.category_support")}</option>
                      <option value="partenariat">{t("contact.category_partnership")}</option>
                      <option value="commentaire">{t("contact.category_feedback")}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700"
                           style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <MessageSquare className="w-4 h-4 text-[#FF8C00]" strokeWidth={2.5} />
                      {t("contact.message_label")} <span className="text-[#FF8C00]">*</span>
                    </label>
                    <textarea
                      name="message"
                      placeholder={t("contact.message_placeholder")}
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl 
                               input-focus outline-none resize-none text-gray-900 font-medium bg-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Bouton Submit avec shine effect */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-4 
                               bg-gradient-to-r from-[#FFC107] to-[#FF8C00] 
                               text-white font-bold text-lg rounded-xl 
                               hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40
                               transition-all duration-300 
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 
                               flex items-center justify-center gap-3
                               shine-effect"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{t("contact.sending")}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" strokeWidth={2.5} />
                          <span>{t("contact.send_button")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section avec gradient VIALI exact */}
        <section className="bg-gradient-to-r from-[#FFC107] via-[#FF8C00] to-[#FFC107] py-16 md:py-20 border-t border-orange-200">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {t("contact.cta_title")}
            </h2>
            <p className="text-white/95 text-lg mb-8"
               style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("contact.cta_subtitle")}
            </p>
            <a
              href="tel:+224610207407"
              className="inline-flex items-center gap-3 px-8 py-4 
                       bg-white text-[#FF8C00] font-bold text-lg rounded-xl 
                       hover:scale-105 hover:shadow-2xl 
                       transition-all duration-300"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <Phone className="w-5 h-5" strokeWidth={2.5} />
              +224 610 20 74 07
            </a>
          </div>
        </section>

        {/* WhatsApp Floating Button - Style Entreprise Premium */}
        <a
          href="https://wa.me/224613509180?text=Bonjour%20VIALI%2C%20je%20souhaite%20obtenir%20plus%20d'informations"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group whatsapp-float"
          aria-label="Contactez-nous sur WhatsApp"
        >
          {/* Pulse rings effect */}
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-[pulse-ring_2s_ease-out_infinite]"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-[pulse-ring_2s_ease-out_infinite_0.5s]"></div>
          
          {/* Main button */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 
                        rounded-full shadow-2xl flex items-center justify-center
                        hover:scale-110 hover:shadow-green-500/50 transition-all duration-300
                        border-4 border-white">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          
          {/* Tooltip on hover */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        pointer-events-none whitespace-nowrap">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl">
              <p className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Contactez-nous sur WhatsApp
              </p>
              <p className="text-xs text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                +224 613 509 180
              </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 
                          w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </a>

        {/* ChatBot */}
        {/* <div className="fixed bottom-6 right-6 z-50">
          <ChatBotNew />
        </div> */}
      </div>
    </>
  );
};

export default Contacternous;