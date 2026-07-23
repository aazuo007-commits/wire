import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [homeServicesCount, setHomeServicesCount] = useState(6);
  const [homeBlogsCount, setHomeBlogsCount] = useState(3);

  useEffect(() => {
    api.get("/banners").then((r) => setBanners(r.data.data)).catch(() => {});
    api.get("/services").then((r) => setServices(r.data.data)).catch(() => {});
    api.get("/technologies").then((r) => setTechnologies(r.data.data)).catch(() => {});
    api.get("/projects").then((r) => setProjects(r.data.data)).catch(() => {});
    api.get("/expertise").then((r) => setExpertise(r.data.data)).catch(() => {});
    api.get("/blogs").then((r) => setBlogs(r.data.data)).catch(() => {});
    // Admin-configurable: how many services/blogs show on the homepage
    api
      .get("/settings")
      .then((r) => {
        setHomeServicesCount(r.data.data?.homeServicesCount || 6);
        setHomeBlogsCount(r.data.data?.homeBlogsCount || 3);
      })
      .catch(() => {});
  }, []);

  const banner = banners[0];

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>{banner?.title || "Fuel Business Growth Via App Development"}</h1>
            <p>
              {banner?.subtitle ||
                "Wirecto is a diversified IT services company that offers optimal IT solutions and services to customers around the globe by bringing the right processes, technologies, strategies and people together."}
            </p>
            <div className="btn-row">
              <Link to={banner?.buttonLink || "/services"} className="btn btn-primary">
                {banner?.buttonText || "Find Out More"}
              </Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
          {banner?.imageUrl && (
            <div className="hero-image">
              <img src={banner.imageUrl} alt={banner.title} />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Our Expertise</span>
          <h2>Quality IT Solutions & Digital Services</h2>
          <div className="grid-3">
            {(expertise.length
              ? expertise
              : [
                  { _id: 1, title: "Consulting", description: "Digital transformation and consulting services for scaling businesses." },
                  { _id: 2, title: "IT Services", description: "End-to-end technology services tailored to your business needs." },
                  { _id: 3, title: "Digital Marketing", description: "Establish a strong foothold in the online medium and grow your reach." },
                ]
            ).map((e) => (
              <div className="card" key={e._id}>
                <h3>{e.title}</h3>
                <p>{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">Technologies We Work With</span>
          <h2>Our Core Services</h2>
          <div className="grid-4">
            {(services.length ? services.slice(0, homeServicesCount) : []).map((s) => (
              <div className="card service-card" key={s._id}>
                {s.imageUrl && <img src={s.imageUrl} alt={s.title} />}
                <h3>{s.title}</h3>
                <p>{s.shortDescription}</p>
                <Link to={`/services/${s.slug}`} className="link-arrow">Read More →</Link>
              </div>
            ))}
            {!services.length && <p>Services will appear here once added from the admin dashboard.</p>}
          </div>

          {!!technologies.length && (
            <div className="tech-strip">
              {technologies.map((t) => (
                <img key={t._id} src={t.logoUrl} alt={t.name} title={t.name} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Featured Works</span>
          <h2>Some Of Our Projects</h2>
          <div className="grid-3">
            {(projects.length ? projects.slice(0, 6) : []).map((p) => (
              <div className="project-card" key={p._id}>
                <img src={p.imageUrl} alt={p.title} />
                <div className="project-overlay">
                  <h3>{p.title}</h3>
                  <Link to="/projects">View Details</Link>
                </div>
              </div>
            ))}
            {!projects.length && <p>Projects will appear here once added from the admin dashboard.</p>}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">From The Blog</span>
          <h2>Latest Articles & Updates</h2>
          <div className="grid-3">
            {(blogs.length ? blogs.slice(0, homeBlogsCount) : []).map((post) => (
              <Link to={`/blog/${post.slug}`} className="card blog-card" key={post._id}>
                {post.coverImage && <img src={post.coverImage} alt={post.title} />}
                {post.category?.name && <span className="eyebrow">{post.category.name}</span>}
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="link-arrow">Read More →</span>
              </Link>
            ))}
            {!blogs.length && <p>Blog posts will appear here once added from the admin dashboard.</p>}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <h2>Discuss An Upcoming IT Project</h2>
          <p>For a free consultation, get in touch with our team today.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
        </div>
      </section>
    </>
  );
}
