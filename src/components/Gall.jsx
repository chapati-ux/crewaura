import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import imgaes from '../data/gallary'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.15)'

const Gall = () => {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const itemRefs = useRef([])
  const buttonRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Header Entry Animation
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        }
      })

      // 2. Staggered Grid Reveal & Dynamic Parallax Flow
      itemRefs.current.forEach((el, index) => {
        if (!el) return
        const img = el.querySelector('img')

        // Fade & float up layout reveal
        gsap.fromTo(el, 
          { opacity: 0, y: 60 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.85, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
            }
          }
        )

        // Smooth continuous image container parallax movement
        gsap.to(img, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      })

      // 3. Button Entry Animation
      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 90%',
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative py-24 sm:py-32" style={{ backgroundColor: IVORY }}>
      {/* Structural accent context divider lines */}
      <div className="absolute top-0 left-12 right-12 h-px" style={{ backgroundColor: LINE }} />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Curated Editorial Header */}
        <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }} className="text-xl italic tracking-wide">
              Visual Archives
            </span>
            <h2 style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }} className="text-3xl md:text-5xl font-light tracking-tight mt-2">
              Captured Moments
            </h2>
          </div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }} className="max-w-xs text-xs opacity-70 leading-relaxed md:text-right">
            A preserved timeline of visual poetry, architectural symmetries, and delicate celebrations.
          </p>
        </div>

        {/* Dynamic Asymmetric Masonry Layout Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 [column-fill:_balance]">
          {imgaes.slice(0, 6).map((item, i) => (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`break-inside-avoid relative w-full group overflow-hidden cursor-pointer ${item.aspect} bg-stone-900`}
            >
              {/* Inner Parallax Wrap Window Container */}
              <div className="absolute inset-0 w-full h-[115%] -top-[10%] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover will-change-transform transition-all duration-700 ease-out group-hover:scale-105"
                />
                {/* Editorial shadow fill wash overlay */}
                <div 
                  className="absolute inset-0 transition-opacity duration-500 opacity-40 group-hover:opacity-85"
                  style={{
                    background: `linear-gradient(to top, ${PURPLE} 5%, transparent 70%)`
                  }}
                />
              </div>

              {/* Minimal Framed Border Accent Element */}
              <div 
                className="absolute inset-4 z-20 pointer-events-none opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                style={{ border: `1px solid ${GOLD}40` }}
              />

              {/* Display Meta Information Overlay */}
              <div className="absolute inset-x-0 bottom-0 z-30 p-8 transform translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex justify-between items-end">
                <div>
                  <span className="text-[10px] tracking-widest uppercase block mb-1 text-amber-200/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.tag}
                  </span>
                  <h3 className="text-lg text-white font-light font-serif leading-none">
                    {item.title}
                  </h3>
                </div>
                <span className="text-xs italic text-white/50" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  // {item.year}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Button Container */}
        <div ref={buttonRef} className="mt-16 text-center">
          <Link
          to={'/gallery'}
            onClick={() => console.log('Load more clicked')}
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif", 
              borderColor: PURPLE,
              color: PURPLE
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 border text-xs tracking-widest uppercase bg-transparent  hover:bg-[#2D1C3E] transition-all duration-300 ease-out group rounded-none hover:text-white"
          >
            <span>View Full Gallery</span>
            <svg 
              className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Gall