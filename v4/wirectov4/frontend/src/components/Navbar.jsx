import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import api from "../api/axios.js";

const staticLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
];

const tailLinks = [
  { to: "/projects", label: "Project" },
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [logo, setLogo] = useState(null);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [topics, setTopics] = useState([]);

  // Dynamic, admin-managed parent menus (e.g. Expertise, Industries, Technology, Partners...)
  const [parentMenus, setParentMenus] = useState([]);
  const [submenusByParent, setSubmenusByParent] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null); // desktop hover / mobile accordion toggle

  useEffect(() => {
    api
      .get("/logos")
      .then((res) => setLogo(res.data.data?.[0] || null))
      .catch(() => setLogo(null));

    // Services added/updated from the admin dashboard automatically show up here.
    api
      .get("/services")
      .then((res) => setServices(res.data.data || []))
      .catch(() => setServices([]));

    // Topics marked "Show In Navbar" from the admin dashboard automatically show up here.
    api
      .get("/topics", { params: { navbar: true } })
      .then((res) => setTopics(res.data.data || []))
      .catch(() => setTopics([]));

    // Dynamic Navigation Menu module: any active Parent Menu with "Show In Header" checked,
    // plus its active submenu items, grouped client-side. Adding a new parent menu (or a new
    // future one like "Solutions") needs zero code changes — it just appears here.
    Promise.all([
      api.get("/parent-menus", { params: { header: true } }),
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
        setParentMenus(menus);
        setSubmenusByParent(grouped);
      })
      .catch(() => {
        setParentMenus([]);
        setSubmenusByParent({});
      });
  }, []);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
    setTopicsOpen(false);
    setOpenMenuId(null);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          {logo ? <img src={logo.imageUrl} alt={logo.name} /> : <span className="brand-text">Wirecto</span>}
        </NavLink>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {staticLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeAll}
            >
              {l.label}
            </NavLink>
          ))}

          <div
            className="nav-dropdown"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <span className="nav-link-parent">
              <NavLink
                to="/services"
                className={({ isActive }) => `nav-link nav-link-label ${isActive ? "active" : ""}`}
                onClick={closeAll}
              >
                Services
              </NavLink>
              {services.length > 0 && (
                <button
                  type="button"
                  className="nav-caret-btn"
                  aria-label="Toggle Services submenu"
                  onClick={() => setServicesOpen((o) => !o)}
                >
                  ▾
                </button>
              )}
            </span>

            {services.length > 0 && (
              <div className={`nav-dropdown-menu ${servicesOpen ? "open" : ""}`}>
                {services.map((s) => (
                  <Link key={s._id} to={`/services/${s.slug}`} onClick={closeAll}>
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic parent menus from the admin's Navigation Menu module */}
          {parentMenus.map((menu) => {
            const items = submenusByParent[menu._id] || [];
            const isOpen = openMenuId === menu._id;
            return (
              <div
                key={menu._id}
                className="nav-dropdown"
                onMouseEnter={() => setOpenMenuId(menu._id)}
                onMouseLeave={() => setOpenMenuId((id) => (id === menu._id ? null : id))}
              >
                <span className="nav-link nav-link-parent">
                  <NavLink to={`/${menu.slug}`} className="nav-link-label" onClick={closeAll}>
                    {menu.icon ? `${menu.icon} ` : ""}{menu.title}
                  </NavLink>
                  {items.length > 0 && (
                    <button
                      type="button"
                      className="nav-caret-btn"
                      aria-label={`Toggle ${menu.title} submenu`}
                      onClick={() => setOpenMenuId((id) => (id === menu._id ? null : menu._id))}
                    >
                      ▾
                    </button>
                  )}
                </span>

                {items.length > 0 && (
                  <div className={`nav-dropdown-menu ${isOpen ? "open" : ""}`}>
                    {items.map((item) => (
                      <Link key={item._id} to={`/${menu.slug}/${item.slug}`} onClick={closeAll}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {topics.length > 0 && (
            <div
              className="nav-dropdown"
              onMouseEnter={() => setTopicsOpen(true)}
              onMouseLeave={() => setTopicsOpen(false)}
            >
              <span className="nav-link-parent">
                <NavLink
                  to="/topics"
                  className={({ isActive }) => `nav-link nav-link-label ${isActive ? "active" : ""}`}
                  onClick={closeAll}
                >
                  Topics
                </NavLink>
                <button
                  type="button"
                  className="nav-caret-btn"
                  aria-label="Toggle Topics submenu"
                  onClick={() => setTopicsOpen((o) => !o)}
                >
                  ▾
                </button>
              </span>

              <div className={`nav-dropdown-menu ${topicsOpen ? "open" : ""}`}>
                {topics.map((t) => (
                  <Link key={t._id} to={`/topics/${t.slug}`} onClick={closeAll}>
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tailLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={closeAll}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
