import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data.data)).catch(() => {});
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Services</h1>
          <p>Whatever technology challenge your company faces, we're here to help.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {services.map((s) => (
              <Link to={`/services/${s.slug}`} className="card service-card" key={s._id}>
                {s.imageUrl && <img src={s.imageUrl} alt={s.title} />}
                <h3>{s.title}</h3>
                <p>{s.shortDescription || s.description}</p>
                <span className="link-arrow">Read More →</span>
              </Link>
            ))}
            {!services.length && <p>No services published yet. Add some from the admin dashboard.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
