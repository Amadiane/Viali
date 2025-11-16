import React, { useEffect, useState } from "react";
import { Mail, Loader2, Trash2, Eye, Send, X, Calendar, Tag, CheckCircle, Clock } from "lucide-react";
import CONFIG from "../../config/config.js";

const ListeContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, replied, pending

  // 📨 Charger la liste des contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      setError("Erreur lors du chargement des contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 🗑️ Supprimer un contact
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce contact ?")) return;
    try {
      const res = await fetch(CONFIG.API_CONTACT_DETAIL(id), { method: "DELETE" });
      if (res.ok) {
        setSuccessMessage("Contact supprimé avec succès !");
        fetchContacts();
      } else {
        setError("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      setError("Erreur lors de la suppression");
    }
  };

  // 📬 Préparer la réponse
  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
  };

  // 📤 Envoyer la réponse par mail
  const sendReply = async () => {
  if (!replyMessage.trim()) {
    setError("Veuillez écrire un message.");
    return;
  }

  setSending(true);
  setError(null);

  try {
    const res = await fetch(CONFIG.API_CONTACT_REPLY(selectedContact.id), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyMessage }),
    });

    if (res.ok) {
      setSuccessMessage("Réponse envoyée avec succès !");

      // 🧠 Met à jour le contact dans le state local
      setContacts(prevContacts =>
        prevContacts.map(c =>
          c.id === selectedContact.id ? { ...c, is_replied: true } : c
        )
      );

      // Nettoyage
      setSelectedContact(null);
      setReplyMessage("");
    } else {
      setError("Erreur lors de l'envoi du mail.");
    }
  } catch (err) {
    console.error("Erreur d'envoi :", err);
    setError("Erreur lors de l'envoi");
  } finally {
    setSending(false);
  }
};


  // Filtrer les contacts
  const filteredContacts = contacts.filter(contact => {
    if (filterStatus === "replied") return contact.is_replied;
    if (filterStatus === "pending") return !contact.is_replied;
    return true;
  });

  // Catégories avec couleurs
  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-blue-500/20 text-blue-300 border-blue-500/50",
      support: "bg-green-500/20 text-green-300 border-green-500/50",
      partnership: "bg-purple-500/20 text-purple-300 border-purple-500/50",
      other: "bg-gray-500/20 text-gray-300 border-gray-500/50",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin inline-block text-orange-500" size={40} />
          <p className="mt-4 text-gray-300 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-lg"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Messages de Contact
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {filteredContacts.length} message{filteredContacts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Tous ({contacts.length})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              En attente ({contacts.filter(c => !c.is_replied).length})
            </button>
            <button
              onClick={() => setFilterStatus("replied")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === "replied"
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              Répondus ({contacts.filter(c => c.is_replied).length})
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 text-red-300 p-4 mb-6 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/20 border-2 border-green-500/50 text-green-300 p-4 mb-6 rounded-xl backdrop-blur-sm">
            {successMessage}
          </div>
        )}

        {/* Liste des contacts */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Mail size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">Aucun message trouvé</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div key={contact.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50">
                  
                  <div className="p-4 md:p-6">
                    {/* Header du contact */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {contact.name}
                          </h3>
                          {contact.is_replied ? (
                            <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/50 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                              <CheckCircle size={14} /> Répondu
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                              <Clock size={14} /> En attente
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{contact.email}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold ${getCategoryColor(contact.category)}`}>
                            <Tag size={12} />
                            {contact.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar size={12} />
                            {new Date(contact.created_at).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold flex items-center gap-2"
                        >
                          <Eye size={16} /> Voir
                        </button>
                        <button
                          onClick={() => handleReply(contact)}
                          className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all text-sm font-semibold flex items-center gap-2"
                        >
                          <Send size={16} /> Répondre
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="bg-red-500/20 border border-red-500/50 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Sujet */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <p className="text-xs font-bold text-orange-400 mb-1">SUJET</p>
                      <p className="text-white font-semibold">{contact.subject}</p>
                    </div>

                    {/* Message preview */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 mt-3">
                      <p className="text-xs font-bold text-blue-400 mb-1">MESSAGE</p>
                      <p className="text-gray-300 text-sm line-clamp-2">{contact.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔍 MODAL DÉTAILS */}
        {selectedContact && !replyMessage && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedContact(null)}
          >
            <div 
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-[#0a0e27] rounded-3xl shadow-2xl border-2 border-orange-500/30 overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-6 md:p-8 border-b border-white/10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-2xl md:text-3xl font-black text-white">
                          {selectedContact.name}
                        </h2>
                        {selectedContact.is_replied ? (
                          <span className="flex items-center gap-1 bg-green-500/30 border border-green-500/50 text-green-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                            <CheckCircle size={16} /> Répondu
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-yellow-500/30 border border-yellow-500/50 text-yellow-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                            <Clock size={16} /> En attente
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-orange-400 font-semibold mb-2">
                        📧 {selectedContact.email}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-sm font-semibold ${getCategoryColor(selectedContact.category)}`}>
                          <Tag size={14} />
                          {selectedContact.category}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                          <Calendar size={14} />
                          {new Date(selectedContact.created_at).toLocaleString("fr-FR")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="p-6 md:p-8">
                  {/* Sujet */}
                  <div className="bg-white/5 p-4 rounded-xl border border-orange-500/30 mb-4">
                    <p className="text-xs font-bold text-orange-400 mb-2">SUJET</p>
                    <p className="text-white font-semibold text-lg">{selectedContact.subject}</p>
                  </div>

                  {/* Message */}
                  <div className="bg-white/5 p-4 rounded-xl border border-blue-500/30 mb-6">
                    <p className="text-xs font-bold text-blue-400 mb-2">MESSAGE COMPLET</p>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        handleReply(selectedContact);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-green-500/50 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> Répondre
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedContact.id);
                        setSelectedContact(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-red-500/50 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📬 MODAL RÉPONSE */}
        {selectedContact && replyMessage !== null && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => {
              setSelectedContact(null);
              setReplyMessage("");
            }}
          >
            <div 
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-[#0a0e27] rounded-3xl shadow-2xl border-2 border-green-500/30 overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 border-b border-white/10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-black text-white mb-2">
                        Répondre à {selectedContact.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        📧 {selectedContact.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedContact(null);
                        setReplyMessage("");
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Formulaire */}
                <div className="p-6">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
                    <p className="text-xs font-bold text-orange-400 mb-1">SUJET ORIGINAL</p>
                    <p className="text-white text-sm">{selectedContact.subject}</p>
                  </div>

                  <label className="block font-semibold text-gray-300 mb-2">Votre réponse *</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows="6"
                    placeholder="Écrivez votre réponse ici..."
                    className="w-full px-4 py-3 bg-white/10 border-2 border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all resize-none"
                  ></textarea>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={sendReply}
                      disabled={sending || !replyMessage.trim()}
                      className="relative group overflow-hidden flex-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {sending ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send size={18} /> Envoyer
                          </>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedContact(null);
                        setReplyMessage("");
                      }}
                      className="bg-gray-600/30 border-2 border-gray-500/50 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-600/50 transition-all font-semibold"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeContacts;