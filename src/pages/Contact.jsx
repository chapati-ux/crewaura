import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaRing, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.12)'

// SheetDB API endpoint mapping to your spreadsheet instance
const SHEETDB_URL = 'https://sheetdb.io/api/v1/ojuaqpmrsdyaq'

// Google Maps iframe target embedding link
const MAPS_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.6!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1700000000000'

const OTHER_VALUE = 'Other'

const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Sangeet / Mehendi',
  'Reception',
  'Corporate Events',
  'Other Events',
  OTHER_VALUE,
]

const BUDGET_RANGES = [
  'Under ₹5 Lakh',
  '₹5 – 10 Lakh',
  '₹10 – 20 Lakh',
  '₹20 – 40 Lakh',
  '₹40 Lakh+',
  'Not sure yet',
  OTHER_VALUE,
]

const GUEST_COUNTS = [
  'Under 50',
  '50 – 100',
  '100 – 250',
  '250 – 500',
  '500+',
  OTHER_VALUE,
]

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
    eventType: '',
    eventTypeOther: '',
    preferredDate: '',
    guestCount: '',
    guestCountOther: '',
    budgetRange: '',
    budgetRangeOther: '',
    venuePreference: '',
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

  const otherFieldRef = (el) => {
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -8, height: 0 },
        { opacity: 1, y: 0, height: 'auto', duration: 0.35, ease: 'power2.out' }
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    gsap.timeline()
      .to(buttonRef.current, { scale: 0.94, duration: 0.12, ease: 'power2.out' })
      .to(buttonRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })

    const currentTimestamp = new Date().toLocaleString()

    const payload = {
      ...form,
      eventType: form.eventType === OTHER_VALUE ? form.eventTypeOther : form.eventType,
      guestCount: form.guestCount === OTHER_VALUE ? form.guestCountOther : form.guestCount,
      budgetRange: form.budgetRange === OTHER_VALUE ? form.budgetRangeOther : form.budgetRange,
    }
    delete payload.eventTypeOther
    delete payload.guestCountOther
    delete payload.budgetRangeOther

    try {
      await axios.post(SHEETDB_URL, {
        data: [
          {
            timestamp: currentTimestamp,
            ...payload,
          },
        ],
      })

      setStatus('success')
      setForm({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventTypeOther: '',
        preferredDate: '',
        guestCount: '',
        guestCountOther: '',
        budgetRange: '',
        budgetRangeOther: '',
        venuePreference: '',
        message: '',
      })
    } catch (err) {
      console.error('Contact form submission failed:', err)
      setStatus('error')

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

  const labelClass = 'block text-xs uppercase tracking-widest mb-2'
  const labelStyle = { color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }
  const fieldClass =
    'w-full border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors bg-white'

  return (
    <main ref={pageRef} className="min-h-screen pt-28 pb-24" style={{ backgroundColor: IVORY }}>
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

      <div className="mx-auto max-w-6xl px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
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
                <label htmlFor="name" className={labelClass} style={labelStyle}>
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
                  className={fieldClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass} style={labelStyle}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com (Optional)"
                  className={fieldClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass} style={labelStyle}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 12345 67890"
                  className={fieldClass}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label htmlFor="eventType" className={labelClass} style={labelStyle}>
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  required
                  value={form.eventType}
                  onChange={handleChange}
                  className={fieldClass}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    Select an event
                  </option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type === OTHER_VALUE ? 'Other (please specify)' : type}
                    </option>
                  ))}
                </select>
                {form.eventType === OTHER_VALUE && (
                  <input
                    ref={otherFieldRef}
                    key="eventTypeOther"
                    id="eventTypeOther"
                    name="eventTypeOther"
                    type="text"
                    value={form.eventTypeOther}
                    onChange={handleChange}
                    placeholder="Tell us what kind of event"
                    className={`${fieldClass} mt-3`}
                    style={inputStyle}
                    required
                  />
                )}
              </div>

              <div>
                <label htmlFor="preferredDate" className={labelClass} style={labelStyle}>
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  className={fieldClass}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="guestCount" className={labelClass} style={labelStyle}>
                  Expected Guests
                </label>
                <select
                  id="guestCount"
                  name="guestCount"
                  value={form.guestCount}
                  onChange={handleChange}
                  className={fieldClass}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    Select guest count
                  </option>
                  {GUEST_COUNTS.map((count) => (
                    <option key={count} value={count}>
                      {count === OTHER_VALUE ? 'Other (please specify)' : count}
                    </option>
                  ))}
                </select>
                {form.guestCount === OTHER_VALUE && (
                  <input
                    ref={otherFieldRef}
                    key="guestCountOther"
                    id="guestCountOther"
                    name="guestCountOther"
                    type="text"
                    value={form.guestCountOther}
                    onChange={handleChange}
                    placeholder="Roughly how many guests"
                    className={`${fieldClass} mt-3`}
                    style={inputStyle}
                  />
                )}
              </div>

              <div>
                <label htmlFor="budgetRange" className={labelClass} style={labelStyle}>
                  Budget Range
                </label>
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={form.budgetRange}
                  onChange={handleChange}
                  className={fieldClass}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    Select a budget range
                  </option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range === OTHER_VALUE ? 'Other (please specify)' : range}
                    </option>
                  ))}
                </select>
                {form.budgetRange === OTHER_VALUE && (
                  <input
                    ref={otherFieldRef}
                    key="budgetRangeOther"
                    id="budgetRangeOther"
                    name="budgetRangeOther"
                    type="text"
                    value={form.budgetRangeOther}
                    onChange={handleChange}
                    placeholder="Your approximate budget"
                    className={`${fieldClass} mt-3`}
                    style={inputStyle}
                  />
                )}
              </div>

              <div>
                <label htmlFor="venuePreference" className={labelClass} style={labelStyle}>
                  Venue Preference
                </label>
                <input
                  id="venuePreference"
                  name="venuePreference"
                  type="text"
                  value={form.venuePreference}
                  onChange={handleChange}
                  placeholder="Banquet hall, resort, outdoor..."
                  className={fieldClass}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass} style={labelStyle}>
                Additional Details
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Venue, guest count, vibe you're going for..."
                className="w-full border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 transition-colors bg-white"
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
              href="mailto:Hello@crewaura.com"
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
                Hello@crewaura.com
              </span>
            </a>

            <div className="flex items-center gap-4">
              <span
                className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ border: `1px solid ${GOLD}66`, color: GOLD }}
              >
                <FaMapMarkerAlt size={14} />
              </span>
              <span
                style={{ color: IVORY, fontFamily: "'Poppins', sans-serif" }}
                className="text-sm opacity-90"
              >
                Navi Mumbai, Maharashtra, India
              </span>
            </div>
          </div>

          {/*
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
          */}
        </div>
      </div>
    </main>
  )
}

export default Contact