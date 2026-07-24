import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import ResourceManager from "../../components/ResourceManager.jsx";

export default function Templates() {
  const [form, setForm] = useState({ name: "", key: "", sourceUrl: "", placement: "custom" });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImport = async (e) => {
    e.preventDefault();
    setStatus("importing");
    setError("");
    try {
      await api.post("/templates/import", form);
      setStatus("success");
      setForm({ name: "", key: "", sourceUrl: "", placement: "custom" });
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Import failed");
    }
  };

  return (
    <div>
      <h1>Templates</h1>
      <p>
        Import a template (HTML or JSON) from any external REST API URL, or create one manually below.
        Once imported, reference it on the public site using its <code>key</code>.
      </p>

      <form className="admin-form" onSubmit={onImport}>
        <h3>Import Template From REST API</h3>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="admin-form-field">
            <label>Key (used to render it, e.g. "home-hero-alt") *</label>
            <input name="key" value={form.key} onChange={onChange} required />
          </div>
          <div className="admin-form-field">
            <label>Source REST API URL *</label>
            <input name="sourceUrl" placeholder="https://api.example.com/templates/1" value={form.sourceUrl} onChange={onChange} required />
          </div>
          <div className="admin-form-field">
            <label>Placement</label>
            <input name="placement" placeholder="home / about / footer / custom" value={form.placement} onChange={onChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={status === "importing"}>
          {status === "importing" ? "Importing..." : "Import Template"}
        </button>
        {status === "success" && <p className="form-success">Template imported successfully.</p>}
        {status === "error" && <p className="form-error">{error}</p>}
      </form>

      <ResourceManagerWithRefresh refreshFlag={refreshFlag} />
    </div>
  );
}

// Wraps ResourceManager so the list re-loads right after an import.
function ResourceManagerWithRefresh({ refreshFlag }) {
  return (
    <ResourceManager
      key={refreshFlag}
      resource="templates"
      title="All Templates"
      emptyItem={{ name: "", key: "", type: "html", content: "", placement: "custom", order: 0, isActive: true }}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "key", label: "Key", type: "text", required: true },
        { name: "type", label: "Type (html / json / external-url)", type: "text" },
        { name: "content", label: "Content (HTML or JSON string)", type: "textarea" },
        { name: "sourceUrl", label: "Source URL (if imported)", type: "url" },
        { name: "placement", label: "Placement", type: "text" },
        { name: "order", label: "Order", type: "number" },
        { name: "isActive", label: "Active", type: "checkbox" },
      ]}
      columns={["name", "key", "placement"]}
    />
  );
}
