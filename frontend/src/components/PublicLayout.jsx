import { Outlet } from "react-router-dom";
import TopStrip from "./TopStrip.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PublicLayout() {
  return (
    <>
      <TopStrip />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
