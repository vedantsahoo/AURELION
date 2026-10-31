import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Radio, Waves, Sliders, ArrowRight } from 'lucide-react';
import { MATERIALS } from '../data/productData';
import { useProduct } from '../state/ProductContext';
import { ProductScene } from '../scenes/ProductScene';
import { MagneticButton } from '../components/ui/MagneticButton';

export const TechnologyPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    config,
    shaderParams,
    setShaderParams,
    setMaterial,
    setCameraAngle,
    details,
  } = useProduct();

  return (
    <main className="bg-[#06070A] text-[#F4F5F8] pt-20">
      {/* Hero & Interactive Shader Lab */}
      <section className="max-w-[1440px] mx-auto px-6 py-12 lg:py-16 border-b border-[#DCE1EC]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono-tech text-xs tracking-[0.2em] text-[#9DEBFF] uppercase">
              ACOUSTIC PHYSICS & REAL-TIME GLSL SHADERS
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.06]">
              Wavefield Synthesis Meets Liquid Metallurgy.
            </h1>
            <p className="text-base text-[#979CAB] leading-relaxed">
              AURELION ONE pairs 14 neodymium transducers with real-time spatial room mapping. Interact with the live GLSL shader uniforms below to observe how our acoustic energy field and Fresnel halo respond to harmonic excitation.
            </p>

            {/* Live Shader Uniform Controls */}
            <div className="bg-[#0C0F15] border border-[#DCE1EC]/15 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#DCE1EC]/10 pb-3">
                <span className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase text-[#9DEBFF]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Interactive GLSL Shader Telemetry</span>
                </span>
                <span className="font-mono-tech text-xs text-[#979CAB]">
                  REAL-TIME GPU UNIFORMS
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-mono-tech text-xs mb-1">
                    <label htmlFor="shader-intensity">
                      SHADER 01 · ENERGY FIELD INTENSITY
                    </label>
                    <span className="text-[#9DEBFF] tabular-nums">
                      {Math.round(shaderParams.energyIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    id="shader-intensity"
                    type="range"
                    min={0.1}
                    max={1.5}
                    step={0.05}
                    value={shaderParams.energyIntensity}
                    onChange={(e) =>
                      setShaderParams((prev) => ({
                        ...prev,
                        energyIntensity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#8B5CF6] bg-[#131721] h-1.5 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono-tech text-xs mb-1">
                    <label htmlFor="shader-frequency">
                      SHADER 01 · RIPPLE HARMONIC FREQUENCY
                    </label>
                    <span className="text-[#9DEBFF] tabular-nums">
                      {shaderParams.rippleFrequency.toFixed(1)} Hz
                    </span>
                  </div>
                  <input
                    id="shader-frequency"
                    type="range"
                    min={1.0}
                    max={6.0}
                    step={0.2}
                    value={shaderParams.rippleFrequency}
                    onChange={(e) =>
                      setShaderParams((prev) => ({
                        ...prev,
                        rippleFrequency: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#9DEBFF] bg-[#131721] h-1.5 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono-tech text-xs mb-1">
                    <label htmlFor="shader-iridescence">
                      SHADER 02 · LIQUID CHROME FRESNEL IRIDESCENCE
                    </label>
                    <span className="text-[#9DEBFF] tabular-nums">
                      {Math.round(shaderParams.haloIridescence * 100)}%
                    </span>
                  </div>
                  <input
                    id="shader-iridescence"
                    type="range"
                    min={0.1}
                    max={1.4}
                    step={0.05}
                    value={shaderParams.haloIridescence}
                    onChange={(e) =>
                      setShaderParams((prev) => ({
                        ...prev,
                        haloIridescence: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-[#8B5CF6] bg-[#131721] h-1.5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#DCE1EC]/10">
                  <span className="font-mono-tech text-xs text-[#979CAB]">
                    TRANSDUCER EXCURSION OSCILLATION
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setShaderParams((prev) => ({
                        ...prev,
                        acousticPulseActive: !prev.acousticPulseActive,
                      }))
                    }
                    aria-pressed={shaderParams.acousticPulseActive}
                    className={`px-3 py-1.5 font-mono-tech text-xs uppercase cursor-pointer ${
                      shaderParams.acousticPulseActive
                        ? 'bg-[#9DEBFF] text-[#06070A] font-semibold'
                        : 'bg-[#131721] text-[#979CAB] border border-[#DCE1EC]/20'
                    }`}
                  >
                    {shaderParams.acousticPulseActive ? 'Active (3.6 Hz)' : 'Paused'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 h-[440px] sm:h-[520px] bg-[#0C0F15] border border-[#DCE1EC]/15 relative">
            <ProductScene interactive={true} />
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                type="button"
                onClick={() => setCameraAngle('macro')}
                className="px-3 py-1.5 bg-[#06070A]/90 border border-[#DCE1EC]/20 font-mono-tech text-xs text-[#9DEBFF] cursor-pointer"
              >
                Inspect Waveguide Lens
              </button>
              <button
                type="button"
                onClick={() => setCameraAngle('hero')}
                className="px-3 py-1.5 bg-[#06070A]/90 border border-[#DCE1EC]/20 font-mono-tech text-xs text-[#F4F5F8] cursor-pointer"
              >
                Full Field View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Pillars */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 border-b border-[#DCE1EC]/10 space-y-12">
        <div className="space-y-2">
          <span className="font-mono-tech text-xs tracking-[0.2em] text-[#8B5CF6] uppercase">
            THREE PROPRIETARY SUBSYSTEMS
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Acoustic Engineering Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[#0C0F15] border border-[#DCE1EC]/12 space-y-4">
            <Waves className="w-6 h-6 text-[#9DEBFF]" />
            <span className="font-mono-tech text-xs text-[#979CAB] block">
              01. HOLOGRAPHIC DISPERSION
            </span>
            <h3 className="font-display text-xl font-semibold">
              14-Driver Wavefield Array
            </h3>
            <p className="text-sm text-[#979CAB] leading-relaxed">
              Instead of beaming sound along a narrow sweet spot, AURELION ONE synthesizes an acoustic wavefront across 360 degrees, maintaining phase coherence within 0.08 milliseconds across any room layout.
            </p>
          </div>

          <div className="p-8 bg-[#0C0F15] border border-[#DCE1EC]/12 space-y-4">
            <Cpu className="w-6 h-6 text-[#8B5CF6]" />
            <span className="font-mono-tech text-xs text-[#979CAB] block">
              02. QUANTUM DSP TELEMETRY
            </span>
            <h3 className="font-display text-xl font-semibold">
              96 kHz Continuous Room Mapping
            </h3>
            <p className="text-sm text-[#979CAB] leading-relaxed">
              Four concealed laser-interferometer microphones measure boundary reflections from glass, concrete, and timber walls in real time, neutralizing room modes down to 12 Hz.
            </p>
          </div>

          <div className="p-8 bg-[#0C0F15] border border-[#DCE1EC]/12 space-y-4">
            <Radio className="w-6 h-6 text-[#9DEBFF]" />
            <span className="font-mono-tech text-xs text-[#979CAB] block">
              03. ZERO-VIBRATION CHASSIS
            </span>
            <h3 className="font-display text-xl font-semibold">
              Opposing Force Cancellation
            </h3>
            <p className="text-sm text-[#979CAB] leading-relaxed">
              Dual long-throw sub-bass actuators are locked back-to-back along a forged titanium spine. Equal and opposite mechanical forces cancel completely, leaving the outer shell dead silent.
            </p>
          </div>
        </div>
      </section>

      {/* Material Acoustic Matrix */}
      <section className="max-w-[1440px] mx-auto px-6 py-20 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono-tech text-xs tracking-[0.2em] text-[#9DEBFF] uppercase">
              METALLURGICAL COMPARISON
            </span>
            <h2 className="font-display text-3xl font-semibold mt-1">
              Material Acoustic Performance Matrix
            </h2>
          </div>
          <MagneticButton
            type="button"
            variant="primary"
            onClick={() => navigate('/product')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            CONFIGURE {details.material.shortName.toUpperCase()}
          </MagneticButton>
        </div>

        <div className="overflow-x-auto border border-[#DCE1EC]/15">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0C0F15] border-b border-[#DCE1EC]/15 font-mono-tech text-xs text-[#979CAB] uppercase">
                <th className="p-4">Material Architecture</th>
                <th className="p-4">Acoustic Damping</th>
                <th className="p-4">Vickers Hardness</th>
                <th className="p-4">Refractive / Metallic Index</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE1EC]/10 text-sm">
              {MATERIALS.map((mat) => {
                const selected = config.materialId === mat.id;
                return (
                  <tr
                    key={mat.id}
                    className={selected ? 'bg-[#131721]' : 'bg-[#06070A]'}
                  >
                    <td className="p-4 font-display font-semibold text-[#F4F5F8]">
                      {mat.name}
                    </td>
                    <td className="p-4 font-mono-tech text-xs text-[#9DEBFF] tabular-nums">
                      {mat.acousticDamping}
                    </td>
                    <td className="p-4 font-mono-tech text-xs text-[#F4F5F8] tabular-nums">
                      {mat.surfaceHardness}
                    </td>
                    <td className="p-4 font-mono-tech text-xs text-[#979CAB] tabular-nums">
                      Roughness {mat.roughness} · Metalness {mat.metalness} · {mat.ior} IOR
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => setMaterial(mat.id)}
                        className={`px-3 py-1.5 font-mono-tech text-xs uppercase cursor-pointer ${
                          selected
                            ? 'bg-[#9DEBFF] text-[#06070A] font-semibold'
                            : 'bg-[#0C0F15] text-[#F4F5F8] border border-[#DCE1EC]/20 hover:border-[#9DEBFF]'
                        }`}
                      >
                        {selected ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
