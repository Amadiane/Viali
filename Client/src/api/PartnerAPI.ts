import http from "../config/http";
import CONFIG from "../config/config";

const PartnerAPI = {
  getAll: () => http.get(CONFIG.API_PARTNERS_LIST),
  getOne: (id: number) => http.get(CONFIG.API_PARTNERS_DETAIL(id)),
  create: (data: FormData) =>
    http.post(CONFIG.API_PARTNERS_LIST, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: number, data: FormData) =>
    http.put(CONFIG.API_PARTNERS_DETAIL(id), data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: number) => http.delete(CONFIG.API_PARTNERS_DETAIL(id)),
};

export default PartnerAPI;
