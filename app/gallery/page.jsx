'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import Image from "next/image";
import { hero } from "@/public/assets/assets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  CustomEase.create("boutique", "0.83, 0, 0.17, 1");
}

export default function CinematicGallery() {
  const containerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const itemsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const overlayRef = useRef(null);
  const detailContentRef = useRef(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0, mouseX: null, mouseY: null });
  const dragging = useRef(false);
  const movementTotal = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const GALLERY_ITEMS = [
    { src: hero.bhumi, label: 'THE UNION', top: '10%', left: '20%', w: { desktop: '22vw', mobile: '65vw' }, z: 10, ratio: '4/5', desc: "In a moment washed in turmeric and laughter, two worlds lean closer—soft glances, quiet smiles, and a promise that begins before words are ever spoken." },
    { src: hero.bhumicouple, label: 'HAIG RD', top: '35%', left: '5%', w: { desktop: '26vw', mobile: '65vw' }, z: 20, ratio: '4/5', desc: "Between fleeting footsteps and lingering looks, the streets hold their story—unplanned, unfiltered, and beautifully theirs." },
    { src: hero.BhumiHero, label: 'RADIANCE', top: '15%', left: '40%', w: { desktop: '35vw', mobile: '90vw' }, z: 15, ratio: '16/9', desc: "Golden light rests gently on her skin, as if the sun itself paused—just to witness her becoming." },
    { src: hero.couple2, label: 'ETERNITY', top: '40%', left: '35%', w: { desktop: '40vw', mobile: '110vw' }, z: 25, ratio: '16/9', desc: "A single gaze stretches beyond time—where everything fades, except the quiet certainty of forever." },
    { src: hero.couple3, label: 'WHISPERS', top: '25%', left: '75%', w: { desktop: '20vw', mobile: '55vw' }, z: 10, ratio: '4/5', desc: "Between laughter and silence, their words soften into something only they understand." },
    { src: hero.couple2, label: 'LLOYD', top: '65%', left: '72%', w: { desktop: '42vw', mobile: '65vw' }, z: 30, ratio: '16/9', desc: "Elegance lingers in every frame—where tradition meets presence, and every detail speaks without trying." },
  ];

  const handleImageClick = (e, item) => {
    e.stopPropagation();
    if (movementTotal.current > 5) return;

    setSelectedItem(item);
    
    const tl = gsap.timeline();
    
    gsap.set(overlayRef.current, { display: "flex" });
    
    tl.to(overlayRef.current, { 
      opacity: 1, 
      duration: 0.8, 
      ease: "boutique" 
    })
    .fromTo(".detail-img-box", 
      { clipPath: "inset(100% 0% 0% 0%)", scale: 1.2 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.4, ease: "boutique" },
      "-=0.4"
    )
    .from(".detail-text", {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "boutique"
    }, "-=1");
  };

  const closeDetail = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        setSelectedItem(null);
        gsap.set(overlayRef.current, { display: "none" });
      }
    });
  };

  useEffect(() => {
    // Canvas update loop
    const update = () => {
      const ease = dragging.current ? 0.15 : 0.06;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      const dx = current.current.x - last.current.x;
      const tilt = gsap.utils.clamp(-10, 10, dx * 0.6);

      if (scrollContentRef.current) {
        gsap.set(scrollContentRef.current, {
          x: current.current.x,
          y: current.current.y,
        });

        itemsRef.current.forEach((el) => {
          if (el) gsap.set(el, { rotationY: tilt, rotationZ: tilt * 0.1 });
        });
      }

      last.current.x = current.current.x;
      last.current.y = current.current.y;
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    
    // Entrance
    gsap.from(".gallery-item", {
      opacity: 0,
      y: 100,
      stagger: 0.1,
      duration: 1.5,
      ease: "boutique"
    });
  }, []);

  const handleStart = (e) => {
    dragging.current = true;
    movementTotal.current = 0;
    const point = e.touches ? e.touches[0] : e;
    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;
    
    gsap.to(scrollContentRef.current, { scale: 0.98, duration: 0.5, ease: "power3.out" });
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - last.current.mouseX;
    const dy = point.clientY - last.current.mouseY;
    
    movementTotal.current += Math.abs(dx) + Math.abs(dy);
    const speed = isMobile ? 2.8 : 1.2;

    target.current.x += dx * speed;
    target.current.y += dy * speed;

    last.current.mouseX = point.clientX;
    last.current.mouseY = point.clientY;
  };

  const handleEnd = () => {
    dragging.current = false;
    gsap.to(scrollContentRef.current, { scale: 1, duration: 0.8, ease: "boutique" });
  };

  return (
    <section
      ref={containerRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={(e) => { if (dragging.current) e.preventDefault(); handleMove(e); }}
      onTouchEnd={handleEnd}
      className="h-screen w-full overflow-hidden bg-[#f0eee9] cursor-grab active:cursor-grabbing select-none relative"
      style={{ perspective: "1500px" }}
    >
      {/* ── BACKGROUND LABEL (Asymmetric & Minimal) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <h2 className="text-[18vw] font-[Canvas] text-white/[0.03] uppercase leading-none tracking-tighter italic">
          Archive
        </h2>
      </div>

      {/* ── DRAGGABLE CANVAS ── */}
      <div
        ref={scrollContentRef}
        className={`relative flex items-center justify-center will-change-transform ${isMobile ? 'w-[250vw] h-[220vh]' : 'w-[150vw] h-[150vh]'}`}
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
            <div className="relative overflow-hidden bg-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:shadow-[0_40px_80px_-10px_rgba(0,0,0,0.7)]" style={{ aspectRatio: item.ratio }}>
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>
            <div className="mt-5 flex justify-between items-center text-white/40">
                <span className="font-mono text-[8px] tracking-[0.5em]">/ 0{i + 1}</span>
                <span className="font-[Canvas] text-[10px] uppercase tracking-widest group-hover:text-[#c9a96e] transition-colors">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── FULLSCREEN OVERLAY ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[300] hidden bg-[#f0eee9]/5 backdrop-blur-xl items-center justify-center px-6 md:px-20 opacity-0"
      >
        {selectedItem && (
          <div ref={detailContentRef} className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
            
            <button onClick={closeDetail} className="absolute top-6 right-0 text-white/50 hover:text-white flex items-center gap-4 transition-colors">
              <span className="text-[13px] uppercase tracking-tight text-black">Back</span>
              <div className="w-8 h-px bg-black/20" />
            </button>

            <div className="detail-img-box relative overflow-hidden aspect-[4/5] w-[70%] md:w-full md:aspect-square bg-white/5 shadow-2xl">
              <Image src={selectedItem.src} alt={selectedItem.label} fill className="object-cover" />
            </div>

            <div className="flex flex-col justify-center gap-8">
              <div className="space-y-4">
                <p className="detail-text text-[#c9a96e] text-[10px] uppercase tracking-[0.5em] font-bold">/ Collection 2026</p>
                <h2 className="detail-text font-[Canvas] text-5xl md:text-8xl text-black uppercase tracking-tighter leading-[0.85]">
                  {selectedItem.label}
                </h2>
              </div>
              
              <p className="detail-text text-black/60 text-sm md:text-lg font-light leading-relaxed max-w-md">
                {selectedItem.desc}
              </p>

              <div className="detail-text flex flex-wrap gap-4 pt-4 border-t border-white/10">
                 <div className="flex flex-col gap-1">
                    <span className="text-[7px] text-[#c9a96e] uppercase tracking-widest">Technique</span>
                    <span className="text-[10px] text-black uppercase">Analog Digital Blend</span>
                 </div>
                 <div className="w-px h-8 bg-white/10 mx-4" />
                 <div className="flex flex-col gap-1">
                    <span className="text-[7px] text-[#c9a96e] uppercase tracking-widest">Preservation</span>
                    <span className="text-[10px] text-black uppercase">Eternalized</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING UI ── */}
      <div className="absolute bottom-10 left-10 pointer-events-none flex items-center gap-6">
        <div className="w-12 h-px bg-[#c9a96e]/40" />
        <p className="text-[8px] tracking-[0.4em] uppercase text-white/30">
          Hold & Drag to Traverse Archive
        </p>
      </div>
    </section>
  );
}