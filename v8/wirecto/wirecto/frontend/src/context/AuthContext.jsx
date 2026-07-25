import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

// Safely parses a JSON string from localStorage. Guards against the classic
// footgun where something upstream stored the literal string "undefined"
// (e.g. JSON.stringify(undefined) === undefined, and localStorage.setItem
// coerces that to the string "undefined") — JSON.parse("undefined") throws
// a SyntaxError, which used to crash the whole app on load.
function safeParse(value) {
  if (!value || value === "undefined" || value === "null") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem("wirecto_admin");
    const parsed = safeParse(raw);
    // Clean up a previously-corrupted value (e.g. the literal string "undefined")
    // so future page loads don't have to work around it.
    if (raw && parsed === null) localStorage.removeItem("wirecto_admin");
    return parsed;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("wirecto_token");
    if (!token || token === "undefined" || token === "null") {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setAdmin(res.data.admin || null))
      .catch(() => {
        localStorage.removeItem("wirecto_token");
        localStorage.removeItem("wirecto_admin");
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, admin: loggedInAdmin } = res.data || {};

    if (!token || !loggedInAdmin) {
      // The backend didn't return the expected shape (e.g. a misconfigured
      // API URL returned an HTML page instead of JSON) — fail loudly instead
      // of writing "undefined" into localStorage and corrupting the next load.
      throw new Error("Unexpected response from the server. Please check the API is reachable.");
    }

    localStorage.setItem("wirecto_token", token);
    localStorage.setItem("wirecto_admin", JSON.stringify(loggedInAdmin));
    setAdmin(loggedInAdmin);
    return loggedInAdmin;
  };

  const logout = () => {
    localStorage.removeItem("wirecto_token");
    localStorage.removeItem("wirecto_admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
