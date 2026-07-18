import React, { useEffect, useRef } from 'react'
import { FiMapPin, FiArrowUpRight } from 'react-icons/fi'
import { GiFlowerEmblem } from 'react-icons/gi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const TEXT = '#4A3F55'
const LINE = 'rgba(45,28,62,0.15)'

const FOUNDERS = [
  { name: 'Sahil Manjulkar', role: 'Co-Founder', initial: 'S', offset: 'sm:translate-y-0' },
  { name: 'Nityanand Bankar', role: 'Co-Founder', initial: 'N', offset: 'sm:translate-y-12' },
]

const AboutUs = () => {
  const containerRef = useRef(null)
  const leftColRef = useRef(null)
  const rightColRef = useRef(null)
  const headingRef = useRef(null)
  const paraRef = useRef(null)
  const founderCardsRef = useRef([])
  const decorativeLineRef = useRef(null)

  useEffect(() => {
    if (document.getElementById('crewaura-cormorant-font')) return
    const link = document.createElement('link')
    link.id = 'crewaura-cormorant-font'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&display=swap'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Line expansion
      gsap.fromTo(decorativeLineRef.current, 
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1.2, 
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      )

      // 2. Left column typography reveals (Clips and floats)
      const headingSplit = headingRef.current.querySelectorAll('.word-trigger')
      gsap.from(headingSplit, {
        yPercent: 100,
        stagger: 0.05,
        duration: 0.85,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        }
      })

      gsap.from(paraRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: paraRef.current,
          start: 'top 85%',
        }
      })

      // 3. Right column founder cards dynamic stagger & parallax float
      founderCardsRef.current.forEach((card, i) => {
        if (!card) return
        
        // Intro entrance
        gsap.from(card, {
          opacity: 0,
          y: 80,
          duration: 1,
          ease: 'power3.out',
          delay: i * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          }
        })

        // Subtle dynamic parallax scroll relation
        gsap.to(card, {
          y: i === 0 ? -20 : -50,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    // SEO Enhancement: Changed from basic <section> to semantic <section aria-labelledby="about-heading">
    <section 
      ref={containerRef} 
      className="relative overflow-hidden py-24 sm:py-36" 
      style={{ backgroundColor: IVORY }}
      aria-labelledby="about-heading"
    >
      {/* Structural Minimal Grid Background Accent Line */}
      <div ref={decorativeLineRef} className="absolute top-0 left-8 right-8 h-px origin-left" style={{ backgroundColor: LINE }} />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Content Layout Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Narrative & Statement Branding */}
          <div ref={leftColRef} className="lg:col-span-6 flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {/* Accessibility Fix: Added role="img" and aria-label to decorative icon */}
                <GiFlowerEmblem size={20} style={{ color: GOLD }} className="animate-spin-slow" role="img" aria-label="Decorative Floral Emblem" />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }} className="text-xs tracking-[0.25em] uppercase font-medium">
                  The Masterminds
                </span>
              </div>

              {/* 
                SEO Enhancement: Changed heading from <h2> to <h1> to signify the primary core concept 
                of the page section. Added id="about-heading" matching the section aria-labelledby declaration.
              */}
              <h1 
                id="about-heading"
                ref={headingRef}
                style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }} 
                className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.1] mb-8"
              >
                <span className="block overflow-hidden pb-1">
                  <span className="word-trigger inline-block">Crafting</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span className="word-trigger inline-block font-normal italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}>Experiences,</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span className="word-trigger inline-block">Not Just Events.</span>
                </span>
              </h1>

              {/* SEO Enhancement: Replaced raw <br /> nodes inside paragraph with clean semantic spacing */}
              <div 
                ref={paraRef}
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: TEXT }}
                className="text-base sm:text-lg leading-relaxed max-w-xl space-y-6 opacity-90"
              >
                <p>
                  Welcome to <strong style={{ color: PURPLE, fontWeight: 600 }}>Crew Aura</strong> — your premier narrative destination for unforgettable global celebrations. 
                  Co-founded by Sahil Manjulkar & Nityanand Bankar, we meticulously blend artistic visual poetry with geometric operational precision. 
                </p>
                <p>
                  From quiet beachside vows to massive ballroom corporate launches, we balance absolute elegance, infectious energy, and pristine execution.
                </p>
              </div>
            </div>

            {/* Anchored Base Location Label Container */}
            {/* SEO Enhancement: Added semantic <address> wrapping structure to geography keywords for indexing bots */}
            <address className="mt-12 lg:mt-24 inline-flex items-center gap-4 self-start border-b pb-2 not-italic" style={{ borderColor: LINE }}>
              <div className="p-2 rounded-full bg-stone-950/5">
                <FiMapPin size={16} style={{ color: GOLD }} role="img" aria-label="Location Marker" />
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }} className="text-xs tracking-wider uppercase font-medium">
                Navi Mumbai <span className="mx-1 text-stone-400" aria-hidden="true">•</span> Pan-India Destinations
              </p>
            </address>
          </div>

          {/* RIGHT COLUMN: Asymmetric Dynamic Portrait Grid */}
          <div ref={rightColRef} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pt-12">
            {FOUNDERS.map((founder, i) => (
              <div
                key={founder.name}
                ref={(el) => (founderCardsRef.current[i] = el)}
                className={`relative bg-white border p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_30px_70px_-20px_rgba(45,28,62,0.15)] group/card min-h-[380px] ${founder.offset}`}
                style={{ borderColor: LINE }}
              >
                {/* Accessibility Fix: Added aria-hidden to decorative background watermark letter */}
                <div 
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                  className="absolute top-4 right-6 text-7xl font-light italic opacity-10 select-none pointer-events-none transition-transform duration-700 group-hover/card:rotate-12"
                  aria-hidden="true"
                >
                  {founder.initial}
                </div>

                {/* Card Top Block */}
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-none border flex items-center justify-center text-xs font-light tracking-widest" style={{ borderColor: GOLD, color: PURPLE, fontFamily: "'Unbounded', sans-serif" }}>
                    0{i + 1}
                  </div>
                  <FiArrowUpRight size={20} className="opacity-30 group-hover/card:opacity-100 group-hover/card:translate-x-1 group-hover/card:-translate-y-1 transition-all duration-300" style={{ color: GOLD }} role="img" aria-label="View Profile Profile Indicator" />
                </div>

                {/* Card Bottom Block */}
                <div className="mt-auto">
                  <span 
                    style={{ color: GOLD, fontFamily: "'Space Grotesk', sans-serif" }}
                    className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-2"
                  >
                    {founder.role}
                  </span>
                  {/* SEO Enhancement: Changed from <h3> to <h2> to maintain clean structural heading progression under the new <h1> root */}
                  <h2 
                    style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                    className="text-xl font-light tracking-tight group-hover/card:text-[#C8A96A] transition-colors duration-300"
                  >
                    {founder.name}
                  </h2>
                  
                  {/* Fine structural baseline accent decoration */}
                  <div className="mt-6 h-px w-0 group-hover/card:w-full transition-all duration-700 ease-out" style={{ backgroundColor: GOLD }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutUs