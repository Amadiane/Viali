import React, { useState, useEffect } from "react";
import { Newspaper, Loader2, Trash2, PlusCircle, Edit2, X, AlertCircle, CheckCircle2, Save } from "lucide-react";

// Simuler CONFIG pour la démo
const CONFIG = {
  BASE_URL: "http://127.0.0.1:8000",
  CLOUDINARY_NAME: "dwuyq2eoz",
  CLOUDINARY_UPLOAD_PRESET: "default",
};

// 🎨 Palette VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
};

// 🎯 Composants réutilisables
const GradientButton = ({ onClick, children, disabled = false, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40 hover:shadow-xl hover:shadow-orange-400/50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-400/40 hover:shadow-xl hover:shadow-red-400/50",
    secondary: "bg-white border-2 border-orange-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Alert = ({ type, message, onClose }) => {
  const types = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: AlertCircle,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: CheckCircle2,
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.text} border-2 ${config.border} p-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top duration-300`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47920] rounded-full animate-spin"></div>
    </div>
    <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des actualités...</p>
  </div>
);

const NewsPost = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // FORM STATES
  const [title_fr, setTitleFr] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [content_fr, setContentFr] = useState("");
  const [content_en, setContentEn] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchNews();
  }, []);

  // -----------------------------
  // FETCH NEWS LIST
  // -----------------------------
  const fetchNews = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/news/`);
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Erreur lors du chargement des actualités");
    } finally {
      setFetchLoading(false);
    }
  };

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploaded = await uploadRes.json();
      if (uploaded.secure_url) return uploaded.secure_url;

      console.error("Cloudinary upload failed:", uploaded);
      return null;
    } catch (err) {
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  // -----------------------------
  // CREATE OR UPDATE NEWS
  // -----------------------------
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let image_url = selectedNews?.image_url || null;
      if (imageFile) {
        image_url = await uploadImageToCloudinary();
      }

      const payload = {
        title_fr,
        title_en,
        content_fr,
        content_en,
        image: image_url,
        isActive,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/news/${editingId}/`
        : `${CONFIG.BASE_URL}/api/news/`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

      setSuccessMessage(
        editingId ? "Actualité mise à jour avec succès !" : "Actualité ajoutée avec succès !"
      );
      resetForm();
      fetchNews();
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const deleteNews = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;

    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/news/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Actualité supprimée avec succès !");
      fetchNews();
      setSelectedNews(null);
    } catch (err) {
      console.error("DELETE ERROR:", err);
      setError("Erreur lors de la suppression");
    }
  };

  // -----------------------------
  // EDIT
  // -----------------------------
  const editNews = (news) => {
    setEditingId(news.id);
    setTitleFr(news.title_fr);
    setTitleEn(news.title_en);
    setContentFr(news.content_fr);
    setContentEn(news.content_en);
    setIsActive(news.isActive);
    setPreview(news.image_url || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -----------------------------
  // RESET FORM
  // -----------------------------
  const resetForm = () => {
    setEditingId(null);
    setTitleFr("");
    setTitleEn("");
    setContentFr("");
    setContentEn("");
    setImageFile(null);
    setPreview(null);
    setIsActive(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (fetchLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* Éléments décoratifs */}
      <div className="fixed top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#FDB71A]/10 to-[#F47920]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#E84E1B]/10 to-[#FDB71A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#F47920] blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-3 rounded-2xl shadow-xl shadow-orange-400/50">
                <Newspaper className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                Gestion des Actualités
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">News & Updates</p>
            </div>
          </div>
          <GradientButton
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="w-full md:w-auto"
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            <span className="hidden sm:inline">{showForm ? "Fermer le formulaire" : "Nouvelle Actualité"}</span>
            <span className="sm:hidden">{showForm ? "Fermer" : "Ajouter"}</span>
          </GradientButton>
        </div>

        {/* MESSAGES */}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white border-2 border-orange-200 shadow-2xl rounded-3xl p-6 md:p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-xl flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800">
                {editingId ? "Modifier l'actualité" : "Nouvelle actualité"}
              </h2>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                    Titre (Français) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title_fr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    placeholder="Ex: Nouveau partenariat stratégique"
                    className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={title_en}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Ex: New Strategic Partnership"
                    className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Contenu (Français) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content_fr}
                  onChange={(e) => setContentFr(e.target.value)}
                  rows="5"
                  placeholder="Rédigez le contenu de l'actualité en français..."
                  className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Content (English)
                </label>
                <textarea
                  value={content_en}
                  onChange={(e) => setContentEn(e.target.value)}
                  rows="5"
                  placeholder="Write the news content in English..."
                  className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Image de l'actualité <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                  className="w-full border-2 border-gray-200 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:font-bold file:cursor-pointer hover:file:shadow-lg transition-all"
                />
                {preview && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg w-64 h-64">
                      <img src={preview} alt="Aperçu" className="w-full h-full object-cover rounded-xl" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  className="w-5 h-5 text-[#F47920] rounded focus:ring-[#F47920]"
                />
                <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">
                  Actualité active
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <GradientButton onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingId ? "Mettre à jour" : "Publier l'actualité"}</span>
                    </>
                  )}
                </GradientButton>
                <GradientButton
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                >
                  Annuler
                </GradientButton>
              </div>
            </div>
          </div>
        )}

        {/* LISTE DES ACTUALITÉS */}
        {newsList.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-10 h-10 md:w-12 md:h-12 text-[#F47920]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Aucune actualité</h3>
              <p className="text-gray-600 text-base md:text-lg">Commencez par publier votre première actualité</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {currentNews.map((item) => (
                <article
                  key={item.id}
                  className="group bg-white border-2 border-gray-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedNews(item)}
                >
                  <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title_en}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {/* {!item.isActive && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Inactive
                      </div>
                    )} */}
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg mb-2 group-hover:text-[#F47920] transition-colors line-clamp-2">
                      {item.title_fr}
                    </h3>
                    {item.title_en && (
                      <p className="text-sm text-gray-500 mb-2 font-medium line-clamp-1">{item.title_en}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-3">{item.content_fr}</p>
                  </div>
                  <div className="flex gap-2 p-3 md:p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editNews(item);
                      }}
                      className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit2 size={14} />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNews(item.id);
                      }}
                      className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Précédent
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      currentPage === index + 1
                        ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:border-orange-300 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        {/* MODAL DÉTAILS */}
        {selectedNews && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-50"
            onClick={() => setSelectedNews(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border-2 border-orange-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] mb-2">
                    {selectedNews.title_fr}
                  </h2>
                  {selectedNews.title_en && (
                    <p className="text-gray-600 font-medium text-lg">{selectedNews.title_en}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedNews.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedNews.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setSelectedNews(null)}
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {selectedNews.image_url && (
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl mb-6 overflow-hidden">
                  <img
                    src={selectedNews.image_url}
                    alt={selectedNews.title_en}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}

              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🇫🇷</span> Contenu français
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNews.content_fr}</p>
                </div>

                {selectedNews.content_en && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">🇬🇧</span> English Content
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedNews.content_en}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    editNews(selectedNews);
                    setSelectedNews(null);
                  }}
                >
                  <Edit2 size={18} />
                  <span>Modifier</span>
                </button>
                <button
                  className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={() => deleteNews(selectedNews.id)}
                >
                  <Trash2 size={18} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPost;