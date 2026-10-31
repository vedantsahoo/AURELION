import React from 'react';
import { TECHNICAL_SPECIFICATIONS } from '../../data/productData';
import { useProduct } from '../../state/ProductContext';

export const ProductSpecifications: React.FC = () => {
  const { details } = useProduct();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DCE1EC]/15 pb-6">
        <div>
          <span className="font-mono-tech text-xs tracking-[0.2em] text-[#9DEBFF] uppercase">
            CONCEPT ENGINEERING DOSSIER
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[#F4F5F8] mt-2">
            Technical Specifications
          </h2>
        </div>
        <p className="font-mono-tech text-xs text-[#979CAB]">
          ACTIVE CONFIGURATION: {details.colorway.name.toUpperCase()} · {details.material.shortName.toUpperCase()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#DCE1EC]/10 border border-[#DCE1EC]/10">
        {TECHNICAL_SPECIFICATIONS.map((spec) => (
          <div
            key={spec.code}
            className="bg-[#06070A] p-6 md:p-8 flex flex-col justify-between space-y-4 hover:bg-[#0C0F15] transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-mono-tech text-[#979CAB]">
              <span>{spec.category}</span>
              <span className="text-[#8B5CF6]">{spec.code}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#979CAB]">
                {spec.label}
              </h3>
              <p className="font-display text-lg md:text-xl font-semibold text-[#F4F5F8] tabular-nums">
                {spec.value}
              </p>
            </div>

            <p className="text-xs text-[#979CAB] pt-3 border-t border-[#DCE1EC]/10">
              {spec.detail}
            </p>
          </div>
        ))}

        {/* Dynamic 8th cell reflecting currently selected material physics */}
        <div className="bg-[#0C0F15] p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-tech text-[#9DEBFF]">
            <span>SELECTED SHELL TELEMETRY</span>
            <span>SPEC-08</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#979CAB]">
              {details.material.name}
            </h3>
            <p className="font-display text-lg md:text-xl font-semibold text-[#F4F5F8] tabular-nums">
              {details.material.acousticDamping}
            </p>
          </div>

          <p className="text-xs text-[#979CAB] pt-3 border-t border-[#DCE1EC]/10">
            {details.material.origin} · {details.material.surfaceHardness}
          </p>
        </div>
      </div>
    </div>
  );
};
