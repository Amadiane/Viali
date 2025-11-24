// import React, { useState, useEffect } from "react";
// import { Target, Loader2, Trash2, PlusCircle, Edit2, X } from "lucide-react";
// import CONFIG from "../../config/config.js";
// import { useTranslation } from "react-i18next";

// const MissionPost = () => {
//   const { t } = useTranslation();
//   const [missions, setMissions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedMission, setSelectedMission] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const [formData, setFormData] = useState({
//     title_fr: "",
//     title_en: "",
//     title_ar: "",
//     content_fr: "",
//     content_en: "",
//     content_ar: "",
//     image: null,
//   });

//   // 🔄 Charger toutes les missions
//   useEffect(() => {
//     fetchMissions();
//   }, []);

//   const fetchMissions = async () => {
//     setFetchLoading(true);
//     try {
//       const res = await fetch(CONFIG.API_MISSION_LIST);
//       if (!res.ok) throw new Error("Erreur de chargement des missions");
//       const data = await res.json();
//       setMissions(data);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors du chargement des missions");
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // 🔼 Upload vers Cloudinary
//   const uploadToCloudinary = async (file) => {
//     if (!file) return null;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
//         { method: "POST", body: formData }
//       );
//       const data = await res.json();
//       return data.secure_url;
//     } catch (err) {
//       console.error("Erreur upload Cloudinary:", err);
//       return null;
//     }
//   };

//   // 📝 Gestion des champs
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//       setPreview(URL.createObjectURL(files[0]));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // 🔄 Réinitialiser le formulaire
//   const resetForm = () => {
//     setFormData({
//       title_fr: "",
//       title_en: "",
//       title_ar: "",
//       content_fr: "",
//       content_en: "",
//       content_ar: "",
//       image: null,
//     });
//     setPreview(null);
//     setEditingId(null);
//   };

//   // ✅ Créer ou Mettre à jour
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       let imageUrl = null;
//       if (formData.image) {
//         imageUrl = await uploadToCloudinary(formData.image);
//       }

//       const payload = {
//         title_fr: formData.title_fr,
//         title_en: formData.title_en,
//         title_ar: formData.title_ar,
//         content_fr: formData.content_fr,
//         content_en: formData.content_en,
//         content_ar: formData.content_ar,
//         image: imageUrl,
//       };

//       const url = editingId ? CONFIG.API_MISSION_UPDATE(editingId) : CONFIG.API_MISSION_CREATE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

//       setSuccessMessage(editingId ? "Mission mise à jour avec succès !" : "Mission ajoutée avec succès !");
//       resetForm();
//       fetchMissions();
//       setShowForm(false);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la sauvegarde");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🗑️ Supprimer une mission
//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer cette mission ?")) return;

//     try {
//       const res = await fetch(CONFIG.API_MISSION_DELETE(id), { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur de suppression");
//       setSuccessMessage("Mission supprimée avec succès !");
//       fetchMissions();
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la suppression");
//     }
//   };

//   // 🔄 Préparer le formulaire pour modification
//   const handleEdit = (mission) => {
//     setEditingId(mission.id);
//     setFormData({
//       title_fr: mission.title_fr || "",
//       title_en: mission.title_en || "",
//       title_ar: mission.title_ar || "",
//       content_fr: mission.content_fr || "",
//       content_en: mission.content_en || "",
//       content_ar: mission.content_ar || "",
//       image: null,
//     });
//     setPreview(mission.image_url || null);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="animate-spin inline-block text-orange-500" size={40} />
//           <p className="mt-4 text-gray-300 text-lg">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
//       {/* Effets de fond lumineux */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/3 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-1/2 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Grille de fond */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

//       <div className="relative max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-lg"></div>
//               <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-xl">
//                 <Target className="w-6 h-6 text-white" />
//               </div>
//             </div>
//             <h1 className="text-2xl md:text-3xl font-black text-white">
//               {t("missions.title", "Gestion des Missions")}
//             </h1>
//           </div>
//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) resetForm();
//             }}
//             className="relative group w-full md:w-auto"
//           >
//             <div className="absolute inset-0 bg-orange-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
//             <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 font-semibold">
//               <PlusCircle size={18} /> {showForm ? "Fermer" : "Nouvelle Mission"}
//             </div>
//           </button>
//         </div>

