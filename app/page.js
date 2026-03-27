import React from 'react'
import Hero from './Components/Hero'
import StorySection from './Components/StorySection'
import InteractiveGallery from './Components/InteractiveGallery'
import HaldiSection from './Components/HaldiSection'
import AllImages from './Components/AllImages'
import WeddingCard from './Components/WeddingCard'
import Footer from './Components/Footer'

const page = () => {
  return (
    <div className='relative'>
      <Hero />
      <StorySection />
      <HaldiSection />
      <AllImages />
      <WeddingCard/>
      <Footer/>
    </div>
  )
}

export default page
