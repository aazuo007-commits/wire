import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

/**
 * Right-hand sidebar shown on submenu/topic detail pages: every submenu item,
 * grouped under its Parent Menu heading, with a search box to quickly filter
 * across all of them by name. Pulls live from the admin's Navigation Menu
 * module, so new parent menus/submenu items show up with no code changes.
 *
 * props.activeItemId: optional id to visually highlight the current page in the list
 */
export default function MenuSidebar({ activeItemId }) {
  const [groups, setGroups] = useState([]); // [{ parent: {title, slug}, items: [...] }]
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/parent-menus"), api.get("/submenu-items")])
      .then(([menusRes, itemsRes]) => {
        const menus = menusRes.data.data || [];
        const items = itemsRes.data.data || [];
        const grouped = menus
          .map((menu) => ({
            parent: menu,
            items: items.filter((item) => (item.parentMenu?._id || item.parentMenu) === menu._id),
          }))
          .filter((g) => g.items.length > 0);
        setGroups(grouped);
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const filteredGroups = q
    ? groups
        .map((g) => ({ ...g, items: g.items.filter((item) => item.name.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0)
    : groups;

  if (loading || !groups.length) return null;

  return (
    <aside className="menu-sidebar">
      <h3>Browse All</h3>
      <input
        type="text"
        className="menu-sidebar-search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {!filteredGroups.length && <p className="mega-menu-empty">No matches found.</p>}

      {filteredGroups.map((g) => (
        <div className="menu-sidebar-group" key={g.parent._id}>
          <h4>
            <Link to={`/${g.parent.slug}`}>{g.parent.title}</Link>
          </h4>
          <ul>
            {g.items.map((item) => (
              <li key={item._id}>
                <Link
                  to={`/${g.parent.slug}/${item.slug}`}
                  className={item._id === activeItemId ? "active" : ""}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
