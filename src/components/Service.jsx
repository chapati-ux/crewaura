import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import services from '../data/services'

// Unsplash images arrive large; request a smaller crop for optimized loading.
const thumb = (url) => url.replace('w=800', 'w=600')

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const TEXT = '#4A3F55'
const LINE = 'rgba(45,28,62,0.15)'

// How many services to preview on this section
const PREVIEW_COUNT = 5

const Service = () => {
  const sectionRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headingLettersRef = useRef([])
  const dividerLineRefs = useRef([])
  const cardRefs = useRef([])
  const blobRefs = useRef([])
  const tiltRefs = useRef([]) // GSAP quickTo setters per card
  const ctaRef = useRef(null)

  const heading = 'Our Services'
  let letterIndex = 0

  // Only render a subset of services on this page
  const visibleServices = services.slice(0, PREVIEW_COUNT)

  useEffect(() => {
    if (document.getElementById('crewaura-cormorant-font')) return
    const link = document.createElement('link')
    link.id = 'crewaura-cormorant-font'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@1&display=swap'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ambient floating blobs
      blobRefs.current.forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? 30 : -30,
          x: i % 2 === 0 ? -15 : 15,
          duration: 6 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      gsap.set(eyebrowRef.current, { opacity: 0, y: 15 })
      gsap.set(headingLettersRef.current, { y: 40, opacity: 0, rotate: () => gsap.utils.random(-6, 6) })
      gsap.set(dividerLineRefs.current, { scaleX: 0 })
      gsap.set(cardRefs.current, { 
        y: 60, 
        opacity: 0, 
        scale: 0.95, 
        rotate: (i) => i % 2 === 0 ? 2 : -2 
      })
      gsap.set(ctaRef.current, { opacity: 0, y: 20 })

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(headingLettersRef.current, { y: 0, opacity: 1, rotate: 0, duration: 0.7, stagger: 0.03 }, '-=0.4')
        .to(dividerLineRefs.current, { scaleX: 1, duration: 0.6, stagger: 0.1, ease: 'power2.inOut' }, '-=0.3')
        .to(
          cardRefs.current,
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' },
          '-=0.2'
        )
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Cinematic 3D tilt tracking the cursor
  const handleMove = (e, i) => {
    const card = cardRefs.current[i]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    
    if (!tiltRefs.current[i]) {
      tiltRefs.current[i] = {
        rx: gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power2.out' }),
        ry: gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power2.out' }),
      }
    }
    tiltRefs.current[i].rx(py * -6)
    tiltRefs.current[i].ry(px * 6)
  }

  const handleLeave = (i) => {
    const t = tiltRefs.current[i]
    if (!t) return
    t.rx(0)
    t.ry(0)
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32" style={{ backgroundColor: IVORY }}>
      {/* Fine paper-grain texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${LINE} 0.5px, transparent 0.5px)`,
          backgroundSize: '24px 24px',
          opacity: 0.4,
        }}
      />

      {/* Ambient soft glow elements */}
      <div
        ref={(el) => (blobRefs.current[0] = el)}
        className="pointer-events-none absolute -right-32 top-12 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(200,169,106,0.08)' }}
      />
      <div
        ref={(el) => (blobRefs.current[1] = el)}
        className="pointer-events-none absolute -left-32 bottom-12 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(45,28,62,0.05)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading Block */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            ref={eyebrowRef}
            style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
            className="text-xl italic sm:text-2xl tracking-wide"
          >
            What We Offer
          </p>

          <h2
            style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
            className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl leading-tight sm:text-5xl"
          >
            {heading.split(' ').map((word, wi) => (
              <span key={wi} className="flex">
                {word.split('').map((char, ci) => {
                  const idx = letterIndex++
                  return (
                    <span
                      key={ci}
                      ref={(el) => (headingLettersRef.current[idx] = el)}
                      style={{ display: 'inline-block' }}
                    >
                      {char}
                    </span>
                  )
                })}
              </span>
            ))}
          </h2>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span
              ref={(el) => (dividerLineRefs.current[0] = el)}
              className="h-px w-14 origin-right"
              style={{ backgroundColor: GOLD }}
            />
            <span style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }} className="text-xl">
              ✦
            </span>
            <span
              ref={(el) => (dividerLineRefs.current[1] = el)}
              className="h-px w-14 origin-left"
              style={{ backgroundColor: GOLD }}
            />
          </div>

          <p
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: TEXT }}
            className="mx-auto mt-6 max-w-md text-sm opacity-90 leading-relaxed"
          >
            Every celebration is built from the same handful of details, done flawlessly.
            Here is everything Crew Aura meticulously crafts for you.
          </p>
        </div>

        {/* Asymmetric Editorial Magazine Grid Layout */}
        <div 
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[340px]" 
          style={{ perspective: 1200 }}
        >
          {visibleServices.map((service, i) => {
            // Generates an elegant magazine pattern layout layout dynamically
            const isWide = i === 0 || i === 5; 
            const isTall = i === 2 || i === 7;

            return (
              <div
                key={service.id}
                ref={(el) => (cardRefs.current[i] = el)}
                onMouseMove={(e) => handleMove(e, i)}
                onMouseLeave={() => handleLeave(i)}
                className={`group relative overflow-hidden bg-zinc-950 flex flex-col justify-end p-8 transition-shadow duration-500 hover:shadow-2xl cursor-pointer
                  ${isWide ? 'sm:col-span-2' : ''} 
                  ${isTall ? 'sm:row-span-2' : ''}`}
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* Full Card Visual Background Layer */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={thumb(service.image)}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out scale-105 group-hover:scale-100 group-hover:rotate-1"
                  />
                  {/* Luxury editorial duotone color wash overlay */}
                  <div
                    className="absolute inset-0 opacity-85 transition-opacity duration-500 group-hover:opacity-95"
                    style={{
                      background: `linear-gradient(to top, ${PURPLE}ee 15%, ${PURPLE}aa 50%, transparent 100%)`,
                    }}
                  />
                </div>

                {/* Framing Architecture Border Reveal Element */}
                <div 
                  className="absolute inset-4 z-10 pointer-events-none opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                  style={{ border: `1px solid ${GOLD}` }}
                />

                {/* Text Content Block Container */}
                <div className="relative z-20 translate-y-6 transition-transform duration-500 ease-out group-hover:translate-y-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs tracking-widest font-light" style={{ color: GOLD }}>
                      0{i + 1} //
                    </span>
                    <h3
                      style={{ fontFamily: "'Unbounded', sans-serif" }}
                      className="text-base text-white tracking-wide"
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Expanding Divider Line Accent */}
                  <div 
                    className="h-px w-0 bg-gradient-to-r from-amber-200/50 to-transparent transition-all duration-500 group-hover:w-20 my-3"
                  />

                  {/* Fading Description copy block */}
                  <p
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    className="text-xs text-stone-300 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 leading-relaxed max-w-sm"
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services CTA */}
        <div ref={ctaRef} className="mt-16 flex justify-center">
          <Link
            to="/services"
            className="group relative inline-flex items-center gap-3 overflow-hidden border px-8 py-3.5 text-sm tracking-wide transition-colors duration-500"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              borderColor: GOLD,
              color: PURPLE,
            }}
          >
            <span
              className="absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              style={{ backgroundColor: PURPLE }}
            />
            <span className="transition-colors duration-500 group-hover:text-white">
              View All Services
            </span>
            <span
              className="transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white"
              style={{ color: GOLD }}
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Service