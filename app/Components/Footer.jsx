'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

const Footer = () => {
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY;
            
            // Calculate percentage (0 to 100)
            const percentage = (scrollPosition / (fullHeight - windowHeight)) * 100;
            setScrollPercent(Math.round(percentage));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <footer className="relative w-full bg-[#f0eee9] text-[#252525] py-20 px-6 md:px-16 overflow-hidden">
            {/* Background Accent Text */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.03] select-none">
                <h2 className="text-[20vw] font-serif whitespace-nowrap">ETERNITY</h2>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                    
                    {/* LEFT: Gifted By & Brand */}
                    <div className="md:col-span-4 space-y-8">
                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#b39359] block mb-4">
                                Digital Experience
                            </span>
                            <p className="font-['Cormorant_Garamond'] text-2xl italic max-w-xs leading-relaxed">
                                "Capturing the whispers of the soul within the frames of time."
                            </p>
                        </div>
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-[10px] uppercase tracking-widest opacity-50">Gifted with love by</p>
                            <h4 className="text-xl font-medium font-['PP_Neue_Montreal'] tracking-tight mt-1">Ruthwik</h4>
                        </div>
                    </div>

                    {/* CENTER: Navigation / Interaction */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center space-y-6">
                        <button 
                            className="group relative flex flex-col items-center justify-center p-10 rounded-full border border-white/10 hover:border-[#b39359] transition-colors duration-700"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-widest mb-2 group-hover:text-[#b39359] transition-colors">
                                Explore
                            </span>
                            <span className="font-['Cormorant_Garamond'] text-3xl italic">The Gallery</span>
                            
                            {/* Animated Arrow */}
                            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" className="mt-4 transform group-hover:translate-y-2 transition-transform duration-500">
                                <path d="M7.5 2V13M7.5 13L11 9.5M7.5 13L4 9.5" stroke="#b39359" strokeWidth="1"/>
                            </svg>
                        </button>
                    </div>

                    {/* RIGHT: Scroll Percentage & Copyright */}
                    <div className="md:col-span-4 flex flex-col items-end text-right space-y-12">
                        <div className="flex items-end gap-4">
                            <div className="flex flex-col items-end">
                                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Scroll</span>
                                <span className="text-6xl font-['Cormorant_Garamond'] text-[#b39359]">
                                    {scrollPercent.toString().padStart(2, '0')}%
                                </span>
                            </div>
                            {/* Visual Progress Bar */}
                            <div className="w-[2px] h-20 bg-white/10 relative overflow-hidden">
                                <div 
                                    className="absolute top-0 left-0 w-full bg-[#b39359] transition-all duration-300 ease-out"
                                    style={{ height: `${scrollPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;