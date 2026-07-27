import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import HeroSlider from "../components/HeroSlider.jsx";
import PartnerSlider from "../components/PartnerSlider.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [featuredTechnologies, setFeaturedTechnologies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [blogs, setBlogs] = useState([]);
  // const [topics, setTopics] = useState([]);
  const [partners, setPartners] = useState([]);
  const [homeServicesCount, setHomeServicesCount] = useState(6);
  const [homeBlogsCount, setHomeBlogsCount] = useState(3);
  // const [homeTopicsCount, setHomeTopicsCount] = useState(4);
  const [partnerSliderSpeed, setPartnerSliderSpeed] = useState(30);

  useEffect(() => {
    api.get("/banners").then((r) => setBanners(r.data.data || [])).catch(() => {});
    api.get("/services").then((r) => setServices(r.data.data || [])).catch(() => {});
    api.get("/projects").then((r) => setProjects(r.data.data || [])).catch(() => {});
    api.get("/expertise").then((r) => setExpertise(r.data.data || [])).catch(() => {});
    api.get("/blogs").then((r) => setBlogs(r.data.data || [])).catch(() => {});
    api.get("/partners").then((r) => setPartners(r.data.data || [])).catch(() => {});

    // Admin-configurable: how many services/blogs/topics/technologies show on the homepage
    api
      .get("/settings")
      .then((r) => {
        const d = r.data.data || {};
        setHomeServicesCount(d.homeServicesCount || 6);
        setHomeBlogsCount(d.homeBlogsCount || 3);
        setPartnerSliderSpeed(d.partnerSliderSpeed || 30);
        // const topicsLimit = d.homeTopicsCount || 4;
        const techLimit = d.homeTechnologiesCount || 8;
        // setHomeTopicsCount(topicsLimit);

        // Topics marked "Show On Homepage" from the admin dashboard automatically show up here.
        // api
        //   .get("/topics", { params: { homepage: true, limit: topicsLimit } })
        //   .then((res) => setTopics(res.data.data || []))
        //   .catch(() => setTopics([]));

        // Technologies marked "Featured on Home" from the admin dashboard automatically show up here.
        api
          .get("/technologies", { params: { featured: true, limit: techLimit } })
          .then((res) => setFeaturedTechnologies(res.data.data || []))
          .catch(() => setFeaturedTechnologies([]));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <HeroSlider slides={banners} />

      <section className="home-search-section">
        <div className="container">
          <span className="eyebrow">Looking For Something?</span>
          <h2>Search Our Site</h2>
          <SearchBar placeholder="Search services, blogs, technologies, and more..." />
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
          <span className="eyebrow">What We Do</span>
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Our Stack</span>
          <h2>Technologies We Work With</h2>
          <div className="grid-4">
            {featuredTechnologies.map((t) => (
              <div className="card tech-home-card" key={t._id}>
                {t.logoUrl && <img src={t.logoUrl} alt={t.name} />}
                <h3>{t.name}</h3>
                <p>{t.shortDescription}</p>
                <Link to={`/technologies/${t.slug}`} className="btn btn-outline btn-sm-block">View Details</Link>
              </div>
            ))}
            {!featuredTechnologies.length && (
              <p>Mark technologies "Featured on Home" from the admin dashboard to show them here.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <span className="eyebrow">Featured Works</span>
          <h2>Some Of Our Projects</h2>
          <div className="grid-3">
            {(projects.length ? projects.slice(0, 6) : []).map((p) => (
              <Link to={`/projects/${p.slug}`} className="project-card" key={p._id}>
                <img src={p.imageUrl} alt={p.title} />
                <div className="project-overlay">
                  <h3>{p.title}</h3>
                  <span>View Details →</span>
                </div>
              </Link>
            ))}
            {!projects.length && <p>Projects will appear here once added from the admin dashboard.</p>}
          </div>
        </div>
      </section>

{/*      <section className="section">
        <div className="container">
          <span className="eyebrow">Explore</span>
          <h2>Topics</h2>
          <div className="grid-3">
            {(topics.length ? topics.slice(0, homeTopicsCount) : []).map((t) => (
              <Link to={`/topics/${t.slug}`} className="card" key={t._id}>
                {t.featuredImage && <img src={t.featuredImage} alt={t.title} className="related-topic-image" />}
                <h3>{t.title}</h3>
                <p>{t.shortDescription}</p>
                <span className="link-arrow">Read More →</span>
              </Link>
            ))}
            {!topics.length && <p>Topics will appear here once added and enabled for the homepage from the admin dashboard.</p>}
          </div>
        </div>
      </section>*/}

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

      {!!partners.length && (
        <section className="section partners-section">
          <div className="container">
            <span className="eyebrow">Trusted By</span>
            <h2>Our Partners</h2>
          </div>
          <PartnerSlider partners={partners} speedSeconds={partnerSliderSpeed} />
        </section>
      )}

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
