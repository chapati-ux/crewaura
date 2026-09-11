import React, { useState, useRef, useEffect } from 'react'
import { FaRing, FaTimes, FaCheckCircle, FaExclamationCircle, FaSpinner, FaChevronDown } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase } from '../utils/supabase'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.14)'

const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Sangeet / Mehendi',
  'Reception',
  'Corporate Events',
  'Other Events',
]

// Sentinel value for the custom "Other" budget option
const OTHER_VALUE = 'Other'

const BUDGET_RANGES = [
  'Under ₹10 Lakh',
  '₹10 – 20 Lakh',
  '₹20 – 30 Lakh',
  '₹30 – 40 Lakh',
  '₹50 Lakh+',
  'Not sure yet',
  OTHER_VALUE,
]

const REASSURANCES = [
  'Free initial consultation',
  'A reply within 24 hours',
  'No spam, ever',
]

/**
 * BookEventSection
 * "Book an Event" section for the home page, laid out like an open
 * invitation card: a fixed left leaf with the pitch, a hairline fold,
 * and the form itself set in underlined fields rather than a boxed card.
 */
const BookEventSection = () => {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const formColRef = useRef(null)
  const formRef = useRef(null)
  const buttonRef = useRef(null)
  const spinnerRef = useRef(null)
  const eventDropdownRef = useRef(null)
  const budgetDropdownRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventTypes: [],
    budget: '',
    budgetOther: '', // free-text value when budget === OTHER_VALUE
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false)
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: leftRef.current, start: 'top 85%' },
      })

      gsap.from(formColRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: formColRef.current, start: 'top 85%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Pulse a soft gold glow around the form and spin the button icon while sending
  useEffect(() => {
    let glowTween
    if (status === 'sending') {
      if (formRef.current) {
        glowTween = gsap.to(formRef.current, {
          opacity: 0.85,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }
      if (spinnerRef.current) {
        gsap.to(spinnerRef.current, {
          rotation: 360,
          duration: 0.7,
          repeat: -1,
          ease: 'none',
        })
      }
    } else {
      if (formRef.current) gsap.set(formRef.current, { opacity: 1 })
      if (spinnerRef.current) gsap.killTweensOf(spinnerRef.current)
    }

    return () => {
      glowTween?.kill()
    }
  }, [status])

  // Close the event-type dropdown when clicking outside of it
  useEffect(() => {
    if (!eventDropdownOpen) return
    const handleClickOutside = (e) => {
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(e.target)) {
        setEventDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [eventDropdownOpen])

  // Close the budget dropdown when clicking outside of it
  useEffect(() => {
    if (!budgetDropdownOpen) return
    const handleClickOutside = (e) => {
      if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(e.target)) {
        setBudgetDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [budgetDropdownOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const toggleEventType = (type) => {
    setForm((prev) => {
      const alreadySelected = prev.eventTypes.includes(type)
      const eventTypes = alreadySelected
        ? prev.eventTypes.filter((t) => t !== type)
        : [...prev.eventTypes, type]
      return { ...prev, eventTypes }
    })
  }

  const selectBudget = (range) => {
    setForm((prev) => ({
      ...prev,
      budget: range,
      // Clear any previously typed custom amount when switching away from "Other"
      budgetOther: range === OTHER_VALUE ? prev.budgetOther : '',
    }))
    setBudgetDropdownOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    gsap.timeline()
      .to(buttonRef.current, { scale: 0.94, duration: 0.12, ease: 'power2.out' })
      .to(buttonRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })

    // Resolve the final budget value: the custom text when "Other" is chosen, otherwise the picked range
    const resolvedBudget = form.budget === OTHER_VALUE ? form.budgetOther : form.budget

    // Maps to the same contact_submissions table used by the main Contact page.
    // This form doesn't collect preferred date, guest count, or venue — leave those null.
    const payload = {
      name: form.name,
      email: form.email || null,
      phone: form.phone,
      event_type: form.eventTypes, // text[] column — array sent directly
      preferred_date: null,
      guest_count: null,
      budget_range: resolvedBudget || null,
      venue_preference: null,
      message: form.message || null,
    }

    try {
      const { error } = await supabase.from('contact_submissions').insert([payload])

      if (error) throw error

      setStatus('success')
      setForm({ name: '', email: '', phone: '', eventTypes: [], budget: '', budgetOther: '', message: '' })
    } catch (err) {
      console.error('Book an Event form submission failed:', err)
      setStatus('error')

      gsap.fromTo(
        formRef.current,
        { x: 0 },
        {
          keyframes: { x: [-8, 8, -6, 6, -3, 3, 0] },
          duration: 0.4,
          ease: 'power2.out',
        }
      )
    }
  }

  const textStyle = { fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }

  // Underlined, boxless field treatment — no background, no border box, just a hairline base
  const fieldClass =
    'w-full bg-transparent border-0 border-b px-0 py-3 text-sm focus:outline-none focus:border-b-[1.5px] transition-colors'
  const fieldStyle = { ...textStyle, borderColor: LINE }
  const fieldFocusStyle = { borderColor: GOLD }

  return (
    <section ref={sectionRef} className="py-24 sm:py-28" style={{ backgroundColor: IVORY }}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-0">
        {/* Left leaf — the pitch */}
        <div ref={leftRef} className="lg:col-span-5 lg:pr-16 flex flex-col justify-center">
          <FaRing size={26} style={{ color: GOLD }} className="mb-6" />

          <p
            className="text-base italic mb-3"
            style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
          >
            Let's plan together
          </p>

          <h2
            className="text-4xl sm:text-5xl leading-[1.1]"
            style={{ color: PURPLE, fontFamily: "'Unbounded', sans-serif" }}
          >
            Book an Event
          </h2>

          <p
            className="mt-6 max-w-sm text-base leading-relaxed"
            style={{ color: PURPLE, opacity: 0.72, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Share a few details about what you're celebrating, and we'll take it from there.
          </p>

          <ul className="mt-10 space-y-3">
            {REASSURANCES.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: GOLD }}
                />
                <span
                  className="text-sm"
                  style={{ color: PURPLE, opacity: 0.75, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fold line, visible on desktop only */}
        <div className="hidden lg:block lg:col-span-1 relative">
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px"
            style={{ backgroundColor: LINE }}
          />
        </div>

        {/* Right leaf — the form */}
        <div ref={formColRef} className="lg:col-span-6 lg:pl-4">
          {status === 'success' ? (
            <div className="flex flex-col items-start py-6">
              <FaCheckCircle size={26} style={{ color: '#3f7d4f' }} className="mb-4" />
              <p className="text-base" style={{ color: PURPLE, fontFamily: "'Space Grotesk', sans-serif" }}>
                Thank you — your message is on its way. We'll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                <div>
                  <label htmlFor="be-name" className="sr-only">Full Name</label>
                  <input
                    id="be-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className={fieldClass}
                    style={fieldStyle}
                    onFocus={(e) => (e.target.style.borderColor = GOLD)}
                    onBlur={(e) => (e.target.style.borderColor = LINE)}
                  />
                </div>

                <div>
                  <label htmlFor="be-phone" className="sr-only">Phone</label>
                  <input
                    id="be-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className={fieldClass}
                    style={fieldStyle}
                    onFocus={(e) => (e.target.style.borderColor = GOLD)}
                    onBlur={(e) => (e.target.style.borderColor = LINE)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="be-email" className="sr-only">Email</label>
                <input
                  id="be-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email (optional)"
                  className={fieldClass}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = GOLD)}
                  onBlur={(e) => (e.target.style.borderColor = LINE)}
                />
              </div>

              {/* Multi-select event type dropdown — click to toggle each option */}
              <div className="relative" ref={eventDropdownRef}>
                <button
                  type="button"
                  onClick={() => setEventDropdownOpen((open) => !open)}
                  className={`${fieldClass} flex items-center justify-between text-left`}
                  style={fieldStyle}
                  aria-haspopup="listbox"
                  aria-expanded={eventDropdownOpen}
                  aria-label="Event type"
                >
                  <span className={form.eventTypes.length === 0 ? 'opacity-50' : ''} style={{ color: PURPLE }}>
                    {form.eventTypes.length === 0 ? 'Event type' : form.eventTypes.join(', ')}
                  </span>
                  <FaChevronDown
                    size={11}
                    style={{
                      color: PURPLE,
                      opacity: 0.5,
                      transform: eventDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  />
                </button>

                {/* Hidden required input so native form validation still enforces a selection */}
                <input
                  tabIndex={-1}
                  aria-hidden="true"
                  required
                  value={form.eventTypes.length > 0 ? 'ok' : ''}
                  onChange={() => {}}
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                />

                {eventDropdownOpen && (
                  <div
                    role="listbox"
                    aria-multiselectable="true"
                    className="absolute z-10 mt-1 w-full bg-white border shadow-lg max-h-56 overflow-y-auto"
                    style={{ borderColor: LINE }}
                  >
                    {EVENT_TYPES.map((type) => {
                      const checked = form.eventTypes.includes(type)
                      return (
                        <label
                          key={type}
                          role="option"
                          aria-selected={checked}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-black/5 transition-colors"
                          style={{ color: PURPLE, fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEventType(type)}
                            className="w-3.5 h-3.5"
                            style={{ accentColor: GOLD }}
                          />
                          {type}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Selected event types shown as removable chips */}
              {form.eventTypes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 -mt-4">
                  {form.eventTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 rounded-full pl-2.5 pr-1.5 py-1 text-[11px]"
                      style={{
                        backgroundColor: 'rgba(200,169,106,0.15)',
                        color: PURPLE,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => toggleEventType(type)}
                        aria-label={`Remove ${type}`}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-black/10"
                      >
                        <FaTimes size={8} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Budget range dropdown — reveals a free-text field when "Other" is chosen */}
              <div className="relative" ref={budgetDropdownRef}>
                <button
                  type="button"
                  onClick={() => setBudgetDropdownOpen((open) => !open)}
                  className={`${fieldClass} flex items-center justify-between text-left`}
                  style={fieldStyle}
                  aria-haspopup="listbox"
                  aria-expanded={budgetDropdownOpen}
                  aria-label="Estimated budget"
                >
                  <span className={form.budget === '' ? 'opacity-50' : ''} style={{ color: PURPLE }}>
                    {form.budget === '' ? 'Estimated budget' : form.budget}
                  </span>
                  <FaChevronDown
                    size={11}
                    style={{
                      color: PURPLE,
                      opacity: 0.5,
                      transform: budgetDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  />
                </button>

                {/* Hidden required input so native form validation still enforces a selection */}
                <input
                  tabIndex={-1}
                  aria-hidden="true"
                  required
                  value={form.budget}
                  onChange={() => {}}
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                />

                {budgetDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute z-10 mt-1 w-full bg-white border shadow-lg max-h-56 overflow-y-auto"
                    style={{ borderColor: LINE }}
                  >
                    {BUDGET_RANGES.map((range) => {
                      const checked = form.budget === range
                      return (
                        <button
                          type="button"
                          key={range}
                          role="option"
                          aria-selected={checked}
                          onClick={() => selectBudget(range)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left cursor-pointer hover:bg-black/5 transition-colors"
                          style={{
                            color: PURPLE,
                            fontFamily: "'Space Grotesk', sans-serif",
                            backgroundColor: checked ? 'rgba(200,169,106,0.12)' : 'transparent',
                          }}
                        >
                          {range}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {form.budget === OTHER_VALUE && (
                <input
                  name="budgetOther"
                  type="text"
                  required
                  value={form.budgetOther}
                  onChange={handleChange}
                  placeholder="Tell us your budget"
                  className={fieldClass}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = GOLD)}
                  onBlur={(e) => (e.target.style.borderColor = LINE)}
                />
              )}

              <div>
                <label htmlFor="be-message" className="sr-only">Message</label>
                <textarea
                  id="be-message"
                  name="message"
                  rows={2}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Anything else we should know? (optional)"
                  className={`${fieldClass} resize-none`}
                  style={fieldStyle}
                  onFocus={(e) => (e.target.style.borderColor = GOLD)}
                  onBlur={(e) => (e.target.style.borderColor = LINE)}
                />
              </div>

              <div className="flex items-center justify-between gap-6 pt-2">
                <p
                  className="text-[11px]"
                  style={{ color: PURPLE, opacity: 0.45, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  No spam. Just wedding magic. ✉
                </p>

                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex-shrink-0"
                  style={{ backgroundColor: GOLD, color: PURPLE, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {status === 'sending' ? (
                    <span className="inline-flex items-center gap-2">
                      <FaSpinner ref={spinnerRef} size={14} />
                      Sending
                    </span>
                  ) : (
                    'Get in Touch'
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p
                  className="text-xs flex items-center gap-1.5"
                  style={{ color: '#a3403f', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <FaExclamationCircle size={12} /> Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookEventSection