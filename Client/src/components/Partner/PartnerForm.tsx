import React, { useState, useEffect } from "react";
import PartnerAPI from "../../api/PartnerAPI";

interface PartnerFormProps {
  partner?: any; // Si on édite, on reçoit le partner existant
  onSuccess?: () => void; // Callback après succès pour rafraîchir liste
}

const PartnerForm: React.FC<PartnerFormProps> = ({ partner, onSuccess }) => {
  // 🔹 États des champs
  const [nameFr, setNameFr] = useState(partner?.name_fr || "");
  const [nameEn, setNameEn] = useState(partner?.name_en || "");
  const [websiteUrl, setWebsiteUrl] = useState(partner?.website_url || "");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(partner?.is_active ?? true);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  // 🔹 Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // FormData pour multipart/form-data (upload images)
    const formData = new FormData();
    formData.append("name_fr", nameFr);
    formData.append("name_en", nameEn);
    formData.append("website_url", websiteUrl);
    formData.append("is_active", isActive ? "true" : "false");
    if (coverImage) formData.append("cover_image", coverImage);

    // Choix POST ou PUT
    const apiCall = partner
      ? PartnerAPI.update(partner.id, formData)
      : PartnerAPI.create(formData);

    apiCall
      .then(() => {
        alert("Opération réussie !");
        setErrors({});
        onSuccess && onSuccess();
      })
      .catch(err => {
        console.error(err);
        // Gestion des erreurs 400 de Django REST Framework
        if (err.response?.status === 400 && err.response.data) {
          setErrors(err.response.data);
        } else {
          alert("Une erreur est survenue : " + err.message);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="partner-form">
      <div>
        <label>Nom FR</label>
        <input
          value={nameFr}
          onChange={e => setNameFr(e.target.value)}
          placeholder="Nom en français"
        />
        {errors.name_fr && <p className="error">{errors.name_fr.join(", ")}</p>}
      </div>

      <div>
        <label>Nom EN</label>
        <input
          value={nameEn}
          onChange={e => setNameEn(e.target.value)}
          placeholder="Nom en anglais"
        />
        {errors.name_en && <p className="error">{errors.name_en.join(", ")}</p>}
      </div>

      <div>
        <label>Site web</label>
        <input
          value={websiteUrl}
          onChange={e => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
        />
        {errors.website_url && (
          <p className="error">{errors.website_url.join(", ")}</p>
        )}
      </div>

      <div>
        <label>Image couverture</label>
        <input type="file" onChange={e => setCoverImage(e.target.files?.[0] || null)} />
        {errors.cover_image && <p className="error">{errors.cover_image.join(", ")}</p>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />{" "}
          Actif
        </label>
      </div>

      <button type="submit">{partner ? "Modifier" : "Créer"}</button>
    </form>
  );
};

export default PartnerForm;
