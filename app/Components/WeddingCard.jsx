'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hero } from '@/public/assets/assets';
import TextY from './TextY';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WeddingCard = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const bgImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Cinematic Background Parallax (Zoom out on scroll)
      gsap.to(bgImageRef.current, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        }
      });

      // 2. Entrance Reveal for the Card
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        }
      });

      tl.from(cardRef.current, {
        y: 500,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
      })
        .from(".reveal-item", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
        }, "-=0.8");

      // 3. Staggered Itinerary Reveal
      gsap.from(".itinerary-item", {
        x: -20,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".itinerary-container",
          start: "top 70%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#fdfbf7]">

      {/* ─── PINNED BACKGROUND ─── */}
      <div className="relative h-[350vh] md:h-[300vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div ref={bgImageRef} className="relative h-full w-full scale-125 transition-transform duration-500">
            <Image
              src={hero.BhumiHero}
              alt="Wedding Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[10%]" />
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* ─── SCROLLING CONTENT ─── */}
        <div className="absolute top-0 right-0 w-full z-10 flex justify-end px-6 md:px-2 py-[5vh]">

          <div
            ref={cardRef}
            className="w-full md:w-[60%] bg-white/90 backdrop-blur-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] rounded-sm p-8 md:p-24 border border-white/40 mb-[2vh]"
          >

            {/* Header */}
            <div className="text-center mb-24 space-y-6">
              <span className="reveal-item font-mono text-[10px] uppercase tracking-[0.6em] text-[#b39359] block">
                Save The Date
              </span>
              <h1 className="reveal-item font-['Cormorant_Garamond'] text-6xl md:text-9xl text-stone-900 leading-[0.9] tracking-tighter">
                Sai Kiran <br className="md:hidden" />
                <span className="italic font-light">&</span> Bhumika
              </h1>
              <div className="reveal-item h-[1px] w-32 bg-[#b39359]/40 mx-auto mt-12" />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-['Cormorant_Garamond'] text-stone-800">
              <div className="reveal-item space-y-2">
                <h3 className="text-3xl italic border-b border-stone-200 pb-4">The Ceremony</h3>
                <div className="space-y-2">
                  <p className="text-xl font-medium uppercase tracking-tight">Friday, 20th Feb 2026</p>
                  <p className="text-lg italic text-stone-500">At 11.29'Clock in the Devine Hours</p>
                </div>
                <p className="text-sm font-serif italic tracking-tight leading-tight text-stone-600">
                  The Kothagudem Club <br />
                  Kothagudem, India
                </p>
              </div>

              <div className="reveal-item space-y-2">
                <h3 className="text-3xl font-[Canvas]  border-b border-stone-200 pb-4">The Celebration</h3>
                <div className="space-y-2">
                  <p className="text-xl font-medium uppercase tracking-tight">Cocktails & Dinner to follow</p>
                  <p className="text-lg italic text-stone-500">Black Tie Optional</p>
                </div>
                <button className="group relative mt-4 px-10 py-4 overflow-hidden border border-[#b39359] text-[#b39359] transition-all duration-500 hover:text-white">
                  <div className="absolute inset-0 bg-[#b39359] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 uppercase text-[11px] tracking-[0.4em]">Confirm RSVP</span>
                </button>
              </div>
            </div>

            {/* Visual Quote Section */}
            <div className="my-40 text-center px-4">
              <div className="w-px h-24 bg-[#b39359]/30 mx-auto mb-5" />
              <TextY>
                <p className="reveal-item font-['Cormorant_Garamond'] text-3xl md:text-5xl italic text-stone-700 max-w-2xl mx-auto leading-[0.9] font-light">
                  "In the garden of humanity, every love story is a  unique flower, and ours is finally in full bloom."
                </p>
              </TextY>

              <div className="w-px h-24 bg-[#b39359]/30 mx-auto mt-12" />
            </div>

            {/* Itinerary Section */}
            <div className="space-y-5 itinerary-container">
              <h2 className="reveal-item font-['Cormorant_Garamond'] text-[#b39359] text-5xl text-center font-light tracking-tight">The Itinerary</h2>

              <div className="space-y-5 max-w-xl mx-auto">
                {[
                  { time: '10:00 AM', event: 'The Haldi Ritual', desc: 'A splash of yellow and a lifetime of sunshine.' },
                  { time: '01:00 PM', event: 'The Mehndi Lunch', desc: 'Hennaed hands and heartfelt melodies.' },
                  { time: '07:00 PM', event: 'The Grand Wedding', desc: 'The exchange of vows under the starlit canopy.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-10 items-start group itinerary-item">
                    <span className="font-['Cormorant_Garamond'] text-xs text-[#b39359] pt-2 tabular-nums">{item.time}</span>
                    <div className="space-y-2">
                      <h4 className="text-xl md:text-3xl font-['Cormorant_Garamond'] text-[#b39359] group-hover:text-[#b39359]/80 transition-colors duration-500">{item.event}</h4>
                      <p className="text-stone-500 font-['Cormorant_Garamond'] text-sm md:text-lg leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credit Footer */}
            <div className="mt-48 pt-16 border-t border-stone-100 flex flex-col items-center reveal-item">
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-stone-400">
                Handcrafted with Love • 2026
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-[9px] uppercase tracking-widest text-stone-400">Gifted by</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#b39359]">Ruthwik</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingCard;