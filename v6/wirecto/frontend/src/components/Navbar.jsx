import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../api/axios.js";
import NavMegaMenu from "./NavMegaMenu.jsx";

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
  const [services, setServices] = useState([]);

  // Dynamic, admin-managed parent menus (e.g. Expertise, Industries, Technology, Partners...)
  const [parentMenus, setParentMenus] = useState([]);
  const [submenusByParent, setSubmenusByParent] = useState({});

  // A single "which dropdown is open" id covers Services and every dynamic parent menu.
  const [openMenuId, setOpenMenuId] = useState(null);

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

    // Dynamic Navigation Menu module: any active Parent Menu with "Show In Header" checked,
    // plus ALL of its active submenu items, grouped client-side. Adding a new parent menu (or a
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
    setOpenMenuId(null);
  };

  const servicesItems = services.map((s) => ({ key: s._id, label: s.title, to: `/services/${s.slug}` }));

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

          {/* Services */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenMenuId("services")}
            onMouseLeave={() => setOpenMenuId((id) => (id === "services" ? null : id))}
          >
            <span className="nav-link-parent">
              <NavLink
                to="/services"
                className={({ isActive }) => `nav-link nav-link-label ${isActive ? "active" : ""}`}
                onClick={closeAll}
              >
                Services
              </NavLink>
              {servicesItems.length > 0 && (
                <button
                  type="button"
                  className="nav-caret-btn"
                  aria-label="Toggle Services submenu"
                  onClick={() => setOpenMenuId((id) => (id === "services" ? null : "services"))}
                >
                  ▾
                </button>
              )}
            </span>
            <NavMegaMenu items={servicesItems} open={openMenuId === "services"} onNavigate={closeAll} />
          </div>

          {/* Dynamic parent menus from the admin's Navigation Menu module — every submenu name
              under each parent is listed in the mega-menu panel, with a search box when there
              are more than a handful of items (e.g. Technology's 19 items). */}
          {parentMenus.map((menu) => {
            const items = (submenusByParent[menu._id] || []).map((item) => ({
              key: item._id,
              label: item.name,
              to: `/${menu.slug}/${item.slug}`,
            }));
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
                <NavMegaMenu items={items} open={openMenuId === menu._id} onNavigate={closeAll} />
              </div>
            );
          })}

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
