// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Home, Loader2, Trash2, PlusCircle } from "lucide-react";
// import CONFIG from "../../config/config.js";
// import { useTranslation } from "react-i18next";

// function HomePost() {
//   const { t } = useTranslation();
//   const [homes, setHomes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingHome, setEditingHome] = useState(null);
//   const [formData, setFormData] = useState({
//     title_fr: "",
//     title_en: "",
//     description_fr: "",
//     description_en: "",
//     image: null,
//   });
//   const [preview, setPreview] = useState(null);

//   // 🔄 Charger tous les postes Home
//   useEffect(() => {
//     fetchHomes();
//   }, []);

//   const fetchHomes = async () => {
//     setFetchLoading(true);
//     try {
//       const res = await axios.get(CONFIG.API_HOME_LIST);
//       setHomes(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors du chargement des postes Home");
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   // 📝 Gestion des champs
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, image: files[0] });
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
//       description_fr: "",
//       description_en: "",
//       image: null,
//     });
//     setPreview(null);
//     setEditingHome(null);
//   };

//   // ✅ Créer ou Mettre à jour
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       const form = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value) form.append(key, value);
//       });

//       if (editingHome && editingHome.id) {
//         // PATCH pour modifier
//         await axios.patch(CONFIG.API_HOME_UPDATE(editingHome.id), form, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setSuccessMessage("Post Home mis à jour avec succès !");
//       } else {
//         // POST pour créer
//         await axios.post(CONFIG.API_HOME_CREATE, form, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setSuccessMessage("Post Home créé avec succès !");
//       }
//       resetForm();
//       fetchHomes();
//       setShowForm(false);
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la sauvegarde");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🗑️ Supprimer un Home
//   const handleDelete = async (homeId) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce poste ?")) return;

//     try {
//       await axios.delete(CONFIG.API_HOME_DELETE(homeId));
//       setSuccessMessage("Post Home supprimé avec succès !");
//       fetchHomes();
//     } catch (err) {
//       console.error(err);
//       setError("Erreur lors de la suppression");
//     }
//   };

//   // 🔄 Préparer le formulaire pour modification
//   const handleEdit = (home) => {
//     setEditingHome(home);
//     setFormData({
//       title_fr: home.title_fr,
//       title_en: home.title_en || "",
//       description_fr: home.description_fr,
//       description_en: home.description_en || "",
//       image: null,
//     });
//     setPreview(home.image_url || null);
//     setShowForm(true);
//   };

//   if (fetchLoading) {
//     return (
//       <div className="text-center mt-20 text-gray-600 text-xl">
//         <Loader2 className="animate-spin inline-block" size={40} />
//         <p className="mt-2">Chargement...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
//           <Home size={32} />
//           {t("home.title", "Gestion des postes Home")}
//         </h1>
//         <button
//           onClick={() => {
//             setShowForm(!showForm);
//             if (showForm) resetForm();
//           }}
//           className="bg-indigo-800 text-white px-4 py-2 rounded-md hover:bg-indigo-900 transition flex items-center gap-2"
//         >
//           <PlusCircle size={18} /> {showForm ? "Fermer" : "Ajouter"}
//         </button>
//       </div>

//       {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
//       {successMessage && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage}</div>}

//       {/* 🧾 FORMULAIRE */}
//       {showForm && (
//         <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded-lg mb-8 grid gap-4">
//           <div>
//             <label className="block font-medium mb-1">Titre (FR)</label>
//             <input
//               type="text"
//               name="title_fr"
//               value={formData.title_fr}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               required
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1">Titre (EN)</label>
//             <input
//               type="text"
//               name="title_en"
//               value={formData.title_en}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1">Description (FR)</label>
//             <textarea
//               name="description_fr"
//               value={formData.description_fr}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               rows={3}
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1">Description (EN)</label>
//             <textarea
//               name="description_en"
//               value={formData.description_en}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               rows={3}
//             />
//           </div>
//           <div>
//             <label className="block font-medium mb-1">Image</label>
//             <input type="file" name="image" accept="image/*" onChange={handleChange} className="block w-full border rounded p-2" />
//             {preview && <img src={preview} alt="Aperçu" className="mt-3 w-32 h-32 object-cover rounded" />}
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-700 hover:bg-indigo-900 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Enregistrement..." : editingHome ? "Mettre à jour" : "Créer"}
//           </button>
//         </form>
//       )}

//       {/* 🖼️ LISTE DES POSTS */}
//       {homes.map((home) => (
//         <div key={home.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 mb-4">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-semibold text-gray-800">{home.title_fr}</h3>
//             <div className="flex gap-2">
//               <button onClick={() => handleEdit(home)} className="bg-yellow-200 px-3 py-1 rounded hover:bg-yellow-300 transition">✏️ Modifier</button>
//               <button onClick={() => handleDelete(home.id)} className="bg-red-200 text-red-700 px-3 py-1 rounded hover:bg-red-300 transition flex items-center gap-1">
//                 <Trash2 size={16} /> Supprimer
//               </button>
//             </div>
//           </div>
//           {home.image_url && <img src={home.image_url} alt={home.title_fr} className="mt-3 w-full max-h-64 object-cover rounded" />}
//           <p className="mt-2 text-gray-700">{home.description_fr}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default HomePost;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Home, Loader2, Trash2, PlusCircle } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

