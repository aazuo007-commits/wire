import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

// Sets (and cleans up) document title + meta tags from the post's SEO fields.
function useSeo(blog) {
  useEffect(() => {
    if (!blog) return;
    const seo = blog.seo || {};
    const prevTitle = document.title;
    document.title = seo.metaTitle || blog.title;

    const setMeta = (attr, key, content) => {
      if (!content) return null;
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      const created = !tag;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
      return created ? tag : null;
    };

    const createdTags = [
      setMeta("name", "description", seo.metaDescription),
      setMeta("name", "keywords", seo.metaKeywords),
      setMeta("property", "og:title", seo.metaTitle || blog.title),
      setMeta("property", "og:description", seo.metaDescription || blog.excerpt),
      setMeta("property", "og:image", seo.ogImage || blog.coverImage),
    ].filter(Boolean);

    let canonicalTag = null;
    if (seo.canonicalUrl) {
      const existing = document.querySelector('link[rel="canonical"]');
      const created = !existing;
      canonicalTag = existing || document.createElement("link");
      if (created) {
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute("href", seo.canonicalUrl);
      if (!created) canonicalTag = null; // only remove on cleanup if we created it
    }

    return () => {
      document.title = prevTitle;
      createdTags.forEach((tag) => tag.remove());
      if (canonicalTag) canonicalTag.remove();
    };
  }, [blog]);
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/blogs/slug/${slug}`)
      .then((res) => setBlog(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useSeo(blog);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !blog) {
    return (
      <section className="section">
        <div className="container">
          <h1>Post Not Found</h1>
          <p>We couldn't find the blog post you're looking for.</p>
          <Link to="/blog" className="btn btn-primary">Back To Blog</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{blog.title}</h1>
          <p>
            {blog.author} {blog.category?.name ? `· ${blog.category.name}` : ""} ·{" "}
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container blog-detail-container">
          {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="blog-detail-cover" />}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

          {!!blog.tags?.length && (
            <div className="blog-tags">
              {blog.tags.map((t) => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          )}

          <div className="btn-row">
            <Link to="/blog" className="btn btn-outline">Back To Blog</Link>
          </div>
        </div>
      </section>
    </>
  );
}
