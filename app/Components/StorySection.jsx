'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { hero } from '@/public/assets/assets';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
}

const galleryImages = [
  { src: hero.bhumicouple, size: { mobile: 'w-[35vw]', desktop: 'w-[12vw]' }, pos: { mobile: '-top-[70vw] left-[10%]', desktop: 'top-[5%] left-[8%]' }, speed: 0.01, scrollSpeed: -600, label: 'THE BEGINNING' },
  { src: hero.couple2, size: { mobile: 'w-[38vw]', desktop: 'w-[15vw]' }, pos: { mobile: 'top-[-50vw] right-[5%]', desktop: 'top-[5%] right-[5%]' }, speed: 0.03, scrollSpeed: -300, label: 'GOLDEN RADIANCE' },
  { src: hero.couple3, size: { mobile: 'w-[30vw]', desktop: 'w-[22vw]' }, pos: { mobile: 'top-[15%] left-[5%]', desktop: 'top-[55%] left-[40%]' }, speed: 0.02, scrollSpeed: -450, label: 'LAUGHTER & LIGHT' },
  { src: hero.bhumi, size: { mobile: 'w-[40vw]', desktop: 'w-[12vw]' }, pos: { mobile: 'top-[50%] right-[10%]', desktop: 'top-[85%] right-[12%]' }, speed: 0.05, scrollSpeed: -200, label: 'SOFT WHISPERS' },
  { src: hero.BhumiHero, size: { mobile: 'w-[41vw]', desktop: 'w-[14vw]' }, pos: { mobile: 'bottom-[-50vw] left-[5%]', desktop: 'top-[115%] left-[5%]' }, speed: 0.02, scrollSpeed: -400, label: 'ETERNAL PROMISE' },
  { src: hero.couple2, size: { mobile: 'w-[50vw]', desktop: 'w-[12vw]' }, pos: { mobile: 'top-[110%] right-[10%]', desktop: 'top-[145%] right-[20%]' }, speed: 0.04, scrollSpeed: -150, label: 'THE UNION' },
];

