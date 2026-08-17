import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import services from '../data/services'
import { Link } from 'react-router-dom'
import {
  GiRose,
  GiDiamondRing,
  GiFlowerPot,
  GiPartyPopper,
  GiCandleLight,
  GiScrollUnfurled,
  GiMusicalNotes,
  GiCakeSlice,
  GiHeartWings,
} from 'react-icons/gi'
import { FaCamera, FaUtensils, FaMapMarkerAlt, FaGem } from 'react-icons/fa'
import { HiOutlineArrowRight } from 'react-icons/hi'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.15)'

const PETAL_COUNT = 8

// Keyword → icon mapping so every service gets a fitting mark without needing
// image assets. Falls back to a heart-wings glyph if nothing matches.
const ICON_RULES = [
  { keywords: ['photo', 'video', 'film'], Icon: FaCamera },
  { keywords: ['ring', 'jewel'], Icon: GiDiamondRing },
  { keywords: ['flower', 'floral', 'bouquet'], Icon: GiFlowerPot },
  { keywords: ['decor', 'design', 'style'], Icon: GiRose },
  { keywords: ['cater', 'food', 'menu', 'dining'], Icon: FaUtensils },
  { keywords: ['cake', 'dessert'], Icon: GiCakeSlice },
  { keywords: ['music', 'dj', 'band', 'sound'], Icon: GiMusicalNotes },
  { keywords: ['invite', 'invitation', 'stationery', 'card'], Icon: GiScrollUnfurled },
  { keywords: ['venue', 'location', 'site'], Icon: FaMapMarkerAlt },
  { keywords: ['plan', 'coordinat', 'manage'], Icon: GiPartyPopper },
  { keywords: ['light', 'candle', 'ambiance'], Icon: GiCandleLight },
  { keywords: ['jewel', 'gem', 'accessor'], Icon: FaGem },
]

const getServiceIcon = (service) => {
  const haystack = `${service.title} ${service.description}`.toLowerCase()
  const match = ICON_RULES.find((rule) => rule.keywords.some((k) => haystack.includes(k)))
  return match ? match.Icon : GiHeartWings
}

