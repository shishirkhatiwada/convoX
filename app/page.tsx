import Features from '@/components/landing/features/page'
import Footer from '@/components/landing/footer/page'
import Hero from '@/components/landing/hero/page'
import Integration from '@/components/landing/integration/page'
import NavBar from '@/components/landing/nav/page'
import Pricing from '@/components/landing/pricing/page'
import SocialProof from '@/components/landing/social/page'
import React from 'react'

const Page = () => {
  return (
    <main className='w-full flex flex-col relative z-10'>

      <NavBar/>
      <Hero/>
      <SocialProof/>
      <Features/>
      <Integration/>
      <Pricing/>
      <Footer/>
    </main>
  )
}

export default Page