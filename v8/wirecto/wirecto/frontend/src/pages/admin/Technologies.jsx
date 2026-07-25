import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const emptyItem = {
  name: "",
  slug: "",
  category: "",
  logoUrl: "",
  bannerImage: "",
  shortDescription: "",
  description: "",
  keyFeatures: "", // newline-separated in the form, converted to an array on submit
  benefits: "",
  order: 0,
  featuredOnHome: false,
  isActive: true,
};

export default function Technologies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/technologies?all=true")
      .then((res) => setItems(res.data.data || []))
      .catch(() => setError("Failed to load technologies"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyItem);
    setEditingId(null);
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const uploadImage = async (field, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(field, res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const toArray = (text) => text.split("\n").map((line) => line.trim()).filter(Boolean);
    const payload = {
      ...form,
      keyFeatures: toArray(form.keyFeatures),
      benefits: toArray(form.benefits),
    };
    try {
      if (editingId) {
        await api.put(`/technologies/${editingId}`, payload);
      } else {
        await api.post("/technologies", payload);
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
      keyFeatures: (item.keyFeatures || []).join("\n"),
      benefits: (item.benefits || []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this technology? This cannot be undone.")) return;
    try {
      await api.delete(`/technologies/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1>Technology Management</h1>
      <p>Technologies shown in the "Technologies We Work With" homepage section and their dedicated details pages.</p>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Technology" : "Add New Technology"}</h3>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Technology Name *</label>
            <input value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
          </div>
          <div className="admin-form-field">
            <label>Slug (leave blank to auto-generate from name)</label>
            <input value={form.slug} onChange={(e) => onChange("slug", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Category (Frontend/Backend/Mobile/Database)</label>
            <input value={form.category} onChange={(e) => onChange("category", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => onChange("order", Number(e.target.value))} />
          </div>
          <div className="admin-form-field">
            <label>Logo *</label>
            <input type="file" accept="image/*" onChange={(e) => uploadImage("logoUrl", e.target.files[0])} />
            {form.logoUrl && <img src={form.logoUrl} alt="logo preview" className="admin-image-preview" />}
          </div>
          <div className="admin-form-field">
            <label>Banner Image (details page)</label>
            <input type="file" accept="image/*" onChange={(e) => uploadImage("bannerImage", e.target.files[0])} />
            {form.bannerImage && <img src={form.bannerImage} alt="banner preview" className="admin-image-preview" />}
          </div>
          <div className="admin-form-field">
            <label>Featured On Home</label>
            <input type="checkbox" checked={form.featuredOnHome} onChange={(e) => onChange("featuredOnHome", e.target.checked)} />
          </div>
          <div className="admin-form-field">
            <label>Active</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => onChange("isActive", e.target.checked)} />
          </div>
        </div>

        <div className="admin-form-field" style={{ marginBottom: 16 }}>
          <label>Short Description (100–250 characters)</label>
          <textarea rows={2} maxLength={250} value={form.shortDescription} onChange={(e) => onChange("shortDescription", e.target.value)} />
        </div>

        <div className="admin-form-field" style={{ marginBottom: 20 }}>
          <label>Full Description</label>
          <RichTextEditor value={form.description} onChange={(html) => onChange("description", html)} />
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Key Features (one per line)</label>
            <textarea rows={4} value={form.keyFeatures} onChange={(e) => onChange("keyFeatures", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Benefits (one per line)</label>
            <textarea rows={4} value={form.benefits} onChange={(e) => onChange("benefits", e.target.value)} />
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
                <th>Name</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>{it.slug}</td>
                  <td>{it.category}</td>
                  <td>{it.featuredOnHome ? "Yes" : "No"}</td>
                  <td>{it.isActive ? "Yes" : "No"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(it)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={6}>No technologies yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
