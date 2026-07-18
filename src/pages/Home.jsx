import React from 'react'
import WeddingHero from '../components/WeddingHero '
import AboutUs from '../components/AboutUs'
import Service from '../components/Service'
import Gall from '../components/Gall'
import Testimonial from '../components/Testimonial'
const Home = () => {
  return (
    <div>
      <WeddingHero/>
      <AboutUs/>
      <Service/>
      <Gall/>
      <Testimonial/>
    </div>
  )
}

export default Home