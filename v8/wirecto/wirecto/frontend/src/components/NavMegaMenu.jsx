import { Link } from "react-router-dom";

/**
 * A wide "mega menu" dropdown panel that shows every item in a multi-column grid.
 *
 * props.items: [{ key, label, to }]
 * props.open: boolean
 * props.onNavigate: called after a link is clicked (closes the menu)
 */
export default function NavMegaMenu({ items = [], open, onNavigate }) {
  if (!items.length) return null;

  return (
    <div className={`mega-menu ${open ? "open" : ""}`}>
      <div className="mega-menu-grid">
        {items.map((item) => (
          <Link key={item.key} to={item.to} onClick={onNavigate}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
