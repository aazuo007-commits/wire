import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const resources = [
  { key: "logos", label: "Logo" },
  { key: "banners", label: "Banners" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Projects" },
  { key: "expertise", label: "Expertise" },
  { key: "industries", label: "Industries" },
  { key: "technologies", label: "Technology" },
  { key: "partners", label: "Partners" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    resources.forEach((r) => {
      api
        .get(`/${r.key}?all=true`)
        .then((res) => setCounts((c) => ({ ...c, [r.key]: res.data.data.length })))
        .catch(() => setCounts((c) => ({ ...c, [r.key]: "-" })));
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Manage all Wirecto website content from here.</p>
      <div className="dash-grid">
        {resources.map((r) => (
          <div className="dash-card" key={r.key}>
            <h3>{counts[r.key] ?? "…"}</h3>
            <p>{r.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
