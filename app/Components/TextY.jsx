"use client"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import React, { useRef } from 'react'


gsap.registerPlugin(ScrollTrigger, SplitText);

const TextY = ({ children, animateOnScroll = true, delay = 0 }) => {
    const containerRef = useRef(null);
    const elementRef = useRef([]);
    const splitRef = useRef([]);
    const lines = useRef([]);

    useGSAP(() => {
        document.fonts.ready.then(() => {
            if (!containerRef.current) return;
            splitRef.current = [];
            elementRef.current = [];
            lines.current = [];

            let elements = [];
            if (containerRef.current.hasAttribute("data-copy-wrapper")) {
                elements = Array.from(containerRef.current.children);
            } else {
                elements = [containerRef.current]
            }

            elements.forEach((element) => {
                elementRef.current.push(element);

                const split = SplitText.create(element, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "line++"
                });

                splitRef.current.push(split);

                const computedStyle = window.getComputedStyle(element);
                const textIndent = computedStyle.textIndent;

                if (textIndent && textIndent !== "0px") {
                    if (split.lines.length > 0) {
                        split.lines[0].style.paddingLeft = textIndent;
                    }
                    element.style.textIndent = "0"
                }
                lines.current.push(...split.lines);
            });

            gsap.set(lines.current, { y: "100%" });

            const animateProps = {
                y: "0%",
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
                delay: delay,

            };

            if (animateOnScroll) {
                gsap.to(lines.current, {
                    ...animateProps,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        once: true,
                    }
                })
            } else {
                gsap.to(lines.current, animateProps);
            }

            return () => {
                splitRef.current.forEach((split) => {
                    if (split) {
                        split.revert();
                    }
                })
            }

        });

        }, {
            scope: containerRef,
            dependencies: [animateOnScroll, delay],
        })

        if (React.Children.count(children) === 1) {
            return React.cloneElement(children, { ref: containerRef })
        }


        return (
            <div ref={containerRef} data-copy-wrapper="true" >
                {children}
            </div>
        )


    }

export default TextY
