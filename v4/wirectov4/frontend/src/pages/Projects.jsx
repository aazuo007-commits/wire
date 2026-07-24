import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data.data)).catch(() => {});
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Our Projects</h1>
          <p>A look at some of the work we're proud of.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {projects.map((p) => (
              <div className="project-card" key={p._id}>
                <img src={p.imageUrl} alt={p.title} />
                <div className="project-overlay">
                  <h3>{p.title}</h3>
                  {p.projectUrl && (
                    <a href={p.projectUrl} target="_blank" rel="noreferrer">View Details</a>
                  )}
                </div>
              </div>
            ))}
            {!projects.length && <p>No projects published yet. Add some from the admin dashboard.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
