import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Mail, User, MessageSquare, Tag, CheckCircle, AlertCircle, Loader } from "lucide-react";
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

  // ✅ Scroll vers le haut au chargement de la page
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setResponseMessage(
          t(
            "✅ Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
          )
        );
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
        });
      } else {
        const errorData = await res.json();
        setResponseMessage(
          errorData?.detail ||
            t("❌ Une erreur est survenue lors de l'envoi du message.")
        );
      }
    } catch (error) {
      console.error("Erreur envoi :", error);
      setResponseMessage(
        t("⚠️ Erreur de connexion au serveur, veuillez réessayer plus tard.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSuccess = responseMessage.includes("✅") || responseMessage.includes("succès");
  const isError = responseMessage.includes("❌") || responseMessage.includes("⚠️") || responseMessage.includes("erreur");

  return (
    <div className="min-h-screen bg-[#0a0e27] w-full relative overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative">
        {/* Spacer pour header */}
        <div className="h-20 md:h-24"></div>

        {/* Hero Section */}
        <div className="pt-12 md:pt-20 pb-8 md:pb-12 px-4 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-blue-500/30 to-orange-500/30 blur-3xl scale-150 animate-pulse"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-full mb-4 shadow-2xl shadow-orange-500/50">
                <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-white mb-3 tracking-tight">
                {t("Contactez-nous")}
              </h1>
              
              <div className="relative w-20 md:w-24 h-1 mx-auto mt-4 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500 animate-pulse"></div>
              </div>

              <p className="text-base md:text-lg lg:text-xl text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed px-4">
                {t("Nous sommes à votre écoute et vous répondrons dans les meilleurs délais. N'hésitez pas à nous faire part de vos questions ou commentaires.")}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="px-4 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl md:rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
              
              {/* Card principale */}
              <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl p-6 md:p-10 lg:p-12">
                
                {/* Message de réponse */}
                {responseMessage && (
                  <div className="mb-8">
                    <div className="relative">
                      <div className={`absolute -inset-1 ${isSuccess ? 'bg-green-500/50' : 'bg-red-500/50'} blur-xl rounded-xl`}></div>
                      <div className={`relative ${isSuccess ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'} backdrop-blur-sm border-2 rounded-xl p-4 md:p-5`}>
                        <div className="flex items-start gap-3">
                          {isSuccess ? (
                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <p className={`${isSuccess ? 'text-green-100' : 'text-red-100'} font-medium text-sm md:text-base leading-relaxed`}>
                            {responseMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div className="relative group/input">
                      <label htmlFor="name" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-400" />
                        {t("Nom complet")}
                        <span className="text-orange-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("Votre nom et prénom")}
                          required
                          className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative group/input">
                      <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        {t("Email")}
                        <span className="text-orange-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("votre.email@exemple.com")}
                          required
                          className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="relative group/input">
                    <label htmlFor="subject" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      {t("Sujet")}
                      <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t("Objet de votre message")}
                      required
                      className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                    />
                  </div>

                  {/* Catégorie */}
                  <div className="relative group/input">
                    <label htmlFor="category" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-400" />
                      {t("Catégorie")}
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="appearance-none px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/10 text-white transition-all duration-300 cursor-pointer"
                      >
                        <option value="general" className="bg-[#0f1729] text-white">{t("Question générale")}</option>
                        <option value="support" className="bg-[#0f1729] text-white">{t("Support technique")}</option>
                        <option value="partenariat" className="bg-[#0f1729] text-white">{t("Partenariat")}</option>
                        <option value="commentaire" className="bg-[#0f1729] text-white">{t("Commentaires et suggestions")}</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative group/input">
                    <label htmlFor="message" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      {t("Message")}
                      <span className="text-orange-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("Détaillez votre demande ici...")}
                      rows="6"
                      required
                      className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 text-white placeholder-gray-500 resize-none transition-all duration-300"
                    />
                  </div>

                  {/* Bouton d'envoi */}
                  <div className="pt-4">
                    <div className="relative group/button">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl blur opacity-30 group-hover/button:opacity-50 transition duration-300"></div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`relative w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 text-white ${
                          isSubmitting
                            ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              {t("Envoi en cours...")}
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              {t("Envoyer le message")}
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatBotNew />
      </div>
    </div>
  );
};

export default Contacternous;