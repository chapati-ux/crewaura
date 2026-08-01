import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaRing } from 'react-icons/fa'
import { HiOutlineXMark } from 'react-icons/hi2'
import gsap from 'gsap'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path:'/services' },
  { label: 'Gallery', path: '/gallery' },
  // { label: 'Packages', sectionId: 'packages' },
  // { label: 'Testimonials', sectionId: 'testimonials' },
  { label: 'Contact', path: '/contact' },
]

const PURPLE_SOLID = '#2D1C3E'
const GOLD = '#C8A96A'
const CREAM = '#F5EFE6'
const BRAND = 'CrewAura'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('/')

  const navigate = useNavigate()
  const location = useLocation()

  const navRef = useRef(null)
  const logoLettersRef = useRef([])
  const linksWrapRef = useRef(null)
  const linksRef = useRef([])
  const indicatorRef = useRef(null)
  const ctaRef = useRef(null)
  const ctaTextRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileLinksRef = useRef([])

  // --- Scroll shadow + scrollspy ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12)
      if (location.pathname !== '/') return
      const scrollPosition = window.scrollY + 120
      let current = '/'
      NAV_LINKS.forEach((link) => {
        if (!link.sectionId) return
        const el = document.getElementById(link.sectionId)
        if (el && el.offsetTop <= scrollPosition) current = link.sectionId
      })
      setActiveLink(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/') setActiveLink(location.pathname)
  }, [location.pathname])

  // --- Creative entrance: logo letters tumble in, links rise with rotation ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(logoLettersRef.current, { y: -40, opacity: 0, rotate: () => gsap.utils.random(-25, 25) })
      gsap.set(linksRef.current, { y: -14, opacity: 0 })
      gsap.set(ctaRef.current, { scale: 0.7, opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } })
      tl.to(logoLettersRef.current, { y: 0, opacity: 1, rotate: 0, duration: 0.7, stagger: 0.045 })
        .to(linksRef.current, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, '-=0.35')
        .to(ctaRef.current, { scale: 1, opacity: 1, duration: 0.5 }, '-=0.3')
    }, navRef)
    return () => ctx.revert()
  }, [])

  // --- Sliding "pill" indicator that follows whichever link is hovered ---
  const moveIndicatorTo = (el) => {
    if (!el || !indicatorRef.current || !linksWrapRef.current) return
    const wrapRect = linksWrapRef.current.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    gsap.to(indicatorRef.current, {
      x: rect.left - wrapRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.45,
      ease: 'power3.out',
    })
  }
  const hideIndicator = () => {
    gsap.to(indicatorRef.current, { opacity: 0, duration: 0.3 })
  }

  // --- Mobile menu: full-screen clip-path reveal instead of a simple accordion ---
  useEffect(() => {
    if (!mobileMenuRef.current) return
    if (isOpen) {
      gsap.set(mobileMenuRef.current, { display: 'flex' })
      gsap.fromTo(
        mobileMenuRef.current,
        { clipPath: 'circle(0% at 92% 6%)' },
        { clipPath: 'circle(150% at 92% 6%)', duration: 0.7, ease: 'power4.inOut' }
      )
      gsap.set(mobileLinksRef.current, { y: 24, opacity: 0 })
      gsap.to(mobileLinksRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.07,
        delay: 0.25,
        ease: 'power3.out',
      })
    } else {
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(0% at 92% 6%)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(mobileMenuRef.current, { display: 'none' }),
      })
    }
  }, [isOpen])

  const scrollToSection = useCallback(
    (sectionId) => {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setActiveLink(sectionId)
      setIsOpen(false)
    },
    [location.pathname, navigate]
  )

  // --- Magnetic CTA button: nudges toward the cursor, text does a vertical roll ---
  const handleCtaMove = (e) => {
    const rect = ctaRef.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    gsap.to(ctaRef.current, { x: relX * 0.3, y: relY * 0.4, duration: 0.4, ease: 'power2.out' })
  }
  const handleCtaLeave = () => {
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }

  const isActive = (link) => {
    if (link.path) return location.pathname === link.path
    return location.pathname === '/' && activeLink === link.sectionId
  }

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-20 transition-shadow duration-300"
      style={{
        backgroundColor: PURPLE_SOLID,
        boxShadow: scrolled ? '0 8px 24px rgba(45,28,62,0.35)' : 'none',
      }}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Brand — letters animate in individually */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          aria-label={`${BRAND} home`}
          className="flex items-center gap-2"
        >
          {/* <FaRing size={20} style={{ color: GOLD }} /> */}
          <span
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
            className="flex text-xl tracking-tight sm:text-2xl"
          >
             {BRAND.split('').map((letter, i) => (
              <span
                key={i}
                ref={(el) => (logoLettersRef.current[i] = el)}
                style={{ color: i < 4 ? CREAM : GOLD, display: 'inline-block' }}
              >
                {letter}
              </span>
            ))}
          </span>
        </Link>

        {/* Desktop Links with a sliding hover-pill indicator */}
        <ul
          ref={linksWrapRef}
          onMouseLeave={hideIndicator}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="relative hidden items-center gap-1 lg:flex"
        >
          {/* sliding pill */}
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full opacity-0"
            style={{ backgroundColor: 'rgba(200,169,106,0.15)' }}
          />
          {NAV_LINKS.map((link, i) => {
            const commonProps = {
              ref: (el) => (linksRef.current[i] = el),
              onMouseEnter: (e) => moveIndicatorTo(e.currentTarget),
              className:
                'relative z-10 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300',
              style: { color: isActive(link) ? GOLD : CREAM },
            }
            return (
              <li key={link.label}>
                {link.path ? (
                  <Link to={link.path} {...commonProps}>
                    {link.label}
                  </Link>
                ) : (
                  <button type="button" onClick={() => scrollToSection(link.sectionId)} {...commonProps}>
                    {link.label}
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA — magnetic pull toward the cursor */}
        <Link
          to="/contact"
          ref={ctaRef}
          onMouseMove={handleCtaMove}
          onMouseLeave={handleCtaLeave}
          style={{ backgroundColor: GOLD, fontFamily: "'Space Grotesk', sans-serif" }}
          className="hidden overflow-hidden rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm lg:inline-flex"
        >
          <span ref={ctaTextRef} style={{ color: PURPLE_SOLID }}>
            Book Consultation
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          className="relative z-[60] inline-flex items-center justify-center rounded-full p-2 lg:hidden"
          style={{ color: isOpen ? GOLD : CREAM }}
        >
          {isOpen ? (
            <HiOutlineXMark size={28} />
          ) : (
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-6 rounded-full" style={{ backgroundColor: CREAM }} />
              <span className="block h-0.5 w-4 rounded-full" style={{ backgroundColor: GOLD }} />
              <span className="block h-0.5 w-6 rounded-full" style={{ backgroundColor: CREAM }} />
            </span>
          )}
        </button>
      </nav>

      {/* Mobile Menu — full-screen clip-path reveal */}
      <div
        ref={mobileMenuRef}
        style={{ display: 'none', backgroundColor: PURPLE_SOLID }}
        className="fixed inset-0 z-50 flex-col items-center justify-center gap-2 lg:hidden"
      >
        <ul style={{ fontFamily: "'Unbounded', sans-serif" }} className="flex flex-col items-center gap-3">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label} ref={(el) => (mobileLinksRef.current[i] = el)}>
              {link.path ? (
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-medium tracking-tight transition-colors duration-300 sm:text-4xl"
                  style={{ color: isActive(link) ? GOLD : CREAM }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection(link.sectionId)}
                  className="text-3xl font-medium tracking-tight transition-colors duration-300 sm:text-4xl"
                  style={{ color: isActive(link) ? GOLD : CREAM }}
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          style={{ backgroundColor: GOLD, fontFamily: "'Space Grotesk', sans-serif", color: PURPLE_SOLID }}
          className="mt-8 rounded-full px-8 py-3 text-sm font-semibold"
        >
          Book Consultation
        </Link>
      </div>
    </header>
  )
}

export default Nav