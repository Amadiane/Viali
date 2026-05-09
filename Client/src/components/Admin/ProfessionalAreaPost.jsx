import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  Search, Eye, Edit2, Trash2, X, Loader2, RefreshCw, PlusCircle,
  ChevronLeft, ChevronRight, Save, Image as ImageIcon, Handshake, Globe,
  MessageSquare, Mail, Clock, CheckCircle, Building2, Briefcase, FileText, User
} from "lucide-react";

// ── Styles globaux lightbox + effets images ──
const globalStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .admin-img {
    transition: transform .5s ease, box-shadow .4s;
    cursor: zoom-in;
  }
  .admin-img:hover {
    transform: scale(1.012);
    box-shadow: 0 16px 48px rgba(244,121,32,.22);
  }
`;

// ══════════════════════════════════════════════════════
//  LIGHTBOX — inspiré de Portfolio.jsx
// ══════════════════════════════════════════════════════
const Lightbox = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,.92)",
        zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn .2s ease",
        cursor: "zoom-out",
      }}
    >
      <img
        src={src}
        style={{ maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain", borderRadius: 10 }}
        alt=""
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 20,
          width: 44, height: 44, borderRadius: 12,
          background: "rgba(255,255,255,.18)", border: "none",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <X size={20} color="#fff" />
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  Bloc image réutilisable (pleine largeur + lightbox)
//  Inspiré de Portfolio.jsx : width 100%, height auto,
//  stripe dégradée en bas, hover scale, click → lightbox
// ══════════════════════════════════════════════════════
const SectionImage = ({ src, alt, onLightbox, coverMode = false }) => {
  if (!src) return null;
  return (
    <div style={{ position: "relative", lineHeight: 0, marginBottom: 16 }}>
      <div style={{ overflow: "hidden", borderRadius: coverMode ? 12 : 16, position: "relative", background: "#f9fafb" }}>
        <img
          src={src}
          alt={alt || ""}
          className="admin-img"
          style={{
            width: "100%",
            height: coverMode ? 200 : "auto",
            display: "block",
            objectFit: "cover",
          }}
          loading="lazy"
          onClick={() => onLightbox(src)}
          onError={e => { e.target.style.display = "none"; }}
        />
        {/* Stripe dégradée — même que Portfolio.jsx */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, #FDB71A, #F47920)",
          pointerEvents: "none",
        }} />
        {coverMode && (
          <span style={{
            position: "absolute", top: 8, left: 8,
            background: "linear-gradient(90deg,#FDB71A,#F47920)",
            color: "#fff", fontSize: 10, fontWeight: 900,
            padding: "3px 10px", borderRadius: 20,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <ImageIcon size={10} /> Couverture Hero
          </span>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  ONGLET MESSAGES CONTACT PROFESSIONNEL
// ══════════════════════════════════════════════════════
const MessagesProTab = ({ onNonLusChange }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const getValidToken = async () => {
    let token = localStorage.getItem("access");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now() + 30000;
      if (isExpired) {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) return null;
        const res = await fetch(`${CONFIG.BASE_URL}/api/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        localStorage.setItem("access", data.access);
        token = data.access;
      }
    } catch {}
    return token;
  };

  const fetchMessages = async () => {
    setLoading(true); setError(null);
    try {
      const token = await getValidToken();
      if (!token) throw new Error("Session expirée — veuillez vous reconnecter.");
      const res = await fetch(`${CONFIG.BASE_URL}/api/contact-professionnel/`, {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Erreur ${res.status}`);
      }
      const data = await res.json();
      const msgs = Array.isArray(data) ? data : data.results || [];
      setMessages(msgs);
      if (onNonLusChange) onNonLusChange(msgs.filter(m => !m.est_lu).length);
    } catch (err) {
      setError(err.message || "Erreur chargement messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id) => {
    try {
      const token = await getValidToken();
      if (!token) return;
      const res = await fetch(`${CONFIG.BASE_URL}/api/contact-professionnel/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ est_lu: true }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(`Erreur marquage lu : ${errData.detail || res.status}`);
        return;
      }
      const updated = await res.json();
      if (!updated.est_lu) {
        setError("Impossible de marquer comme lu. Vérifiez que est_lu n'est pas read_only dans le serializer Django.");
        return;
      }
      setMessages(prev => {
        const msgs = prev.map(m => m.id === id ? { ...m, est_lu: true } : m);
        if (onNonLusChange) onNonLusChange(msgs.filter(m => !m.est_lu).length);
        return msgs;
      });
      setSelected(prev => prev && prev.id === id ? { ...prev, est_lu: true } : prev);
    } catch (err) {
      setError("Erreur mise à jour");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      const token = await getValidToken();
      if (!token) return;
      await fetch(`${CONFIG.BASE_URL}/api/contact-professionnel/${id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
      setSuccess("Message supprimé !"); setSelected(null);
      await fetchMessages();
    } catch { setError("Erreur suppression"); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const nonLus = messages.filter(m => !m.est_lu).length;

  return (
    <div className="space-y-6">
      <style>{globalStyles}</style>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Messages Professionnels</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
              {nonLus > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                  {nonLus} non lu{nonLus > 1 ? "s" : ""}
                </span>
              )}
              {messages.length} message{messages.length > 1 ? "s" : ""} au total
            </p>
          </div>
        </div>
        <button onClick={fetchMessages} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </button>
      </div>

      {error   && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium flex justify-between"><span>{error}</span><button onClick={() => setError(null)}><X size={16}/></button></div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium flex justify-between"><span>{success}</span><button onClick={() => setSuccess(null)}><X size={16}/></button></div>}

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center"><Loader2 className="w-10 h-10 text-[#F47920] animate-spin mx-auto"/></div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            <p className="font-semibold">Aucun message pour le moment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(msg => (
              <div key={msg.id}
                   className={`p-5 hover:bg-gray-50 transition-colors ${!msg.est_lu ? "bg-orange-50/40 border-l-4 border-[#FF8C00]" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-black text-gray-900 text-base">{msg.nom}</span>
                      {!msg.est_lu ? (
                        <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">🔴 Nouveau</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">✓ Lu</span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3"/> {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {msg.email}</span>
                      {msg.entreprise && <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {msg.entreprise}</span>}
                      {msg.poste     && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {msg.poste}</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600 mb-2">
                      <FileText className="w-3 h-3"/> {msg.sujet}
                    </span>
                    <p className="text-sm text-gray-600 line-clamp-1">{msg.message}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setSelected(msg)}
                      className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-xs font-bold rounded-xl hover:scale-105 transition-all">
                      <Eye size={13}/> Voir
                    </button>
                    <button onClick={() => deleteMessage(msg.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:scale-105 transition-all">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
             onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
               onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative flex-shrink-0">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
                      onClick={() => setSelected(null)}><X className="w-5 h-5 text-white"/></button>
              <h2 className="text-xl font-black text-white pr-12">{selected.sujet}</h2>
              <p className="text-white/80 text-sm mt-1">{formatDate(selected.created_at)}</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User,      label: "Nom",        value: selected.nom },
                  { icon: Mail,      label: "Email",      value: selected.email },
                  { icon: Building2, label: "Entreprise", value: selected.entreprise || "—" },
                  { icon: Briefcase, label: "Poste",      value: selected.poste || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Icon className="w-3 h-3"/> {label}
                    </p>
                    <p className="font-bold text-gray-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-orange-50/50 rounded-2xl p-5 border-l-4 border-[#FF8C00]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">{selected.message}</p>
              </div>
              {selected.est_lu ? (
                <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 font-bold rounded-2xl border-2 border-green-200">
                  <CheckCircle className="w-5 h-5"/> Message lu
                </div>
              ) : (
                <button onClick={() => markAsRead(selected.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 active:scale-95 transition-all">
                  <CheckCircle className="w-5 h-5"/> Marquer comme lu
                </button>
              )}
              <a href={`mailto:${selected.email}?subject=Re: ${selected.sujet}`}
                 className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white font-bold rounded-2xl hover:scale-[1.02] transition-all">
                <Mail className="w-5 h-5"/> Répondre par email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  ONGLET PARTENAIRES RECHERCHE
// ══════════════════════════════════════════════════════
const PartnersTab = () => {
  const [partners, setPartners]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);
  const [preview, setPreview]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lightbox, setLightbox]     = useState(null);

  const emptyForm = { name: "", website_url: "", is_active: true, cover_image: null };
  const [form, setForm] = useState(emptyForm);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/`);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : data.results || []);
    } catch { setError("Erreur chargement partenaires"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchPartners(); }, []);

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (files) {
      setForm(p => ({ ...p, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setForm(p => ({ ...p, [name]: checked }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      let cover_image = form.cover_image;
      if (cover_image && typeof cover_image !== "string") cover_image = await uploadToCloudinary(cover_image);
      const payload = { name: form.name, website_url: form.website_url, is_active: form.is_active, cover_image };
      const method  = editingId ? "PATCH" : "POST";
      const url     = editingId
        ? `${CONFIG.BASE_URL}/api/recherche-partners/${editingId}/`
        : `${CONFIG.BASE_URL}/api/recherche-partners/`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("access")}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSuccess(editingId ? "Partenaire mis à jour !" : "Partenaire ajouté !");
      setForm(emptyForm); setPreview(null); setEditingId(null); setShowForm(false);
      await fetchPartners();
    } catch { setError("Erreur lors de la sauvegarde"); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, website_url: p.website_url || "", is_active: p.is_active, cover_image: p.cover_image_url || null });
    setPreview(p.cover_image_url || null);
    setEditingId(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/${id}/`, { method: "DELETE" });
      setSuccess("Partenaire supprimé !"); await fetchPartners();
    } catch { setError("Erreur suppression"); }
  };

  const toggleActive = async (p) => {
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche-partners/${p.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("access")}` },
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      await fetchPartners();
    } catch { setError("Erreur mise à jour statut"); }
  };

  return (
    <div className="space-y-6">
      <style>{globalStyles}</style>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FDB71A] to-[#F47920] rounded-2xl flex items-center justify-center shadow-lg">
            <Handshake className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Partenaires Recherche</h2>
            <p className="text-sm text-gray-500">Partenaires affichés uniquement sur la page R&D</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPartners}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all">
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
          <button onClick={() => { setShowForm(!showForm); if (!showForm) { setForm(emptyForm); setPreview(null); setEditingId(null); } }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            {showForm ? <><X className="w-4 h-4" /> Fermer</> : <><PlusCircle className="w-4 h-4" /> Ajouter</>}
          </button>
        </div>
      </div>

      {error   && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-medium flex justify-between"><span>{error}</span><button onClick={() => setError(null)}><X size={16}/></button></div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium flex justify-between"><span>{success}</span><button onClick={() => setSuccess(null)}><X size={16}/></button></div>}

      {showForm && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-1 h-7 bg-gradient-to-b from-[#FDB71A] to-[#F47920] rounded-full"></div>
            <h3 className="text-xl font-black text-gray-900">{editingId ? "Modifier le partenaire" : "Nouveau partenaire"}</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nom du partenaire *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Ex: Google, ONU, Banque Mondiale..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><Globe className="w-4 h-4"/> Site web</label>
                <input type="url" name="website_url" value={form.website_url} onChange={handleChange}
                  placeholder="https://exemple.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Logo / Image</label>
              <input type="file" name="cover_image" accept="image/*" onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer" />
              {/* ── Preview logo — pleine largeur + lightbox ── */}
              {preview && (
                <div style={{ marginTop: 12, position: "relative", lineHeight: 0 }}>
                  <div style={{ overflow: "hidden", borderRadius: 12, position: "relative", background: "#f9fafb" }}>
                    <img
                      src={preview}
                      alt="preview logo"
                      className="admin-img"
                      style={{ width: "100%", height: "auto", display: "block", objectFit: "cover", maxHeight: 180 }}
                      onClick={() => setLightbox(preview)}
                    />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#FDB71A,#F47920)", pointerEvents: "none" }} />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange}
                className="w-5 h-5 accent-orange-500 cursor-pointer" />
              <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">
                Actif — visible sur la page Recherche & Développement
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Enregistrement...</> : <><Save className="w-4 h-4"/> {editingId ? "Mettre à jour" : "Ajouter"}</>}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setForm(emptyForm); setPreview(null); setEditingId(null); setShowForm(false); }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400 transition-all">
                  <X className="w-4 h-4"/> Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Liste partenaires */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
            Liste
            <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{partners.length}</span>
          </h3>
        </div>
        {loading ? (
          <div className="py-12 text-center"><Loader2 className="w-10 h-10 text-[#F47920] animate-spin mx-auto"/></div>
        ) : partners.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Handshake className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            <p className="font-semibold">Aucun partenaire pour le moment</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {partners.map(p => (
              <div key={p.id} className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all overflow-hidden">
                {/* Logo — pleine largeur + lightbox */}
                <div style={{ position: "relative", lineHeight: 0 }}>
                  {p.cover_image_url ? (
                    <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0", position: "relative", background: "#fff" }}>
                      <img
                        src={p.cover_image_url}
                        alt={p.name}
                        className="admin-img"
                        style={{ width: "100%", height: 120, display: "block", objectFit: "contain", padding: 12 }}
                        onClick={() => setLightbox(p.cover_image_url)}
                      />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#FDB71A,#F47920)", pointerEvents: "none" }} />
                    </div>
                  ) : (
                    <div className="h-28 bg-white flex items-center justify-center border-b border-gray-100" style={{ borderRadius: "12px 12px 0 0" }}>
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
                        <Handshake className="w-10 h-10 text-gray-300"/>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-black text-gray-900 truncate mb-1">{p.name}</p>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-orange-500 hover:underline truncate block mb-2">{p.website_url}</a>
                  )}
                  <button onClick={() => toggleActive(p)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      p.is_active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? "bg-green-500" : "bg-gray-400"}`}></span>
                    {p.is_active ? "Actif" : "Inactif"}
                  </button>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button onClick={() => handleEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">
                    <Edit2 size={13}/> Modifier
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">
                    <Trash2 size={13}/> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════
//  COMPOSANT PRINCIPAL avec onglets
// ══════════════════════════════════════════════════════
const ProfessionalAreaPost = () => {
  const [activeTab, setActiveTab]       = useState("recherche");
  const [nonLusCount, setNonLusCount]   = useState(0);
  const [recherches, setRecherches]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError]               = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedRecherche, setSelectedRecherche] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [showList, setShowList]   = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [previews, setPreviews]   = useState({});

  // ── Lightbox global pour l'onglet Recherche ──
  const [lightbox, setLightbox] = useState(null);

  const [formData, setFormData] = useState({
    title1_fr:"", title2_fr:"", title3_fr:"", title4_fr:"", title5_fr:"",
    title1_en:"", title2_en:"", title3_en:"", title4_en:"", title5_en:"",
    content1_fr:"", content2_fr:"", content3_fr:"", content4_fr:"", content5_fr:"",
    content1_en:"", content2_en:"", content3_en:"", content4_en:"", content5_en:"",
    image_1:null, image_2:null, image_3:null, image_4:null, image_5:null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRecherches = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${CONFIG.BASE_URL}/api/recherche/`);
      const data = await res.json();
      setRecherches(data.results || data);
    } catch { setError("Erreur lors du chargement"); }
    finally { setLoading(false); setFetchLoading(false); }
  };

  useEffect(() => { fetchRecherches(); }, []);

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);
    try {
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_NAME}/image/upload`, { method:"POST", body:fd });
      const data = await res.json();
      return data.secure_url;
    } catch { return null; }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(p => ({ ...p, [name]: files[0] }));
      setPreviews(p => ({ ...p, [name]: URL.createObjectURL(files[0]) }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      title1_fr:"", title2_fr:"", title3_fr:"", title4_fr:"", title5_fr:"",
      title1_en:"", title2_en:"", title3_en:"", title4_en:"", title5_en:"",
      content1_fr:"", content2_fr:"", content3_fr:"", content4_fr:"", content5_fr:"",
      content1_en:"", content2_en:"", content3_en:"", content4_en:"", content5_en:"",
      image_1:null, image_2:null, image_3:null, image_4:null, image_5:null,
    });
    setPreviews({}); setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccessMessage(null);
    try {
      const imageUploads = {};
      for (let i = 1; i <= 5; i++) {
        const k = `image_${i}`;
        if (formData[k] && typeof formData[k] !== "string") imageUploads[k] = await uploadToCloudinary(formData[k]);
        else if (typeof formData[k] === "string") imageUploads[k] = formData[k];
      }
      const payload = { ...formData, ...imageUploads };
      const method  = editingId ? "PATCH" : "POST";
      const url     = editingId ? `${CONFIG.BASE_URL}/api/recherche/${editingId}/` : `${CONFIG.BASE_URL}/api/recherche/`;
      const res = await fetch(url, { method, headers:{"Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("access")}`}, body:JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setSuccessMessage(editingId ? "Recherche mise à jour !" : "Recherche ajoutée !");
      resetForm(); await fetchRecherches(); setShowForm(false); setShowList(true);
      window.scrollTo({ top:0, behavior:"smooth" });
    } catch { setError("Erreur lors de la sauvegarde"); }
    finally { setLoading(false); }
  };

  const handleEdit = (r) => {
    setFormData({
      title1_fr:r.title1_fr||"", title2_fr:r.title2_fr||"", title3_fr:r.title3_fr||"", title4_fr:r.title4_fr||"", title5_fr:r.title5_fr||"",
      title1_en:r.title1_en||"", title2_en:r.title2_en||"", title3_en:r.title3_en||"", title4_en:r.title4_en||"", title5_en:r.title5_en||"",
      content1_fr:r.content1_fr||"", content2_fr:r.content2_fr||"", content3_fr:r.content3_fr||"", content4_fr:r.content4_fr||"", content5_fr:r.content5_fr||"",
      content1_en:r.content1_en||"", content2_en:r.content2_en||"", content3_en:r.content3_en||"", content4_en:r.content4_en||"", content5_en:r.content5_en||"",
      image_1:r.image_1_url||r.image_1, image_2:r.image_2_url||r.image_2,
      image_3:r.image_3_url||r.image_3, image_4:r.image_4_url||r.image_4, image_5:r.image_5_url||r.image_5,
    });
    setPreviews({
      image_1:r.image_1_url||r.image_1, image_2:r.image_2_url||r.image_2,
      image_3:r.image_3_url||r.image_3, image_4:r.image_4_url||r.image_4, image_5:r.image_5_url||r.image_5,
    });
    setEditingId(r.id); setShowForm(true); setShowList(false);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const deleteRecherche = async (id) => {
    if (!window.confirm("Supprimer cette recherche ?")) return;
    try {
      await fetch(`${CONFIG.BASE_URL}/api/recherche/${id}/`, { method:"DELETE" });
      setSuccessMessage("Recherche supprimée !"); await fetchRecherches(); setSelectedRecherche(null);
    } catch { setError("Erreur suppression"); }
  };

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems     = recherches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(recherches.length / itemsPerPage);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto mb-4"/>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <style>{globalStyles}</style>

      {/* Lightbox global onglet Recherche */}
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />

      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FDB71A] to-[#E84E1B] rounded-2xl flex items-center justify-center shadow-lg">
                <Search className="text-white w-7 h-7"/>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">Espace Professionnel</h1>
                <p className="text-gray-500 font-medium mt-1">Gestion du contenu R&D et des partenaires</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ONGLETS ── */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
          {[
            { key: "recherche", label: "Contenu R&D",     icon: <Search className="w-4 h-4"/> },
            { key: "partners",  label: "Partenaires R&D", icon: <Handshake className="w-4 h-4"/> },
            { key: "messages",  label: "Messages", icon: <MessageSquare className="w-4 h-4"/>, badge: nonLusCount },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              {tab.icon} {tab.label}
              {tab.badge > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center ${
                  activeTab === tab.key ? "bg-white text-[#F47920]" : "bg-red-500 text-white"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {error          && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 font-medium flex justify-between"><span>{error}</span><button onClick={()=>setError(null)}><X size={16}/></button></div>}
        {successMessage && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-green-700 font-medium flex justify-between"><span>{successMessage}</span><button onClick={()=>setSuccessMessage(null)}><X size={16}/></button></div>}

        {/* ── ONGLET PARTENAIRES ── */}
        {activeTab === "partners" && <PartnersTab />}

        {/* ── ONGLET MESSAGES ── */}
        {activeTab === "messages" && <MessagesProTab onNonLusChange={setNonLusCount} />}

        {/* ── ONGLET RECHERCHE ── */}
        {activeTab === "recherche" && (
          <>
            <div className="flex gap-3 mb-6 flex-wrap">
              <button onClick={fetchRecherches} disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-gray-300 transition-all disabled:opacity-50">
                <RefreshCw className={`w-5 h-5 ${loading?"animate-spin":""}`}/> Actualiser
              </button>
              <button onClick={() => { setShowForm(!showForm); if (!showForm) { resetForm(); setShowList(false); } else { setShowList(true); } }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                {showForm ? <><X className="w-5 h-5"/> Fermer</> : <><PlusCircle className="w-5 h-5"/> Nouvelle Recherche</>}
              </button>
            </div>

            {/* Formulaire Recherche */}
            {showForm && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#FDB71A] to-[#E84E1B] rounded-full"></div>
                    <h3 className="text-2xl font-bold text-gray-900">{editingId ? "Modifier la recherche" : "Nouvelle recherche"}</h3>
                  </div>

                  {[1,2,3,4,5].map(num => (
                    <div key={num} className={`mb-8 p-6 rounded-2xl border ${
                      num === 5
                        ? "bg-gradient-to-br from-orange-50 to-yellow-50 border-[#F47920]/40 ring-2 ring-[#F47920]/20"
                        : "bg-gray-50 border-gray-200"
                    }`}>
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg flex items-center justify-center font-black">{num}</span>
                        Section {num}
                        {num === 5 && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-xs font-black rounded-full shadow-sm ml-2">
                            <ImageIcon className="w-3 h-3" /> Image de couverture (Hero public)
                          </span>
                        )}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Titre (FR)</label>
                          <input type="text" name={`title${num}_fr`} value={formData[`title${num}_fr`]} onChange={handleChange}
                            placeholder={`Titre section ${num}`} maxLength={30}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Title (EN)</label>
                          <input type="text" name={`title${num}_en`} value={formData[`title${num}_en`]} onChange={handleChange}
                            placeholder={`Section ${num} title`} maxLength={30}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] focus:ring-2 focus:ring-[#F47920]/20 transition-all bg-white font-medium"/>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Contenu (FR)</label>
                          <textarea name={`content${num}_fr`} value={formData[`content${num}_fr`]} onChange={handleChange} rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold text-gray-700 text-sm">Content (EN)</label>
                          <textarea name={`content${num}_en`} value={formData[`content${num}_en`]} onChange={handleChange} rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#F47920] transition-all bg-white font-medium resize-none"></textarea>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#E84E1B]"/>
                          {num === 5 ? (
                            <>
                              <span className="text-[#E84E1B] font-black">★ Image de couverture (Hero)</span>
                              <span className="text-gray-500 font-normal">— utilisée comme fond de la page publique R&D</span>
                            </>
                          ) : `Image ${num}`}
                        </label>
                        <input type="file" name={`image_${num}`} accept="image/*" onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gradient-to-r file:from-[#FDB71A] file:to-[#F47920] file:text-white file:cursor-pointer"/>
                        {num === 5 && (
                          <p className="text-xs text-[#F47920] font-semibold flex items-center gap-1">
                            <span>💡</span>
                            Conseil : utilisez une image large (min. 1200×600 px) pour un rendu optimal en couverture.
                          </p>
                        )}
                        {/* ── Preview image formulaire — pleine largeur + lightbox ── */}
                        {previews[`image_${num}`] && (
                          <SectionImage
                            src={previews[`image_${num}`]}
                            alt={`Aperçu section ${num}`}
                            onLightbox={setLightbox}
                            coverMode={num === 5}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                    <button type="submit" disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#E84E1B] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
                      {loading ? <><Loader2 className="animate-spin w-5 h-5"/> Enregistrement...</> : <><Save className="w-5 h-5"/> {editingId ? "Mettre à jour" : "Créer"}</>}
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

            {/* Liste Recherches */}
            {showList && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Liste des recherches
                    <span className="bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white px-3 py-1 rounded-full text-sm font-bold">{recherches.length}</span>
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12"><Loader2 className="w-12 h-12 text-[#F47920] animate-spin mx-auto"/></div>
                  ) : recherches.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                      <p className="font-semibold">Aucune recherche</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 mb-6">
                        {currentItems.map(r => (
                          <div key={r.id} className="group bg-white/60 rounded-2xl shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#FDB71A]/50 transition-all p-6">
                            {/* ── Aperçu couverture (image_5) — pleine largeur + lightbox ── */}
                            {(r.image_5_url || r.image_5) && (
                              <SectionImage
                                src={r.image_5_url || r.image_5}
                                alt="Couverture Hero"
                                onLightbox={setLightbox}
                                coverMode={true}
                              />
                            )}
                            <h4 className="text-xl font-black text-gray-800 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E84E1B] group-hover:to-[#FDB71A] transition-all">
                              Recherche #{r.id}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                              {[1,2,3,4,5].map(num => r[`title${num}_fr`] && (
                                <div key={num} className="text-sm">
                                  <span className="font-semibold text-gray-500">Section {num}:</span>
                                  <p className="text-gray-800 font-medium truncate">{r[`title${num}_fr`]}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                              <button onClick={() => setSelectedRecherche(r)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all">
                                <Eye size={15}/> Voir
                              </button>
                              <button onClick={() => handleEdit(r)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all">
                                <Edit2 size={15}/> Modifier
                              </button>
                              <button onClick={() => deleteRecherche(r.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all">
                                <Trash2 size={15}/> Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-200">
                          <button onClick={() => setCurrentPage(p => p-1)} disabled={currentPage===1}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
                          {[...Array(totalPages)].map((_,i) => (
                            <button key={i} onClick={() => setCurrentPage(i+1)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage===i+1 ? "bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                              {i+1}
                            </button>
                          ))}
                          <button onClick={() => setCurrentPage(p => p+1)} disabled={currentPage===totalPages}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── MODAL DÉTAIL — images pleine largeur + lightbox ── */}
      {selectedRecherche && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
             onClick={() => setSelectedRecherche(null)}>
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
               onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#FDB71A] via-[#F47920] to-[#E84E1B] p-6 relative">
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                      onClick={() => setSelectedRecherche(null)}><X className="w-5 h-5 text-white"/></button>
              <h2 className="text-2xl font-bold text-white pr-12">Recherche #{selectedRecherche.id}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {[1,2,3,4,5].map(num => (
                <div key={num} className={`p-6 rounded-2xl mb-4 ${num === 5 ? "bg-gradient-to-br from-orange-50 to-yellow-50 border border-[#F47920]/30" : "bg-gray-50"}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-lg flex items-center justify-center font-black">{num}</span>
                    Section {num}
                    {num === 5 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white text-xs font-black rounded-full ml-1">
                        <ImageIcon className="w-3 h-3"/> Image de couverture
                      </span>
                    )}
                  </h3>
                  {selectedRecherche[`title${num}_fr`] && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm font-semibold text-gray-500 mb-1">Titre (FR)</p><p className="font-bold">{selectedRecherche[`title${num}_fr`]}</p></div>
                      {selectedRecherche[`title${num}_en`] && <div><p className="text-sm font-semibold text-gray-500 mb-1">Title (EN)</p><p className="font-bold">{selectedRecherche[`title${num}_en`]}</p></div>}
                    </div>
                  )}
                  {selectedRecherche[`content${num}_fr`] && (
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm font-semibold text-gray-500 mb-1">Contenu (FR)</p><p className="text-sm leading-relaxed">{selectedRecherche[`content${num}_fr`]}</p></div>
                      {selectedRecherche[`content${num}_en`] && <div><p className="text-sm font-semibold text-gray-500 mb-1">Content (EN)</p><p className="text-sm leading-relaxed">{selectedRecherche[`content${num}_en`]}</p></div>}
                    </div>
                  )}
                  {/* ── Image section — pleine largeur + lightbox ── */}
                  {(selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]) && (
                    <SectionImage
                      src={selectedRecherche[`image_${num}_url`] || selectedRecherche[`image_${num}`]}
                      alt={`Section ${num}`}
                      onLightbox={setLightbox}
                      coverMode={num === 5}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-200">
              <button onClick={() => { handleEdit(selectedRecherche); setSelectedRecherche(null); }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FDB71A] to-[#F47920] text-white rounded-xl font-bold hover:scale-105 transition-all">
                <Edit2 className="w-5 h-5"/> Modifier
              </button>
              <button onClick={() => setSelectedRecherche(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                <X className="w-4 h-4"/> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAreaPost;