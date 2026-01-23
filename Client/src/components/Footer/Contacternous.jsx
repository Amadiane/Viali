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

            {/* Titre principal avec gradient VIALI (MEILLEUR CHOIX !) */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight gradient-text animate-slide-up"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", animationDelay: '0.1s' }}>
              {t("contact.title")}
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto animate-slide-up"
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
                         +224 610207407 / +224 613509180
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
        
        {/* ChatBot */}
        {/* <div className="fixed bottom-6 right-6 z-50">
          <ChatBotNew />
        </div> */}
      </div>
    </>
  );
};

export default Contacternous;