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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    CustomEase.create("boutique", "M0,0 C0.165,0.84 0.44,1 1,1");
    return () => window.removeEventListener('resize', check);
  }, []);

  const HALDI_ITEMS = [
    { src: hero.bhumi, label: 'THE BLOSSOM', top: '15%', left: '10%', w: isMobile ? '55vw' : '18vw', z: 10 },
    { src: hero.bhumicouple, label: 'PURE GOLD', top: '45%', left: '5%', w: isMobile ? '65vw' : '28vw', z: 40 },
    { src: hero.couple2, label: 'TRADITION', top: '8%', left: '48%', w: isMobile ? '60vw' : '22vw', z: 20 },
    { src: hero.couple3, label: 'KINETIC', top: '52%', left: '42%', w: isMobile ? '70vw' : '26vw', z: 50 },
    { src: hero.BhumiHero, label: 'ETHEREAL', top: '28%', left: '72%', w: isMobile ? '55vw' : '19vw', z: 15 },
    { src: hero.couple2, label: 'LAUGHTER', top: '68%', left: '70%', w: isMobile ? '65vw' : '24vw', z: 30 },
  ];

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0, mouseX: null, mouseY: null });
  const dragging = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. CINEMATIC ENTRANCE
      gsap.from(".gallery-item", {
        scale: 1.1,
        opacity: 0,
        y: 100,
        rotateY: 25,
        duration: 2,
        stagger: 0.1,
        ease: "expo.out"
      });

      // 2. FLOATING AMBIENCE
      gsap.to(itemsRef.current, {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 3. PHYSICS ENGINE LOOP
      const update = () => {
        const lerpFactor = dragging.current ? 0.15 : 0.06;
        
        current.current.x += (target.current.x - current.current.x) * lerpFactor;
        current.current.y += (target.current.y - current.current.y) * lerpFactor;

        const velocity = current.current.x - last.current.x;
        const tilt = gsap.utils.clamp(-15, 15, velocity * 0.8);

        if (scrollContentRef.current) {
          gsap.set(scrollContentRef.current, {
            x: current.current.x,
            y: current.current.y,
          });

          itemsRef.current.forEach((el) => {
            if (el) {
              gsap.set(el, {
                rotationY: tilt,
                skewX: tilt * 0.1,
                force3D: true
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

  const handleStart = (e) => {
    dragging.current = true;
    const point = e.touches ? e.touches[0] : e;
    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;

    gsap.to(scrollContentRef.current, { scale: 0.98, duration: 0.6, ease: "boutique" });
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    const point = e.touches ? e.touches[0] : e;

    const dx = point.clientX - last.current.mouseX;
    const dy = point.clientY - last.current.mouseY;

    // Faster interaction for high-end feel
    const multiplier = isMobile ? 1.8 : 1.2;
    target.current.x += dx * multiplier;
    target.current.y += dy * multiplier;

    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;
  };

  const handleEnd = () => {
    dragging.current = false;
    gsap.to(scrollContentRef.current, { scale: 1, duration: 0.8, ease: "expo.out" });
  };

  return (
    <section
      ref={containerRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={(e) => { e.preventDefault(); handleMove(e); }}
      onTouchEnd={handleEnd}
      className="relative w-full overflow-hidden bg-[#f0eee9] h-[120vh] cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
      style={{ perspective: "1500px" }}
    >
      {/* Background Decorative Type */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <h2 className="text-[25vw] font-[Canvas] text-white whitespace-nowrap leading-none">
          HALDI 2026
        </h2>
      </div>

      {/* Narrative Label */}
      <div className="absolute top-12 left-10 z-50 pointer-events-none">
        <span className="text-[10px] tracking-[0.8em] text-[#c9a96e] uppercase block mb-2 opacity-50">Experimental Gallery</span>
        <h1 className="font-[Canvas] text-3xl md:text-5xl text-white font-light tracking-tighter">
          The <span className="italic text-[#c9a96e]">Golden</span> Ritual
        </h1>
      </div>

      {/* Canvas */}
      <div
        ref={scrollContentRef}
        className={`relative will-change-transform ${isMobile ? 'w-[200vw] h-[150vh]' : 'w-[120vw] h-[120vh]'}`}
      >
        {HALDI_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="gallery-item absolute group"
            style={{ top: item.top, left: item.left, width: item.w, zIndex: item.z }}
          >
            <div className="relative p-2 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="mt-4 flex justify-between items-center px-1">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/40">{item.label}</span>
                <span className="font-serif italic text-[#c9a96e] text-xs">0{i + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grain Overlay (Inherited from Hero) */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://res.cloudinary.com/dz8on7m9p/image/upload/v1645000000/noise_filter.png')]" />
    </section>
  );
}