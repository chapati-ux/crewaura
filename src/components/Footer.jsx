import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PURPLE_SOLID = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(251,247,239,0.14)'

const socials = [
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'Pinterest', href: 'https://pinterest.com' },
  { name: 'Facebook', href: 'https://facebook.com' },
]

const quickLinks = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { label: 'Full Wedding Planning', href: '/services#wedding-planning' },
  { label: 'Decor & Styling', href: '/services#decor-styling' },
  { label: 'Destination Weddings', href: '/services#destination-weddings' },
  { label: 'Guest Experience', href: '/services#guest-experience' },
]

const Footer = () => {
  const footerRef = useRef(null)
  const colRefs = useRef([])
  const ruleRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        colRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
        }
      )

      gsap.from(ruleRef.current, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 80%' },
      })

      gsap.from(bottomRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: bottomRef.current, start: 'top 95%' },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} style={{ backgroundColor: PURPLE_SOLID }} className="relative pt-20 pb-8 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ============ Main grid ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-14">
          {/* Brand column */}
          <div ref={(el) => (colRefs.current[0] = el)} className="lg:col-span-1">
            <h3
              style={{ fontFamily: "'Cinzel Decorative', sans-serif", color: IVORY }}
              className="text-2xl font-light tracking-tight"
            >
              CrewAura<span style={{ color: GOLD }}>.</span>
            </h3>
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
              className="text-sm opacity-60 leading-relaxed mt-4 max-w-xs"
            >
              Thoughtful wedding planning for couples who want their day to feel entirely their own.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors duration-300"
                  style={{ borderColor: LINE, color: IVORY }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = GOLD
                    e.currentTarget.style.color = GOLD
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = LINE
                    e.currentTarget.style.color = IVORY
                  }}
                >
                  <span className="text-[10px] tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {s.name.slice(0, 2).toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div ref={(el) => (colRefs.current[1] = el)}>
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
              className="text-xs tracking-[0.25em] uppercase block mb-5"
            >
              Explore
            </span>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div ref={(el) => (colRefs.current[2] = el)}>
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
              className="text-xs tracking-[0.25em] uppercase block mb-5"
            >
              Services
            </span>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div ref={(el) => (colRefs.current[3] = el)}>
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
              className="text-xs tracking-[0.25em] uppercase block mb-5"
            >
              Get in Touch
            </span>
            <ul className="space-y-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <li>
                <a
                  href="mailto:hello@weddedstudio.com"
                  style={{ color: IVORY }}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  hello@weddedstudio.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  style={{ color: IVORY }}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  +91 12345 67890
                </a>
              </li>
              <li style={{ color: IVORY }} className="text-sm opacity-70 leading-relaxed">
                Mumbai, Maharashtra
                <br />
                India
              </li>
            </ul>
          </div>
        </div>

        {/* ============ Divider ============ */}
        <div ref={ruleRef} className="h-px w-full" style={{ backgroundColor: LINE }} />

        {/* ============ Bottom bar ============ */}
        <div
          ref={bottomRef}
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
            className="text-xs opacity-50 tracking-wide text-center sm:text-left"
          >
            &copy; {new Date().getFullYear()} Wedded Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
              className="text-xs opacity-50 hover:opacity-90 transition-opacity duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
              className="text-xs opacity-50 hover:opacity-90 transition-opacity duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer