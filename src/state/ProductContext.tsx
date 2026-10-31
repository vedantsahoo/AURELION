import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CameraAngleId,
  ColorwayId,
  EditionId,
  MaterialId,
} from '../data/productData';
import { getConfigurationDetails, ProductConfiguration } from '../utils/commerce';

interface ShaderParameters {
  energyIntensity: number;
  rippleFrequency: number;
  haloIridescence: number;
  acousticPulseActive: boolean;
}

interface ProductContextValue {
  config: ProductConfiguration;
  cameraAngle: CameraAngleId;
  explodedProgress: number;
  shaderParams: ShaderParameters;
  announcement: string;
  resetSignal: number;
  setMaterial: (id: MaterialId) => void;
  setColorway: (id: ColorwayId) => void;
  setEdition: (id: EditionId) => void;
  setCustomEngraving: (text: string) => void;
  setCameraAngle: (angle: CameraAngleId) => void;
  setExplodedProgress: (val: number) => void;
  setShaderParams: React.Dispatch<React.SetStateAction<ShaderParameters>>;
  resetCameraView: () => void;
  details: ReturnType<typeof getConfigurationDetails>;
}

const STORAGE_KEY = 'aurelion_one_product_config_v1';

const defaultConfig: ProductConfiguration = {
  materialId: 'titanium',
  colorwayId: 'obsidian',
  editionId: 'standard',
  customEngraving: '',
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ProductConfiguration>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultConfig, ...parsed };
      }
    } catch {
      // Fallback to default
    }
    return defaultConfig;
  });

  const [cameraAngle, setCameraAngleState] = useState<CameraAngleId>('hero');
  const [explodedProgress, setExplodedProgress] = useState<number>(0);
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [announcement, setAnnouncement] = useState<string>('');
  const [shaderParams, setShaderParams] = useState<ShaderParameters>({
    energyIntensity: 0.78,
    rippleFrequency: 3.2,
    haloIridescence: 0.85,
    acousticPulseActive: true,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }
  }, [config]);

  const details = useMemo(() => getConfigurationDetails(config), [config]);

  const setMaterial = (materialId: MaterialId) => {
    setConfig((prev) => {
      const next = { ...prev, materialId };
      const nextDetails = getConfigurationDetails(next);
      setAnnouncement(
        `Material updated to ${nextDetails.material.name}. Price is now $${nextDetails.unitPrice.toLocaleString()}.`
      );
      return next;
    });
  };

  const setColorway = (colorwayId: ColorwayId) => {
    setConfig((prev) => {
      const next = { ...prev, colorwayId };
      const nextDetails = getConfigurationDetails(next);
      setAnnouncement(
        `Finish colorway updated to ${nextDetails.colorway.name}. Price is now $${nextDetails.unitPrice.toLocaleString()}.`
      );
      return next;
    });
  };

  const setEdition = (editionId: EditionId) => {
    setConfig((prev) => {
      const next = { ...prev, editionId };
      const nextDetails = getConfigurationDetails(next);
      setAnnouncement(
        `Edition updated to ${nextDetails.edition.name}. Price is now $${nextDetails.unitPrice.toLocaleString()}.`
      );
      return next;
    });
  };

  const setCustomEngraving = (customEngraving: string) => {
    setConfig((prev) => ({ ...prev, customEngraving: customEngraving.slice(0, 18) }));
  };

  const setCameraAngle = (angle: CameraAngleId) => {
    setCameraAngleState(angle);
    setAnnouncement(`Camera perspective set to ${angle}.`);
  };

  const resetCameraView = () => {
    setCameraAngleState('hero');
    setExplodedProgress(0);
    setResetSignal((prev) => prev + 1);
    setAnnouncement('3D camera orientation and exploded view reset to default studio framing.');
  };

  return (
    <ProductContext.Provider
      value={{
        config,
        cameraAngle,
        explodedProgress,
        shaderParams,
        announcement,
        resetSignal,
        setMaterial,
        setColorway,
        setEdition,
        setCustomEngraving,
        setCameraAngle,
        setExplodedProgress,
        setShaderParams,
        resetCameraView,
        details,
      }}
    >
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </ProductContext.Provider>
  );
};

export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return ctx;
}
