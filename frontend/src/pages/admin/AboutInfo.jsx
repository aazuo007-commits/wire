import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import RichTextEditor from "../../components/RichTextEditor.jsx";

const emptyValue = { title: "", description: "", icon: "" };

export default function AboutInfo() {
  const [whoWeAreTitle, setWhoWeAreTitle] = useState("Who We Are");
  const [whoWeAreContent, setWhoWeAreContent] = useState("");
  const [whoWeAreImage, setWhoWeAreImage] = useState("");
  const [coreValues, setCoreValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/about-info")
      .then((res) => {
        const d = res.data.data || {};
        setWhoWeAreTitle(d.whoWeAreTitle || "Who We Are");
        setWhoWeAreContent(d.whoWeAreContent || "");
        setWhoWeAreImage(d.whoWeAreImage || "");
        setCoreValues(d.coreValues?.length ? d.coreValues : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      setWhoWeAreImage(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateValue = (index, field, val) => {
    setCoreValues((values) => values.map((v, i) => (i === index ? { ...v, [field]: val } : v)));
  };

  const addValue = () => setCoreValues((values) => [...values, { ...emptyValue }]);
  const removeValue = (index) => setCoreValues((values) => values.filter((_, i) => i !== index));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/about-info", { whoWeAreTitle, whoWeAreContent, whoWeAreImage, coreValues });
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>About Us — Who We Are &amp; Core Values</h1>
      <p>This content appears on the public About Us page.</p>
      {error && <p className="form-error">{error}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>Who We Are</h3>
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Section Title</label>
            <input value={whoWeAreTitle} onChange={(e) => setWhoWeAreTitle(e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Image (shown beside the text, optional)</label>
            <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0])} />
            {whoWeAreImage && <img src={whoWeAreImage} alt="preview" className="admin-image-preview" />}
          </div>
        </div>

        <div className="admin-form-field" style={{ marginBottom: 20 }}>
          <label>Content</label>
          <RichTextEditor value={whoWeAreContent} onChange={setWhoWeAreContent} />
        </div>

        <fieldset className="seo-fieldset">
          <legend>Core Values</legend>
          {coreValues.map((v, i) => (
            <div className="admin-form-grid core-value-row" key={i}>
              <div className="admin-form-field">
                <label>Title</label>
                <input value={v.title} onChange={(e) => updateValue(i, "title", e.target.value)} />
              </div>
              <div className="admin-form-field">
                <label>Icon (optional class name or emoji)</label>
                <input value={v.icon} onChange={(e) => updateValue(i, "icon", e.target.value)} />
              </div>
              <div className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <textarea rows={2} value={v.description} onChange={(e) => updateValue(i, "description", e.target.value)} />
              </div>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeValue(i)}>
                Remove This Value
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline" onClick={addValue}>+ Add Core Value</button>
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={saving || uploading} style={{ marginTop: 16 }}>
          {saving ? "Saving..." : "Save"}
        </button>
        {status === "success" && <p className="form-success">Saved.</p>}
      </form>
    </div>
  );
}
