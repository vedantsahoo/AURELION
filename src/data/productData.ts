export type MaterialId = 'titanium' | 'smoked-glass' | 'ceramic';
export type ColorwayId = 'obsidian' | 'gunmetal' | 'chrome' | 'aether';
export type EditionId = 'standard' | 'bespoke';
export type CameraAngleId = 'hero' | 'three-quarter' | 'macro' | 'silhouette' | 'top';

export interface MaterialOption {
  id: MaterialId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  origin: string;
  priceDelta: number;
  roughness: number;
  metalness: number;
  transmission: number;
  clearcoat: number;
  ior: number;
  anisotropy: number;
  acousticDamping: string;
  surfaceHardness: string;
}

export interface ColorwayOption {
  id: ColorwayId;
  name: string;
  code: string;
  description: string;
  priceDelta: number;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  rimHex: string;
  swatchGradient: string;
}

export interface EditionOption {
  id: EditionId;
  name: string;
  subtitle: string;
  description: string;
  priceDelta: number;
  includedFeatures: string[];
}

export interface CameraPreset {
  id: CameraAngleId;
  label: string;
  description: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface SpecificationItem {
  category: string;
  code: string;
  label: string;
  value: string;
  detail: string;
}

export interface CraftsmanshipSubsystem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  materialSpec: string;
  tolerance: string;
  description: string;
  cameraAngle: CameraAngleId;
  explodedTarget: number;
}

export const BRAND_CONFIG = {
  brandName: 'AURELION',
  productName: 'AURELION ONE',
  modelCode: 'A1-2035-PRO',
  releaseYear: '2035',
  basePrice: 4800,
  currency: 'USD',
  heroHeadline: ['ENGINEERED', 'BEYOND', 'ORDINARY.'],
  heroSubcopy: 'Precision, reimagined. Experience the next dimension of luxury.',
  closingHeadline: ['YOUR WORLD.', 'IN PERFECT DETAIL.'],
};

export const MATERIALS: MaterialOption[] = [
  {
    id: 'titanium',
    name: 'Grade-5 Brushed Titanium',
    shortName: 'Titanium',
    tagline: 'Aerospace-grade monocoque acoustic shell',
    description:
      'CNC-machined from a solid 42kg billet of Ti-6Al-4V titanium. Micro-anisotropic radial brushing disperses unwanted cabinet resonance while reflecting studio light with liquid precision.',
    origin: 'Cold-forged & 5-axis milled · Zurich Acoustic Foundry',
    priceDelta: 0,
    roughness: 0.2,
    metalness: 0.92,
    transmission: 0.0,
    clearcoat: 0.35,
    ior: 1.5,
    anisotropy: 0.85,
    acousticDamping: '99.4% Internal Standing-Wave Suppression',
    surfaceHardness: '349 HV Vickers Micro-Hardness',
  },
  {
    id: 'smoked-glass',
    name: 'Vapor-Deposited Smoked Glass',
    shortName: 'Smoked Glass',
    tagline: 'Optically attenuated boron-silicate acoustic crystal',
    description:
      'High-density boron-silicate crystal infused with metallic vapor deposition. Reveals the internal beryllium driver core and cryogenic copper coils under directional illumination.',
    origin: 'Kiln-formed & ion-strengthened · Jena Optical Works',
    priceDelta: 350,
    roughness: 0.08,
    metalness: 0.18,
    transmission: 0.88,
    clearcoat: 1.0,
    ior: 1.64,
    anisotropy: 0.1,
    acousticDamping: '98.9% Inert Amorphous Lattice',
    surfaceHardness: '680 HV Scratch-Resistant Coating',
  },
  {
    id: 'ceramic',
    name: 'Sintered Ceramic Composite',
    shortName: 'Ceramic Composite',
    tagline: 'Monolithic zirconia-carbide acoustic matrix',
    description:
      'Sintered at 1,520°C for 72 hours, our technical zirconia ceramic achieves diamond-like rigidity and an ultra-matte velvet tactile finish that eliminates harmonic coloration.',
    origin: 'Isostatically pressed · Kyoto Advanced Ceramics Lab',
    priceDelta: 600,
    roughness: 0.44,
    metalness: 0.28,
    transmission: 0.0,
    clearcoat: 0.72,
    ior: 2.15,
    anisotropy: 0.2,
    acousticDamping: '99.8% Zero-Flex Harmonic Isolation',
    surfaceHardness: '1,250 HV Zirconia Monolith',
  },
];

