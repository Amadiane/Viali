// import React, { useEffect, useState } from "react";
// import { Factory, Loader2, Trash2, PlusCircle, Edit2, X, ExternalLink } from "lucide-react";
// import CONFIG from "../../config/config.js";

// /*  
//   🎨 PALETTE VIALI :
//   - Orange principal : #F47920
//   - Orange foncé : #E84E1B
//   - Bleu profond : #142B57
// */

// const PartnerPost = () => {
//   const [partners, setPartners] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [selectedPartner, setSelectedPartner] = useState(null);
//   const [formData, setFormData] = useState({
//     name_fr: "",
//     name_en: "",
//     website_url: "",
//     cover_image: null,
//   });
//   const [preview, setPreview] = useState(null);

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   const fetchPartners = async () => {
//     setFetchLoading(true);
//     try {
//       const res = await fetch(CONFIG.API_PARTNER_LIST);
//       if (!res.ok) throw new Error("Erreur de chargement des partenaires");
//       const data = await res.json();
//       setPartners(data);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors du chargement des partenaires");
//     } finally {
//       setFetchLoading(false);
//     }
//   };

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

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//       setPreview(URL.createObjectURL(files[0]));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name_fr: "",
//       name_en: "",
//       website_url: "",
//       cover_image: null,
//     });
//     setPreview(null);
//     setEditingId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       let imageUrl = null;
//       if (formData.cover_image) {
//         imageUrl = await uploadToCloudinary(formData.cover_image);
//       }

//       const payload = {
//         name_fr: formData.name_fr,
//         name_en: formData.name_en,
//         website_url: formData.website_url,
//         cover_image: imageUrl,
//       };

//       const url = editingId ? CONFIG.API_PARTNER_UPDATE(editingId) : CONFIG.API_PARTNER_CREATE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

//       setSuccessMessage(editingId ? "Partenaire mis à jour avec succès !" : "Partenaire ajouté avec succès !");
//       resetForm();
//       fetchPartners();
//       setShowForm(false);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la sauvegarde");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;

//     try {
//       const res = await fetch(CONFIG.API_PARTNER_DELETE(id), { method: "DELETE" });
//       if (!res.ok) throw new Error("Erreur de suppression");
//       setSuccessMessage("Partenaire supprimé avec succès !");
//       fetchPartners();
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la suppression");
//     }
//   };

//   const handleEdit = (partner) => {
//     setEditingId(partner.id);
//     setFormData({
//       name_fr: partner.name_fr || "",
//       name_en: partner.name_en || "",
//       website_url: partner.website_url || "",
//       cover_image: null,
//     });
//     setPreview(partner.cover_image_url || null);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#F47920]" size={40} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       {/* HEADER */}
//       <div className="max-w-7xl mx-auto px-4 py-10">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
//           <div className="flex items-center gap-3">
//             <div className="bg-[#F47920]/10 p-3 rounded-xl">
//               <Factory className="w-7 h-7 text-[#F47920]" />
//             </div>
//             <h1 className="text-3xl font-black text-[#142B57]">
//               Partenaires Industriels & Commerciaux
//             </h1>
//           </div>

//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               if (showForm) resetForm();
//             }}
//             className="bg-gradient-to-r from-[#F47920] to-[#E84E1B] text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 font-semibold"
//           >
//             <PlusCircle size={18} />
//             {showForm ? "Fermer" : "Ajouter un partenaire"}
//           </button>
//         </div>

//         {/* MESSAGES */}
//         {error && (
//           <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg mb-4">
//             {error}
//           </div>
//         )}
//         {successMessage && (
//           <div className="bg-green-100 text-green-700 border border-green-300 p-4 rounded-lg mb-4">
//             {successMessage}
//           </div>
//         )}

//         {/* FORMULAIRE */}
//         {showForm && (
//           <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 mb-10">
//             <h2 className="text-xl font-bold text-[#142B57] mb-6">
//               {editingId ? "Modifier le partenaire" : "Ajouter un partenaire"}
//             </h2>

//             <div className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="font-semibold text-[#142B57] mb-1 block">Nom (FR)</label>
//                   <input
//                     type="text"
//                     name="name_fr"
//                     value={formData.name_fr}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                   />
//                 </div>
//                 <div>
//                   <label className="font-semibold text-[#142B57] mb-1 block">Name (EN)</label>
//                   <input
//                     type="text"
//                     name="name_en"
//                     value={formData.name_en}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="font-semibold text-[#142B57] mb-1 block">Site web</label>
//                 <input
//                   type="url"
//                   name="website_url"
//                   value={formData.website_url}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3"
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold text-[#142B57] mb-1 block">Logo du partenaire</label>
//                 <input
//                   type="file"
//                   name="cover_image"
//                   accept="image/*"
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg file:bg-[#F47920] file:text-white file:px-4 file:py-2 file:rounded-lg"
//                 />
//                 {preview && (
//                   <div className="mt-4">
//                     <img src={preview} className="w-40 h-40 object-contain border border-gray-200 rounded-lg bg-white" />
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="bg-gradient-to-r from-[#F47920] to-[#E84E1B] text-white px-6 py-3 rounded-xl font-bold"
//               >
//                 {loading ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* GRID PARTENAIRES */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {partners.map((partner) => (
//             <div
//               key={partner.id}
//               className="bg-white border border-gray-200 shadow hover:shadow-lg transition rounded-xl p-4 cursor-pointer"
//               onClick={() => setSelectedPartner(partner)}
//             >
//               <div className="w-full aspect-square flex items-center justify-center bg-gray-50 rounded-lg mb-3">
//                 <img
//                   src={partner.cover_image_url}
//                   alt={partner.name_en}
//                   className="w-full h-full object-contain"
//                 />
//               </div>

//               <h3 className="font-bold text-[#142B57] text-center">
//                 {partner.name_en}
//               </h3>
//               <p className="text-sm text-gray-500 text-center">
//                 {partner.name_fr}
//               </p>

//               <div className="flex gap-2 mt-4">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleEdit(partner);
//                   }}
//                   className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm"
//                 >
//                   <Edit2 size={14} />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(partner.id);
//                   }}
//                   className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* MODAL */}
//         {selectedPartner && (
//           <div
//             className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
//             onClick={() => setSelectedPartner(null)}
//           >
//             <div
//               className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-2xl font-black text-[#142B57]">
//                   {selectedPartner.name_en}
//                 </h2>
//                 <button className="text-gray-500" onClick={() => setSelectedPartner(null)}>
//                   <X size={22} />
//                 </button>
//               </div>

//               <div className="bg-gray-50 p-6 rounded-xl mb-6 text-center">
//                 <img
//                   src={selectedPartner.cover_image_url}
//                   alt={selectedPartner.name_en}
//                   className="max-h-40 w-full object-contain"
//                 />
//               </div>

//               {selectedPartner.website_url && (
//                 <a
//                   href={selectedPartner.website_url}
//                   target="_blank"
//                   className="flex items-center gap-2 text-[#142B57] font-bold mb-6"
//                 >
//                   <ExternalLink size={18} /> Visiter le site
//                 </a>
//               )}

//               <div className="flex gap-3">
//                 <button
//                   className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg"
//                   onClick={() => {
//                     handleEdit(selectedPartner);
//                     setSelectedPartner(null);
//                   }}
//                 >
//                   Modifier
//                 </button>
//                 <button
//                   className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg"
//                   onClick={() => {
//                     handleDelete(selectedPartner.id);
//                     setSelectedPartner(null);
//                   }}
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PartnerPost;


import React, { useEffect, useState } from "react";
import { Factory, Loader2, Trash2, PlusCircle, Edit2, X, ExternalLink, AlertCircle, CheckCircle2, Save } from "lucide-react";
import CONFIG from "../../config/config.js";

// 🎨 Centralisation des couleurs VIALI
const COLORS = {
  gradientStart: "#FDB71A",
  gradientMid: "#F47920",
  gradientEnd: "#E84E1B",
  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
};

// 🎯 Composants réutilisables
const GradientButton = ({ onClick, children, disabled = false, variant = "primary", className = "", type = "button" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] text-white shadow-lg shadow-orange-400/40 hover:shadow-xl hover:shadow-orange-400/50",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-400/40 hover:shadow-xl hover:shadow-red-400/50",
    secondary: "bg-white border-2 border-orange-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50",
  };

  return (
    <button
      type={type}
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
    <p className="mt-6 text-gray-700 font-semibold text-lg">Chargement des partenaires...</p>
  </div>
);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
      {/* Decorative background elements */}
      <div className="fixed top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-[#FDB71A]/10 to-[#F47920]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-[#E84E1B]/10 to-[#FDB71A]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDB71A] to-[#F47920] blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-3 rounded-2xl shadow-xl shadow-orange-400/50">
                <Factory className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A]">
                Gestion des Partenaires
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">Industriels & Commerciaux</p>
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
            <span className="hidden sm:inline">{showForm ? "Fermer le formulaire" : "Ajouter un partenaire"}</span>
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
                {editingId ? "Modifier le partenaire" : "Nouveau partenaire"}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                    Nom (Français) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_fr"
                    value={formData.name_fr}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Renault Maroc"
                    className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                    Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Renault Morocco"
                    className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Site web
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full border-2 border-gray-200 focus:border-orange-300 rounded-xl px-4 py-3 transition-colors outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-2 block text-sm md:text-base">
                  Logo du partenaire <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="cover_image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:font-bold file:cursor-pointer hover:file:shadow-lg transition-all"
                />
                {preview && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative bg-white border-2 border-orange-200 rounded-2xl p-6 shadow-lg w-48 h-48">
                      <img
                        src={preview}
                        alt="Aperçu"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <GradientButton
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{editingId ? "Mettre à jour" : "Ajouter le partenaire"}</span>
                    </>
                  )}
                </GradientButton>
                <GradientButton
                  type="button"
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

        {/* GRID PARTENAIRES */}
        {partners.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-orange-200 shadow-xl max-w-md mx-auto">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#FDB71A]/20 to-[#F47920]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Factory className="w-10 h-10 md:w-12 md:h-12 text-[#F47920]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Aucun partenaire</h3>
              <p className="text-gray-600 text-base md:text-lg">Commencez par ajouter votre premier partenaire</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className="group bg-white border-2 border-gray-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="relative aspect-square p-6 md:p-5 bg-gradient-to-br from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300">
                  <img
                    src={partner.cover_image_url}
                    alt={`Logo de ${partner.name_en}`}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 md:p-4 bg-gradient-to-r from-gray-50 to-white group-hover:from-orange-50 group-hover:to-yellow-50 transition-colors duration-300 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm text-center truncate group-hover:text-[#F47920] transition-colors">
                    {partner.name_en}
                  </h3>
                  <p className="text-xs text-gray-500 text-center truncate mt-1">
                    {partner.name_fr}
                  </p>
                </div>

                <div className="flex gap-1 p-0 md:p-2 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(partner);
                    }}
                    className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                    aria-label="Modifier le partenaire"
                  >
                    <Edit2 size={14} />
                    <span className="hidden sm:inline">Éditer</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(partner.id);
                    }}
                    className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-2 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                    aria-label="Supprimer le partenaire"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* MODAL DÉTAILS */}
        {selectedPartner && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 z-50"
            onClick={() => setSelectedPartner(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-2 border-orange-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E84E1B] via-[#F47920] to-[#FDB71A] mb-2">
                    {selectedPartner.name_en}
                  </h2>
                  <p className="text-gray-600 font-medium">{selectedPartner.name_fr}</p>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setSelectedPartner(null)}
                  aria-label="Fermer"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 p-8 md:p-12 rounded-2xl mb-6">
                <img
                  src={selectedPartner.cover_image_url}
                  alt={`Logo de ${selectedPartner.name_en}`}
                  className="max-h-48 md:max-h-64 w-full object-contain"
                />
              </div>

              {selectedPartner.website_url && (
                <a
                  href={selectedPartner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F47920] font-bold mb-6 hover:text-[#E84E1B] transition-colors group"
                >
                  <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Visiter le site web</span>
                </a>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    handleEdit(selectedPartner);
                    setSelectedPartner(null);
                  }}
                >
                  <Edit2 size={18} />
                  <span>Modifier</span>
                </button>
                <button
                  className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    handleDelete(selectedPartner.id);
                    setSelectedPartner(null);
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

export default PartnerPost;