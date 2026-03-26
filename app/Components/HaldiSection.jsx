'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { hero } from '@/public/assets/assets';

export default function DraggableHaldiGallery() {
  const containerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const itemsRef = useRef([]);
  const blobRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect device
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ✅ Better positioning (LESS GAP + CLEAN)
  const HALDI_ITEMS = [
    { src: hero.bhumi, label: 'THE BLOSSOM', top: '12%', left: '8%', w: isMobile ? '60vw' : '15vw', z: 10, r: -4 },
    { src: hero.bhumicouple, label: 'PURE GOLD', top: '40%', left: '5%', w: isMobile ? '70vw' : '26vw', z: 20, r: 6 },
    { src: hero.couple2, label: 'TRADITION', top: '5%', left: '45%', w: isMobile ? '65vw' : '24vw', z: 15, r: -2 },
    { src: hero.couple3, label: 'KINETIC', top: '48%', left: '40%', w: isMobile ? '75vw' : '28vw', z: 30, r: 3 },
    { src: hero.BhumiHero, label: 'ETHEREAL', top: '25%', left: '70%', w: isMobile ? '60vw' : '20vw', z: 10, r: -5 },
    { src: hero.couple2, label: 'LAUGHTER', top: '65%', left: '68%', w: isMobile ? '70vw' : '25vw', z: 25, r: 2 },
  ];

  // Physics
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0, mouseX: null, mouseY: null });
  const dragging = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Entrance
      gsap.fromTo(".gallery-item",
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" }
      );

      // Blob
      gsap.to(blobRef.current, {
        duration: 8,
        attr: { d: "M44.7,-76.4C58.3,-69.2,70.1,-57.4,77.6,-43.3C85.2,-29.2,88.5,-12.7,86.4,3.2C84.3,19.1,76.8,34.4,66.2,46.1C55.6,57.8,42,65.9,28,71.1C14,76.3,-0.4,78.7,-14.9,76.5C-29.4,74.3,-44,67.6,-56.4,57.3C-68.8,47,-79.1,33.1,-83.4,17.7C-87.7,2.3,-86.1,-14.6,-79.4,-29.3C-72.7,-44,-60.9,-56.5,-47.2,-63.8Z" },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Physics loop
      const update = () => {
        const ease = dragging.current ? 0.12 : 0.05;

        current.current.x += (target.current.x - current.current.x) * ease;
        current.current.y += (target.current.y - current.current.y) * ease;

        const dx = current.current.x - last.current.x;
        const tilt = gsap.utils.clamp(-10, 10, dx * 0.4);

        if (scrollContentRef.current) {
          gsap.set(scrollContentRef.current, {
            x: current.current.x,
            y: current.current.y,
          });

          itemsRef.current.forEach((el) => {
            if (el) gsap.set(el, { rotationY: tilt, rotationX: -tilt * 0.2 });
          });
        }

        last.current.x = current.current.x;
        last.current.y = current.current.y;

        requestAnimationFrame(update);
      };

      const raf = requestAnimationFrame(update);
      return () => cancelAnimationFrame(raf);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ✅ GRAB EFFECT (MAIN FEATURE)
  const handleStart = () => {
    dragging.current = true;

    gsap.to(itemsRef.current, {
      scale: 0.92,
      duration: 0.25,
      ease: "power2.out",
    });

    gsap.to(scrollContentRef.current, {
      scale: 0.97,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleEnd = () => {
    dragging.current = false;

    gsap.to(itemsRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "expo.out",
    });

    gsap.to(scrollContentRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "expo.out",
    });

    last.current.mouseX = null;
    last.current.mouseY = null;
  };

  const handleMove = (e) => {
    if (!dragging.current) return;

    const point = e.touches ? e.touches[0] : e;

    if (last.current.mouseX !== null) {
      const dx = point.clientX - last.current.mouseX;
      const dy = point.clientY - last.current.mouseY;

      target.current.x += dx * 0.8;
      target.current.y += dy * 0.8;
    }

    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;
  };

  return (
    <section
      ref={containerRef}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseMove={handleMove}
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e);
      }}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchEnd={handleEnd}
      className="h-screen w-full overflow-hidden py-[12vh] bg-[#fdfbf7] h-[150vh] cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Background */}
      {/* 🎨 DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-[Canvas] text-[#c9a96e] whitespace-nowrap">
          HALDI MOMENTS
        </h2>
        <svg viewBox="0 0 200 200" className="w-[80%] h-[80%] fill-[#EAB308]">
          <path ref={blobRef} transform="translate(100 100)" d="M47.5,-76.1C59.6,-70.5,66.4,-53.4,72.4,-37.2C78.4,-21,83.5,-5.7,81.4,8.9C79.3,23.5,70,37.3,58.8,47.8C47.6,58.3,34.5,65.5,20.7,69.5C6.9,73.5,-7.6,74.3,-21.5,70.5C-35.4,66.7,-48.7,58.3,-58.5,47C-68.3,35.7,-74.6,21.5,-76.9,6.5C-79.2,-8.5,-77.5,-24.3,-69.8,-37.5C-62.1,-50.7,-48.3,-61.3,-34.5,-66.1C-20.7,-70.9,-6.9,-70,-1.1,-71.4C15.5,-69.5,31.1,-83.7,44.7,-76.4Z" />
        </svg>
      </div>
      <div className="absolute top-12 left-12 z-50">
        <p className="font-['PP_Neue_Montreal'] text-[12px] tracking-[0.3em] uppercase text-[#c9a96e] mb-2">The Golden Ceremony</p>
        <h3 className="text-4xl font-[Canvas] text-black">DRAG TO EXPLORE</h3>
      </div>


      {/* ✅ BIGGER MOBILE CANVAS */}
      <div
        ref={scrollContentRef}
        className={`relative flex items-center justify-center will-change-transform ${isMobile ? 'w-[220vw] h-[200vh]' : 'w-[140vw] h-[150vh]'
          }`}
      >
        {HALDI_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="gallery-item absolute group"
            style={{
              top: item.top,
              left: item.left,
              width: item.w,
              zIndex: item.z,
            }}
          >
            <div
              className="relative  transition-all duration-500 group-hover:shadow-2xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover grayscale-[0.2] transition-all duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 flex justify-between text-[10px]">
                <span className="uppercase text-black/40">{item.label}</span>
                <span className="italic text-[#c9a96e]">0{i + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}