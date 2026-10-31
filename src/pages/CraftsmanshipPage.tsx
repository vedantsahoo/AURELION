import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CRAFTSMANSHIP_SUBSYSTEMS } from '../data/productData';
import { useProduct } from '../state/ProductContext';
import { ProductScene } from '../scenes/ProductScene';
import { MagneticButton } from '../components/ui/MagneticButton';

export const CraftsmanshipPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    explodedProgress,
    setCameraAngle,
    setExplodedProgress,
    resetCameraView,
  } = useProduct();

  const [selectedSubsystemId, setSelectedSubsystemId] = useState<string>(
    CRAFTSMANSHIP_SUBSYSTEMS[0].id
  );

  const activeSubsystem =
    CRAFTSMANSHIP_SUBSYSTEMS.find((s) => s.id === selectedSubsystemId) ||
    CRAFTSMANSHIP_SUBSYSTEMS[0];

  const handleSelectSubsystem = (sub: (typeof CRAFTSMANSHIP_SUBSYSTEMS)[0]) => {
    setSelectedSubsystemId(sub.id);
    setCameraAngle(sub.cameraAngle);
    setExplodedProgress(sub.explodedTarget);
  };

  return (
    <main className="bg-[#06070A] text-[#F4F5F8] pt-20">
      {/* Header & Interactive Exploded CAD Assembly Inspector */}
      <section className="max-w-[1440px] mx-auto px-6 py-12 lg:py-16 border-b border-[#DCE1EC]/10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCE1EC]/10 pb-6">
          <div>
            <span className="font-mono-tech text-xs tracking-[0.2em] text-[#9DEBFF] uppercase">
              5-AXIS CNC METALLURGY & HAND-CALIBRATED OPTICS
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mt-2">
              Craftsmanship & Construction
            </h1>
          </div>
          <p className="text-sm text-[#979CAB] max-w-md">
            Inspect the five internal and external architectural subsystems of AURELION ONE. Selecting any subsystem aligns the studio camera and separates the 3D CAD assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 5 Architectural Subsystems */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {CRAFTSMANSHIP_SUBSYSTEMS.map((sub) => {
              const isSelected = sub.id === selectedSubsystemId;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSubsystem(sub)}
                  className={`p-5 border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#131721] border-[#9DEBFF]'
                      : 'bg-[#0C0F15] border-[#DCE1EC]/12 hover:border-[#DCE1EC]/30'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono-tech text-xs">
                    <span className={isSelected ? 'text-[#9DEBFF]' : 'text-[#979CAB]'}>
                      {sub.index}. {sub.subtitle.toUpperCase()}
                    </span>
                    <span className="text-[#8B5CF6] tabular-nums">{sub.tolerance}</span>
                  </div>
                  <h2 className="font-display text-lg font-semibold text-[#F4F5F8] mt-1">
                    {sub.title}
                  </h2>
                  {isSelected && (
                    <p className="text-xs text-[#979CAB] mt-2 leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Live 3D Exploded View Stage + Active Subsystem Dossier */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#0C0F15] border border-[#DCE1EC]/15 p-6 space-y-6">
            <div className="h-[380px] sm:h-[440px] w-full bg-[#06070A] border border-[#DCE1EC]/10 relative">
              <ProductScene interactive={true} />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExplodedProgress(explodedProgress > 0.5 ? 0 : 1)}
                  className="px-3 py-1.5 bg-[#0C0F15]/90 border border-[#DCE1EC]/20 font-mono-tech text-xs text-[#9DEBFF] cursor-pointer"
                >
                  {explodedProgress > 0.5 ? 'Collapse Assembly' : 'Full Exploded View'}
                </button>
                <button
                  type="button"
                  onClick={resetCameraView}
                  className="px-3 py-1.5 bg-[#0C0F15]/90 border border-[#DCE1EC]/20 font-mono-tech text-xs text-[#F4F5F8] cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="p-5 bg-[#131721] border border-[#DCE1EC]/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono-tech text-xs">
                <span className="text-[#9DEBFF]">
                  SUBSYSTEM {activeSubsystem.index} · {activeSubsystem.materialSpec}
                </span>
                <span className="text-[#F4F5F8] tabular-nums">
                  TOLERANCE: {activeSubsystem.tolerance}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold">
                {activeSubsystem.title}
              </h3>
              <p className="text-sm text-[#979CAB] leading-relaxed">
                {activeSubsystem.description}
              </p>

              <div className="pt-3 border-t border-[#DCE1EC]/10 flex items-center gap-4">
                <label
                  htmlFor="craft-exploded-range"
                  className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#979CAB] whitespace-nowrap"
                >
                  <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>ASSEMBLY SEPARATION</span>
                </label>
                <input
                  id="craft-exploded-range"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explodedProgress}
                  onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
                  className="flex-1 accent-[#9DEBFF] h-1.5 bg-[#06070A] cursor-pointer"
                />
                <span className="font-mono-tech text-xs text-[#9DEBFF] tabular-nums">
                  {Math.round(explodedProgress * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy & Provenance */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-[#0C0F15] border border-[#DCE1EC]/12 space-y-3">
            <CheckCircle2 className="w-5 h-5 text-[#9DEBFF]" />
            <span className="font-mono-tech text-xs text-[#979CAB] block">
              STAGE 01 · ZURICH FOUNDRY
            </span>
            <h3 className="font-display text-xl font-semibold">
              19-Hour Billet Milling
            </h3>
            <p className="text-sm text-[#979CAB] leading-relaxed">
              Every titanium chassis begins as a 42 kg aerospace billet. Five-axis diamond tooling carves the internal acoustic labyrinths to a tolerance of four microns.
            </p>
          </div>

          <div className="p-8 bg-[#0C0F15] border border-[#DCE1EC]/12 space-y-3">
            <CheckCircle2 className="w-5 h-5 text-[#8B5CF6]" />
            <span className="font-mono-tech text-xs text-[#979CAB] block">
              STAGE 02 · JENA OPTICS
            </span>
            <h3 className="font-display text-xl font-semibold">
              Vapor-Deposited Visor
            </h3>
            <p className="text-sm text-[#979CAB] leading-relaxed">
              The smoked borosilicate dome undergoes 14 hours of potassium-ion exchange strengthening followed by vacuum metallic vapor deposition.
            </p>
          </div>

          <div className="p-8 bg-[#0C0F15] border border-[#DCE1EC]/12 space-y-3">
            <CheckCircle2 className="w-5 h-5 text-[#9DEBFF]" />
            <span className="font-mono-tech text-xs text-[#979CAB] block">
              STAGE 03 · ANECHOIC CERTIFICATION
            </span>
            <h3 className="font-display text-xl font-semibold">
              Individual Laser Sign-Off
            </h3>
            <p className="text-sm text-[#979CAB] leading-relaxed">
              Before leaving our Zurich atelier, each unit is swept across 12 Hz to 48 kHz in a subterranean anechoic chamber and engraved with its serial reference.
            </p>
          </div>
        </div>

        <div className="p-8 bg-[#131721] border border-[#DCE1EC]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-semibold">
              Commission Your Bespoke Specification
            </h3>
            <p className="text-sm text-[#979CAB] mt-1">
              Proceed to the 3D configurator to select your colorway, shell architecture, and plinth engraving.
            </p>
          </div>
          <MagneticButton
            type="button"
            variant="primary"
            onClick={() => navigate('/product')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            OPEN 3D CONFIGURATOR
          </MagneticButton>
        </div>
      </section>
    </main>
  );
};
