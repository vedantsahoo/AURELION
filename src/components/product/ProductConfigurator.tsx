import React from 'react';
import { RotateCcw, ShoppingBag, Check, Layers, Camera } from 'lucide-react';
import {
  CAMERA_PRESETS,
  COLORWAYS,
  EDITIONS,
  MATERIALS,
} from '../../data/productData';
import { useProduct } from '../../state/ProductContext';
import { useCart } from '../../state/CartContext';
import { formatCurrency } from '../../utils/commerce';
import { MagneticButton } from '../ui/MagneticButton';

interface ProductConfiguratorProps {
  compact?: boolean;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  compact = false,
}) => {
  const {
    config,
    cameraAngle,
    explodedProgress,
    setMaterial,
    setColorway,
    setEdition,
    setCustomEngraving,
    setCameraAngle,
    setExplodedProgress,
    resetCameraView,
    details,
  } = useProduct();
  const { addToBag } = useCart();

  const handleAddToBag = () => {
    addToBag(config, 1, true);
  };

  return (
    <div className="bg-[#0C0F15] border border-[#DCE1EC]/15 p-6 md:p-8 space-y-7 text-[#F4F5F8]">
      {/* Header & Live Price Summary */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#DCE1EC]/10 pb-5">
        <div>
          <span className="font-mono-tech text-xs text-[#9DEBFF] uppercase tracking-widest">
            BESPOKE STUDIO CONFIGURATOR
          </span>
          <h3 className="font-display text-2xl font-semibold tracking-tight mt-1">
            AURELION ONE
          </h3>
          <p
            data-testid="configurator-summary-label"
            className="text-xs text-[#979CAB] mt-1"
          >
            {details.summaryLabel}
          </p>
        </div>
        <div className="sm:text-right">
          <span className="font-mono-tech text-[11px] text-[#979CAB] block uppercase">
            CONFIGURED PRICE
          </span>
          <span
            data-testid="configurator-price"
            className="font-mono-tech text-2xl md:text-3xl font-semibold text-[#F4F5F8] tabular-nums"
          >
            {formatCurrency(details.unitPrice)}
          </span>
        </div>
      </div>

      {/* 1. Colorway Selection (4 options) */}
      <div className="space-y-3" role="radiogroup" aria-label="Colorway selection">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono-tech uppercase tracking-wider text-[#979CAB]">
            01. Finish Colorway
          </span>
          <span className="font-medium text-[#F4F5F8]">{details.colorway.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COLORWAYS.map((col) => {
            const selected = config.colorwayId === col.id;
            return (
              <button
                key={col.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setColorway(col.id)}
                className={`group flex flex-col items-start p-3 border text-left transition-all cursor-pointer ${
                  selected
                    ? 'bg-[#131721] border-[#9DEBFF]'
                    : 'bg-[#06070A] border-[#DCE1EC]/12 hover:border-[#DCE1EC]/35'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className="w-6 h-6 rounded-full border border-[#DCE1EC]/30"
                    style={{ background: col.swatchGradient }}
                    aria-hidden="true"
                  />
                  {selected && <Check className="w-3.5 h-3.5 text-[#9DEBFF]" />}
                </div>
                <span className="font-display text-xs font-semibold text-[#F4F5F8] whitespace-nowrap">
                  {col.name}
                </span>
                <span className="font-mono-tech text-[11px] text-[#979CAB] tabular-nums">
                  {col.priceDelta === 0 ? 'Included' : `+${formatCurrency(col.priceDelta)}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Material & Acoustic Shell Selection (3 options) */}
      <div className="space-y-3" role="radiogroup" aria-label="Material selection">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono-tech uppercase tracking-wider text-[#979CAB]">
            02. Primary Shell Material
          </span>
          <span className="font-medium text-[#F4F5F8]">{details.material.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MATERIALS.map((mat) => {
            const selected = config.materialId === mat.id;
            return (
              <button
                key={mat.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMaterial(mat.id)}
                className={`p-3.5 border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selected
                    ? 'bg-[#131721] border-[#8B5CF6]'
                    : 'bg-[#06070A] border-[#DCE1EC]/12 hover:border-[#DCE1EC]/35'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs font-semibold text-[#F4F5F8]">
                      {mat.shortName}
                    </span>
                    <span className="font-mono-tech text-[11px] text-[#9DEBFF] tabular-nums">
                      {mat.priceDelta === 0 ? 'Base' : `+${formatCurrency(mat.priceDelta)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#979CAB] mt-1.5 leading-relaxed">
                    {mat.tagline}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#DCE1EC]/10 font-mono-tech text-[10px] text-[#979CAB]">
                  {mat.surfaceHardness}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Acoustic Edition Selection */}
      {!compact && (
        <div className="space-y-3" role="radiogroup" aria-label="Acoustic edition selection">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono-tech uppercase tracking-wider text-[#979CAB]">
              03. Acoustic Provisioning Edition
            </span>
            <span className="font-medium text-[#F4F5F8]">{details.edition.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EDITIONS.map((ed) => {
              const selected = config.editionId === ed.id;
              return (
                <button
                  key={ed.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setEdition(ed.id)}
                  className={`p-4 border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#131721] border-[#9DEBFF]'
                      : 'bg-[#06070A] border-[#DCE1EC]/12 hover:border-[#DCE1EC]/35'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs font-semibold text-[#F4F5F8]">
                      {ed.name}
                    </span>
                    <span className="font-mono-tech text-xs text-[#9DEBFF] tabular-nums">
                      {ed.priceDelta === 0 ? 'Included' : `+${formatCurrency(ed.priceDelta)}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#979CAB] mt-1">{ed.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Camera View-Angle Presets & Exploded CAD Control */}
      <div className="space-y-4 pt-2 border-t border-[#DCE1EC]/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-wider text-[#979CAB]">
            <Camera className="w-3.5 h-3.5 text-[#9DEBFF]" />
            <span>Studio Camera Angle</span>
          </span>
          <button
            type="button"
            onClick={resetCameraView}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono-tech text-[#979CAB] hover:text-[#F4F5F8] bg-[#131721] border border-[#DCE1EC]/15 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset View</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {CAMERA_PRESETS.map((preset) => {
            const active = cameraAngle === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setCameraAngle(preset.id)}
                className={`px-3 py-1.5 text-xs font-mono-tech uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#8B5CF6] text-[#F4F5F8]'
                    : 'bg-[#131721] text-[#979CAB] hover:text-[#F4F5F8] border border-[#DCE1EC]/10'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="exploded-slider"
              className="inline-flex items-center gap-2 font-mono-tech uppercase text-[#979CAB]"
            >
              <Layers className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Exploded Acoustic Architecture</span>
            </label>
            <span className="font-mono-tech text-xs text-[#9DEBFF] tabular-nums">
              {Math.round(explodedProgress * 100)}%
            </span>
          </div>
          <input
            id="exploded-slider"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={explodedProgress}
            onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
            className="w-full accent-[#8B5CF6] bg-[#131721] h-1.5 cursor-pointer"
          />
        </div>

        {!compact && (
          <div className="pt-2">
            <label
              htmlFor="custom-engraving-input"
              className="block font-mono-tech text-xs uppercase text-[#979CAB] mb-1.5"
            >
              Optional Plinth Laser Engraving (Max 18 Chars)
            </label>
            <input
              id="custom-engraving-input"
              type="text"
              maxLength={18}
              value={config.customEngraving || ''}
              onChange={(e) => setCustomEngraving(e.target.value)}
              placeholder="E.G. STUDIO ZURICH 01"
              className="w-full px-3.5 py-2 bg-[#06070A] border border-[#DCE1EC]/15 text-xs font-mono-tech text-[#F4F5F8] uppercase tracking-wider focus:border-[#9DEBFF]"
            />
          </div>
        )}
      </div>

      {/* Primary Action */}
      <div className="pt-3 border-t border-[#DCE1EC]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs text-[#979CAB]">
          <span>In Stock · Built to Order in 5 Business Days</span>
        </div>
        <MagneticButton
          type="button"
          variant="primary"
          cursorLabel="ADD"
          onClick={handleAddToBag}
          icon={<ShoppingBag className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          ADD TO BAG · {formatCurrency(details.unitPrice)}
        </MagneticButton>
      </div>
    </div>
  );
};
