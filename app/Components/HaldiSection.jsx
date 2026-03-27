'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { hero } from '@/public/assets/assets';
import { CustomEase } from 'gsap/CustomEase';

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

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

  // ✅ HOPE EASE
  useEffect(() => {
    CustomEase.create(
      "hope",
      "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );
  }, []);

  // Layout
  const HALDI_ITEMS = [
    { src: hero.bhumi, label: 'THE BLOSSOM', top: '12%', left: '8%', w: isMobile ? '60vw' : '15vw', z: 10 },
    { src: hero.bhumicouple, label: 'PURE GOLD', top: '40%', left: '5%', w: isMobile ? '70vw' : '26vw', z: 20 },
    { src: hero.couple2, label: 'TRADITION', top: '5%', left: '45%', w: isMobile ? '65vw' : '24vw', z: 15 },
    { src: hero.couple3, label: 'KINETIC', top: '48%', left: '40%', w: isMobile ? '75vw' : '28vw', z: 30 },
    { src: hero.BhumiHero, label: 'ETHEREAL', top: '25%', left: '70%', w: isMobile ? '60vw' : '20vw', z: 10 },
    { src: hero.couple2, label: 'LAUGHTER', top: '65%', left: '68%', w: isMobile ? '70vw' : '25vw', z: 25 },
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

      // Blob animation
      gsap.to(blobRef.current, {
        duration: 8,
        attr: {
          d: "M44.7,-76.4C58.3,-69.2,70.1,-57.4,77.6,-43.3C85.2,-29.2,88.5,-12.7,86.4,3.2C84.3,19.1,76.8,34.4,66.2,46.1C55.6,57.8,42,65.9,28,71.1C14,76.3,-0.4,78.7,-14.9,76.5C-29.4,74.3,-44,67.6,-56.4,57.3C-68.8,47,-79.1,33.1,-83.4,17.7C-87.7,2.3,-86.1,-14.6,-79.4,-29.3C-72.7,-44,-60.9,-56.5,-47.2,-63.8Z"
        },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 🔥 SMOOTH PHYSICS LOOP
      const update = () => {
        const ease = dragging.current
          ? (isMobile ? 0.22 : 0.12)
          : (isMobile ? 0.12 : 0.05);

        current.current.x += (target.current.x - current.current.x) * ease;
        current.current.y += (target.current.y - current.current.y) * ease;

        const dx = current.current.x - last.current.x;
        const tilt = gsap.utils.clamp(-12, 12, dx * 0.6);

        if (scrollContentRef.current) {
          gsap.set(scrollContentRef.current, {
            x: current.current.x,
            y: current.current.y,
          });

          itemsRef.current.forEach((el) => {
            if (el) {
              gsap.set(el, {
                rotationY: tilt,
                rotationX: -tilt * 0.3,
              });
            }
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
  }, [isMobile]);

  // Grab start
  const handleStart = () => {
    dragging.current = true;

    gsap.to(itemsRef.current, {
      scale: 0.92,
      duration: 0.25,
      ease: "hope",
    });

    gsap.to(scrollContentRef.current, {
      scale: 0.96,
      duration: 0.25,
      ease: "hope",
    });
  };

  // Grab end
  const handleEnd = () => {
    dragging.current = false;

    gsap.to(itemsRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "hope",
    });

    gsap.to(scrollContentRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "hope",
    });

    last.current.mouseX = null;
    last.current.mouseY = null;
  };

  // 🔥 FAST MOBILE DRAG
  const handleMove = (e) => {
    if (!dragging.current) return;

    const point = e.touches ? e.touches[0] : e;

    if (last.current.mouseX !== null) {
      const dx = point.clientX - last.current.mouseX;
      const dy = point.clientY - last.current.mouseY;

      const speed = isMobile ? 2.2 : 0.8;

      target.current.x += dx * speed;
      target.current.y += dy * speed;
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
      className="w-full overflow-hidden py-[12vh] bg-[#fdfbf7] h-[130vh] cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1200px" }}
    >

      {/* Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-[Canvas] text-[#c9a96e] whitespace-nowrap">
          HALDI MOMENTS
        </h2>
        <svg viewBox="0 0 200 200" className="w-[80%] h-[80%] fill-[#EAB308]">
          <path ref={blobRef} transform="translate(100 100)" />
        </svg>
      </div>

      <div className='absolute top-10 left-10 '>
        <h1 className='font-[Canvas] xl:text-[4vw] text-[6.5vw] text-black font-light'>Drag to View Images</h1>
      </div>

      {/* Canvas */}
      <div
        ref={scrollContentRef}
        className={`relative will-change-transform ${
          isMobile ? 'w-[220vw] h-[200vh]' : 'w-[140vw] h-[150vh]'
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
            <div className="relative">
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