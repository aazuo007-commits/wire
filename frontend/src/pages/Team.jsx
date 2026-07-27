import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/team-members").then((r) => setMembers(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Team Members</h1>
          <p>The people building and delivering Wirecto's work every day.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <p>Loading...</p>}
          {!loading && !members.length && <p>Team members will appear here once added from the admin dashboard.</p>}

          <div className="grid-4">
            {members.map((m) => (
              <div className="card member-card" key={m._id}>
                {m.photo && <img src={m.photo} alt={m.name} className="member-photo" />}
                <h3>{m.name}</h3>
                {m.designation && <p className="member-designation">{m.designation}{m.department ? ` · ${m.department}` : ""}</p>}
                {m.bio && <p>{m.bio}</p>}
                <div className="member-social">
                  {m.linkedinUrl && <a href={m.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>}
                  {m.twitterUrl && <a href={m.twitterUrl} target="_blank" rel="noreferrer">X / Twitter</a>}
                  {m.email && <a href={`mailto:${m.email}`}>Email</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
