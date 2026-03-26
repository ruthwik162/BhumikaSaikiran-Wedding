"use client"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export const RollingNumber = ({ value, delay = 0 }) => {
    const obj = { val: 0 };
    const textRef = useRef(null);

    useGSAP(() => {
        gsap.to(obj, {
            val: value,
            duration: 2,
            delay,
            ease: "power4.out",
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
            },
            onUpdate: () => {
                if (textRef.current) {
                    textRef.current.innerText = Math.floor(obj.val).toString().padStart(2, '0');
                }
            }
        });
    }, [value]);

    return <span ref={textRef}>00</span>;
};