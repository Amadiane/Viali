import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Mail, User, MessageSquare, Briefcase, Loader2, CheckCircle2, AlertCircle, Users, Award, Target, Lightbulb } from 'lucide-react';
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

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(CONFIG.API_COMMUNITY_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccessMessage(t("community.successMessage"));
        window.scrollTo({ top: 0, behavior: "smooth" });
        setForm({ name: '', email: '', role: '', message: '' });
      } else {
        setError(t("community.errorMessage"));
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setError(t("community.errorSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: t("community.benefit1Title"),
      description: t("community.benefit1Desc")
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: t("community.benefit2Title"),
      description: t("community.benefit2Desc")
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: t("community.benefit3Title"),
      description: t("community.benefit3Desc")
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: t("community.benefit4Title"),
      description: t("community.benefit4Desc")
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            {t("community.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("community.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 md:py-16">
        {/* Messages de notification */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl mb-8 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 p-5 rounded-2xl mb-8 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Colonne Gauche - Avantages */}
          <div className="lg:col-span-1 space-y-8">
            {/* Carte Pourquoi Rejoindre */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {t("community.whyJoin")}
              </h2>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte Stats */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl border-2 border-orange-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {t("community.statsTitle")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{t("community.members")}</span>
                  <span className="text-3xl font-black text-[#F47920]">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{t("community.partners")}</span>
                  <span className="text-3xl font-black text-[#E84E1B]">50+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{t("community.countries")}</span>
                  <span className="text-3xl font-black text-[#FDB71A]">10+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Droite - Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl p-8 md:p-10">
              {/* En-tête du formulaire */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                    {t("community.formTitle")}
                  </h2>
                </div>
                <p className="text-gray-600 text-lg pl-6">
                  {t("community.formSubtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <User className="w-4 h-4 text-[#F47920]" />
                      {t("community.nameLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("community.namePlaceholder")}
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Mail className="w-4 h-4 text-[#F47920]" />
                      {t("community.emailLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder={t("community.emailPlaceholder")}
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Rôle */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Briefcase className="w-4 h-4 text-[#F47920]" />
                    {t("community.roleLabel")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none bg-white text-gray-900 font-medium"
                  >
                    <option value="">{t("community.roleSelect")}</option>
                    <option value="partenaire">{t("community.rolePartner")}</option>
                    <option value="client">{t("community.roleClient")}</option>
                    <option value="fournisseur">{t("community.roleSupplier")}</option>
                    <option value="employe">{t("community.roleEmployee")}</option>
                    <option value="autres">{t("community.roleOther")}</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <MessageSquare className="w-4 h-4 text-[#F47920]" />
                    {t("community.messageLabel")}
                  </label>
                  <textarea
                    name="message"
                    placeholder={t("community.messagePlaceholder")}
                    value={form.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none resize-none text-gray-900 font-medium"
                  />
                </div>

                {/* Bouton d'envoi */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("community.sending")}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        {t("community.sendButton")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
      <section className="bg-gray-50 border-t border-gray-100 py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              {t("community.valuesTitle")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("community.valuesSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Valeur 1 */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("community.value1Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("community.value1Desc")}
              </p>
            </div>

            {/* Valeur 2 */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("community.value2Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("community.value2Desc")}
              </p>
            </div>

            {/* Valeur 3 */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E84E1B] to-[#FDB71A] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("community.value3Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("community.value3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChatBotNew />
    </div>
  );
};

export default Community;