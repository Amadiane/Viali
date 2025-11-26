import { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import {
  PlusCircle,
  Image as ImageIcon,
  Loader2,
  Edit2,
  Trash2,
  X,
  Eye
} from "lucide-react";

const NewsPost = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // FORM STATES
  const [title_fr, setTitleFr] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [content_fr, setContentFr] = useState("");
  const [content_en, setContentEn] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState(null);

  // -----------------------------
  // FETCH NEWS LIST
  // -----------------------------
  const fetchNews = async () => {
    try {
      const res = await fetch(`${CONFIG.BASE_URL}/api/news/`);
      const data = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // -----------------------------
  // CLOUDINARY UPLOAD
  // -----------------------------
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

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
  };

  // -----------------------------
  // CREATE OR UPDATE NEWS
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${CONFIG.BASE_URL}/api/news/${editingId}/`
        : `${CONFIG.BASE_URL}/api/news/`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await res.json();
      fetchNews();
      resetForm();
    } catch (error) {
      console.error("SAVE ERROR:", error);
    }

    setLoading(false);
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const deleteNews = async (id) => {
    if (!window.confirm("Supprimer cette actualité ?")) return;

    try {
      await fetch(`${CONFIG.BASE_URL}/api/news/${id}/`, {
        method: "DELETE",
      });
      fetchNews();
      setSelectedNews(null);
    } catch (error) {
      console.error("DELETE ERROR:", error);
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
    setIsActive(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-500" /> Gestion des Actualités
      </h2>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md border mb-10"
      >
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Modifier l'actualité" : "Créer une actualité"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-medium">Titre (FR)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title_fr}
              onChange={(e) => setTitleFr(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-medium">Title (EN)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title_en}
              onChange={(e) => setTitleEn(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="font-medium">Contenu (FR)</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={content_fr}
            onChange={(e) => setContentFr(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="font-medium">Content (EN)</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={content_en}
            onChange={(e) => setContentEn(e.target.value)}
          ></textarea>
        </div>

        {/* isActive */}
        <div className="flex items-center gap-2 mb-4">
          <label className="font-medium">Actif ?</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="font-medium flex items-center gap-2">
            <ImageIcon /> Image
          </label>

          <input
            type="file"
            className="mt-2"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" />}
          {editingId ? "Mettre à jour" : "Créer"}
        </button>
      </form>

      {/* LISTE NEWS */}
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Eye /> Liste des actualités
      </h3>

      <div className="grid gap-6">
        {newsList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition p-4 flex gap-4"
            onClick={() => setSelectedNews(item)}
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt=""
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}

            <div className="flex-1">
              <h4 className="text-lg font-bold">{item.title_fr}</h4>
              <p className="text-gray-600 text-sm line-clamp-2">
                {item.content_fr}
              </p>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editNews(item);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded flex items-center gap-1"
                >
                  <Edit2 size={16} />
                  Modifier
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNews(item.id);
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NEWS DETAIL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setSelectedNews(null)}
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-3">{selectedNews.title_fr}</h2>

            {selectedNews.image_url && (
              <img
                src={selectedNews.image_url}
                className="w-full max-h-72 object-cover rounded-lg mb-4"
                alt=""
              />
            )}

            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedNews.content_fr}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded"
                onClick={() => {
                  editNews(selectedNews);
                  setSelectedNews(null);
                }}
              >
                Modifier
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => deleteNews(selectedNews.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPost;


