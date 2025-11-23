"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const updateParallax = () => {
      if (!ref.current || ticking) return;
      
      ticking = true;
      rafId = requestAnimationFrame(() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Get element's position in document
          const elementTop = rect.top + scrollY;
          const elementHeight = rect.height;
          const elementCenter = elementTop + elementHeight / 2;
          
          // Calculate viewport center
          const viewportCenter = scrollY + windowHeight / 2;
          
          // Calculate distance from viewport center to element center
          const distance = viewportCenter - elementCenter;
          
          // Apply parallax: element moves at speed rate
          // Lower speed (0.3) = moves slower, creating depth
          // The offset moves the element opposite to scroll direction for parallax effect
          const parallaxOffset = distance * speed;
          
          setOffset(parallaxOffset);
        }
        ticking = false;
        rafId = null;
      });
    };

    const handleScroll = () => {
      updateParallax();
    };

    const handleResize = () => {
      updateParallax();
    };

    // Initial calculation
    updateParallax();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
