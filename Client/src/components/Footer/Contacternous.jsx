import React, { useState, useEffect } from "react";
import { Loader2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import CONFIG from "../../config/config.js";

const Contacternous = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_CONTACT_LIST);
      if (!res.ok) throw new Error("Erreur lors du chargement des contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setSuccessMessage("Message envoyé avec succès !");
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
      });
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      const res = await fetch(CONFIG.API_CONTACT_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setSuccessMessage("Message supprimé !");
      fetchContacts();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="animate-spin w-16 h-16 text-orange-500" />
      <p className="mt-4 text-gray-700">Chargement des messages...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successMessage}
        </div>
      )}

      {/* Formulaire de création */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-10 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="text"
          name="subject"
          placeholder="Sujet"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="general">Question générale</option>
          <option value="support">Support technique</option>
          <option value="partenariat">Partenariat</option>
          <option value="commentaire">Commentaires et suggestions</option>
        </select>
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition"
        >
          {isSubmitting ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      {/* Liste des contacts */}
      <div className="grid md:grid-cols-2 gap-4">
        {contacts.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl shadow-md relative">
            <p><strong>Nom :</strong> {c.name}</p>
            <p><strong>Email :</strong> {c.email}</p>
            <p><strong>Sujet :</strong> {c.subject}</p>
            <p><strong>Catégorie :</strong> {c.category}</p>
            <p><strong>Message :</strong> {c.message}</p>
            <p className="text-xs text-gray-400">Envoyé le {new Date(c.created_at).toLocaleString()}</p>
            <button
              onClick={() => handleDelete(c.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacternous;
