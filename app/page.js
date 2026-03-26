import React from 'react'
import Hero from './Components/Hero'
import StorySection from './Components/StorySection'
import InteractiveGallery from './Components/InteractiveGallery'
import HaldiSection from './Components/HaldiSection'
import AllImages from './Components/AllImages'

const page = () => {
  return (
    <div>
      <Hero />
      <StorySection />
      <HaldiSection />
      <AllImages />
    </div>
  )
}

export default page