//         {/* Messages */}
//         {error && (
//           <div className="bg-red-500/20 border-2 border-red-500/50 text-red-300 p-4 mb-6 rounded-xl backdrop-blur-sm">
//             {error}
//           </div>
//         )}
//         {successMessage && (
//           <div className="bg-green-500/20 border-2 border-green-500/50 text-green-300 p-4 mb-6 rounded-xl backdrop-blur-sm">
//             {successMessage}
//           </div>
//         )}

//         {/* 🧾 FORMULAIRE */}
//         {showForm && (
//           <div className="relative mb-8">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
//             <div className="relative bg-[#0f1729]/90 backdrop-blur-xl shadow-2xl p-6 md:p-8 rounded-2xl border-2 border-orange-500/30">
//               <h2 className="text-xl font-bold text-white mb-6">
//                 {editingId ? "✏️ Modifier la mission" : "➕ Ajouter une mission"}
//               </h2>
              
//               <div className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-semibold text-gray-300 mb-2">🇫🇷 Titre (FR) *</label>
//                     <input
//                       type="text"
//                       name="title_fr"
//                       value={formData.title_fr}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-white/10 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block font-semibold text-gray-300 mb-2">🇬🇧 Title (EN) *</label>
//                     <input
//                       type="text"
//                       name="title_en"
//                       value={formData.title_en}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-white/10 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-300 mb-2 text-right" dir="rtl">🇸🇦 العنوان (AR) *</label>
//                   <input
//                     type="text"
//                     name="title_ar"
//                     value={formData.title_ar}
//                     onChange={handleChange}
//                     dir="rtl"
//                     className="w-full px-4 py-3 bg-white/10 border-2 border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-300 mb-2">📝 Description (FR) *</label>
//                   <textarea
//                     name="content_fr"
//                     value={formData.content_fr}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-4 py-3 bg-white/10 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all resize-none"
//                     required
//                   ></textarea>
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-300 mb-2">📝 Description (EN) *</label>
//                   <textarea
//                     name="content_en"
//                     value={formData.content_en}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-4 py-3 bg-white/10 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
//                     required
//                   ></textarea>
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-300 mb-2 text-right" dir="rtl">📝 الوصف (AR) *</label>
//                   <textarea
//                     name="content_ar"
//                     value={formData.content_ar}
//                     onChange={handleChange}
//                     dir="rtl"
//                     rows="3"
//                     className="w-full px-4 py-3 bg-white/10 border-2 border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all resize-none"
//                     required
//                   ></textarea>
//                 </div>

