import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const emptyTopic = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  featuredImage: "",
  order: 0,
  isActive: true,
  showInNavbar: false,
  showInFooter: false,
  showOnHomepage: false,
  seo: { metaTitle: "", metaDescription: "", metaKeywords: "" },
};

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | active | inactive
  const [sortBy, setSortBy] = useState("order"); // order | latest | oldest

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTopic);

  const load = (targetPage = page) => {
    setLoading(true);
    api
      .get("/topics", { params: { admin: true, search, status, sortBy, page: targetPage, limit: 10 } })
      .then((res) => {
        setTopics(res.data.data || []);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setPages(res.data.pages || 1);
      })
      .catch(() => setError("Failed to load topics"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => load(1), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sortBy]);

  const resetForm = () => {
    setForm(emptyTopic);
    setEditingId(null);
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const onSeoChange = (name, value) => setForm((f) => ({ ...f, seo: { ...f.seo, [name]: value } }));

  const onImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      onChange("featuredImage", res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/topics/${editingId}`, form);
      } else {
        await api.post("/topics", form);
      }
      resetForm();
      load(page);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (topic) => {
    setEditingId(topic._id);
    setForm({ ...emptyTopic, ...topic, seo: { ...emptyTopic.seo, ...(topic.seo || {}) } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this topic? This cannot be undone.")) return;
    try {
      await api.delete(`/topics/${id}`);
      load(page);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const shortDescLen = form.shortDescription.length;

  return (
    <div>
      <h1>Content Management → Topics</h1>
      <p>Create unlimited website topics and control exactly where each one appears.</p>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Topic" : "Add New Topic"}</h3>

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
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => onChange("order", Number(e.target.value))} />
          </div>
          <div className="admin-form-field">
            <label>Featured Image</label>
            <input type="file" accept="image/*" onChange={(e) => onImageUpload(e.target.files[0])} />
            {uploading && <span className="hint">Uploading...</span>}
            {form.featuredImage && <img src={form.featuredImage} alt="preview" className="admin-image-preview" />}
          </div>
        </div>

        <div className="admin-form-field" style={{ marginBottom: 16 }}>
          <label>Short Description (100–250 characters) — {shortDescLen}/250</label>
          <textarea
            rows={2}
            maxLength={250}
            value={form.shortDescription}
            onChange={(e) => onChange("shortDescription", e.target.value)}
          />
        </div>

        <div className="admin-form-field" style={{ marginBottom: 20 }}>
          <label>Full Description</label>
          <RichTextEditor value={form.description} onChange={(html) => onChange("description", html)} />
        </div>

        <fieldset className="seo-fieldset">
          <legend>Visibility</legend>
          <div className="visibility-toggles">
            <label><input type="checkbox" checked={form.isActive} onChange={(e) => onChange("isActive", e.target.checked)} /> Active</label>
            <label><input type="checkbox" checked={form.showInNavbar} onChange={(e) => onChange("showInNavbar", e.target.checked)} /> Show In Navbar</label>
            <label><input type="checkbox" checked={form.showInFooter} onChange={(e) => onChange("showInFooter", e.target.checked)} /> Show In Footer</label>
            <label><input type="checkbox" checked={form.showOnHomepage} onChange={(e) => onChange("showOnHomepage", e.target.checked)} /> Show On Homepage</label>
          </div>
        </fieldset>

        <fieldset className="seo-fieldset">
          <legend>SEO (Optional)</legend>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>Meta Title</label>
              <input value={form.seo.metaTitle} onChange={(e) => onSeoChange("metaTitle", e.target.value)} />
            </div>
            <div className="admin-form-field">
              <label>Meta Keywords</label>
              <input value={form.seo.metaKeywords} onChange={(e) => onSeoChange("metaKeywords", e.target.value)} placeholder="comma, separated, keywords" />
            </div>
            <div className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Meta Description</label>
              <textarea rows={2} value={form.seo.metaDescription} onChange={(e) => onSeoChange("metaDescription", e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
          )}
        </div>
      </form>

      <div className="applications-toolbar">
        <input
          className="applications-search"
          placeholder="Search by title or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Status: All</option>
          <option value="active">Status: Active</option>
          <option value="inactive">Status: Inactive</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="order">Sort: Display Order</option>
          <option value="latest">Sort: Latest First</option>
          <option value="oldest">Sort: Oldest First</option>
        </select>
      </div>

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
                <th>Navbar</th>
                <th>Footer</th>
                <th>Home</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t._id}>
                  <td>{t.title}</td>
                  <td>{t.slug}</td>
                  <td>{t.order}</td>
                  <td>{t.showInNavbar ? "Yes" : "No"}</td>
                  <td>{t.showInFooter ? "Yes" : "No"}</td>
                  <td>{t.showOnHomepage ? "Yes" : "No"}</td>
                  <td>{t.isActive ? "Yes" : "No"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(t)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(t._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!topics.length && <tr><td colSpan={8}>No topics found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button className="btn btn-sm" disabled={page <= 1} onClick={() => load(page - 1)}>← Prev</button>
          <span>Page {page} of {pages} ({total} total)</span>
          <button className="btn btn-sm" disabled={page >= pages} onClick={() => load(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
