import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").slice(0, 140);

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs").then((r) => setBlogs(r.data.data || [])).finally(() => setLoading(false));
    api.get("/blog-categories").then((r) => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  const filtered =
    activeCategory === "all"
      ? blogs
      : blogs.filter((b) => (b.category?.slug || b.category) === activeCategory);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Blog</h1>
          <p>News, tutorials, and updates from the Wirecto team.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-toolbar">
            <div className="category-filters">
              <button
                className={`btn btn-sm ${activeCategory === "all" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  className={`btn btn-sm ${activeCategory === c.slug ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setActiveCategory(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="view-toggle">
              <button className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-outline"}`} onClick={() => setView("grid")}>
                Grid View
              </button>
              <button className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-outline"}`} onClick={() => setView("list")}>
                List View
              </button>
            </div>
          </div>

          {loading && <p>Loading posts...</p>}
          {!loading && !filtered.length && <p>No blog posts yet. Add some from the admin dashboard.</p>}

          {!loading && !!filtered.length && view === "grid" && (
            <div className="grid-3">
              {filtered.map((post) => (
                <Link to={`/blog/${post.slug}`} className="card blog-card" key={post._id}>
                  {post.coverImage && <img src={post.coverImage} alt={post.title} />}
                  {post.category?.name && <span className="eyebrow">{post.category.name}</span>}
                  <h3>{post.title}</h3>
                  <p>{post.excerpt || stripHtml(post.content)}</p>
                  <span className="link-arrow">Read More →</span>
                </Link>
              ))}
            </div>
          )}

          {!loading && !!filtered.length && view === "list" && (
            <div className="blog-list">
              {filtered.map((post) => (
                <Link to={`/blog/${post.slug}`} className="blog-list-item" key={post._id}>
                  {post.coverImage && <img src={post.coverImage} alt={post.title} />}
                  <div>
                    {post.category?.name && <span className="eyebrow">{post.category.name}</span>}
                    <h3>{post.title}</h3>
                    <p>{post.excerpt || stripHtml(post.content)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
