import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import services from '../data/services'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.15)'

const Services = () => {
  const pageRef = useRef(null)
  const heroLabelRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroRuleRef = useRef(null)
  const heroTextRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- Hero entrance ----
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from(heroLabelRef.current, { y: 16, opacity: 0, duration: 0.5 })
        .from(heroTitleRef.current, { y: 28, opacity: 0, duration: 0.8 }, '-=0.3')
        .from(heroRuleRef.current, { scaleX: 0, transformOrigin: 'left', duration: 0.7 }, '-=0.4')
        .from(heroTextRef.current, { y: 16, opacity: 0, duration: 0.6 }, '-=0.4')

      // ---- Section header reveal ----
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
      })

      // ---- Staggered card reveal, in rows ----
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: {
            each: 0.12,
            grid: 'auto',
            from: 'start',
          },
          scrollTrigger: {
            trigger: cardRefs.current[0],
            start: 'top 88%',
          },
        }
      )

      // ---- Subtle image parallax inside each card ----
      cardRefs.current.forEach((el) => {
        if (!el) return
        const img = el.querySelector('img')
        if (!img) return
        gsap.to(img, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} style={{ backgroundColor: IVORY }}>
      {/* ============ Hero ============ */}
      <section className="relative px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <span
            ref={heroLabelRef}
            style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
            className="text-xl italic tracking-wide block"
          >
            What We Offer
          </span>
          <h1
            ref={heroTitleRef}
            style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
            className="text-4xl md:text-6xl font-light tracking-tight mt-3"
          >
            Services, Crafted for Every Detail
          </h1>
          <div ref={heroRuleRef} className="h-px w-24 mt-8" style={{ backgroundColor: GOLD }} />
          <p
            ref={heroTextRef}
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
            className="max-w-lg text-sm opacity-70 leading-relaxed mt-6"
          >
            Whether it's a single ceremony or a week of celebrations, each service is built around
            one goal — you, fully present in your own wedding.
          </p>
        </div>
      </section>

      {/* ============ Services grid ============ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute top-0 left-12 right-12 h-px" style={{ backgroundColor: LINE }} />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={headerRef}
            className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                className="text-xl italic tracking-wide"
              >
                Our Offerings
              </span>
              <h2
                style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                className="text-3xl md:text-5xl font-light tracking-tight mt-2"
              >
                Every Ceremony, Considered
              </h2>
            </div>
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
              className="max-w-xs text-xs opacity-70 leading-relaxed md:text-right"
            >
              From the first sketch of an idea to the final guest goodbye — pick a single service
              or the full journey.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={service.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="group relative flex flex-col overflow-hidden"
                style={{ backgroundColor: '#fff' }}
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[115%] object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500 opacity-30 group-hover:opacity-55"
                    style={{ background: `linear-gradient(to top, ${PURPLE} 10%, transparent 65%)` }}
                  />
                  {/* Index marker */}
                  <span
                    className="absolute top-4 left-4 text-xs tracking-widest"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Text */}
                <div
                  className="flex-1 flex flex-col p-7 border border-t-0"
                  style={{ borderColor: LINE }}
                >
                  <h3
                    style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                    className="text-lg font-light leading-snug mb-3"
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
                    className="text-sm opacity-70 leading-relaxed mb-6"
                  >
                    {service.description}
                  </p>

                  <Link
                  to={'/contact'}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
                    className="mt-auto inline-flex items-center gap-2 text-xs tracking-widest uppercase group/btn self-start"
                  >
                    Enquire
                    <svg
                      className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>

                {/* Gold corner accent on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services