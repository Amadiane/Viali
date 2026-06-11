import React, { useEffect, useRef, useState } from "react";
import { Upload, Save, Trash2, AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error("Échec upload Cloudinary");
  const data = await res.json();
  return data.secure_url;
};

const ImagePicker = ({ label, name, currentUrl, onUploaded, uploading, setUploading }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(currentUrl || null);
  const [error,   setError]   = useState(null);
  useEffect(() => { setPreview(currentUrl || null); }, [currentUrl]);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(name, true);
    try {
      const url = await uploadToCloudinary(file);
      onUploaded(name, url);
    } catch (err) {
      setError(err.message);
      setPreview(currentUrl || null);
    } finally { setUploading(name, false); }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div onClick={() => inputRef.current?.click()}
           className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-orange-400 bg-gray-50 cursor-pointer transition-colors flex items-center justify-center group">
        {preview
          ? <img src={preview} alt={label} className="w-full h-full object-cover"/>
          : <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-orange-400 transition-colors">
              <Upload className="w-8 h-8"/>
              <span className="text-xs font-medium">Cliquer pour uploader</span>
            </div>
        }
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin"/>
          </div>
        )}
        {preview && !uploading && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); setPreview(null); onUploaded(name, ""); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50">
            <X className="w-4 h-4 text-gray-500"/>
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
             onChange={(e) => handleFile(e.target.files?.[0])}/>
    </div>
  );
};

