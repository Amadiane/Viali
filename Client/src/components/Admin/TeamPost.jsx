import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Users, Loader2, Trash2, PlusCircle, Edit2, X, UserCircle,
  Save, RefreshCw, Eye, ChevronLeft, ChevronRight,
  Image as ImageIcon, Mail, Linkedin, Briefcase, Check
} from "lucide-react";

const TeamPost = () => {
  const [membres, setMembres]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]             = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [showList, setShowList]       = useState(true);
  const [editingId, setEditingId]     = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [preview, setPreview]         = useState(null);

  const [formData, setFormData] = useState({
    full_name: "", position_fr: "", position_en: "",
    bio_fr: "", bio_en: "", photo: null,
    email: "", linkedin: "", is_active: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ── Token JWT ──
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`,
  });

  // ── FETCH ──
  const fetchMembres = async () => {
    setLoading(true);
    try {
      const res = await fetch(CONFIG.API_TEAM_LIST);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setMembres(data.results || data);
      setError(null);
    } catch { setError("Erreur lors du chargement des membres"); }
    finally { setLoading(false); setFetchLoading(false); }
  };

  useEffect(() => { fetchMembres(); }, []);

  // ── CLOUDINARY ──
  const uploadToCloudinary = async (file) => {
    if (!file || typeof file === "string") return file || null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: fd });
      const json = await res.json();
      return json.secure_url;
    } catch { return null; }
  };

  // ── HANDLE CHANGE ──
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setFormData(p => ({ ...p, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData(p => ({ ...p, [name]: checked }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  // ── RESET ──
  const resetForm = () => {
    setFormData({ full_name: "", position_fr: "", position_en: "", bio_fr: "", bio_en: "", photo: null, email: "", linkedin: "", is_active: true });
    setPreview(null);
    setEditingId(null);
  };

  // ── SUBMIT ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccessMessage(null);
    try {
      const photoUrl = await uploadToCloudinary(formData.photo);
      const payload  = { ...formData, photo: photoUrl };
      const url      = editingId ? CONFIG.API_TEAM_UPDATE(editingId) : CONFIG.API_TEAM_CREATE;
      const method   = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),  // ← JWT
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(`Erreur ${res.status} : ${errData.detail || ""}`);
      }

      setSuccessMessage(editingId ? "Membre mis à jour !" : "Membre ajouté !");
      resetForm();
      await fetchMembres();
      setShowForm(false); setShowList(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally { setLoading(false); }
  };

  // ── EDIT ──
  const handleEdit = (membre) => {
    setFormData({
      full_name:   membre.full_name,
      position_fr: membre.position_fr || "",
      position_en: membre.position_en || "",
      bio_fr:      membre.bio_fr      || "",
      bio_en:      membre.bio_en      || "",
      email:       membre.email       || "",
      linkedin:    membre.linkedin    || "",
      is_active:   membre.is_active,
      photo:       membre.photo       || null,
    });
    setPreview(membre.photo_url || null);
    setEditingId(membre.id);
    setShowForm(true); setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── DELETE ──
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    try {
      const res = await fetch(CONFIG.API_TEAM_DELETE(id), {
        method: "DELETE",
        headers: getAuthHeaders(),  // ← JWT
      });
      if (!res.ok) throw new Error();
      setSuccessMessage("Membre supprimé !");
      await fetchMembres();
      setSelectedMember(null);
    } catch { setError("Erreur lors de la suppression"); }
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = membres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(membres.length / itemsPerPage);
  const handlePageChange = (n) => { setCurrentPage(n); window.scrollTo({ top:0, behavior:"smooth" }); };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4"/>
          <p className="text-gray-600 font-medium">Chargement des membres...</p>
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
                  <Users className="text-white w-7 h-7"/>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900">Gestion de l'Équipe</h1>
                  <p className="text-gray-500 font-medium mt-1">Associés & Membres</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchMembres} disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}/> Actualiser
                </button>
                <button onClick={() => { setShowForm(!showForm); if (!showForm) { resetForm(); setShowList(false); } else { setShowList(true); } }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  {showForm ? <><X className="w-5 h-5"/> Fermer</> : <><PlusCircle className="w-5 h-5"/> Nouveau Membre</>}
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
                <h3 className="text-2xl font-bold text-gray-900">{editingId ? "Modifier le membre" : "Nouveau membre"}</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Nom complet <span className="text-red-500">*</span></label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-[#F47920]"/> Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="exemple@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#FDB71A]"/> Poste (FR)</label>
                  <input type="text" name="position_fr" value={formData.position_fr} onChange={handleChange}
                    placeholder="Ex: Directeur Général"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FDB71A] transition-all bg-white font-medium"/>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#F47920]"/> Position (EN)</label>
                  <input type="text" name="position_en" value={formData.position_en} onChange={handleChange}
                    placeholder="Ex: Chief Executive Officer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium"/>
                </div>
              </div>

              <div className="space-y-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Biographie (FR)</label>
                  <textarea name="bio_fr" value={formData.bio_fr} onChange={handleChange} rows="4"
                    placeholder="Décrivez le parcours du membre..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#FDB71A] transition-all bg-white font-medium resize-none"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Biography (EN)</label>
                  <textarea name="bio_en" value={formData.bio_en} onChange={handleChange} rows="4"
                    placeholder="Describe the member's background..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm flex items-center gap-2"><Linkedin className="w-4 h-4 text-[#E84E1B]"/> LinkedIn</label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#E84E1B] transition-all bg-white font-medium"/>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">Statut</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-300">
                    <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange}
                      className="w-5 h-5 rounded accent-[#FDB71A] cursor-pointer"/>
                    <label htmlFor="is_active" className="font-semibold text-gray-700 cursor-pointer flex items-center gap-2">
                      {formData.is_active
                        ? <><span className="w-2 h-2 bg-green-500 rounded-full"></span> Membre actif</>
                        : <><span className="w-2 h-2 bg-gray-400 rounded-full"></span> Membre inactif</>
                      }
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <label className="font-semibold text-gray-700 text-sm flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#E84E1B]"/> Photo du membre</label>
                <input type="file" name="photo" accept="image/*" onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer focus:border-[#F47920]"/>
                {preview && (
                  <div className="flex justify-center mt-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg w-48 h-48">
                      <img src={preview} alt="Aperçu" className="w-full h-full object-cover rounded-xl"/>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button type="submit" disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                  {loading ? <><Loader2 className="animate-spin w-5 h-5"/> Enregistrement...</> : <><Save className="w-5 h-5"/> {editingId ? "Mettre à jour" : "Créer le membre"}</>}
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
                Liste des membres
                <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{membres.length}</span>
              </h3>
            </div>
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="text-center py-12"><Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto"/></div>
              ) : membres.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                  <p className="text-gray-500 font-medium">Aucun membre pour le moment</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 mb-6">
                    {currentItems.map(membre => (
                      <div key={membre.id}
                           className="group relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-orange-400/30 transition-all duration-300 border-2 border-transparent hover:border-[#FDB71A]/50 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                          <div className="relative w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                            {membre.photo_url
                              ? <img src={membre.photo_url} alt={membre.full_name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
                              : <UserCircle className="w-24 h-24 text-gray-300"/>
                            }
                            <div className="absolute top-2 right-2">
                              {membre.is_active
                                ? <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"><Check className="w-3 h-3"/> Actif</span>
                                : <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">Inactif</span>
                              }
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h4 className="text-xl font-black text-gray-800 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:to-[#FDB71A] transition-all">
                                {membre.full_name}
                              </h4>
                              <p className="text-gray-600 text-sm font-medium mb-2">{membre.position_fr || membre.position_en}</p>
                              {membre.bio_fr && <p className="text-gray-600 text-sm line-clamp-2 mb-2">{membre.bio_fr}</p>}
                              <div className="flex flex-wrap gap-2 text-xs">
                                {membre.email && <span className="flex items-center gap-1 text-gray-500"><Mail className="w-3 h-3"/>{membre.email}</span>}
                                {membre.linkedin && (
                                  <a href={membre.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                    className="flex items-center gap-1 text-[#F47920] hover:text-[#E84E1B]">
                                    <Linkedin className="w-3 h-3"/> LinkedIn
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button onClick={() => setSelectedMember(membre)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-md">
                                <Eye size={16}/> Voir
                              </button>
                              <button onClick={() => { handleEdit(membre); window.scrollTo({ top:0, behavior:"smooth" }); }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-md">
                                <Edit2 size={16}/> Modifier
                              </button>
                              <button onClick={() => handleDelete(membre.id)}
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
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
             onClick={() => setSelectedMember(null)}>
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
               onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                      onClick={() => setSelectedMember(null)}><X className="w-5 h-5 text-white"/></button>
              <h2 className="text-2xl font-bold text-white pr-12">{selectedMember.full_name}</h2>
              <p className="text-white/80 text-sm mt-1">{selectedMember.position_fr || selectedMember.position_en}</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {selectedMember.photo_url && (
                <img src={selectedMember.photo_url} className="w-full h-80 object-cover rounded-xl mb-6" alt={selectedMember.full_name}/>
              )}
              <div className="space-y-4">
                {selectedMember.bio_fr && (
                  <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-[#FDB71A]">
                    <h3 className="font-semibold text-gray-700 mb-2 text-sm">Biographie</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMember.bio_fr}</p>
                  </div>
                )}
                {selectedMember.bio_en && (
                  <div className="bg-red-50 p-4 rounded-xl border-l-4 border-[#F47920]">
                    <h3 className="font-semibold text-gray-700 mb-2 text-sm">Biography</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMember.bio_en}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {selectedMember.email && (
                    <a href={`mailto:${selectedMember.email}`}
                       className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors">
                      <Mail className="w-4 h-4"/> {selectedMember.email}
                    </a>
                  )}
                  {selectedMember.linkedin && (
                    <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-[#F47920] rounded-xl font-medium hover:bg-orange-100 transition-colors">
                      <Linkedin className="w-4 h-4"/> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button onClick={() => { handleEdit(selectedMember); setSelectedMember(null); }}
                className="px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2">
                <Edit2 className="w-4 h-4"/> Modifier
              </button>
              <button onClick={() => handleDelete(selectedMember.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4"/> Supprimer
              </button>
              <button onClick={() => setSelectedMember(null)}
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

export default TeamPost;