//                 <div>
//                   <label className="block font-semibold text-gray-300 mb-2">🖼️ Image de la mission *</label>
//                   <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="block w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
//                     required={!editingId}
//                   />
//                   {preview && (
//                     <div className="mt-4 relative inline-block">
//                       <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl blur opacity-50"></div>
//                       <div className="relative bg-white p-4 rounded-xl">
//                         <img src={preview} alt="Aperçu" className="w-full max-w-xs h-32 object-contain" />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="relative group overflow-hidden flex-1"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
//                     <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
//                       {loading ? (
//                         <>
//                           <Loader2 className="animate-spin" size={18} />
//                           Enregistrement...
//                         </>
//                       ) : (
//                         editingId ? "Mettre à jour" : "Ajouter"
//                       )}
//                     </div>
//                   </button>
//                   <button
//                     onClick={resetForm}
//                     className="bg-gray-600/30 border-2 border-gray-500/50 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-600/50 transition-all font-semibold"
//                   >
//                     Réinitialiser
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 🖼️ GRID DES MISSIONS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {missions.length === 0 ? (
//             <div className="col-span-full text-center py-12">
//               <Target size={64} className="mx-auto text-gray-600 mb-4" />
//               <p className="text-gray-400 text-lg">Aucune mission pour le moment</p>
//             </div>
//           ) : (
//             missions.map((mission) => (
//               <div key={mission.id} className="relative group cursor-pointer" onClick={() => setSelectedMission(mission)}>
//                 <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
//                 <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50 h-full flex flex-col">
//                   {/* Image */}
//                   <div className="relative aspect-video bg-gradient-to-br from-orange-500/20 to-purple-500/20">
//                     {mission.image_url ? (
//                       <img
//                         src={mission.image_url}
//                         alt={mission.title_en}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <Target size={48} className="text-white/30" />
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Contenu */}
//                   <div className="p-4 flex-1 flex flex-col">
//                     <h3 className="text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
//                       {mission.title_fr}
//                     </h3>
//                     {mission.title_en && (
//                       <p className="text-sm text-gray-400 line-clamp-1 mb-2">
//                         {mission.title_en}
//                       </p>
//                     )}
//                     <p className="text-xs text-gray-500 line-clamp-2 mb-3">
//                       {mission.content_fr}
//                     </p>
                    
//                     {/* Actions */}
//                     <div className="flex gap-2 mt-auto pt-3 border-t border-white/10">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEdit(mission);
//                         }}
//                         className="flex-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-all text-xs font-semibold flex items-center justify-center gap-1"
//                       >
//                         <Edit2 size={14} /> Modifier
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(mission.id);
//                         }}
//                         className="flex-1 bg-red-500/20 border border-red-500/50 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-all text-xs font-semibold flex items-center justify-center gap-1"
//                       >
//                         <Trash2 size={14} /> Supprimer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* 🔍 MODAL DÉTAILS */}
//         {selectedMission && (
//           <div 
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
//             onClick={() => setSelectedMission(null)}
//           >
//             <div 
//               className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
//               <div className="relative bg-[#0a0e27] rounded-3xl shadow-2xl border-2 border-orange-500/30 overflow-hidden">
//                 {/* Image grande taille */}
//                 <div className="relative h-64 md:h-80 bg-gradient-to-br from-orange-500/20 to-purple-500/20">
//                   {selectedMission.image_url ? (
//                     <img
//                       src={selectedMission.image_url}
//                       alt={selectedMission.title_en}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Target size={96} className="text-gray-400" />
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Contenu */}
//                 <div className="p-6 md:p-8">
//                   <div className="flex justify-between items-start gap-4 mb-6">
//                     <div className="flex-1">
//                       <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
//                         {selectedMission.title_fr}
//                       </h2>
//                       {selectedMission.title_en && (
//                         <p className="text-lg text-orange-400 font-semibold">
//                           🇬🇧 {selectedMission.title_en}
//                         </p>
//                       )}
//                       {selectedMission.title_ar && (
//                         <p className="text-lg text-green-400 font-semibold" dir="rtl">
//                           🇸🇦 {selectedMission.title_ar}
//                         </p>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => setSelectedMission(null)}
//                       className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>

//                   {/* Descriptions */}
//                   <div className="space-y-4 mb-6">
//                     <div className="bg-white/5 p-4 rounded-xl border border-blue-500/30">
//                       <p className="text-xs font-bold text-blue-400 mb-2">🇫🇷 DESCRIPTION</p>
//                       <p className="text-gray-300 leading-relaxed">{selectedMission.content_fr}</p>
//                     </div>

//                     {selectedMission.content_en && (
//                       <div className="bg-white/5 p-4 rounded-xl border border-green-500/30">
//                         <p className="text-xs font-bold text-green-400 mb-2">🇬🇧 DESCRIPTION</p>
//                         <p className="text-gray-300 leading-relaxed">{selectedMission.content_en}</p>
//                       </div>
//                     )}

//                     {selectedMission.content_ar && (
//                       <div className="bg-white/5 p-4 rounded-xl border border-purple-500/30" dir="rtl">
//                         <p className="text-xs font-bold text-purple-400 mb-2">🇸🇦 الوصف</p>
//                         <p className="text-gray-300 leading-relaxed">{selectedMission.content_ar}</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <button
//                       onClick={() => {
//                         handleEdit(selectedMission);
//                         setSelectedMission(null);
//                       }}
//                       className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-all font-bold flex items-center justify-center gap-2"
//                     >
//                       <Edit2 size={18} /> Modifier
//                     </button>
//                     <button
//                       onClick={() => {
//                         handleDelete(selectedMission.id);
//                         setSelectedMission(null);
//                       }}
//                       className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-red-500/50 transition-all font-bold flex items-center justify-center gap-2"
//                     >
//                       <Trash2 size={18} /> Supprimer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MissionPost;


