'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import { hero } from "@/public/assets/assets";

export default function CinematicGallery() {
  const containerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const itemsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Animation Refs
  const overlayRef = useRef(null);
  const detailContentRef = useRef(null);

  // Physics & Interaction Refs
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0, mouseX: null, mouseY: null });
  const dragging = useRef(false);
  const movementTotal = useRef(0); // Tracks if the user actually moved during a click

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    // ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const GALLERY_ITEMS = [
    { src: hero.bhumi, label: 'THE UNION', top: '12%', left: '8%', w: { desktop: '22vw', mobile: '55vw' }, z: 10, desc: "A celebration of coming together in perfect harmony." },
    { src: hero.bhumicouple, label: 'HAIG RD', top: '42%', left: '5%', w: { desktop: '26vw', mobile: '65vw' }, z: 20, desc: "The quiet moments captured on the historic streets of Haig Road." },
    { src: hero.BhumiHero, label: 'RADIANCE', top: '10%', left: '42%', w: { desktop: '20vw', mobile: '50vw' }, z: 15, desc: "Basking in the soft glow of the golden hour." },
    { src: hero.couple2, label: 'ETERNITY', top: '48%', left: '38%', w: { desktop: '24vw', mobile: '60vw' }, z: 25, desc: "A timeless gaze that speaks volumes of the journey ahead." },
    { src: hero.couple3, label: 'WHISPERS', top: '22%', left: '70%', w: { desktop: '22vw', mobile: '55vw' }, z: 10, desc: "Intimate conversations shared in the silence of the garden." },
    { src: hero.couple2, label: 'LLOYD', top: '60%', left: '68%', w: { desktop: '26vw', mobile: '65vw' }, z: 30, desc: "Modern elegance meets classic romance at the Lloyd estate." },
  ];

  const handleImageClick = (e, item) => {
    e.stopPropagation();
    // Only open if the user didn't move the mouse significantly (prevent click on drag)
    if (movementTotal.current > 5) return;

    setSelectedItem(item);
    gsap.set(overlayRef.current, { display: "flex" });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(detailContentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "expo.out" }
    );
  };

  const closeDetail = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setSelectedItem(null);
        gsap.set(overlayRef.current, { display: "none" });
      }
    });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    // Initial Entrance
    gsap.fromTo(".gallery-item",
      { y: 80, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.08, ease: "expo.out" }
    );

    const update = () => {
      const ease = dragging.current ? 0.12 : 0.05;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      const dx = current.current.x - last.current.x;
      const tilt = gsap.utils.clamp(-12, 12, dx * 0.5);

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
  }, []);

  const handleStart = (e) => {
    dragging.current = true;
    movementTotal.current = 0; // Reset movement counter
    const point = e.touches ? e.touches[0] : e;
    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;

    gsap.to([itemsRef.current, scrollContentRef.current], {
      scale: 0.96,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    const point = e.touches ? e.touches[0] : e;

    if (last.current.mouseX !== null) {
      const dx = point.clientX - last.current.mouseX;
      const dy = point.clientY - last.current.mouseY;

      movementTotal.current += Math.abs(dx) + Math.abs(dy); // Calculate distance moved
      target.current.x += dx * 0.85;
      target.current.y += dy * 0.85;
    }

    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;
  };

  const handleEnd = () => {
    dragging.current = false;
    gsap.to([itemsRef.current, scrollContentRef.current], {
      scale: 1,
      duration: 0.6,
      ease: "expo.out",
    });
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
      className="h-screen w-full overflow-hidden bg-[#faf7f2] cursor-grab active:cursor-grabbing select-none relative"
      style={{ perspective: "1200px" }}
    >
      {/* Background Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h2 className="text-[12vw] font-[Canvas] text-black whitespace-nowrap">
          SaiKiran & Bhumika
        </h2>
      </div>

      {/* Draggable Canvas */}
      <div
        ref={scrollContentRef}
        className={`relative flex items-center justify-center will-change-transform ${isMobile ? 'w-[250vw] h-[220vh]' : 'w-[160vw] h-[160vh]'
          }`}
      >
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            onClick={(e) => handleImageClick(e, item)}
            className="gallery-item absolute cursor-pointer group"
            style={{
              top: item.top,
              left: item.left,
              width: isMobile ? item.w.mobile : item.w.desktop,
              zIndex: item.z,
            }}
          >
            <div className="relative overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src={item.src}
                alt={item.label}
                className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-medium tracking-widest uppercase opacity-60">
              <span>00{i + 1}</span>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Detail Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] hidden bg-[#faf7f2]/98 backdrop-blur-sm items-center justify-center p-6 md:p-20 opacity-0"
      >


        {selectedItem && (
          <div ref={detailContentRef} className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 relative items-center">
            <button
              onClick={closeDetail}
              className="absolute top-10 right-10 uppercase tracking-[0.2em] text-[10px] border-b border-black pb-1 opacity-100 text-black transition-opacity"
            >
              Close [ESC]
            </button>
            <div className="relative aspect-[4/5] w-full shadow-2xl overflow-hidden">
              <Image
                src={selectedItem.src}
                alt={selectedItem.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-[10px] opacity-40 uppercase tracking-[0.3em]">Archive Collection / 2026</p>
              <h2 className="text-5xl md:text-8xl font-[Canvas] leading-none text-black lowercase">{selectedItem.label}</h2>
              <p className="text-sm md:text-base leading-relaxed text-black/70 max-w-md">
                {selectedItem.desc}
              </p>
              <div className="mt-4 flex gap-3 text-black">
                <span className="px-4 py-2 border border-black/10 text-[9px] rounded-full uppercase tracking-widest">Metadata: 400 ISO</span>
                <span className="px-4 py-2 border border-black/10 text-[9px] rounded-full uppercase tracking-widest">Format: Digital</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-10 pointer-events-none transition-opacity duration-500">
        <p className="text-[9px] tracking-[0.3em] uppercase opacity-30">
          {selectedItem ? "" : "Drag to traverse / Click to inspect"}
        </p>
      </div>
    </section>
  );
}