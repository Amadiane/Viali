import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Search, Eye, Edit2, Trash2, X, Loader2, RefreshCw, PlusCircle,
  ChevronLeft, ChevronRight, Save, Image as ImageIcon, Handshake, Globe
} from "lucide-react";

// ══════════════════════════════════════════════════════
//  ONGLET PARTENAIRES RECHERCHE
// ══════════════════════════════════════════════════════
const PartnersTab = () => {
  const [partners, setPartners]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);
  const [preview, setPreview]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = { name: "", website_url: "", is_active: true, cover_image: null };
  const [form, setForm] = useState(emptyForm);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/`);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : data.results || []);
    } catch { setError("Erreur chargement partenaires"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchPartners(); }, []);

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setForm(p => ({ ...p, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setForm(p => ({ ...p, [name]: checked }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      let cover_image = form.cover_image;
      if (cover_image && typeof cover_image !== "string") {
        cover_image = await uploadToCloudinary(cover_image);
      }
      const payload = { name: form.name, website_url: form.website_url, is_active: form.is_active, cover_image };
      const method  = editingId ? "PATCH" : "POST";
      const url     = editingId
        ? `${CONFIG.BASE_URL}/api/recherche-partners/${editingId}/`
        : `${CONFIG.BASE_URL}/api/recherche-partners/`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSuccess(editingId ? "Partenaire mis à jour !" : "Partenaire ajouté !");
      setForm(emptyForm); setPreview(null); setEditingId(null); setShowForm(false);
      await fetchPartners();
    } catch { setError("Erreur lors de la sauvegarde"); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, website_url: p.website_url || "", is_active: p.is_active, cover_image: p.cover_image_url || null });
    setPreview(p.cover_image_url || null);
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/${id}/`, { method: "DELETE" });
      setSuccess("Partenaire supprimé !");
      await fetchPartners();
    } catch { setError("Erreur suppression"); }
  };

  const toggleActive = async (p) => {
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/${p.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      await fetchPartners();
    } catch { setError("Erreur mise à jour statut"); }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-2xl flex items-center justify-center shadow-lg">
            <Handshake className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Partenaires Recherche</h2>
            <p className="text-sm text-gray-500">Partenaires affichés uniquement sur la page R&D</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPartners}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all">
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
          <button onClick={() => { setShowForm(!showForm); if (!showForm) { setForm(emptyForm); setPreview(null); setEditingId(null); } }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            {showForm ? <><X className="w-4 h-4" /> Fermer</> : <><PlusCircle className="w-4 h-4" /> Ajouter</>}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error   && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium flex justify-between"><span>{error}</span><button onClick={() => setError(null)}><X size={16}/></button></div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium flex justify-between"><span>{success}</span><button onClick={() => setSuccess(null)}><X size={16}/></button></div>}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-1 h-7 bg-gradient-to-b from-[#FDB71A] to-[#F47920] rounded-full"></div>
            <h3 className="text-xl font-black text-gray-900">{editingId ? "Modifier le partenaire" : "Nouveau partenaire"}</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nom */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nom du partenaire *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Ex: Google, ONU, Banque Mondiale..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all font-medium" />
              </div>
              {/* Website */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Globe className="w-4 h-4"/> Site web</label>
                <input type="url" name="website_url" value={form.website_url} onChange={handleChange}
                  placeholder="https://exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all font-medium" />
              </div>
            </div>

            {/* Logo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Logo / Image</label>
              <input type="file" name="cover_image" accept="image/*" onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer" />
              {preview && (
                <div className="mt-3 flex justify-center">
                  <div className="w-40 h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-center">
                    <img src={preview} alt="preview" className="w-full h-full object-contain rounded-lg" />
                  </div>
                </div>
              )}
            </div>

            {/* Statut */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange}
                className="w-5 h-5 accent-orange-500 cursor-pointer" />
              <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">
                Actif — visible sur la page Recherche & Développement
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Enregistrement...</> : <><Save className="w-4 h-4"/> {editingId ? "Mettre à jour" : "Ajouter"}</>}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setForm(emptyForm); setPreview(null); setEditingId(null); setShowForm(false); }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400 transition-all">
                  <X className="w-4 h-4"/> Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Liste partenaires */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
            Liste
            <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{partners.length}</span>
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center"><Loader2 className="w-10 h-10 text-[#F47920] animate-spin mx-auto"/></div>
        ) : partners.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Handshake className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            <p className="font-semibold">Aucun partenaire pour le moment</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {partners.map(p => (
              <div key={p.id} className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all overflow-hidden">
                {/* Logo */}
                <div className="h-28 bg-white flex items-center justify-center p-4 border-b border-gray-100">
                  {p.cover_image_url
                    ? <img src={p.cover_image_url} alt={p.name} className="w-full h-full object-contain"/>
                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                        <Handshake className="w-10 h-10 text-gray-300"/>
                      </div>
                  }
                </div>
                {/* Infos */}
                <div className="p-4">
                  <p className="font-black text-gray-900 truncate mb-1">{p.name}</p>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-orange-500 hover:underline truncate block mb-2">{p.website_url}</a>
                  )}
                  {/* Statut */}
                  <button onClick={() => toggleActive(p)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      p.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-green-500" : "bg-gray-400"}`}></span>
                    {p.is_active ? "Actif" : "Inactif"}
                  </button>
                </div>
                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={() => handleEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">
                    <Edit2 size={13}/> Modifier
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">
                    <Trash2 size={13}/> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL avec onglets
// ══════════════════════════════════════════════════════
const ProfessionalAreaPost = () => {
  const [activeTab, setActiveTab] = useState("recherche"); // "recherche" | "partners"
  const [recherches, setRecherches]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]               = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedRecherche, setSelectedRecherche] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [showList, setShowList]   = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [previews, setPreviews]   = useState({});

  const [formData, setFormData] = useState({
    title1_fr:"", title2_fr:"", title3_fr:"", title4_fr:"", title5_fr:"",
    title1_en:"", title2_en:"", title3_en:"", title4_en:"", title5_en:"",
    content1_fr:"", content2_fr:"", content3_fr:"", content4_fr:"", content5_fr:"",
    content1_en:"", content2_en:"", content3_en:"", content4_en:"", content5_en:"",
    image_1:null, image_2:null, image_3:null, image_4:null, image_5:null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRecherches = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${CONFIG.BASE_URL}/api/recherche/`);
      const data = await res.json();
      setRecherches(data.results || data);
    } catch { setError("Erreur lors du chargement"); }
    finally { setLoading(false); setFetchLoading(false); }
  };

  useEffect(() => { fetchRecherches(); }, []);

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method:"POST", body:fd });
      const data = await res.json();
      return data.secure_url;
    } catch { return null; }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(p => ({ ...p, [name]: files[0] }));
      setPreviews(p => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      title1_fr:"", title2_fr:"", title3_fr:"", title4_fr:"", title5_fr:"",
      title1_en:"", title2_en:"", title3_en:"", title4_en:"", title5_en:"",
      content1_fr:"", content2_fr:"", content3_fr:"", content4_fr:"", content5_fr:"",
      content1_en:"", content2_en:"", content3_en:"", content4_en:"", content5_en:"",
      image_1:null, image_2:null, image_3:null, image_4:null, image_5:null,
    });
    setPreviews({}); setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccessMessage(null);
    try {
      const imageUploads = {};
      for (let i = 1; i <= 5; i++) {
        const k = `image_${i}`;
        if (formData[k] && typeof formData[k] !== "string") imageUploads[k] = await uploadToCloudinary(formData[k]);
        else if (typeof formData[k] === "string") imageUploads[k] = formData[k];
      }
      const payload = { ...formData, ...imageUploads };
      const method  = editingId ? "PATCH" : "POST";
      const url     = editingId ? `${CONFIG.BASE_URL}/api/recherche/${editingId}/` : `${CONFIG.BASE_URL}/api/recherche/`;
      const res = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setSuccessMessage(editingId ? "Recherche mise à jour !" : "Recherche ajoutée !");
      resetForm(); await fetchRecherches(); setShowForm(false); setShowList(true);
      window.scrollTo({ top:0, behavior:"smooth" });
    } catch { setError("Erreur lors de la sauvegarde"); }
    finally { setLoading(false); }
  };

  const handleEdit = (r) => {
    setFormData({
      title1_fr:r.title1_fr||"", title2_fr:r.title2_fr||"", title3_fr:r.title3_fr||"", title4_fr:r.title4_fr||"", title5_fr:r.title5_fr||"",
      title1_en:r.title1_en||"", title2_en:r.title2_en||"", title3_en:r.title3_en||"", title4_en:r.title4_en||"", title5_en:r.title5_en||"",
      content1_fr:r.content1_fr||"", content2_fr:r.content2_fr||"", content3_fr:r.content3_fr||"", content4_fr:r.content4_fr||"", content5_fr:r.content5_fr||"",
      content1_en:r.content1_en||"", content2_en:r.content2_en||"", content3_en:r.content3_en||"", content4_en:r.content4_en||"", content5_en:r.content5_en||"",
      image_1:r.image_1_url||r.image_1, image_2:r.image_2_url||r.image_2,
      image_3:r.image_3_url||r.image_3, image_4:r.image_4_url||r.image_4, image_5:r.image_5_url||r.image_5,
    });
    setPreviews({ image_1:r.image_1_url||r.image_1, image_2:r.image_2_url||r.image_2, image_3:r.image_3_url||r.image_3, image_4:r.image_4_url||r.image_4, image_5:r.image_5_url||r.image_5 });
    setEditingId(r.id); setShowForm(true); setShowList(false);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const deleteRecherche = async (id) => {
    if (!window.confirm("Supprimer cette recherche ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche/${id}/`, { method:"DELETE" });
      setSuccessMessage("Recherche supprimée !"); await fetchRecherches(); setSelectedRecherche(null);
    } catch { setError("Erreur suppression"); }
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = recherches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(recherches.length / itemsPerPage);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4"/>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FDB71A] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                <Search className="text-white w-7 h-7"/>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Espace Professionnel</h1>
                <p className="text-gray-500 font-medium mt-1">Gestion du contenu R&D et des partenaires</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ONGLETS ── */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
          {[
            { key: "recherche", label: "Contenu R&D",     icon: <Search className="w-4 h-4"/> },
            { key: "partners",  label: "Partenaires R&D", icon: <Handshake className="w-4 h-4"/> },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── MESSAGES ── */}
        {error          && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 font-medium flex justify-between"><span>{error}</span><button onClick={()=>setError(null)}><X size={16}/></button></div>}
        {successMessage && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-green-700 font-medium flex justify-between"><span>{successMessage}</span><button onClick={()=>setSuccessMessage(null)}><X size={16}/></button></div>}

        {/* ── ONGLET PARTENAIRES ── */}
        {activeTab === "partners" && <PartnersTab />}

        {/* ── ONGLET RECHERCHE ── */}
        {activeTab === "recherche" && (
          <>
            {/* Boutons */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <button onClick={fetchRecherches} disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all disabled:opacity-50">
                <RefreshCw className={`w-5 h-5 ${loading?"animate-spin":""}`}/> Actualiser
              </button>
              <button onClick={() => { setShowForm(!showForm); if (!showForm) { resetForm(); setShowList(false); } else { setShowList(true); } }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                {showForm ? <><X className="w-5 h-5"/> Fermer</> : <><PlusCircle className="w-5 h-5"/> Nouvelle Recherche</>}
              </button>
            </div>

            {/* Formulaire Recherche */}
            {showForm && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">{editingId ? "Modifier la recherche" : "Nouvelle recherche"}</h3>
                  </div>

                  {[1,2,3,4,5].map(num => (
                    <div key={num} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg flex items-center justify-center font-black">{num}</span>
                        Section {num}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Titre (FR)</label>
                          <input type="text" name={`title${num}_fr`} value={formData[`title${num}_fr`]} onChange={handleChange}
                            placeholder={`Titre section ${num}`} maxLength={30}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Title (EN)</label>
                          <input type="text" name={`title${num}_en`} value={formData[`title${num}_en`]} onChange={handleChange}
                            placeholder={`Section ${num} title`} maxLength={30}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Contenu (FR)</label>
                          <textarea name={`content${num}_fr`} value={formData[`content${num}_fr`]} onChange={handleChange} rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Content (EN)</label>
                          <textarea name={`content${num}_en`} value={formData[`content${num}_en`]} onChange={handleChange} rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="font-semibold text-gray-700 text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4 text-[#E84E1B]"/> Image {num}</label>
                        <input type="file" name={`image_${num}`} accept="image/*" onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer"/>
                        {previews[`image_${num}`] && (
                          <div className="flex justify-center mt-4">
                            <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-lg w-48 h-48">
                              <img src={previews[`image_${num}`]} alt={`Aperçu ${num}`} className="w-full h-full object-contain rounded-xl"/>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    <button type="submit" disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                      {loading ? <><Loader2 className="animate-spin w-5 h-5"/> Enregistrement...</> : <><Save className="w-5 h-5"/> {editingId ? "Mettre à jour" : "Créer"}</>}
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

            {/* Liste Recherches */}
            {showList && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Liste des recherches
                    <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{recherches.length}</span>
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12"><Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto"/></div>
                  ) : recherches.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                      <p className="font-semibold">Aucune recherche</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 mb-6">
                        {currentItems.map(r => (
                          <div key={r.id} className="group bg-white/60 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#FDB71A]/50 transition-all p-6">
                            <h4 className="text-xl font-black text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:to-[#FDB71A] transition-all">
                              Recherche #{r.id}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                              {[1,2,3,4,5].map(num => r[`title${num}_fr`] && (
                                <div key={num} className="text-sm">
                                  <span className="font-semibold text-gray-500">Section {num}:</span>
                                  <p className="text-gray-800 font-medium truncate">{r[`title${num}_fr`]}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                              <button onClick={() => setSelectedRecherche(r)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all">
                                <Eye size={15}/> Voir
                              </button>
                              <button onClick={() => handleEdit(r)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all">
                                <Edit2 size={15}/> Modifier
                              </button>
                              <button onClick={() => deleteRecherche(r.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all">
                                <Trash2 size={15}/> Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                          <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage===1}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                          {[...Array(totalPages)].map((_,i) => (
                            <button key={i} onClick={() => setCurrentPage(i+1)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage===i+1 ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                              {i+1}
                            </button>
                          ))}
                          <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage===totalPages}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL DÉTAIL */}
      {selectedRecherche && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
             onClick={() => setSelectedRecherche(null)}>
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
               onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                      onClick={() => setSelectedRecherche(null)}><X className="w-5 h-5 text-white"/></button>
              <h2 className="text-2xl font-bold text-white pr-12">Recherche #{selectedRecherche.id}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {[1,2,3,4,5].map(num => (
                <div key={num} className="bg-gray-50 p-6 rounded-2xl mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg flex items-center justify-center font-black">{num}</span>
                    Section {num}
                  </h3>
                  {selectedRecherche[`title${num}_fr`] && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm font-semibold text-gray-500 mb-1">Titre (FR)</p><p className="font-bold">{selectedRecherche[`title${num}_fr`]}</p></div>
                      {selectedRecherche[`title${num}_en`] && <div><p className="text-sm font-semibold text-gray-500 mb-1">Title (EN)</p><p className="font-bold">{selectedRecherche[`title${num}_en`]}</p></div>}
                    </div>
                  )}
                  {selectedRecherche[`content${num}_fr`] && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm font-semibold text-gray-500 mb-1">Contenu (FR)</p><p className="text-sm leading-relaxed">{selectedRecherche[`content${num}_fr`]}</p></div>
                      {selectedRecherche[`content${num}_en`] && <div><p className="text-sm font-semibold text-gray-500 mb-1">Content (EN)</p><p className="text-sm leading-relaxed">{selectedRecherche[`content${num}_en`]}</p></div>}
                    </div>
                  )}
                  {(selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]) && (
                    <img src={selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]} alt={`Section ${num}`}
                         className="w-full max-w-2xl h-auto max-h-[400px] object-contain rounded-xl mx-auto border border-gray-200 p-4 bg-white"
                         onError={e => { e.target.style.display="none"; }}/>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button onClick={() => { handleEdit(selectedRecherche); setSelectedRecherche(null); }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold hover:scale-105 transition-all">
                <Edit2 className="w-5 h-5"/> Modifier
              </button>
              <button onClick={() => setSelectedRecherche(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                <X className="w-4 h-4"/> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAreaPost;