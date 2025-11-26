import React, { useEffect, useState } from "react";
import { Mail, Loader2, Trash2, Eye, Send, X, Calendar, Tag, CheckCircle, Clock } from "lucide-react";
import CONFIG from "../../config/config.js";
import toast, { Toaster } from "react-hot-toast"; // ✅ Toast notifications

const ListeContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // all, replied, pending

  // 🔄 Charger les contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des contacts");
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
        toast.success("Contact supprimé !");
        setContacts(prev => prev.filter(c => c.id !== id));
        if (selectedContact?.id === id) setSelectedContact(null);
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  // 📬 Préparer la réponse
  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
  };

  // 📤 Envoyer la réponse
  const sendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Veuillez écrire un message.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_REPLY(selectedContact.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyMessage }),
      });

      if (res.ok) {
        toast.success("Réponse envoyée !");
        // Mise à jour locale
        setContacts(prev => prev.map(c => c.id === selectedContact.id ? { ...c, is_replied: true } : c));
        setSelectedContact(null);
        setReplyMessage("");
      } else {
        toast.error("Erreur lors de l'envoi du mail.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter(c => {
    if (filterStatus === "replied") return c.is_replied;
    if (filterStatus === "pending") return !c.is_replied;
    return true;
  });

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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e27]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] relative p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white">Messages de Contact</h1>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "replied"].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === status
                  ? status === "all"
                    ? "bg-orange-500 text-white"
                    : status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {status === "all" ? `Tous (${contacts.length})` :
               status === "pending" ? `En attente (${contacts.filter(c => !c.is_replied).length})` :
               `Répondus (${contacts.filter(c => c.is_replied).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun message trouvé</p>
        ) : filteredContacts.map(contact => (
          <div key={contact.id} className="relative group bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-white/10 hover:border-orange-500/50 transition-all p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                  {contact.is_replied ? (
                    <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/50 text-green-300 px-3 py-1 rounded-full text-xs font-semibold"><CheckCircle size={14}/> Répondu</span>
                  ) : (
                    <span className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold"><Clock size={14}/> En attente</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-1">{contact.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold ${getCategoryColor(contact.category)}`}><Tag size={12}/> {contact.category}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-500"><Calendar size={12}/>{new Date(contact.created_at).toLocaleString("fr-FR")}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedContact(contact)} className="bg-blue-500/20 border border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all text-sm flex items-center gap-2"><Eye size={16}/> Voir</button>
                <button onClick={() => handleReply(contact)} className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all text-sm flex items-center gap-2"><Send size={16}/> Répondre</button>
                <button onClick={() => handleDelete(contact.id)} className="bg-red-500/20 border border-red-500/50 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-all"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DÉTAIL / RÉPONSE */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full" onClick={(e)=>e.stopPropagation()}>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-[#0a0e27] rounded-3xl shadow-2xl border-2 border-green-500/30 overflow-hidden p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl md:text-2xl font-black text-white">Répondre à {selectedContact.name}</h2>
                <button onClick={() => setSelectedContact(null)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg"><X size={20}/></button>
              </div>
              <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="text-xs font-bold text-orange-400 mb-1">SUJET ORIGINAL</p>
                <p className="text-white text-sm">{selectedContact.subject}</p>
              </div>
              <textarea
                value={replyMessage}
                onChange={(e)=>setReplyMessage(e.target.value)}
                rows="6"
                placeholder="Écrivez votre réponse ici..."
                className="w-full px-4 py-3 bg-white/10 border-2 border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={sendReply} disabled={sending || !replyMessage.trim()} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  {sending ? <Loader2 className="animate-spin"/> : <Send size={18}/>} {sending ? "Envoi..." : "Envoyer"}
                </button>
                <button onClick={()=>setSelectedContact(null)} className="flex-1 bg-gray-600/30 border-2 border-gray-500/50 text-gray-300 px-6 py-3 rounded-lg font-semibold">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListeContacts;
