import h1 from '../assets/images/hero/hero1.webp'
import h2 from '../assets/images/hero/g23.webp'
import h3 from '../assets/images/hero/g22.webp'
import h4 from '../assets/images/hero/g19.webp'
import h5 from '../assets/images/hero/m3.webp'

export const SLIDES = [
  {
    id: 'wedding-story',
    image: h1,
    eyebrow: 'Wedding Stories',
    title: 'Where Love Becomes a Lifetime Promise',
    subtitle: 'From the first glance to the final dance, every moment is beautifully yours.',
  },
  {
    id: 'forever-begins',
    image: h2,
    eyebrow: 'Forever Begins',
    title: 'Celebrating the Journey of Two Hearts',
    subtitle: 'Crafting timeless moments, heartfelt vows, and unforgettable celebrations.',
  },
  {
    id: 'dream-venue',
    image: h3,
    eyebrow: 'Dream Destinations',
    title: 'Where Beautiful Moments Find Their Perfect Place',
    subtitle: 'Explore breathtaking venues crafted for love, laughter, and lifelong memories.',
  },
  {
    id: 'love-story',
    image: h4,
    eyebrow: 'Together Forever',
    title: 'Every Love Story Deserves a Beautiful Beginning',
    subtitle: 'Creating magical weddings filled with love, joy, and cherished memories.',
  },
  {
    id: 'wedding-stage',
    image: h5,
    eyebrow: 'Wedding Stage',
    title: 'Where Every Spotlight Shines on Your Love',
    subtitle: 'Elegant stage designs that create breathtaking memories for a lifetime.',
  },
]

export const getSlideById = (id) => SLIDES.find((s) => s.id === id)