import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function About() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.get("/about-info").then((r) => setAboutInfo(r.data.data)).catch(() => {});
    api.get("/industries").then((r) => setIndustries(r.data.data || [])).catch(() => {});
    api.get("/partners").then((r) => setPartners(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Building technology that moves your business forward.</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <span className="eyebrow">{aboutInfo?.whoWeAreTitle || "Who We Are"}</span>
            <h2>Our IT Experience Ensures Your Success</h2>
            {aboutInfo?.whoWeAreContent ? (
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: aboutInfo.whoWeAreContent }} />
            ) : (
              <>
                <p>
                  Wirecto is a diversified global IT services company that brings together the right people,
                  processes, and technologies to deliver optimal solutions for businesses of every size.
                </p>
                <p>
                  Our team of engineers, designers, and strategists works across web, mobile, cloud, and data
                  to help our clients stay ahead in a fast-changing digital landscape.
                </p>
              </>
            )}
            <div className="btn-row">
              <Link to="/team" className="btn btn-outline">Meet The Team</Link>
              <Link to="/advisory-board" className="btn btn-outline">Advisory Board</Link>
            </div>
          </div>
          {aboutInfo?.whoWeAreImage ? (
            <img src={aboutInfo.whoWeAreImage} alt="Who We Are" className="about-image" />
          ) : (
            <div className="stats-grid">
              <div className="stat"><h3>8+</h3><p>Years In Business</p></div>
              <div className="stat"><h3>1.1k</h3><p>Projects Completed</p></div>
              <div className="stat"><h3>750+</h3><p>Happy Clients</p></div>
              <div className="stat"><h3>100+</h3><p>Team Members</p></div>
            </div>
          )}
        </div>
      </section>

      {!!aboutInfo?.coreValues?.length && (
        <section className="section section-alt">
          <div className="container">
            <span className="eyebrow">What Drives Us</span>
            <h2>Our Core Values</h2>
            <div className="grid-3">
              {aboutInfo.coreValues.map((v, i) => (
                <div className="card" key={i}>
                  {v.icon && <div className="core-value-icon">{v.icon}</div>}
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!industries.length && (
        <section className="section">
          <div className="container">
            <span className="eyebrow">Industries</span>
            <h2>Industries We Serve</h2>
            <div className="grid-3">
              {industries.map((i) => (
                <div className="card" key={i._id}>
                  <h3>{i.title}</h3>
                  <p>{i.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!partners.length && (
        <section className="section section-alt">
          <div className="container">
            <span className="eyebrow">Our Partners</span>
            <h2>Trusted Technology Partners</h2>
            <div className="tech-strip">
              {partners.map((p) => (
                <a key={p._id} href={p.websiteUrl || "#"} target="_blank" rel="noreferrer">
                  <img src={p.logoUrl} alt={p.name} title={p.name} />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
