import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const [transitioning, setTransitioning] = useState(false);

  // Initialize Lenis smooth scrolling synchronized with GSAP ScrollTrigger
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [reducedMotion]);

  // Handle route changes: scroll to top, trigger subtle transition curtain, refresh ScrollTrigger
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    setTransitioning(true);
    const timer = window.setTimeout(() => {
      setTransitioning(false);
      ScrollTrigger.refresh();
    }, 220);

    return () => clearTimeout(timer);
  }, [location.pathname, reducedMotion]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Subtle branded route transition curtain */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[70] bg-[#06070A] transition-opacity duration-200 ${
          transitioning ? 'opacity-65' : 'opacity-0'
        }`}
      >
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent" />
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
};
