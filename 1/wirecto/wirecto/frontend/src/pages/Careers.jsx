export default function Careers() {
  const openings = [
    { id: 1, title: "Frontend Developer (React)", type: "Full-time", location: "Remote / Noida" },
    { id: 2, title: "Backend Developer (Node.js)", type: "Full-time", location: "Remote / Noida" },
    { id: 3, title: "UI/UX Designer", type: "Full-time", location: "Remote / Noida" },
  ];

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
          <div className="job-list">
            {openings.map((job) => (
              <div className="job-item" key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.type} · {job.location}</p>
                </div>
                <a href="/contact" className="btn btn-outline">Apply Now</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
