import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    api
      .get(`/projects/slug/${slug}`)
      .then((res) => {
        setProject(res.data.data);
        setRelated(res.data.related || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (project) document.title = `${project.title} | Wirecto Projects`;
  }, [project]);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !project) {
    return (
      <section className="section">
        <div className="container">
          <h1>Project Not Found</h1>
          <p>We couldn't find the project you're looking for.</p>
          <Link to="/projects" className="btn btn-primary">Back To Projects</Link>
        </div>
      </section>
    );
  }

  const gallery = [project.imageUrl, ...(project.gallery || [])].filter(Boolean);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <Link to="/projects">Project</Link> <span>/</span>{" "}
            <span>{project.title}</span>
          </nav>
          <h1>{project.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-with-sidebar">
          <div className="project-detail-main">
            {!!gallery.length && (
              <div className="project-gallery">
                <img src={gallery[activeImage]} alt={project.title} className="project-gallery-main" />
                {gallery.length > 1 && (
                  <div className="project-gallery-thumbs">
                    {gallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${project.title} ${i + 1}`}
                        className={i === activeImage ? "active" : ""}
                        onClick={() => setActiveImage(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="project-meta-row">
              {project.client && <div><strong>Client</strong><span>{project.client}</span></div>}
              {project.category && <div><strong>Industry</strong><span>{project.category}</span></div>}
            </div>

            {!!project.technologiesUsed?.length && (
              <div className="project-tech-used">
                <strong>Technologies Used:</strong>
                <div className="tag-row">
                  {project.technologiesUsed.map((t, i) => (<span key={i} className="tag-pill">{t}</span>))}
                </div>
              </div>
            )}

            <div className="blog-content">
              <p>{project.description}</p>
            </div>

            {project.features && (
              <div className="tech-feature-block">
                <h2>Features</h2>
                <p>{project.features}</p>
              </div>
            )}
            {project.challenges && (
              <div className="tech-feature-block">
                <h2>Challenges</h2>
                <p>{project.challenges}</p>
              </div>
            )}
            {project.solution && (
              <div className="tech-feature-block">
                <h2>Solution</h2>
                <p>{project.solution}</p>
              </div>
            )}
            {project.results && (
              <div className="tech-feature-block">
                <h2>Results</h2>
                <p>{project.results}</p>
              </div>
            )}

            {project.projectUrl && (
              <div className="btn-row">
                <a href={project.projectUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Visit Live Project
                </a>
              </div>
            )}
          </div>

          {!!related.length && (
            <aside className="project-sidebar">
              <h3>Other Recent Projects</h3>
              {related.map((p) => (
                <Link to={`/projects/${p.slug}`} className="project-sidebar-item" key={p._id}>
                  <img src={p.imageUrl} alt={p.title} />
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.description?.slice(0, 80)}</p>
                    <span className="link-arrow">Read More →</span>
                  </div>
                </Link>
              ))}
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
