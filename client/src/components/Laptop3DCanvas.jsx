import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Procedural Studio Environment Map (pure Three.js softboxes — zero external HDRI fetch)
 * Gives anodized aluminum & slate surfaces authentic Apple/Airform specular reflections.
 */
function createStudioEnvMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#E8EDF3');

  const panelGeo = new THREE.PlaneGeometry(10, 10);
  const addSoftbox = (color, pos, rot, scale = [1, 1, 1]) => {
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(panelGeo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    envScene.add(mesh);
  };

  // Overhead key softbox
  addSoftbox('#FFFFFF', [0, 8, 0], [Math.PI / 2, 0, 0], [1.6, 1.2, 1]);
  // Left cool silver rim light
  addSoftbox('#DCE6F2', [-9, 2, 4], [0, Math.PI / 2.4, 0], [1.2, 0.9, 1]);
  // Right bright studio fill
  addSoftbox('#FFFFFF', [9, 3, 2], [0, -Math.PI / 2.2, 0], [1.1, 0.8, 1]);
  // Subtle dark floor bounce for crisp metallic contrast
  addSoftbox('#5A6778', [0, -7, 0], [-Math.PI / 2, 0, 0], [2.2, 2.2, 1]);

  const rt = pmrem.fromScene(envScene, 0.04);
  panelGeo.dispose();
  envScene.traverse((obj) => {
    if (obj.material) obj.material.dispose();
  });
  pmrem.dispose();
  return rt;
}

/**
 * High-res procedural display CanvasTexture (TechCare 32-Point QC Hardware Telemetry)
 */
function createScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Deep matte obsidian display canvas
  const bg = ctx.createLinearGradient(0, 0, 1024, 640);
  bg.addColorStop(0, '#10141B');
  bg.addColorStop(0.55, '#171E29');
  bg.addColorStop(1, '#0D1016');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 640);

  // Subtle architectural studio grid
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }
  for (let y = 0; y <= 640; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Top macOS/Pro status bar
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, 0, 1024, 44);
  ctx.fillStyle = '#E6ECF5';
  ctx.font = '600 18px "Space Grotesk", sans-serif';
  ctx.fillText('TECHCARE // QC DIAGNOSTIC OS', 32, 28);
  ctx.fillStyle = '#8FA3BD';
  ctx.font = '500 15px "IBM Plex Mono", monospace';
  ctx.fillText('32 / 32 POINTS PASSED', 780, 28);

  // Hero telemetry title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 54px "Space Grotesk", sans-serif';
  ctx.fillText('CERTIFIED', 56, 152);
  ctx.fillStyle = '#9BB0C9';
  ctx.font = '300 54px "Space Grotesk", sans-serif';
  ctx.fillText('WORKSTATION', 56, 212);

  // 3 clean hardware metric cards
  const metrics = [
    { label: 'CPU THERMAL', value: '41°C', sub: 'Repasted Noctua NT-H1', x: 56 },
    { label: 'BATTERY HEALTH', value: '94%', sub: 'Verified Cycle Count', x: 372 },
    { label: 'NVME READ', value: '7,100', sub: 'MB/s • 0 Bad Sectors', x: 688 }
  ];

  metrics.forEach((m) => {
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(m.x, 280, 280, 176, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#8FA3BD';
    ctx.font = '500 14px "IBM Plex Mono", monospace';
    ctx.fillText(m.label, m.x + 24, 318);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 46px "Space Grotesk", sans-serif';
    ctx.fillText(m.value, m.x + 24, 384);

    ctx.fillStyle = '#A8B7CA';
    ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(m.sub, m.x + 24, 426);
  });

  // Clean thermal waveform bar at bottom
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.beginPath();
  ctx.roundRect(56, 490, 912, 92, 16);
  ctx.fill();

  ctx.strokeStyle = '#B8CBE0';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 40; i++) {
    const px = 88 + (i / 40) * 848;
    const py = 540 + Math.sin(i * 0.45) * 14 + Math.cos(i * 0.9) * 6;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  ctx.fillStyle = '#8FA3BD';
  ctx.font = '500 13px "IBM Plex Mono", monospace';
  ctx.fillText('STRESS TEST 60M • MEMTEST86 0 ERRORS • GARANSI TOKO 30-90 HARI', 88, 570);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * Soft radial contact shadow texture for realistic studio floor grounding
 */
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
  grad.addColorStop(0, 'rgba(29, 33, 41, 0.24)');
  grad.addColorStop(0.5, 'rgba(29, 33, 41, 0.09)');
  grad.addColorStop(1, 'rgba(29, 33, 41, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Helper to create a rounded-corner slab shape for precision CNC aluminum chassis
 */
function createRoundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + r);
  s.lineTo(hw, hh - r);
  s.quadraticCurveTo(hw, hh, hw - r, hh);
  s.lineTo(-hw + r, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - r);
  s.lineTo(-hw, -hh + r);
  s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return s;
}