const Services = () => {
  const pageRef = useRef(null)
  const heroLabelRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroRuleRef = useRef(null)
  const heroTextRef = useRef(null)
  const headerRef = useRef(null)
  const rowRefs = useRef([])
  const iconWrapRefs = useRef([])

  // Couple illustration refs
  const coupleVisualRef = useRef(null)
  const groomHeadRef = useRef(null)
  const groomBodyRef = useRef(null)
  const brideHeadRef = useRef(null)
  const brideBodyRef = useRef(null)
  const brideVeilRef = useRef(null)
  const groomFillRef = useRef(null)
  const brideFillRef = useRef(null)
  const handHoldLineRef = useRef(null)
  const heartRef = useRef(null)
  const petalRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- Hero entrance ----
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from(heroLabelRef.current, { y: 16, opacity: 0, duration: 0.5 })
        .from(heroTitleRef.current, { y: 28, opacity: 0, duration: 0.8 }, '-=0.3')
        .from(heroRuleRef.current, { scaleX: 0, transformOrigin: 'left', duration: 0.7 }, '-=0.4')
        .from(heroTextRef.current, { y: 16, opacity: 0, duration: 0.6 }, '-=0.4')

      // ---- Couple illustration ----
      const drawableShapes = [
        groomHeadRef.current,
        groomBodyRef.current,
        brideHeadRef.current,
        brideBodyRef.current,
        brideVeilRef.current,
        handHoldLineRef.current,
      ].filter(Boolean)

      if (drawableShapes.length && coupleVisualRef.current) {
        drawableShapes.forEach((el) => {
          const len = el.getTotalLength()
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        })

        gsap.set([groomFillRef.current, brideFillRef.current], { opacity: 0 })
        gsap.set(heartRef.current, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
        gsap.set(coupleVisualRef.current, { opacity: 0, y: 20 })
        gsap.set(handHoldLineRef.current, { strokeDashoffset: handHoldLineRef.current.getTotalLength() })

        const coupleTl = gsap.timeline({ delay: 0.3 })
        coupleTl
          .to(coupleVisualRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
          .to(
            [groomHeadRef.current, groomBodyRef.current],
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            '-=0.2'
          )
          .to(
            [brideHeadRef.current, brideBodyRef.current, brideVeilRef.current],
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            '-=1.0'
          )
          .to([groomFillRef.current, brideFillRef.current], { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
          .to(handHoldLineRef.current, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.2')
          .to(heartRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, '-=0.2')
          .call(() => {
            gsap.to(heartRef.current, {
              scale: 1.18,
              duration: 0.55,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            })
            gsap.to(coupleVisualRef.current, {
              y: -5,
              duration: 2.8,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            })
          })
      }

      // ---- Floating petals ----
      petalRefs.current.forEach((petal) => {
        if (!petal) return
        const startX = gsap.utils.random(-20, 20)
        const drift = gsap.utils.random(-40, 40)
        const duration = gsap.utils.random(7, 12)
        const delay = gsap.utils.random(1, 6)

        gsap.set(petal, { x: startX, y: 30, opacity: 0, rotate: gsap.utils.random(-30, 30) })

        gsap.to(petal, {
          y: -340,
          x: startX + drift,
          rotate: '+=180',
          opacity: 0.5,
          duration,
          delay,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })

      // ---- Section header reveal ----
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
      })

      // ---- Staggered list-row reveal: each row slides in from alternating sides ----
      rowRefs.current.forEach((el, i) => {
        if (!el) return
        const fromSide = i % 2 === 0 ? -40 : 40
        gsap.fromTo(
          el,
          { opacity: 0, x: fromSide },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
            },
          }
        )
      })

      // ---- Icon medallions: gentle pop-in + continuous idle float ----
      iconWrapRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(
          el,
          { scale: 0, rotate: -25 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: 'back.out(2.4)',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
            },
            delay: 0.15,
          }
        )
        gsap.to(el, {
          y: -4,
          duration: 2.2 + (i % 3) * 0.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1 + i * 0.1,
        })
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // Hover micro-interaction: icon spins + row line sweeps in
  const handleEnter = (i) => {
    const iconEl = iconWrapRefs.current[i]
    if (iconEl) {
      gsap.to(iconEl, { rotate: 12, scale: 1.12, duration: 0.4, ease: 'back.out(3)' })
    }
  }
  const handleLeave = (i) => {
    const iconEl = iconWrapRefs.current[i]
    if (iconEl) {
      gsap.to(iconEl, { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
    }
  }

  return (
    <div ref={pageRef} style={{ backgroundColor: IVORY }}>
      {/* ============ Hero ============ */}
      <section className="relative px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7">
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

          {/* Couple illustration + petals visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[280px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: PETAL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (petalRefs.current[i] = el)}
                  className="absolute rounded-full"
                  style={{
                    left: `${10 + ((i * 91) % 85)}%`,
                    bottom: '5%',
                    width: i % 3 === 0 ? 9 : 6,
                    height: i % 3 === 0 ? 13 : 8,
                    backgroundColor: i % 2 === 0 ? GOLD : PURPLE,
                    opacity: 0.15,
                    borderRadius: '60% 40% 60% 40%',
                  }}
                />
              ))}
            </div>

            <div ref={coupleVisualRef} className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g ref={groomFillRef}>
                  <circle cx="105" cy="95" r="20" fill={PURPLE} opacity="0.12" />
                  <path
                    d="M75,235 C73,190 78,150 105,140 C132,150 137,190 135,235 Z"
                    fill={PURPLE}
                    opacity="0.12"
                  />
                </g>
                <circle ref={groomHeadRef} cx="105" cy="95" r="20" stroke={PURPLE} strokeWidth="2.5" />
                <path
                  ref={groomBodyRef}
                  d="M75,235 C73,190 78,150 105,140 C132,150 137,190 135,235"
                  stroke={PURPLE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M105,140 L105,235" stroke={PURPLE} strokeWidth="1.5" opacity="0.5" />

                <g ref={brideFillRef}>
                  <circle cx="195" cy="95" r="20" fill={GOLD} opacity="0.15" />
                  <path
                    d="M170,235 C160,190 165,150 195,138 C225,150 230,190 220,235 Z"
                    fill={GOLD}
                    opacity="0.18"
                  />
                </g>
                <circle ref={brideHeadRef} cx="195" cy="95" r="20" stroke={GOLD} strokeWidth="2.5" />
                <path
                  ref={brideBodyRef}
                  d="M170,235 C160,190 165,150 195,138 C225,150 230,190 220,235"
                  stroke={GOLD}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  ref={brideVeilRef}
                  d="M182,80 C178,100 180,118 188,130"
                  stroke={GOLD}
                  strokeWidth="1.5"
                  opacity="0.6"
                />

                <path
                  ref={handHoldLineRef}
                  d="M133,178 C143,185 157,185 167,178"
                  stroke={PURPLE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <path
                  ref={heartRef}
                  d="M150,158 C146,152 137,152 135,160 C133,168 141,174 150,182 C159,174 167,168 165,160 C163,152 154,152 150,158 Z"
                  fill={GOLD}
                />
              </svg>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-center pt-4 w-full">
                <p
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                  className="text-lg italic tracking-wide"
                >
                  Two hearts, one aura
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Services list ============ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute top-0 left-12 right-12 h-px" style={{ backgroundColor: LINE }} />

        <div className="mx-auto max-w-5xl px-6 lg:px-8">
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

          {/* List */}
          <ul className="flex flex-col">
            {services.map((service, i) => {
              const Icon = getServiceIcon(service)
              return (
                <li
                  key={service.id}
                  ref={(el) => (rowRefs.current[i] = el)}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  className="group relative border-t last:border-b"
                  style={{ borderColor: LINE }}
                >
                  {/* Sweep-in accent line on hover */}
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-[3px] scale-y-0 origin-top transition-transform duration-500 ease-out group-hover:scale-y-100"
                    style={{ backgroundColor: GOLD }}
                  />

                  <Link
                    to="/contact"
                    className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 py-7 sm:py-9 pl-6 pr-4 sm:pl-10 sm:pr-6 transition-colors duration-500 group-hover:bg-white"
                  >
                    {/* Index */}
                    <span
                      className="hidden sm:block text-xs tracking-widest w-8 shrink-0"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Icon medallion */}
                    <div
                      ref={(el) => (iconWrapRefs.current[i] = el)}
                      className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 transition-colors duration-500 group-hover:bg-opacity-10"
                      style={{
                        border: `1.5px solid ${GOLD}`,
                        backgroundColor: 'rgba(200,169,106,0.08)',
                      }}
                    >
                      <Icon size={24} color={PURPLE} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3
                        style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                        className="text-lg sm:text-xl font-light leading-snug mb-2 transition-transform duration-500 group-hover:translate-x-1"
                      >
                        {service.title}
                      </h3>
                      <p
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
                        className="text-sm opacity-70 leading-relaxed max-w-2xl"
                      >
                        {service.description}
                      </p>
                    </div>

                    {/* Enquire arrow */}
                    <div
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
                      className="flex items-center gap-2 text-xs tracking-widest uppercase shrink-0 self-start sm:self-center opacity-70 group-hover:opacity-100"
                    >
                      <span className="hidden sm:inline">Enquire</span>
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 group-hover:translate-x-1"
                        style={{ backgroundColor: GOLD }}
                      >
                        <HiOutlineArrowRight size={14} color={IVORY} />
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Services