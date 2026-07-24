import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/applications", { params: { search, sort } })
      .then((res) => setApplications(res.data.data || []))
      .finally(() => setLoading(false));
  };

  // Reload whenever search or sort changes (debounced a little for search-as-you-type)
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  const markRead = async (id) => {
    await api.put(`/applications/${id}/read`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await api.delete(`/applications/${id}`);
    load();
  };

  return (
    <div>
      <h1>Job Applications</h1>
      <p>All "Apply Now" submissions from the Careers pages.</p>

      <div className="applications-toolbar">
        <input
          className="applications-search"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Sort: Latest First</option>
          <option value="oldest">Sort: Oldest First</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Job Applied For</th>
                <th>Experience</th>
                <th>Location</th>
                <th>Resume</th>
                <th>Read</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <React.Fragment key={a._id}>
                  <tr>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.phone}</td>
                    <td>{a.careerTitle || a.career?.title}</td>
                    <td>{a.experience}</td>
                    <td>{a.location}</td>
                    <td>
                      <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="admin-file-preview">
                        View Resume
                      </a>
                    </td>
                    <td>{a.isRead ? "Yes" : "No"}</td>
                    <td className="admin-table-actions">
                      <button className="btn btn-sm" onClick={() => setExpandedId(expandedId === a._id ? null : a._id)}>
                        {expandedId === a._id ? "Hide" : "Details"}
                      </button>
                      {!a.isRead && (
                        <button className="btn btn-sm" onClick={() => markRead(a._id)}>Mark Read</button>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => remove(a._id)}>Delete</button>
                    </td>
                  </tr>
                  {expandedId === a._id && (
                    <tr>
                      <td colSpan={9} className="application-detail-row">
                        <strong>Comment:</strong> {a.comment || "—"}
                        <br />
                        <strong>Applied:</strong> {new Date(a.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!applications.length && (
                <tr><td colSpan={9}>No applications yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
