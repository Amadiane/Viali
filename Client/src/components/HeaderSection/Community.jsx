import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Mail, MessageSquare, Shield, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';
import ChatBotNew from "../ChatBot/ChatbotNew";
import CONFIG from "../../config/config.js";



const Community = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    message: '',
  });

  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Scroll vers le haut au chargement de la page
useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(CONFIG.API_COMMUNITY_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        showToast(t("✅ Votre message a été envoyé avec succès !"), 'success');
        setForm({ name: '', email: '', role: '', message: '' });
      } else {
        let errorMessage = t("❌ Une erreur s'est produite.");
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {
          // pas de JSON dans la réponse
        }
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      showToast(t("⚠️ Impossible d'envoyer le formulaire pour le moment."), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#0a0e27] w-full relative overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-4 md:right-8 z-50 animate-slide-in">
          <div className="relative">
            <div className={`absolute -inset-1 ${toast.type === 'success' ? 'bg-green-500/50' : 'bg-red-500/50'} blur-xl rounded-xl`}></div>
            <div className={`relative ${toast.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'} backdrop-blur-xl border-2 rounded-xl p-4 pr-12 shadow-2xl max-w-md`}>
              <div className="flex items-start gap-3">
                {toast.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={`${toast.type === 'success' ? 'text-green-100' : 'text-red-100'} font-medium text-sm leading-relaxed`}>
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="relative">
        {/* Spacer pour header */}
        <div className="h-20 md:h-24"></div>

        {/* Hero Section */}
        <div className="pt-12 md:pt-20 pb-8 md:pb-12 px-4 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-orange-500/30 to-blue-500/30 blur-3xl scale-150 animate-pulse"></div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full mb-4 shadow-2xl shadow-blue-500/50">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-white mb-3 tracking-tight px-4">
                {t('Jorfof Club')}
              </h1>
              
              <div className="relative w-20 md:w-24 h-1 mx-auto mt-4 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-blue-500 to-orange-500 animate-pulse"></div>
              </div>

              <p className="text-lg md:text-xl lg:text-2xl text-orange-400 mt-6 font-bold px-4">
                {t('Toujours Prêt à Gagner !')}
              </p>
            </div>
          </div>
        </div>

        {/* Section intro communauté */}
        <div className="px-4 pb-8 md:pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl md:rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
              
              <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden border-2 border-blue-500/30 shadow-2xl p-6 md:p-10 lg:p-12">
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white">
                    {t('Rejoignez notre communauté')}
                  </h2>
                </div>
                
                <div className="w-24 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent rounded-full mb-6"></div>
                
                <p className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
                  {t("Partagez vos idées, vos motivations et votre passion pour le basketball avec la famille Jorfof.")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="px-4 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl md:rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-700"></div>
              
              <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-2xl p-6 md:p-10 lg:p-12">
                
                <div className="flex items-center gap-3 md:gap-4 mb-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <UserPlus className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white">
                    {t('Formulaire de contact')}
                  </h2>
                </div>

                <div className="w-24 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-orange-500 via-blue-500 to-transparent rounded-full mb-8 md:mb-10"></div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom complet */}
                  <div className="relative">
                    <label htmlFor="name" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-orange-400" />
                      {t('Nom complet')} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t('Votre nom complet')}
                      required
                      className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-orange-500/50 focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      {t('Email')} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t('votre.email@exemple.com')}
                      required
                      className="px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                    />
                  </div>

                  {/* Rôle */}
                  <div className="relative">
                    <label htmlFor="role" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      {t('Rôle')} <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                        className="appearance-none px-4 py-3 w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/10 text-white transition-all duration-300 cursor-pointer"
                      >
                        <option value="" className="bg-[#0f1729] text-gray-400">{t('-- Sélectionnez votre rôle --')}</option>
                        <option value="joueur" className="bg-[#0f1729] text-white">{t('Joueur')}</option>
                        <option value="entraineur" className="bg-[#0f1729] text-white">{t('Entraîneur')}</option>
                        <option value="supporter" className="bg-[#0f1729] text-white">{t('Supporter')}</option>
                        <option value="benevole" className="bg-[#0f1729] text-white">{t('Bénévole')}</option>
                        <option value="autres" className="bg-[#0f1729] text-white">{t('Autres')}</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label htmlFor="message" className="block text-gray-300 mb-2 text-sm font-semibold flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      {t('Message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("Partagez votre motivation ou votre message...")}
                      rows="6"
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
                              {t('Envoi en cours...')}
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-5 h-5" />
                              {t('Envoyer')}
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

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Community;