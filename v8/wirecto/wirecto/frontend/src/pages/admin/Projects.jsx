import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const emptyItem = {
  title: "",
  slug: "",
  client: "",
  category: "",
  description: "",
  imageUrl: "",
  gallery: [],
  technologiesUsed: "", // comma-separated in the form, converted to an array on submit
  features: "",
  challenges: "",
  solution: "",
  results: "",
  projectUrl: "",
  order: 0,
  isActive: true,
};

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/projects?all=true")
      .then((res) => setItems(res.data.data || []))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyItem);
    setEditingId(null);
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const uploadCover = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      onChange("imageUrl", res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryImages = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append("image", file);
        const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
        uploadedUrls.push(res.data.url);
      }
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...uploadedUrls] }));
    } catch (err) {
      setError(err.response?.data?.message || "Gallery upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (url) => {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((g) => g !== url) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      technologiesUsed:
        typeof form.technologiesUsed === "string"
          ? form.technologiesUsed.split(",").map((t) => t.trim()).filter(Boolean)
          : form.technologiesUsed,
    };
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...emptyItem,
      ...item,
      gallery: item.gallery || [],
      technologiesUsed: (item.technologiesUsed || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await api.delete(`/projects/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Project" : "Add New Project"}</h3>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => onChange("title", e.target.value)} required />
          </div>
          <div className="admin-form-field">
            <label>Slug (leave blank to auto-generate from title)</label>
            <input value={form.slug} onChange={(e) => onChange("slug", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Client</label>
            <input value={form.client} onChange={(e) => onChange("client", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Category / Industry</label>
            <input value={form.category} onChange={(e) => onChange("category", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Order</label>
            <input type="number" value={form.order} onChange={(e) => onChange("order", Number(e.target.value))} />
          </div>
          <div className="admin-form-field">
            <label>Project URL (optional, live link)</label>
            <input value={form.projectUrl} onChange={(e) => onChange("projectUrl", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Cover Image *</label>
            <input type="file" accept="image/*" onChange={(e) => uploadCover(e.target.files[0])} />
            {form.imageUrl && <img src={form.imageUrl} alt="cover preview" className="admin-image-preview" />}
          </div>
          <div className="admin-form-field">
            <label>Active</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => onChange("isActive", e.target.checked)} />
          </div>
        </div>

        <div className="admin-form-field" style={{ marginBottom: 16 }}>
          <label>Gallery Images (select one or more)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => uploadGalleryImages(e.target.files)} />
          {!!form.gallery.length && (
            <div className="admin-gallery-preview">
              {form.gallery.map((url) => (
                <div className="admin-gallery-thumb" key={url}>
                  <img src={url} alt="gallery" />
                  <button type="button" onClick={() => removeGalleryImage(url)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-form-field" style={{ marginBottom: 16 }}>
          <label>Technologies Used (comma-separated)</label>
          <input value={form.technologiesUsed} onChange={(e) => onChange("technologiesUsed", e.target.value)} placeholder="React, Node.js, MongoDB" />
        </div>

        <div className="admin-form-field" style={{ marginBottom: 16 }}>
          <label>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => onChange("description", e.target.value)} />
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Features</label>
            <textarea rows={3} value={form.features} onChange={(e) => onChange("features", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Challenges</label>
            <textarea rows={3} value={form.challenges} onChange={(e) => onChange("challenges", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Solution</label>
            <textarea rows={3} value={form.solution} onChange={(e) => onChange("solution", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Results</label>
            <textarea rows={3} value={form.results} onChange={(e) => onChange("results", e.target.value)} />
          </div>
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
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
                <th>Title</th>
                <th>Slug</th>
                <th>Client</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id}>
                  <td>{it.title}</td>
                  <td>{it.slug}</td>
                  <td>{it.client}</td>
                  <td>{it.isActive ? "Yes" : "No"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(it)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5}>No projects yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