/**
 * Builds the procedural CNC Aluminum Ultrabook 3D Model
 */
function buildProceduralLaptop() {
  const root = new THREE.Group();

  // Anodized silver-slate aluminum (Airform One industrial finish)
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: '#D9E0E8',
    metalness: 0.78,
    roughness: 0.24
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: '#262C36',
    metalness: 0.55,
    roughness: 0.35
  });

  const keycapMat = new THREE.MeshStandardMaterial({
    color: '#1C2028',
    metalness: 0.2,
    roughness: 0.55
  });

  const glassBezelMat = new THREE.MeshStandardMaterial({
    color: '#0E1117',
    metalness: 0.15,
    roughness: 0.08
  });

  const accentCopperMat = new THREE.MeshStandardMaterial({
    color: '#C87D55',
    metalness: 0.85,
    roughness: 0.22
  });

  const W = 3.2;
  const D = 2.15;
  const baseThick = 0.11;
  const lidThick = 0.065;

  // 1. CNC Unibody Base
  const baseShape = createRoundedRectShape(W, D, 0.14);
  const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
    depth: baseThick,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.022,
    bevelSegments: 4
  });
  baseGeo.rotateX(Math.PI / 2);
  const baseMesh = new THREE.Mesh(baseGeo, aluminumMat);
  baseMesh.position.y = baseThick / 2;
  root.add(baseMesh);

  // Recessed dark keyboard well
  const wellGeo = new THREE.BoxGeometry(W - 0.36, 0.014, 0.96);
  const wellMesh = new THREE.Mesh(wellGeo, darkMetalMat);
  wellMesh.position.set(0, baseThick + 0.015, -0.2);
  root.add(wellMesh);

  // Sculpted 5x12 keyboard matrix (InstancedMesh for ultra-lightweight 1 draw call!)
  const keyGeo = new THREE.BoxGeometry(0.185, 0.024, 0.145);
  const rows = 5;
  const cols = 12;
  const keyInstances = new THREE.InstancedMesh(keyGeo, keycapMat, rows * cols);
  const dummy = new THREE.Object3D();
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const kx = -1.24 + c * 0.225;
      const kz = -0.56 + r * 0.18;
      dummy.position.set(kx, baseThick + 0.028, kz);
      dummy.scale.set(r === 4 && c >= 4 && c <= 7 ? 1.12 : 1, 1, 1);
      dummy.updateMatrix();
      keyInstances.setMatrixAt(idx++, dummy.matrix);
    }
  }
  root.add(keyInstances);

  // Subtle Precision Glass Trackpad
  const trackpadMat = new THREE.MeshStandardMaterial({
    color: '#C7D0DC',
    metalness: 0.6,
    roughness: 0.18
  });
  const trackpadGeo = new THREE.BoxGeometry(1.06, 0.008, 0.62);
  const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
  trackpad.position.set(0, baseThick + 0.021, 0.64);
  root.add(trackpad);

  // Precision Side I/O Ports (Dual Thunderbolt USB-C + Audio + HDMI)
  const portGeo = new THREE.BoxGeometry(0.02, 0.036, 0.13);
  [-0.52, -0.32, 0.2].forEach((pz) => {
    const leftPort = new THREE.Mesh(portGeo, glassBezelMat);
    leftPort.position.set(-W / 2 - 0.015, baseThick * 0.2, pz);
    root.add(leftPort);
  });
  [-0.45, -0.18].forEach((pz) => {
    const rightPort = new THREE.Mesh(portGeo, glassBezelMat);
    rightPort.position.set(W / 2 + 0.015, baseThick * 0.2, pz);
    root.add(rightPort);
  });

  // Rear Thermal Exhaust Louvers + Copper Heat-Pipe Accent (Visible on Thermal View!)
  const ventGroup = new THREE.Group();
  const ventGeo = new THREE.BoxGeometry(0.06, 0.042, 0.025);
  for (let v = -10; v <= 10; v++) {
    const fin = new THREE.Mesh(ventGeo, darkMetalMat);
    fin.position.set(v * 0.11, baseThick * 0.25, -D / 2 - 0.012);
    ventGroup.add(fin);
  }
  const copperPipeGeo = new THREE.BoxGeometry(1.85, 0.022, 0.02);
  const copperPipe = new THREE.Mesh(copperPipeGeo, accentCopperMat);
  copperPipe.position.set(0, baseThick * 0.25, -D / 2 - 0.005);
  ventGroup.add(copperPipe);
  root.add(ventGroup);

  // Central Hinge Cylinder
  const hingeGeo = new THREE.CylinderGeometry(0.052, 0.052, 2.25, 20);
  hingeGeo.rotateZ(Math.PI / 2);
  const hinge = new THREE.Mesh(hingeGeo, darkMetalMat);
  hinge.position.set(0, baseThick + 0.01, -D / 2 + 0.06);
  root.add(hinge);

  // 2. Articulated Hinged Display Lid
  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, baseThick + 0.02, -D / 2 + 0.05);
  root.add(lidPivot);

  const lidShape = createRoundedRectShape(W, D, 0.14);
  const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
    depth: lidThick,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.018,
    bevelSegments: 4
  });
  const lidBack = new THREE.Mesh(lidGeo, aluminumMat);
  lidBack.position.set(0, D / 2, -lidThick);
  lidPivot.add(lidBack);

  // Glossy Dark Display Bezel
  const bezelGeo = new THREE.PlaneGeometry(W - 0.1, D - 0.1);
  const bezel = new THREE.Mesh(bezelGeo, glassBezelMat);
  bezel.position.set(0, D / 2, 0.019);
  lidPivot.add(bezel);

  // Active Illuminated Display Panel (TechCare QC Diagnostic OS)
  const screenTex = createScreenTexture();
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const screenGeo = new THREE.PlaneGeometry(W - 0.26, D - 0.28);
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, D / 2 + 0.02, 0.022);
  lidPivot.add(screenMesh);

  // Subtle machined silver stripe badge on outer lid
  const emblemGeo = new THREE.BoxGeometry(0.42, 0.045, 0.01);
  const emblem = new THREE.Mesh(emblemGeo, darkMetalMat);
  emblem.position.set(0, D / 2 + 0.12, -lidThick - 0.02);
  lidPivot.add(emblem);

  // Center the laptop vertically for balanced rotation
  root.position.y = -0.35;

  return { root, lidPivot, screenTex };
}

