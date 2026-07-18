import React, { useState, useRef, useEffect } from 'react'
import { FaRing, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.12)'

// SheetDB API endpoint mapping to your spreadsheet instance
const SHEETDB_URL = 'https://sheetdb.io/api/v1/7r9vbywz15xqb'

// Google Maps iframe target embedding link
const MAPS_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.6!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1700000000000'

const Contact = () => {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const formColRef = useRef(null)
  const infoColRef = useRef(null)
  const formRef = useRef(null)
  const buttonRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
      })

      gsap.from(formColRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: formColRef.current, start: 'top 85%' },
      })

      gsap.from(infoColRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: infoColRef.current, start: 'top 85%' },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    // Press-down micro-bounce interaction timeline execution sequence
    gsap.timeline()
      .to(buttonRef.current, { scale: 0.94, duration: 0.12, ease: 'power2.out' })
      .to(buttonRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })

    // Generate current local date and time string
    const currentTimestamp = new Date().toLocaleString()

    try {
      const res = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data: {
            timestamp: currentTimestamp, // Kept in the first place inside the data object
            ...form
          } 
        }),
      })

      if (!res.ok) throw new Error(`SheetDB responded with ${res.status}`)

      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Contact form submission failed:', err)
      setStatus('error')

      // Reject alert shake sequence wrapper container triggers
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        {
          keyframes: { x: [-10, 10, -8, 8, -4, 4, 0] },
          duration: 0.5,
          ease: 'power2.out',
        }
      )
    }
  }

  const inputStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: PURPLE,
    borderColor: LINE,
  }

  return (
    <main ref={pageRef} className="min-h-screen pt-28 pb-24" style={{ backgroundColor: IVORY }}>
      {/* ============ Hero Header Block ============ */}
      <div ref={heroRef} className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <FaRing className="mx-auto mb-6" size={32} style={{ color: GOLD }} />
        <span
          className="text-xs font-medium uppercase tracking-[0.3em]"
          style={{ color: GOLD, fontFamily: "'Poppins', sans-serif" }}
        >
          Let's Plan Together
        </span>
        <h1
          className="mt-4 text-4xl leading-tight sm:text-5xl"
          style={{ color: PURPLE, fontFamily: "'Playfair Display', serif" }}
        >
          Book a Consultation
        </h1>
        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: PURPLE, opacity: 0.7, fontFamily: "'Poppins', sans-serif" }}
        >
          Tell us a little about your big day, and we'll be in touch within 24 hours to schedule
          your complimentary consultation.
        </p>
      </div>

      {/*============ Form + Info Two Column Section Grid ============ */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* ---- Left Grid Column: Form Intake Module ---- */}
        <div
          ref={formColRef}
          className="lg:col-span-3 p-8 sm:p-10"
          style={{ backgroundColor: '#fff', border: `1px solid ${LINE}` }}
        >
          <h2
            className="text-2xl mb-8"
            style={{ color: PURPLE, fontFamily: "'Playfair Display', serif" }}
          >
            Send Us a Message
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className="w-full border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors"
                  style={inputStyle}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phone"
                  className="block text-xs uppercase tracking-widest mb-2"
                  style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 12345 67890"
                  className="w-full border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-widest mb-2"
                style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
              >
                Tell Us About Your Day
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Venue, guest count, vibe you're going for..."
                className="w-full border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 transition-colors"
                style={inputStyle}
              />
            </div>

            <button
              ref={buttonRef}
              type="submit"
              disabled={status === 'sending'}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
              style={{ backgroundColor: GOLD, color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-sm mt-4 flex items-center gap-2" style={{ color: '#3f7d4f', fontFamily: "'Poppins', sans-serif" }}>
                <FaCheckCircle /> Thank you — your message is on its way. We'll be in touch within 24 hours.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm mt-4 flex items-center gap-2" style={{ color: '#a3403f', fontFamily: "'Poppins', sans-serif" }}>
                <FaExclamationCircle /> Something went wrong sending your message. Please try again, or email us directly.
              </p>
            )}
          </form>
        </div>

        {/* ---- Right Grid Column: Contact Information Cards & Map Block ---- */}
        <div ref={infoColRef} className="lg:col-span-2 flex flex-col gap-8">
          <div
            className="p-8 sm:p-10 flex flex-col gap-6"
            style={{ backgroundColor: PURPLE }}
          >
            <a
              href="tel:+917021565980"
              className="flex items-center gap-4 group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-300 group-hover:bg-opacity-20"
                style={{ border: `1px solid ${GOLD}66`, color: GOLD }}
              >
                <FaPhone size={14} />
              </span>
              <span style={{ color: IVORY }} className="text-sm opacity-90 group-hover:opacity-100">
                +91 7021565980
              </span>
            </a>

            <a
              href="mailto:hello@everafterevents.com"
              className="flex items-center gap-4 group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ border: `1px solid ${GOLD}66`, color: GOLD }}
              >
                <FaEnvelope size={14} />
              </span>
              <span style={{ color: IVORY }} className="text-sm opacity-90 group-hover:opacity-100">
                hello@everafterevents.com
              </span>
            </a>

            <a
              href="https://maps.google.com/?q=Mumbai,Maharashtra,India"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ border: `1px solid ${GOLD}66`, color: GOLD }}
              >
                <FaMapMarkerAlt size={14} />
              </span>
              <span style={{ color: IVORY }} className="text-sm opacity-90 group-hover:opacity-100">
                Mumbai, Maharashtra, India
              </span>
            </a>
          </div>

          {/* Core Interactive Maps Embed Window */}
          <div
            className="flex-1 min-h-[280px] overflow-hidden"
            style={{ border: `1px solid ${LINE}` }}
          >
            <iframe
              title="Studio location map"
              src={MAPS_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 280, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Contact