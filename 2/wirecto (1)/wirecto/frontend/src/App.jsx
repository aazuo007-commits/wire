import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import Projects from "./pages/Projects.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Careers from "./pages/Careers.jsx";
import CareerDetail from "./pages/CareerDetail.jsx";
import Contact from "./pages/Contact.jsx";

import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Logos from "./pages/admin/Logos.jsx";
import Banners from "./pages/admin/Banners.jsx";
import AdminServices from "./pages/admin/Services.jsx";
import AdminProjects from "./pages/admin/Projects.jsx";
import Expertise from "./pages/admin/Expertise.jsx";
import Industries from "./pages/admin/Industries.jsx";
import Technologies from "./pages/admin/Technologies.jsx";
import Partners from "./pages/admin/Partners.jsx";
import AdminCareers from "./pages/admin/Careers.jsx";
import Applications from "./pages/admin/Applications.jsx";
import AdminBlogs from "./pages/admin/Blogs.jsx";
import BlogCategories from "./pages/admin/BlogCategories.jsx";
import Templates from "./pages/admin/Templates.jsx";
import SiteSettings from "./pages/admin/SiteSettings.jsx";
import Messages from "./pages/admin/Messages.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:slug" element={<CareerDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin dashboard (superadmin only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="logo" element={<Logos />} />
        <Route path="banners" element={<Banners />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="expertise" element={<Expertise />} />
        <Route path="industries" element={<Industries />} />
        <Route path="technologies" element={<Technologies />} />
        <Route path="partners" element={<Partners />} />
        <Route path="careers" element={<AdminCareers />} />
        <Route path="applications" element={<Applications />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="blog-categories" element={<BlogCategories />} />
        <Route path="templates" element={<Templates />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
    </Routes>
  );
}
