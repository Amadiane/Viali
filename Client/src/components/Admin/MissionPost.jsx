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
import { Target, Loader2, Trash2, PlusCircle, Edit2, X, AlertCircle, CheckCircle2, Save } from "lucide-react";
import CONFIG from "../../config/config.js";

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
    <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des missions...</p>
  </div>
);

const MissionPost = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    content_fr: "",
    content_en: "",
    image: null,
    is_active: true,
  });

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
  };

  const handleSubmit = async () => {
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
      const url = editingId ? CONFIG.API_MISSION_UPDATE(editingId) : CONFIG.API_MISSION_CREATE;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      setSuccessMessage(
        editingId ? "Mission mise à jour avec succès !" : "Mission ajoutée avec succès !"
      );
      resetForm();
      fetchMissions();
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette mission ?")) return;
    try {
      const res = await fetch(CONFIG.API_MISSION_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");
      setSuccessMessage("Mission supprimée avec succès !");
      fetchMissions();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

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
                <Target className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                Gestion des Missions
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">Vision & Objectifs</p>
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
            <span className="hidden sm:inline">{showForm ? "Fermer le formulaire" : "Nouvelle Mission"}</span>
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
                {editingId ? "Modifier la mission" : "Nouvelle mission"}
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
                    name="title_fr"
                    value={formData.title_fr}
                    onChange={handleChange}
                    placeholder="Ex: Excellence opérationnelle"
                    className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    placeholder="Ex: Operational Excellence"
                    className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Description (Français) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content_fr"
                  value={formData.content_fr}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Décrivez la mission en français..."
                  className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Description (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content_en"
                  value={formData.content_en}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the mission in English..."
                  className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Image de la mission <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
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
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#F47920] rounded focus:ring-[#F47920]"
                />
                <label htmlFor="is_active" className="font-bold text-gray-700 cursor-pointer">
                  Mission active
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
                      <span>{editingId ? "Mettre à jour" : "Ajouter la mission"}</span>
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

        {/* GRID DES MISSIONS */}
        {missions.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 md:w-12 md:h-12 text-[#F47920]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Aucune mission</h3>
              <p className="text-gray-600 text-base md:text-lg">Commencez par ajouter votre première mission</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {missions.map((mission) => (
              <article
                key={mission.id}
                className="group bg-white border-2 border-gray-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedMission(mission)}
              >
                <div className="relative h-48 md:h-56 bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300 overflow-hidden">
                  {mission.image_url ? (
                    <img
                      src={mission.image_url}
                      alt={mission.title_en}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Target className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {!mission.is_active && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Inactive
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="font-bold text-gray-800 text-base md:text-lg mb-2 group-hover:text-[#F47920] transition-colors line-clamp-2">
                    {mission.title_fr}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1 font-medium">{mission.title_en}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{mission.content_fr}</p>
                </div>
                <div className="flex gap-2 p-3 md:p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(mission);
                    }}
                    className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mission.id);
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
        )}

        {/* MODAL DÉTAILS */}
        {selectedMission && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-50"
            onClick={() => setSelectedMission(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border-2 border-orange-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] mb-2">
                    {selectedMission.title_fr}
                  </h2>
                  <p className="text-gray-600 font-medium text-lg">{selectedMission.title_en}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedMission.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedMission.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setSelectedMission(null)}
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl mb-6 overflow-hidden">
                {selectedMission.image_url ? (
                  <img
                    src={selectedMission.image_url}
                    alt={selectedMission.title_en}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 flex items-center justify-center">
                    <Target className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🇫🇷</span> Description française
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMission.content_fr}</p>
                </div>

                {selectedMission.content_en && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">🇬🇧</span> English Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedMission.content_en}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    handleEdit(selectedMission);
                    setSelectedMission(null);
                  }}
                >
                  <Edit2 size={18} />
                  <span>Modifier</span>
                </button>
                <button
                  className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    handleDelete(selectedMission.id);
                    setSelectedMission(null);
                  }}
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

export default MissionPost;