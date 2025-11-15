import React from "react";

interface PartnerItemProps {
  id: number;
  display_name: string;
  cover_image_url?: string;
  website_url?: string;
  onDelete?: (id: number) => void;
}

const PartnerItem: React.FC<PartnerItemProps> = ({
  id,
  display_name,
  cover_image_url,
  website_url,
  onDelete,
}) => {
  return (
    <div className="partner-item">
      {cover_image_url && <img src={cover_image_url} alt={display_name} width={80} />}
      <h3>{display_name}</h3>
      {website_url && (
        <a href={website_url} target="_blank" rel="noopener noreferrer">
          {website_url}
        </a>
      )}
      {onDelete && <button onClick={() => onDelete(id)}>Supprimer</button>}
    </div>
  );
};

export default PartnerItem;
