//import { useState } from "react";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import api from "../api/axios.js";


export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data.data)).catch(() => setSettings(null));
  }, []);

  const email = settings?.contactEmail;
  const phone = settings?.contactPhone;
  const address   = settings?.contactAddress;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have a project in mind? Let's talk.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h3>Get In Touch</h3>
{/*            <p>{email}</p>
            <p>{phone}</p>
            <p>{address}</p>*/}
             {email && (
                <p className="contact-item">
                  <Mail size={18} />
                  <span>{email}</span>
                </p>
              )}
              {phone && (
                <p className="contact-item">
                  <Phone size={18} />
                  <span>{phone}</span>
                </p>
              )} 
                {address && (
                  <p className="contact-item">
                    <MapPin size={18} />
                    <span>{address}</span>
                  </p>
                )}
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Your Name" value={form.name} onChange={onChange} required />
              <input name="email" type="email" placeholder="Your Email" value={form.email} onChange={onChange} required />
            </div>
            <div className="form-row">
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} />
              <input name="subject" placeholder="Subject" value={form.subject} onChange={onChange} />
            </div>
            <textarea name="message" rows="6" placeholder="Your Message" value={form.message} onChange={onChange} required />
            <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "success" && <p className="form-success">Thanks! We'll get back to you soon.</p>}
            {status === "error" && <p className="form-error">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </section>
    </>
  );
}
