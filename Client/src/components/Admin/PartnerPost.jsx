import React, { useEffect, useState } from "react";
import { Factory, Loader2, Trash2, PlusCircle, Edit2, X, ExternalLink } from "lucide-react";
import CONFIG from "../../config/config.js";

/*  
  🎨 PALETTE VIALI :
  - Orange principal : #F47920
  - Orange foncé : #E84E1B
  - Bleu profond : #142B57
*/

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F47920]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          <div className="flex items-center gap-3">
            <div className="bg-[#F47920]/10 p-3 rounded-xl">
              <Factory className="w-7 h-7 text-[#F47920]" />
            </div>
            <h1 className="text-3xl font-black text-[#142B57]">
              Partenaires Industriels & Commerciaux
            </h1>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="bg-gradient-to-r from-[#F47920] to-[#E84E1B] text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 font-semibold"
          >
            <PlusCircle size={18} />
            {showForm ? "Fermer" : "Ajouter un partenaire"}
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-700 border border-green-300 p-4 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-[#142B57] mb-6">
              {editingId ? "Modifier le partenaire" : "Ajouter un partenaire"}
            </h2>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[#142B57] mb-1 block">Nom (FR)</label>
                  <input
                    type="text"
                    name="name_fr"
                    value={formData.name_fr}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#142B57] mb-1 block">Name (EN)</label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#142B57] mb-1 block">Site web</label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="font-semibold text-[#142B57] mb-1 block">Logo du partenaire</label>
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg file:bg-[#F47920] file:text-white file:px-4 file:py-2 file:rounded-lg"
                />
                {preview && (
                  <div className="mt-4">
                    <img src={preview} className="w-40 h-40 object-contain border border-gray-200 rounded-lg bg-white" />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-[#F47920] to-[#E84E1B] text-white px-6 py-3 rounded-xl font-bold"
              >
                {loading ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        )}

        {/* GRID PARTENAIRES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-gray-200 shadow hover:shadow-lg transition rounded-xl p-4 cursor-pointer"
              onClick={() => setSelectedPartner(partner)}
            >
              <div className="w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg mb-3">
                <img
                  src={partner.cover_image_url}
                  alt={partner.name_en}
                  className="w-full h-full object-contain"
                />
              </div>

              <h3 className="font-bold text-[#142B57] text-center">
                {partner.name_en}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                {partner.name_fr}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(partner);
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(partner.id);
                  }}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selectedPartner && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedPartner(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black text-[#142B57]">
                  {selectedPartner.name_en}
                </h2>
                <button className="text-gray-500" onClick={() => setSelectedPartner(null)}>
                  <X size={22} />
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
                <img
                  src={selectedPartner.cover_image_url}
                  alt={selectedPartner.name_en}
                  className="max-h-40 w-full object-contain"
                />
              </div>

              {selectedPartner.website_url && (
                <a
                  href={selectedPartner.website_url}
                  target="_blank"
                  className="flex items-center gap-2 text-[#142B57] font-bold mb-6"
                >
                  <ExternalLink size={18} /> Visiter le site
                </a>
              )}

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg"
                  onClick={() => {
                    handleEdit(selectedPartner);
                    setSelectedPartner(null);
                  }}
                >
                  Modifier
                </button>
                <button
                  className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg"
                  onClick={() => {
                    handleDelete(selectedPartner.id);
                    setSelectedPartner(null);
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerPost;
