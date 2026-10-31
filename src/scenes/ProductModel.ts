import * as THREE from 'three';
import {
  COLORWAYS,
  MATERIALS,
  ColorwayId,
  MaterialId,
} from '../data/productData';
import {
  liquidChromeFragmentShader,
  liquidChromeVertexShader,
} from './shaders/liquidChrome';
import {
  energyFieldFragmentShader,
  energyFieldVertexShader,
} from './shaders/energyField';

export interface AurelionModelHandle {
  rootGroup: THREE.Group;
  productGroup: THREE.Group;
  energyBackdropMesh: THREE.Mesh;
  update: (
    dt: number,
    elapsedTime: number,
    pointerX: number,
    pointerY: number,
    explodedTarget: number,
    shaderParams: {
      energyIntensity: number;
      rippleFrequency: number;
      haloIridescence: number;
      acousticPulseActive: boolean;
    }
  ) => void;
  applyConfiguration: (
    materialId: MaterialId,
    colorwayId: ColorwayId,
    isSoftwareGl: boolean
  ) => void;
  dispose: () => void;
}

// Procedural Canvas Texture 1: Brushed Anisotropic Micro-Grain Bump Map
function createBrushedMetalBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) {
      const lum = Math.floor(115 + Math.sin(y * 0.9) * 18 + ((y * 17) % 19));
      ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
      ctx.fillRect(0, y, 256, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

// Procedural Canvas Texture 2: Acoustic Waveguide Precision Dial Albedo
function createWaveguideDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#090B10';
    ctx.fillRect(0, 0, 512, 512);

    const cx = 256;
    const cy = 256;

    // Concentric acoustic lens rings
    for (let r = 36; r <= 230; r += 24) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = r === 132 ? 'rgba(157, 235, 255, 0.55)' : 'rgba(220, 225, 236, 0.18)';
      ctx.lineWidth = r === 132 ? 2 : 1;
      ctx.stroke();
    }

    // 72 Radial degree ticks
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const innerR = i % 6 === 0 ? 190 : 204;
      const outerR = 220;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.strokeStyle = i % 6 === 0 ? 'rgba(139, 92, 246, 0.75)' : 'rgba(220, 225, 236, 0.22)';
      ctx.lineWidth = i % 6 === 0 ? 2 : 1;
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createAurelionProductModel(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): AurelionModelHandle {
  const rootGroup = new THREE.Group();
  const productGroup = new THREE.Group();
  rootGroup.add(productGroup);

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  const brushedBumpTex = createBrushedMetalBumpTexture(maxAnisotropy);
  const waveguideDialTex = createWaveguideDialTexture(maxAnisotropy);

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  // Shared primary materials updated dynamically by ProductConfigurator
  const primaryShellMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#12151E'),
    metalness: 0.92,
    roughness: 0.2,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    bumpMap: brushedBumpTex,
    bumpScale: 0.008,
  });
  materialsToDispose.push(primaryShellMaterial);

  const secondaryAlloyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0A0C12'),
    metalness: 0.85,
    roughness: 0.45,
  });
  materialsToDispose.push(secondaryAlloyMaterial);

  const smokedGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#182030'),
    metalness: 0.15,
    roughness: 0.08,
    transmission: isSoftwareGl ? 0 : 0.86,
    transparent: true,
    opacity: isSoftwareGl ? 0.42 : 0.92,
    ior: 1.62,
    thickness: 0.9,
    clearcoat: 1.0,
    depthWrite: false,
  });
  materialsToDispose.push(smokedGlassMaterial);

  const copperCoreMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D97736'),
    metalness: 0.95,
    roughness: 0.16,
    emissive: new THREE.Color('#8B5CF6'),
    emissiveIntensity: 0.18,
  });
  materialsToDispose.push(copperCoreMaterial);

  const dialFaceMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    map: waveguideDialTex,
    metalness: 0.65,
    roughness: 0.25,
  });
  materialsToDispose.push(dialFaceMaterial);

  // Shader #2: Liquid Chrome / Holographic Fresnel Halo Ring Material
  const liquidHaloMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDistortion: { value: 1.0 },
      uIridescence: { value: 0.85 },
      uBaseColor: { value: new THREE.Color('#131721') },
      uAccentViolet: { value: new THREE.Color('#8B5CF6') },
      uAccentIce: { value: new THREE.Color('#9DEBFF') },
    },
    vertexShader: liquidChromeVertexShader,
    fragmentShader: liquidChromeFragmentShader,
    transparent: true,
  });
  materialsToDispose.push(liquidHaloMaterial);

  // Shader #1: Cursor-Reactive Acoustic Energy Field Backdrop
  const energyFieldGeometry = new THREE.PlaneGeometry(6.8, 4.6, isSoftwareGl ? 24 : 48, isSoftwareGl ? 24 : 48);
  geometriesToDispose.push(energyFieldGeometry);

  const energyFieldMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0.78 },
      uFrequency: { value: 3.2 },
      uColorPrimary: { value: new THREE.Color('#8B5CF6') },
      uColorSecondary: { value: new THREE.Color('#9DEBFF') },
    },
    vertexShader: energyFieldVertexShader,
    fragmentShader: energyFieldFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  materialsToDispose.push(energyFieldMaterial);

  const energyBackdropMesh = new THREE.Mesh(energyFieldGeometry, energyFieldMaterial);
  energyBackdropMesh.position.set(0, 0.1, -1.55);
  rootGroup.add(energyBackdropMesh);

  // ---------------------------------------------------------------------------
  // COMPOSITE 10-PART PROCEDURAL MODEL: AURELION ONE
  // ---------------------------------------------------------------------------

  // Part 1: Weighted Acoustic Base Plinth (LatheGeometry stepped pedestal)
  const plinthPoints = [
    new THREE.Vector2(0.0, -1.25),
    new THREE.Vector2(0.92, -1.25),
    new THREE.Vector2(0.86, -1.12),
    new THREE.Vector2(0.68, -1.04),
    new THREE.Vector2(0.52, -0.82),
    new THREE.Vector2(0.0, -0.82),
  ];
  const plinthGeo = new THREE.LatheGeometry(plinthPoints, 48);
  geometriesToDispose.push(plinthGeo);
  const plinthMesh = new THREE.Mesh(plinthGeo, secondaryAlloyMaterial);
  plinthMesh.castShadow = !isSoftwareGl;
  plinthMesh.receiveShadow = !isSoftwareGl;
  productGroup.add(plinthMesh);

  // Part 2: Base Isolation Accent Ring
  const baseRingGeo = new THREE.TorusGeometry(0.76, 0.018, 16, 64);
  geometriesToDispose.push(baseRingGeo);
  const baseRingMesh = new THREE.Mesh(baseRingGeo, liquidHaloMaterial);
  baseRingMesh.rotation.x = Math.PI / 2;
  baseRingMesh.position.set(0, -1.08, 0);
  productGroup.add(baseRingMesh);

  // Part 3: Primary Sculptural Toroidal Monocoque (Main Body)
  const mainToroidGeo = new THREE.TorusGeometry(0.68, 0.34, 36, 72);
  geometriesToDispose.push(mainToroidGeo);
  const mainToroidMesh = new THREE.Mesh(mainToroidGeo, primaryShellMaterial);
  mainToroidMesh.position.set(0, 0.12, 0);
  mainToroidMesh.scale.set(1.0, 1.08, 0.72);
  mainToroidMesh.castShadow = !isSoftwareGl;
  mainToroidMesh.receiveShadow = !isSoftwareGl;
  productGroup.add(mainToroidMesh);

  // Part 4: 36-Blade Radial CNC Heatsink & Diffraction Array (InstancedMesh)
  const finCount = 36;
  const finGeo = new THREE.BoxGeometry(0.024, 0.26, 0.48);
  geometriesToDispose.push(finGeo);
  const finInstancedMesh = new THREE.InstancedMesh(
    finGeo,
    secondaryAlloyMaterial,
    finCount
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < finCount; i++) {
    const angle = (i / finCount) * Math.PI * 2;
    const radius = 0.72;
    dummy.position.set(
      Math.cos(angle) * radius,
      0.12 + Math.sin(angle) * radius * 1.08,
      0
    );
    dummy.rotation.set(0, 0, angle + Math.PI / 2);
    dummy.updateMatrix();
    finInstancedMesh.setMatrixAt(i, dummy.matrix);
  }
  finInstancedMesh.instanceMatrix.needsUpdate = true;
  finInstancedMesh.computeBoundingSphere();
  productGroup.add(finInstancedMesh);

  // Part 5: Internal Quantum DSP Core & Cryo-Copper Voice Coil Assembly
  const internalCoreGroup = new THREE.Group();
  internalCoreGroup.position.set(0, 0.12, 0);

  const coreCylinderGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.42, 36);
  geometriesToDispose.push(coreCylinderGeo);
  const coreCylinderMesh = new THREE.Mesh(coreCylinderGeo, copperCoreMaterial);
  coreCylinderMesh.rotation.x = Math.PI / 2;
  internalCoreGroup.add(coreCylinderMesh);

  const coreCageGeo = new THREE.TorusKnotGeometry(0.22, 0.028, 64, 12, 2, 3);
  geometriesToDispose.push(coreCageGeo);
  const coreCageMesh = new THREE.Mesh(coreCageGeo, liquidHaloMaterial);
  internalCoreGroup.add(coreCageMesh);
  productGroup.add(internalCoreGroup);

  // Part 6: Front Coaxial Beryllium Tweeter & Precision Waveguide Dial
  const frontWaveguideGroup = new THREE.Group();
  frontWaveguideGroup.position.set(0, 0.12, 0.24);

  const dialDiscGeo = new THREE.CircleGeometry(0.46, 48);
  geometriesToDispose.push(dialDiscGeo);
  const dialDiscMesh = new THREE.Mesh(dialDiscGeo, dialFaceMaterial);
  dialDiscMesh.position.set(0, 0, 0.02);
  frontWaveguideGroup.add(dialDiscMesh);

  const tweeterDomeGeo = new THREE.SphereGeometry(0.14, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  geometriesToDispose.push(tweeterDomeGeo);
  const tweeterDomeMesh = new THREE.Mesh(tweeterDomeGeo, primaryShellMaterial);
  tweeterDomeMesh.rotation.x = Math.PI / 2;
  tweeterDomeMesh.position.set(0, 0, 0.01);
  frontWaveguideGroup.add(tweeterDomeMesh);

  productGroup.add(frontWaveguideGroup);

  // Part 7: Liquid Chrome / Holographic Fresnel Halo Ring (Shader #2)
  const haloRingGeo = new THREE.TorusGeometry(0.52, 0.032, 24, 72);
  geometriesToDispose.push(haloRingGeo);
  const haloRingMesh = new THREE.Mesh(haloRingGeo, liquidHaloMaterial);
  haloRingMesh.position.set(0, 0.12, 0.27);
  productGroup.add(haloRingMesh);

  // Part 8: Smoked Glass Acoustic Crystal Visor Dome (Front Outer Layer)
  const frontGlassGeo = new THREE.SphereGeometry(0.58, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.42);
  geometriesToDispose.push(frontGlassGeo);
  const frontGlassMesh = new THREE.Mesh(frontGlassGeo, smokedGlassMaterial);
  frontGlassMesh.rotation.x = Math.PI / 2;
  frontGlassMesh.position.set(0, 0.12, 0.06);
  frontGlassMesh.renderOrder = 2;
  productGroup.add(frontGlassMesh);

  // Part 9: Dual Opposing Force-Cancelling Sub-Bass Woofers (Rear & Flank Actuators)
  const rearWooferGroup = new THREE.Group();
  rearWooferGroup.position.set(0, 0.12, -0.26);

  const wooferConeGeo = new THREE.CylinderGeometry(0.46, 0.24, 0.16, 40, 1, true);
  geometriesToDispose.push(wooferConeGeo);
  const wooferConeMesh = new THREE.Mesh(wooferConeGeo, secondaryAlloyMaterial);
  wooferConeMesh.rotation.x = Math.PI / 2;
  rearWooferGroup.add(wooferConeMesh);

  const rearRingGeo = new THREE.TorusGeometry(0.47, 0.025, 16, 48);
  geometriesToDispose.push(rearRingGeo);
  const rearRingMesh = new THREE.Mesh(rearRingGeo, primaryShellMaterial);
  rearRingMesh.position.set(0, 0, -0.06);
  rearWooferGroup.add(rearRingMesh);

  productGroup.add(rearWooferGroup);

  // Part 10: Zenith Capacitive Touch Crown (Top Interface Dial)
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 1.18, 0);

  const crownCylinderGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.07, 36);
  geometriesToDispose.push(crownCylinderGeo);
  const crownMesh = new THREE.Mesh(crownCylinderGeo, primaryShellMaterial);
  crownGroup.add(crownMesh);

  const crownRingGeo = new THREE.TorusGeometry(0.24, 0.012, 12, 48);
  geometriesToDispose.push(crownRingGeo);
  const crownRingMesh = new THREE.Mesh(crownRingGeo, liquidHaloMaterial);
  crownRingMesh.rotation.x = Math.PI / 2;
  crownRingMesh.position.set(0, 0.036, 0);
  crownGroup.add(crownRingMesh);

  productGroup.add(crownGroup);

  // Contact Shadow Grounding Disc directly beneath plinth (y = -1.26)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const grad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
    grad.addColorStop(0.55, 'rgba(6, 7, 10, 0.35)');
    grad.addColorStop(1, 'rgba(6, 7, 10, 0.0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.CircleGeometry(1.65, 32);
  geometriesToDispose.push(shadowGeo);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.75,
  });
  materialsToDispose.push(shadowMat);
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.set(0, -1.26, 0);
  rootGroup.add(shadowDisc);

  // Track current exploded progress for smooth exponential damping
  let currentExploded = 0;

  const applyConfiguration = (
    materialId: MaterialId,
    colorwayId: ColorwayId,
    softwareGl: boolean
  ) => {
    const matSpec = MATERIALS.find((m) => m.id === materialId) || MATERIALS[0];
    const colSpec = COLORWAYS.find((c) => c.id === colorwayId) || COLORWAYS[0];

    primaryShellMaterial.color.set(colSpec.primaryHex);
    primaryShellMaterial.roughness = matSpec.roughness;
    primaryShellMaterial.metalness = matSpec.metalness;
    primaryShellMaterial.clearcoat = matSpec.clearcoat;
    primaryShellMaterial.ior = matSpec.ior;

    if (materialId === 'smoked-glass') {
      primaryShellMaterial.transmission = softwareGl ? 0 : 0.72;
      primaryShellMaterial.transparent = true;
      primaryShellMaterial.opacity = softwareGl ? 0.58 : 0.92;
    } else {
      primaryShellMaterial.transmission = 0;
      primaryShellMaterial.transparent = false;
      primaryShellMaterial.opacity = 1.0;
    }
    primaryShellMaterial.needsUpdate = true;

    secondaryAlloyMaterial.color.set(colSpec.secondaryHex);
    secondaryAlloyMaterial.roughness = Math.min(0.85, matSpec.roughness + 0.25);

    copperCoreMaterial.emissive.set(colSpec.accentHex);

    // Synchronize both custom GLSL shaders with selected colorway
    liquidHaloMaterial.uniforms.uBaseColor.value.set(colSpec.primaryHex);
    liquidHaloMaterial.uniforms.uAccentViolet.value.set(colSpec.accentHex);
    liquidHaloMaterial.uniforms.uAccentIce.value.set(colSpec.rimHex);

    energyFieldMaterial.uniforms.uColorPrimary.value.set(colSpec.accentHex);
    energyFieldMaterial.uniforms.uColorSecondary.value.set(colSpec.rimHex);
  };

  const update = (
    dt: number,
    elapsedTime: number,
    pointerX: number,
    pointerY: number,
    explodedTarget: number,
    shaderParams: {
      energyIntensity: number;
      rippleFrequency: number;
      haloIridescence: number;
      acousticPulseActive: boolean;
    }
  ) => {
    // Update Shader #1 & #2 uniforms
    energyFieldMaterial.uniforms.uTime.value = elapsedTime;
    energyFieldMaterial.uniforms.uPointer.value.lerp(
      _scratchPointer.set(pointerX, pointerY),
      0.12
    );
    energyFieldMaterial.uniforms.uIntensity.value = shaderParams.energyIntensity;
    energyFieldMaterial.uniforms.uFrequency.value = shaderParams.rippleFrequency;

    liquidHaloMaterial.uniforms.uTime.value = elapsedTime;
    liquidHaloMaterial.uniforms.uIridescence.value = shaderParams.haloIridescence;
    liquidHaloMaterial.uniforms.uDistortion.value = shaderParams.acousticPulseActive ? 1.0 : 0.2;

    // Smooth exponential damping for Exploded CAD view separation
    currentExploded = THREE.MathUtils.damp(currentExploded, explodedTarget, 5.5, dt);

    // Separate subsystems smoothly along axes when exploded
    frontGlassMesh.position.z = 0.06 + currentExploded * 0.95;
    haloRingMesh.position.z = 0.27 + currentExploded * 0.62;
    frontWaveguideGroup.position.z = 0.24 + currentExploded * 0.36;
    rearWooferGroup.position.z = -0.26 - currentExploded * 0.65;
    crownGroup.position.y = 1.18 + currentExploded * 0.42;
    plinthMesh.position.y = -currentExploded * 0.28;
    baseRingMesh.position.y = -1.08 - currentExploded * 0.28;

    // Subtle acoustic excursion on coaxial waveguide & internal core
    const pulse = shaderParams.acousticPulseActive
      ? Math.sin(elapsedTime * 3.6) * 0.012
      : 0;
    frontWaveguideGroup.scale.setScalar(1 + pulse);
    coreCageMesh.rotation.z = elapsedTime * 0.45;
    coreCageMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.25;
  };

  const dispose = () => {
    brushedBumpTex.dispose();
    waveguideDialTex.dispose();
    shadowTex.dispose();
    geometriesToDispose.forEach((g) => g.dispose());
    materialsToDispose.forEach((m) => m.dispose());
  };

  return {
    rootGroup,
    productGroup,
    energyBackdropMesh,
    update,
    applyConfiguration,
    dispose,
  };
}

const _scratchPointer = new THREE.Vector2();
