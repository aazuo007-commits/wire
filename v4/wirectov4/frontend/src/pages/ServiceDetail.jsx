import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    api
      .get(`/services/slug/${slug}`)
      .then((res) => {
        setService(res.data.data);
        return api.get("/services");
      })
      .then((res) => {
        setRelated((res.data.data || []).filter((s) => s.slug !== slug).slice(0, 3));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !service) {
    return (
      <section className="section">
        <div className="container">
          <h1>Service Not Found</h1>
          <p>We couldn't find the service you're looking for.</p>
          <Link to="/services" className="btn btn-primary">Back To Services</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{service.title}</h1>
          <p>{service.shortDescription}</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-detail-grid">
          <div>
            {service.imageUrl && (
              <img src={service.imageUrl} alt={service.title} className="service-detail-image" />
            )}

            {service.videoUrl && (
              <video src={service.videoUrl} controls className="service-detail-video" />
            )}

            <h2>Overview</h2>
            <p>{service.description || service.shortDescription}</p>

            <div className="btn-row">
              <Link to="/contact" className="btn btn-primary">Discuss Your Project</Link>
              <Link to="/services" className="btn btn-outline">All Services</Link>
              {service.brochureUrl && (
                <a href={service.brochureUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  Download Brochure
                </a>
              )}
            </div>
          </div>

          {!!related.length && (
            <aside className="service-sidebar">
              <h3>Other Services</h3>
              <ul>
                {related.map((s) => (
                  <li key={s._id}>
                    <Link to={`/services/${s.slug}`}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
