'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { hero } from '@/public/assets/assets';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Cinematic Zoom-Out Effect
      // The image starts large and "scales down" into a frame
      gsap.fromTo(imageWrapperRef.current,
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.2 },
        {
          clipPath: 'inset(10% 10% 10% 10%)',
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: true, // Keeps the hero stuck while animating
          }
        }
      );

      // 2. Text Parallax (Opposite directions)
      gsap.to(title1Ref.current, {
        x: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to(title2Ref.current, {
        x: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to(title3Ref.current, {
        x: 500,
        ease: 'none',
        delay: 0.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top -10%',
          end: 'bottom top',
          scrub: true,
        }
      });

      // 3. Entrance Reveal
      gsap.from([title1Ref.current, title2Ref.current], {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.2,
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis root>
      <main ref={containerRef} className="relative z-20 w-full h-screen bg-[#f0eee9] overflow-hidden">

        {/* IMAGE WRAPPER - The "Movie Frame" */}
        <div
          ref={imageWrapperRef}
          className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
        >
          <Image
            src={hero.BhumiHero}
            alt="Sai Kiran & Bhumika"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>

        {/* OVERLAY CONTENT */}
        <div className="relative z-10 h-full w-full flex font-[Canvas]  flex-col justify-center px-6 md:px-20">
          <div className="grid grid-cols-12 gap-4 w-full">

            {/* Main Title */}
            <div ref={title1Ref} className="col-span-12 md:col-span-12">
              <h1 className="text-[12vw] md:text-[12vw] font-[Canvas] uppercase  text-white leading-none tracking-tighter">
                A Love <span className="font-medium font-[Canvas]  text-[#c9a96e]">Story</span>
              </h1>
            </div>

            {/* Sub Title */}
            <div ref={title2Ref} className="col-span-12 md:col-start-6 md:col-span-7 mt-[-2vw]">
              <h2 className="text-[6vw] md:text-[4.5vw] font-cormorant italic text-[#e8d5a3] leading-[0.8] text-right md:text-left">
                Beautifully Preserved 
              </h2>
            </div>
            <div ref={title3Ref} className="col-span-12 md:col-start-6 md:col-span-7 mt-[-2vw]">
              <h2 className="text-[6vw] md:text-[4.5vw] font-cormorant italic text-[#e8d5a3] leading-[0.8] text-right md:text-left">
                Forever
              </h2>
            </div>

          </div>
          <div className="col-span-12  md:col-span-9 ">
            <p className="text-white/60 text-sm leading-tight max-w-[200px] font-cormorant ">
              “Some moments deserve more than memory.
              They deserve to be felt again.”
            </p>
          </div>

        </div>

        {/* BOTTOM DECOR */}
        <div className="absolute bottom-10 left-10 z-20 hidden md:block">
          <p className="text-[#c9a96e] font-montserrat tracking-[0.4em] text-[0.6rem] uppercase">
            Sai Kiran × Bhumika Munagala // 2026
          </p>
        </div>

        {/* FILM NOISE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-[15] opacity-[0.03] bg-[url('https://res.cloudinary.com/dz8on7m9p/image/upload/v1645000000/noise_filter.png')]" />

      </main>

      {/* Spacer to allow scrolling and see the GSAP magic */}
    </ReactLenis>
  );
}