function HomePost() {
  const { t } = useTranslation();
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHome, setEditingHome] = useState(null);
  const [selectedHome, setSelectedHome] = useState(null);
  const [formData, setFormData] = useState({
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  // 🔄 Charger tous les postes Home
  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(CONFIG.API_HOME_LIST);
      setHomes(res.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des postes Home");
    } finally {
      setFetchLoading(false);
    }
  };

  // 📝 Gestion des champs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔄 Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title_fr: "",
      title_en: "",
      description_fr: "",
      description_en: "",
      image: null,
    });
    setPreview(null);
    setEditingHome(null);
  };

  // ✅ Créer ou Mettre à jour
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      if (editingHome && editingHome.id) {
        // PATCH pour modifier
        await axios.patch(CONFIG.API_HOME_UPDATE(editingHome.id), form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Post Home mis à jour avec succès !");
      } else {
        // POST pour créer
        await axios.post(CONFIG.API_HOME_CREATE, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("Post Home créé avec succès !");
      }
      resetForm();
      fetchHomes();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Supprimer un Home
  const handleDelete = async (homeId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce poste ?")) return;

    try {
      await axios.delete(CONFIG.API_HOME_DELETE(homeId));
      setSuccessMessage("Post Home supprimé avec succès !");
      fetchHomes();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression");
    }
  };

  // 🔄 Préparer le formulaire pour modification
  const handleEdit = (home) => {
    setEditingHome(home);
    setFormData({
      title_fr: home.title_fr,
      title_en: home.title_en || "",
      description_fr: home.description_fr,
      description_en: home.description_en || "",
      image: null,
    });
    setPreview(home.image_url || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin inline-block text-orange-500" size={40} />
          <p className="mt-4 text-gray-300 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Effets de fond lumineux */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-lg"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-xl">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {t("home.title", "Gestion des postes de la page Acceuil")}
            </h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="relative group w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-orange-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 font-semibold">
              <PlusCircle size={18} /> {showForm ? "Fermer" : "Ajouter"}
            </div>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 text-red-300 p-4 mb-6 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/20 border-2 border-green-500/50 text-green-300 p-4 mb-6 rounded-xl backdrop-blur-sm">
            {successMessage}
          </div>
        )}

        {/* 🧾 FORMULAIRE */}
        {showForm && (
          <div className="relative mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
            <form onSubmit={handleSubmit} className="relative bg-[#0f1729]/90 backdrop-blur-xl shadow-2xl p-6 md:p-8 rounded-2xl border-2 border-orange-500/30 grid gap-4 md:gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 mb-2">Titre (FR) *</label>
                  <input
                    type="text"
                    name="title_fr"
                    value={formData.title_fr}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-2">Titre (EN)</label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-300 mb-2">Description (FR)</label>
                <textarea
                  name="description_fr"
                  value={formData.description_fr}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-all"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-300 mb-2">Description (EN)</label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                  rows={3}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-300 mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
                />
                {preview && (
                  <div className="mt-4 relative inline-block">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl blur opacity-50"></div>
                    <img src={preview} alt="Aperçu" className="relative w-40 h-40 object-cover rounded-xl border-2 border-white/20 shadow-xl" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Enregistrement...
                    </>
                  ) : (
                    editingHome ? "Mettre à jour" : "Créer"
                  )}
                </div>
              </button>
            </form>
          </div>
        )}

        {/* 🖼️ GRID DES POSTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {homes.map((home) => (
            <div key={home.id} className="relative group cursor-pointer" onClick={() => setSelectedHome(home)}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-[#0f1729]/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-white/10 group-hover:border-orange-500/50 h-full flex flex-col">
                {/* Image */}
                {home.image_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-transparent to-transparent z-10"></div>
                    <img
                      src={home.image_url}
                      alt={home.title_fr}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center">
                    <Home size={48} className="text-white/30" />
                  </div>
                )}
                
                {/* Contenu */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {home.title_fr}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 flex-1">
                    {home.description_fr || "Aucune description"}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(home);
                      }}
                      className="flex-1 bg-blue-500/20 border border-blue-500/50 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(home.id);
                      }}
                      className="flex-1 bg-red-500/20 border border-red-500/50 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔍 MODAL DÉTAILS */}
        {selectedHome && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedHome(null)}
          >
            <div 
              className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-[#0a0e27] rounded-3xl shadow-2xl border-2 border-orange-500/30 overflow-hidden">
                {/* Header avec image */}
                {selectedHome.image_url && (
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent z-10"></div>
                    <img
                      src={selectedHome.image_url}
                      alt={selectedHome.title_fr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Contenu */}
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                        {selectedHome.title_fr}
                      </h2>
                      {selectedHome.title_en && (
                        <p className="text-lg text-blue-400 font-semibold">
                          {selectedHome.title_en}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedHome(null)}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4 mb-6">
                    {selectedHome.description_fr && (
                      <div className="bg-white/5 p-4 rounded-xl border border-orange-500/30">
                        <p className="text-xs font-bold text-orange-400 mb-2">🇫🇷 FRANÇAIS</p>
                        <p className="text-gray-300 leading-relaxed">{selectedHome.description_fr}</p>
                      </div>
                    )}
                    {selectedHome.description_en && (
                      <div className="bg-white/5 p-4 rounded-xl border border-blue-500/30">
                        <p className="text-xs font-bold text-blue-400 mb-2">🇬🇧 ENGLISH</p>
                        <p className="text-gray-300 leading-relaxed">{selectedHome.description_en}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        handleEdit(selectedHome);
                        setSelectedHome(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition-all font-bold"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedHome.id);
                        setSelectedHome(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-red-500/50 transition-all font-bold"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePost;