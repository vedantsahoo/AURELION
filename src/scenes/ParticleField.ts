import * as THREE from 'three';

export interface ParticleFieldHandle {
  points: THREE.Points;
  update: (elapsedTime: number, pointerX: number, pointerY: number) => void;
  dispose: () => void;
}

export function createParticleField(count = 140): ParticleFieldHandle {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);

  // Deterministic pseudo-random distribution so scenes are consistent and testable
  for (let i = 0; i < count; i++) {
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.sin(i * 78.233) * 43758.5453;
    const seed3 = Math.sin(i * 39.425) * 43758.5453;

    const r1 = seed1 - Math.floor(seed1);
    const r2 = seed2 - Math.floor(seed2);
    const r3 = seed3 - Math.floor(seed3);

    const radius = 1.6 + r1 * 3.4;
    const theta = r2 * Math.PI * 2;
    const y = (r3 - 0.5) * 3.8;

    positions[i * 3] = Math.cos(theta) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * radius - 0.5;

    scales[i] = 0.4 + r1 * 0.9;
    phases[i] = r2 * Math.PI * 2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#8B5CF6') },
      uColorB: { value: new THREE.Color('#9DEBFF') },
    },
    vertexShader: /* glsl */ `
      attribute float aScale;
      attribute float aPhase;
      varying float vAlpha;
      varying float vMix;
      uniform float uTime;
      uniform vec2 uPointer;

      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.45 + aPhase) * 0.12;
        pos.x += cos(uTime * 0.35 + aPhase) * 0.08 + uPointer.x * 0.12;
        pos.z += sin(uTime * 0.3 + aPhase) * 0.08 + uPointer.y * 0.08;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = clamp((14.0 * aScale) / -mvPosition.z, 1.5, 6.0);
        vAlpha = 0.22 + 0.35 * (0.5 + 0.5 * sin(uTime * 0.8 + aPhase));
        vMix = fract(aPhase * 0.3183);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      varying float vMix;
      uniform vec3 uColorA;
      uniform vec3 uColorB;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float softCircle = smoothstep(0.5, 0.05, dist);
        vec3 col = mix(uColorA, uColorB, vMix);
        gl_FragColor = vec4(col, softCircle * vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);

  const update = (elapsedTime: number, pointerX: number, pointerY: number) => {
    material.uniforms.uTime.value = elapsedTime;
    material.uniforms.uPointer.value.set(pointerX, pointerY);
    points.rotation.y = elapsedTime * 0.03;
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { points, update, dispose };
}
