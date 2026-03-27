'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { hero } from '@/public/assets/assets';
import InteractiveGallery from './InteractiveGallery';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StorySection() {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO ENTRANCE
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(".we-title-name", {
        yPercent: 110,
        stagger: 0.15,
        duration: 1.8,
        ease: "expo.out",
      })
      .from(".we-hero-meta", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      }, "-=1.2");

      // 2. UNIVERSAL PARALLAX (High Performance)
      gsap.utils.toArray('.we-parallax').forEach((el) => {
        const speed = el.dataset.speed || 0.1;
        gsap.to(el, {
          y: -100 * speed,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });

      // 3. REVEAL ANIMATIONS FOR CONTENT BLOCKS
      gsap.utils.toArray('.we-reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }, mainRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative bg-[#0a0a09] text-white selection:bg-[#c9a96e] overflow-x-hidden">
      
      {/* ── FIXED CINEMATIC BACKGROUND ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="grid grid-cols-2 h-full w-full">
          <div className="relative h-screen border-r border-white/5">
            <Image src={hero.bhumicouple} fill className="object-cover opacity-50 grayscale-[0.4]" alt="Sai" priority />
          </div>
          <div className="relative h-screen">
            <Image src={hero.bhumi} fill className="object-cover opacity-50 grayscale-[0.4]" alt="Bhumi" priority />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* ── SECTION 1: HERO ── */}
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="we-hero-meta mb-6">
            <span className="text-[10px] tracking-[0.8em] text-[#c9a96e] uppercase block">
              A Cinematic Preservation · 2026
            </span>
          </div>
          
          <div className="overflow-hidden">
            <h1 className="we-title-name font-[Canvas] text-[16vw] md:text-[9vw] leading-[0.85] tracking-tighter uppercase">
              Sai Kiran
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="we-title-name font-[Canvas] italic text-[13vw] md:text-[7vw] text-[#c9a96e] leading-[0.9] tracking-tighter">
              & Bhumika
            </h1>
          </div>

          <div className="we-hero-meta mt-12 flex flex-col items-center gap-4">
            <p className="font-serif italic text-white/40 text-sm md:text-lg">The Architecture of a Shared Soul</p>
            <div className="w-px h-16 bg-gradient-to-b from-[#c9a96e] to-transparent" />
          </div>
        </section>

        {/* ── SECTION 2: THE INTERACTIVE EXHIBIT ── */}
        <section className="relative h-[100vh]">
          <div className="sticky top-0 h-screen flex items-center justify-center pointer-events-none">
            <p className="text-[8px] uppercase tracking-[1em] text-white/20 rotate-90 absolute right-10">
              Scroll to Explore
            </p>
          </div>
          <InteractiveGallery />
        </section>

        {/* ── SECTION 3: THE NARRATIVE SPLIT ── */}
        <section className="py-40 px-6 max-w-7xl mx-auto space-y-[30vh]">
          
          {/* Intro Text */}
          <div className="we-reveal max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-[Canvas] text-4xl md:text-6xl leading-tight">
              Two paths converged in the <span className="text-[#c9a96e] italic">quiet rhythm</span> of heartbeats.
            </h2>
            <p className="font-serif text-lg md:text-2xl text-white/60 leading-relaxed italic">
              "A union not just of two people, but of two worlds finding a common orbit."
            </p>
          </div>

          {/* Sai's Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 we-parallax" data-speed="0.1">
              <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm group">
                <Image src={hero.couple2} fill className="object-cover   transition-all duration-1000 scale-105 group-hover:scale-100" alt="Sai" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>
            </div>
            <div className="md:col-span-5 we-reveal space-y-6 md:pl-10">
              <span className="font-mono text-[10px] text-[#c9a96e] tracking-widest uppercase block">01 — The Anchor</span>
              <h3 className="font-[Canvas] text-5xl md:text-6xl uppercase leading-none">A Calm <br/> Strength</h3>
              <p className="font-serif text-lg text-white/70 leading-relaxed">
                Sai Kiran defines the foundation. A presence that is felt rather than heard, providing the steady ground upon which this story is written.
              </p>
            </div>
          </div>

          {/* Bhumika's Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 we-reveal order-2 md:order-1 space-y-6 md:pr-10 text-right">
              <span className="font-mono text-[10px] text-[#c9a96e] tracking-widest uppercase block">02 — The Light</span>
              <h3 className="font-[Canvas] text-5xl md:text-6xl uppercase leading-none">A Radiant <br/> Soul</h3>
              <p className="font-serif text-lg text-white/70 leading-relaxed ml-auto">
                Bhumika captures the warmth. A spirit that reflects the golden hour, turning simple moments into memories that glow with intention.
              </p>
            </div>
            <div className="md:col-span-7 we-parallax order-1 md:order-2" data-speed="0.2">
              <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm group">
                <Image src={hero.bhumi} fill className="object-cover  transition-all duration-1000" alt="Bhumi" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
              </div>
            </div>
          </div>
        </section>


      </div>

      {/* ── GRAIN OVERLAY ── */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.04] bg-[url('https://res.cloudinary.com/dz8on7m9p/image/upload/v1645000000/noise_filter.png')]" />
    </div>
  );
}