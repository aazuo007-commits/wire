import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function TechnologyDetail() {
  const { slug } = useParams();
  const [tech, setTech] = useState(null);
  const [related, setRelated] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/technologies/slug/${slug}`)
      .then((res) => {
        setTech(res.data.data);
        setRelated(res.data.related || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    api.get("/services").then((r) => setRelatedServices((r.data.data || []).slice(0, 3))).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (tech) document.title = `${tech.name} | Wirecto`;
  }, [tech]);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !tech) {
    return (
      <section className="section">
        <div className="container">
          <h1>Technology Not Found</h1>
          <p>We couldn't find the technology you're looking for.</p>
          <Link to="/" className="btn btn-primary">Back To Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {tech.bannerImage ? (
        <div className="topic-banner" style={{ backgroundImage: `url(${tech.bannerImage})` }}>
          <div className="topic-banner-overlay">
            <div className="container">
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <span>{tech.name}</span>
              </nav>
              <h1>{tech.name}</h1>
            </div>
          </div>
        </div>
      ) : (
        <section className="page-header">
          <div className="container">
            <h1>{tech.name}</h1>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container tech-detail-container">
          <div className="tech-detail-main">
            {tech.bannerImage && (
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <span>{tech.name}</span>
              </nav>
            )}

            <div className="tech-detail-header">
              {tech.logoUrl && <img src={tech.logoUrl} alt={tech.name} className="tech-detail-logo" />}
              {tech.shortDescription && <p className="topic-short-desc">{tech.shortDescription}</p>}
            </div>

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: tech.description }} />

            {!!tech.keyFeatures?.length && (
              <div className="tech-feature-block">
                <h2>Key Features</h2>
                <ul className="check-list">
                  {tech.keyFeatures.map((f, i) => (<li key={i}>{f}</li>))}
                </ul>
              </div>
            )}

            {!!tech.benefits?.length && (
              <div className="tech-feature-block">
                <h2>Benefits</h2>
                <ul className="check-list">
                  {tech.benefits.map((b, i) => (<li key={i}>{b}</li>))}
                </ul>
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

            <div className="inquiry-cta">
              <h2>Start Your Project</h2>
              <p>Want to build something with {tech.name}? Let's talk about your project.</p>
              <div className="btn-row">
                <Link to="/contact" className="btn btn-primary">Start Your Project</Link>
                <Link to="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </div>

            {!!related.length && (
              <div className="related-topics">
                <h2>Related Technologies</h2>
                <div className="grid-3">
                  {related.map((t) => (
                    <Link to={`/technologies/${t.slug}`} className="card service-card" key={t._id}>
                      {t.logoUrl && <img src={t.logoUrl} alt={t.name} />}
                      <h3>{t.name}</h3>
                      <p>{t.shortDescription}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