export default function StorySection() {
  const mainRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryItems = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const ctx = gsap.context(() => {
      CustomEase.create("hope", "M0,0 C0.071,0.505 0.192, 0.726 0.318, 0.852 0.45, 0.984 0.504, 1 1,1");

      // 1. HERO ENTRANCE
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(".we-title-name", { yPercent: 110, stagger: 0.1, duration: 1.5, ease: "expo.out" })
        .from(".we-hero-meta", { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, "-=1");

      // 2. PARALLAX & GALLERY LOGIC
      const validItems = galleryItems.current.filter(Boolean);
      
      validItems.forEach((el, i) => {
        // Entrance Reveal
        gsap.fromTo(el, 
          { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.5, ease: "hope", scrollTrigger: { trigger: el, start: "top 95%" } }
        );

        // Individual Parallax
        gsap.to(el, {
          y: isMobile ? galleryImages[i].scrollSpeed * 0.4 : galleryImages[i].scrollSpeed,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: isMobile ? 0.6 : true,
          }
        });
      });

      // 3. MOUSE FOLLOW (Desktop Only)
      if (!isMobile) {
        const handleMouseMove = (e) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth) - 0.5;
          const yPos = (clientY / window.innerHeight) - 0.5;
          validItems.forEach((el, i) => {
            gsap.to(el, { x: xPos * (galleryImages[i].speed * 600), y: `+=${yPos * 100}`, duration: 2, ease: "power2.out" });
          });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
      }

      // 4. UNIVERSAL REVEALS
      gsap.utils.toArray('.we-reveal').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 40, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });

      // 5. NARRATIVE PARALLAX
      gsap.utils.toArray('.we-parallax').forEach((el) => {
        gsap.to(el, { y: -60, ease: "none", scrollTrigger: { trigger: el, scrub: isMobile ? 0.5 : true } });
      });

    }, mainRef);

    return () => {
      window.removeEventListener('resize', checkMobile);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <div ref={mainRef} className="relative bg-[#0a0a09] text-white selection:bg-[#c9a96e] overflow-x-hidden transform-gpu">
      
      {/* ── BACKGROUND LAYER (Performance Optimized) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu" style={{ willChange: 'transform' }}>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="grid grid-cols-2 h-full w-full opacity-30 grayscale">
          <div className="relative h-full border-r border-white/5">
            <Image src={hero.bhumicouple} fill className="object-cover" alt="S" priority quality={50} />
          </div>
          <div className="relative h-full">
            <Image src={hero.bhumi} fill className="object-cover" alt="B" priority quality={50} />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* HERO */}
        <section className="h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="we-hero-meta mb-6 transform-gpu">
            <span className="text-[9px] tracking-[0.8em] text-[#c9a96e] uppercase block">A Cinematic Preservation · 2026</span>
          </div>
          <div className="overflow-hidden py-1"><h1 className="we-title-name font-[Canvas] text-[15vw] md:text-[9vw] leading-none uppercase">Sai Kiran</h1></div>
          <div className="overflow-hidden py-1"><h1 className="we-title-name font-[Canvas] italic text-[12vw] md:text-[7vw] text-[#c9a96e] leading-none">& Bhumika</h1></div>
          <div className="we-hero-meta mt-12 flex flex-col items-center gap-4">
            <p className="font-serif italic text-white/40 text-sm">The Architecture of a Shared Soul</p>
            <div className="w-px h-16 bg-gradient-to-b from-[#c9a96e] to-transparent" />
          </div>
        </section>

        {/* EXHIBIT */}
        <section ref={galleryRef} className="relative h-[120vh] md:h-screen">
          <div className="absolute inset-0 pointer-events-none z-20">
            {galleryImages.map((img, idx) => (
              <div key={idx} ref={el => galleryItems.current[idx] = el}
                className={`absolute pointer-events-auto group ${isMobile ? img.pos.mobile : img.pos.desktop} ${isMobile ? img.size.mobile : img.size.desktop}`}>
                <div className="bg-white p-[6px] shadow-2xl transform-gpu">
                  <div className={`relative overflow-hidden bg-[#e0d9cd] ${idx % 2 === 0 ? 'aspect-[4/5]' : 'aspect-[9/16]'}`}>
                    <Image src={img.src} alt={img.label} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[#c9a96e]/10 mix-blend-color-burn" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NARRATIVE */}
        <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto space-y-[20vh] md:space-y-[30vh]">
          <div className="we-reveal max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-[Canvas] text-3xl md:text-6xl leading-tight">Two paths converged in the <span className="text-[#c9a96e] italic">quiet rhythm</span>.</h2>
            <p className="font-serif text-lg text-white/60 italic">"A union of two worlds finding a common orbit."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 we-parallax transform-gpu">
              <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-sm">
                <Image src={hero.couple2} fill className="object-cover" alt="S" quality={75} />
              </div>
            </div>
            <div className="md:col-span-5 we-reveal space-y-6 md:pl-10">
              <span className="font-mono text-[9px] text-[#c9a96e] tracking-widest uppercase">01 — The Anchor</span>
              <h3 className="font-[Canvas] text-5xl uppercase leading-none">A Calm Strength</h3>
              <p className="font-serif text-white/70">Sai Kiran defines the foundation upon which this story is written.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 we-reveal order-2 md:order-1 text-right space-y-6 md:pr-10">
              <span className="font-mono text-[9px] text-[#c9a96e] tracking-widest uppercase">02 — The Light</span>
              <h3 className="font-[Canvas] text-5xl uppercase leading-none">A Radiant Soul</h3>
              <p className="font-serif text-white/70">Bhumika captures the warmth, turning simple moments into golden memories.</p>
            </div>
            <div className="md:col-span-4 we-parallax order-1 md:order-2 transform-gpu">
              <div className="relative aspect-[4/5] md:aspect-[9/16] overflow-hidden rounded-sm">
                <Image src={hero.bhumi} fill className="object-cover" alt="B" quality={75} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── GRAIN (Subtle CSS Version) ── */}
      <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.02] mix-blend-overlay bg-repeat bg-[url('https://res.cloudinary.com/dz8on7m9p/image/upload/v1645000000/noise_filter.png')]" />
    </div>
  );
}