const BilingualField = ({ label, nameFr, nameEn, values, onChange, multiline = false }) => {
  const Tag  = multiline ? "textarea" : "input";
  const base = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-colors bg-white";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[["FR", nameFr], ["EN", nameEn]].map(([lang, name]) => (
          <div key={lang} className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{lang}</span>
            <Tag className={`${base} ${multiline ? "resize-none h-24" : ""}`}
                 value={values[name] || ""}
                 onChange={(e) => onChange(name, e.target.value)}
                 {...(!multiline ? { type: "text" } : {})}/>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// SECTION PRODUIT (titre + description + image)
// ─────────────────────────────────────────
const ProductSection = ({ label, titleFr, titleEn, descFr, descEn, imageKey, form, onChange, onUploaded, uploading, setUploading, editId }) => (
  <div className="border border-gray-100 rounded-xl p-6 flex flex-col gap-5">
    <p className="text-sm font-black uppercase tracking-widest text-orange-500">{label}</p>
    <BilingualField label="Titre" nameFr={titleFr} nameEn={titleEn} values={form} onChange={onChange}/>
    <BilingualField label="Description" nameFr={descFr} nameEn={descEn} values={form} onChange={onChange} multiline/>
    <ImagePicker
      key={`${imageKey}-${editId}`}
      label="Image"
      name={imageKey}
      currentUrl={form[imageKey]}
      onUploaded={onUploaded}
      uploading={!!uploading[imageKey]}
      setUploading={setUploading}
    />
  </div>
);

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────
const RillettePost = () => {
  const { t } = useTranslation();

  const emptyForm = {
    title_fr: "", title_en: "",
    descriptionstitle_fr: "", descriptionstitle_en: "",
    sardinetitle_fr: "", sardinetitle_en: "",
    thontitle_fr: "",    thontitle_en: "",
    capitainetitle_fr: "", capitainetitle_en: "",
    descriptionssardinerillette_fr: "", descriptionssardinerillette_en: "",
    descriptionsthonrillette_fr: "",    descriptionsthonrillette_en: "",
    descriptionscapitainerillette_fr: "", descriptionscapitainerillette_en: "",
    imagecoverrillette: "",
    image_sardine: "",
    image_thon: "",
    image_capitaine: "",
    is_active: true,
  };

  const [form,       setForm]       = useState(emptyForm);
  const [editId,     setEditId]     = useState(null);
  const [entries,    setEntries]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(null);
  const [uploadings, setUploadings] = useState({});
  const [toast,      setToast]      = useState(null);

  const showToast    = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3500); };
  const setUploading = (name, val) => setUploadings(prev => ({ ...prev, [name]: val }));
  const handleChange = (key, val)  => setForm(prev => ({ ...prev, [key]: val }));
  const handleUploaded = (name, url) => setForm(prev => ({ ...prev, [name]: url }));

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res  = await fetch(CONFIG.API_RILLETTE_PAGE_LIST);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : data.results || []);
    } catch { showToast("error", "Erreur lors du chargement"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleEdit = (entry) => {
    setEditId(entry.id);
    setForm({
      title_fr: entry.title_fr || "", title_en: entry.title_en || "",
      descriptionstitle_fr: entry.descriptionstitle_fr || "",
      descriptionstitle_en: entry.descriptionstitle_en || "",
      sardinetitle_fr: entry.sardinetitle_fr || "", sardinetitle_en: entry.sardinetitle_en || "",
      thontitle_fr:    entry.thontitle_fr    || "", thontitle_en:    entry.thontitle_en    || "",
      capitainetitle_fr: entry.capitainetitle_fr || "", capitainetitle_en: entry.capitainetitle_en || "",
      descriptionssardinerillette_fr: entry.descriptionssardinerillette_fr || "",
      descriptionssardinerillette_en: entry.descriptionssardinerillette_en || "",
      descriptionsthonrillette_fr:    entry.descriptionsthonrillette_fr    || "",
      descriptionsthonrillette_en:    entry.descriptionsthonrillette_en    || "",
      descriptionscapitainerillette_fr: entry.descriptionscapitainerillette_fr || "",
      descriptionscapitainerillette_en: entry.descriptionscapitainerillette_en || "",
      imagecoverrillette: entry.imagecoverrillette_url || "",
      image_sardine:      entry.image_sardine_url      || "",
      image_thon:         entry.image_thon_url         || "",
      image_capitaine:    entry.image_capitaine_url    || "",
      is_active: entry.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setEditId(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title_fr.trim()) { showToast("error", "Le titre (FR) est obligatoire"); return; }
    setSaving(true);
    try {
      const url    = editId ? CONFIG.API_RILLETTE_PAGE_UPDATE(editId) : CONFIG.API_RILLETTE_PAGE_CREATE;
      const method = editId ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(JSON.stringify(err)); }
      showToast("success", editId ? "Entrée mise à jour ✓" : "Entrée créée ✓");
      setEditId(null); setForm(emptyForm); fetchEntries();
    } catch (err) { showToast("error", err.message || "Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette entrée ?")) return;
    setDeleting(id);
    try {
      const res = await fetch(CONFIG.API_RILLETTE_PAGE_DELETE(id), { method: "DELETE" });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      showToast("success", "Entrée supprimée");
      if (editId === id) handleCancel();
      fetchEntries();
    } catch (err) { showToast("error", err.message); }
    finally { setDeleting(null); }
  };

  const anyUploading = Object.values(uploadings).some(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-2"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Administration</p>
          <h1 className="text-3xl font-black text-gray-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {editId ? "Modifier la page Rillettes" : "Nouvelle page Rillettes"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-8">

          {/* Titre + sous-titre page */}
          <BilingualField label="Titre principal de la page"
            nameFr="title_fr" nameEn="title_en" values={form} onChange={handleChange}/>
          <BilingualField label="Sous-titre de la page"
            nameFr="descriptionstitle_fr" nameEn="descriptionstitle_en" values={form} onChange={handleChange}/>

          {/* Image cover */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Image de couverture (hero)</p>
            <div className="max-w-xs">
              <ImagePicker key={`cover-${editId}`} label="Image cover" name="imagecoverrillette"
                currentUrl={form.imagecoverrillette} onUploaded={handleUploaded}
                uploading={!!uploadings.imagecoverrillette} setUploading={setUploading}/>
            </div>
          </div>

          <hr className="border-gray-100"/>

          {/* Sections produits */}
          <ProductSection
            label="🐟 Sardine"
            titleFr="sardinetitle_fr" titleEn="sardinetitle_en"
            descFr="descriptionssardinerillette_fr" descEn="descriptionssardinerillette_en"
            imageKey="image_sardine"
            form={form} onChange={handleChange} onUploaded={handleUploaded}
            uploading={uploadings} setUploading={setUploading} editId={editId}
          />
          <ProductSection
            label="🐠 Thon"
            titleFr="thontitle_fr" titleEn="thontitle_en"
            descFr="descriptionsthonrillette_fr" descEn="descriptionsthonrillette_en"
            imageKey="image_thon"
            form={form} onChange={handleChange} onUploaded={handleUploaded}
            uploading={uploadings} setUploading={setUploading} editId={editId}
          />
          <ProductSection
            label="🐡 Capitaine"
            titleFr="capitainetitle_fr" titleEn="capitainetitle_en"
            descFr="descriptionscapitainerillette_fr" descEn="descriptionscapitainerillette_en"
            imageKey="image_capitaine"
            form={form} onChange={handleChange} onUploaded={handleUploaded}
            uploading={uploadings} setUploading={setUploading} editId={editId}
          />

          {/* Toggle is_active */}
          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <div onClick={() => handleChange("is_active", !form.is_active)}
                 className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-orange-500" : "bg-gray-200"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`}/>
            </div>
            <span className="text-sm font-medium text-gray-700">Actif (visible sur le site)</span>
          </label>

          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button type="submit" disabled={saving || anyUploading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-orange-500 transition-all disabled:opacity-50"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin"/> Sauvegarde…</> : <><Save className="w-4 h-4"/> {editId ? "Mettre à jour" : "Créer"}</>}
            </button>
            {editId && (
              <button type="button" onClick={handleCancel}
                className="px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-full hover:border-gray-400 text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Annuler
              </button>
            )}
            {anyUploading && <span className="text-xs text-gray-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Upload en cours…</span>}
          </div>
        </form>

        {/* Liste */}
        <div className="mt-14">
          <h2 className="text-xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Entrées existantes</h2>
          {loading && <div className="flex items-center gap-3 text-gray-400 py-8"><Loader2 className="w-5 h-5 animate-spin"/><span className="text-sm">Chargement…</span></div>}
          {!loading && entries.length === 0 && <p className="text-sm text-gray-400 py-8">Aucune entrée pour le moment.</p>}
          {!loading && entries.length > 0 && (
            <div className="flex flex-col gap-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {entry.imagecoverrillette_url && (
                      <img src={entry.imagecoverrillette_url} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0"/>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {entry.title_fr || `#${entry.id}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {entry.is_active ? <span className="text-green-500 font-semibold">● Actif</span> : <span className="font-semibold">● Inactif</span>}
                        {" · "}ID {entry.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleEdit(entry)}
                      className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-full hover:border-orange-400 hover:text-orange-500 transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}
                      className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-300 hover:text-red-500 disabled:opacity-50">
                      {deleting === entry.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RillettePost;