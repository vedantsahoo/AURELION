import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(18);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || reducedMotion) {
      onComplete();
      return;
    }

    const t1 = window.setTimeout(() => setProgress(64), 140);
    const t2 = window.setTimeout(() => setProgress(100), 360);
    const t3 = window.setTimeout(() => setExiting(true), 520);
    const t4 = window.setTimeout(() => onComplete(), 760);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, reducedMotion]);

  return (
    <div
      role="region"
      aria-label="AURELION showroom initialization"
      className={`fixed inset-0 z-[90] flex flex-col justify-between bg-[#06070A] p-6 md:p-12 transition-opacity duration-300 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#DCE1EC]/10 pb-4">
        <span className="font-display text-sm tracking-[0.28em] text-[#F4F5F8] font-semibold">
          AURELION
        </span>
        <span className="font-mono-tech text-xs text-[#979CAB]">
          SERIES A1-2035 · ACOUSTIC ARCHITECTURES
        </span>
      </div>

      <div className="my-auto max-w-xl mx-auto w-full text-center space-y-6">
        <p className="font-mono-tech text-xs tracking-[0.22em] text-[#9DEBFF] uppercase">
          Calibrating Spatial Wavefield
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-light tracking-tight text-[#F4F5F8]">
          AURELION ONE
        </h2>

        {/* Minimal progress line with subtle light sweep */}
        <div className="relative w-full h-[2px] bg-[#131721] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#9DEBFF] to-[#DCE1EC] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between font-mono-tech text-xs text-[#979CAB]">
          <span>PBR STUDIO ENVIRONMENT</span>
          <span className="tabular-nums">{progress}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#DCE1EC]/10 pt-4">
        <span className="font-mono-tech text-xs text-[#979CAB]">
          ZURICH · KYOTO · JENA
        </span>
        <button
          type="button"
          onClick={onComplete}
          className="font-mono-tech text-xs text-[#F4F5F8] hover:text-[#9DEBFF] underline underline-offset-4 cursor-pointer"
        >
          Enter Showroom Immediately
        </button>
      </div>
    </div>
  );
};
