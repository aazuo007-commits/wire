import { useEffect, useState } from "react";
import api from "../api/axios.js";

/**
 * Generic CRUD manager.
 *
 * props.resource   - API path segment, e.g. "services"
 * props.title      - Display title, e.g. "Services"
 * props.fields     - Array of field descriptors:
 *                     { name, label, type: "text" | "textarea" | "number" | "checkbox" | "image" | "file" | "url", required }
 *                     - "image": image-only upload (jpg/png/gif/webp/svg), shown with a thumbnail preview
 *                     - "file": any supported upload (image, video, PDF, DOC/DOCX), shown with a smart preview
 * props.emptyItem  - Default object shape for the "create" form
 * props.columns    - Which field names to show in the list table (defaults to first 2 text fields)
 */
export default function ResourceManager({ resource, title, fields, emptyItem, columns }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [uploadingField, setUploadingField] = useState(null);
  const [resourceTypes, setResourceTypes] = useState({}); // { [fieldName]: "image" | "video" | "raw" }
  const [error, setError] = useState("");

  const displayColumns = columns || fields.filter((f) => f.type === "text").slice(0, 2).map((f) => f.name);

  const load = () => {
    setLoading(true);
    api
      .get(`/${resource}?all=true`)
      .then((res) => setItems(res.data.data))
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [resource]);

  const resetForm = () => {
    setForm(emptyItem);
    setEditingId(null);
    setResourceTypes({});
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const onFileUpload = async (name, file) => {
    if (!file) return;
    setUploadingField(name);
    try {
      const data = new FormData();
      data.append("image", file); // field name kept as "image" to match the backend route
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(name, res.data.url);
      setResourceTypes((rt) => ({ ...rt, [name]: res.data.resourceType }));
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/${resource}/${editingId}`, form);
      } else {
        await api.post(`/${resource}`, form);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({ ...emptyItem, ...item });
    setResourceTypes({});
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await api.delete(`/${resource}/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const renderUploadPreview = (f) => {
    const url = form[f.name];
    if (!url) return null;

    const guessedType =
      resourceTypes[f.name] ||
      (/\.(jpe?g|png|gif|webp|svg)$/i.test(url) ? "image" : /\.(mp4|webm|mov)$/i.test(url) ? "video" : "raw");

    if (guessedType === "image") {
      return <img src={url} alt="preview" className="admin-image-preview" />;
    }
    if (guessedType === "video") {
      return <video src={url} controls className="admin-video-preview" />;
    }
    return (
      <a href={url} target="_blank" rel="noreferrer" className="admin-file-preview">
        View uploaded file →
      </a>
    );
  };

  return (
    <div>
      <h1>{title}</h1>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? `Edit ${title}` : `Add New ${title}`}</h3>
        <div className="admin-form-grid">
          {fields.map((f) => (
            <div className="admin-form-field" key={f.name}>
              <label>{f.label}{f.required ? " *" : ""}</label>

              {f.type === "textarea" && (
                <textarea
                  rows={3}
                  value={form[f.name] ?? ""}
                  required={f.required}
                  onChange={(e) => onChange(f.name, e.target.value)}
                />
              )}

              {f.type === "checkbox" && (
                <input
                  type="checkbox"
                  checked={!!form[f.name]}
                  onChange={(e) => onChange(f.name, e.target.checked)}
                />
              )}

              {f.type === "image" && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileUpload(f.name, e.target.files[0])}
                  />
                  {uploadingField === f.name && <span className="hint">Uploading...</span>}
                  {renderUploadPreview(f)}
                </div>
              )}

              {f.type === "file" && (
                <div>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx"
                    onChange={(e) => onFileUpload(f.name, e.target.files[0])}
                  />
                  <span className="hint">Image, video (mp4/webm/mov), PDF, or DOC/DOCX</span>
                  {uploadingField === f.name && <span className="hint">Uploading...</span>}
                  {renderUploadPreview(f)}
                </div>
              )}

              {(f.type === "text" || f.type === "url" || f.type === "number" || !f.type) && (
                <input
                  type={f.type === "number" ? "number" : "text"}
                  value={form[f.name] ?? ""}
                  required={f.required}
                  onChange={(e) =>
                    onChange(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={!!uploadingField}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-wrap">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {displayColumns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {displayColumns.map((c) => (
                    <td key={c}>{String(item[c] ?? "")}</td>
                  ))}
                  <td>{item.isActive === false ? "No" : "Yes"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(item)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={displayColumns.length + 2}>No items yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
