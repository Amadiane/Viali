import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Target, Loader2, Trash2, PlusCircle, Edit2, X, Save,
  RefreshCw, Eye, ChevronLeft, ChevronRight, Image as ImageIcon,
  Check, Calendar, Award, Crosshair
} from "lucide-react";

const MissionPost = () => {
  const [missions, setMissions]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]               = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [showList, setShowList]         = useState(true);
  const [editingId, setEditingId]       = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [previews, setPreviews]         = useState({ image: null, cover_image: null });

  const [formData, setFormData] = useState({
    title_fr: "", title_en: "",
    content_valeur_fr: "", content_valeur_en: "",
    content_mission_fr: "", content_mission_en: "",
    image: null, cover_image: null,
    is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`,
  });

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_MISSION_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setMissions(data);
      setError(null);
    } catch { setError("Erreur lors du chargement des missions"); }
    finally { setLoading(false); setFetchLoading(false); }
  };

  useEffect(() => { fetchMissions(); }, []);

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
    setFormData({
      title_fr: "", title_en: "",
      content_valeur_fr: "", content_valeur_en: "",
      content_mission_fr: "", content_mission_en: "",
      image: null, cover_image: null, is_active: true,
    });
    setPreviews({ image: null, cover_image: null });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccessMessage(null);
    try {
      // Upload les 2 images en parallèle
      const [imageUrl, coverUrl] = await Promise.all([
        uploadToCloudinary(formData.image),
        uploadToCloudinary(formData.cover_image),
      ]);

      const payload = {
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        content_valeur_fr:  formData.content_valeur_fr,
        content_valeur_en:  formData.content_valeur_en,
        content_mission_fr: formData.content_mission_fr,
        content_mission_en: formData.content_mission_en,
        image:       imageUrl,
        cover_image: coverUrl,
        is_active:   formData.is_active,
      };

      const url    = editingId ? CONFIG.API_MISSION_UPDATE(editingId) : CONFIG.API_MISSION_CREATE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`Erreur HTTP ${res.status} : ${errData.detail || ""}`);
      }
      setSuccessMessage(editingId ? "Mission mise à jour !" : "Mission ajoutée !");
      resetForm();
      await fetchMissions();
      setShowForm(false); setShowList(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette mission ?")) return;
    try {
      const res = await fetch(CONFIG.API_MISSION_DELETE(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      setSuccessMessage("Mission supprimée !");
      await fetchMissions();
      setSelectedMission(null);
    } catch { setError("Erreur lors de la suppression"); }
  };

  const handleEdit = (mission) => {
    setEditingId(mission.id);
    setFormData({
      title_fr:           mission.title_fr           || "",
      title_en:           mission.title_en           || "",
      content_valeur_fr:  mission.content_valeur_fr  || "",
      content_valeur_en:  mission.content_valeur_en  || "",
      content_mission_fr: mission.content_mission_fr || "",
      content_mission_en: mission.content_mission_en || "",
      image:              mission.image       || "",
      cover_image:        mission.cover_image || "",
      is_active:          mission.is_active,
    });
    setPreviews({
      image:       mission.image_url       || null,
      cover_image: mission.cover_image_url || null,
    });
    setShowForm(true); setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = missions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(missions.length / itemsPerPage);
  const handlePageChange = (n) => { setCurrentPage(n); window.scrollTo({ top:0, behavior:"smooth" }); };

  // Composant upload image réutilisable
  const ImageUpload = ({ name, label, hint }) => (
    <div className="space-y-3">
      <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-[#F47920]"/> {label}
        {hint && <span className="text-xs text-gray-400 font-normal">{hint}</span>}
      </label>
      <input type="file" name={name} accept="image/*" onChange={handleChange}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer focus:border-[#F47920]"/>
      {previews[name] && (
        <div className="flex justify-center mt-2">
          <div className="relative bg-white border border-gray-200 rounded-2xl p-3 shadow-lg w-44 h-44">
            <img src={previews[name]} alt="aperçu" className="w-full h-full object-cover rounded-xl"/>
            {editingId && typeof formData[name] === "string" && formData[name] && (
              <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-semibold">Actuelle</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4"/>
          <p className="text-gray-600 font-medium">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="text-white w-7 h-7"/>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900">Gestion des Missions</h1>
                  <p className="text-gray-500 font-medium mt-1">Vision, Valeurs & Objectifs</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchMissions} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}/> Actualiser
                </button>
                <button onClick={() => { setShowForm(!showForm); if (!showForm) { resetForm(); setShowList(false); } else { setShowList(true); } }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  {showForm ? <><X className="w-5 h-5"/> Fermer</> : <><PlusCircle className="w-5 h-5"/> Nouvelle Mission</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error          && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex justify-between items-center"><span className="text-red-700 font-medium">{error}</span><button onClick={() => setError(null)}><X size={18} className="text-red-500"/></button></div>}
        {successMessage && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex justify-between items-center"><span className="text-green-700 font-medium">{successMessage}</span><button onClick={() => setSuccessMessage(null)}><X size={18} className="text-green-500"/></button></div>}

        {/* FORMULAIRE */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">{editingId ? "Modifier la mission" : "Nouvelle mission"}</h3>
              </div>

              {/* Titres */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Titre (FR) <span className="text-red-500">*</span></label>
                  <input type="text" name="title_fr" value={formData.title_fr} onChange={handleChange} required
                    placeholder="Ex: Excellence opérationnelle"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Title (EN)</label>
                  <input type="text" name="title_en" value={formData.title_en} onChange={handleChange}
                    placeholder="Ex: Operational Excellence"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                </div>
              </div>

              {/* Valeur */}
              <div className="mb-6 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FDB71A] to-[#F9A825] rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white"/>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Contenu Valeur</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Contenu Valeur (FR)</label>
                    <textarea name="content_valeur_fr" value={formData.content_valeur_fr} onChange={handleChange} rows="5"
                      placeholder="Décrivez les valeurs en français..."
                      className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:border-[#FDB71A] transition-all bg-white font-medium resize-none"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Content Value (EN)</label>
                    <textarea name="content_valeur_en" value={formData.content_valeur_en} onChange={handleChange} rows="5"
                      placeholder="Describe the values in English..."
                      className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:border-[#FDB71A] transition-all bg-white font-medium resize-none"></textarea>
                  </div>
                </div>
              </div>

              {/* Mission */}
              <div className="mb-6 p-6 bg-orange-50 rounded-2xl border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F47920] to-[#E84E1B] rounded-xl flex items-center justify-center">
                    <Crosshair className="w-5 h-5 text-white"/>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Contenu Mission</h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Contenu Mission (FR)</label>
                    <textarea name="content_mission_fr" value={formData.content_mission_fr} onChange={handleChange} rows="5"
                      placeholder="Décrivez la mission en français..."
                      className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-gray-700 text-sm">Content Mission (EN)</label>
                    <textarea name="content_mission_en" value={formData.content_mission_en} onChange={handleChange} rows="5"
                      placeholder="Describe the mission in English..."
                      className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#F47920]"/> Images
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload name="image"       label="Image de contenu" hint="(affichée dans la page)"/>
                  <ImageUpload name="cover_image" label="Cover Image"      hint="(bannière / hero)"/>
                </div>
              </div>

              {/* Statut */}
              <div className="mb-6">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 w-fit">
                  <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange}
                    className="w-5 h-5 rounded accent-[#FDB71A] cursor-pointer"/>
                  <label htmlFor="is_active" className="font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                    {formData.is_active
                      ? <><span className="w-2 h-2 bg-green-500 rounded-full"></span> Mission active</>
                      : <><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Mission inactive</>
                    }
                  </label>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button type="submit" disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                  {loading ? <><Loader2 className="animate-spin w-5 h-5"/> Enregistrement...</> : <><Save className="w-5 h-5"/> {editingId ? "Mettre à jour" : "Créer la mission"}</>}
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
                Liste des missions
                <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{missions.length}</span>
              </h3>
            </div>
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="text-center py-12"><Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto"/></div>
              ) : missions.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                  <p className="text-gray-500 font-medium">Aucune mission pour le moment</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 mb-6">
                    {currentItems.map(mission => (
                      <div key={mission.id}
                           className="group relative bg-white/60 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 border-2 border-transparent hover:border-[#FDB71A]/50 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                          {/* Cover image en priorité, sinon image */}
                          {(mission.cover_image_url || mission.image_url) && (
                            <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl">
                              <img src={mission.cover_image_url || mission.image_url} alt={mission.title_fr}
                                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                              {mission.cover_image_url && (
                                <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">Cover</span>
                              )}
                              <div className="absolute top-2 right-2">
                                {mission.is_active
                                  ? <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"><Check className="w-3 h-3"/> Actif</span>
                                  : <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">Inactif</span>
                                }
                              </div>
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4 className="text-xl font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:to-[#FDB71A] transition-all">
                                {mission.title_fr}
                              </h4>
                              <div className="space-y-1.5 mb-2">
                                {mission.content_valeur_fr && (
                                  <div className="flex items-start gap-2">
                                    <Award className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5"/>
                                    <p className="text-gray-600 text-sm line-clamp-1"><span className="font-semibold">Valeur:</span> {mission.content_valeur_fr}</p>
                                  </div>
                                )}
                                {mission.content_mission_fr && (
                                  <div className="flex items-start gap-2">
                                    <Crosshair className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5"/>
                                    <p className="text-gray-600 text-sm line-clamp-1"><span className="font-semibold">Mission:</span> {mission.content_mission_fr}</p>
                                  </div>
                                )}
                                {/* Badges images disponibles */}
                                <div className="flex gap-1.5 mt-1">
                                  {mission.cover_image_url && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Cover ✓</span>}
                                  {mission.image_url       && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">Image ✓</span>}
                                </div>
                              </div>
                              {mission.created_at && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3"/> {new Date(mission.created_at).toLocaleDateString("fr-FR")}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button onClick={() => setSelectedMission(mission)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-md">
                                <Eye size={16}/> Voir
                              </button>
                              <button onClick={() => { handleEdit(mission); window.scrollTo({ top:0, behavior:"smooth" }); }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-md">
                                <Edit2 size={16}/> Modifier
                              </button>
                              <button onClick={() => handleDelete(mission.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-md">
                                <Trash2 size={16}/> Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                      <button onClick={() => handlePageChange(currentPage-1)} disabled={currentPage===1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                      {[...Array(totalPages)].map((_,i) => (
                        <button key={i} onClick={() => handlePageChange(i+1)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage===i+1 ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                          {i+1}
                        </button>
                      ))}
                      <button onClick={() => handlePageChange(currentPage+1)} disabled={currentPage===totalPages}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedMission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
             onClick={() => setSelectedMission(null)}>
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
               onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                      onClick={() => setSelectedMission(null)}><X className="w-5 h-5 text-white"/></button>
              <h2 className="text-2xl font-bold text-white pr-12">{selectedMission.title_fr}</h2>
              {selectedMission.title_en && <p className="text-white/80 text-sm mt-1">{selectedMission.title_en}</p>}
            </div>
            <div className="p-6 overflow-y-auto flex-1">

              {/* Images côte à côte */}
              {(selectedMission.cover_image_url || selectedMission.image_url) && (
                <div className={`grid gap-4 mb-6 ${selectedMission.cover_image_url && selectedMission.image_url ? "grid-cols-2" : "grid-cols-1"}`}>
                  {selectedMission.cover_image_url && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Image</p>
                      <img src={selectedMission.cover_image_url} className="w-full h-48 object-cover rounded-xl border border-gray-100" alt="cover"/>
                    </div>
                  )}
                  {selectedMission.image_url && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image</p>
                      <img src={selectedMission.image_url} className="w-full h-48 object-cover rounded-xl border border-gray-100" alt="image"/>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-5">
                {(selectedMission.content_valeur_fr || selectedMission.content_valeur_en) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Award className="w-5 h-5 text-yellow-600"/><h3 className="font-bold text-gray-900 text-lg">Valeurs</h3></div>
                    {selectedMission.content_valeur_fr && (
                      <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-500 mb-2">
                        <p className="text-xs font-bold text-gray-500 mb-1">Français</p>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{selectedMission.content_valeur_fr}</p>
                      </div>
                    )}
                    {selectedMission.content_valeur_en && (
                      <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-300 mb-2">
                        <p className="text-xs font-bold text-gray-500 mb-1">English</p>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{selectedMission.content_valeur_en}</p>
                      </div>
                    )}
                  </div>
                )}
                {(selectedMission.content_mission_fr || selectedMission.content_mission_en) && (
                  <div>
                    <div className="flex items-center gap-2 mb-3"><Crosshair className="w-5 h-5 text-orange-600"/><h3 className="font-bold text-gray-900 text-lg">Mission</h3></div>
                    {selectedMission.content_mission_fr && (
                      <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-500 mb-2">
                        <p className="text-xs font-bold text-gray-500 mb-1">Français</p>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{selectedMission.content_mission_fr}</p>
                      </div>
                    )}
                    {selectedMission.content_mission_en && (
                      <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-300 mb-2">
                        <p className="text-xs font-bold text-gray-500 mb-1">English</p>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm">{selectedMission.content_mission_en}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button onClick={() => { handleEdit(selectedMission); setSelectedMission(null); }}
                className="px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2">
                <Edit2 className="w-4 h-4"/> Modifier
              </button>
              <button onClick={() => handleDelete(selectedMission.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4"/> Supprimer
              </button>
              <button onClick={() => setSelectedMission(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                <X className="w-4 h-4"/> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionPost;