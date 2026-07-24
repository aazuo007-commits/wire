import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const emptyBlog = {
  title: "",
  slug: "",
  category: "",
  author: "Wirecto Team",
  coverImage: "",
  excerpt: "",
  content: "",
  tags: "", // comma-separated in the form, converted to an array on submit
  seo: { metaTitle: "", metaDescription: "", metaKeywords: "", ogImage: "", canonicalUrl: "" },
  order: 0,
  isFeatured: false,
  isActive: true,
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyBlog);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadBlogs = () => {
    setLoading(true);
    api
      .get("/blogs?all=true")
      .then((res) => setBlogs(res.data.data))
      .catch(() => setError("Failed to load blogs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();
    api.get("/blog-categories?all=true").then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const resetForm = () => {
    setForm(emptyBlog);
    setEditingId(null);
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const onSeoChange = (name, value) => setForm((f) => ({ ...f, seo: { ...f.seo, [name]: value } }));

  const onCoverUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      onChange("coverImage", res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Cover image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onOgImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      onSeoChange("ogImage", res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "OG image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      category: form.category || undefined,
      tags: typeof form.tags === "string" ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
    };
    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
      } else {
        await api.post("/blogs", payload);
      }
      resetForm();
      loadBlogs();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      ...emptyBlog,
      ...blog,
      category: blog.category?._id || blog.category || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      seo: { ...emptyBlog.seo, ...(blog.seo || {}) },
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this blog post? This cannot be undone.")) return;
    try {
      await api.delete(`/blogs/${id}`);
      loadBlogs();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h1>Blogs</h1>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Blog Post" : "Add New Blog Post"}</h3>

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
            <label>Category</label>
            <select value={form.category} onChange={(e) => onChange("category", e.target.value)}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Author</label>
            <input value={form.author} onChange={(e) => onChange("author", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => onChange("tags", e.target.value)} placeholder="react, tutorial, web-dev" />
          </div>
          <div className="admin-form-field">
            <label>Order</label>
            <input type="number" value={form.order} onChange={(e) => onChange("order", Number(e.target.value))} />
          </div>
          <div className="admin-form-field">
            <label>Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => onCoverUpload(e.target.files[0])} />
            {form.coverImage && <img src={form.coverImage} alt="cover preview" className="admin-image-preview" />}
          </div>
          <div className="admin-form-field">
            <label>Featured (shown first / highlighted)</label>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => onChange("isFeatured", e.target.checked)} />
          </div>
          <div className="admin-form-field">
            <label>Active (published)</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => onChange("isActive", e.target.checked)} />
          </div>
        </div>

        <div className="admin-form-field" style={{ marginBottom: 16 }}>
          <label>Excerpt (short summary shown on grid/list cards)</label>
          <textarea rows={2} value={form.excerpt} onChange={(e) => onChange("excerpt", e.target.value)} />
        </div>

        <div className="admin-form-field" style={{ marginBottom: 20 }}>
          <label>Content *</label>
          <RichTextEditor value={form.content} onChange={(html) => onChange("content", html)} />
        </div>

        <fieldset className="seo-fieldset">
          <legend>SEO</legend>
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
            <div className="admin-form-field">
              <label>Canonical URL</label>
              <input value={form.seo.canonicalUrl} onChange={(e) => onSeoChange("canonicalUrl", e.target.value)} placeholder="https://wirecto.com/blog/my-post" />
            </div>
            <div className="admin-form-field">
              <label>Open Graph (Social Share) Image</label>
              <input type="file" accept="image/*" onChange={(e) => onOgImageUpload(e.target.files[0])} />
              {form.seo.ogImage && <img src={form.seo.ogImage} alt="og preview" className="admin-image-preview" />}
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

      <div className="admin-table-wrap">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id}>
                  <td>{b.title}</td>
                  <td>{b.slug}</td>
                  <td>{b.category?.name || "—"}</td>
                  <td>{b.isFeatured ? "Yes" : "No"}</td>
                  <td>{b.isActive === false ? "No" : "Yes"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(b)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!blogs.length && <tr><td colSpan={6}>No blog posts yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
