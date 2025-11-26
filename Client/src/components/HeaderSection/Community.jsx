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
    setForm(prev => ({ ...prev, [name]: value }));
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
      showToast("Votre demande a été envoyée avec succès !", 'success');
      setForm({ name: '', email: '', role: '', message: '' });
    } else {
      showToast("Erreur lors de l'envoi", 'error');
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    showToast("Impossible d'envoyer le formulaire", 'error');
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="min-h-screen bg-[#0a0e27] w-full relative overflow-hidden">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-24 right-4 md:right-8 z-50 animate-slide-in">
          <div className="relative">
            <div className={`absolute -inset-1 ${toast.type==='success'?'bg-green-500/50':'bg-red-500/50'} blur-xl rounded-xl`}></div>
            <div className={`relative ${toast.type==='success'?'bg-green-500/20 border-green-500/50':'bg-red-500/20 border-red-500/50'} backdrop-blur-xl border-2 rounded-xl p-4 pr-12 shadow-2xl`}>
              <div className="flex items-start gap-3">
                {toast.type==='success'?<CheckCircle className="w-6 h-6 text-green-400 mt-0.5"/>:<AlertCircle className="w-6 h-6 text-red-400 mt-0.5"/>}
                <p className={`${toast.type==='success'?'text-green-100':'text-red-100'} font-medium text-sm leading-relaxed`}>
                  {toast.message}
                </p>
              </div>
              <button onClick={()=>setToast({show:false,message:'',type:''})} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{t('Rejoignez notre communauté')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f1729]/90 backdrop-blur-xl p-8 rounded-3xl border-2 border-orange-500/30 shadow-2xl">
          {/* Nom */}
          <div>
            <label className="block text-gray-300 mb-2">{t('Nom complet')} *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10"/>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2">{t('Email')} *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"/>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-gray-300 mb-2">{t('Rôle')} *</label>
            <select name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10">
              <option value="">{t('-- Sélectionnez votre rôle --')}</option>
              <option value="partenaire">{t('Partenaire')}</option>
              <option value="client">{t('Client')}</option>
              <option value="fournisseur">{t('Fournisseur')}</option>
              <option value="employe">{t('Employé')}</option>
              <option value="autres">{t('Autres')}</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-300 mb-2">{t('Message')}</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="w-full px-4 py-3 rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"/>
          </div>

          {/* Bouton */}
          <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 ${isSubmitting?'bg-gray-500 cursor-not-allowed':'bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 shadow-lg hover:shadow-2xl'}`}>
            {isSubmitting ? <span className="flex items-center justify-center gap-2"><Loader className="w-5 h-5 animate-spin"/> {t('Envoi en cours...')}</span> : <span className="flex items-center justify-center gap-2"><UserPlus className="w-5 h-5"/> {t('Envoyer')}</span>}
          </button>
        </form>
      </div>

      <ChatBotNew />

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Community;
