# AURELION — Engineered Beyond Ordinary

**AURELION** is a futuristic 3D luxury product showcase and interactive studio configurator for the **AURELION ONE**—a concept spatial acoustic monolith from the year 2035. Built with React, Three.js, custom GLSL shaders, and GSAP, it blends real-time physically based rendering (PBR) with scroll-driven spatial storytelling.

---

## Overview

Rather than a static e-commerce template, **AURELION** functions as a digital architectural showroom where visitors can inspect a 10-part procedural 3D acoustic sculpture in real time.

### Key Highlights
- **Real-Time 3D & PBR Studio Lighting**: Composite 10-part procedural geometry featuring a stepped `LatheGeometry` plinth, toroidal monocoque enclosure, 36-blade `InstancedMesh` radial heatsink/diffraction array, coaxial beryllium waveguide with procedural HTML5 Canvas radial dial textures, and `RoomEnvironment` image-based reflections.
- **Interactive Custom GLSL Shaders**:
  - **Cursor-Reactive Acoustic Energy Field (`energyField.ts`)**: Localized pointer ripple distortion with smooth radial falloff and electric violet (`#8B5CF6`) to ice-blue (`#9DEBFF`) harmonic wave transitions.
  - **Liquid Chrome & Holographic Fresnel Halo (`liquidChrome.ts`)**: Iridescent metallic surface shader with Fresnel edge glow and real-time colorway synchronization.
- **Scroll-Driven 3D Choreography**: Synchronizes camera perspectives, product rotation, and exploded CAD separation across five narrative stages using **GSAP ScrollTrigger** and **Lenis** smooth scrolling.
- **Live Material Physics & Studio Configurator**: Switch dynamically between *Grade-5 Brushed Titanium*, *Vapor-Deposited Smoked Glass*, and *Sintered Ceramic Composite* across four luxury colorways (*Obsidian Core*, *Gunmetal Eclipse*, *Liquid Chrome*, and *Aether Violet*), complete with custom plinth laser engraving and exploded CAD inspection.
- **Persistent Acquisition & Demo Checkout Flow**: Full cart state persisted via `localStorage`, slide-over acquisition bag drawer, promo code support (`AURELION2035`), and validated demo reservation checkout.

---

## Application Routes

| Route | Description |
| :--- | :--- |
| `/` | **Cinematic Homepage** — Intro loader, full-screen 3D hero, 5-stage scroll choreography, interactive materials exploration, bespoke configurator, and technical specifications. |
| `/product` | **3D Studio Showroom** — Full-viewport 3D inspection stage with a collapsible bottom control dock (`Zen Mode`), camera angle presets, exploded CAD slider, and full specification sheet. |
| `/technology` | **Acoustic & Shader Lab** — Real-time controls for GLSL shader GPU uniforms (Energy Field Intensity, Ripple Frequency, Fresnel Iridescence, Transducer Excursion) and metallurgical comparison matrix. |
| `/craftsmanship` | **CAD Assembly Inspector** — Interactive 5-subsystem breakdown that coordinates 3D camera angles and exploded assembly separation for each architectural component. |
| `/checkout` | **Acquisition & Demo Checkout** — Itemized cart review, quantity steppers, salon code discounts, transparent demo checkout notice, and validated reservation confirmation. |

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **3D & WebGL**: Three.js (`WebGLRenderer`, `MeshPhysicalMaterial`, `InstancedMesh`, custom `ShaderMaterial`, `RoomEnvironment` PMREM lighting)
- **Animation & Smooth Scroll**: GSAP + ScrollTrigger + Lenis
- **Routing**: React Router v7
- **Styling & Icons**: Tailwind CSS v4 + Lucide React
- **Testing**: Node.js built-in test runner (`node:test` + `tsx`)

---

## Project Structure

```text
src/
  components/
    layout/
      Header.tsx              # 3-zone top navigation bar with live bag counter
      Footer.tsx              # Architectural footer & Private Salon Concierge modal
      PageTransition.tsx      # Lenis + GSAP ScrollTrigger sync & route transition curtain
    product/
      ProductConfigurator.tsx # Colorway, material, edition, camera preset & engraving controls
      ProductSpecifications.tsx # Technical specifications & live material telemetry
    ui/
      CartDrawer.tsx          # Slide-over shopping bag with quantity steppers
      CustomCursor.tsx        # Desktop magnetic cursor with contextual labels
      LoadingScreen.tsx       # Interruptible intro loader with ?autostart=1 bypass
      MagneticButton.tsx      # Bounded magnetic CTA button component
  data/
    productData.ts            # Centralized product config, materials, colorways & specs
  hooks/
    useMediaQuery.ts          # Responsive media query hook
    useReducedMotion.ts       # WCAG prefers-reduced-motion accessibility hook
  pages/
    HomePage.tsx              # Cinematic storytelling homepage
    ProductPage.tsx           # Full-screen 3D configurator with collapsible Zen dock
    TechnologyPage.tsx        # Interactive GLSL shader uniform lab & physics matrix
    CraftsmanshipPage.tsx     # 5-subsystem exploded CAD assembly inspector
    CheckoutPage.tsx          # Functional cart review & demo reservation checkout
  scenes/
    ProductScene.tsx          # Three.js renderer, studio lighting rig & camera damping
    ProductModel.ts           # 10-part procedural 3D AURELION ONE model & CanvasTextures
    ParticleField.ts          # GPU-friendly floating particle shader system
    shaders/
      energyField.ts          # Cursor-reactive acoustic energy field GLSL shader
      liquidChrome.ts         # Liquid chrome & Fresnel holographic GLSL shader
  state/
    ProductContext.tsx        # Persistent product configuration & shader uniform state
    CartContext.tsx           # Persistent shopping bag state & totals calculation
    CursorContext.tsx         # Custom cursor mode & label state
  utils/
    commerce.ts               # Pure pricing, cart management & form validation functions
    commerce.test.ts          # Unit test suite for commerce logic
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npx tsx --test src/utils/commerce.test.ts

# 3. Start development server (http://localhost:3000)
npm run dev

# 4. Run TypeScript type check
npm run lint

# 5. Build for production
npm run build
```
