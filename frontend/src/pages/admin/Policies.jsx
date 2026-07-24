import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const emptyItem = { title: "", slug: "", content: "", order: 0, isActive: true };

export default function Policies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/policies?all=true")
      .then((res) => setItems(res.data.data || []))
      .catch(() => setError("Failed to load policy pages"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyItem);
    setEditingId(null);
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/policies/${editingId}`, form);
      } else {
        await api.post("/policies", form);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this policy page? This cannot be undone.")) return;
    try {
      await api.delete(`/policies/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1>Legal / Policy Pages</h1>
      <p>Privacy Policy, Terms &amp; Conditions, Refund &amp; Cancellation Policy, Shipping &amp; Delivery Policy — or any other legal page. These appear as links in the footer.</p>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Policy Page" : "Add New Policy Page"}</h3>

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
            <label>Order (controls position in the footer links row)</label>
            <input type="number" value={form.order} onChange={(e) => onChange("order", Number(e.target.value))} />
          </div>
          <div className="admin-form-field">
            <label>Active</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => onChange("isActive", e.target.checked)} />
          </div>
        </div>

        <div className="admin-form-field" style={{ marginBottom: 20 }}>
          <label>Content</label>
          <RichTextEditor value={form.content} onChange={(html) => onChange("content", html)} />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
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
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id}>
                  <td>{it.title}</td>
                  <td>{it.slug}</td>
                  <td>{it.order}</td>
                  <td>{it.isActive ? "Yes" : "No"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(it)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5}>No policy pages yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
