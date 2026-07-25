import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";
import MenuSidebar from "../components/MenuSidebar.jsx";

function useSeo(topic) {
  useEffect(() => {
    if (!topic) return;
    const seo = topic.seo || {};
    const prevTitle = document.title;
    document.title = seo.metaTitle || topic.title;

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
      setMeta("description", seo.metaDescription || topic.shortDescription),
      setMeta("keywords", seo.metaKeywords),
    ].filter(Boolean);

    return () => {
      document.title = prevTitle;
      createdTags.forEach((tag) => tag.remove());
    };
  }, [topic]);
}

export default function TopicDetail() {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/topics/slug/${slug}`)
      .then((res) => {
        setTopic(res.data.data);
        setRelated(res.data.related || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useSeo(topic);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !topic) {
    return (
      <section className="section">
        <div className="container">
          <h1>Topic Not Found</h1>
          <p>We couldn't find the topic you're looking for.</p>
          <Link to="/" className="btn btn-primary">Back To Home</Link>
        </div>
      </section>
    );
  }

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(topic.title);
  const shareUrl = encodeURIComponent(pageUrl);

  return (
    <>
      {topic.featuredImage && (
        <div className="topic-banner" style={{ backgroundImage: `url(${topic.featuredImage})` }}>
          <div className="topic-banner-overlay">
            <div className="container">
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <Link to="/topics">Topics</Link> <span>/</span>{" "}
                <span>{topic.title}</span>
              </nav>
              <h1>{topic.title}</h1>
            </div>
          </div>
        </div>
      )}

      <section className="section">
        <div className="container detail-with-sidebar">
          <div className="topic-detail-container">
          {!topic.featuredImage && (
            <>
              <nav className="breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <Link to="/topics">Topics</Link> <span>/</span>{" "}
                <span>{topic.title}</span>
              </nav>
              <h1>{topic.title}</h1>
            </>
          )}

          {topic.shortDescription && <p className="topic-short-desc">{topic.shortDescription}</p>}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: topic.description }} />

          <div className="share-buttons">
            <span>Share:</span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="share-btn">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noreferrer" className="share-btn">X / Twitter</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" className="share-btn">LinkedIn</a>
            <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noreferrer" className="share-btn">WhatsApp</a>
          </div>

          {!!related.length && (
            <div className="related-topics">
              <h2>Related Topics</h2>
              <div className="grid-3">
                {related.map((r) => (
                  <Link to={`/topics/${r.slug}`} className="card" key={r._id}>
                    {r.featuredImage && <img src={r.featuredImage} alt={r.title} className="related-topic-image" />}
                    <h3>{r.title}</h3>
                    <p>{r.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

          <MenuSidebar />
        </div>
      </section>
    </>
  );
}