export const COLORWAYS: ColorwayOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Core',
    code: 'CLR-01 · OBS',
    description: 'Deep carbon-black PVD finish paired with electric violet field harmonics.',
    priceDelta: 0,
    primaryHex: '#12151E',
    secondaryHex: '#0A0C12',
    accentHex: '#8B5CF6',
    rimHex: '#9DEBFF',
    swatchGradient: 'linear-gradient(135deg, #161A26 0%, #06070A 65%, #8B5CF6 100%)',
  },
  {
    id: 'gunmetal',
    name: 'Gunmetal Eclipse',
    code: 'CLR-02 · GNM',
    description: 'Warm tungsten-slate metallic finish with restrained ice-blue telemetry accents.',
    priceDelta: 150,
    primaryHex: '#2B3140',
    secondaryHex: '#151922',
    accentHex: '#9DEBFF',
    rimHex: '#8B5CF6',
    swatchGradient: 'linear-gradient(135deg, #3A4254 0%, #151922 65%, #9DEBFF 100%)',
  },
  {
    id: 'chrome',
    name: 'Liquid Chrome',
    code: 'CLR-03 · CHR',
    description: 'Mirror-polished platinum-alloy surface with high-contrast obsidian acoustic fins.',
    priceDelta: 400,
    primaryHex: '#D0D7E6',
    secondaryHex: '#1A1F2C',
    accentHex: '#8B5CF6',
    rimHex: '#DCE1EC',
    swatchGradient: 'linear-gradient(135deg, #F4F5F8 0%, #8E96AA 65%, #8B5CF6 100%)',
  },
  {
    id: 'aether',
    name: 'Aether Violet',
    code: 'CLR-04 · AET',
    description: 'Anodized midnight-violet titanium with dual-spectrum ice-blue rim refraction.',
    priceDelta: 250,
    primaryHex: '#231C38',
    secondaryHex: '#0E0B18',
    accentHex: '#9DEBFF',
    rimHex: '#8B5CF6',
    swatchGradient: 'linear-gradient(135deg, #36285C 0%, #110D1E 65%, #9DEBFF 100%)',
  },
];

export const EDITIONS: EditionOption[] = [
  {
    id: 'standard',
    name: 'Studio Reference Array',
    subtitle: 'Autonomous 360° Spatial Wavefield',
    description: 'Complete holographic soundstage calibrated for architectural living spaces up to 120 m².',
    priceDelta: 0,
    includedFeatures: [
      'AURELION ONE Acoustic Monolith',
      'Braided Cryo-Copper Power Umbilical (3m)',
      'Machined Billet Remote Puck',
    ],
  },
  {
    id: 'bespoke',
    name: 'Bespoke Acoustic Calibration Edition',
    subtitle: 'Includes Laser-Interferometer Room Mapping & Flight Case',
    description: 'Engineered for private listening rooms with custom room-mode compensation and serialized titanium plaque.',
    priceDelta: 950,
    includedFeatures: [
      'AURELION ONE Acoustic Monolith (Custom Engraved)',
      'Laser-Interferometer Room Calibration Kit',
      'Hermetic Carbon-Titanium Flight Case',
      'Priority Acoustic Concierge Provisioning',
    ],
  },
];

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'hero',
    label: 'Hero Framing',
    description: 'Balanced architectural front-three-quarter perspective.',
    position: [0, 0.35, 4.3],
    target: [0, 0.05, 0],
    fov: 38,
  },
  {
    id: 'three-quarter',
    label: 'Three-Quarter',
    description: 'Sculptural profile emphasizing the toroidal acoustic fins.',
    position: [2.9, 1.0, 3.1],
    target: [0, 0.05, 0],
    fov: 36,
  },
  {
    id: 'macro',
    label: 'Macro Surface',
    description: 'Close-range inspection of the coaxial beryllium waveguide and finish grain.',
    position: [0.65, 0.38, 2.05],
    target: [0, 0.15, 0],
    fov: 30,
  },
  {
    id: 'silhouette',
    label: 'Rim Silhouette',
    description: 'Low-angle dramatic profile showcasing volumetric rim lighting.',
    position: [-2.8, -0.45, 3.0],
    target: [0, 0.1, 0],
    fov: 35,
  },
  {
    id: 'top',
    label: 'Zenith Crown',
    description: 'Overhead view of the capacitive glass control dial and radial louver geometry.',
    position: [0.1, 3.8, 1.3],
    target: [0, 0, 0],
    fov: 34,
  },
];

