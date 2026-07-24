import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Footer() {
  const year = new Date().getFullYear();
  const [topics, setTopics] = useState([]);
  const [footerMenus, setFooterMenus] = useState([]);
  const [submenusByParent, setSubmenusByParent] = useState({});

  useEffect(() => {
    // Topics marked "Show In Footer" from the admin dashboard automatically show up here.
    api
      .get("/topics", { params: { footer: true } })
      .then((res) => setTopics(res.data.data || []))
      .catch(() => setTopics([]));

    // Dynamic Navigation Menu module: any active Parent Menu with "Show In Footer" checked,
    // shown here as a quick-link column with its submenu items underneath.
    Promise.all([
      api.get("/parent-menus", { params: { footer: true } }),
      api.get("/submenu-items"),
    ])
      .then(([menusRes, itemsRes]) => {
        const menus = menusRes.data.data || [];
        const items = itemsRes.data.data || [];
        const grouped = {};
        items.forEach((item) => {
          const pid = item.parentMenu?._id || item.parentMenu;
          if (!pid) return;
          if (!grouped[pid]) grouped[pid] = [];
          grouped[pid].push(item);
        });
        setFooterMenus(menus);
        setSubmenusByParent(grouped);
      })
      .catch(() => {
        setFooterMenus([]);
        setSubmenusByParent({});
      });
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">Wirecto</h3>
          <p>
            Wirecto is a diversified IT services company delivering optimal technology solutions to
            businesses worldwide through the right blend of people, process, and technology.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/projects">Project</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        {topics.length > 0 && (
          <div>
            <h4>Topics</h4>
            <ul>
              {topics.map((t) => (
                <li key={t._id}><Link to={`/topics/${t.slug}`}>{t.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {footerMenus.map((menu) => {
          const items = (submenusByParent[menu._id] || []).slice(0, 8);
          return (
            <div key={menu._id}>
              <h4><Link to={`/${menu.slug}`}>{menu.title}</Link></h4>
              <ul>
                {items.map((item) => (
                  <li key={item._id}><Link to={`/${menu.slug}/${item.slug}`}>{item.name}</Link></li>
                ))}
              </ul>
            </div>
          );
        })}
        <div>
          <h4>Contact</h4>
          <ul>
            <li>info@wirecto.com</li>
            <li>+91-00000-00000</li>
            <li>Noida, Uttar Pradesh, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {year} Wirecto. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
