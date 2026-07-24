import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid"); // "grid" | "list"

  useEffect(() => {
    api
      .get("/careers")
      .then((res) => setJobs(res.data.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Careers</h1>
          <p>Join a team that builds technology people love to use.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="view-toggle">
            <button
              className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setView("grid")}
            >
              Grid View
            </button>
            <button
              className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setView("list")}
            >
              List View
            </button>
          </div>

          {loading && <p>Loading openings...</p>}

          {!loading && !jobs.length && <p>No open positions right now. Please check back soon.</p>}

          {!loading && !!jobs.length && view === "grid" && (
            <div className="grid-3 job-grid">
              {jobs.map((job) => (
                <Link to={`/careers/${job.slug}`} className="card job-card" key={job._id}>
                  <span className="eyebrow">{job.jobType}</span>
                  <h3>{job.title}</h3>
                  <p>{job.department}{job.department && job.location ? " · " : ""}{job.location}</p>
                  {job.experience && <p className="job-exp">Experience: {job.experience}</p>}
                  <span className="link-arrow">View & Apply →</span>
                </Link>
              ))}
            </div>
          )}

          {!loading && !!jobs.length && view === "list" && (
            <div className="job-list">
              {jobs.map((job) => (
                <div className="job-item" key={job._id}>
                  <div>
                    <h3>{job.title}</h3>
                    <p>
                      {job.jobType} · {job.department}
                      {job.department && job.location ? " · " : ""}
                      {job.location}
                      {job.experience ? ` · ${job.experience} experience` : ""}
                    </p>
                  </div>
                  <Link to={`/careers/${job.slug}`} className="btn btn-outline">View & Apply</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
