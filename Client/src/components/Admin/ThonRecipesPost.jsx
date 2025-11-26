import React, { useState, useEffect } from "react";
import { Fish, Loader2, Trash2, PlusCircle, Edit2 } from "lucide-react";
import CONFIG from "../../config/config.js";

const ThonRecipesPost = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    image: null,
    isActive: true,
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_THON_LIST);
      const data = await res.json();
      setItems(data.map(item => ({ ...item, image_url: item.image || null })));
    } catch {
      setError("Erreur lors du chargement des recettes");
    }
    setFetchLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({ title_fr: "", title_en: "", image: null, isActive: true });
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccessMessage(null);

  try {
    // Crée FormData
    const data = new FormData();
    data.append("title_fr", formData.title_fr || "");
    data.append("title_en", formData.title_en || "");
    data.append("is_active", formData.isActive ? "true" : "false");

    // ✅ Ajoute l'image seulement si un fichier est sélectionné
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    // URL + méthode
    const url = editingId ? CONFIG.API_THON_UPDATE(editingId) : CONFIG.API_THON_CREATE;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: data,
      // ❌ ne pas mettre Content-Type ici, fetch gère multipart/form-data automatiquement
    });

    // Vérification du retour
    if (!res.ok) {
      // Essaie de lire le message d'erreur renvoyé par Django
      const errData = await res.json().catch(() => null);
      console.error("Erreur API:", errData);
      throw new Error("Erreur API");
    }

    setSuccessMessage(editingId ? "Recette mise à jour !" : "Recette ajoutée !");
    resetForm();
    fetchItems();
  } catch (err) {
    console.error(err);
    setError("Erreur lors de l'enregistrement. Vérifie que tous les champs sont valides.");
  }

  setLoading(false);
};


  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title_fr: item.title_fr,
      title_en: item.title_en,
      image: null,
      isActive: item.is_active,
    });
    setPreview(item.image_url);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette recette ?")) return;
    try { await fetch(CONFIG.API_THON_DELETE(id), { method: "DELETE" }); fetchItems(); } 
    catch { setError("Erreur lors de la suppression"); }
  };

  if (fetchLoading)
    return <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>;

  return (
    <div className="min-h-screen bg-[#0a0e27] p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl text-white flex items-center gap-2"><Fish /> Recettes de Thon</h1>
        <button onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-orange-500 px-4 py-2 rounded text-white flex items-center gap-2">
          <PlusCircle size={18} />{showForm ? "Fermer" : "Ajouter"}
        </button>
      </div>

      {error && <p className="text-red-400 mb-3">{error}</p>}
      {successMessage && <p className="text-green-400 mb-3">{successMessage}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1f3a] p-6 rounded-lg mb-6">
          <input type="text" name="title_fr" value={formData.title_fr} onChange={handleChange}
            placeholder="Titre FR" required className="p-2 rounded w-full mb-3"/>
          <input type="text" name="title_en" value={formData.title_en} onChange={handleChange}
            placeholder="Title EN" required className="p-2 rounded w-full mb-3"/>
          <label className="text-white mt-3 block">Image</label>
          <input type="file" name="image" onChange={handleChange}/>
          <label className="text-white mt-3 flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}/> Activer
          </label>
          {preview && <img src={preview} className="mt-3 w-32 h-32 object-cover rounded-lg"/>}
          <button disabled={loading} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
            {loading ? "Chargement..." : editingId ? "Mettre à jour" : "Ajouter"}
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-[#1a1f3a] p-4 rounded-lg relative">
            {item.image_url && <img src={item.image_url} alt={item.title_fr} className="w-full h-40 object-cover rounded"/>}
            <h3 className="text-white mt-2 font-semibold">{item.title_fr} / {item.title_en}</h3>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(item)} className="bg-blue-500 px-3 py-1 text-white rounded flex items-center gap-1">
                <Edit2 size={14}/> Modifier
              </button>
              <button onClick={() => handleDelete(item.id)} className="bg-red-500 px-3 py-1 text-white rounded flex items-center gap-1">
                <Trash2 size={14}/> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThonRecipesPost;
