import React, { useLayoutEffect, useRef } from "react";
import { FaRing } from "react-icons/fa";
import gsap from "gsap";

const PARTICLE_COUNT = 8;

const About = () => {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const ringIconRef = useRef(null);
  const glowRef = useRef(null);
  const dividerRef = useRef(null);
  const textRef = useRef(null);
  const headingRef = useRef(null);
  const particleRefs = useRef([]);

  useLayoutEffect(() => {
    // Create a context to safely manage GSAP scopes in React
    let ctx = gsap.context(() => {
      // 1. Gentle fade and scale up for the ring icon block
      gsap.fromTo(
        ringRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      );

      // 1a. Soft pulsing glow behind the ring icon
      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 0.55,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(glowRef.current, {
              opacity: 0.25,
              scale: 1.3,
              duration: 2.4,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          },
        },
      );

      // 1b. Ring icon: drop in with a little rotation, then float + slowly spin forever
      gsap.fromTo(
        ringIconRef.current,
        { opacity: 0, y: -20, rotate: -25, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Continuous gentle float
            gsap.to(ringIconRef.current, {
              y: -6,
              duration: 2.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            // Continuous slow spin
            gsap.to(ringIconRef.current, {
              rotate: 360,
              duration: 12,
              ease: "none",
              repeat: -1,
            });
          },
        },
      );

      // 1c. Divider line expands outward after the logo settles
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power2.inOut",
          delay: 0.5,
        },
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

      // 2b. Word-by-word reveal for the heading (overrides the plain fade above)
      const words = headingRef.current.querySelectorAll(".word-reveal");
      gsap.fromTo(
        words,
        { opacity: 0, y: 16, rotateX: -40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.6,
        },
      );

      // 3. Floating background particles (sparkles / petals)
      particleRefs.current.forEach((el, i) => {
        if (!el) return;
        const startX = gsap.utils.random(-30, 30);
        const drift = gsap.utils.random(-50, 50);
        const duration = gsap.utils.random(8, 14);
        const delay = gsap.utils.random(0, 5);

        gsap.set(el, {
          x: startX,
          y: 60,
          opacity: 0,
          rotate: gsap.utils.random(-30, 30),
        });

        gsap.to(el, {
          y: -520,
          x: startX + drift,
          rotate: "+=180",
          opacity: 0.5,
          duration,
          delay,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, containerRef);

    return () => ctx.revert(); // Clean up animations on unmount
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pt-28 pb-24 transition-colors duration-500"
      style={{ backgroundColor: "#FFFFFF" }} // Clean White Background
    >
      {/* Floating background particles layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (particleRefs.current[i] = el)}
            className="absolute rounded-full"
            style={{
              left: `${10 + ((i * 89) % 85)}%`,
              bottom: "5%",
              width: i % 3 === 0 ? 8 : 5,
              height: i % 3 === 0 ? 11 : 7,
              backgroundColor: i % 2 === 0 ? "#C8A96A" : "#1A1A1A",
              opacity: 0.12,
              borderRadius: "60% 40% 60% 40%",
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        {/* Animated Icon Wrapper */}
        <div ref={ringRef} className="opacity-0">
          {/* Soft pulsing glow + floating / rotating ring icon */}
          <div className="relative flex justify-center mb-3">
            <div
              ref={glowRef}
              className="absolute h-14 w-14 rounded-full blur-xl opacity-0"
              style={{ backgroundColor: "#C8A96A" }}
              aria-hidden="true"
            />
            <div ref={ringIconRef} className="relative opacity-0">
              <FaRing size={22} style={{ color: "#C8A96A" }} aria-hidden="true" />
            </div>
          </div>

          <span
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
            className="flex justify-center text-xl tracking-tight sm:text-2xl mx-auto mb-4"
          >
            CREWAURA
          </span>

          {/* Expanding divider line */}
          <div
            ref={dividerRef}
            className="mx-auto h-px w-16 origin-center mb-6"
            style={{ backgroundColor: "#C8A96A", opacity: 0 }}
          />
        </div>

        {/* Animated Text Block & Semantic SEO Hierarchy */}
        <div ref={textRef} style={{ perspective: 600 }}>
          {/* Subtitle / Context tag */}
          <span
            className="block text-xs font-semibold uppercase tracking-[0.3em] opacity-0"
            style={{ color: "#C8A96A", fontFamily: "'Poppins', sans-serif" }}
          >
            Our Story
          </span>

          {/* Core SEO Target: Critical H1 heading indicating exact identity and location focus */}
          <h1
            ref={headingRef}
            className="mt-4 text-4xl font-bold leading-tight sm:text-5xl"
            style={{
              color: "#1A1A1A",
              fontFamily: "'Playfair Display', serif",
            }} // Dark elegant contrast text
          >
            {["About", "Crew", "Aura", "|", "Luxury", "Wedding", "Planners"].map(
              (word, i) => (
                <span
                  key={i}
                  className="word-reveal inline-block mr-2 sm:mr-3 opacity-0"
                  style={{ transformOrigin: "50% 100%" }}
                >
                  {word}
                </span>
              ),
            )}
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