export const TECHNICAL_SPECIFICATIONS: SpecificationItem[] = [
  {
    category: 'IDENTIFICATION',
    code: 'SPEC-01',
    label: 'Product Model',
    value: 'AURELION ONE · Series A1-2035',
    detail: 'Fictional concept autonomous spatial acoustic instrument',
  },
  {
    category: 'CONSTRUCTION',
    code: 'SPEC-02',
    label: 'Primary Materials',
    value: 'Grade-5 Ti-6Al-4V · Borosilicate · Zirconia',
    detail: '36 radial CNC damping blades with isolated elastomer plinth',
  },
  {
    category: 'GEOMETRY',
    code: 'SPEC-03',
    label: 'Dimensions',
    value: '340 × 340 × 418 mm',
    detail: 'Footprint diameter 260 mm · Omnidirectional dispersion',
  },
  {
    category: 'MASS',
    code: 'SPEC-04',
    label: 'Total Weight',
    value: '18.4 kg (40.5 lbs)',
    detail: 'Solid billet mass-loaded base prevents micro-vibrations',
  },
  {
    category: 'ACOUSTICS',
    code: 'SPEC-05',
    label: 'Frequency & Output',
    value: '12 Hz – 48 kHz (±0.5 dB) · 1,450 W RMS',
    detail: '14 neodymium transducers · Dual force-cancelling sub-bass woofers · 116 dB SPL',
  },
  {
    category: 'POWER & THERMAL',
    code: 'SPEC-06',
    label: 'Power Architecture',
    value: '100–240V AC + 18-Hour Solid-State Reserve',
    detail: 'Passive radial fin convection cooling (0 dBA fanless operation)',
  },
  {
    category: 'CONNECTIVITY',
    code: 'SPEC-07',
    label: 'Spatial Protocols',
    value: 'Ultra-Wideband Optical · Wi-Fi 8 · AES67 · 32-bit/768kHz',
    detail: 'Sub-microsecond multi-room phase lock & room-mode LIDAR mapping',
  },
];

export const CRAFTSMANSHIP_SUBSYSTEMS: CraftsmanshipSubsystem[] = [
  {
    id: 'chassis',
    index: '01',
    title: '5-Axis Monolithic Toroid',
    subtitle: 'Zero-Seam Acoustic Enclosure',
    materialSpec: 'Ti-6Al-4V Forged Billet',
    tolerance: '±0.004 mm CNC Tolerance',
    description:
      'Carved over 19 hours from a single forged block, the toroidal core eliminates parallel interior walls and standing acoustic waves completely.',
    cameraAngle: 'three-quarter',
    explodedTarget: 0.25,
  },
  {
    id: 'waveguide',
    index: '02',
    title: 'Pure Beryllium Coaxial Driver',
    subtitle: 'High-Frequency Phase Lens',
    materialSpec: 'Vapor-Deposited 99.9% Beryllium Dome',
    tolerance: '0.018 g Moving Mass',
    description:
      'Positioned at the exact acoustic center of the sculpture, the coaxial tweeter projects transient harmonics up to 48 kHz without lobing or phase distortion.',
    cameraAngle: 'macro',
    explodedTarget: 0.6,
  },
  {
    id: 'louvers',
    index: '03',
    title: '36-Blade Radial Heatsink Array',
    subtitle: 'Passive Thermal & Diffractive Fins',
    materialSpec: 'Anodized Acoustic Alloy',
    tolerance: '10.0° Angular Pitch Precision',
    description:
      'Each of the 36 radial blades serves a dual purpose: dissipating 1,450W of Class-AD amplifier heat silently while acting as an acoustic wave diffraction grating.',
    cameraAngle: 'top',
    explodedTarget: 0.45,
  },
  {
    id: 'woofers',
    index: '04',
    title: 'Force-Cancelling Sub-Bass Twin Core',
    subtitle: 'Opposing Long-Throw Actuators',
    materialSpec: 'Carbon-Rohacell Sandwich Cone',
    tolerance: '±28 mm Peak-to-Peak Excursion',
    description:
      'Mounted back-to-back along a rigid titanium spine, dual sub-bass drivers cancel Newton-level mechanical cabinet reaction forces while reaching down to 12 Hz.',
    cameraAngle: 'silhouette',
    explodedTarget: 0.85,
  },
  {
    id: 'dsp',
    index: '05',
    title: 'Quantum DSP & Cryo-Copper Core',
    subtitle: 'Real-Time Room Wavefield Synthesis',
    materialSpec: 'Oxygen-Free Cryogenic Copper + Sapphire Substrate',
    tolerance: '0.4 ns Jitter Floor',
    description:
      'Samples room reflections 96,000 times per second, continuously adapting phase and dispersion to match listener geometry.',
    cameraAngle: 'hero',
    explodedTarget: 1.0,
  },
];
