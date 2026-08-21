import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Nav from "./components/Nav";
import Gallery from "../src/pages/Gallery";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import FloatingContactDock from "./components/FloatingContactDock";
import FloatingContactForm from "./components/FloatingContactForm";
import Admin from "./admin/Admin";

gsap.registerPlugin(ScrollTrigger);

function ScrollRefreshOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    // wait for the new page's content to actually paint/layout first
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Nav />}
      {!isAdminRoute && <FloatingContactForm />}
      <ScrollRefreshOnRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {!isAdminRoute && <FloatingContactDock />}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;