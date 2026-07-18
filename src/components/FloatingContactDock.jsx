import React, { useLayoutEffect, useRef } from 'react'
import { FiMail, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import gsap from 'gsap'

const FloatingContactDock = () => {
  const dockRef = useRef(null)

  useLayoutEffect(() => {
    // Context keeps GSAP scoped safely inside React
    let ctx = gsap.context(() => {
      // Staggered entrance animation from the bottom right
      gsap.fromTo(
        '.contact-btn',
        { 
          opacity: 0, 
          y: 40, 
          scale: 0.8 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'back.out(1.7)',
          delay: 0.5 // small delay so the page content loads first
        }
      )
    }, dockRef)

    return () => ctx.revert() // clean up animations on unmount
  }, [])

  // Dynamic hover scale animation handlers using GSAP
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.12, duration: 0.3, ease: 'power2.out' })
  }

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  // Define contact actions securely for SEO and indexing
  const ACTIONS = [
    {
      id: 'whatsapp',
      href: 'https://wa.me/917021565980', // Replace with your target phone number
      icon: <FaWhatsapp size={20} />,
      label: 'Chat on WhatsApp',
      bgColor: '#25D366',
      textColor: '#FFFFFF',
    },
    {
      id: 'phone',
      href: 'tel:+917021565980', // Replace with your contact number
      icon: <FiPhone size={20} />,
      label: 'Call Us Now',
      bgColor: '#C8A96A', // Blends with your site's gold accents
      textColor: '#FFFFFF',
    },
    {
      id: 'email',
      href: 'mailto:hello@weddedstudio.com', // Matches your site's anchor email
      icon: <FiMail size={20} />,
      label: 'Send an Email',
      bgColor: '#2D1C3E', // Matches your site's deep luxury purple
      textColor: '#FFFFFF',
    },
  ]

  return (
    <div 
      ref={dockRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      role="complementary"
      aria-label="Quick Contact Actions"
    >
      {ACTIONS.map((action) => (
        <a
          key={action.id}
          href={action.href}
          target={action.id === 'whatsapp' ? '_blank' : '_self'}
          rel={action.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
          className="contact-btn pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-shadow duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]"
          style={{ backgroundColor: action.bgColor, color: action.textColor }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={action.label}
        >
          {action.icon}
        </a>
      ))}
    </div>
  )
}

export default FloatingContactDock