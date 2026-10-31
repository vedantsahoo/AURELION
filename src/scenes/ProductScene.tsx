import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { CAMERA_PRESETS, CameraAngleId } from '../data/productData';
import { useProduct } from '../state/ProductContext';
import { useCursor } from '../state/CursorContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { createAurelionProductModel } from './ProductModel';
import { createParticleField } from './ParticleField';

export interface ScrollChoreographyState {
  active: boolean;
  progress: number; // 0 to 1
  stageIndex: number; // 0 to 4
}

interface ProductSceneProps {
  scrollState?: ScrollChoreographyState;
  interactive?: boolean;
  className?: string;
}

// Pre-allocated math helpers outside render loop (zero GC allocation)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 0.05, 0);

function detectSoftwareWebGL(): { supported: boolean; isSoftwareGl: boolean } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { supported: false, isSoftwareGl: true };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

export const ProductScene: React.FC<ProductSceneProps> = ({
  scrollState,
  interactive = true,
  className = '',
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const {
    config,
    cameraAngle,
    explodedProgress,
    shaderParams,
    resetSignal,
    details,
  } = useProduct();
  const { setCursor, resetCursor } = useCursor();
  const reducedMotion = useReducedMotion();

  const [webglFallback, setWebglFallback] = useState<boolean>(false);

  // Store mutable React state in refs so WebGLRenderer is initialized ONCE and never torn down on UI clicks
  const stateRef = useRef({
    config,
    cameraAngle,
    explodedProgress,
    shaderParams,
    scrollState,
    reducedMotion,
    interactive,
  });

  useEffect(() => {
    stateRef.current = {
      config,
      cameraAngle,
      explodedProgress,
      shaderParams,
      scrollState,
      reducedMotion,
      interactive,
    };
  }, [config, cameraAngle, explodedProgress, shaderParams, scrollState, reducedMotion, interactive]);

  const modelHandleRef = useRef<ReturnType<typeof createAurelionProductModel> | null>(null);
  const isSoftwareGlRef = useRef<boolean>(false);
  const dragRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Apply material & colorway changes immediately without recreating the canvas
  useEffect(() => {
    if (modelHandleRef.current) {
      modelHandleRef.current.applyConfiguration(
        config.materialId,
        config.colorwayId,
        isSoftwareGlRef.current
      );
    }
  }, [config.materialId, config.colorwayId]);

  // Reset manual drag rotation when resetSignal increments
  useEffect(() => {
    dragRotationRef.current = { x: 0, y: 0 };
  }, [resetSignal]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const { supported, isSoftwareGl } = detectSoftwareWebGL();
    isSoftwareGlRef.current = isSoftwareGl;

    if (!supported) {
      setWebglFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFallback(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglFallback(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#06070A', 0.085);

    // Mandatory Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.35, 4.3);

    // 3-Point Studio Lighting Rig + Warm/Cool Color Temperature Contrast
    const hemiLight = new THREE.HemisphereLight('#9DEBFF', '#0C0F15', 0.55);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFF7ED', 2.4);
    keyLight.position.set(3.5, 4.5, 4.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      const d = 2.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const violetRimLight = new THREE.PointLight('#8B5CF6', 4.5, 10, 1.8);
    violetRimLight.position.set(-2.8, 1.6, -2.2);
    scene.add(violetRimLight);

    const iceRimLight = new THREE.PointLight('#9DEBFF', 3.8, 10, 1.8);
    iceRimLight.position.set(2.8, -1.0, -2.0);
    scene.add(iceRimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxTop = new THREE.RectAreaLight('#DCE1EC', 3.2, 3.0, 1.5);
      softboxTop.position.set(0, 3.2, 1.8);
      softboxTop.lookAt(0, 0, 0);
      scene.add(softboxTop);
    }

    // Create 10-part AURELION ONE product model & particle field
    const modelHandle = createAurelionProductModel(renderer, isSoftwareGl);
    modelHandle.applyConfiguration(
      stateRef.current.config.materialId,
      stateRef.current.config.colorwayId,
      isSoftwareGl
    );
    modelHandleRef.current = modelHandle;
    scene.add(modelHandle.rootGroup);

    const particleHandle = createParticleField(isSoftwareGl ? 65 : 140);
    scene.add(particleHandle.points);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer & Drag interaction state
    const pointer = { x: 0, y: 0 };
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let isVisible = true;

    const onPointerDown = (e: PointerEvent) => {
      if (!stateRef.current.interactive) return;
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }
      if (isDragging && stateRef.current.interactive) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        dragRotationRef.current.y += dx * 0.0065;
        dragRotationRef.current.x = THREE.MathUtils.clamp(
          dragRotationRef.current.x + dy * 0.0045,
          -0.55,
          0.55
        );
        prevPointer = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // IntersectionObserver so off-screen scenes pause GPU work
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    // Software-WebGL safe pacing loop (from threejs skill)
    let frameId = 0;
    const startTime = performance.now();
    let lastTime = startTime;

    // Start the sculpture at an expressive three-quarter studio angle
    modelHandle.productGroup.rotation.y = -0.38;
    modelHandle.productGroup.rotation.x = 0.06;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;
      const current = stateRef.current;

      if (isVisible) {
        // Determine target camera preset or scroll choreography interpolation
        const preset: CameraAngleId = current.cameraAngle;
        const presetData =
          CAMERA_PRESETS.find((p) => p.id === preset) || CAMERA_PRESETS[0];

        // Responsive mobile camera distance adjustment
        const isNarrow = (container?.clientWidth || window.innerWidth) < 768;
        const distanceMultiplier = isNarrow ? 1.24 : 1.0;

        let targetX = presetData.position[0] * distanceMultiplier;
        let targetY = presetData.position[1];
        let targetZ = presetData.position[2] * distanceMultiplier;
        let targetFov = presetData.fov;
        let scrollRotY = 0;
        let scrollRotX = 0;

        if (current.scrollState && current.scrollState.active) {
          const p = current.scrollState.progress;
          // Choreographed 5-stage scroll camera sequence
          scrollRotY = p * Math.PI * 1.35;
          scrollRotX = Math.sin(p * Math.PI * 2) * 0.18;
          targetZ = THREE.MathUtils.lerp(4.3, 2.55, Math.sin(p * Math.PI)) * distanceMultiplier;
          targetX = Math.sin(p * Math.PI * 2) * 1.15;
          targetY = 0.25 + Math.cos(p * Math.PI) * 0.35;
        }

        _targetCamPos.set(targetX, targetY, targetZ);
        _targetLookAt.set(
          presetData.target[0],
          presetData.target[1],
          presetData.target[2]
        );

        const dampLambda = current.reducedMotion ? 20 : 4.5;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, dampLambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, dampLambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, dampLambda, dt);

        if (Math.abs(camera.fov - targetFov) > 0.05) {
          camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, dampLambda, dt);
          camera.updateProjectionMatrix();
        }

        _currentLookAt.lerp(_targetLookAt, Math.min(1, dt * dampLambda));
        camera.lookAt(_currentLookAt);

        // Sculptural three-quarter base angle + slow luxury pendulum drift + weighty pointer parallax + user drag
        const idleSpin = current.reducedMotion
          ? -0.38
          : -0.38 + Math.sin(elapsed * 0.45) * 0.34;
        const desiredRotY =
          idleSpin +
          scrollRotY +
          dragRotationRef.current.y +
          pointer.x * 0.18;
        const desiredRotX =
          0.06 +
          scrollRotX +
          dragRotationRef.current.x -
          pointer.y * 0.1;

        modelHandle.productGroup.rotation.y = THREE.MathUtils.damp(
          modelHandle.productGroup.rotation.y,
          desiredRotY,
          5.0,
          dt
        );
        modelHandle.productGroup.rotation.x = THREE.MathUtils.damp(
          modelHandle.productGroup.rotation.x,
          desiredRotX,
          5.0,
          dt
        );

        modelHandle.update(
          dt,
          elapsed,
          pointer.x,
          pointer.y,
          current.explodedProgress,
          current.shaderParams
        );

        if (!current.reducedMotion) {
          particleHandle.update(elapsed, pointer.x, pointer.y);
        }

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      observer.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      modelHandle.dispose();
      particleHandle.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  if (webglFallback) {
    return (
      <div
        data-testid="webgl-fallback-view"
        className={`relative flex flex-col items-center justify-center w-full h-full bg-[#06070A] p-8 overflow-hidden ${className}`}
      >
        <div
          className="w-72 h-72 rounded-full border border-[#8B5CF6]/40 flex items-center justify-center relative"
          style={{ background: details.colorway.swatchGradient }}
        >
          <div className="w-48 h-48 rounded-full border border-[#9DEBFF]/50 flex flex-col items-center justify-center text-center p-4 bg-[#06070A]/80">
            <span className="font-mono-tech text-xs text-[#9DEBFF] tracking-widest">
              {details.colorway.code}
            </span>
            <p className="font-display text-lg font-semibold text-[#F4F5F8] mt-1">
              AURELION ONE
            </p>
            <span className="text-xs text-[#979CAB] mt-1">
              {details.material.shortName}
            </span>
          </div>
        </div>
        <p className="font-mono-tech text-xs text-[#979CAB] mt-4">
          ARCHITECTURAL SCHEMATIC FALLBACK ACTIVE
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full select-none ${interactive ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
      onMouseEnter={() => interactive && setCursor('drag', 'DRAG')}
      onMouseLeave={() => interactive && resetCursor()}
      aria-label={`Interactive 3D view of AURELION ONE in ${details.colorway.name} and ${details.material.name}`}
      role="img"
    >
      <div
        ref={canvasMountRef}
        data-testid="product-3d-canvas"
        className="w-full h-full"
      />
    </div>
  );
};
