import axios from "axios";
import { useAuthStore } from "../auth/store";

const BASE_URL = "https://arcade-app-server.onrender.com";

export const api = axios.create({
  baseURL: `${BASE_URL}/api/staff`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function get(path, params) {
  const res = await api.get(path, { params });
  return res.data;
}

export async function post(path, body) {
  const res = await api.post(path, body || {});
  return res.data;
}


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log("API ->", config.method?.toUpperCase(), config.baseURL + config.url, "token?", !!token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});