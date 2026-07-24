import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/topics").then((r) => setTopics(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Topics</h1>
          <p>Explore what we cover, one topic at a time.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <p>Loading topics...</p>}
          {!loading && !topics.length && <p>No topics published yet. Add some from the admin dashboard.</p>}

          <div className="grid-3">
            {topics.map((t) => (
              <Link to={`/topics/${t.slug}`} className="card" key={t._id}>
                {t.featuredImage && <img src={t.featuredImage} alt={t.title} className="related-topic-image" />}
                <h3>{t.title}</h3>
                <p>{t.shortDescription}</p>
                <span className="link-arrow">Read More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
