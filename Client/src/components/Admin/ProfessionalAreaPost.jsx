import React, { useState, useEffect } from "react";
import { Building2, Loader2, Trash2, PlusCircle, Edit2 } from "lucide-react";
import CONFIG from "../../config/config.js";

const ProfessionalAreaPost = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name_fr: "",
    name_en: "",
    description_fr: "",
    description_en: "",
    image: null,
    target_group: "companies",
  });

  // 📌 Charger toutes les Professional Areas au démarrage
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_PRO_AREA_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des zones professionnelles");
    } finally {
      setFetchLoading(false);
    }
  };

  // 🔼 Upload Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error("Cloudinary error:", err);
      return null;
    }
  };

  // ✍️ Gestion des champs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      name_fr: "",
      name_en: "",
      description_fr: "",
      description_en: "",
      image: null,
      target_group: "companies",
    });
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  // 🧾 Ajouter ou modifier une Zone Professionnelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;

      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const payload = {
        name_fr: formData.name_fr,
        name_en: formData.name_en,
        description_fr: formData.description_fr,
        description_en: formData.description_en,
        image: imageUrl,
        target_group: formData.target_group,
      };

      const url = editingId
        ? CONFIG.API_PRO_AREA_UPDATE(editingId)
        : CONFIG.API_PRO_AREA_CREATE;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erreur API");

      setSuccessMessage(
        editingId ? "Zone Professionnelle modifiée !" : "Zone ajoutée !"
      );

      resetForm();
      fetchAreas();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Pré-remplir le formulaire
  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      name_fr: item.name_fr,
      name_en: item.name_en,
      description_fr: item.description_fr,
      description_en: item.description_en,
      image: null,
      target_group: item.target_group,
    });

    setPreview(item.image_url || null);
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette zone professionnelle ?"))
      return;

    try {
      const res = await fetch(CONFIG.API_PRO_AREA_DELETE(id), {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur API");

      setSuccessMessage("Zone supprimée !");
      fetchAreas();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // ⏳ Loader principal
  if (fetchLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );

  // ============================
  // 🎨 RENDER DU COMPOSANT
  // ============================
  return (
    <div className="min-h-screen bg-[#0a0e27] p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 size={26} /> Zones Professionnelles
        </h1>

        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-orange-500 px-4 py-2 rounded-lg text-white flex items-center gap-2"
        >
          <PlusCircle size={18} />
          {showForm ? "Fermer" : "Nouvelle Zone"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}

      {/* FORMULAIRE */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1f3a] p-6 rounded-lg mb-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name_fr"
              value={formData.name_fr}
              onChange={handleChange}
              placeholder="Nom FR"
              required
              className="p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              placeholder="Name EN"
              required
              className="p-2 rounded-lg w-full"
            />
          </div>

          <textarea
            name="description_fr"
            value={formData.description_fr}
            onChange={handleChange}
            placeholder="Description FR"
            required
            className="p-2 rounded-lg w-full mt-4"
          />

          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
            placeholder="Description EN"
            required
            className="p-2 rounded-lg w-full mt-4"
          />

          {/* Target Group */}
          <select
            name="target_group"
            value={formData.target_group}
            onChange={handleChange}
            className="p-2 rounded-lg w-full mt-4"
          >
            <option value="companies">Entreprises / Projet R&D</option>
            <option value="points_of_sale">
              Points de vente (Superette, Boutique, Grande surface)
            </option>
            <option value="distributors">Distributeurs (Grossiste)</option>
          </select>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-4"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-40 h-40 object-cover rounded-lg"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 px-4 py-2 rounded-lg mt-4 text-white"
          >
            {editingId ? "Mettre à jour" : "Ajouter"}
          </button>
        </form>
      )}

      {/* LISTE DES ITEMS */}
      <div className="grid md:grid-cols-3 gap-4">
        {areas.map((a) => (
          <div
            key={a.id}
            className="bg-[#1a1f3a] p-4 rounded-lg relative cursor-pointer"
          >
            {a.image_url && (
              <img
                src={a.image_url}
                alt={a.name_fr}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
            )}

            <h3 className="text-white font-bold">{a.name_fr}</h3>
            <p className="text-gray-300 text-sm">{a.description_fr}</p>

            <p className="text-gray-400 text-xs mt-1">
              Groupe cible :{" "}
              {a.target_group === "companies"
                ? "Entreprises"
                : a.target_group === "points_of_sale"
                ? "Points de vente"
                : "Distributeurs"}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(a)}
                className="flex-1 bg-blue-500 px-2 py-1 text-white rounded"
              >
                <Edit2 size={14} /> Modifier
              </button>

              <button
                onClick={() => handleDelete(a.id)}
                className="flex-1 bg-red-500 px-2 py-1 text-white rounded"
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalAreaPost;
