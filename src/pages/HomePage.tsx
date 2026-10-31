import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  CameraAngleId,
  MATERIALS,
} from '../data/productData';
import { useProduct } from '../state/ProductContext';
import { useCart } from '../state/CartContext';
import { formatCurrency } from '../utils/commerce';
import { ProductScene, ScrollChoreographyState } from '../scenes/ProductScene';
import { MagneticButton } from '../components/ui/MagneticButton';
import { ProductConfigurator } from '../components/product/ProductConfigurator';
import { ProductSpecifications } from '../components/product/ProductSpecifications';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const REVEAL_STAGES: {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  angle: CameraAngleId;
  exploded: number;
}[] = [
  {
    step: '01',
    title: 'Architectural Monolith',
    subtitle: 'Full-Scale Spatial Presence',
    description:
      'Suspended on a weighted stepped plinth, the AURELION ONE projects a 360-degree holographic wavefield that adapts to the geometry of your room.',
    angle: 'hero',
    exploded: 0,
  },
  {
    step: '02',
    title: 'Three-Quarter Toroidal Profile',
    subtitle: 'Aerodynamic Diffraction Geometry',
    description:
      'Thirty-six radial CNC-machined blades surround the toroidal core, acting simultaneously as a silent 1,450W thermal radiator and an acoustic wave lens.',
    angle: 'three-quarter',
    exploded: 0.15,
  },
  {
    step: '03',
    title: 'Macro Coaxial Beryllium Lens',
    subtitle: 'Sub-Micron Surface Precision',
    description:
      'At the acoustic center sits a vapor-deposited 99.9% pure beryllium dome surrounded by laser-etched radial degree indices.',
    angle: 'macro',
    exploded: 0.35,
  },
  {
    step: '04',
    title: 'Internal Quantum DSP Core',
    subtitle: 'Exploded Acoustic Architecture',
    description:
      'Separating the outer boron-silicate visor reveals the cryogenic oxygen-free copper voice coil and dual opposing force-cancelling sub-bass actuators.',
    angle: 'top',
    exploded: 0.78,
  },
  {
    step: '05',
    title: 'Luminous Rim Silhouette',
    subtitle: 'Sculpted by Light & Shadow',
    description:
      'Electric violet and restrained ice-blue Fresnel reflections trace the outer bevels before settling into your bespoke finish configuration.',
    angle: 'silhouette',
    exploded: 0,
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    config,
    setMaterial,
    setCameraAngle,
    setExplodedProgress,
    details,
  } = useProduct();
  const { addToBag } = useCart();
  const reducedMotion = useReducedMotion();

  const revealSectionRef = useRef<HTMLElement | null>(null);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [scrollChoreo, setScrollChoreo] = useState<ScrollChoreographyState>({
    active: false,
    progress: 0,
    stageIndex: 0,
  });

  // GSAP ScrollTrigger choreography for Section C (Product Reveal)
  useEffect(() => {
    if (reducedMotion || !revealSectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: revealSectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(
            REVEAL_STAGES.length - 1,
            Math.floor(p * REVEAL_STAGES.length)
          );
          setActiveStageIdx(idx);
          setScrollChoreo({
            active: self.isActive,
            progress: p,
            stageIndex: idx,
          });
        },
        onLeave: () => {
          setScrollChoreo((prev) => ({ ...prev, active: false }));
        },
        onLeaveBack: () => {
          setScrollChoreo((prev) => ({ ...prev, active: false }));
        },
      });
    }, revealSectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSelectStage = (idx: number) => {
    const stage = REVEAL_STAGES[idx];
    setActiveStageIdx(idx);
    setCameraAngle(stage.angle);
    setExplodedProgress(stage.exploded);
  };

  return (
    <main className="bg-[#06070A] text-[#F4F5F8] pt-16">
      {/* ===================================================================
          SECTION B: FULL-SCREEN 3D HERO
      =================================================================== */}
      <section
        aria-label="AURELION ONE Hero Showcase"
        className="relative min-h-[calc(100vh-4rem)] flex items-center bg-architectural-grid border-b border-[#DCE1EC]/10 overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto w-full px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Primary CTAs */}
          <div className="lg:col-span-6 z-10 space-y-6">
            <div className="inline-flex items-center gap-3 text-xs font-mono-tech tracking-[0.2em] text-[#9DEBFF] uppercase">
              <span>{BRAND_CONFIG.brandName}</span>
              <span aria-hidden="true">·</span>
              <span>{BRAND_CONFIG.productName}</span>
              <span aria-hidden="true">·</span>
              <span>{BRAND_CONFIG.modelCode}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.02] text-[#F4F5F8]">
              ENGINEERED
              <br />
              BEYOND
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F5F8] via-[#DCE1EC] to-[#9DEBFF]">
                ORDINARY.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#979CAB] max-w-xl leading-relaxed">
              {BRAND_CONFIG.heroSubcopy} Sculpted from Grade-5 titanium, vapor-deposited boron-silicate glass, and sintered zirconia ceramic.
            </p>

            {/* Primary & Secondary Magnetic CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                type="button"
                variant="primary"
                cursorLabel="EXPLORE"
                onClick={() => navigate('/product')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                EXPLORE AURELION ONE
              </MagneticButton>

              <MagneticButton
                type="button"
                variant="secondary"
                cursorLabel="TECH"
                onClick={() => navigate('/technology')}
              >
                DISCOVER THE TECHNOLOGY
              </MagneticButton>
            </div>

            {/* Active Configuration Telemetry Strip (unboxed clean metadata) */}
            <div className="pt-6 border-t border-[#DCE1EC]/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono-tech text-[#979CAB]">
              <span>FINISH: {details.colorway.name.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>SHELL: {details.material.shortName.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F4F5F8] tabular-nums">
                {formatCurrency(details.unitPrice)}
              </span>
            </div>
          </div>

          {/* Right Column: Real-Time Interactive 3D Product Stage */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[520px] lg:h-[620px] w-full">
            <ProductScene scrollState={scrollChoreo} interactive={true} />

            {/* Subtle 3D interaction hint */}
            <div className="pointer-events-none absolute bottom-3 right-3 px-3 py-1.5 bg-[#0C0F15]/90 border border-[#DCE1EC]/15 font-mono-tech text-[11px] text-[#979CAB]">
              DRAG TO ROTATE · POINTER REACTIVE FIELD
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#product-reveal"
          aria-label="Scroll to product reveal story"
          className="hidden md:inline-flex items-center gap-2 absolute bottom-6 left-6 font-mono-tech text-xs text-[#979CAB] hover:text-[#F4F5F8] transition-colors"
        >
          <span>SCROLL TO CHOREOGRAPHY</span>
          <ChevronDown className="w-4 h-4 text-[#9DEBFF]" />
        </a>
      </section>

      {/* ===================================================================
          SECTION C: CHOREOGRAPHED PRODUCT REVEAL
      =================================================================== */}
      <section
        id="product-reveal"
        ref={revealSectionRef}
        aria-label="Choreographed Product Reveal"
        className="py-20 lg:py-28 border-b border-[#DCE1EC]/10 bg-[#0C0F15]"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCE1EC]/10 pb-6">
            <div>
              <span className="font-mono-tech text-xs tracking-[0.2em] text-[#8B5CF6] uppercase">
                SPATIAL STORYTELLING SEQUENCE
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mt-2">
                Anatomy of Acoustic Purity
              </h2>
            </div>
            <p className="text-sm text-[#979CAB] max-w-md">
              Select or scroll through each perspective to inspect the exterior silhouette, coaxial beryllium lens, and internal force-cancelling architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Interactive Chapter Selector */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              {REVEAL_STAGES.map((stage, idx) => {
                const isSelected = activeStageIdx === idx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => handleSelectStage(idx)}
                    className={`w-full p-5 text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#131721] border-[#9DEBFF]'
                        : 'bg-[#06070A] border-[#DCE1EC]/10 hover:border-[#DCE1EC]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-tech text-xs">
                      <span className={isSelected ? 'text-[#9DEBFF]' : 'text-[#979CAB]'}>
                        {stage.step}. {stage.subtitle.toUpperCase()}
                      </span>
                      <span className="text-[#8B5CF6] uppercase">{stage.angle}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#F4F5F8] mt-1.5">
                      {stage.title}
                    </h3>
                    {isSelected && (
                      <p className="text-xs text-[#979CAB] mt-2 leading-relaxed">
                        {stage.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Reveal Description & Telemetry Panel */}
            <div className="lg:col-span-7 bg-[#06070A] border border-[#DCE1EC]/15 p-8 md:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono-tech text-xs text-[#9DEBFF]">
                  <span>STAGE {REVEAL_STAGES[activeStageIdx].step} / 05</span>
                  <span>CAMERA PRESET: {REVEAL_STAGES[activeStageIdx].angle.toUpperCase()}</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-semibold text-[#F4F5F8]">
                  {REVEAL_STAGES[activeStageIdx].title}
                </h3>
                <p className="text-base text-[#979CAB] leading-relaxed max-w-2xl">
                  {REVEAL_STAGES[activeStageIdx].description}
                </p>
              </div>

              {/* Architectural Telemetry Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#DCE1EC]/10">
                <div>
                  <span className="font-mono-tech text-xs text-[#979CAB] block">
                    WAVEFIELD DISPERSION
                  </span>
                  <span className="font-mono-tech text-2xl font-semibold text-[#F4F5F8] tabular-nums mt-1 block">
                    360° Omnidirectional
                  </span>
                </div>
                <div>
                  <span className="font-mono-tech text-xs text-[#979CAB] block">
                    CABINET RESONANCE
                  </span>
                  <span className="font-mono-tech text-2xl font-semibold text-[#9DEBFF] tabular-nums mt-1 block">
                    0.002% THD
                  </span>
                </div>
                <div>
                  <span className="font-mono-tech text-xs text-[#979CAB] block">
                    EXPLODED SEPARATION
                  </span>
                  <span className="font-mono-tech text-2xl font-semibold text-[#8B5CF6] tabular-nums mt-1 block">
                    {Math.round(REVEAL_STAGES[activeStageIdx].exploded * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#DCE1EC]/10">
                <span className="font-mono-tech text-xs text-[#979CAB]">
                  SYNCHRONIZED WITH 3D STUDIO CAMERA
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/craftsmanship')}
                  className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#9DEBFF] hover:text-[#F4F5F8] uppercase tracking-widest cursor-pointer"
                >
                  <span>Inspect 10-Part CAD Assembly</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION D: THE MATERIALS EXPERIENCE
      =================================================================== */}
      <section
        id="materials-experience"
        aria-label="Interactive Materials Exploration"
        className="py-20 lg:py-28 border-b border-[#DCE1EC]/10 bg-[#06070A]"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCE1EC]/10 pb-6">
            <div>
              <span className="font-mono-tech text-xs tracking-[0.2em] text-[#9DEBFF] uppercase">
                TACTILE METALLURGY & CRYSTAL OPTICS
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mt-2">
                The Materials Experience
              </h2>
            </div>
            <p className="text-sm text-[#979CAB] max-w-md">
              Select any primary shell architecture below to update the physical roughness, metalness, optical transmission, and pricing across the entire showroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MATERIALS.map((mat, index) => {
              const isSelected = config.materialId === mat.id;
              return (
                <div
                  key={mat.id}
                  className={`p-8 border flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#131721] border-[#9DEBFF]'
                      : 'bg-[#0C0F15] border-[#DCE1EC]/12 hover:border-[#DCE1EC]/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono-tech text-xs">
                      <span className="text-[#979CAB]">0{index + 1}. MATERIAL ARCHITECTURE</span>
                      <span className="text-[#9DEBFF] tabular-nums">
                        {mat.priceDelta === 0 ? 'INCLUDED' : `+${formatCurrency(mat.priceDelta)}`}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-[#F4F5F8]">
                      {mat.name}
                    </h3>

                    <p className="text-sm text-[#979CAB] leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#DCE1EC]/10 space-y-4">
                    <div className="grid grid-cols-3 gap-2 font-mono-tech text-xs">
                      <div>
                        <span className="text-[#979CAB] block text-[10px]">ROUGHNESS</span>
                        <span className="text-[#F4F5F8] tabular-nums">{mat.roughness.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[#979CAB] block text-[10px]">METALNESS</span>
                        <span className="text-[#F4F5F8] tabular-nums">{mat.metalness.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[#979CAB] block text-[10px]">REFRACTION</span>
                        <span className="text-[#F4F5F8] tabular-nums">{mat.ior.toFixed(2)} IOR</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMaterial(mat.id)}
                      aria-pressed={isSelected}
                      className={`w-full py-3 px-4 font-mono-tech text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#9DEBFF] text-[#06070A] font-semibold'
                          : 'bg-[#06070A] text-[#F4F5F8] border border-[#DCE1EC]/20 hover:border-[#9DEBFF]'
                      }`}
                    >
                      {isSelected ? `Active Material · ${mat.shortName}` : `Apply ${mat.shortName}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION E: PRODUCT CUSTOMIZATION
      =================================================================== */}
      <section
        id="configurator-section"
        aria-label="Bespoke Product Customization"
        className="py-20 lg:py-28 border-b border-[#DCE1EC]/10 bg-[#0C0F15]"
      >
        <div className="max-w-[1440px] mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono-tech text-xs tracking-[0.2em] text-[#8B5CF6] uppercase">
                INTERACTIVE 3D ATELIER
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mt-2">
                Configure Your Instrument
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/product')}
              className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#9DEBFF] hover:text-[#F4F5F8] uppercase tracking-widest cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open Full-Screen Studio View</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#06070A] border border-[#DCE1EC]/15 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#DCE1EC]/10 pb-4">
                <div>
                  <span className="font-mono-tech text-xs text-[#979CAB] block">
                    SELECTED SPECIMEN
                  </span>
                  <h3 className="font-display text-xl font-semibold text-[#F4F5F8] mt-0.5">
                    {details.colorway.name}
                  </h3>
                </div>
                <span
                  className="w-10 h-10 rounded-full border border-[#DCE1EC]/30"
                  style={{ background: details.colorway.swatchGradient }}
                />
              </div>

              <p className="text-sm text-[#979CAB] leading-relaxed">
                {details.colorway.description} Paired with {details.material.name} ({details.material.acousticDamping}).
              </p>

              <div className="space-y-2 pt-2 border-t border-[#DCE1EC]/10 font-mono-tech text-xs">
                <div className="flex justify-between">
                  <span className="text-[#979CAB]">MATERIAL FINISH</span>
                  <span className="text-[#F4F5F8]">{details.material.shortName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#979CAB]">ACOUSTIC EDITION</span>
                  <span className="text-[#F4F5F8]">{details.edition.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#979CAB]">SURFACE HARDNESS</span>
                  <span className="text-[#9DEBFF]">{details.material.surfaceHardness}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE1EC]/10 flex items-center justify-between">
                <span className="font-mono-tech text-xs text-[#979CAB]">
                  SHADERS & PBR SYNCED
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/product')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#9DEBFF] hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect in Full 3D Showroom</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ProductConfigurator />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECTION F: TECHNICAL SPECIFICATIONS
      =================================================================== */}
      <section
        id="specifications"
        aria-label="Technical Specifications"
        className="py-20 lg:py-28 border-b border-[#DCE1EC]/10 bg-[#06070A]"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <ProductSpecifications />
        </div>
      </section>

      {/* ===================================================================
          SECTION G: FINAL CONVERSION SECTION
      =================================================================== */}
      <section
        aria-label="Final Acquisition Conversion"
        className="py-24 lg:py-32 bg-[#0C0F15] relative overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-mono-tech text-xs tracking-[0.22em] text-[#9DEBFF] uppercase">
              ACQUISITION & BESPOKE COMMISSION
            </span>

            <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
              YOUR WORLD.
              <br />
              IN PERFECT DETAIL.
            </h2>

            <p className="text-base text-[#979CAB] max-w-xl leading-relaxed">
              Your configured AURELION ONE is assembled to order in Zurich and delivered with individual laser-interferometer calibration records.
            </p>

            {/* Configured Product Summary Card */}
            <div className="p-6 bg-[#131721] border border-[#DCE1EC]/15 max-w-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-tech text-[#979CAB]">
                <span>ACTIVE CONFIGURATION SUMMARY</span>
                <span className="text-[#9DEBFF]">{BRAND_CONFIG.modelCode}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <div>
                  <p className="font-display text-lg font-semibold text-[#F4F5F8]">
                    {details.colorway.name} · {details.material.shortName}
                  </p>
                  <p className="text-xs text-[#979CAB]">{details.edition.name}</p>
                </div>
                <p className="font-mono-tech text-2xl font-semibold text-[#F4F5F8] tabular-nums">
                  {formatCurrency(details.unitPrice)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                type="button"
                variant="secondary"
                cursorLabel="CONFIGURE"
                onClick={() => navigate('/product')}
              >
                CONFIGURE YOURS
              </MagneticButton>

              <MagneticButton
                type="button"
                variant="primary"
                cursorLabel="BAG"
                onClick={() => addToBag(config, 1, true)}
                icon={<ShoppingBag className="w-4 h-4" />}
              >
                ADD TO BAG · {formatCurrency(details.unitPrice)}
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#06070A] border border-[#DCE1EC]/15 p-8 space-y-6">
            <span className="font-mono-tech text-xs text-[#8B5CF6] uppercase tracking-widest">
              INCLUDED IN YOUR COMMISSION
            </span>
            <ul className="space-y-3 text-sm text-[#F4F5F8]">
              {details.edition.includedFeatures.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center justify-between py-2 border-b border-[#DCE1EC]/10"
                >
                  <span>{feat}</span>
                  <span className="font-mono-tech text-xs text-[#9DEBFF]">INCLUDED</span>
                </li>
              ))}
              <li className="flex items-center justify-between py-2 border-b border-[#DCE1EC]/10">
                <span>10-Year Transducer & Amplifier Guarantee</span>
                <span className="font-mono-tech text-xs text-[#9DEBFF]">STANDARD</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};
