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
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const leftImageRef = useRef(null);
  const dividerLineRef = useRef(null);
  const stampRef = useRef(null);

  // --- Cursor ---
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let rafId;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    };

    const lerp = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      rafId = requestAnimationFrame(lerp);
    };

    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(lerp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // --- Mouse Parallax on Image ---
  useEffect(() => {
    const container = containerRef.current;
    const img = leftImageRef.current;
    if (!container || !img) return;

    const onMove = (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
      img.style.transform = `translate(${xRatio * -12}px, ${yRatio * -8}px) scale(1.04)`;
    };

    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  // --- GSAP Entrance Animations ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      // Divider line grows
      tl.fromTo(dividerLineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 1.6, ease: 'power4.inOut' }, 0
      );

      // Left image clip-path reveal (top → down)
      tl.fromTo('.bhumi-left-image',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' }, 0
      );

      // Image scale-in
      tl.fromTo('.bhumi-left-img-inner',
        { scale: 1.1 },
        { scale: 1, duration: 8, ease: 'power2.out' }, 0
      );

      // Big background number
      tl.fromTo('.bhumi-big-number',
        { opacity: 0 },
        { opacity: 1, duration: 1 }, 0.3
      );

      // Eyebrow
      tl.fromTo('.bhumi-eyebrow',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.7
      );

      // Title lines stagger
      tl.fromTo('.bhumi-title-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 }, 0.8
      );

      // Sub italic
      tl.fromTo('.bhumi-sub',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 1.1
      );

      // Right panel — number label
      tl.fromTo('.bhumi-num-label',
        { opacity: 0 },
        { opacity: 1, duration: 1 }, 1.3
      );

      // Names
      tl.fromTo('.bhumi-name-span',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15 }, 0.95
      );

      // Connector
      tl.fromTo('.bhumi-connector',
        { opacity: 0 },
        { opacity: 1, duration: 0.7 }, 1.2
      );

      // Gold rule
      tl.fromTo('.bhumi-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 1.45
      );

      // Detail items stagger
      tl.fromTo('.bhumi-detail-item',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 1.55
      );

      // CTA
      tl.fromTo('.bhumi-cta-row',
        { opacity: 0 },
        { opacity: 1, duration: 0.9 }, 2.0
      );

      // Stamp
      tl.fromTo('.bhumi-stamp',
        { opacity: 0 },
        { opacity: 1, duration: 0.9 }, 2.1
      );

      // Scroll hint
      tl.fromTo('.bhumi-scroll-hint',
        { opacity: 0 },
        { opacity: 1, duration: 0.9 }, 2.35
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@200;300;400&display=swap');

        :root {
          --gold: #c9a96e;
          --gold-pale: #e8d5a3;
          --cream: #f4f0e8;
          --ink: #1a1714;
          --ink-muted: rgba(26,23,20,0.45);
          --ink-faint: rgba(26,23,20,0.14);
        }

        /* Hide default cursor when hero is mounted */
        body { cursor: none; }

        /* Custom cursor */
        .bhumi-cursor-dot {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
          transform: translate(-50%, -50%);
        }
        .bhumi-cursor-ring {
          position: fixed;
          pointer-events: none;
          z-index: 9998;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid var(--gold);
          transform: translate(-50%, -50%);
          opacity: 0.6;
          transition: width 0.28s ease, height 0.28s ease, opacity 0.28s ease;
        }
        .bhumi-cursor-ring.expanded {
          width: 80px; height: 80px; opacity: 0.25;
        }

        /* Grain overlay */
        .bhumi-grain {
          position: fixed; inset: 0;
          pointer-events: none;
          z-index: 8000;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          animation: bhumi-grain 0.4s steps(2) infinite;
        }
        @keyframes bhumi-grain {
          0%,100% { transform: translate(0,0); }
          25% { transform: translate(-1%,1%); }
          50% { transform: translate(1%,-1%); }
          75% { transform: translate(-1%,-1%); }
        }

        /* Stamp rotation */
        .bhumi-stamp-svg {
          animation: bhumi-stamp-rotate 20s linear infinite;
          transform-origin: center;
        }
        @keyframes bhumi-stamp-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Scroll pulse */
        .bhumi-scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: bhumi-scroll-pulse 2s ease-in-out infinite;
        }
        @keyframes bhumi-scroll-pulse {
          0%,100% { transform: scaleY(0.3); opacity: 0.3; transform-origin: top; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        /* CTA hover fill */
        .bhumi-cta {
          position: relative; overflow: hidden;
          display: inline-block;
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 0.62rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          padding: 1rem 2.2rem;
          border: 1px solid var(--ink);
          cursor: none;
          transition: color 0.4s ease;
        }
        .bhumi-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--ink);
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.76,0,0.24,1);
        }
        .bhumi-cta:hover { color: var(--cream); }
        .bhumi-cta:hover::before { transform: translateY(0); }
        .bhumi-cta span { position: relative; z-index: 1; }

        .bhumi-cta-sec {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          color: var(--ink-muted);
          cursor: none;
          transition: color 0.3s ease, border-color 0.3s ease;
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
          text-decoration: none;
        }
        .bhumi-cta-sec:hover { color: var(--gold); border-color: var(--gold); }

        /* Title clip */
        .bhumi-title-overflow { overflow: hidden; }
      `}</style>

      {/* Grain */}
      <div className="bhumi-grain" />

      {/* Cursor */}
      <div ref={cursorDotRef} className="bhumi-cursor-dot" />
      <div ref={cursorRingRef} className="bhumi-cursor-ring" />

      <ReactLenis root>
        <main
          ref={containerRef}
          style={{
            width: '100vw',
            height: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            background: 'var(--cream)',
            overflow: 'hidden',
            position: 'relative',
          }}
          className='z-100'
        >

          {/* ── LEFT PANEL ── */}
          <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10vh 5vw 10vh 7vw' }}>

            {/* Cinematic image */}
            <div
              ref={leftImageRef}
              className="bhumi-left-image"
              style={{ position: 'absolute', inset: 0, transition: 'transform 0.6s ease' }}
            >
              <Image
                src={hero.BhumiHero}
                alt="Sai Kiran & Bhumika"
                fill
                priority
                className="bhumi-left-img-inner"
                style={{ objectFit: 'cover', filter: 'brightness(0.32) sepia(0.25)' }}
              />
            </div>

            {/* Bottom gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,23,20,0.72) 0%, transparent 60%)', zIndex: 1 }} />

            {/* Large faint number */}
            <div
              className="bhumi-big-number"
              style={{
                position: 'absolute', top: '5vh', left: '5vw', zIndex: 2,
                fontFamily: 'Canvas, serif',
                fontSize: 'clamp(5rem, 10vw, 9rem)',
                color: 'rgba(255,255,255,0.06)',
                lineHeight: 1,
                letterSpacing: '-0.05em',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              01
            </div>

            {/* Left text content */}
            <div style={{ position: 'relative', zIndex: 3 }}>
              <p
                className="bhumi-eyebrow"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 200,
                  fontSize: '0.6rem',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: '1.5rem',
                }}
              >
                A Wedding Film
              </p>

              <div style={{ fontFamily: 'Canvas, serif', fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontWeight: 400, color: 'white', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
                <div className="bhumi-title-overflow">
                  <div className="bhumi-title-line">
                    A <span style={{ color: 'var(--gold)' }}>Love</span>
                  </div>
                </div>
                <div className="bhumi-title-overflow">
                  <div className="bhumi-title-line">Story</div>
                </div>
              </div>

              <p
                className="bhumi-sub"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '1.4rem',
                  lineHeight: 1.4,
                }}
              >
                Some moments deserve more<br />
                than memory — they deserve<br />
                to be <em>felt again</em>.
              </p>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ width: '1px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              ref={dividerLineRef}
              style={{
                width: '1px',
                height: '60vh',
                background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
              }}
            />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10vh 7vw 10vh 5vw', background: 'var(--cream)', position: 'relative' }}>

            {/* Rotating stamp */}
            <div
              className="bhumi-stamp"
              style={{ position: 'absolute', top: '5vh', right: '5vw', width: 80, height: 80 }}
            >
              <svg className="bhumi-stamp-svg" viewBox="0 0 100 100" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <path id="circle-stamp-path" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                </defs>
                <circle cx="50" cy="50" r="40" stroke="#c9a96e" strokeWidth="0.5" opacity="0.4" />
                <circle cx="50" cy="50" r="3" fill="#c9a96e" opacity="0.8" />
                <text fontFamily="Montserrat, sans-serif" fontSize="8" fill="#c9a96e" letterSpacing="3" fontWeight="300">
                  <textPath href="#circle-stamp-path">SAI KIRAN × BHUMIKA • 2026 •</textPath>
                </text>
              </svg>
            </div>

            {/* Collection label */}
            <p
              className="bhumi-num-label"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 200,
                fontSize: '0.55rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                marginBottom: '3.5rem',
              }}
            >
              Estd. Collection — No. 001
            </p>

            {/* Names */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ fontFamily: 'Canvas, serif', fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: 'var(--ink)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1, marginBottom: '0.3rem', overflow: 'hidden' }}>
                <span className="bhumi-name-span" style={{ display: 'block' }}>Sai Kiran</span>
              </div>

              <p
                className="bhumi-connector"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)',
                  color: 'var(--gold)',
                  margin: '0.7rem 0',
                  letterSpacing: '0.05em',
                }}
              >
                &amp; forever
              </p>

              <div style={{ fontFamily: 'Canvas, serif', fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: 'var(--ink)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1, overflow: 'hidden' }}>
                <span className="bhumi-name-span" style={{ display: 'block' }}>Bhumika Munagala</span>
              </div>
            </div>

            {/* Gold rule */}
            <div
              className="bhumi-rule"
              style={{ width: 40, height: '1px', background: 'var(--gold)', marginBottom: '2.5rem' }}
            />

            {/* Detail grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem 1.5rem', marginBottom: '0.5rem' }}>
              {[
                { label: 'Occasion', value: 'Wedding Ceremony\n& Reception' },
                { label: 'Year', value: 'Twenty Twenty\nSix' },
                { label: 'Preserved by', value: 'Bhumi Films\nStudio' },
                { label: 'Format', value: 'Cinematic\n4K Archive' },
              ].map(({ label, value }) => (
                <div key={label} className="bhumi-detail-item">
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.52rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', color: 'var(--ink)', fontWeight: 300, lineHeight: 1.25, whiteSpace: 'pre-line' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="bhumi-cta-row" style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <a
                className="bhumi-cta"
                href="#"
                onMouseEnter={() => cursorRingRef.current?.classList.add('expanded')}
                onMouseLeave={() => cursorRingRef.current?.classList.remove('expanded')}
              >
                <span>View the Film</span>
              </a>
              <a className="bhumi-cta-sec" href="#">
                Explore Gallery →
              </a>
            </div>
          </div>

          {/* ── SCROLL HINT ── */}
          <div
            className="bhumi-scroll-hint"
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem',
              zIndex: 10,
            }}
          >
            <div className="bhumi-scroll-line" />
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              Scroll
            </p>
          </div>

        </main>
      </ReactLenis>
    </>
  );
}