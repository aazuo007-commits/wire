import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const emptyItem = {
  parentMenu: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  featuredImage: "",
  bannerImage: "",
  order: 0,
  isActive: true,
  showOnHomepage: false,
  seo: { title: "", keywords: "", description: "" },
};

export default function SubmenuItems() {
  const [items, setItems] = useState([]);
  const [parentMenus, setParentMenus] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [parentFilter, setParentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("order");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);

  const load = (targetPage = page) => {
    setLoading(true);
    api
      .get("/submenu-items", {
        params: {
          admin: true,
          search,
          status,
          parent: parentFilter === "all" ? undefined : parentFilter,
          sortBy,
          page: targetPage,
          limit: 10,
        },
      })
      .then((res) => {
        setItems(res.data.data || []);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setPages(res.data.pages || 1);
      })
      .catch(() => setError("Failed to load submenu items"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get("/parent-menus?all=true").then((res) => setParentMenus(res.data.data || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(1), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, parentFilter, sortBy]);

  const resetForm = () => {
    setForm(emptyItem);
    setEditingId(null);
  };

  const onChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const onSeoChange = (name, value) => setForm((f) => ({ ...f, seo: { ...f.seo, [name]: value } }));

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
    if (!form.parentMenu) {
      setError("Please select a Parent Menu.");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/submenu-items/${editingId}`, form);
      } else {
        await api.post("/submenu-items", form);
      }
      resetForm();
      load(page);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...emptyItem,
      ...item,
      parentMenu: item.parentMenu?._id || item.parentMenu || "",
      seo: { ...emptyItem.seo, ...(item.seo || {}) },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this submenu item? This cannot be undone.")) return;
    try {
      await api.delete(`/submenu-items/${id}`);
      load(page);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const shortDescLen = form.shortDescription.length;

  return (
    <div>
      <h1>Submenu Items</h1>
      <p>Unlimited submenu pages, each nested under a Parent Menu (e.g. Expertise → Cloud ERP).</p>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editingId ? "Edit Submenu Item" : "Add New Submenu Item"}</h3>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Parent Menu *</label>
            <select value={form.parentMenu} onChange={(e) => onChange("parentMenu", e.target.value)} required>
              <option value="">— Select —</option>
              {parentMenus.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Submenu Name *</label>
            <input value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
          </div>
          <div className="admin-form-field">
            <label>Slug (leave blank to auto-generate from name)</label>
            <input value={form.slug} onChange={(e) => onChange("slug", e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={(e) => onChange("order", Number(e.target.value))} />
          </div>
          <div className="admin-form-field">
            <label>Featured Image</label>
            <input type="file" accept="image/*" onChange={(e) => uploadImage("featuredImage", e.target.files[0])} />
            {form.featuredImage && <img src={form.featuredImage} alt="featured preview" className="admin-image-preview" />}
          </div>
          <div className="admin-form-field">
            <label>Banner Image</label>
            <input type="file" accept="image/*" onChange={(e) => uploadImage("bannerImage", e.target.files[0])} />
            {form.bannerImage && <img src={form.bannerImage} alt="banner preview" className="admin-image-preview" />}
          </div>
          <div className="admin-form-field">
            <label>Show On Homepage</label>
            <input type="checkbox" checked={form.showOnHomepage} onChange={(e) => onChange("showOnHomepage", e.target.checked)} />
          </div>
          <div className="admin-form-field">
            <label>Active</label>
            <input type="checkbox" checked={form.isActive} onChange={(e) => onChange("isActive", e.target.checked)} />
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
          <legend>SEO</legend>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>SEO Title</label>
              <input value={form.seo.title} onChange={(e) => onSeoChange("title", e.target.value)} />
            </div>
            <div className="admin-form-field">
              <label>Meta Keywords</label>
              <input value={form.seo.keywords} onChange={(e) => onSeoChange("keywords", e.target.value)} placeholder="comma, separated, keywords" />
            </div>
            <div className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Meta Description</label>
              <textarea rows={2} value={form.seo.description} onChange={(e) => onSeoChange("description", e.target.value)} />
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
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={parentFilter} onChange={(e) => setParentFilter(e.target.value)}>
          <option value="all">All Parent Menus</option>
          {parentMenus.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
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
                <th>Name</th>
                <th>Slug</th>
                <th>Parent Menu</th>
                <th>Order</th>
                <th>Homepage</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id}>
                  <td>{it.name}</td>
                  <td>{it.slug}</td>
                  <td>{it.parentMenu?.title || "—"}</td>
                  <td>{it.order}</td>
                  <td>{it.showOnHomepage ? "Yes" : "No"}</td>
                  <td>{it.isActive ? "Yes" : "No"}</td>
                  <td className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => onEdit(it)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={7}>No submenu items found.</td></tr>}
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
