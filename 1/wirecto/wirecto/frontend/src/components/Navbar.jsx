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
  const [services, setServices] = useState([]);

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
  }, []);

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
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          <div
            className="nav-dropdown"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <NavLink
              to="/services"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              Services {services.length > 0 && <span className="caret">▾</span>}
            </NavLink>

            {services.length > 0 && (
              <div className={`nav-dropdown-menu ${servicesOpen ? "open" : ""}`}>
                {services.map((s) => (
                  <Link
                    key={s._id}
                    to={`/services/${s.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setServicesOpen(false);
                    }}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {tailLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
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
