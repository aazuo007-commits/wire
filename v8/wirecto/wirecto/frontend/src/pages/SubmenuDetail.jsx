import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import MenuSidebar from "../components/MenuSidebar.jsx";

function useSeo(item) {
  useEffect(() => {
    if (!item) return;
    const seo = item.seo || {};
    const prevTitle = document.title;
    document.title = seo.title || item.name;

    const setMeta = (name, content) => {
      if (!content) return null;
      let tag = document.querySelector(`meta[name="${name}"]`);
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
      return created ? tag : null;
    };

    const createdTags = [
      setMeta("description", seo.description || item.shortDescription),
      setMeta("keywords", seo.keywords),
    ].filter(Boolean);

    return () => {
      document.title = prevTitle;
      createdTags.forEach((tag) => tag.remove());
    };
  }, [item]);
}

export default function SubmenuDetail() {
  const { parentSlug, submenuSlug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedTechnologies, setRelatedTechnologies] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/submenu-items/lookup/${parentSlug}/${submenuSlug}`)
      .then((res) => {
        setItem(res.data.data);
        setRelated(res.data.related || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // Best-effort "related content" pulled from the site's existing collections —
    // shown as a way to cross-link Services/Projects/Blog/Technology from any submenu page.
    api.get("/services").then((r) => setRelatedServices((r.data.data || []).slice(0, 3))).catch(() => {});
    api.get("/projects").then((r) => setRelatedProjects((r.data.data || []).slice(0, 3))).catch(() => {});
    api.get("/blogs").then((r) => setRelatedBlogs((r.data.data || []).slice(0, 3))).catch(() => {});
    api.get("/technologies").then((r) => setRelatedTechnologies((r.data.data || []).slice(0, 8))).catch(() => {});
  }, [parentSlug, submenuSlug]);

  useSeo(item);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onInquirySubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", {
        ...form,
        subject: `Inquiry: ${item?.name || "Submenu Page"}`,
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !item) {
    return (
      <section className="section">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>We couldn't find the page you're looking for.</p>
          <Link to="/" className="btn btn-primary">Back To Home</Link>
        </div>
      </section>
    );
  }

  const parentTitle = item.parentMenu?.title || parentSlug;
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(item.name);
  const shareUrl = encodeURIComponent(pageUrl);

  return (
    <>
      {item.bannerImage && (
        <div className="topic-banner" style={{ backgroundImage: `url(${item.bannerImage})` }}>
          <div className="topic-banner-overlay">
            <div className="container">
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <Link to={`/${parentSlug}`}>{parentTitle}</Link>{" "}
                <span>/</span> <span>{item.name}</span>
              </nav>
              <h1>{item.name}</h1>
            </div>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container detail-with-sidebar">
          <div className="topic-detail-container">
          {!item.bannerImage && (
            <>
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <Link to={`/${parentSlug}`}>{parentTitle}</Link>{" "}
                <span>/</span> <span>{item.name}</span>
              </nav>
              <h1>{item.name}</h1>
            </>
          )}

          {item.featuredImage && (
            <img src={item.featuredImage} alt={item.name} className="blog-detail-cover" />
          )}

          {item.shortDescription && <p className="topic-short-desc">{item.shortDescription}</p>}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: item.description }} />

          <div className="share-buttons">
            <span>Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="share-btn">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" className="share-btn">X / Twitter</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" className="share-btn">LinkedIn</a>
            <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" className="share-btn">WhatsApp</a>
          </div>

          {!!related.length && (
            <div className="related-topics">
              <h2>Related {parentTitle}</h2>
              <div className="grid-3">
                {related.map((r) => (
                  <Link to={`/${parentSlug}/${r.slug}`} className="card" key={r._id}>
                    {r.featuredImage && <img src={r.featuredImage} alt={r.name} className="related-topic-image" />}
                    <h3>{r.name}</h3>
                    <p>{r.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!!relatedServices.length && (
            <div className="related-topics">
              <h2>Related Services</h2>
              <div className="grid-3">
                {relatedServices.map((s) => (
                  <Link to={`/services/${s.slug}`} className="card" key={s._id}>
                    <h3>{s.title}</h3>
                    <p>{s.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!!relatedProjects.length && (
            <div className="related-topics">
              <h2>Related Projects</h2>
              <div className="grid-3">
                {relatedProjects.map((p) => (
                  <div className="card" key={p._id}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="related-topic-image" />}
                    <h3>{p.title}</h3>
                    <p>{p.client}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!!relatedBlogs.length && (
            <div className="related-topics">
              <h2>Related Blogs</h2>
              <div className="grid-3">
                {relatedBlogs.map((b) => (
                  <Link to={`/blog/${b.slug}`} className="card" key={b._id}>
                    <h3>{b.title}</h3>
                    <p>{b.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!!relatedTechnologies.length && (
            <div className="related-topics">
              <h2>Related Technologies</h2>
              <div className="tech-strip">
                {relatedTechnologies.map((t) => (
                  <img key={t._id} src={t.logoUrl} alt={t.name} title={t.name} />
                ))}
              </div>
            </div>
          )}

          <div className="inquiry-cta">
            <h2>Have A Project In Mind?</h2>
            <p>Tell us a bit about what you need, and our team will get back to you.</p>

            {status === "success" ? (
              <p className="form-success">Thanks! We've received your inquiry and will be in touch soon.</p>
            ) : (
              <form className="contact-form" onSubmit={onInquirySubmit}>
                <div className="form-row">
                  <input name="name" placeholder="Your Name" value={form.name} onChange={onChange} required />
                  <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={onChange} required />
                </div>
                <div className="form-row">
                  <input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} />
                </div>
                <textarea name="message" rows="4" placeholder="Tell us about your project..." value={form.message} onChange={onChange} required />
                <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send Inquiry"}
                </button>
                {status === "error" && <p className="form-error">Something went wrong. Please try again.</p>}
              </form>
            )}
          </div>
          </div>

          <MenuSidebar activeItemId={item._id} />
        </div>
      </section>
    </>
  );
}
