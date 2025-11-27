import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Users,
  Loader2,
  Trash2,
  PlusCircle,
  Edit2,
  X,
  UserCircle,
  Sparkles,
  Save,
  RefreshCw,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Mail,
  Linkedin,
  Briefcase
} from "lucide-react";

const TeamPost = () => {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    position_fr: "",
    position_en: "",
    bio_fr: "",
    bio_en: "",
    photo: null,
    email: "",
    linkedin: "",
    is_active: true,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // -----------------------------
  // FETCH MEMBERS
  // -----------------------------
  const fetchMembres = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CONFIG.API_TEAM_LIST}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setMembres(data.results || data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des membres");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchMembres();
  }, []);

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  // -----------------------------
  // HANDLE CHANGE
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------
  const resetForm = () => {
    setFormData({
      full_name: "",
      position_fr: "",
      position_en: "",
      bio_fr: "",
      bio_en: "",
      photo: null,
      email: "",
      linkedin: "",
      is_active: true,
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
      if (formData.photo && typeof formData.photo !== "string") {
        imageUrl = await uploadToCloudinary(formData.photo);
      } else if (typeof formData.photo === "string") {
        imageUrl = formData.photo;
      }

      const payload = {
        ...formData,
        photo: imageUrl,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? CONFIG.API_TEAM_UPDATE(editingId)
        : CONFIG.API_TEAM_CREATE;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      const saved = await response.json();

      setSuccessMessage(editingId ? "Membre mis à jour avec succès !" : "Membre ajouté avec succès !");
      resetForm();
      await fetchMembres();
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
  // EDIT MEMBER
  // -----------------------------
  const handleEdit = (membre) => {
    setFormData({
      ...membre,
      photo: membre.photo_url,
    });
    setPreview(membre.photo_url);
    setEditingId(membre.id);
    setShowForm(true);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // DELETE MEMBER
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      await fetch(CONFIG.API_TEAM_DELETE(id), { method: "DELETE" });
      setSuccessMessage("Membre supprimé avec succès !");
      await fetchMembres();
      setSelectedMember(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // -----------------------------
  // PAGINATION LOGIC
  // -----------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = membres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(membres.length / itemsPerPage);

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
        <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des membres...</p>
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
                    <Users className="text-white w-8 h-8" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                      Gestion de l'Équipe
                    </span>
                  </h1>
                  <p className="text-gray-600 font-medium mt-1">Associés & Membres</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    fetchMembres();
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
                      Nouveau Membre
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
                        Modifier le membre
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserCircle className="w-6 h-6 text-[#FDB71A]" />
                        Nouveau membre
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Grille des champs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Ex: Jean Dupont"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#F47920]" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#FDB71A]" />
                    Poste (FR)
                  </label>
                  <input
                    type="text"
                    name="position_fr"
                    value={formData.position_fr}
                    onChange={handleChange}
                    placeholder="Ex: Directeur Général"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#F47920]" />
                    Position (EN)
                  </label>
                  <input
                    type="text"
                    name="position_en"
                    value={formData.position_en}
                    onChange={handleChange}
                    placeholder="Ex: Chief Executive Officer"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                  />
                </div>
              </div>

              {/* Biographies */}
              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                    Biographie (FR)
                  </label>
                  <textarea
                    name="bio_fr"
                    value={formData.bio_fr}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Décrivez le parcours du membre..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F47920] rounded-full"></span>
                    Biography (EN)
                  </label>
                  <textarea
                    name="bio_en"
                    value={formData.bio_en}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the member's background..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white/50 backdrop-blur-sm font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              {/* LinkedIn et Photo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#E84E1B]" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#E84E1B] focus:ring-2 focus:ring-[#E84E1B]/20 transition-all bg-white/50 backdrop-blur-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                    Statut
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-5 h-5 rounded accent-[#FDB71A] cursor-pointer"
                    />
                    <label htmlFor="is_active" className="font-bold text-gray-700 cursor-pointer flex items-center gap-2">
                      {formData.is_active ? (
                        <>
                          <span className="w-2 h-2 bg-[#FDB71A] rounded-full animate-pulse"></span>
                          Membre actif
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Membre inactif
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Photo upload */}
              <div className="mb-6 space-y-3">
                <label className="font-bold text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#E84E1B]" />
                  Photo du membre *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="photo"
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
                      {editingId ? "Mettre à jour" : "Créer le membre"}
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
                    Liste des membres
                  </h3>
                  <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-4 py-1 rounded-full font-bold text-sm">
                    {membres.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Contenu de la liste */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chargement des membres...</p>
                </div>
              ) : membres.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FDB71A]/20 to-[#E84E1B]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-[#F47920]" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">Aucun membre pour le moment</p>
                  <p className="text-gray-400 text-sm mt-2">Créez votre premier membre</p>
                </div>
              ) : (
                <>
                  {/* Grille des membres - Style NewsPost */}
                  <div className="grid gap-6 mb-6">
                    {currentItems.map((membre) => (
                      <div
                        key={membre.id}
                        className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50"
                      >
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                          {/* Photo */}
                          <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300 flex items-center justify-center">
                              {membre.photo_url ? (
                                <img
                                  src={membre.photo_url}
                                  alt={membre.full_name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              ) : (
                                <UserCircle className="w-24 h-24 text-gray-300" />
                              )}
                            </div>
                            {/* Badge actif */}
                            <div className="absolute top-2 right-2">
                              {membre.is_active ? (
                                <span className="bg-[#FDB71A] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                  Actif
                                </span>
                              ) : (
                                <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                  Inactif
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xl font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                                {membre.full_name}
                              </h4>
                              <p className="text-gray-600 text-sm font-medium mb-2">
                                {membre.position_fr || membre.position_en}
                              </p>
                              {membre.bio_fr && (
                                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-2">
                                  {membre.bio_fr}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 text-xs">
                                {membre.email && (
                                  <span className="flex items-center gap-1 text-gray-500">
                                    <Mail className="w-3 h-3" />
                                    {membre.email}
                                  </span>
                                )}
                                {membre.linkedin && (
                                  <a
                                    href={membre.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-[#F47920] hover:text-[#E84E1B] transition-colors"
                                  >
                                    <Linkedin className="w-3 h-3" />
                                    LinkedIn
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMember(membre);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                              >
                                <Eye size={16} />
                                Voir
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(membre);
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
                                  handleDelete(membre.id);
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
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="relative bg-white/90 backdrop-blur-xl w-full max-w-3xl rounded-3xl shadow-2xl shadow-orange-400/40 overflow-hidden border-2 border-[#FDB71A]/30 animate-in zoom-in duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête du modal */}
            <div className="relative bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMember(null);
                }}
              >
                <X size={24} className="text-white" />
              </button>

              <h2 className="text-3xl font-black text-white pr-12 drop-shadow-lg">
                {selectedMember.full_name}
              </h2>

              <p className="text-white/80 font-medium mt-2">
                {selectedMember.position_fr || selectedMember.position_en}
              </p>
            </div>

            {/* Contenu du modal - scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Photo du membre */}
              {selectedMember.photo_url && (
                <div className="relative w-full h-80 mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={selectedMember.photo_url}
                    className="w-full h-full object-cover"
                    alt={selectedMember.full_name}
                  />
                </div>
              )}

              <div className="space-y-4">
                {/* Bio FR */}
                {selectedMember.bio_fr && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-l-4 border-[#FDB71A]">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FDB71A] rounded-full"></span>
                      Biographie
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMember.bio_fr}
                    </p>
                  </div>
                )}

                {/* Bio EN */}
                {selectedMember.bio_en && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border-l-4 border-[#F47920]">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#F47920] rounded-full"></span>
                      Biography
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMember.bio_en}
                    </p>
                  </div>
                )}

                {/* Contact info */}
                <div className="flex flex-wrap gap-3">
                  {selectedMember.email && (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedMember.email}
                    </a>
                  )}
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#F47920] rounded-xl font-medium hover:bg-orange-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions du modal */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-6 flex flex-wrap justify-end gap-3 border-t-2 border-gray-200">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(selectedMember);
                  setSelectedMember(null);
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
                  handleDelete(selectedMember.id);
                }}
              >
                <Trash2 className="w-5 h-5" />
                Supprimer
              </button>

              <button
                className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:scale-105 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMember(null);
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

export default TeamPost;