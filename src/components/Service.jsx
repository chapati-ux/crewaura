import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import services from '../data/services'
import {
  PiFlowerLotusLight,
  PiChampagneLight,
  PiCameraLight,
  PiMusicNotesLight,
  PiSparkleLight,
  PiDiamondLight,
  PiCakeLight,
  PiCalendarHeartLight,
  PiArrowUpRightLight,
} from 'react-icons/pi'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const TEXT = '#4A3F55'
const LINE = 'rgba(45,28,62,0.15)'

// How many services to preview on this section
const PREVIEW_COUNT = 5

// Fallback icon set cycled by index when a service has no explicit `icon` field
const FALLBACK_ICONS = [
  PiFlowerLotusLight,
  PiChampagneLight,
  PiCameraLight,
  PiMusicNotesLight,
  PiSparkleLight,
  PiDiamondLight,
  PiCakeLight,
  PiCalendarHeartLight,
]

const getServiceIcon = (service, i) => service.icon || FALLBACK_ICONS[i % FALLBACK_ICONS.length]

const Service = () => {
  const sectionRef = useRef(null)
  const eyebrowRef = useRef(null)
  const headingLettersRef = useRef([])
  const dividerLineRefs = useRef([])
  const cardRefs = useRef([])
  const blobRefs = useRef([])
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
      gsap.set(cardRefs.current, { y: 40, opacity: 0, scale: 0.92 })
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
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
          '-=0.2'
        )
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

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

        {/* Compact Creative Card Grid */}
    <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
  {visibleServices.map((service, i) => {
    const Icon = getServiceIcon(service, i)
    const isDark = i % 5 === 0

    return (
      <div
        key={service.id}
        ref={(el) => (cardRefs.current[i] = el)}
        className={`
          group relative min-h-[210px] overflow-hidden rounded-[20px] p-4
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-2 hover:scale-[1.02]
          ${isDark ? "bg-[#2D1C3E] text-white" : "bg-[#FBF7EF]"}
        `}
        style={{
          border: `1px solid ${isDark ? "rgba(200,169,106,0.35)" : LINE}`,
          boxShadow: isDark
            ? "0 14px 30px -10px rgba(45,28,62,0.45)"
            : "0 14px 30px -10px rgba(45,28,62,0.08)",
        }}
      >
        {/* Animated mesh / aurora background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: isDark
              ? `
                radial-gradient(circle at 20% 20%, rgba(200,169,106,0.18) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(168,85,247,0.12) 0%, transparent 45%)
              `
              : `
                radial-gradient(circle at 15% 25%, rgba(200,169,106,0.14) 0%, transparent 45%),
                radial-gradient(circle at 85% 75%, rgba(45,28,62,0.06) 0%, transparent 50%)
              `,
          }}
        />

        {/* Floating geometric accents */}
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[rgba(200,169,106,0.25)] opacity-40 transition-all duration-1000 group-hover:scale-125 group-hover:opacity-70 group-hover:rotate-12"
        />
        <div
          className="pointer-events-none absolute -bottom-5 -left-5 h-14 w-14 rounded-full border border-[rgba(200,169,106,0.2)] opacity-30 transition-all duration-1000 delay-100 group-hover:scale-110 group-hover:opacity-60"
        />

        {/* Top row */}
        <div className="relative flex items-center justify-between">
          <div
            className="
              relative flex h-10 w-10 items-center justify-center rounded-xl
              transition-all duration-600 group-hover:rotate-[-8deg] group-hover:scale-110
            "
            style={{
              background: isDark
                ? "linear-gradient(145deg, rgba(200,169,106,0.18), rgba(200,169,106,0.05))"
                : "linear-gradient(145deg, rgba(200,169,106,0.18), rgba(200,169,106,0.04))",
              border: "1px solid rgba(200,169,106,0.5)",
              boxShadow: "0 6px 16px -4px rgba(200,169,106,0.25)",
            }}
          >
            {/* Soft pulse ring on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:animate-ping group-hover:opacity-20"
                 style={{ backgroundColor: GOLD }} />
            <Icon size={17} style={{ color: GOLD }} className="relative z-10" />
          </div>

          {/* Service number */}
          <span
            className="text-lg font-medium tracking-tight opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Content */}
        <div className="relative mt-5">
          <h3
            className="text-[0.85rem] leading-snug tracking-tight"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              color: isDark ? IVORY : PURPLE,
            }}
          >
            {service.title}
          </h3>

          {/* Animated gold underline */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <div
              className="h-[2px] w-5 rounded-full transition-all duration-700 group-hover:w-9"
              style={{ backgroundColor: GOLD }}
            />
            <div
              className="h-[2px] w-2 rounded-full opacity-40 transition-all duration-700 delay-75 group-hover:w-4 group-hover:opacity-80"
              style={{ backgroundColor: GOLD }}
            />
          </div>

          <p
            className="mt-3 line-clamp-3 text-[0.72rem] leading-5 opacity-65 transition-opacity duration-500 group-hover:opacity-90"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: isDark ? IVORY : TEXT,
            }}
          >
            {service.description}
          </p>
        </div>

        {/* Bottom action area */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span
            className="text-[9px] tracking-[0.16em] uppercase opacity-40 transition-opacity duration-500 group-hover:opacity-70"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Explore
          </span>

          {/* Arrow button */}
          <div
            className="
              flex h-7 w-7 items-center justify-center rounded-full
              border transition-all duration-600
              group-hover:translate-x-1 group-hover:scale-110
            "
            style={{
              borderColor: "rgba(200,169,106,0.5)",
              backgroundColor: "rgba(200,169,106,0.08)",
              color: GOLD,
            }}
          >
            <span className="text-xs transition-transform duration-500 group-hover:rotate-45">
              ↗
            </span>
          </div>
        </div>

        {/* Bottom sweeping gold line */}
        <span
          className="absolute bottom-0 left-0 h-[2px] w-0 rounded-r-full transition-all duration-800 ease-out group-hover:w-full"
          style={{
            background: `linear-gradient(90deg, ${GOLD}, rgba(200,169,106,0.3))`,
          }}
        />

        {/* Corner accent spark */}
        <div
          className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150"
          style={{ backgroundColor: GOLD, boxShadow: `0 0 10px ${GOLD}` }}
        />
      </div>
    )
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