import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-brand">Wirecto</h3>
          <p>
            Wirecto is a diversified IT services company delivering optimal technology solutions to
            businesses worldwide through the right blend of people, process, and technology.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/projects">Project</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>info@wirecto.com</li>
            <li>+91-00000-00000</li>
            <li>Noida, Uttar Pradesh, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">© {year} Wirecto. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
