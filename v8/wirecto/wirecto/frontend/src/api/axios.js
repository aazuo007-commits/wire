import axios from "axios";

// In local dev, "/api" is proxied to the backend by Vite (see vite.config.js).
// That proxy does NOT exist in a production build — when the frontend is deployed
// separately from the backend (e.g. Render static site + Render web service), a
// relative "/api" URL would hit the frontend's own host instead of the API and
// silently return the frontend's index.html instead of JSON. VITE_API_URL must be
// set at build time in production to point at the real backend, e.g.:
//   VITE_API_URL=https://wirecto-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wirecto_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("wirecto_token");
      localStorage.removeItem("wirecto_admin");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
