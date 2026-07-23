import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PRESETS = [3, 6, 9, 12];

export default function SiteSettings() {
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setCount(res.data.data?.homeServicesCount || 6))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/settings", { homeServicesCount: Number(count) });
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Site Settings</h1>
      <p>Control site-wide, configurable behavior.</p>

      <form className="admin-form" onSubmit={save}>
        <h3>Homepage Services</h3>
        <p>Choose how many services are shown on the homepage (the rest still appear on the full Services page).</p>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Number Of Services On Home Page</label>
            <select value={count} onChange={(e) => setCount(e.target.value)}>
              {PRESETS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Or set a custom number</label>
            <input
              type="number"
              min="1"
              max="24"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {status === "success" && <p className="form-success">Settings saved.</p>}
        {status === "error" && <p className="form-error">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
