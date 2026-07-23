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
  { key: "careers", label: "Careers" },
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

    api
      .get("/applications")
      .then((res) => setCounts((c) => ({ ...c, applications: res.data.data.length })))
      .catch(() => setCounts((c) => ({ ...c, applications: "-" })));
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
        <div className="dash-card">
          <h3>{counts.applications ?? "…"}</h3>
          <p>Job Applications</p>
        </div>
      </div>
    </div>
  );
}
