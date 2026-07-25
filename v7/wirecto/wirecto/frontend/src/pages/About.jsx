import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function About() {
  const [industries, setIndustries] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.get("/industries").then((r) => setIndustries(r.data.data)).catch(() => {});
    api.get("/partners").then((r) => setPartners(r.data.data)).catch(() => {});
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
            <span className="eyebrow">Who We Are</span>
            <h2>Our IT Experience Ensures Your Success</h2>
            <p>
              Wirecto is a diversified global IT services company that brings together the right people,
              processes, and technologies to deliver optimal solutions for businesses of every size. From
              startups to large enterprises, we partner closely with our clients to design, build, and
              scale software that drives real results.
            </p>
            <p>
              Our team of engineers, designers, and strategists works across web, mobile, cloud, and data
              to help our clients stay ahead in a fast-changing digital landscape.
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat"><h3>8+</h3><p>Years In Business</p></div>
            <div className="stat"><h3>1.1k</h3><p>Projects Completed</p></div>
            <div className="stat"><h3>750+</h3><p>Happy Clients</p></div>
            <div className="stat"><h3>100+</h3><p>Team Members</p></div>
          </div>
        </div>
      </section>

      {!!industries.length && (
        <section className="section section-alt">
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
        <section className="section">
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
