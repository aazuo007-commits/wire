import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .get("/search", { params: { q: query.trim() } })
        .then((res) => setResults(res.data.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="site-search" ref={boxRef}>
      <input
        type="text"
        value={query}
        placeholder={placeholder || "Search services, blogs, technologies..."}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && query.trim() && (
        <div className="site-search-results">
          {loading && <p className="hint">Searching...</p>}
          {!loading && !results.length && <p className="mega-menu-empty">No results found.</p>}
          {!loading &&
            results.map((r, i) => (
              <Link key={i} to={r.url} className="site-search-result" onClick={() => setOpen(false)}>
                <span className="site-search-result-type">{r.type}</span>
                <span className="site-search-result-title">{r.title}</span>
                {r.description && <span className="site-search-result-desc">{r.description}</span>}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
