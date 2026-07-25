import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * A wide "mega menu" dropdown panel that always shows every item (in a
 * multi-column grid) plus a search box to quickly filter them by name.
 *
 * props.items: [{ key, label, to }]
 * props.open: boolean
 * props.onNavigate: called after a link is clicked (closes the menu)
 */
export default function NavMegaMenu({ items, open, onNavigate }) {
  const [query, setQuery] = useState("");

  // Reset the search box whenever the menu closes, so it's fresh next time it opens.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!items.length) return null;

  const filtered = query.trim()
    ? items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()))
    : items;

  return (
    <div className={`mega-menu ${open ? "open" : ""}`}>
      {items.length > 6 && (
        <input
          type="text"
          className="mega-menu-search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="mega-menu-grid">
        {filtered.map((item) => (
          <Link key={item.key} to={item.to} onClick={onNavigate}>
            {item.label}
          </Link>
        ))}
        {!filtered.length && <p className="mega-menu-empty">No matches found.</p>}
      </div>
    </div>
  );
}
