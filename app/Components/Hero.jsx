'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { hero } from '@/public/assets/assets';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef(null);
  const imageWrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Entrance: stagger all reveal items up from below ──
      gsap.from('.reveal-item', {
        y: 40,
        opacity: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.3,
      });

      // ── Scroll: image frame gently expands ──
      gsap.to(imageWrapRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: 1.5,
          pin: true,
        },
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        ease: 'none',
      });

      // ── Scroll: inner image subtle parallax ──
      gsap.to('.hero-img', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: 1.5,
        },
        scale: 1.12,
        ease: 'none',
      });

      // ── Scroll: flanking info panels fade out ──
      gsap.to('.info-panel', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=60%',
          scrub: true,
        },
        opacity: 0,
        ease: 'none',
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <ReactLenis root>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        :root {
          --ivory:   #f6f1ea;
          --cream:   #ede5d8;
          --gold:    #b8966a;
          --gold-lt: #d4b896;
          --burg:    #4a1c2c;
          --ink:     #2a1f1a;
          --rule:    rgba(74,28,44,0.18);
        }

        body { background: var(--ivory); }

        .hero-root {
          background: var(--ivory);
          font-family: 'Jost', sans-serif;
        }

        /* ── Ornament divider ── */
        .ornament {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--gold);
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .ornament::before,
        .ornament::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--gold);
          opacity: 0.45;
        }

        /* ── Vertical rule ── */
        .v-rule {
          width: 1px;
          background: var(--rule);
        }

        /* ── Serif display ── */
        .serif { font-family: 'Cormorant Garamond', serif; }

        /* ── Image frame ── */
        .image-frame {
          width: 52vw;
          height: 68vh;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(42,31,26,0.22), 0 0 0 1px rgba(184,150,106,0.2);
          will-change: width, height, border-radius;
          flex-shrink: 0;
        }

        /* ── Info panels ── */
        .info-panel {
          width: 18vw;
          min-width: 160px;
          flex-shrink: 0;
        }

        /* ── Pill badge ── */
        .badge {
          display: inline-block;
          border: 1px solid var(--gold);
          color: var(--gold);
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          padding: 4px 14px;
          font-family: 'Jost', sans-serif;
        }

        /* ── Scroll cue ── */
        @keyframes scrollCue {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .scroll-line {
          width: 1px;
          height: 48px;
          background: var(--gold);
          animation: scrollCue 2s ease-in-out infinite;
          margin: 0 auto;
        }

        /* ── Gold gradient overlay ── */
        .photo-overlay {
          background: linear-gradient(
            to top,
            rgba(42,31,26,0.72) 0%,
            rgba(42,31,26,0.12) 50%,
            transparent 100%
          );
        }
      `}</style>

      <main
        ref={containerRef}
        className="hero-root relative w-full h-screen overflow-hidden z-10 flex items-center justify-center"
      >



        {/* ─────────────────────────────────────────────
            THREE-COLUMN LAYOUT
        ───────────────────────────────────────────── */}
        <div className="relative w-full h-full z-20 flex items-center  justify-center gap-0" >

          {/* ── LEFT INFO PANEL ── */}
          <div className="info-panel reveal-item flex flex-col gap-6 ">
            <div>
              <p className="badge">The Groom</p>
              <h2 className="serif mt-3 leading-none" style={{fontSize:'2rem', color:'var(--burg)', fontWeight:300}}>
                Sai<br/>Kiran
              </h2>
              <p className="mt-2 text-xs tracking-widest uppercase" style={{color:'var(--gold)', opacity:0.7}}>
                Son of<br/>Ravi &amp; Sunitha
              </p>
            </div>

            <div className="v-rule" style={{height:'60px'}} />

            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{color:'var(--ink)', opacity:0.4, fontFamily:'Jost, sans-serif'}}>Date</p>
              <p className="serif" style={{fontSize:'1.1rem', color:'var(--ink)', fontWeight:300}}>
                12 · 04 · 2026
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{color:'var(--ink)', opacity:0.4, fontFamily:'Jost, sans-serif'}}>Venue</p>
              <p className="serif" style={{fontSize:'1rem', color:'var(--ink)', fontWeight:300, lineHeight:1.4}}>
                ITC Kohenur<br/>Hyderabad
              </p>
            </div>
          </div>

          {/* ── VERTICAL RULE ── */}
          <div className="reveal-item v-rule" style={{height:'420px', marginRight:'0'}} />

          {/* ── CENTER IMAGE FRAME ── */}
          <div ref={imageWrapRef} className="image-frame reveal-item">
            <Image
              src={hero.BhumiHero}
              alt="Sai Kiran & Bhumika"
              fill
              priority
              className="hero-img object-cover"
              style={{objectPosition:'center center'}}
            />

            {/* Overlay */}
            <div className="photo-overlay absolute inset-0" />

            {/* Bottom caption inside image */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <div className="ornament" style={{color:'var(--gold-lt)', marginBottom:'12px'}}>
                <span>Hyderabad 2026</span>
              </div>
              <h1
                className="serif italic text-center leading-none"
                style={{fontSize:'clamp(1.8rem, 3.5vw, 3rem)', color:'#f6f1ea', fontWeight:300, letterSpacing:'0.02em'}}
              >
                Sai Kiran<br/>
                <span style={{fontSize:'0.5em', letterSpacing:'0.5em', fontStyle:'normal', opacity:0.6}}>&amp;</span>
                <br/>Bhumika
              </h1>
              <p className="text-center mt-3" style={{fontSize:'0.55rem', letterSpacing:'0.45em', textTransform:'uppercase', color:'rgba(246,241,234,0.5)', fontFamily:'Jost, sans-serif'}}>
                A Wedding Story
              </p>
            </div>
          </div>

          {/* ── VERTICAL RULE ── */}
          <div className="reveal-item v-rule" style={{height:'420px'}} />

          {/* ── RIGHT INFO PANEL ── */}
          <div className="info-panel reveal-item flex flex-col gap-6 pl-8">
            <div>
              <p className="badge">The Bride</p>
              <h2 className="serif mt-3 leading-none" style={{fontSize:'2rem', color:'var(--burg)', fontWeight:300}}>
                Bhumi<br/>ka
              </h2>
              <p className="mt-2 text-xs tracking-widest uppercase" style={{color:'var(--gold)', opacity:0.7}}>
                Daughter of<br/>Suresh &amp; Padma
              </p>
            </div>

            <div className="v-rule" style={{height:'60px'}} />

            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{color:'var(--ink)', opacity:0.4, fontFamily:'Jost, sans-serif'}}>Ceremony</p>
              <p className="serif" style={{fontSize:'1.1rem', color:'var(--ink)', fontWeight:300}}>
                Muhurtham<br/>
                <span style={{fontSize:'0.9rem', opacity:0.7}}>6:30 AM</span>
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{color:'var(--ink)', opacity:0.4, fontFamily:'Jost, sans-serif'}}>Reception</p>
              <p className="serif" style={{fontSize:'1rem', color:'var(--ink)', fontWeight:300, lineHeight:1.4}}>
                12 April<br/>
                <span style={{fontSize:'0.9rem', opacity:0.7}}>7:00 PM onwards</span>
              </p>
            </div>
          </div>

        </div>

        {/* ── Bottom scroll cue ── */}
        <div className="reveal-item absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
          <div className="scroll-line" />
          <p style={{fontSize:'0.5rem', letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--gold)', opacity:0.6, fontFamily:'Jost, sans-serif'}}>
            Scroll
          </p>
        </div>

        {/* ── Subtle grain overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none z-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            mixBlendMode: 'multiply',
          }}
        />

      </main>
    </ReactLenis>
  );
}