/**
 * Camera presets for Airform One "Take a Closer Look" interactive explorer
 */
const EXPLORER_PRESETS = {
  overview: { rotY: -0.45, rotX: 0.22, lidOpen: 1.88, camZ: 6.1, camY: 0.85, offsetX: 0 },
  display: { rotY: 0.05, rotX: 0.06, lidOpen: 1.72, camZ: 5.25, camY: 0.95, offsetX: 0 },
  ram: { rotY: -0.25, rotX: 0.62, lidOpen: 2.02, camZ: 5.2, camY: 1.55, offsetX: 0 },
  ssd: { rotY: 0.38, rotX: 0.52, lidOpen: 1.98, camZ: 5.3, camY: 1.35, offsetX: 0 },
  thermal: { rotY: 2.68, rotX: 0.28, lidOpen: 1.82, camZ: 5.4, camY: 0.85, offsetX: 0 },
  ports: { rotY: -1.48, rotX: 0.14, lidOpen: 1.78, camZ: 5.3, camY: 0.55, offsetX: 0 },
  qc: { rotY: 0.55, rotX: 0.24, lidOpen: 1.9, camZ: 5.8, camY: 0.85, offsetX: 0 }
};

export default function Laptop3DCanvas({
  mode = 'hero', // 'hero' | 'explorer'
  scrollTargetRef = null, // Direct DOM ref of sticky scroll container for guaranteed 60fps scroll sync
  activePreset = 'overview',
  className = ''
}) {
  const containerRef = useRef(null);
  const presetRef = useRef(activePreset);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    presetRef.current = activePreset;
  }, [activePreset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envRT = createStudioEnvMap(renderer);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 5.6);

    // Crisp Apple/Airform Studio 3-Point Lighting
    const ambient = new THREE.AmbientLight('#FFFFFF', 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#FFFFFF', 1.35);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#CBD9EA', 0.85);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const { root, lidPivot, screenTex } = buildProceduralLaptop();
    scene.add(root);

    // Soft studio contact shadow underneath floating laptop
    const shadowTex = createShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.2), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.18;
    scene.add(shadowPlane);

    // Pointer tilt & explorer drag state
    const pointer = { x: 0, y: 0 };
    let isDragging = false;
    let dragStartX = 0;
    let dragOffsetY = 0;
    let dragVelocity = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));

      if (mode === 'explorer' && isDragging) {
        const dx = e.clientX - dragStartX;
        dragStartX = e.clientX;
        dragVelocity = dx * 0.0085;
        dragOffsetY += dragVelocity;
      }
    };

    const onPointerDown = (e) => {
      if (mode !== 'explorer') return;
      isDragging = true;
      dragStartX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Reset drag smoothly whenever explorer preset changes
    let lastPreset = presetRef.current;

    // ResizeObserver keeps 3D crisp across 360px / 768px / 1280px
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Visibility pause for battery & performance
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    // Smooth lerped animation state
    // Note: lidPivot.rotation.x = Math.PI/2 means closed flat; ~ -0.15..0.1 means open ~105°
    // Specifically: at lidPivot.rotation.x = 0, lid stands vertically 90° up.
    // Closed onto base (towards +Z): lidPivot.rotation.x = +Math.PI/2 (1.57 rad)
    // Open comfortable 108°: lidPivot.rotation.x = -0.32 rad
    const state = {
      rotY: mode === 'hero' ? -1.18 : -0.45,
      rotX: mode === 'hero' ? 0.14 : 0.22,
      rotZ: 0,
      posX: 0,
      posY: -0.25,
      lidAngle: mode === 'hero' ? 1.42 : -0.26,
      camZ: 5.5,
      camY: 0.65
    };

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();
      const cw = container.clientWidth || 800;
      const ch = container.clientHeight || 600;
      const isNarrow = cw < 768;
      const portraitBoost = camera.aspect < 1 ? 1 / Math.max(camera.aspect, 0.52) : 1;

      if (mode === 'hero') {
        let p = 0;
        if (scrollTargetRef && scrollTargetRef.current) {
          const rect = scrollTargetRef.current.getBoundingClientRect();
          const scrollable = Math.max(rect.height - window.innerHeight, 1);
          p = Math.max(0, Math.min(1, -rect.top / scrollable));
        }

        // Phase 1 (0 -> 0.52): Sleek Airform-style monolithic profile opens & rotates to 3/4 hero
        // Phase 2 (0.4 -> 0.95): Glides cleanly to right side on desktop to frame editorial headline
        const openT = Math.min(1, p / 0.52);
        const glideT = Math.max(0, Math.min(1, (p - 0.36) / 0.54));
        const smoothOpen = openT * openT * (3 - 2 * openT);
        const smoothGlide = glideT * glideT * (3 - 2 * glideT);

        // Target transforms
        const baseRotY = -1.2 + smoothOpen * 0.96 + smoothGlide * 0.12;
        const baseRotX = 0.08 + smoothOpen * 0.14;
        const baseRotZ = -0.16 * (1 - smoothOpen);
        const targetLid = 1.44 - smoothOpen * 1.72; // 1.44 (almost closed) -> -0.28 (open ~106°)
        const targetPosX = isNarrow ? 0 : smoothGlide * 1.32;
        const targetPosY =
          (isNarrow ? 0.32 - smoothGlide * 0.25 : -0.32) +
          (prefersReducedMotion ? 0 : Math.sin(t * 1.4) * 0.05);
        const baseZ = (isNarrow ? 5.9 * portraitBoost : 5.75) - smoothOpen * 0.2 + smoothGlide * 0.45;
        const targetCamY = 0.55 + smoothOpen * 0.25;

        const tiltX = prefersReducedMotion ? 0 : pointer.y * 0.08;
        const tiltY = prefersReducedMotion ? 0 : pointer.x * 0.15;

        state.rotY += (baseRotY + tiltY - state.rotY) * 0.12;
        state.rotX += (baseRotX + tiltX - state.rotX) * 0.12;
        state.rotZ += (baseRotZ - state.rotZ) * 0.12;
        state.lidAngle += (targetLid - state.lidAngle) * 0.14;
        state.posX += (targetPosX - state.posX) * 0.12;
        state.posY += (targetPosY - state.posY) * 0.12;
        state.camZ += (baseZ - state.camZ) * 0.12;
        state.camY += (targetCamY - state.camY) * 0.12;
      } else {
        // Explorer interactive camera choreography
        if (presetRef.current !== lastPreset) {
          lastPreset = presetRef.current;
          dragOffsetY = 0;
          dragVelocity = 0;
        }
        if (!isDragging) {
          dragVelocity *= 0.92;
          dragOffsetY += dragVelocity;
        }

        const preset = EXPLORER_PRESETS[presetRef.current] || EXPLORER_PRESETS.overview;
        const targetLid = -(preset.lidOpen - Math.PI / 2);
        const floatY = prefersReducedMotion ? 0 : Math.sin(t * 1.3) * 0.035;
        const targetCamZ = isNarrow ? preset.camZ * Math.min(portraitBoost, 1.45) : preset.camZ;

        state.rotY += (preset.rotY + dragOffsetY + (prefersReducedMotion ? 0 : pointer.x * 0.06) - state.rotY) * 0.1;
        state.rotX += (preset.rotX + (prefersReducedMotion ? 0 : pointer.y * 0.035) - state.rotX) * 0.1;
        state.rotZ += (0 - state.rotZ) * 0.1;
        state.lidAngle += (targetLid - state.lidAngle) * 0.1;
        state.posX += (preset.offsetX - state.posX) * 0.1;
        state.posY += (-0.42 + floatY - state.posY) * 0.1;
        state.camZ += (targetCamZ - state.camZ) * 0.1;
        state.camY += (preset.camY - state.camY) * 0.1;
      }

      root.rotation.set(state.rotX, state.rotY, state.rotZ);
      root.position.set(state.posX, state.posY, 0);
      lidPivot.rotation.x = state.lidAngle;

      shadowPlane.position.x = state.posX;
      const shadowScale = 1 - Math.abs(state.posY + 0.35) * 0.22;
      shadowPlane.scale.set(shadowScale, shadowScale, 1);

      camera.position.set(0, state.camY, state.camZ);
      camera.lookAt(state.posX * 0.32, 0.18, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      screenTex.dispose();
      shadowTex.dispose();
      envRT.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [mode, scrollTargetRef]);

  if (webglFailed) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/images/products/asus-rog-zephyrus-g16.png"
          alt="TechCare Certified Workstation"
          className="max-h-[78%] max-w-[82%] object-contain drop-shadow-2xl"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full select-none ${
        mode === 'explorer' ? 'cursor-grab active:cursor-grabbing' : ''
      } ${className}`}
      aria-label="Visualisasi 3D interaktif laptop TechCare"
    />
  );
}
