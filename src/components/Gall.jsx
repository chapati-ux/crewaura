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

      itemRefs.current.forEach((el, index) => {
        if (!el) return
        const img = el.querySelector('img')

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
      <div className="absolute top-0 left-12 right-12 h-px" style={{ backgroundColor: LINE }} />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 [column-fill:_balance]">
          {imgaes.slice(0, 6).map((item, i) => (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`break-inside-avoid relative w-full group overflow-hidden cursor-pointer ${item.aspect} bg-stone-900`}
            >
              <div className="absolute inset-0 w-full h-[115%] -top-[10%] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover will-change-transform transition-all duration-700 ease-out group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0 transition-opacity duration-500 opacity-40 group-hover:opacity-85"
                  style={{
                    background: `linear-gradient(to top, ${PURPLE} 5%, transparent 70%)`
                  }}
                />
              </div>

              <div 
                className="absolute inset-4 z-20 pointer-events-none opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                style={{ border: `1px solid ${GOLD}40` }}
              />

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
        <div ref={buttonRef} className="mt-16 flex justify-center">
          <Link
            to="/gallery"
            className="group relative inline-flex items-center gap-3 overflow-hidden border px-8 py-3.5 text-sm tracking-wide transition-colors duration-500"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              borderColor: GOLD,
              color: PURPLE,
            }}
          >
            <span
              className="absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
              style={{ backgroundColor: PURPLE }}
            />
            <span className="transition-colors duration-500 group-hover:text-white">
              View Full Gallery
            </span>
            <span
              className="transition-transform duration-500 group-hover:translate-x-1 group-hover:text-white"
              style={{ color: GOLD }}
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Gall