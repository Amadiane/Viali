import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle2, AlertCircle, Send, Mail, User, MessageSquare, Tag, Phone, MapPin, Clock } from "lucide-react";
import CONFIG from "../../config/config.js";
import { trackAction } from "../../utils/tracker";

const Contacternous = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "question",
    message: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subject: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(CONFIG.API_CONTACT_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi du message");

      setSuccessMessage(t("contact.successMessage"));

      // Tracker soumission formulaire
      trackAction({
        action_type: "contact_submit",
        page: "/contact",
        label: formData.subject || "Contact Form",
      });

      // Tracker envoi mail
      trackAction({
        action_type: "mail_sent",
        page: "/contact",
        label: formData.email,
        meta: { subject: formData.subject },
      });

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "question",
        message: "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(t("contact.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin w-16 h-16 text-[#F47920]" />
      <p className="mt-6 text-gray-700 font-semibold">{t("contact.loading")}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-8 md:pt-40 md:pb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-4 tracking-tight">
            {t("contact.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light">
            {t("contact.subtitle")}
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
          {/* Colonne Gauche - Informations */}
          <div className="lg:col-span-1 space-y-8">
            {/* Carte Informations de Contact */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-lg">
              <h2 className="text-2xl font-black text-gray-900 mb-6">
                {t("contact.ourInfo")}
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t("contact.email")}</h3>
                    <a href="mailto:contact@viali.ma" className="text-gray-600 hover:text-[#F47920] transition-colors">
                      contact@viali.ma
                    </a>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F47920] to-[#E84E1B] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t("contact.phone")}</h3>
                    <a href="tel:+212123456789" className="text-gray-600 hover:text-[#F47920] transition-colors">
                      +212 123 456 789
                    </a>
                  </div>
                </div>

                {/* Adresse */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E84E1B] to-[#FDB71A] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t("contact.address")}</h3>
                    <p className="text-gray-600">
                      {t("contact.addressLine1")}<br />
                      {t("contact.addressLine2")}
                    </p>
                  </div>
                </div>

                {/* Horaires */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t("contact.hours")}</h3>
                    <p className="text-gray-600">
                      {t("contact.hoursWeekdays")}<br />
                      {t("contact.hoursSaturday")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Info */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl border-2 border-orange-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                💡 {t("contact.helpTitle")}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {t("contact.helpText")}
              </p>
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
                    {t("contact.formTitle")}
                  </h2>
                </div>
                <p className="text-gray-600 text-lg pl-6">
                  {t("contact.formSubtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <User className="w-4 h-4 text-[#F47920]" />
                      {t("contact.nameLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("contact.namePlaceholder")}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-900 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Mail className="w-4 h-4 text-[#F47920]" />
                      {t("contact.emailLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder={t("contact.emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Tag className="w-4 h-4 text-[#F47920]" />
                    {t("contact.categoryLabel")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none bg-white text-gray-900 font-medium"
                  >
                    <option value="question">{t("contact.categoryQuestion")}</option>
                    <option value="support">{t("contact.categorySupport")}</option>
                    <option value="partenariat">{t("contact.categoryPartnership")}</option>
                    <option value="commentaire">{t("contact.categoryComment")}</option>
                  </select>
                </div>

                {/* Sujet */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <MessageSquare className="w-4 h-4 text-[#F47920]" />
                    {t("contact.subjectLabel")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder={t("contact.subjectPlaceholder")}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-4 focus:ring-orange-100 transition-all duration-200 outline-none text-gray-900 font-medium"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <MessageSquare className="w-4 h-4 text-[#F47920]" />
                    {t("contact.messageLabel")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder={t("contact.messagePlaceholder")}
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
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
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("contact.sendButton")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="bg-gray-50 border-t border-gray-100 py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            {t("contact.ctaTitle")}
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            {t("contact.ctaText")}
          </p>
          <a
            href="tel:+212123456789"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white font-bold text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-400/50 transition-all duration-300"
          >
            <Phone className="w-5 h-5" />
            +212 123 456 789
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contacternous;