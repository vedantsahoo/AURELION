import React, { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../state/CursorContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const CustomCursor: React.FC = () => {
  const { mode, label } = useCursor();
  const reducedMotion = useReducedMotion();
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || isCoarsePointer) return;

    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
    };

    const onPointerDown = () => setClicked(true);
    const onPointerUp = () => setClicked(false);

    const animateRing = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [reducedMotion, isCoarsePointer, visible]);

  if (reducedMotion || isCoarsePointer) {
    return null;
  }

  const isExpanded = mode !== 'default' || Boolean(label);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[100] overflow-hidden transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Central precision dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#9DEBFF] transition-transform duration-100"
      />

      {/* Trailing outer ring with contextual label */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-200 ${
            clicked ? 'scale-90' : 'scale-100'
          } ${
            isExpanded
              ? 'w-16 h-16 border-[#9DEBFF]/70 bg-[#0C0F15]/85'
              : 'w-8 h-8 border-[#DCE1EC]/35 bg-transparent'
          }`}
        >
          {label && (
            <span className="font-mono-tech text-[9px] tracking-widest text-[#F4F5F8] uppercase">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
