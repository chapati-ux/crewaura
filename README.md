# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

wedding-planner/
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── videos/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Services/
│   │   ├── Process/
│   │   ├── Portfolio/
│   │   ├── Packages/
│   │   ├── Testimonials/
│   │   ├── FAQ/
│   │   ├── Contact/
│   │   ├── Footer/
│   │   ├── Button/
│   │   ├── SectionTitle/
│   │   ├── Card/
│   │   └── Loader/
│   │
│   ├── context/
│   │   ├── WeddingContext.jsx
│   │   └── WeddingProvider.jsx
│   │
│   ├── data/
│   │   ├── services.js
│   │   ├── gallery.js
│   │   ├── testimonials.js
│   │   ├── packages.js
│   │   ├── faq.js
│   │   └── process.js
│   │
│   ├── hooks/
│   │   └── useWedding.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Gallery.jsx
│   │   ├── Services.jsx
│   │   ├── Packages.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── scrollToTop.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── animations.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts (if using TypeScript)
│
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md"# crewaura" 




g1.webp
g3.webp
g5.webp
g6.webp
g7.webp
g8.webp
g9.webp
g10.webp
g11.webp
g12.webp
g15.webp
g20.webp

g21.webp
21.webp
g13.webp
g14.webp


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




import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaRing, FaTimes, FaCheckCircle, FaExclamationCircle, FaSpinner, FaChevronDown } from 'react-icons/fa'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.14)'

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

    const currentTimestamp = new Date().toLocaleString()

    // Resolve the final budget value: the custom text when "Other" is chosen, otherwise the picked range
    const resolvedBudget = form.budget === OTHER_VALUE ? form.budgetOther : form.budget

    try {
      await axios.post(SHEETDB_URL, {
        data: [
          {
            timestamp: currentTimestamp,
            source: 'Book an Event Section',
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

  const textStyle = { fontFamily: "'Poppins', sans-serif", color: PURPLE }

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
            style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}
          >
            Let's plan together
          </p>

          <h2
            className="text-4xl sm:text-5xl leading-[1.1]"
            style={{ color: PURPLE, fontFamily: "'Playfair Display', serif" }}
          >
            Book an Event
          </h2>

          <p
            className="mt-6 max-w-sm text-base leading-relaxed"
            style={{ color: PURPLE, opacity: 0.72, fontFamily: "'Poppins', sans-serif" }}
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
                  style={{ color: PURPLE, opacity: 0.75, fontFamily: "'Poppins', sans-serif" }}
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
              <p className="text-base" style={{ color: PURPLE, fontFamily: "'Poppins', sans-serif" }}>
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
                          style={{ color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
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
                  style={{ color: PURPLE, opacity: 0.45, fontFamily: "'Poppins', sans-serif" }}
                >
                  No spam. Just wedding magic. ✨
                </p>

                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex-shrink-0"
                  style={{ backgroundColor: GOLD, color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
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
                  style={{ color: '#a3403f', fontFamily: "'Poppins', sans-serif" }}
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