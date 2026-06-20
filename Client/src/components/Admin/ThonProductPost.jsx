import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Package, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Eye, ChevronLeft, ChevronRight, Image as ImageIcon, Check
} from "lucide-react";

const ThonProductPost = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]               = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [showList, setShowList]         = useState(true);
  const [editingId, setEditingId]       = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previews, setPreviews] = useState({
    image: null, image_recette1: null, image_recette2: null
  });

  const emptyForm = {
    title_fr: "", title_en: "",
    content_fr: "", content_en: "",
    ingredient_fr: "", ingredient_en: "",
    caracteristique_fr: "", caracteristique_en: "",
    ingredienttitle1_fr: "", ingredienttitle1_en: "",
    ingredienttitle2_fr: "", ingredienttitle2_en: "",
    ingredienttitle3_fr: "", ingredienttitle3_en: "",
    ingredientcontent_fr: "", ingredientcontent_en: "",
    image: null, image_recette1: null, image_recette2: null,
    is_active: true,
  };
  const [formData, setFormData] = useState(emptyForm);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(CONFIG.API_THON_PRODUCT_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch { setError("Erreur lors du chargement des produits"); }
    finally { setLoading(false); setFetchLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const uploadToCloudinary = async (file) => {
    if (!file || typeof file === "string") return file || null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      return json.secure_url;
    } catch { return null; }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData(p => ({ ...p, [name]: checked }));
    } else if (type === "file" && files?.[0]) {
      setFormData(p => ({ ...p, [name]: files[0] }));
      setPreviews(p => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setPreviews({ image: null, image_recette1: null, image_recette2: null });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccessMessage(null);
    try {
      const [imageUrl, recette1Url, recette2Url] = await Promise.all([
        uploadToCloudinary(formData.image),
        uploadToCloudinary(formData.image_recette1),
        uploadToCloudinary(formData.image_recette2),
      ]);

      const payload = {
        title_fr: formData.title_fr,           title_en: formData.title_en,
        content_fr: formData.content_fr,       content_en: formData.content_en,
        ingredient_fr: formData.ingredient_fr, ingredient_en: formData.ingredient_en,
        caracteristique_fr: formData.caracteristique_fr,
        caracteristique_en: formData.caracteristique_en,
        ingredienttitle1_fr: formData.ingredienttitle1_fr, ingredienttitle1_en: formData.ingredienttitle1_en,
        ingredienttitle2_fr: formData.ingredienttitle2_fr, ingredienttitle2_en: formData.ingredienttitle2_en,
        ingredienttitle3_fr: formData.ingredienttitle3_fr, ingredienttitle3_en: formData.ingredienttitle3_en,
        ingredientcontent_fr: formData.ingredientcontent_fr, ingredientcontent_en: formData.ingredientcontent_en,
        image: imageUrl,
        image_recette1: recette1Url,
        image_recette2: recette2Url,
        is_active: formData.is_active,
      };

      const url    = editingId ? CONFIG.API_THON_PRODUCT_UPDATE(editingId) : CONFIG.API_THON_PRODUCT_CREATE;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

      setSuccessMessage(editingId ? "Produit mis à jour !" : "Produit ajouté !");
      resetForm(); await fetchProducts();
      setShowForm(false); setShowList(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      const res = await fetch(CONFIG.API_THON_PRODUCT_DELETE(id), { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      setSuccessMessage("Produit supprimé !"); await fetchProducts(); setSelectedProduct(null);
    } catch { setError("Erreur lors de la suppression"); }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title_fr: product.title_fr || "",         title_en: product.title_en || "",
      content_fr: product.content_fr || "",     content_en: product.content_en || "",
      ingredient_fr: product.ingredient_fr || "", ingredient_en: product.ingredient_en || "",
      caracteristique_fr: product.caracteristique_fr || "",
      caracteristique_en: product.caracteristique_en || "",
      ingredienttitle1_fr: product.ingredienttitle1_fr || "", ingredienttitle1_en: product.ingredienttitle1_en || "",
      ingredienttitle2_fr: product.ingredienttitle2_fr || "", ingredienttitle2_en: product.ingredienttitle2_en || "",
      ingredienttitle3_fr: product.ingredienttitle3_fr || "", ingredienttitle3_en: product.ingredienttitle3_en || "",
      ingredientcontent_fr: product.ingredientcontent_fr || "", ingredientcontent_en: product.ingredientcontent_en || "",
      image: product.image || "",
      image_recette1: product.image_recette1 || "",
      image_recette2: product.image_recette2 || "",
      is_active: product.is_active ?? true,
    });
    setPreviews({
      image: product.image_url || null,
      image_recette1: product.image_recette1_url || null,
      image_recette2: product.image_recette2_url || null,
    });
    setShowForm(true); setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(products.length / itemsPerPage);
  const handlePageChange = (n) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const ImageUpload = ({ name, label }) => (
    <div className="space-y-3">
      <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-[#E84E1B]"/> {label}
      </label>
      <input type="file" name={name} accept="image/*" onChange={handleChange}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer"/>
      {previews[name] && (
        <div className="w-32 h-32 bg-white border border-gray-200 rounded-xl p-2 shadow">
          <img src={previews[name]} alt="aperçu" className="w-full h-full object-contain rounded-lg"/>
        </div>
      )}
    </div>
  );

  if (fetchLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center"><Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4"/>
        <p className="text-gray-600 font-medium">Chargement des produits...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="text-white w-7 h-7"/>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900">Produits de Thon</h1>
                  <p className="text-gray-500 font-medium mt-1">Catalogue, Ingrédients & Recettes</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchProducts} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}/> Actualiser
                </button>
                <button onClick={() => { setShowForm(!showForm); if (!showForm) { resetForm(); setShowList(false); } else { setShowList(true); } }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  {showForm ? <><X className="w-5 h-5"/> Fermer</> : <><PlusCircle className="w-5 h-5"/> Nouveau Produit</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error          && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex justify-between items-center"><span className="text-red-700 font-medium">{error}</span><button onClick={() => setError(null)}><X size={18} className="text-red-400"/></button></div>}
        {successMessage && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex justify-between items-center"><span className="text-green-700 font-medium">{successMessage}</span><button onClick={() => setSuccessMessage(null)}><X size={18} className="text-green-400"/></button></div>}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">{editingId ? "Modifier le produit" : "Nouveau produit"}</h3>
              </div>

              {/* Titres */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Titre (FR) *</label>
                  <input type="text" name="title_fr" value={formData.title_fr} onChange={handleChange} required
                    placeholder="Ex: Thon à l'huile d'olive"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Title (EN) *</label>
                  <input type="text" name="title_en" value={formData.title_en} onChange={handleChange} required
                    placeholder="Ex: Tuna in Olive Oil"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 p-5 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Description générale
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Description (FR)</label>
                    <textarea name="content_fr" value={formData.content_fr} onChange={handleChange} rows="3"
                      placeholder="Description du produit en français..."
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:border-blue-400 transition-all bg-white font-medium resize-none"/>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Description (EN)</label>
                    <textarea name="content_en" value={formData.content_en} onChange={handleChange} rows="3"
                      placeholder="Product description in English..."
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:border-blue-400 transition-all bg-white font-medium resize-none"/>
                  </div>
                </div>
              </div>

              {/* Caractéristique */}
              <div className="mb-6 p-5 bg-purple-50 rounded-2xl border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Caractéristique du produit
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Texte affiché à gauche de l'image principale sur la page publique, avant la section recette.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Caractéristique (FR)</label>
                    <textarea name="caracteristique_fr" value={formData.caracteristique_fr} onChange={handleChange} rows="5"
                      placeholder="Ex: Notre thon est pêché dans le respect des normes durables, riche en protéines..."
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:border-purple-400 transition-all bg-white font-medium resize-none"/>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Characteristic (EN)</label>
                    <textarea name="caracteristique_en" value={formData.caracteristique_en} onChange={handleChange} rows="5"
                      placeholder="Ex: Our tuna is sustainably caught, rich in protein..."
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:border-purple-400 transition-all bg-white font-medium resize-none"/>
                  </div>
                </div>
              </div>

              {/* Ingrédients globaux */}
              <div className="mb-6 p-5 bg-green-50 rounded-2xl border border-green-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span> Ingrédients
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Liste ingrédients (FR)</label>
                    <textarea name="ingredient_fr" value={formData.ingredient_fr} onChange={handleChange} rows="3"
                      placeholder="Ex: Thon, huile d'olive, sel..."
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:border-green-400 transition-all bg-white font-medium resize-none"/>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Ingredients (EN)</label>
                    <textarea name="ingredient_en" value={formData.ingredient_en} onChange={handleChange} rows="3"
                      placeholder="Ex: Tuna, olive oil, salt..."
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:border-green-400 transition-all bg-white font-medium resize-none"/>
                  </div>
                </div>

                {/* Sections ingrédients structurés */}
                <p className="text-sm font-bold text-gray-600 mb-3">Sections recette (optionnel)</p>
                {[1,2,3].map(num => (
                  <div key={num} className="mb-4 p-4 bg-white rounded-xl border border-green-200">
                    <h5 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-black">{num}</span>
                      Section {num}
                    </h5>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                      <div><label className="text-xs font-semibold text-gray-600 block mb-1">Titre (FR)</label>
                        <input type="text" name={`ingredienttitle${num}_fr`} value={formData[`ingredienttitle${num}_fr`]} onChange={handleChange}
                          className="w-full px-3 py-2 border border-green-200 rounded-xl text-sm bg-white focus:border-green-400"/></div>
                      <div><label className="text-xs font-semibold text-gray-600 block mb-1">Title (EN)</label>
                        <input type="text" name={`ingredienttitle${num}_en`} value={formData[`ingredienttitle${num}_en`]} onChange={handleChange}
                          className="w-full px-3 py-2 border border-green-200 rounded-xl text-sm bg-white focus:border-green-400"/></div>
                    </div>
                    {num === 1 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Contenu (FR)</label>
                          <textarea name="ingredientcontent_fr" value={formData.ingredientcontent_fr} onChange={handleChange} rows="3"
                            className="w-full px-3 py-2 border border-green-200 rounded-xl text-sm bg-white resize-none focus:border-green-400"/></div>
                        <div><label className="text-xs font-semibold text-gray-600 block mb-1">Content (EN)</label>
                          <textarea name="ingredientcontent_en" value={formData.ingredientcontent_en} onChange={handleChange} rows="3"
                            className="w-full px-3 py-2 border border-green-200 rounded-xl text-sm bg-white resize-none focus:border-green-400"/></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Images */}
              <div className="mb-6 p-5 bg-orange-50 rounded-2xl border border-orange-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Images
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  L'image principale est aussi utilisée comme visuel de la section Caractéristique.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <ImageUpload name="image"          label="Image principale (+ caractéristique)"/>
                  <ImageUpload name="image_recette1" label="Image recette 1"/>
                  <ImageUpload name="image_recette2" label="Image recette 2"/>
                </div>
              </div>

              {/* Statut */}
              <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 w-fit">
                <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange}
                  className="w-5 h-5 accent-[#FDB71A] cursor-pointer"/>
                <label htmlFor="is_active" className="font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                  {formData.is_active
                    ? <><span className="w-2 h-2 bg-green-500 rounded-full"></span> Produit actif</>
                    : <><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Produit inactif</>}
                </label>
              </div>

              {/* Boutons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button type="submit" disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                  {loading ? <><Loader2 className="animate-spin w-5 h-5"/> Enregistrement...</> : <><Save className="w-5 h-5"/> {editingId ? "Mettre à jour" : "Créer le produit"}</>}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { resetForm(); setShowForm(false); setShowList(true); }}
                    className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all flex items-center gap-2">
                    <X className="w-5 h-5"/> Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* LISTE */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Liste des produits
                <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{products.length}</span>
              </h3>
            </div>
            <div className="p-6 md:p-8">
              {loading ? <div className="text-center py-12"><Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto"/></div>
              : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                  <p className="text-gray-500 font-medium">Aucun produit</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 mb-6">
                    {currentItems.map(product => (
                      <div key={product.id}
                           className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 border-2 border-transparent hover:border-[#FDB71A]/50 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                          <div className="relative w-full md:w-44 h-44 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                            {product.image_url
                              ? <img src={product.image_url} alt={product.title_fr} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                              : <Package className="w-16 h-16 text-gray-200"/>}
                            <div className="absolute top-2 right-2">
                              {product.is_active
                                ? <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow"><Check className="w-3 h-3"/> Actif</span>
                                : <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">Inactif</span>}
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4 className="text-xl font-black text-gray-800 mb-1">{product.title_fr}</h4>
                              <p className="text-sm text-gray-400 italic mb-2">{product.title_en}</p>
                              {product.caracteristique_fr && (
                                <p className="text-xs text-purple-700 font-medium mb-1 line-clamp-1">✦ {product.caracteristique_fr}</p>
                              )}
                              {product.content_fr && <p className="text-gray-600 text-sm line-clamp-2 mb-1">{product.content_fr}</p>}
                              {product.ingredient_fr && <p className="text-xs text-green-700 font-medium mt-1 line-clamp-1">🧂 {product.ingredient_fr}</p>}
                              <div className="flex gap-2 mt-2">
                                {product.image_recette1_url && <img src={product.image_recette1_url} alt="R1" className="w-12 h-12 object-cover rounded-lg border border-gray-200"/>}
                                {product.image_recette2_url && <img src={product.image_recette2_url} alt="R2" className="w-12 h-12 object-cover rounded-lg border border-gray-200"/>}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button onClick={() => setSelectedProduct(product)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow">
                                <Eye size={15}/> Voir
                              </button>
                              <button onClick={() => { handleEdit(product); window.scrollTo({ top:0, behavior:"smooth" }); }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow">
                                <Edit2 size={15}/> Modifier
                              </button>
                              <button onClick={() => handleDelete(product.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow">
                                <Trash2 size={15}/> Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                      <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1} className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                      {[...Array(totalPages)].map((_,i) => (
                        <button key={i} onClick={() => handlePageChange(i+1)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage===i+1 ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                          {i+1}
                        </button>
                      ))}
                      <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages} className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DÉTAIL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
             onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
               onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative flex-shrink-0">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                      onClick={() => setSelectedProduct(null)}><X className="w-5 h-5 text-white"/></button>
              <h2 className="text-2xl font-bold text-white pr-12">{selectedProduct.title_fr}</h2>
              <p className="text-white/80 text-sm mt-1 italic">{selectedProduct.title_en}</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {selectedProduct.image_url && (
                    <img src={selectedProduct.image_url} alt={selectedProduct.title_fr}
                         className="w-full h-64 object-contain rounded-2xl border border-gray-100 bg-gray-50 p-4"/>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProduct.image_recette1_url && (
                      <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Recette 1</p>
                        <img src={selectedProduct.image_recette1_url} alt="R1" className="w-full h-32 object-cover rounded-xl"/></div>
                    )}
                    {selectedProduct.image_recette2_url && (
                      <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Recette 2</p>
                        <img src={selectedProduct.image_recette2_url} alt="R2" className="w-full h-32 object-cover rounded-xl"/></div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedProduct.caracteristique_fr && (
                    <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-400">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase">✦ Caractéristique</p>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedProduct.caracteristique_fr}</p>
                    </div>
                  )}
                  {selectedProduct.content_fr && (
                    <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Description</p>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedProduct.content_fr}</p>
                    </div>
                  )}
                  {selectedProduct.ingredient_fr && (
                    <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase">🧂 Ingrédients</p>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedProduct.ingredient_fr}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200 flex-shrink-0">
              <button onClick={() => { handleEdit(selectedProduct); setSelectedProduct(null); }}
                className="px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg font-semibold flex items-center gap-2">
                <Edit2 className="w-4 h-4"/> Modifier
              </button>
              <button onClick={() => handleDelete(selectedProduct.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold flex items-center gap-2">
                <Trash2 className="w-4 h-4"/> Supprimer
              </button>
              <button onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center gap-2">
                <X className="w-4 h-4"/> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThonProductPost;