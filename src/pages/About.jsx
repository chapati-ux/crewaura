import React, { useLayoutEffect, useRef } from "react";
import { FaRing } from "react-icons/fa";
import gsap from "gsap";

const About = () => {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    // Create a context to safely manage GSAP scopes in React
    let ctx = gsap.context(() => {
      // 1. Gentle fade and scale up for the ring icon
      gsap.fromTo(
        ringRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      );

      // 2. Smooth staggered upward fade for the text elements
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
          delay: 0.2,
        },
      );
    }, containerRef);

    return () => ctx.revert(); // Clean up animations on unmount
  }, []);

  return (
    <main
      ref={containerRef}
      className="min-h-screen pt-28 pb-24 transition-colors duration-500"
      style={{ backgroundColor: "#FFFFFF" }} // Clean White Background
    >
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
{/* Animated Icon Wrapper */}
<div ref={ringRef} className="opacity-0">
  <span
    style={{ fontFamily: "'Cinzel Decorative', serif" }}
    className="flex justify-center text-xl tracking-tight sm:text-2xl mx-auto mb-6"
  >
    CREWAURA
  </span>
</div>

        {/* Animated Text Block & Semantic SEO Hierarchy */}
        <div ref={textRef}>
          {/* Subtitle / Context tag */}
          <span
            className="block text-xs font-semibold uppercase tracking-[0.3em] opacity-0"
            style={{ color: "#C8A96A", fontFamily: "'Poppins', sans-serif" }}
          >
            Our Story
          </span>

          {/* Core SEO Target: Critical H1 heading indicating exact identity and location focus */}
          <h1
            className="mt-4 text-4xl font-bold leading-tight sm:text-5xl opacity-0"
            style={{
              color: "#1A1A1A",
              fontFamily: "'Playfair Display', serif",
            }} // Dark elegant contrast text
          >
            About Crew Aura | Luxury Wedding Planners
          </h1>

          {/* Descriptive body containing conversational organic keywords */}
          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg opacity-0"
            style={{ color: "#4A4A4A", fontFamily: "'Poppins', sans-serif" }} // Readable softer dark gray text
          >
            For over a decade, Crew Aura has turned unique love stories into
            unforgettable destination celebrations. From quiet beachside vows to
            grand ballroom affairs across Navi Mumbai and pan-India
            destinations, our team manages meticulous operational execution so
            you can simply remain fully present in your own magical moment.
          </p>
        </div>
      </div>
    </main>
  );
};

export default About;
