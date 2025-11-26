import React, { useState, useEffect } from "react";
import { Fish, Loader2, Trash2, PlusCircle, Edit2 } from "lucide-react";
import CONFIG from "../../config/config.js";

const SardineRecipesPost = () => {
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

  // try to get token from localStorage (adjust key to your app)
  const token = typeof window !== "undefined" && (localStorage.getItem("token") || localStorage.getItem("access"));

  useEffect(() => {
    fetchItems();
  }, []);

  const getAuthHeaders = (isJson = true) => {
    const headers = {};
    if (isJson) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const fetchItems = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_SARDINE_LIST, {
        headers: getAuthHeaders(true),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error: ${res.status} ${txt}`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement");
    } finally {
      setFetchLoading(false);
    }
  };

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
      return json.secure_url || null;
    } catch (err) {
      console.error("Cloudinary error", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      image: null,
      isActive: true,
    });
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      if (formData.image) imageUrl = await uploadToCloudinary(formData.image);

      // Build payload: use snake_case for is_active (backend expects that)
      const payload = {
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        // is_active must match backend field name
        is_active: !!formData.isActive,
      };

      // include image only if we have an uploaded url (avoid wiping existing image)
      if (imageUrl) payload.image = imageUrl;

      const url = editingId
        ? CONFIG.API_SARDINE_UPDATE(editingId)
        : CONFIG.API_SARDINE_CREATE;

      // use PATCH for updates (partial) and POST for create
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // try to read json error
        let errText = `${res.status}`;
        try {
          const j = await res.json();
          errText = j.detail || JSON.stringify(j);
        } catch {
          errText = await res.text();
        }
        throw new Error(errText);
      }

      setSuccessMessage(editingId ? "Modifié !" : "Ajouté !");
      resetForm();
      fetchItems();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title_fr: item.title_fr || "",
      title_en: item.title_en || "",
      image: null,
      isActive: item.is_active ?? true,
    });

    setPreview(item.image_url || null);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette recette ?")) return;
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(CONFIG.API_SARDINE_DELETE(id), {
        method: "DELETE",
        headers: getAuthHeaders(true),
      });

      if (res.status === 204 || res.ok) {
        setSuccessMessage("Supprimé !");
        fetchItems();
        return;
      }

      // parse possible error body
      let errText = `${res.status}`;
      try {
        const j = await res.json();
        errText = j.detail || JSON.stringify(j);
      } catch {
        errText = await res.text();
      }
      throw new Error(errText);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression: " + (err.message || ""));
    }
  };

  if (fetchLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0e27] p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl text-white flex items-center gap-2">
          <Fish /> Recettes Sardine
        </h1>

        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-orange-500 px-4 py-2 rounded text-white flex items-center gap-2"
        >
          <PlusCircle size={18} />
          {showForm ? "Fermer" : "Ajouter"}
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-600 text-white p-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1f3a] p-6 rounded-lg mb-6">
          <input
            type="text"
            name="title_fr"
            value={formData.title_fr}
            onChange={handleChange}
            placeholder="Titre FR"
            className="p-2 rounded w-full mb-3"
            required
          />

          <input
            type="text"
            name="title_en"
            value={formData.title_en}
            onChange={handleChange}
            placeholder="Title EN"
            className="p-2 rounded w-full mb-3"
          />

          <div className="mb-3">
            <label className="inline-flex items-center gap-2 text-white">
              <input
                type="checkbox"
                name="isActive"
                checked={!!formData.isActive}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <input type="file" name="image" onChange={handleChange} accept="image/*" />

          {preview && (
            <img src={preview} className="mt-3 w-32 h-32 object-cover rounded-lg" />
          )}

          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
            {loading ? "En cours..." : editingId ? "Modifier" : "Ajouter"}
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-[#1a1f3a] p-4 rounded-lg relative">
            {item.image_url ? (
              <img src={item.image_url} className="w-full h-40 object-cover rounded" />
            ) : (
              <div className="w-full h-40 bg-[#111428] rounded flex items-center justify-center text-gray-400">
                Pas d'image
              </div>
            )}

            <h3 className="text-white mt-2">{item.title_fr}</h3>

            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(item)} className="bg-blue-500 px-3 py-1 text-white rounded">
                <Edit2 size={14} />
              </button>

              <button onClick={() => handleDelete(item.id)} className="bg-red-500 px-3 py-1 text-white rounded">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SardineRecipesPost;
