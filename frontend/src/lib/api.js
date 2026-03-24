import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public APIs
export const getProducts = (params) => api.get("/api/products", { params });
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const getDivisions = () => api.get("/api/divisions");
export const submitLead = (data) => api.post("/api/leads", data);

// Admin APIs
export const adminLogin = (data) => api.post("/api/admin/login", data);
export const getAdminStats = () => api.get("/api/admin/stats");
export const getAdminPipeline = () => api.get("/api/admin/pipeline");
export const getAdminAnalytics = () => api.get("/api/admin/analytics");
export const getAdminLeads = (params) => api.get("/api/admin/leads", { params });
export const getAdminLead = (id) => api.get(`/api/admin/leads/${id}`);
export const updateAdminLead = (id, data) => api.put(`/api/admin/leads/${id}`, data);
export const deleteAdminLead = (id) => api.delete(`/api/admin/leads/${id}`);
export const getAdminProducts = (params) => api.get("/api/admin/products", { params });
export const createAdminProduct = (data) => api.post("/api/admin/products", data);
export const updateAdminProduct = (id, data) => api.put(`/api/admin/products/${id}`, data);
export const deleteAdminProduct = (id) => api.delete(`/api/admin/products/${id}`);

export default api;
