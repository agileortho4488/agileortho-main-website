import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export function apiClient() {
  return axios.create({
    baseURL: API_BASE,
    timeout: 20000,
  });
}

export function getToken(type = "admin") {
  if (type === "admin") {
    return localStorage.getItem("oc_admin_token") || "";
  }
  return localStorage.getItem("oc_surgeon_token") || "";
}
