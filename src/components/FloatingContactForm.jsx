import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaRing, FaTimes, FaCheckCircle, FaExclamationCircle, FaSpinner, FaChevronDown } from 'react-icons/fa'
import gsap from 'gsap'

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.12)'

// SheetDB API endpoint mapping to your spreadsheet instance
const SHEETDB_URL = 'https://sheetdb.io/api/v1/ojuaqpmrsdyaq'

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

// How long to wait after page load before the popup appears (ms)
const APPEAR_DELAY = 5000

// sessionStorage key used to avoid re-showing the popup after it's been closed
const DISMISS_KEY = 'auraFloatingContactDismissed'

const FloatingContactForm = () => {
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventTypes: [], // now an array to support multiple selections
    budget: '',
    budgetOther: '', // free-text value when budget === OTHER_VALUE
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false)
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false)

  const cardRef = useRef(null)
  const formRef = useRef(null)
  const buttonRef = useRef(null)
  const spinnerRef = useRef(null)
  const glowTweenRef = useRef(null)
  const successIconRef = useRef(null)
  const successTextRef = useRef(null)
  const eventDropdownRef = useRef(null)
  const budgetDropdownRef = useRef(null)

  // Show the popup after a delay, unless the user already dismissed it this session
  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return

    const timer = setTimeout(() => {
      setVisible(true)
    }, APPEAR_DELAY)

    return () => clearTimeout(timer)
  }, [])

  // Animate the card in whenever it becomes visible, and lock background scroll
  useEffect(() => {
    if (visible && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' }
      )
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  // While submitting: pulse a soft gold glow around the card and spin the button icon
  useEffect(() => {
    if (status === 'sending') {
      if (cardRef.current) {
        glowTweenRef.current = gsap.to(cardRef.current, {
          boxShadow: `0 0 0 6px rgba(200,169,106,0.25)`,
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
      glowTweenRef.current?.kill()
      if (cardRef.current) gsap.set(cardRef.current, { boxShadow: 'none' })
      if (spinnerRef.current) gsap.killTweensOf(spinnerRef.current)
    }

    return () => {
      glowTweenRef.current?.kill()
    }
  }, [status])

  // Elastic pop-in for the success checkmark + staggered text reveal
  useEffect(() => {
    if (status === 'success' && successIconRef.current && successTextRef.current) {
      gsap
        .timeline()
        .fromTo(
          successIconRef.current,
          { scale: 0, rotation: -30, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
        )
        .fromTo(
          successTextRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        )
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

  const handleClose = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      })
    } else {
      setVisible(false)
    }
    sessionStorage.setItem(DISMISS_KEY, 'true')
  }

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

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 1 },
        { scale: 1.015, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 }
      )
    }

    const currentTimestamp = new Date().toLocaleString()

    // Resolve the final budget value: the custom text when "Other" is chosen, otherwise the picked range
    const resolvedBudget = form.budget === OTHER_VALUE ? form.budgetOther : form.budget

    try {
      await axios.post(SHEETDB_URL, {
        data: [
          {
            timestamp: currentTimestamp,
            source: 'Floating Popup',
            name: form.name,
            email: form.email,
            phone: form.phone,
            // SheetDB stores flat cell values, so join the array into a readable string
            eventType: form.eventTypes.join(', '),
            budgetRange: resolvedBudget,
            message: form.message,
          },
        ],
      })

      setStatus('success')
      setForm({ name: '', email: '', phone: '', eventTypes: [], budget: '', budgetOther: '', message: '' })
      sessionStorage.setItem(DISMISS_KEY, 'true')
    } catch (err) {
      console.error('Floating contact form submission failed:', err)
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

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { boxShadow: '0 0 0 6px rgba(163,64,63,0.35)' },
          { boxShadow: '0 0 0 0 rgba(163,64,63,0)', duration: 0.8, ease: 'power2.out' }
        )
      }
    }
  }

  if (!visible) return null

  const inputStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: PURPLE,
    borderColor: LINE,
  }

  const fieldClass =
    'w-full border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 transition-colors bg-white'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-label="Contact us"
    >
      {/* Dimmed backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        className="relative w-full max-w-md p-6 sm:p-8 shadow-2xl"
        style={{ backgroundColor: '#fff', border: `1px solid ${LINE}` }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
          style={{ color: PURPLE, opacity: 0.6 }}
        >
          <FaTimes size={13} />
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center py-4">
            <FaCheckCircle
              ref={successIconRef}
              size={28}
              style={{ color: '#3f7d4f' }}
              className="mb-3"
            />
            <p
              ref={successTextRef}
              className="text-sm"
              style={{ color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
            >
              Thank you — your message is on its way. We'll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4 pr-6">
              <FaRing size={20} style={{ color: GOLD, flexShrink: 0 }} />
              <div>
                <h3
                  className="text-lg leading-tight"
                  style={{ color: PURPLE, fontFamily: "'Playfair Display', serif" }}
                >
                  Planning an event?
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
                >
                  Get a free consultation — takes 30 seconds.
                </p>
              </div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className={fieldClass}
                style={inputStyle}
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className={fieldClass}
                style={inputStyle}
              />

              <input
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className={fieldClass}
                style={inputStyle}
              />

              {/* Multi-select event type dropdown — click to toggle each option */}
              <div className="relative" ref={eventDropdownRef}>
                <button
                  type="button"
                  onClick={() => setEventDropdownOpen((open) => !open)}
                  className={`${fieldClass} flex items-center justify-between text-left`}
                  style={inputStyle}
                  aria-haspopup="listbox"
                  aria-expanded={eventDropdownOpen}
                >
                  <span
                    className={form.eventTypes.length === 0 ? 'opacity-50' : ''}
                    style={{ color: PURPLE }}
                  >
                    {form.eventTypes.length === 0
                      ? 'Select event type(s)'
                      : form.eventTypes.join(', ')}
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
                          style={{ color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEventType(type)}
                            className="w-3.5 h-3.5 accent-current"
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
                <div className="flex flex-wrap gap-1.5">
                  {form.eventTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 rounded-full pl-2.5 pr-1.5 py-1 text-[11px]"
                      style={{
                        backgroundColor: 'rgba(200,169,106,0.15)',
                        color: PURPLE,
                        fontFamily: "'Poppins', sans-serif",
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
                  style={inputStyle}
                  aria-haspopup="listbox"
                  aria-expanded={budgetDropdownOpen}
                >
                  <span
                    className={form.budget === '' ? 'opacity-50' : ''}
                    style={{ color: PURPLE }}
                  >
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
                            fontFamily: "'Poppins', sans-serif",
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
                  style={inputStyle}
                />
              )}

              <textarea
                name="message"
                rows={2}
                value={form.message}
                onChange={handleChange}
                placeholder="Anything else we should know? (optional)"
                className="w-full border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 transition-colors bg-white"
                style={inputStyle}
              />

              <button
                ref={buttonRef}
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                style={{ backgroundColor: GOLD, color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
              >
                {status === 'sending' ? (
                  <span className="inline-flex items-center gap-2">
                    <FaSpinner ref={spinnerRef} size={14} />
                    Sending...
                  </span>
                ) : (
                  'Get in Touch'
                )}
              </button>

              {status === 'error' && (
                <p
                  className="text-xs flex items-center gap-1.5"
                  style={{ color: '#a3403f', fontFamily: "'Poppins', sans-serif" }}
                >
                  <FaExclamationCircle size={12} /> Something went wrong. Please try again.
                </p>
              )}

              <p
                className="text-[11px] text-center pt-1"
                style={{ color: PURPLE, opacity: 0.45, fontFamily: "'Poppins', sans-serif" }}
              >
                No spam. Just wedding magic. ✨
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default FloatingContactForm