import React, { useEffect, useState } from "react";
import { Users, Loader2, Trash2, PlusCircle, Edit2, X, ExternalLink } from "lucide-react";
import CONFIG from "../../config/config.js";

const PartnerPost = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    name_fr: "",
    name_en: "",
    website_url: "",
    cover_image: null,
  });
  const [preview, setPreview] = useState(null);

  // 🔄 Charger tous les partenaires
  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_PARTNER_LIST);
      if (!res.ok) throw new Error("Erreur de chargement des partenaires");
      const data = await res.json();
      setPartners(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des partenaires");
    } finally {
      setFetchLoading(false);
    }
  };

  // 🔼 Upload vers Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  // 📝 Gestion des champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔄 Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name_fr: "",
      name_en: "",
      website_url: "",
      cover_image: null,
    });
    setPreview(null);
    setEditingId(null);
  };

  // ✅ Créer ou Mettre à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      if (formData.cover_image) {
        imageUrl = await uploadToCloudinary(formData.cover_image);
      }

      const payload = {
        name_fr: formData.name_fr,
        name_en: formData.name_en,
        website_url: formData.website_url,
        cover_image: imageUrl,
      };

      const url = editingId ? CONFIG.API_PARTNER_UPDATE(editingId) : CONFIG.API_PARTNER_CREATE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

      setSuccessMessage(editingId ? "Partenaire mis à jour avec succès !" : "Partenaire ajouté avec succès !");
      resetForm();
      fetchPartners();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Supprimer un partenaire
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;

    try {
      const res = await fetch(CONFIG.API_PARTNER_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Partenaire supprimé avec succès !");
      fetchPartners();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // 🔄 Préparer le formulaire pour modification
  const handleEdit = (partner) => {
    setEditingId(partner.id);
    setFormData({
      name_fr: partner.name_fr || "",
      name_en: partner.name_en || "",
      website_url: partner.website_url || "",
      cover_image: null,
    });
    setPreview(partner.cover_image_url || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (fetchLoading) {
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
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              Gestion des Partenaires
            </h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="relative group w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-orange-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 font-semibold">
              <PlusCircle size={18} /> {showForm ? "Fermer" : "Nouveau Partenaire"}
            </div>
          </button>
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

        {/* 🧾 FORMULAIRE */}
        {showForm && (
          <div className="relative mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-[#0f1729]/90 backdrop-blur-xl shadow-2xl p-6 md:p-8 rounded-2xl border-2 border-orange-500/30">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingId ? "✏️ Modifier le partenaire" : "➕ Ajouter un partenaire"}
              </h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-2">Nom (FR) *</label>
                    <input
                      type="text"
                      name="name_fr"
                      value={formData.name_fr}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-300 mb-2">Name (EN) *</label>
                    <input
                      type="text"
                      name="name_en"
                      value={formData.name_en}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-2">🔗 Site web</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-2">🖼️ Logo du partenaire *</label>
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
                    required={!editingId}
                  />
                  {preview && (
                    <div className="mt-4 relative inline-block">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl blur opacity-50"></div>
                      <div className="relative bg-white p-4 rounded-xl">
                        <img src={preview} alt="Aperçu" className="w-full max-w-xs h-32 object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="relative group overflow-hidden flex-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Enregistrement...
                        </>
                      ) : (
                        editingId ? "Mettre à jour" : "Ajouter"
                      )}
                    </div>
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-gray-600/30 border-2 border-gray-500/50 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-600/50 transition-all font-semibold"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🖼️ GRID DES PARTENAIRES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {partners.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">Aucun partenaire pour le moment</p>
            </div>
          ) : (
            partners.map((partner) => (
              <div key={partner.id} className="relative group cursor-pointer" onClick={() => setSelectedPartner(partner)}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50 h-full flex flex-col">
                  {/* Logo */}
                  <div className="relative aspect-square p-4 bg-white/5">
                    {partner.cover_image_url ? (
                      <img
                        src={partner.cover_image_url}
                        alt={partner.name_en}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <Users size={48} className="text-white/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Contenu */}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors text-center">
                      {partner.name_en}
                    </h3>
                    {partner.name_fr && partner.name_fr !== partner.name_en && (
                      <p className="text-xs text-gray-400 line-clamp-1 text-center mb-2">
                        {partner.name_fr}
                      </p>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-1 mt-auto pt-2 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(partner);
                        }}
                        className="flex-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 px-2 py-1.5 rounded-lg hover:bg-blue-500/30 transition-all text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(partner.id);
                        }}
                        className="flex-1 bg-red-500/20 border border-red-500/50 text-red-300 px-2 py-1.5 rounded-lg hover:bg-red-500/30 transition-all text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔍 MODAL DÉTAILS */}
        {selectedPartner && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedPartner(null)}
          >
            <div 
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-[#0a0e27] rounded-3xl shadow-2xl border-2 border-orange-500/30 overflow-hidden">
                {/* Logo grande taille */}
                <div className="relative bg-white p-12">
                  {selectedPartner.cover_image_url ? (
                    <img
                      src={selectedPartner.cover_image_url}
                      alt={selectedPartner.name_en}
                      className="w-full max-h-64 object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                      <Users size={96} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Contenu */}
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                        {selectedPartner.name_en}
                      </h2>
                      {selectedPartner.name_fr && selectedPartner.name_fr !== selectedPartner.name_en && (
                        <p className="text-lg text-orange-400 font-semibold">
                          🇫🇷 {selectedPartner.name_fr}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Lien site web */}
                  {selectedPartner.website_url && (
                    <div className="bg-white/5 p-4 rounded-xl border border-blue-500/30 mb-6">
                      <p className="text-xs font-bold text-blue-400 mb-2">🌐 SITE WEB</p>
                      <a
                        href={selectedPartner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-2 break-all"
                      >
                        {selectedPartner.website_url}
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {selectedPartner.website_url && (
                      <a
                        href={selectedPartner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-green-500/50 transition-all font-bold flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={18} /> Visiter le site
                      </a>
                    )}
                    <button
                      onClick={() => {
                        handleEdit(selectedPartner);
                        setSelectedPartner(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      <Edit2 size={18} /> Modifier
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedPartner.id);
                        setSelectedPartner(null);
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
      </div>
    </div>
  );
};

export default PartnerPost;