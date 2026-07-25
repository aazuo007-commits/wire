import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function PolicyDetail() {
  const { slug } = useParams();
  const [policy, setPolicy] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/policies/slug/${slug}`)
      .then((res) => setPolicy(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (policy) document.title = policy.title;
  }, [policy]);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !policy) {
    return (
      <section className="section">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>We couldn't find the page you're looking for.</p>
          <Link to="/" className="btn btn-primary">Back To Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{policy.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container blog-detail-container">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: policy.content }} />
        </div>
      </section>
    </>
  );
}
