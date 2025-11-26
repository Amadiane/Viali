import React, { useEffect, useState } from "react";
import { Trash2, Mail, CheckCircle, Loader2 } from "lucide-react";
import CONFIG from "../../config/config.js";

const ListeAbonnement = () => {
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Charger les abonnements
  const fetchAbonnements = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_NEWSLETTER_LIST);
      const data = await res.json();
      setAbonnements(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAbonnements();
  }, []);

  // Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet abonnement ?")) return;

    try {
      await fetch(CONFIG.API_NEWSLETTER_DELETE(id), { method: "DELETE" });
      setAbonnements(abonnements.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  // Répondre
  const handleReply = async () => {
    if (!replyMessage.trim()) return alert("Veuillez écrire un message.");

    setReplyLoading(true);

    try {
      const res = await fetch(CONFIG.API_NEWSLETTER_REPLY(selectedAbonnement.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (res.ok) {
        alert("Réponse envoyée avec succès !");
        setSelectedAbonnement(null);
        setReplyMessage("");

        fetchAbonnements();
      } else {
        alert("Erreur lors de l’envoi.");
      }
    } catch (error) {
      console.error("Erreur :", error);
    }

    setReplyLoading(false);
  };

  // Filtrer les résultats
  const filteredAbonnements = abonnements.filter((item) => {
    if (filter === "replied") return item.is_replied;
    if (filter === "pending") return !item.is_replied;
    return true;
  });

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Liste des abonnements Newsletter</h1>

      {/* Filtres */}
      <div className="flex gap-3 mb-5">
        <button
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          Tous
        </button>

        <button
          className={`px-4 py-2 rounded ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("pending")}
        >
          En attente
        </button>

        <button
          className={`px-4 py-2 rounded ${filter === "replied" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("replied")}
        >
          Répondus
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          Chargement...
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Confirmé</th>
              <th className="p-3 border">Répondu</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAbonnements.map((item) => (
              <tr key={item.id} className="text-center border">
                <td className="p-3 border">{item.id}</td>
                <td className="p-3 border">{item.email}</td>
                <td className="p-3 border">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="p-3 border">
                  {item.is_confirmed ? (
                    <CheckCircle className="text-green-600 inline" />
                  ) : (
                    "Non"
                  )}
                </td>
                <td className="p-3 border">
                  {item.is_replied ? (
                    <span className="text-green-700 font-semibold">Oui</span>
                  ) : (
                    <span className="text-red-600">Non</span>
                  )}
                </td>

                <td className="p-3 border flex justify-center gap-3">
                  {/* Répondre */}
                  <button
                    className="text-blue-600"
                    onClick={() => setSelectedAbonnement(item)}
                  >
                    <Mail />
                  </button>

                  {/* Supprimer */}
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODALE DE RÉPONSE */}
      {selectedAbonnement && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-3">Répondre à {selectedAbonnement.email}</h2>

            <textarea
              className="w-full border p-2 h-32"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Votre message..."
            />

            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setSelectedAbonnement(null)}
              >
                Annuler
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                onClick={handleReply}
                disabled={replyLoading}
              >
                {replyLoading && <Loader2 className="animate-spin" />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeAbonnement;
