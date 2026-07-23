import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", end: true },
  { to: "/admin/logo", label: "Logo" },
  { to: "/admin/banners", label: "Banners" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/expertise", label: "Expertise" },
  { to: "/admin/industries", label: "Industries" },
  { to: "/admin/technologies", label: "Technology" },
  { to: "/admin/partners", label: "Partners" },
  { to: "/admin/careers", label: "Careers" },
  { to: "/admin/applications", label: "Applications" },
  { to: "/admin/blogs", label: "Blogs" },
  { to: "/admin/blog-categories", label: "Blog Categories" },
  { to: "/admin/templates", label: "Templates" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/messages", label: "Messages" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Wirecto Admin</div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>Welcome, {admin?.name} ({admin?.role})</span>
          <button className="btn btn-outline" onClick={onLogout}>Logout</button>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
