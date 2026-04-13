import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  Image as ImageIcon,
  FileText
} from "lucide-react";

const ProfessionalAreaPost = () => {
  const [recherches, setRecherches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedRecherche, setSelectedRecherche] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [previews, setPreviews] = useState({});

  const [formData, setFormData] = useState({
    title1_fr: "",
    title2_fr: "",
    title3_fr: "",
    title4_fr: "",
    title5_fr: "",
    title1_en: "",
    title2_en: "",
    title3_en: "",
    title4_en: "",
    title5_en: "",
    content1_fr: "",
    content2_fr: "",
    content3_fr: "",
    content4_fr: "",
    content5_fr: "",
    content1_en: "",
    content2_en: "",
    content3_en: "",
    content4_en: "",
    content5_en: "",
    image_1: null,
    image_2: null,
    image_3: null,
    image_4: null,
    image_5: null,
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FETCH RECHERCHES
  const fetchRecherches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/recherche/`);
      const data = await res.json();
      console.log("📦 Recherche data:", data);
      setRecherches(data.results || data);
    } catch (error) {
      console.error("Erreur fetch recherches:", error);
      setError("Erreur lors du chargement des recherches");
    } finally {
      setLoading(false);
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRecherches();
  }, []);

  // CLOUDINARY UPLOAD
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

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      title1_fr: "",
      title2_fr: "",
      title3_fr: "",
      title4_fr: "",
      title5_fr: "",
      title1_en: "",
      title2_en: "",
      title3_en: "",
      title4_en: "",
      title5_en: "",
      content1_fr: "",
      content2_fr: "",
      content3_fr: "",
      content4_fr: "",
      content5_fr: "",
      content1_en: "",
      content2_en: "",
      content3_en: "",
      content4_en: "",
      content5_en: "",
      image_1: null,
      image_2: null,
      image_3: null,
      image_4: null,
      image_5: null,
    });
    setPreviews({});
    setEditingId(null);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Upload images
      const imageUploads = {};
      for (let i = 1; i <= 5; i++) {
        const imageKey = `image_${i}`;
        if (formData[imageKey] && typeof formData[imageKey] !== "string") {
          imageUploads[imageKey] = await uploadToCloudinary(formData[imageKey]);
        } else if (typeof formData[imageKey] === "string") {
          imageUploads[imageKey] = formData[imageKey];
        }
      }

      const payload = {
        ...formData,
        ...imageUploads,
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/recherche/${editingId}/`
        : `${CONFIG.BASE_URL}/api/recherche/`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      setSuccessMessage(editingId ? "Recherche mise à jour avec succès !" : "Recherche ajoutée avec succès !");
      resetForm();
      await fetchRecherches();
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

  // EDIT RECHERCHE
  const handleEdit = (recherche) => {
    setFormData({
      title1_fr: recherche.title1_fr || "",
      title2_fr: recherche.title2_fr || "",
      title3_fr: recherche.title3_fr || "",
      title4_fr: recherche.title4_fr || "",
      title5_fr: recherche.title5_fr || "",
      title1_en: recherche.title1_en || "",
      title2_en: recherche.title2_en || "",
      title3_en: recherche.title3_en || "",
      title4_en: recherche.title4_en || "",
      title5_en: recherche.title5_en || "",
      content1_fr: recherche.content1_fr || "",
      content2_fr: recherche.content2_fr || "",
      content3_fr: recherche.content3_fr || "",
      content4_fr: recherche.content4_fr || "",
      content5_fr: recherche.content5_fr || "",
      content1_en: recherche.content1_en || "",
      content2_en: recherche.content2_en || "",
      content3_en: recherche.content3_en || "",
      content4_en: recherche.content4_en || "",
      content5_en: recherche.content5_en || "",
      image_1: recherche.image_1_url || recherche.image_1,
      image_2: recherche.image_2_url || recherche.image_2,
      image_3: recherche.image_3_url || recherche.image_3,
      image_4: recherche.image_4_url || recherche.image_4,
      image_5: recherche.image_5_url || recherche.image_5,
    });

    setPreviews({
      image_1: recherche.image_1_url || recherche.image_1,
      image_2: recherche.image_2_url || recherche.image_2,
      image_3: recherche.image_3_url || recherche.image_3,
      image_4: recherche.image_4_url || recherche.image_4,
      image_5: recherche.image_5_url || recherche.image_5,
    });

    setEditingId(recherche.id);
    setShowForm(true);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // DELETE RECHERCHE
  const deleteRecherche = async (rechercheId) => {
    if (!window.confirm("Supprimer cette recherche ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche/${rechercheId}/`, { method: "DELETE" });
      setSuccessMessage("Recherche supprimée avec succès !");
      await fetchRecherches();
      setSelectedRecherche(null);
    } catch (error) {
      console.error("Erreur suppression:", error);
      setError("Erreur lors de la suppression");
    }
  };

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recherches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recherches.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // LOADING STATE
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement des recherches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER MODERNE */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                    <Search className="text-white w-7 h-7" />
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                    Gestion Recherche
                  </h1>
                  <p className="text-gray-500 font-medium mt-1">Contenu de la page recherche</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchRecherches}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50"
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  {showForm ? (
                    <>
                      <X className="w-5 h-5" />
                      Fermer
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      Nouvelle Recherche
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="flex-1 text-red-700 font-medium">{error}</div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="flex-1 text-green-700 font-medium">{successMessage}</div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
            <form onSubmit={handleSubmit}>
              {/* En-tête du formulaire */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Modifier la recherche" : "Nouvelle recherche"}
                </h3>
              </div>

              {/* Sections 1 à 5 */}
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg flex items-center justify-center font-black">
                      {num}
                    </span>
                    Section {num}
                  </h4>

                  {/* Titres */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="font-semibold text-gray-700 text-sm">
                        Titre (FR)
                      </label>
                      <input
                        type="text"
                        name={`title${num}_fr`}
                        value={formData[`title${num}_fr`]}
                        onChange={handleChange}
                        placeholder={`Titre section ${num}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"
                        maxLength={30}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-semibold text-gray-700 text-sm">
                        Title (EN)
                      </label>
                      <input
                        type="text"
                        name={`title${num}_en`}
                        value={formData[`title${num}_en`]}
                        onChange={handleChange}
                        placeholder={`Section ${num} title`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"
                        maxLength={30}
                      />
                    </div>
                  </div>

                  {/* Contenus */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="font-semibold text-gray-700 text-sm">
                        Contenu (FR)
                      </label>
                      <textarea
                        name={`content${num}_fr`}
                        value={formData[`content${num}_fr`]}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Contenu détaillé..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FDB71A] focus:ring-2 focus:ring-[#FDB71A]/20 transition-all bg-white font-medium resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="font-semibold text-gray-700 text-sm">
                        Content (EN)
                      </label>
                      <textarea
                        name={`content${num}_en`}
                        value={formData[`content${num}_en`]}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Detailed content..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="space-y-3">
                    <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#E84E1B]" />
                      Image {num}
                    </label>
                    <input
                      type="file"
                      name={`image_${num}`}
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer focus:border-[#F47920]"
                    />
                    {previews[`image_${num}`] && (
                      <div className="flex justify-center mt-4">
                        <div className="relative bg-white border border-gray-200 rounded-2xl p-4 shadow-lg w-48 h-48">
                          <img
                            src={previews[`image_${num}`]}
                            alt={`Aperçu ${num}`}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? "Mettre à jour" : "Créer la recherche"}
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
                    className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* LISTE DES RECHERCHES */}
        {showList && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* En-tête */}
            <div className="p-6 md:p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Liste des recherches
                    <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full font-semibold text-sm">
                      {recherches.length}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
              ) : recherches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucune recherche pour le moment</p>
                  <p className="text-gray-400 text-sm mt-1">Créez votre première recherche</p>
                </div>
              ) : (
                <>
                  {/* Grille */}
                  <div className="grid gap-6 mb-6">
                    {currentItems.map((recherche) => (
                      <div
                        key={recherche.id}
                        className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FDB71A]/50 p-6"
                      >
                        <div className="flex flex-col gap-4">
                          <h4 className="text-xl font-black text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:via-[#F47920] group-hover:to-[#FDB71A] transition-all">
                            Recherche #{recherche.id}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                              recherche[`title${num}_fr`] && (
                                <div key={num} className="text-sm">
                                  <span className="font-semibold text-gray-600">Section {num}:</span>
                                  <p className="text-gray-800 font-medium truncate">{recherche[`title${num}_fr`]}</p>
                                </div>
                              )
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setSelectedRecherche(recherche)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Eye size={16} />
                              Voir
                            </button>

                            <button
                              onClick={() => {
                                handleEdit(recherche);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Edit2 size={16} />
                              Modifier
                            </button>

                            <button
                              onClick={() => deleteRecherche(recherche.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Trash2 size={16} />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              currentPage === pageNumber
                                ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* MODAL DÉTAIL */}
      {selectedRecherche && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
          onClick={() => setSelectedRecherche(null)}
        >
          <div
            className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                onClick={() => setSelectedRecherche(null)}
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <h2 className="text-2xl font-bold text-white pr-12">
                Recherche #{selectedRecherche.id}
              </h2>
            </div>

            {/* Contenu modal */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid gap-8">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg flex items-center justify-center font-black">
                        {num}
                      </span>
                      Section {num}
                    </h3>

                    {selectedRecherche[`title${num}_fr`] && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Titre (FR)</p>
                          <p className="text-gray-900 font-bold">{selectedRecherche[`title${num}_fr`]}</p>
                        </div>
                        {selectedRecherche[`title${num}_en`] && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Title (EN)</p>
                            <p className="text-gray-900 font-bold">{selectedRecherche[`title${num}_en`]}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedRecherche[`content${num}_fr`] && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Contenu (FR)</p>
                          <p className="text-gray-700 text-sm leading-relaxed">{selectedRecherche[`content${num}_fr`]}</p>
                        </div>
                        {selectedRecherche[`content${num}_en`] && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">Content (EN)</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{selectedRecherche[`content${num}_en`]}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {(selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]) && (
                      <div className="mt-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                        <img
                          src={selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]}
                          alt={`Section ${num}`}
                          className="w-full max-w-2xl h-auto max-h-[400px] object-contain rounded-xl mx-auto"
                          onError={(e) => {
                            console.error("❌ Erreur image modal:", selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]);
                            e.target.style.display = 'none';
                            e.target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden text-center py-8">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-sm">Image non disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions modal */}
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                onClick={() => {
                  handleEdit(selectedRecherche);
                  setSelectedRecherche(null);
                }}
              >
                <Edit2 className="w-5 h-5" />
                Modifier
              </button>

              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setSelectedRecherche(null)}
              >
                <X className="w-4 h-4" />
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