export const energyFieldVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uIntensity;
  uniform float uFrequency;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Distance from pointer in normalized UV space (-1 to 1)
    vec2 centeredUv = uv * 2.0 - 1.0;
    float distToPointer = distance(centeredUv, uPointer);

    // Defined interaction radius with smooth falloff
    float radius = 0.68;
    float influence = 1.0 - smoothstep(0.0, radius, distToPointer);

    // Subtle localized ripple displacement
    float ripple = sin(distToPointer * (12.0 * uFrequency) - uTime * 3.2) * influence;
    float ambientWave = cos(centeredUv.x * 3.5 + uTime * 0.8) * sin(centeredUv.y * 3.5 + uTime * 0.6) * 0.04;

    pos.z += (ripple * 0.14 + ambientWave) * uIntensity;

    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const energyFieldFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uIntensity;
  uniform float uFrequency;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;

  void main() {
    vec2 centeredUv = vUv * 2.0 - 1.0;
    float radialDist = length(centeredUv);
    float distToPointer = distance(centeredUv, uPointer);

    // Smooth radial vignette so edges fade seamlessly into #06070A background
    float vignette = 1.0 - smoothstep(0.25, 0.98, radialDist);

    // Localized cursor interaction halo
    float pointerFalloff = 1.0 - smoothstep(0.0, 0.62, distToPointer);

    // Concentric acoustic wave rings
    float wavePattern = sin(radialDist * (10.0 * uFrequency) - uTime * 2.0);
    float pointerRipple = sin(distToPointer * (18.0 * uFrequency) - uTime * 4.2) * pointerFalloff;

    float combinedWave = smoothstep(-0.2, 0.85, wavePattern * 0.45 + pointerRipple * 0.75);

    // Fine polar grid lines
    float gridRing = smoothstep(0.94, 0.99, sin(radialDist * 28.0));
    float angle = atan(centeredUv.y, centeredUv.x);
    float spokes = smoothstep(0.97, 0.995, cos(angle * 12.0));

    // Electric violet to ice-blue transition
    vec3 baseTint = mix(uColorPrimary, uColorSecondary, combinedWave * 0.65 + pointerFalloff * 0.35);
    vec3 finalColor = baseTint * (0.28 + combinedWave * 0.55 + (gridRing + spokes) * 0.22);

    // Restrained alpha so it enhances without overpowering the 3D sculpture
    float alpha = vignette * (0.08 + pointerFalloff * 0.24 + combinedWave * 0.12) * uIntensity;

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.48));
  }
`;
