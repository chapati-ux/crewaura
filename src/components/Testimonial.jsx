import React, { useState, useRef, useCallback, useLayoutEffect } from "react";
import gsap from "gsap";
import testimonials from "../data/testimonials";

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = testimonials.length;

  // "next" -> card enters from the right, "prev" -> from the left
  const directionRef = useRef("next");

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const ruleRef = useRef(null);
  const cardRef = useRef(null);
  const markRef = useRef(null);
  const quoteRef = useRef(null);
  const personRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const dotRefs = useRef([]);
  const autoplayRef = useRef(null);

  const goTo = useCallback(
    (index, dir = "next") => {
      directionRef.current = dir;
      setActiveIndex((index + total) % total);
    },
    [total]
  );

  const handlePrev = () => goTo(activeIndex - 1, "prev");
  const handleNext = useCallback(() => goTo(activeIndex + 1, "next"), [activeIndex, goTo]);

  // ---- One-time entrance animation for the section header ----
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(eyebrowRef.current, { y: 14, opacity: 0, duration: 0.5 })
        .from(headingRef.current, { y: 18, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(ruleRef.current, { scaleX: 0, transformOrigin: "center", duration: 0.6 }, "-=0.35")
        .from(cardRef.current, { y: 24, opacity: 0, duration: 0.7 }, "-=0.3")
        .from(
          [prevBtnRef.current, nextBtnRef.current],
          { opacity: 0, scale: 0.6, duration: 0.4, stagger: 0.1 },
          "-=0.5"
        )
        .from(
          dotRefs.current,
          { opacity: 0, y: 6, duration: 0.35, stagger: 0.06 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Slide transition whenever the active testimonial changes ----
  useLayoutEffect(() => {
    const dir = directionRef.current === "next" ? 1 : -1;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        cardRef.current,
        { x: 48 * dir, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 }
      )
        .fromTo(
          markRef.current,
          { opacity: 0, scale: 0.5, rotate: -8 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.5 },
          "<"
        )
        .fromTo(
          quoteRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          personRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeIndex]);

  // ---- Animate the active dot ----
  useLayoutEffect(() => {
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      gsap.to(dot, {
        scale: i === activeIndex ? 1.25 : 1,
        backgroundColor: i === activeIndex ? "#C98B7A" : "#E5DDD0",
        duration: 0.35,
        ease: "power2.out",
      });
    });
  }, [activeIndex]);

  // ---- Autoplay ----
  useLayoutEffect(() => {
    autoplayRef.current = setInterval(() => handleNext(), 6000);
    return () => clearInterval(autoplayRef.current);
  }, [handleNext]);

  const restartAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => handleNext(), 6000);
  };

  const onPrevClick = () => {
    handlePrev();
    restartAutoplay();
  };

  const onNextClick = () => {
    handleNext();
    restartAutoplay();
  };

  const onDotClick = (i) => {
    goTo(i, i > activeIndex ? "next" : "prev");
    restartAutoplay();
  };

  // ---- Arrow hover micro-interaction ----
  const onArrowEnter = (ref) => {
    gsap.to(ref.current, { scale: 1.12, duration: 0.25, ease: "power2.out" });
  };
  const onArrowLeave = (ref) => {
    gsap.to(ref.current, { scale: 1, duration: 0.25, ease: "power2.out" });
  };

  const active = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      aria-label="Couples who trusted us"
      className="bg-white py-24 px-6 text-center font-serif text-[#2B2620]"
    >
      {/* Eyebrow */}
      <div
        ref={eyebrowRef}
        className="font-sans text-xs tracking-[0.32em] uppercase text-[#C98B7A] mb-3"
      >
        Love Notes
      </div>

      {/* Heading */}
      <h2 ref={headingRef} className="text-3xl md:text-4xl font-medium mb-5 tracking-wide">
        Words from our couples
      </h2>

      {/* Gold divider with diamond */}
      <div ref={ruleRef} className="relative w-16 h-px bg-[#B08D57] mx-auto mb-14">
        <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#B08D57] rotate-45" />
      </div>

      {/* Stage */}
      <div className="flex items-center justify-center gap-3 md:gap-6 max-w-3xl mx-auto">
        <button
          ref={prevBtnRef}
          onClick={onPrevClick}
          onMouseEnter={() => onArrowEnter(prevBtnRef)}
          onMouseLeave={() => onArrowLeave(prevBtnRef)}
          aria-label="Previous testimonial"
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#E5DDD0] text-[#B08D57] text-base md:text-xl leading-none
                     hover:bg-[#FAF7F2] hover:border-[#B08D57] transition-colors
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C98B7A] focus-visible:outline-offset-2"
        >
          &#8249;
        </button>

        <div
          ref={cardRef}
          className="flex-1 relative bg-[#FAF7F2] rounded-sm px-6 py-10 md:px-12 md:py-14
                     shadow-[0_20px_40px_-28px_rgba(43,38,32,0.25)] overflow-hidden"
        >
          <span
            ref={markRef}
            aria-hidden="true"
            className="absolute top-2 left-6 md:left-8 text-6xl md:text-7xl leading-none text-[#E3CDB8] font-serif select-none"
          >
            &#8220;
          </span>

          <p ref={quoteRef} className="text-lg md:text-2xl italic leading-relaxed text-[#3A352C] mb-8">
            {active.quote}
          </p>

          <div
            ref={personRef}
            className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3.5"
          >
            <img
              src={active.avatar}
              alt={active.names}
              className="w-12 h-12 rounded-full object-cover border border-[#B08D57] p-0.5"
            />
            <div className="text-center md:text-left">
              <div className="font-sans text-sm font-medium tracking-wide">
                {active.names}
              </div>
              <div className="font-sans text-xs text-[#7A7266] mt-0.5">
                {active.role} &middot; {active.date}
              </div>
            </div>
          </div>
        </div>

        <button
          ref={nextBtnRef}
          onClick={onNextClick}
          onMouseEnter={() => onArrowEnter(nextBtnRef)}
          onMouseLeave={() => onArrowLeave(nextBtnRef)}
          aria-label="Next testimonial"
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#E5DDD0] text-[#B08D57] text-base md:text-xl leading-none
                     hover:bg-[#FAF7F2] hover:border-[#B08D57] transition-colors
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C98B7A] focus-visible:outline-offset-2"
        >
          &#8250;
        </button>
      </div>

      {/* Dots */}
      <div
        role="tablist"
        aria-label="Select testimonial"
        className="flex justify-center gap-2.5 mt-10"
      >
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (dotRefs.current[i] = el)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Show testimonial from ${t.names}`}
            onClick={() => onDotClick(i)}
            className="w-2 h-2 rounded-full bg-[#E5DDD0]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C98B7A] focus-visible:outline-offset-2"
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
