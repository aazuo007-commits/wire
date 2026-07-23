import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PRESETS = [3, 6, 9, 12];

export default function SiteSettings() {
  const [servicesCount, setServicesCount] = useState(6);
  const [blogsCount, setBlogsCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        setServicesCount(res.data.data?.homeServicesCount || 6);
        setBlogsCount(res.data.data?.homeBlogsCount || 3);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/settings", {
        homeServicesCount: Number(servicesCount),
        homeBlogsCount: Number(blogsCount),
      });
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
        <h3>Homepage Content</h3>
        <p>Choose how many services and blog posts are shown on the homepage (the full lists still appear on the Services and Blog pages).</p>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Number Of Services On Home Page</label>
            <select value={servicesCount} onChange={(e) => setServicesCount(e.target.value)}>
              {PRESETS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Or set a custom services number</label>
            <input type="number" min="1" max="24" value={servicesCount} onChange={(e) => setServicesCount(e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Number Of Blogs On Home Page</label>
            <select value={blogsCount} onChange={(e) => setBlogsCount(e.target.value)}>
              {PRESETS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Or set a custom blogs number</label>
            <input type="number" min="1" max="24" value={blogsCount} onChange={(e) => setBlogsCount(e.target.value)} />
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
