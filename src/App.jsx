import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Nav from "./components/Nav";
import Gallery from "../src/pages/Gallery";
import Services from "./pages/Services";
import Footer from "./components/Footer";
import FloatingContactDock from "./components/FloatingContactDock";
function App() {
  return (
    <>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery/>} />
                <Route path="/services" element={<Services/>} />

      </Routes>
      <FloatingContactDock/>
      <Footer/>
    </>
  );
}

export default App;
