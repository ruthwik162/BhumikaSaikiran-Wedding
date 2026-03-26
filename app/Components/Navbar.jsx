'use client';

import React from 'react';
import { Link } from 'next-view-transitions';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-24 z-[100] flex items-center justify-between px-8 md:px-16 text-white mix-blend-difference pointer-events-none">
      
      {/* ── LOGO (Left) ── */}
      <div className="pointer-events-auto">
        <Link href="/" className="group">
          <h1 className="text-xl md:text-2xl italic font-[Canvas] font-thin tracking-tight">
            Sai Kiran & Bhumika
          </h1>
        </Link>
      </div>

      {/* ── NAVIGATION (Right) ── */}
      <div className="flex items-center gap-5 pointer-events-auto">
        <Link 
          href="/" 
          className="text-[10px] uppercase md:block hidden tracking-[0.4em] font-light hover:opacity-60 transition-opacity"
        >
          Home
        </Link>
        
        <Link 
          href="/gallery" 
          className="text-[15px] uppercase font-semibold text-white mix-blend-difference  font-['PP_Neue_Montreal'] "
        >
          Gallery
        </Link>

        {/* Dynamic Indicator (Optional UI touch) */}
        <div className="w-1 h-1 bg-white rounded-full opacity-40 ml-[-10px]" />
      </div>
      
    </nav>
  );
};

export default Navbar;