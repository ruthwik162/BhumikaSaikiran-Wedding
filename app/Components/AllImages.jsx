'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { hero } from '@/public/assets/assets';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const COLLECTIONS = [
    { id: '01', title: 'The Haldi', count: '42 Photos', preview: hero.haldhi },
    { id: '02', title: 'The Mehndi', count: '38 Photos', preview: hero.couple2 },
    { id: '03', title: 'The Wedding', count: '124 Photos', preview: hero.BhumiHero },
    { id: '04', title: 'Reception', count: '56 Photos', preview: hero.bhumicouple },
];

export default function AllImages() {
    const containerRef = useRef(null);
    const leftImageContainerRef = useRef(null);
    const [activeItem, setActiveItem] = useState(COLLECTIONS[0]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Line-by-line reveal for the heading
            gsap.from(".reveal-line", {
                y: 100,
                rotate: 2,
                opacity: 0,
                duration: 1.5,
                stagger: 0.1,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            });

            // 2. Parallax Scale for the main preview container
            gsap.to(".preview-img", {
                scale: 1.2,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // 3. Handle Hover Transition (The "React Bit" magic)
    const handleMouseEnter = (item) => {
        if (activeItem.id === item.id) return;
        
        setActiveItem(item);

        // Animate the image container for a "flash" or "slide" effect
        const tl = gsap.timeline();
        tl.fromTo(".preview-img-wrapper", 
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.out" }
        );
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden bg-[#f0eee9] py-20 selection:bg-[#b39359] selection:text-white"
        >
            <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-1 md:grid-cols-12">

                {/* ─── LEFT SIDE: CINEMATIC PREVIEW ─── */}
                <div className="relative col-span-1 h-[70vh] md:col-span-6 md:h-[90vh] px-6 md:px-12 sticky top-10">
                    <div ref={leftImageContainerRef} className="relative h-full w-full overflow-hidden rounded-sm bg-stone-300">
                        <div className="preview-img-wrapper relative h-full w-full overflow-hidden">
                            <Image
                                src={activeItem.preview}
                                alt={activeItem.title}
                                fill
                                className="preview-img object-cover transition-transform duration-700 ease-out"
                                priority
                            />
                        </div>
                        {/* Subtle noise/texture overlay for cinematic feel */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    </div>
                </div>

                {/* ─── RIGHT SIDE: INTERACTIVE LINKS ─── */}
                <div className="col-span-1 flex flex-col justify-between px-6 py-12 md:col-span-6 md:px-16 md:py-[5vh]">

                    <div className="max-w-md">
                        <div className="overflow-hidden mb-4">
                            <span className="reveal-line block font-mono text-[10px] uppercase tracking-[0.4em] text-[#b39359]">
                                Archive Collection 2026
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="reveal-line font-['Cormorant_Garamond'] text-4xl leading-[1.1] text-black md:text-5xl">
                                Witness the joy and <span className="italic">soul</span> behind the conventions.
                            </h2>
                        </div>
                    </div>

                    <div className="mt-20">
                        {COLLECTIONS.map((item) => (
                            <div
                                key={item.id}
                                onMouseEnter={() => handleMouseEnter(item)}
                                className="group relative border-b border-black/10 transition-all duration-500 hover:border-black cursor-none"
                            >
                                <a href="#" className="flex items-center justify-between py-8 md:py-10">
                                    <div className="flex items-center space-x-8">
                                        <span className="font-mono text-[11px] text-black/30 group-hover:text-[#b39359] transition-colors">
                                            {item.id}
                                        </span>
                                        <h3 className="font-['PP_Neue_Montreal'] text-3xl text-black font-medium  tracking-tighter transition-all duration-700 group-hover:translate-x-4 md:text-6xl  group-hover:font-light">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="overflow-hidden text-right">
                                        <span className="block translate-y-0 font-['Cormorant_Garamond'] text-sm italic text-black/40 group-hover:-translate-y-full transition-transform duration-500">
                                            {item.count}
                                        </span>
                                        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 text-[10px] uppercase tracking-widest opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 text-[#b39359]">
                                            View Gallery
                                        </span>
                                    </div>
                                </a>
                                
                                {/* The "React Bit" Bottom Line */}
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#b39359] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-full" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 flex items-center justify-between">
                        <p className="max-w-[180px] text-[9px] uppercase tracking-[0.3em] leading-relaxed text-black/40">
                            Handcrafted digital experience for memories that last.
                        </p>
                        <div className="group relative h-14 w-14 rounded-full border border-black/10 flex items-center justify-center overflow-hidden hover:border-black transition-colors">
                            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
                            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" className="z-10 group-hover:invert group-hover:rotate-45 transition-all duration-500">
                                <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}