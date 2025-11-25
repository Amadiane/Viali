import React, { useEffect, useState } from "react";
import CONFIG from "../../config/config.js";
import { useTranslation } from "react-i18next";
import { AlertCircle, Sparkles, ExternalLink, Layers } from "lucide-react";

const ProfessionalArea = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setError(null);
        const response = await fetch(CONFIG.API_PRO_AREA_LIST);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data = await response.json();
        const areaData = Array.isArray(data) ? data : data.results || [];
        setAreas(areaData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  return (
    <div className="min-h-screen bg-white py-16 container mx-auto px-4">
      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="font-bold text-gray-700">Professional Areas</span>
          <Sparkles className="w-4 h-4 text-orange-600" />
        </div>

        <h1 className="text-4xl font-black mt-4 text-orange-700">
          Explore Our Professional Areas
        </h1>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center py-20 text-gray-600">Chargement…</p>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20 text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3" />
          <p>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && areas.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          Aucun domaine professionnel disponible.
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {areas.map((pro) => (
          <div
            key={pro.id}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:border-orange-300 transition-all"
          >
            {/* image */}
            <div className="aspect-square bg-gray-50 p-4">
              <img
                src={pro.image_url || "/placeholder.png"}
                alt={pro.display_name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {pro.display_name}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-3 mt-2">
                {pro.description_fr}
              </p>

              <div className="mt-4 flex items-center gap-2 text-orange-600 font-semibold">
                <Layers className="w-4 h-4" />
                <span>{pro.target_group}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalArea;
