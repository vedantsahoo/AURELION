import React, { useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useCursor, CursorMode } from '../../state/CursorContext';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  cursorMode?: CursorMode;
  cursorLabel?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  variant = 'primary',
  cursorMode = 'explore',
  cursorLabel = '',
  icon,
  children,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...rest
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = useReducedMotion();
  const isCoarse = useMediaQuery('(pointer: coarse)');
  const { setCursor, resetCursor } = useCursor();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseMove) onMouseMove(e);
    if (reducedMotion || isCoarse || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    // Bounded subtle magnetic pull (max ~7px)
    const moveX = Math.max(-7, Math.min(7, relX * 0.16));
    const moveY = Math.max(-7, Math.min(7, relY * 0.22));

    btnRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;

    if (iconRef.current) {
      iconRef.current.style.transform = `translate3d(${moveX * 0.45}px, ${moveY * 0.45}px, 0)`;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseEnter) onMouseEnter(e);
    setCursor(cursorMode, cursorLabel);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onMouseLeave) onMouseLeave(e);
    resetCursor();
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
    if (iconRef.current) {
      iconRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center gap-3 px-6 py-3.5 text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary:
      'bg-[#F4F5F8] text-[#06070A] hover:bg-[#9DEBFF] border border-transparent shadow-[0_0_25px_rgba(139,92,246,0.22)]',
    secondary:
      'bg-[#131721] text-[#F4F5F8] border border-[#DCE1EC]/20 hover:border-[#9DEBFF]/60 hover:bg-[#191F2E]',
    ghost:
      'bg-transparent text-[#979CAB] border border-[#DCE1EC]/12 hover:text-[#F4F5F8] hover:border-[#DCE1EC]/35',
  }[variant];

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <span ref={iconRef} className="inline-flex items-center transition-transform duration-200">
          {icon}
        </span>
      )}
    </button>
  );
};
