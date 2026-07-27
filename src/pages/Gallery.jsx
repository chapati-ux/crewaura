import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import galleryItems from '../data/gallary'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.15)'

const Gallery = () => {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const heroLabelRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroRuleRef = useRef(null)
  const headerRef = useRef(null)
  const itemRefs = useRef([])
  const videoRefs = useRef([])
  const buttonRef = useRef(null)

  // ---- Lightbox state ----
  const [activeIndex, setActiveIndex] = useState(null)
  const isOpen = activeIndex !== null
  const directionRef = useRef('next')

  const overlayRef = useRef(null)
  const stageRef = useRef(null)
  const lightboxVideoRef = useRef(null)

  // ============ Grid scroll + entrance animations ============
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from(heroLabelRef.current, { y: 16, opacity: 0, duration: 0.5 })
        .from(heroTitleRef.current, { y: 28, opacity: 0, duration: 0.8 }, '-=0.3')
        .from(heroRuleRef.current, { scaleX: 0, transformOrigin: 'left', duration: 0.7 }, '-=0.4')

      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
      })

      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const media = el.querySelector('img, video')

        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          }
        )

        if (media && media.tagName === 'IMG') {
          gsap.to(media, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // ---- Auto-play video tiles as they enter/leave the viewport ----
        if (media && media.tagName === 'VIDEO') {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => media.play().catch(() => {}),
            onEnterBack: () => media.play().catch(() => {}),
            onLeave: () => media.pause(),
            onLeaveBack: () => media.pause(),
          })
        }
      })

      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: buttonRef.current, start: 'top 90%' },
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // ============ Lightbox open/close/navigate ============
  const openLightbox = (index) => setActiveIndex(index)
  const closeLightbox = () => setActiveIndex(null)

  const goNext = useCallback(() => {
    directionRef.current = 'next'
    setActiveIndex((prev) => (prev === null ? prev : (prev + 1) % galleryItems.length))
  }, [])

  const goPrev = useCallback(() => {
    directionRef.current = 'prev'
    setActiveIndex((prev) =>
      prev === null ? prev : (prev - 1 + galleryItems.length) % galleryItems.length
    )
  }, [])

  // Keyboard navigation while lightbox is open
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, goNext, goPrev])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Overlay fade in
  useEffect(() => {
    if (!overlayRef.current) return
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    }
  }, [isOpen])

  // Slide transition whenever the active item changes
  useEffect(() => {
    if (!isOpen || !stageRef.current) return
    const dir = directionRef.current === 'next' ? 1 : -1

    gsap.fromTo(
      stageRef.current,
      { x: 60 * dir, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    )

    if (lightboxVideoRef.current) {
      lightboxVideoRef.current.currentTime = 0
      lightboxVideoRef.current.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) closeLightbox()
  }

  const active = isOpen ? galleryItems[activeIndex] : null

  return (
    <div ref={pageRef} style={{ backgroundColor: IVORY }}>
      {/* ============ Hero ============ */}
      <section className="relative px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div ref={heroRef} className="mx-auto max-w-7xl">
          <span
            ref={heroLabelRef}
            style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
            className="text-xl italic tracking-wide block"
          >
            The Gallery
          </span>
          <h1
            ref={heroTitleRef}
            style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
            className="text-4xl md:text-6xl font-light tracking-tight mt-3"
          >
            Every Moment, Held
          </h1>
          <div ref={heroRuleRef} className="h-px w-24 mt-8" style={{ backgroundColor: GOLD }} />
        </div>
      </section>

      {/* ============ Grid section ============ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute top-0 left-12 right-12 h-px" style={{ backgroundColor: LINE }} />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={headerRef}
            className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                className="text-xl italic tracking-wide"
              >
                Visual Archives
              </span>
              <h2
                style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                className="text-3xl md:text-5xl font-light tracking-tight mt-2"
              >
                Captured Moments
              </h2>
            </div>
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
              className="max-w-xs text-xs opacity-70 leading-relaxed md:text-right"
            >
              A preserved timeline of visual poetry, architectural symmetries, and delicate
              celebrations.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 [column-fill:_balance]">
            {galleryItems.map((item, i) => {
              const isVideo = item.media === 'video'

              return (
                <div
                  key={item.id}
                  ref={(el) => (itemRefs.current[i] = el)}
                  onClick={() => openLightbox(i)}
                  className={`break-inside-avoid relative w-full group overflow-hidden cursor-pointer ${item.aspect} bg-stone-900`}
                >
                  <div className="absolute inset-0 w-full h-[115%] -top-[10%] overflow-hidden">
                    {isVideo ? (
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        src={item.src}
                        poster={item.img}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover will-change-transform transition-all duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover will-change-transform transition-all duration-700 ease-out group-hover:scale-105"
                      />
                    )}

                    <div
                      className="absolute inset-0 transition-opacity duration-500 opacity-40 group-hover:opacity-85"
                      style={{ background: `linear-gradient(to top, ${PURPLE} 5%, transparent 70%)` }}
                    />
                  </div>

                  {isVideo && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-500 opacity-90 group-hover:opacity-0">
                      <div
                        className="flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: `${PURPLE}66`, border: `1px solid ${GOLD}80` }}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 ml-1" fill={GOLD}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div
                    className="absolute inset-4 z-20 pointer-events-none opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                    style={{ border: `1px solid ${GOLD}40` }}
                  />

                  <div className="absolute inset-x-0 bottom-0 z-30 p-8 transform translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex justify-between items-end">
                    <div>
                      <span
                        className="text-[10px] tracking-widest uppercase block mb-1 text-amber-200/70"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {item.tag}
                        {isVideo ? ' · Video' : ''}
                      </span>
                      <h3 className="text-lg text-white font-light font-serif leading-none">
                        {item.title}
                      </h3>
                    </div>
                    <span
                      className="text-xs italic text-white/50"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      // {item.year}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

         
        </div>
      </section>

      {/* ============ Lightbox ============ */}
      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-8"
          style={{ backgroundColor: 'rgba(20,12,28,0.94)' }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-6 right-6 sm:top-8 sm:right-8 w-11 h-11 flex items-center justify-center rounded-full text-white/80 hover:text-white border border-white/20 hover:border-white/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Prev arrow */}
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white/80 hover:text-white border border-white/20 hover:border-white/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {/* Stage */}
          <div
            ref={stageRef}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {active.media === 'video' ? (
              <video
                key={active.id}
                ref={lightboxVideoRef}
                src={active.src}
                poster={active.img}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[75vh] w-auto max-w-full rounded-sm shadow-2xl"
              />
            ) : (
              <img
                key={active.id}
                src={active.img}
                alt={active.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl"
              />
            )}

            <div className="mt-5 text-center">
              <span
                className="text-[10px] tracking-widest uppercase block mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
              >
                {active.tag}
                {active.media === 'video' ? ' · Video' : ''} &middot; {active.year}
              </span>
              <h3
                className="text-xl text-white font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {active.title}
              </h3>
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white/80 hover:text-white border border-white/20 hover:border-white/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50 tracking-widest"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {activeIndex + 1} / {galleryItems.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery