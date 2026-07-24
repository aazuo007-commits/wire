import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function ParentMenuPage() {
  const { parentSlug } = useParams();
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/parent-menus/slug/${parentSlug}`)
      .then((res) => {
        setMenu(res.data.data);
        return api.get("/submenu-items", { params: { parent: res.data.data._id } });
      })
      .then((res) => setItems(res?.data.data || []))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [parentSlug]);

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !menu) {
    return (
      <section className="section">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>We couldn't find the section you're looking for.</p>
          <Link to="/" className="btn btn-primary">Back To Home</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{menu.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>{menu.title}</span>
          </nav>
          {!items.length && <p>No pages published under {menu.title} yet.</p>}
          <div className="grid-3">
            {items.map((item) => (
              <Link to={`/${menu.slug}/${item.slug}`} className="card" key={item._id}>
                {item.featuredImage && <img src={item.featuredImage} alt={item.name} className="related-topic-image" />}
                <h3>{item.name}</h3>
                <p>{item.shortDescription}</p>
                <span className="link-arrow">Read More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
