import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const SOCIAL_LABELS = {
  facebook: "Facebook",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

export default function Footer() {
  const year = new Date().getFullYear();

  const [logo, setLogo] = useState(null);
  const [settings, setSettings] = useState(null);
  const [popularLinks, setPopularLinks] = useState([]); // merged Topics(footer) + ParentMenu(footer) items
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    // Dynamic logo (admin-managed, same source as the header)
    api.get("/logos").then((res) => setLogo(res.data.data?.[0] || null)).catch(() => setLogo(null));

    // Company tagline, contact details, and social links
    api.get("/settings").then((res) => setSettings(res.data.data)).catch(() => setSettings(null));

    // Policy pages (Privacy Policy, Terms & Conditions, etc.) for the bottom links row
    api.get("/policies").then((res) => setPolicies(res.data.data || [])).catch(() => setPolicies([]));

    // "Popular Links" = Topics marked "Show In Footer" + submenu items from any Parent Menu
    // marked "Show In Footer", merged into one flat, capped list.
    Promise.all([
      api.get("/topics", { params: { footer: true } }),
      api.get("/parent-menus", { params: { footer: true } }),
      api.get("/submenu-items"),
    ])
      .then(([topicsRes, menusRes, itemsRes]) => {
        const topics = topicsRes.data.data || [];
        const menus = menusRes.data.data || [];
        const items = itemsRes.data.data || [];
        const menuIds = new Set(menus.map((m) => m._id));
        const menuById = Object.fromEntries(menus.map((m) => [m._id, m]));

        const fromTopics = topics.map((t) => ({ key: `topic-${t._id}`, label: t.title, to: `/topics/${t.slug}` }));
        const fromMenus = items
          .filter((item) => menuIds.has(item.parentMenu?._id || item.parentMenu))
          .map((item) => {
            const menu = menuById[item.parentMenu?._id || item.parentMenu];
            return { key: `item-${item._id}`, label: item.name, to: `/${menu.slug}/${item.slug}` };
          });

        setPopularLinks([...fromTopics, ...fromMenus].slice(0, 10));
      })
      .catch(() => setPopularLinks([]));
  }, []);

  const socialEntries = Object.entries(settings?.social || {}).filter(([, url]) => url);

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          {logo ? (
            <img src={logo.imageUrl} alt={logo.name} className="footer-logo" />
          ) : (
            <h3 className="footer-brand">Wirecto</h3>
          )}
          <p>
            {settings?.companyTagline ||
              "Wirecto is a diversified IT services company delivering optimal technology solutions to businesses worldwide through the right blend of people, process, and technology."}
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

        {popularLinks.length > 0 && (
          <div>
            <h4>Popular Links</h4>
            <ul>
              {popularLinks.map((link) => (
                <li key={link.key}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4>Get In Touch</h4>
          <ul>
            {settings?.contactPhone && <li>{settings.contactPhone}</li>}
            {settings?.contactEmail && <li>{settings.contactEmail}</li>}
            {settings?.contactAddress && <li>{settings.contactAddress}</li>}
            {!settings?.contactPhone && !settings?.contactEmail && !settings?.contactAddress && (
              <>
                <li>info@wirecto.com</li>
                <li>+91-00000-00000</li>
                <li>Noida, Uttar Pradesh, India</li>
              </>
            )}
          </ul>

          {socialEntries.length > 0 && (
            <div className="footer-social">
              {socialEntries.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="footer-social-link">
                  {SOCIAL_LABELS[key] || key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} Wirecto. All Rights Reserved.</span>
          {policies.length > 0 && (
            <nav className="footer-policy-links">
              {policies.map((p) => (
                <Link key={p._id} to={`/legal/${p.slug}`}>{p.title}</Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
