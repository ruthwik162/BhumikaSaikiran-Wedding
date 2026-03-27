'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import { hero } from '@/public/assets/assets';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollIndicator = () => {
  const [progress, setProgress] = useState(0);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);

  // You can rotate these images based on the scroll percentage if you want!
  const indicatorImage = hero.couple3; 

  useEffect(() => {
    const tl = gsap.to({}, {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          // Update the numeric progress and thumb position
          const p = Math.round(self.progress * 100);
          setProgress(p);
          
          gsap.to(thumbRef.current, {
            y: self.progress * (trackRef.current.offsetHeight - 48), // 48 is thumb height
            duration: 0.1,
            ease: "none"
          });
        }
      }
    });

    return () => tl.kill();
  }, []);

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[300] flex flex-col items-center justify-center gap-4 group">
      
      {/* Percentage Indicator */}
      <span className="font-mono text-[9px] text-[#c9a96e] tracking-widest tabular-nums vertical-text">
        {progress}%
      </span>

      {/* Track */}
      <div 
        ref={trackRef}
        className="relative w-[1px] h-[30vh] bg-black/10 dark:bg-white/10"
      >
        {/* Animated Thumb */}
        <div 
          ref={thumbRef}
          className="absolute inset-0  flex items-center justify-center w-12 h-16 md:w-16 md:h-20 bg-white shadow-2xl overflow-hidden border border-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-[0.83,0,0.17,1]"
        >
          <div className="relative w-full h-full">
            <Image 
              src={indicatorImage} 
              alt="Scroll Progress" 
              fill 
              className="object-cover grayscale"
            />
            {/* Subtle overlay for legibility */}
            <div className="absolute inset-0 bg-[#c9a96e]/10 mix-blend-multiply" />
          </div>
        </div>

        {/* Active Progress Line */}
        <div 
          className="absolute top-0 left-0 w-full bg-[#c9a96e]"
          style={{ height: `${progress}%` }}
        />
      </div>

      {/* Label */}
      <span className="font-mono text-[7px] uppercase tracking-[0.4em] opacity-30 vertical-text">
        Scroll
      </span>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default ScrollIndicator;