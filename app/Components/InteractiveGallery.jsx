'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { hero } from '@/public/assets/assets';
import { CustomEase } from 'gsap/CustomEase';


if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
}

const images = [
    {
        src: hero.bhumicouple,
        size: {
            mobile: 'w-[35vw]',
            desktop: 'w-[12vw]'
        },
        pos: {
            mobile: '-top-[70vw] left-[10%]',
            desktop: 'top-[5%] left-[8%]'
        },
        speed: 0.01,
        
        scrollSpeed: -800,
        label: 'THE BEGINNING'
    },
    {
        src: hero.couple2,
        size: {
            mobile: 'w-[38vw]',
            desktop: 'w-[15vw]'
        },
        pos: {
            mobile: 'top-[-50vw] right-[5%]',
            desktop: 'top-[5%] right-[5%]'
        },
        
        speed: 0.03,
        scrollSpeed: -400,
        label: 'GOLDEN RADIANCE'
    },
    {
        src: hero.couple3,
        size: {
            mobile: 'w-[30vw]',
            desktop: 'w-[22vw]'
        },
        pos: {
            mobile: 'top-[15%] left-[5%]',
            desktop: 'top-[55%] left-[40%]'
        },
        speed: 0.02,
        scrollSpeed: -600,
        label: 'LAUGHTER & LIGHT'
    },
    {
        src: hero.bhumi,
        size: {
            mobile: 'w-[20vw]',
            desktop: 'w-[12vw]'
        },
        pos: {
            mobile: 'top-[80%] right-[10%]',
            desktop: 'top-[85%] right-[12%]'
        },
        speed: 0.05,
        scrollSpeed: -300,
        label: 'SOFT WHISPERS'
    },
    {
        src: hero.BhumiHero,
        size: {
            mobile: 'w-[41vw]',
            desktop: 'w-[14vw]'
        },
        pos: {
            mobile: 'bottom-[-200vw] left-[5%]',
            desktop: 'top-[115%] left-[5%]'
        },
        speed: 0.02,
        scrollSpeed: -500,
        label: 'ETERNAL PROMISE'
    },
    {
        src: hero.couple2,
        size: {
            mobile: 'w-[55vw]',
            desktop: 'w-[12vw]'
        },
        pos: {
            mobile: 'top-[140%] right-[10%]',
            desktop: 'top-[145%] right-[20%]'
        },
        speed: 0.04,
        scrollSpeed: -250,
        label: 'THE UNION'
    },
];

export default function InteractiveGallery() {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const validItems = itemsRef.current.filter(Boolean);
            if (!validItems.length) return;

            // Velocity tracker for the skew effect (Awwwards staple)
            let proxy = { skew: 0 };
            const skewSetter = gsap.quickSetter(validItems, "skewY", "deg");
            const clamp = gsap.utils.clamp(0, 0);

            CustomEase.create(
                "hope",
                "M0,0 C0.071,0.505 0.192, 0.726 0.318, 0.852 0.45, 0.984 0.504, 1 1,1"
            )

            ScrollTrigger.create({
                onUpdate: (self) => {
                    let skew = clamp(self.getVelocity() / -150);
                    // smooth out the skew
                    if (Math.abs(skew) > Math.abs(proxy.skew)) {
                        proxy.skew = skew;
                        gsap.to(proxy, {
                            skew: 0,
                            duration: 1.2,
                            ease: "hope",
                            overwrite: true,
                            onUpdate: () => skewSetter(proxy.skew)
                        });
                    }
                }
            });

            // Make sure to set transformOrigin to center for smooth skew
            gsap.set(validItems, { transformOrigin: "center center", force3D: true });

            validItems.forEach((el, i) => {
                // 1. REVEAL 
                gsap.fromTo(el,
                    { clipPath: 'inset(90% 90% 90% 90%)', opacity: 1, scale: 1.05 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        opacity: 1,
                        scale: 1,
                        duration: 1.8,
                        ease: 'hope',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 95%',
                        }
                    }
                );

                // 2. DEEP PARALLAX
                gsap.to(el, {
                    y: images[i].scrollSpeed,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            });

            // 3. MAGNETIC MOUSE FOLLOW (Subtle effect)
            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth) - 0.5;
                const yPos = (clientY / window.innerHeight) - 0.5;

                validItems.forEach((el, i) => {
                    gsap.to(el, {
                        x: xPos * (images[i].speed * 800),
                        y: `+=${yPos * (images[i].speed * 300)}`,
                        duration: 2.5,
                        ease: 'expo.out'
                    });
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    ref={el => itemsRef.current[idx] = el}
                    className={`absolute pointer-events-auto group 
            ${isMobile ? img.pos.mobile : img.pos.desktop} 
            ${isMobile ? img.size.mobile : img.size.desktop}
          `}
                >
                    {/* PREMIUM UI STYLE: Elegant border and rich deep shadow */}
                    <div className="bg-white  shadow-[0_15px_60px_rgba(201,169,110,0.2)] transform-gpu transition-shadow duration-700 hover:shadow-[0_30px_90px_rgba(201,169,110,0.4)]">
                        <div className={`relative overflow-hidden bg-[#e0d9cd] ${img.size === 'large' ? 'aspect-[4/3]' :
                            img.size === 'medium' ? 'aspect-[4/5]' : 'aspect-[9/16]'
                            }`}>
                            <Image
                                src={img.src}
                                alt={img.label}
                                fill
                                sizes="30vw"
                                className="object-cover transform-gpu transition-all duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:rotate-1 brightness-[0.98] contrast-[1.02] group-hover:brightness-[1.05]"
                            />

                            {/* Organic Texture Overlay - Golden hue burn */}
                            <div className="absolute inset-0 bg-[#c9a96e]/10 mix-blend-color-burn pointer-events-none opacity-50 transition-opacity duration-700 group-hover:opacity-20" />

                            {/* Cinematic Grain Overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

                            {/* Vignette & Gradient overlay on hover */}
                            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.1)] pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

                            {/* Subtle Label with Line Animation */}
                            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 flex items-center gap-4">
                                <div className="w-10 h-[1px] bg-[var(--gold)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 delay-300 ease-out" />
                                <p className="font-['Montserrat'] text-[9px] tracking-[0.4em] text-white/90 uppercase drop-shadow-md">
                                    {img.label}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}