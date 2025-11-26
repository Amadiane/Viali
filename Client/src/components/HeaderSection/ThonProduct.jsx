import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, X, PlusCircle, Edit2, Trash2 } from "lucide-react";
import CONFIG from "../../config/config.js";

// 🔹 Composants réutilisables
const GradientButton = ({ onClick, children, disabled = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40 hover:shadow-xl hover:shadow-orange-400/50 ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const Alert = ({ type, message, onClose }) => {
  const types = {
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertCircle },
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle2 },
  };
  const Icon = types[type].icon;
  return (
    <div className={`${types[type].bg} ${types[type].text} border-2 ${types[type].border} p-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>
    </div>
  );
};

const LoadingSpinner = ({ text }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <Loader2 className="animate-spin w-16 h-16 text-orange-500" />
    <p className="mt-6 text-gray-700 font-semibold text-lg">{text}</p>
  </div>
);

const ThonProduct = () => {
  const [products, setProducts] = useState([]);
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
    content_fr: "",
    content_en: "",
    image: null,
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_THON_PRODUCT_LIST);
      if (!res.ok) throw new Error("Erreur lors du chargement des produits");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer les produits");
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
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      content_fr: "",
      content_en: "",
      image: null,
      is_active: true,
    });
    setPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      let imageUrl = null;
      if (formData.image) imageUrl = await uploadToCloudinary(formData.image);

      const payload = {
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        content_fr: formData.content_fr,
        content_en: formData.content_en,
        image: imageUrl,
        is_active: formData.is_active,
      };

      const url = editingId ? CONFIG.API_THON_PRODUCT_UPDATE(editingId) : CONFIG.API_THON_PRODUCT_CREATE;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      setSuccessMessage(editingId ? "Produit mis à jour !" : "Produit ajouté !");
      resetForm();
      fetchProducts();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const res = await fetch(CONFIG.API_THON_PRODUCT_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Produit supprimé !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title_fr: product.title_fr,
      title_en: product.title_en,
      content_fr: product.content_fr,
      content_en: product.content_en,
      image: null,
      is_active: product.is_active,
    });
    setPreview(product.image_url || null);
    setShowForm(true);
  };

  if (fetchLoading) return <LoadingSpinner text="Chargement des produits..." />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-800">Gestion des produits de Thon</h1>
        <GradientButton onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
          {showForm ? <X size={18} /> : <PlusCircle size={18} />}
          <span>{showForm ? "Fermer" : "Ajouter"}</span>
        </GradientButton>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" name="title_fr" value={formData.title_fr} onChange={handleChange} placeholder="Titre (FR)" className="w-full border p-3 rounded-lg" />
              <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} placeholder="Title (EN)" className="w-full border p-3 rounded-lg" />
            </div>
            <textarea name="content_fr" value={formData.content_fr} onChange={handleChange} placeholder="Contenu (FR)" rows="3" className="w-full border p-3 rounded-lg" />
            <textarea name="content_en" value={formData.content_en} onChange={handleChange} placeholder="Content (EN)" rows="3" className="w-full border p-3 rounded-lg" />
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded-lg" />
            {preview && <img src={preview} alt="preview" className="w-48 h-48 object-cover mt-2 rounded-lg" />}
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              <label>Produit actif</label>
            </div>
            <GradientButton onClick={handleSubmit} disabled={loading}>{loading ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}</GradientButton>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow-lg relative">
            {p.image_url && <img src={p.image_url} alt={p.title_en} className="w-full h-40 object-cover rounded-xl mb-2" />}
            <h3 className="font-bold">{p.title_fr}</h3>
            <p className="text-sm text-gray-600">{p.title_en}</p>
            <p className="text-gray-700 text-sm mt-2">{p.content_fr}</p>
            <p className="text-gray-700 text-sm">{p.content_en}</p>
            <p className="mt-2 text-xs text-gray-500">Actif: {p.is_active ? "Oui" : "Non"}</p>
            <div className="flex gap-2 mt-2">
              <GradientButton onClick={() => handleEdit(p)} className="flex-1 bg-blue-500">Modifier</GradientButton>
              <GradientButton onClick={() => handleDelete(p.id)} className="flex-1 bg-red-500">Supprimer</GradientButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThonProduct;