import React, { useState, useEffect } from "react";
import { Target, Loader2, Trash2, PlusCircle, Edit2, X } from "lucide-react";
import CONFIG from "../../config/config.js";

const MissionPost = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    content_fr: "",
    content_en: "",
    image: null,
    is_active: true,
  });

  // 🔄 Charger toutes les missions
  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(CONFIG.API_MISSION_LIST);
      if (!res.ok) throw new Error("Erreur de chargement des missions");
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des missions");
    } finally {
      setFetchLoading(false);
    }
  };

  // 🔼 Upload vers Cloudinary
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
      console.error("Erreur upload Cloudinary:", err);
      return null;
    }
  };

  // 📝 Gestion des champs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      content_fr: "",
      content_en: "",
      image: null,
      is_active: true,
    });
    setPreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  // ✅ Créer ou Mettre à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = null;
      if (formData.image) imageUrl = await uploadToCloudinary(formData.image);

      const payload = {
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        content_fr: formData.content_fr,
        content_en: formData.content_en,
        image: imageUrl,
        is_active: formData.is_active,
      };

      const url = editingId
        ? CONFIG.API_MISSION_UPDATE(editingId)
        : CONFIG.API_MISSION_CREATE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      setSuccessMessage(
        editingId ? "Mission mise à jour !" : "Mission ajoutée !"
      );
      resetForm();
      fetchMissions();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Supprimer une mission
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette mission ?")) return;
    try {
      const res = await fetch(CONFIG.API_MISSION_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Mission supprimée !");
      fetchMissions();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // 🔄 Préparer le formulaire pour modification
  const handleEdit = (mission) => {
    setEditingId(mission.id);
    setFormData({
      title_fr: mission.title_fr,
      title_en: mission.title_en,
      content_fr: mission.content_fr,
      content_en: mission.content_en,
      image: null,
      is_active: mission.is_active,
    });
    setPreview(mission.image_url || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (fetchLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0e27] p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion des Missions</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-orange-500 px-4 py-2 rounded-lg text-white flex items-center gap-2"
        >
          <PlusCircle size={18} /> {showForm ? "Fermer" : "Nouvelle Mission"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1f3a] p-6 rounded-lg mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title_fr"
              value={formData.title_fr}
              onChange={handleChange}
              placeholder="Titre FR"
              required
              className="p-2 rounded-lg w-full"
            />
            <input
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              placeholder="Title EN"
              required
              className="p-2 rounded-lg w-full"
            />
          </div>
          <textarea
            name="content_fr"
            value={formData.content_fr}
            onChange={handleChange}
            placeholder="Contenu FR"
            required
            className="p-2 rounded-lg w-full mt-4"
          />
          <textarea
            name="content_en"
            value={formData.content_en}
            onChange={handleChange}
            placeholder="Content EN"
            required
            className="p-2 rounded-lg w-full mt-4"
          />
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-4"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg" />
          )}
          <label className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Actif
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 px-4 py-2 rounded-lg mt-4 text-white"
          >
            {editingId ? "Mettre à jour" : "Ajouter"}
          </button>
        </form>
      )}

      {/* Liste des missions */}
      <div className="grid md:grid-cols-3 gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className="bg-[#1a1f3a] p-4 rounded-lg relative cursor-pointer"
          >
            {m.image_url && (
              <img src={m.image_url} alt={m.title_fr} className="w-full h-40 object-cover rounded-lg mb-2" />
            )}
            <h3 className="text-white font-bold">{m.title_fr}</h3>
            <p className="text-gray-300 text-sm">{m.content_fr}</p>
            <p className="text-gray-400 text-xs">Actif: {m.is_active ? "Oui" : "Non"}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(m)}
                className="flex-1 bg-blue-500 px-2 py-1 text-white rounded"
              >
                <Edit2 size={14} /> Modifier
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="flex-1 bg-red-500 px-2 py-1 text-white rounded"
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionPost;
