import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PRESETS = [3, 4, 6, 9, 12];
const emptySocial = { facebook: "", twitter: "", linkedin: "", instagram: "", youtube: "", whatsapp: "" };

export default function SiteSettings() {
  const [servicesCount, setServicesCount] = useState(6);
  const [blogsCount, setBlogsCount] = useState(3);
  const [topicsCount, setTopicsCount] = useState(4);

  const [companyTagline, setCompanyTagline] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [social, setSocial] = useState(emptySocial);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        const d = res.data.data || {};
        setServicesCount(d.homeServicesCount || 6);
        setBlogsCount(d.homeBlogsCount || 3);
        setTopicsCount(d.homeTopicsCount || 4);
        setCompanyTagline(d.companyTagline || "");
        setContactPhone(d.contactPhone || "");
        setContactEmail(d.contactEmail || "");
        setContactAddress(d.contactAddress || "");
        setSocial({ ...emptySocial, ...(d.social || {}) });
      })
      .finally(() => setLoading(false));
  }, []);

  const onSocialChange = (key, value) => setSocial((s) => ({ ...s, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/settings", {
        homeServicesCount: Number(servicesCount),
        homeBlogsCount: Number(blogsCount),
        homeTopicsCount: Number(topicsCount),
        companyTagline,
        contactPhone,
        contactEmail,
        contactAddress,
        social,
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
        <p>Choose how many services, blog posts, and topics are shown on the homepage (the full lists still appear on their own pages).</p>

        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label>Number Of Services On Home Page</label>
            <select value={servicesCount} onChange={(e) => setServicesCount(e.target.value)}>
              {PRESETS.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Or set a custom services number</label>
            <input type="number" min="1" max="24" value={servicesCount} onChange={(e) => setServicesCount(e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Number Of Blogs On Home Page</label>
            <select value={blogsCount} onChange={(e) => setBlogsCount(e.target.value)}>
              {PRESETS.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Or set a custom blogs number</label>
            <input type="number" min="1" max="24" value={blogsCount} onChange={(e) => setBlogsCount(e.target.value)} />
          </div>
          <div className="admin-form-field">
            <label>Number Of Topics On Home Page</label>
            <select value={topicsCount} onChange={(e) => setTopicsCount(e.target.value)}>
              {PRESETS.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>
          <div className="admin-form-field">
            <label>Or set a custom topics number</label>
            <input type="number" min="1" max="24" value={topicsCount} onChange={(e) => setTopicsCount(e.target.value)} />
          </div>
        </div>
      </form>

      <form className="admin-form" onSubmit={save}>
        <h3>Footer &amp; Company Info</h3>
        <p>Shown in the site footer: company punchline, contact details, and social media icons.</p>

        <div className="admin-form-grid">
          <div className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
            <label>Company Tagline / Short Description</label>
            <textarea rows={2} value={companyTagline} onChange={(e) => setCompanyTagline(e.target.value)} placeholder="A short punchline about the company, shown under the footer logo." />
          </div>
          <div className="admin-form-field">
            <label>Contact Phone / Mobile Number</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91-00000-00000" />
          </div>
          <div className="admin-form-field">
            <label>Contact Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="info@wirecto.com" />
          </div>
          <div className="admin-form-field" style={{ gridColumn: "1 / -1" }}>
            <label>Address</label>
            <textarea rows={2} value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} placeholder="Street, City, State, Country" />
          </div>
        </div>

        <h3 style={{ marginTop: 20 }}>Social Media Links</h3>
        <p>Leave any blank to hide that icon in the footer.</p>
        <div className="admin-form-grid">
          {Object.keys(emptySocial).map((key) => (
            <div className="admin-form-field" key={key}>
              <label style={{ textTransform: "capitalize" }}>{key}</label>
              <input value={social[key]} onChange={(e) => onSocialChange(key, e.target.value)} placeholder={`https://...`} />
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || saving} style={{ marginTop: 16 }}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {status === "success" && <p className="form-success">Settings saved.</p>}
        {status === "error" && <p className="form-error">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
