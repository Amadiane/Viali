import React, { useEffect, useState } from "react";
import PartnerItem from "./PartnerItem";
import PartnerAPI from "../../api/PartnerAPI";

const PartnerList: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);

  const fetchPartners = () => {
    PartnerAPI.getAll()
      .then(res => setPartners(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDelete = (id: number) => {
    PartnerAPI.delete(id)
      .then(() => fetchPartners())
      .catch(err => console.error(err));
  };

  return (
    <div>
      {partners.map(p => (
        <PartnerItem key={p.id} {...p} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default PartnerList;
