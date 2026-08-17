import React, { useEffect, useRef } from 'react'
import { FiMapPin } from 'react-icons/fi'
import { GiFlowerEmblem } from 'react-icons/gi'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const TEXT = '#4A3F55'
const LINE = 'rgba(45,28,62,0.15)'

const PETAL_COUNT = 10

const AboutUs = () => {
  const containerRef = useRef(null)
  const leftColRef = useRef(null)
  const headingRef = useRef(null)
  const paraRef = useRef(null)
  const decorativeLineRef = useRef(null)

  // Wedding ring animation refs
  const ringVisualRef = useRef(null)
  const ringOneRef = useRef(null)
  const ringTwoRef = useRef(null)
  const petalRefs = useRef([])

  useEffect(() => {
    if (document.getElementById('crewaura-cormorant-font')) return
    const link = document.createElement('link')
    link.id = 'crewaura-cormorant-font'
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&display=swap'
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Line expansion
      gsap.fromTo(decorativeLineRef.current, 
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1.2, 
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      )

      // 2. Left column typography reveals (Clips and floats)
      const headingSplit = headingRef.current.querySelectorAll('.word-trigger')
      gsap.from(headingSplit, {
        yPercent: 100,
        stagger: 0.05,
        duration: 0.85,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        }
      })

      gsap.from(paraRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: paraRef.current,
          start: 'top 85%',
        }
      })

      // 3. Wedding rings — draw themselves in, then settle with a gentle interlock float
      if (ringOneRef.current && ringTwoRef.current) {
        const ringLen1 = ringOneRef.current.getTotalLength()
        const ringLen2 = ringTwoRef.current.getTotalLength()

        gsap.set(ringOneRef.current, { strokeDasharray: ringLen1, strokeDashoffset: ringLen1 })
        gsap.set(ringTwoRef.current, { strokeDasharray: ringLen2, strokeDashoffset: ringLen2 })
        gsap.set(ringVisualRef.current, { opacity: 0, scale: 0.9 })

        const ringTl = gsap.timeline({
          scrollTrigger: {
            trigger: ringVisualRef.current,
            start: 'top 80%',
          }
        })

        ringTl
          .to(ringVisualRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
          .to(ringOneRef.current, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, '-=0.2')
          .to(ringTwoRef.current, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, '-=1.1')
          .to(ringVisualRef.current, {
            y: -8,
            duration: 2.4,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }, '-=0.4')
      }

      // 4. Floating petals — gentle upward drift with fade, looping, staggered
      petalRefs.current.forEach((petal, i) => {
        if (!petal) return
        const startX = gsap.utils.random(-20, 20)
        const drift = gsap.utils.random(-40, 40)
        const duration = gsap.utils.random(7, 13)
        const delay = gsap.utils.random(0, 6)

        gsap.set(petal, {
          x: startX,
          y: 40,
          opacity: 0,
          rotate: gsap.utils.random(-30, 30),
        })

        gsap.to(petal, {
          y: -420,
          x: startX + drift,
          rotate: '+=180',
          opacity: 0.55,
          duration,
          delay,
          repeat: -1,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: ringVisualRef.current,
            start: 'top 90%',
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative overflow-hidden py-24 sm:py-36" 
      style={{ backgroundColor: IVORY }}
      aria-labelledby="about-heading"
    >
      {/* Structural Minimal Grid Background Accent Line */}
      <div ref={decorativeLineRef} className="absolute top-0 left-8 right-8 h-px origin-left" style={{ backgroundColor: LINE }} />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Narrative & Statement Branding */}
          <div ref={leftColRef} className="lg:col-span-7 flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <GiFlowerEmblem size={20} style={{ color: GOLD }} className="animate-spin-slow" role="img" aria-label="Decorative Floral Emblem" />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }} className="text-xs tracking-[0.25em] uppercase font-medium">
                  The Masterminds
                </span>
              </div>

              <h1 
                id="about-heading"
                ref={headingRef}
                style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }} 
                className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.1] mb-8"
              >
                <span className="block overflow-hidden pb-1">
                  <span className="word-trigger inline-block">Crafting</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span className="word-trigger inline-block font-normal italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}>Experiences,</span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span className="word-trigger inline-block">Not Just Events.</span>
                </span>
              </h1>

              <div 
                ref={paraRef}
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: TEXT }}
                className="text-base sm:text-lg leading-relaxed max-w-xl space-y-6 opacity-90"
              >
                <p>
                  Welcome to <strong style={{ color: PURPLE, fontWeight: 600 }}>Crew Aura</strong> — your premier narrative destination for unforgettable global celebrations. 
                  Co-founded by Sahil Manjulkar & Nityanand Bankar, we meticulously blend artistic visual poetry with geometric operational precision. 
                </p>
                <p>
                  From quiet beachside vows to massive ballroom corporate launches, we balance absolute elegance, infectious energy, and pristine execution.
                </p>
              </div>
            </div>

            <address className="mt-12 lg:mt-24 inline-flex items-center gap-4 self-start border-b pb-2 not-italic" style={{ borderColor: LINE }}>
              <div className="p-2 rounded-full bg-stone-950/5">
                <FiMapPin size={16} style={{ color: GOLD }} role="img" aria-label="Location Marker" />
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }} className="text-xs tracking-wider uppercase font-medium">
                Navi Mumbai <span className="mx-1 text-stone-400" aria-hidden="true">•</span> Pan-India Destinations
              </p>
            </address>
          </div>

          {/* RIGHT COLUMN: Animated wedding rings + floating petals */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px]">
            
            {/* Floating petals layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: PETAL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (petalRefs.current[i] = el)}
                  className="absolute rounded-full"
                  style={{
                    left: `${8 + ((i * 97) % 90)}%`,
                    bottom: '10%',
                    width: i % 3 === 0 ? 10 : 6,
                    height: i % 3 === 0 ? 14 : 9,
                    backgroundColor: i % 2 === 0 ? GOLD : PURPLE,
                    opacity: 0.15,
                    borderRadius: '60% 40% 60% 40%',
                  }}
                />
              ))}
            </div>

            {/* Interlocking rings SVG */}
            <div ref={ringVisualRef} className="relative w-64 h-64 sm:w-80 sm:h-80">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  ref={ringOneRef}
                  cx="120"
                  cy="150"
                  r="70"
                  stroke={GOLD}
                  strokeWidth="3"
                />
                <circle
                  ref={ringTwoRef}
                  cx="185"
                  cy="150"
                  r="70"
                  stroke={PURPLE}
                  strokeWidth="3"
                />
              </svg>

              {/* Small accent label under the rings */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-center pt-4">
                <p
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                  className="text-lg italic tracking-wide"
                >
                  Two hearts, one aura
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutUs