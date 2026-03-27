'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { CustomEase } from 'gsap/dist/CustomEase';
import { hero } from '@/public/assets/assets';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("cubic", "0.83, 0, 0.17, 1");
}

const MetaLabel = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-[#c9a96e] font-bold">/ {label}</span>
    <span className="text-[10px] md:text-[11px] uppercase tracking-widest font-light text-black/70">{value}</span>
  </div>
);

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set('.hero-img', { clipPath: 'inset(80% 80% 80% 80%)' });

      tl.to('.reveal-panel', { yPercent: -100, duration: 1.4, ease: "cubic", stagger: 0.04 })
        .to('.hero-img', { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: "cubic", stagger: 0.1 }, "-=1")
        .from('.hero-chars', { yPercent: 110, duration: 1.2, ease: "cubic", stagger: 0.03 }, "-=1.4")
        .from('.ui-fade', { opacity: 0, y: 15, duration: 1, stagger: 0.08, ease: "power3.out" }, "-=0.8");

      gsap.utils.toArray('.parallax').forEach((el) => {
        const speed = el.dataset.speed || 0.1;
        gsap.to(el, {
          y: (i, target) => -200 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, containerRef);

    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  return (
    <main ref={containerRef} className="relative w-full z-10 bg-[#f0eee9] text-black selection:bg-[#c9a96e] selection:text-white overflow-hidden font-sans">

      {/* Cinematic Reveal Panels */}
      <div className="fixed inset-0 z-[100] flex pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="reveal-panel w-full h-full bg-black border-r border-white/5" />
        ))}
      </div>

      <section className="relative min-h-[100vh] px-6 md:px-12">


        {/* FLOATING PHILOSOPHY TEXT (Mobile-First Empty Spaces) */}
        <div className="ui-fade absolute top-[35%] left-6 md:left-20 bg-white/10 backdrop-blur-2xl p-5 z-30 max-w-[180px] md:max-w-[240px]">
          <p className="text-[10px] md:text-[11px]  leading-tight tracking-tight  ">
            Every frame reflects emotion, culture, and identity
            shaped into a digital memory.
          </p>
          <div className="mt-4 h-[1px] w-8 bg-[#c9a96e]" />
        </div>

        <div className="ui-fade absolute top-[65%] right-6 md:right-20 bg-white/10 backdrop-blur-2xl p-5 z-30 max-w-[180px] md:max-w-[240px] text-right">
          <p className="text-[10px] md:text-[11px]  leading-relaxed tracking-tight ">
            Designed with motion, depth, and minimal elegance
            for a premium visual experience.
          </p>
          <div className="mt-4 h-[1px] w-8 bg-[#c9a96e] ml-auto" />
        </div>

        {/* MAIN TITLE - Mix Blend Difference for Cinematic Depth */}
        <div className="absolute top-[8%] right-0 w-full z-40 pointer-events-none mix-blend-difference invert">
          <h1 className="flex flex-col items-end md:mr-[5%] ml-[10%]">
            <span className="block overflow-hidden pb-2">
              <span className="hero-chars inline-block text-[15vw] md:text-[5vw] font-light font-[Canvas] leading-[0.95] tracking-tighter uppercase">Saikiran</span>
            </span>
            <span className="block overflow-hidden md:-mt-4" >
              <span className="hero-chars inline-block text-[13vw] md:text-[5vw] uppercase font-[Canvas] text-[#c9a96e] leading-[0.9] tracking-tighter">& Bhumika</span>
            </span>
          </h1>
        </div>

        <div className="absolute bottom-[2%] right-0 w-full z-50 pointer-events-none mix-blend-difference invert">
          <h1 className="flex flex-col items-start md:ml-[5%] ml-[10%]">
            <span className="block overflow-hidden pb-2 max-w-xs">
              <span className="hero-chars inline-block text-[10vw] [word-spacing:15px] md:text-[4vw]  font-light font-[Canvas] leading-[0.95] tracking-tighter uppercase"><span className='inline-block lowercase'>A</span> Love <span className='inline-block lowercase'>Story</span></span>
            </span>
            <span className="block overflow-hidden py-1 max-w-sm">
              <span className="hero-chars inline-block text-[7vw] md:text-[4vw]  font-[Canvas] text-[#c9a96e] leading-[0.85] tracking-tighter">Beautifully Preserved Forever</span>
            </span>
          </h1>
        </div>

        {/* ASYMMETRIC IMAGE COMPOSITION */}
        <div className="relative pt-[30vh] md:pt-[10vh] max-w-[1400px] mx-auto grid grid-cols-12 gap-4">

          {/* Main Portrait - Offset Center */}
          <div className="parallax hero-img col-span-10 col-start-2 md:col-span-5 md:col-start-4 aspect-[4/5] relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]" data-speed="0.1">
            <Image src={hero.couple3} alt="Main Portrait" fill className="object-cover scale-105" priority />
          </div>

          {/* Foreground Portrait - Heavy Parallax */}
          <div className="parallax hero-img col-span-6 col-start-6 md:col-span-3 md:col-start-9 -mt-[15%] md:mt-[20%] aspect-[9/16] relative z-20 overflow-hidden" data-speed="0.3">
            <Image src={hero.BhumiHero} alt="Atmosphere" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

        </div>

        {/* VERTICAL COORDINATE TEXT */}
        <div className="ui-fade absolute left-4 bottom-[20%] hidden md:block rotate-180 [writing-mode:vertical-lr]">
          <span className="text-[9px] uppercase tracking-[0.8em] opacity-20 font-bold">17.3850° N, 78.4867° E</span>
        </div>

      </section>

      {/* Aesthetic Grain & Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.04] bg-[url('https://res.cloudinary.com/dz8on7m9p/image/upload/v1645000000/noise_filter.png')]" />
    </main>
  );
}