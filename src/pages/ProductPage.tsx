import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  CAMERA_PRESETS,
  COLORWAYS,
  EDITIONS,
  MATERIALS,
} from '../data/productData';
import { useProduct } from '../state/ProductContext';
import { useCart } from '../state/CartContext';
import { formatCurrency } from '../utils/commerce';
import { ProductScene } from '../scenes/ProductScene';
import { ProductConfigurator } from '../components/product/ProductConfigurator';

export const ProductPage: React.FC = () => {
  const {
    config,
    cameraAngle,
    explodedProgress,
    setMaterial,
    setColorway,
    setEdition,
    setCameraAngle,
    setExplodedProgress,
    resetCameraView,
    details,
  } = useProduct();
  const { addToBag } = useCart();

  // Unified Bottom Control Dock with Cinema/Zen Mode toggle (threejs skill Section 5)
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [fullSheetOpen, setFullSheetOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#06070A] text-[#F4F5F8] pt-16 flex flex-col">
      {/* Full-Viewport 3D Showroom (100% Unobstructed Center) */}
      <section
        aria-label="3D Studio Showroom Viewport"
        className="relative flex-1 min-h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Full-screen 3D Canvas */}
        <div className="absolute inset-0">
          <ProductScene interactive={true} />
        </div>

        {/* Minimal Top-Left Specification Header Overlay */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 pt-6 flex flex-wrap items-start justify-between gap-4 pointer-events-none">
          <div className="bg-[#0C0F15]/92 border border-[#DCE1EC]/15 px-5 py-4 pointer-events-auto space-y-1">
            <div className="flex items-center gap-2 font-mono-tech text-[11px] text-[#9DEBFF]">
              <span>AURELION ONE STUDIO</span>
              <span aria-hidden="true">·</span>
              <span>{details.colorway.code}</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#F4F5F8]">
              {details.colorway.name} · {details.material.shortName}
            </h1>
            <p className="font-mono-tech text-xs text-[#979CAB] tabular-nums">
              {details.edition.name} — {formatCurrency(details.unitPrice)}
            </p>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={resetCameraView}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0C0F15]/92 border border-[#DCE1EC]/20 text-xs font-mono-tech uppercase text-[#F4F5F8] hover:border-[#9DEBFF] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#9DEBFF]" />
              <span>Reset View</span>
            </button>

            <button
              type="button"
              onClick={() => setFullSheetOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#131721] border border-[#8B5CF6]/50 text-xs font-mono-tech uppercase text-[#F4F5F8] hover:border-[#9DEBFF] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Full Spec & Engraving</span>
            </button>
          </div>
        </div>

        {/* Unified Collapsible Bottom Control Dock (Zero Center Viewport Occlusion) */}
        <div className="relative z-10 w-full max-w-[980px] mx-auto px-4 pb-5 mt-auto">
          <div className="flex justify-center mb-1">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              aria-expanded={!dockCollapsed}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0C0F15] border border-[#DCE1EC]/20 text-[11px] font-mono-tech uppercase tracking-widest text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#9DEBFF]" />
                  <span>Show Controls (H)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9DEBFF]" />
                  <span>Hide Controls · Zen Mode (H)</span>
                </>
              )}
            </button>
          </div>

          {!dockCollapsed && (
            <div className="bg-[#0C0F15]/95 border border-[#DCE1EC]/20 p-4 sm:p-5 space-y-4 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Colorway Swatches */}
                <div className="lg:col-span-5 space-y-1.5">
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#979CAB] block">
                    Colorway Finish
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {COLORWAYS.map((col) => {
                      const active = config.colorwayId === col.id;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => setColorway(col.id)}
                          aria-label={`Select ${col.name} colorway`}
                          aria-pressed={active}
                          className={`px-2.5 py-1.5 border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-[#191F2E] border-[#9DEBFF] text-[#F4F5F8]'
                              : 'bg-[#06070A] border-[#DCE1EC]/15 text-[#979CAB] hover:text-[#F4F5F8]'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: col.swatchGradient }}
                          />
                          <span>{col.name.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Material Switcher */}
                <div className="lg:col-span-4 space-y-1.5">
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#979CAB] block">
                    Shell Architecture
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {MATERIALS.map((mat) => {
                      const active = config.materialId === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setMaterial(mat.id)}
                          aria-pressed={active}
                          className={`px-2.5 py-1.5 border text-[11px] font-mono-tech uppercase cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-[#8B5CF6] border-[#8B5CF6] text-[#F4F5F8]'
                              : 'bg-[#06070A] border-[#DCE1EC]/15 text-[#979CAB] hover:text-[#F4F5F8]'
                          }`}
                        >
                          {mat.id === 'ceramic' ? 'Ceramic' : mat.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exploded View Slider */}
                <div className="lg:col-span-3 space-y-1.5">
                  <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#979CAB]">
                    <label htmlFor="dock-exploded-slider">EXPLODED CAD</label>
                    <span className="text-[#9DEBFF] tabular-nums">
                      {Math.round(explodedProgress * 100)}%
                    </span>
                  </div>
                  <input
                    id="dock-exploded-slider"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={explodedProgress}
                    onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
                    className="w-full accent-[#9DEBFF] bg-[#131721] h-1.5 cursor-pointer"
                  />
                </div>
              </div>

              {/* Bottom Row: Camera Angles, Edition Toggle, and Add to Bag */}
              <div className="pt-3 border-t border-[#DCE1EC]/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {CAMERA_PRESETS.map((preset) => {
                    const active = cameraAngle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setCameraAngle(preset.id)}
                        className={`px-2.5 py-1 text-[11px] font-mono-tech uppercase cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#9DEBFF] text-[#06070A] font-semibold'
                            : 'bg-[#131721] text-[#979CAB] hover:text-[#F4F5F8]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    aria-label="Select Acoustic Edition"
                    value={config.editionId}
                    onChange={(e) => setEdition(e.target.value as typeof config.editionId)}
                    className="bg-[#131721] border border-[#DCE1EC]/20 px-3 py-2 text-xs font-mono-tech text-[#F4F5F8]"
                  >
                    {EDITIONS.map((ed) => (
                      <option key={ed.id} value={ed.id}>
                        {ed.name} ({ed.priceDelta === 0 ? 'Base' : `+$${ed.priceDelta}`})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => addToBag(config, 1, true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F4F5F8] text-[#06070A] hover:bg-[#9DEBFF] text-xs font-display font-semibold tracking-wider uppercase transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG · {formatCurrency(details.unitPrice)}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Slide-Over Full Specification & Engraving Drawer */}
      {fullSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full Studio Configurator"
          className="fixed inset-0 z-[75] flex justify-end bg-black/75"
        >
          <div className="flex-1" onClick={() => setFullSheetOpen(false)} />
          <div className="w-full max-w-xl bg-[#0C0F15] border-l border-[#DCE1EC]/20 h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCE1EC]/10 pb-4">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wider">
                Complete Bespoke Specification
              </h2>
              <button
                type="button"
                onClick={() => setFullSheetOpen(false)}
                aria-label="Close specification sheet"
                className="p-2 text-[#979CAB] hover:text-[#F4F5F8] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductConfigurator />
          </div>
        </div>
      )}
    </main>
  );
};
