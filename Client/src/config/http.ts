import axios from "axios";
import CONFIG from "../config/config";

const http = axios.create({
  baseURL: CONFIG.BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export default http;
