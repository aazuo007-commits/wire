import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

const emptyForm = { name: "", email: "", phone: "", experience: "", location: "", comment: "" };

export default function CareerDetail() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState(null); // "submitting" | "success" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/careers/slug/${slug}`)
      .then((res) => setJob(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please upload your resume (PDF or DOC/DOCX).");
      return;
    }

    setStatus("submitting");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("resume", resumeFile);

      await api.post(`/careers/${job._id}/apply`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("success");
      setForm(emptyForm);
      setResumeFile(null);
      e.target.reset();
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (loading) return <div className="section container">Loading...</div>;

  if (notFound || !job) {
    return (
      <section className="section">
        <div className="container">
          <h1>Job Not Found</h1>
          <p>We couldn't find the position you're looking for.</p>
          <Link to="/careers" className="btn btn-primary">Back To Careers</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>{job.title}</h1>
          <p>
            {job.jobType} · {job.department}
            {job.department && job.location ? " · " : ""}
            {job.location}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container career-detail-grid">
          <div>
            <h2>Job Description</h2>
            <p>{job.description}</p>

            {job.requirements && (
              <>
                <h2>Requirements</h2>
                <p>{job.requirements}</p>
              </>
            )}

            {job.experience && (
              <p><strong>Experience Required:</strong> {job.experience}</p>
            )}
          </div>

          <div className="apply-form-card">
            <h2>Apply For This Job</h2>
            <p>Fill out the following form. Required fields are marked *</p>

            {status === "success" ? (
              <p className="form-success">
                Thanks for applying! We've received your resume and details, and our team will be in touch.
              </p>
            ) : (
              <form className="apply-form" onSubmit={onSubmit}>
                <div className="admin-form-field">
                  <label>Name *</label>
                  <input name="name" value={form.name} onChange={onChange} required />
                </div>
                <div className="admin-form-field">
                  <label>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="admin-form-field">
                  <label>Phone *</label>
                  <input name="phone" value={form.phone} onChange={onChange} required />
                </div>
                <div className="admin-form-field">
                  <label>Experience (in years) *</label>
                  <input name="experience" value={form.experience} onChange={onChange} required />
                </div>
                <div className="admin-form-field">
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={onChange} required />
                </div>
                <div className="admin-form-field">
                  <label>Select File - Upload Your Resume Here *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    required
                  />
                  <span className="hint">PDF or DOC/DOCX only</span>
                </div>
                <div className="admin-form-field">
                  <label>Comment *</label>
                  <textarea name="comment" rows={4} value={form.comment} onChange={onChange} required />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Apply Now"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
