import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaInstagram, FaPinterestP, FaFacebookF } from "react-icons/fa";
gsap.registerPlugin(ScrollTrigger)

const PURPLE_SOLID = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(251,247,239,0.14)'

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/crewaura.events/?hl=en",
    icon: FaInstagram,
  },
  // {
  //   name: "Pinterest",
  //   href: "https://pinterest.com",
  //   icon: FaPinterestP,
  // },
  // {
  //   name: "Facebook",
  //   href: "https://facebook.com",
  //   icon: FaFacebookF,
  // },
];

const quickLinks = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { label: 'Destination Wedding', href: '/services#destination-wedding' },
  { label: 'Venue Selection', href: '/services#venue-selection' },
  { label: 'Creative Designs', href: '/services#creative-designs' },
  { label: 'Decor', href: '/services#decor' },
  { label: 'Vendor Management', href: '/services#vendor-management' },
  { label: 'Flight & Train Ticket Booking', href: '/services#flight-train-ticket-booking' },
  { label: 'Logistics', href: '/services#logistics' },
  { label: 'Hospitality & Guest Management', href: '/services#hospitality-guest-management' },
  { label: 'Hamper & Gifting', href: '/services#hamper-gifting' },
  { label: 'Food & Beverages', href: '/services#food-beverages' },
  { label: 'Personal Manager', href: '/services#personal-manager' },
  { label: 'On-Day Execution', href: '/services#on-day-execution' },
];

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
              Crew <span style={{ color: GOLD }}>Aura</span>
            </h3>
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: IVORY }}
              className="text-sm opacity-60 leading-relaxed mt-4 max-w-xs"
            >
              Thoughtful wedding planning for couples who want their day to feel entirely their own.
            </p>

            {/* Socials */}
          <div className="flex items-center gap-3 mt-6">
  {socials.map((s) => {
    const Icon = s.icon;

    return (
      <a
        key={s.name}
        href={s.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.name}
        className="w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 hover:scale-110"
        style={{ borderColor: LINE, color: IVORY }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = GOLD;
          e.currentTarget.style.color = GOLD;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = LINE;
          e.currentTarget.style.color = IVORY;
        }}
      >
        <Icon size={18} />
      </a>
    );
  })}
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
                  href="mailto:Hello@crewaura.com"
                  style={{ color: IVORY }}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                 Hello@crewaura.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917021565980"
                  style={{ color: IVORY }}
                  className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  +91 7021565980
                </a>
              </li>
              <li style={{ color: IVORY }} className="text-sm opacity-70 leading-relaxed">
               Navi Mumbai, Maharashtra
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
            &copy; {new Date().getFullYear()} Crew Aura. All rights reserved.
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