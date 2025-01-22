import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API,
});

api.interceptors.request.use(async (config) => {
  return config;
});

export default api;
