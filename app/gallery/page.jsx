'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";
import { hero } from "@/public/assets/assets";
import TextY from "../Components/TextY";

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
    { src: hero.bhumi, label: 'THE UNION', top: '5%', left: '8%', w: { desktop: '22vw', mobile: '55vw' }, z: 10, ratio: '4/5', desc: "In a moment washed in turmeric and laughter, two worlds lean closer—soft glances, quiet smiles, and a promise that begins before words are ever spoken." },
    { src: hero.bhumicouple, label: 'HAIG RD', top: '42%', left: '5%', w: { desktop: '26vw', mobile: '65vw' }, z: 20, ratio: '4/5', desc: "Between fleeting footsteps and lingering looks, the streets hold their story—unplanned, unfiltered, and beautifully theirs." },
    { src: hero.BhumiHero, label: 'RADIANCE', top: '10%', left: '42%', w: { desktop: '40vw', mobile: '50vw' }, z: 15, ratio: '16/9', desc: "Golden light rests gently on her skin, as if the sun itself paused—just to witness her becoming." },
    { src: hero.couple2, label: 'ETERNITY', top: '48%', left: '30%', w: { desktop: '44vw', mobile: '60vw' }, z: 25, ratio: '16/9', desc: "A single gaze stretches beyond time—where everything fades, except the quiet certainty of forever." },
    { src: hero.couple3, label: 'WHISPERS', top: '22%', left: '70%', w: { desktop: '22vw', mobile: '55vw' }, z: 10, ratio: '4/5', desc: "Between laughter and silence, their words soften into something only they understand." },
    { src: hero.couple2, label: 'LLOYD', top: '60%', left: '68%', w: { desktop: '46vw', mobile: '65vw' }, z: 30, ratio: '16/9', desc: "Elegance lingers in every frame—where tradition meets presence, and every detail speaks without trying." },
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
      const ease = dragging.current
        ? (isMobile ? 0.25 : 0.12)
        : (isMobile ? 0.12 : 0.05);
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
      scale: isMobile ? 0.94 : 0.96,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleMove = (e) => {
    if (!dragging.current) return;

    const point = e.touches ? e.touches[0] : e;

    if (last.current.mouseX !== null) {
      const dx = point.clientX - last.current.mouseX;
      const dy = point.clientY - last.current.mouseY;

      movementTotal.current += Math.abs(dx) + Math.abs(dy);

      // 🔥 MUCH FASTER ON MOBILE
      const speed = isMobile ? 2.4 : 0.9;

      target.current.x += dx * speed;
      target.current.y += dy * speed;
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
      onTouchMove={(e) => {
        if (dragging.current) e.preventDefault();
        handleMove(e);
      }}
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
            <div
              className="relative overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ aspectRatio: item.ratio }}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
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
        className="fixed inset-0 z-[200] hidden bg-[#faf7f2]/50 backdrop-blur-sm items-center justify-center p-6 md:p-20 opacity-0"
      >


        {selectedItem && (
          <div ref={detailContentRef} className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 relative items-center">
            <button
              onClick={closeDetail}
              className="absolute md:top-10 top-5 right-1 md:right-10 uppercase tracking-[0.2em] text-[10px] border-b border-black pb-1 opacity-100 text-black transition-opacity"
            >
              Close [ESC]
            </button>
            <div
              className="relative overflow-hidden shadow-2xl w-[70%] "
              style={{ aspectRatio: selectedItem.ratio || "4/5" }}
            >
              <Image
                src={selectedItem.src}
                alt={selectedItem.label}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <p className="text-[10px] opacity-40 uppercase tracking-[0.3em]">Archive Collection / 2026</p>
              <h2 className="text-2xl md:text-8xl font-[Canvas] leading-tight text-black lowercase">{selectedItem.label}</h2>
              <TextY delay={0.4} animateOnScroll={false} >
                <p className="text-[13px] md:text-base leading-tight text-black/70 max-w-md">
                  {selectedItem.desc}
                </p>
              </TextY>
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