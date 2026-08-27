import React from "react";
import WeddingHero from "../components/WeddingHero ";
import AboutUs from "../components/AboutUs";
import Service from "../components/Service";
import Gall from "../components/Gall";
import Testimonial from "../components/Testimonial";
import CircularGallery from "../reactbit/CircularGallery";

const Home = () => {
  return (
    <div>
      <WeddingHero />
      <AboutUs />
      <Service />
      {/* <Gall/> */}
      <CircularGallery
        bend={1}
        textColor="#ffffff"
        borderRadius={0.05}
        scrollEase={0.05}
        // Loads Orbitron from Google Fonts before drawing the labels.
        // Leave fontUrl empty (or omit it) to fall back to the default Figtree.
        fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
        font="bold 30px Orbitron"
        scrollSpeed={2}
      />
      <Testimonial />
    </div>
  );
};

export default Home;