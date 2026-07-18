import React, { useContext, useEffect, useRef, useCallback } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import gsap from 'gsap'
import { MyContext } from '../context/Context'
import { SLIDES } from '../data/auto'

const GOLD = '#C8A96A'
const CREAM = '#F5EFE6'
const AUTOPLAY_MS = 6000

const WeddingHero = () => {
  const { num, setNum } = useContext(MyContext)

  const imageRefs = useRef([])
  const eyebrowRef = useRef(null)
  const titleLettersRef = useRef([])
  const subtitleRef = useRef(null)
  const progressRef = useRef(null)
  const timeoutRef = useRef(null)
  const isPausedRef = useRef(false)

  const goTo = useCallback(
    (index) => {
      const next = (index + SLIDES.length) % SLIDES.length
      setNum(next)
    },
    [setNum]
  )

  const next = useCallback(() => goTo(num + 1), [num, goTo])
  const prev = useCallback(() => goTo(num - 1), [num, goTo])

  // --- Autoplay ---
  useEffect(() => {
    const tick = () => {
      if (!isPausedRef.current) next()
    }
    timeoutRef.current = setTimeout(tick, AUTOPLAY_MS)
    return () => clearTimeout(timeoutRef.current)
  }, [num, next])

  // --- Cross-fade the background images ---
  useEffect(() => {
    imageRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        opacity: i === num ? 1 : 0,
        scale: i === num ? 1 : 1.08,
        duration: 1.1,
        ease: 'power2.out',
      })
    })
  }, [num])

  // --- Creative text entrance per slide: eyebrow slides in, title letters   ---
  // --- tumble up one by one, subtitle fades in, progress bar resets/fills  ---
  useEffect(() => {
    const slide = SLIDES[num]
    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { x: -30, opacity: 0 })
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 })
      gsap.set(titleLettersRef.current, { y: 60, opacity: 0, rotate: () => gsap.utils.random(-8, 8) })
      gsap.set(progressRef.current, { scaleX: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(eyebrowRef.current, { x: 0, opacity: 1, duration: 0.5 })
        .to(
          titleLettersRef.current,
          { y: 0, opacity: 1, rotate: 0, duration: 0.7, stagger: 0.02 },
          '-=0.25'
        )
        .to(subtitleRef.current, { y: 0, opacity: 1, duration: 0.5 }, '-=0.35')
        .to(
          progressRef.current,
          { scaleX: 1, duration: AUTOPLAY_MS / 1000, ease: 'none' },
          '-=0.2'
        )
    })
    return () => ctx.revert()
  }, [num])

  const slide = SLIDES[num]
  // Split title into words so letters wrap naturally, each letter still gets its own ref.
  let letterIndex = 0

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#2D1C3E' }}
      onMouseEnter={() => (isPausedRef.current = true)}
      onMouseLeave={() => (isPausedRef.current = false)}
      aria-roledescription="carousel"
      aria-label="Featured weddings"
    >
      {/* Background images, cross-fading */}
      {SLIDES.map((s, i) => (
        <img
          key={s.id}
          ref={(el) => (imageRefs.current[i] = el)}
          src={s.image}
          alt={s.title}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: i === num ? 1 : 0 }}
        />
      ))}

      {/* Overlay for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(45,28,62,0.92) 0%, rgba(45,28,62,0.35) 45%, rgba(45,28,62,0.55) 100%)',
        }}
      />

      {/* Slide content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span
          ref={eyebrowRef}
          style={{ color: GOLD, fontFamily: "'Space Grotesk', sans-serif" }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.35em] sm:text-sm"
        >
          {slide.eyebrow}
        </span>

        <h1
          style={{ fontFamily: "'Unbounded', sans-serif", color: CREAM }}
          className="flex max-w-5xl flex-wrap justify-center gap-x-4 gap-y-1 text-4xl leading-tight sm:text-6xl lg:text-7xl"
        >
          {slide.title.split(' ').map((word, wi) => (
            <span key={wi} className="flex">
              {word.split('').map((char, ci) => {
                const idx = letterIndex++
                return (
                  <span
                    key={ci}
                    ref={(el) => (titleLettersRef.current[idx] = el)}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          style={{ color: '#D8CFE0', fontFamily: "'Space Grotesk', sans-serif" }}
          className="mt-6 max-w-xl text-base sm:text-lg"
        >
          {slide.subtitle}
        </p>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 backdrop-blur-sm transition-transform duration-300 hover:scale-110 sm:left-6 sm:p-3"
        style={{ borderColor: 'rgba(245,239,230,0.25)', color: CREAM }}
      >
        <HiChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 backdrop-blur-sm transition-transform duration-300 hover:scale-110 sm:right-6 sm:p-3"
        style={{ borderColor: 'rgba(245,239,230,0.25)', color: CREAM }}
      >
        <HiChevronRight size={24} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-12">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === num}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === num ? '2rem' : '0.4rem',
              backgroundColor: i === num ? GOLD : 'rgba(245,239,230,0.4)',
            }}
          />
        ))}
      </div>

      {/* Autoplay progress bar */}
      <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full" style={{ backgroundColor: 'rgba(245,239,230,0.15)' }}>
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{ backgroundColor: GOLD }}
        />
      </div>
    </section>
  )
}

export default WeddingHero