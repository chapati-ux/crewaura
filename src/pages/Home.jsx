import React from "react";
import SEO from "../components/SEO";
import WeddingHero from "../components/WeddingHero ";
import AboutUs from "../components/AboutUs";
import Service from "../components/Service";
import Gall from "../components/Gall";
import Testimonial from "../components/Testimonial";
import CircularGallery from "../reactbit/CircularGallery";
import BookEventSection from "../components/Bookeventsection";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Crew Aura",
  description:
    "Destination wedding planner based in Navi Mumbai, designing and managing weddings across India and abroad.",
  url: "https://crewaura.com",
  image: "https://crewaura.com/og-image.jpg",
  telephone: "+91-7021565980",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Navi Mumbai",
    addressLocality: "Navi Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400703",
    addressCountry: "IN",
  },
  areaServed: ["Navi Mumbai", "Mumbai", "India"],
  sameAs: [
    "https://www.instagram.com/yourhandle",
    "https://www.facebook.com/yourpage",
  ],
};

const Home = () => {
  return (
    <div>
      <SEO schema={localBusinessSchema} />
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
      <BookEventSection />
    </div>
  );
};

export default Home;