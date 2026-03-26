'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { hero } from '@/public/assets/assets';
import { RollingNumber } from './RollingNumber';
import InteractiveGallery from './InteractiveGallery';
import TextY from './TextY';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StorySection() {
  const mainRef = useRef(null);
  const bgRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── HERO: Entrance sequence ──────────────────────────────────────────
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .fromTo('.we-hero-rule',
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 1.2, ease: 'power4.inOut' }
        )
        .fromTo('.we-hero-eyebrow',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.8'
        )
        .fromTo('.we-title-name',
          { yPercent: 105 },
          { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.14 }, '-=0.6'
        )
        .fromTo('.we-hero-sub',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.7'
        )
        .fromTo('.we-scroll-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 0.7 }, '-=0.4'
        );

      // ── BACKGROUND: Progressive dim + parallax ───────────────────────────
      gsap.to(bgRef.current, {
        y: -300,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // ── IMAGE CLIP REVEALS (9:16 Tiles) ──────────────────────────────────
      // ── CENTER REVEAL ANIMATION ──────────────────────────────────────────
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)"
        },
        (context) => {
          const { isDesktop, isMobile } = context.conditions;

          gsap.utils.toArray('.we-image-reveal').forEach((container) => {
            const img = container.querySelector('img');

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: container,
                start: isDesktop ? 'top 85%' : 'top 95%', // 👈 different start points
                toggleActions: 'play none none reverse',
              }
            });

            tl.fromTo(
              container,
              {
                clipPath: 'inset(70% 70% 70% 70%)'
              },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.8,
                ease: 'expo.inOut'
              }
            ).fromTo(
              img,
              {
                scale: 1.5,
                filter: 'brightness(0.3) blur(10px)'
              },
              {
                scale: 1,
                filter: 'brightness(1) blur(0px)',
                duration: 2.2,
                ease: 'expo.out'
              },
              '<0.1'
            );
          });

          return () => {
            // cleanup (important in React / re-renders)
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          };
        }
      );

      // ── TEXT REVEALS ─────────────────────────────────────────────────────
      gsap.utils.toArray('.we-reveal-stagger').forEach((parent) => {
        const children = parent.querySelectorAll('.we-stagger-child');
        gsap.fromTo(children,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: parent,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // ── MISC: Horizontal Lines ──────────────────────────────────────────
      gsap.utils.toArray('.we-grow-line').forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: 'left' },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

    }, mainRef);
    // ── MULTI-LAYER PARALLAX IMAGES ───────────────────────────
    gsap.utils.toArray('.we-parallax').forEach((el) => {
      const speed = el.getAttribute('data-speed') || 100;

      gsap.to(el, {
        y: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap');

        :root {
          --gold: #c9a96e;
          --gold-dim: rgba(201,169,110,0.3);
          --white: #ffffff;
          --white-70: rgba(255,255,255,0.7);
        }

        .we-glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
        }

        .we-grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 99;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .we-portrait-tile {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          overflow: hidden;
          will-change: clip-path;
        }

        @keyframes ambient-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .we-float { animation: ambient-float 8s ease-in-out infinite; }

        .we-title-clip { overflow: hidden; }
      `}</style>

      <div className="we-grain" />

      <ReactLenis root options={{ lerp: 0.08 }}>
        <div ref={mainRef} className="bg-[#0a0a09] text-white relative overflow-hidden">


          {/* ── BACKGROUND LAYER ────────────────────────────────── */}
          <div className="fixed inset-0 z-0">

            <div ref={bgRef} className="relative w-full h-[140vh]">
              <div className="grid grid-cols-2 h-full w-full">
                <div className="relative w-full h-full">
                  <Image
                    src={hero.bhumicouple}
                    alt="Background Left"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover opacity-90 grayscale-[0.2]"
                  />
                  <div className='absolute top-1/2 px-[5vw] left-0'>
                    <h2 className="we-stagger-child font-[Canvas]  text-[1.1rem] md:text-6xl mb-1">A Calm Strength</h2>

                    <TextY>
                      <p className="we-stagger-child font-['Cormorant_Garamond'] text-white text-[0.8rem] md:text-xl leading-tight max-w-sm md:max-w-md">
                        Sai Kiran — a presence that defines stability. Like the earth beneath the roots, quiet and unyielding.
                      </p>
                    </TextY>
                  </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative w-full h-full">
                  <Image
                    src={hero.bhumi}
                    alt="Background Right"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover opacity-90 grayscale-[0.2]"
                  />
                  <div className='absolute top-1/2 px-[5vw] right-0'>
                    <h2 className="we-stagger-child font-light font-[Canvas]  text-[1.1rem] md:text-6xl mb-1">A Radiant Light</h2>
                    <TextY>
                      <p className="we-stagger-child font-['Cormorant_Garamond'] text-white/60 text-[0.8rem] md:text-xl leading-tight max-w-sm md:max-w-md">
                        Bhumika — a soul reflecting pure warmth. A light that illuminates the architecture of the heart.
                      </p>
                    </TextY>
                  </div>
                </div>

              </div>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
            </div>
          </div>

          {/* ── CONTENT LAYER ──────────────────────────────────── */}
          <div className="relative z-1">

            {/* SECTION 1: HERO */}
            <section className=" py-[10vh] h-screen  flex flex-col items-center z-10 justify-center px-[8vw] relative">
              <div className="absolute top-[8vh] left-[8vw] right-[8vw] flex items-center gap-6">
                <div className="we-hero-rule h-[1px] w-12 bg-[var(--gold)]" />
                <p className="we-hero-eyebrow font-['Montserrat'] font-extralight text-[0.6rem] tracking-[0.5em] uppercase text-[var(--gold)]">
                  A Cinematic Preserved Memory · 2026
                </p>
              </div>

              <div className="text-left">
                <div className="we-title-clip">
                  <h1 className="we-title-name font-[Canvas] md:text-[6rem] md:text-left text-[12vw] leading-[0.9] tracking-tighter">Sai Kiran</h1>
                </div>
                <div className="we-title-clip">
                  <h1 className="we-title-name font-[Canvas] italic font-light md:text-[6rem] md:text-left text-[9vw] text-[var(--gold)] leading-[0.98]">& Bhumika</h1>
                </div>
              </div>

              <div className="we-hero-sub mt-10 flex items-center gap-6 opacity-0">
                <div className="h-[1px] w-8 bg-white/20" />
                <p className="font-['Montserrat'] font-extralight text-[0.55rem] tracking-[0.4em] uppercase text-white/50">
                  Hyderabad · The Beginning of Always
                </p>
                <div className="h-[1px] w-8 bg-white/20" />
              </div>
            </section>

            {/* SECTION 2: THE EDITORIAL GRID */}
            <section className="py-[2vh] px-[10vw] relative">
              <div className='absolute inset-0 z-10 '>
                <InteractiveGallery />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-[10vw] items-center">

                {/* Left Column */}
                <div className="space-y-[5vh] relative">
                  {/* 9:16 Portrait Image */}
                  <div className="we-image-reveal we-portrait-tile we-float w-4/5 ml-auto">
                    <Image src={hero.couple2} alt="Portrait" fill className="object-cover object-[30%_center]" />
                  </div>
                </div>

                {/* Right Column (Staggered Down) */}
                <div className="md:space-y-[5vh] md:mt-[30vh]">
                  {/* 9:16 Portrait Image */}
                  <div className="we-image-reveal we-portrait-tile we-float w-4/5">
                    <Image src={hero.bhumi} alt="Portrait" fill className="object-cover w-full h-full" />
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 3: DATE & DETAILS */}
            <section className="min-h-screen flex flex-col justify-center px-[10vw] py-20">
              <div className="we-reveal-stagger mb-16">
                <p className="we-stagger-child text-[var(--gold)] text-[1.01rem]  mb-4">New Chapter Begin Date</p>
                <div className="we-grow-line h-[1px] w-full bg-[var(--gold-dim)] mb-1" />

                <div className="flex flex-col items-baseline gap-8 md:gap-1">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif font-light text-6xl md:text-[6rem] leading-none"><RollingNumber value={12} /></span>
                    <span className="font-serif italic text-4xl text-[var(--gold)] opacity-40">/</span>
                    <span className="font-serif text-6xl md:text-[6rem] leading-none"><RollingNumber value={2} delay={0.2} /></span>
                    <span className="font-serif italic text-4xl text-[var(--gold)] opacity-40">/</span>
                    <span className="font-serif text-6xl md:text-[6rem] leading-tight"><RollingNumber value={26} delay={0.4} /></span>
                  </div>

                  <div className="border-l border-[var(--gold-dim)] pl-8">
                    <p className="font-['Montserrat'] text-[0.55rem] tracking-[0.3em] uppercase text-white/40 mb-2">Location</p>
                    <p className="font-[Canvas] italic text-2xl md:text-4xl text-white/80">Hyderabad,Telangana</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: QUOTE CARD */}
            <section className="min-h-screen flex items-start justify-start px-[10vw]">
              <div className="we-image-reveal we-glass p-12 md:p-24 max-w-4xl w-full relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--gold)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <span className="font-sans absolute inset-0 text-[40rem] text-[var(--gold)] leading-none opacity-20 block mb-[-2rem]">“</span>
                <p className="font-[Canvas] tracking-tight text-xl md:text-5xl text-white/90 leading-tight mb-12 relative z-10">
                  In your light, I learn how to love. In your beauty, how to make poems.
                </p>

              </div>
            </section>

          </div>
        </div>
      </ReactLenis>
    </>
  );
}