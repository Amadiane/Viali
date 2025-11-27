import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Building2,
  Loader2,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  Sparkles,
  Save,
  RefreshCw,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Target
} from "lucide-react";

const ProfessionalAreaPost = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name_fr: "",
    name_en: "",
    description_fr: "",
    description_en: "",
    image: null,
    target_group: "companies",
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mapping des groupes cibles
  const TARGET_GROUPS = {
    companies: "Entreprises / Projet R&D",
    points_of_sale: "Points de vente (Superette, Boutique, Grande surface)",
    distributors: "Distributeurs (Grossiste)"
  };

  // -----------------------------
  // FETCH AREAS
  // -----------------------------
  const fetchAreas = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_PRO_AREA_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des zones professionnelles");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
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

  // -----------------------------
  // HANDLE CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------
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
  };

  // -----------------------------
  // SUBMIT FORM
  // -----------------------------
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

      setSuccessMessage(editingId ? "Zone professionnelle mise à jour avec succès !" : "Zone professionnelle ajoutée avec succès !");
      resetForm();
      await fetchAreas();
      setShowForm(false);
      setShowList(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE AREA
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette zone professionnelle ?")) return;

    try {
      const res = await fetch(CONFIG.API_PRO_AREA_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur API");
      setSuccessMessage("Zone professionnelle supprimée avec succès !");
      await fetchAreas();
      setSelectedArea(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // -----------------------------
  // EDIT AREA
  // -----------------------------
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
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // PAGINATION LOGIC
  // -----------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = areas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(areas.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des zones professionnelles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER AVEC DESIGN VIALI */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-20 blur-3xl rounded-3xl"></div>
          
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-400/30 p-6 md:p-8 border-2 border-[#FDB71A]/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FDB71A] to-[#E84E1B] opacity-30 blur-xl rounded-2xl animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="text-white w-8 h-8" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                      Zones Professionnelles
                    </span>
                  </h1>
                  <p className="text-gray-600 font-medium mt-1">Secteurs d'activité & Domaines</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    fetchAreas();
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-xl text-[#F47920] font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>

                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) {
                      resetForm();
                      setShowList(false);
                    } else {
                      setShowList(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-400/50"
                >
                  {showForm ? (
                    <>
                      <X className="w-5 h-5" />
                      Fermer
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Nouvelle Zone
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="relative bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300">
            <div className="flex-1 text-red-700 font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="relative bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300">
            <div className="flex-1 text-green-700 font-medium">{successMessage}</div>
            <button onClick={() => setSuccessMessage(null)} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* FORMULAIRE AVEC ANIMATION */}
        {showForm && (
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-400/20 p-6 md:p-8 mb-10 border-2 border-[#FDB71A]/30 animate-in slide-in-from-top duration-500">
            <form onSubmit={handleSubmit}>
              {/* Badge du titre */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {editingId ? (
                      <span className="flex items-center gap-2">
                        <Edit2 className="w-6 h-6 text-[#F47920]" />
                        Modifier la zone professionnelle
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-[#FDB71A]" />
                        Nouvelle zone professionnelle
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Grille des champs - Noms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                    Nom (FR) *
                  </label>
                  <input
                    type="text"
                    name="name_fr"
                    value={formData.name_fr}
                    onChange={handleChange}
                    placeholder="Ex: Industrie Automobile"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F47920] rounded-full"></span>
                    Name (EN) *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="Ex: Automotive Industry"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                    Description (FR) *
                  </label>
                  <textarea
                    name="description_fr"
                    value={formData.description_fr}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Décrivez la zone professionnelle en français..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none"
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F47920] rounded-full"></span>
                    Description (EN) *
                  </label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe the professional area in English..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Image et Groupe cible */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Upload image */}
                <div className="space-y-3">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#E84E1B]" />
                    Image de la zone
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-dashed border-[#FDB71A] rounded-xl bg-white/50 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer"
                    />
                  </div>
                  {preview && (
                    <div className="flex justify-center mt-4">
                      <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg w-48 h-48">
                        <img
                          src={preview}
                          alt="Aperçu"
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute top-2 right-2">
                          <Sparkles className="w-5 h-5 text-[#F47920]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Groupe cible */}
                <div className="space-y-3">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#E84E1B]" />
                    Groupe cible *
                  </label>
                  <select
                    name="target_group"
                    value={formData.target_group}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#E84E1B] focus:ring-2 focus:ring-[#E84E1B]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                    required
                  >
                    <option value="companies">Entreprises / Projet R&D</option>
                    <option value="points_of_sale">Points de vente (Superette, Boutique, Grande surface)</option>
                    <option value="distributors">Distributeurs (Grossiste)</option>
                  </select>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative group px-8 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-bold shadow-lg shadow-orange-400/50 hover:scale-105 hover:shadow-xl hover:shadow-orange-400/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? "Mettre à jour" : "Créer la zone"}
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                      setShowList(true);
                    }}
                    className="px-8 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* SECTION LISTE */}
        {showList && (
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-orange-400/20 border-2 border-[#FDB71A]/30 overflow-hidden animate-in slide-in-from-bottom duration-500">
            {/* En-tête de section */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <List className="w-6 h-6 text-[#F47920]" />
                    Liste des zones professionnelles
                  </h3>
                  <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-4 py-1 rounded-full font-bold text-sm">
                    {areas.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Contenu de la liste */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chargement des zones...</p>
                </div>
              ) : areas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FDB71A]/20 to-[#E84E1B]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-10 h-10 text-[#F47920]" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">Aucune zone professionnelle pour le moment</p>
                  <p className="text-gray-400 text-sm mt-2">Créez votre première zone</p>
                </div>
              ) : (
                <>
                  {/* Grille des zones - Style NewsPost */}
                  <div className="grid gap-6 mb-6">
                    {currentItems.map((area) => (
                      <div
                        key={area.id}
                        className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50"
                      >
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                          {/* Image */}
                          {area.image_url && (
                            <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
                              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300">
                                <img
                                  src={area.image_url}
                                  alt={area.name_en}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                            </div>
                          )}

                          {/* Contenu */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xl font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                                {area.name_fr}
                              </h4>
                              <p className="text-gray-600 text-sm font-medium mb-2">
                                {area.name_en}
                              </p>
                              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-2">
                                {area.description_fr}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Target className="w-4 h-4 text-[#F47920]" />
                                <span className="text-xs font-medium text-[#F47920] bg-orange-50 px-3 py-1 rounded-full">
                                  {TARGET_GROUPS[area.target_group]}
                                </span>
                              </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedArea(area);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <Eye size={16} />
                                Voir
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(area);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <Edit2 size={16} />
                                Modifier
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(area.id);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <Trash2 size={16} />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6 border-t-2 border-gray-200">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-xl text-[#F47920] font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/50"
                                : "bg-white/70 backdrop-blur-md border-2 border-gray-200 text-gray-700 hover:scale-105"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-white/70 backdrop-blur-md border-2 border-[#FDB71A] rounded-xl text-[#F47920] font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL AVEC DESIGN MODERNE */}
      {selectedArea && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedArea(null)}
        >
          <div 
            className="relative bg-white/90 backdrop-blur-xl w-full max-w-4xl rounded-3xl shadow-2xl shadow-orange-400/40 overflow-hidden border-2 border-[#FDB71A]/30 animate-in zoom-in duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête du modal */}
            <div className="relative bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedArea(null);
                }}
              >
                <X size={24} className="text-white" />
              </button>

              <h2 className="text-3xl font-black text-white pr-12 drop-shadow-lg">
                {selectedArea.name_fr}
              </h2>

              {selectedArea.name_en && (
                <p className="text-white/80 font-medium mt-2 italic">
                  {selectedArea.name_en}
                </p>
              )}
            </div>

            {/* Contenu du modal - scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {selectedArea.image_url && (
                <div className="relative w-full h-80 mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={selectedArea.image_url}
                    className="w-full h-full object-cover"
                    alt={selectedArea.name_en}
                  />
                </div>
              )}

              {/* Groupe cible */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-500 mb-4">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Groupe cible
                </h3>
                <p className="text-gray-700 font-medium">
                  {TARGET_GROUPS[selectedArea.target_group]}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-l-4 border-[#FDB71A]">
                  <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                    Description (Français)
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedArea.description_fr}
                  </p>
                </div>

                {selectedArea.description_en && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border-l-4 border-[#F47920]">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#F47920] rounded-full"></span>
                      Description (English)
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedArea.description_en}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions du modal */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-6 flex flex-wrap justify-end gap-3 border-t-2 border-gray-200">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(selectedArea);
                  setSelectedArea(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Edit2 className="w-5 h-5" />
                Modifier
              </button>

              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(selectedArea.id);
                }}
              >
                <Trash2 className="w-5 h-5" />
                Supprimer
              </button>

              <button
                className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedArea(null);
                }}
              >
                <X className="w-5 h-5" />
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAreaPost;