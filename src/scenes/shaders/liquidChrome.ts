export const liquidChromeVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uDistortion;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Subtle organic liquid-metal harmonic oscillation along normal
    float wave = sin(pos.x * 6.0 + uTime * 1.8) * cos(pos.y * 6.0 - uTime * 1.4) * 0.012 * uDistortion;
    pos += normal * wave;

    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const liquidChromeFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIridescence;
  uniform vec3 uBaseColor;
  uniform vec3 uAccentViolet;
  uniform vec3 uAccentIce;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 norm = normalize(vNormal);

    // Fresnel edge calculation
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, norm)), 2.6);

    // Liquid chrome environment-like reflection bands
    vec3 reflectVec = reflect(-viewDir, norm);
    float envBand = sin(reflectVec.y * 8.0 + reflectVec.x * 4.0 + uTime * 1.1) * 0.5 + 0.5;
    float secondaryBand = cos(reflectVec.z * 6.0 - uTime * 0.7) * 0.5 + 0.5;

    vec3 chromeHighlight = vec3(0.86, 0.88, 0.93);
    vec3 spectralShift = mix(uAccentViolet, uAccentIce, envBand);

    vec3 surfaceColor = mix(uBaseColor, chromeHighlight, pow(envBand, 2.2) * 0.75);
    surfaceColor = mix(surfaceColor, spectralShift, fresnel * uIridescence * (0.55 + secondaryBand * 0.45));

    // Specular rim boost
    float rimGlow = pow(fresnel, 4.0) * 0.65;
    surfaceColor += uAccentIce * rimGlow;

    gl_FragColor = vec4(surfaceColor, 0.92);
  }
`;
