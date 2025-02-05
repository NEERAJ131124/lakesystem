import axios from "axios";
import { baseUrl } from "../constants/APIs";

const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

export default api;
