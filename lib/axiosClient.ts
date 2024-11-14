import axios from "axios";
import { getToken } from "./authService";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers["Authorization"] = `Barer ${token}`;
  }
  return config;
});

export default api;
