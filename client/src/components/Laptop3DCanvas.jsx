import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/**
 * 3D Model Credit:
 * "MacBook Pro M3 16-inch 2024" by jackbaeten (CC-BY 4.0),
 * pre-rigged via william-laverty/rigged-macbook-3d (MIT License).
 */
const MODEL_URL = '/models/macbook-rigged.glb';
const FIT_SIZE = 4.2;
const DEFAULT_LID = { OPEN_X: 0, CLOSED_X: 1.94 };
const DEFAULT_SEAT = {
  HINGE_Y: -0.5,
  HINGE_Z: -12.2,
  SCREEN_BOTTOM_Y: 1.25,
  SCREEN_BOTTOM_Z: -13.2,
  TARGET_Y: 0.7
};

// Shared single-fetch GLB promise so Hero and Closer Look never download twice
let cachedGltfPromise = null;
function loadMacbookModel() {
  if (!cachedGltfPromise) {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    cachedGltfPromise = new Promise((resolve, reject) => {
      loader.load(MODEL_URL, resolve, undefined, reject);
    });
  }
  return cachedGltfPromise;
}

/**
 * Apple / Airform One High-Contrast Metallic Studio Environment Map
 * Dark studio enclosure with crisp bright softbox streaks so Space-Black
 * anodized aluminum catches real specular glints instead of looking flat.
 */
function createStudioEnvMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color('#1B1F27');

  const panelGeo = new THREE.PlaneGeometry(1, 1);
  const addLightformer = (color, intensity, pos, rot, scale) => {
    const c = new THREE.Color(color).multiplyScalar(intensity);
    const mat = new THREE.MeshBasicMaterial({
      color: c,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(panelGeo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    envScene.add(mesh);
  };

  // Overhead bright linear softbox streak (paints crisp reflection across lid bevel)
  addLightformer('#FFFFFF', 2.4, [0, 8, 1.5], [Math.PI / 2, 0, 0], [16, 4.5, 1]);
  // Front-upper studio fill band
  addLightformer('#F4F8FF', 1.6, [1.5, 3.5, 7], [0, Math.PI, 0], [11, 3.2, 1]);
  // Left cool-silver rim streak
  addLightformer('#D7E6FF', 2.2, [-8, 3.2, 2], [0, Math.PI / 2.2, 0], [10, 3.8, 1]);
  // Right warm-white softbox
  addLightformer('#FFF4E6', 1.9, [8, 2.8, 3], [0, -Math.PI / 2.3, 0], [9, 3.4, 1]);
  // Back edge highlight rim
  addLightformer('#E8F0FF', 2.0, [-1, 5.5, -7.5], [0.25, 0, 0], [14, 2.6, 1]);

  const rt = pmrem.fromScene(envScene, 0.035);
  panelGeo.dispose();
  envScene.traverse((obj) => {
    if (obj.material) obj.material.dispose();
  });
  pmrem.dispose();
  return rt;
}

/**
 * Live Animated High-Res TechCare OS Display Screen (Redraws smooth live telemetry waveform)
 */
function createAnimatedScreenCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 660;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const drawFrame = (time) => {
    // Deep OLED obsidian gradient
    const bg = ctx.createLinearGradient(0, 0, 1024, 660);
    bg.addColorStop(0, '#0B0E14');
    bg.addColorStop(0.5, '#131924');
    bg.addColorStop(1, '#090C11');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 660);

    // Subtle precision telemetry grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 660);
      ctx.stroke();
    }
    for (let y = 0; y <= 660; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Top macOS-style status bar
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, 0, 1024, 44);

    // Live pulsing green status dot
    const pulse = 0.65 + 0.35 * Math.sin(time * 3.2);
    ctx.fillStyle = `rgba(52, 211, 153, ${pulse})`;
    ctx.beginPath();
    ctx.arc(32, 22, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#E8EEF6';
    ctx.font = '600 16px "Space Grotesk", sans-serif';
    ctx.fillText('TECHCARE // CERTIFIED HARDWARE OS', 48, 27);

    ctx.fillStyle = '#9BB0C9';
    ctx.font = '500 14px "IBM Plex Mono", monospace';
    ctx.fillText('32 / 32 QC VERIFIED', 810, 27);

    // Main Editorial Display Typography
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 58px "Space Grotesk", sans-serif';
    ctx.fillText('TechCare', 56, 152);
    ctx.fillStyle = '#8FA3BD';
    ctx.font = '300 58px "Space Grotesk", sans-serif';
    ctx.fillText('Workstation', 322, 152);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Real-Time Hardware Diagnostics • Thermal Repasted • Ready Stock < Rp 10 Juta', 56, 198);

    // 3 Glass Hardware Metric Cards
    const tempVal = (40.6 + Math.sin(time * 1.4) * 0.4).toFixed(1);
    const metrics = [
      { label: 'CPU THERMAL', value: `${tempVal}°C`, sub: 'Repasted • Kipas Senyap', x: 56 },
      { label: 'BATTERY HEALTH', value: '94%', sub: 'Verified Low Cycle Count', x: 372 },
      { label: 'NVME PCIe GEN4', value: '7,100', sub: 'MB/s • Health 99%', x: 688 }
    ];

    metrics.forEach((m) => {
      ctx.fillStyle = 'rgba(255,255,255,0.045)';
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(m.x, 250, 280, 178, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#8FA3BD';
      ctx.font = '500 13px "IBM Plex Mono", monospace';
      ctx.fillText(m.label, m.x + 24, 288);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 46px "Space Grotesk", sans-serif';
      ctx.fillText(m.value, m.x + 24, 354);

      ctx.fillStyle = '#9BAAC0';
      ctx.font = '400 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(m.sub, m.x + 24, 398);
    });

    // Live Animated Thermal Telemetry Waveform Panel
    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.beginPath();
    ctx.roundRect(56, 462, 912, 138, 18);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#C8D8EC';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const px = 88 + (i / 60) * 848;
      const py =
        526 +
        Math.sin(i * 0.28 - time * 2.2) * 16 +
        Math.cos(i * 0.62 - time * 1.3) * 7;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#8FA3BD';
    ctx.font = '500 13px "IBM Plex Mono", monospace';
    ctx.fillText('LIVE STRESS BENCHMARK • MEMTEST86 0 ERRORS • GARANSI TOKO 30–90 HARI', 88, 576);

    texture.needsUpdate = true;
  };

  drawFrame(0);
  return { texture, drawFrame };
}

/**
 * Soft radial contact shadow underneath the floating MacBook Pro
 */
function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 124);
  grad.addColorStop(0, 'rgba(18, 22, 30, 0.30)');
  grad.addColorStop(0.5, 'rgba(18, 22, 30, 0.11)');
  grad.addColorStop(1, 'rgba(18, 22, 30, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Rig cloned GLB scene: attach pivot, fit normalization, screen material, and space-black metallic finish
 */
function rigMacbookClone(sourceScene, screenTexture) {
  const modelScene = sourceScene.clone(true);
  const pivot = modelScene.getObjectByName('LidPivot');
  const screenMesh = modelScene.getObjectByName('Screen');

  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    color: new THREE.Color('#FFFFFF'),
    toneMapped: false
  });
  if (screenMesh && screenMesh.isMesh) {
    screenMesh.material = screenMat;
  }

  // Neutralize Apple logo material & tune PBR envMapIntensity for matte Space-Black Ultrabook finish
  const unbrandedLidMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#282D36'),
    metalness: 0.65,
    roughness: 0.35,
    envMapIntensity: 1.05
  });
  const seen = new Set();
  modelScene.traverse((o) => {
    if (!o.isMesh) return;
    if (Array.isArray(o.material)) {
      o.material = o.material.map((m) => (m?.name === 'JvMFZolVCdpPqjj' ? unbrandedLidMat : m));
    } else if (o.material?.name === 'JvMFZolVCdpPqjj') {
      o.material = unbrandedLidMat;
    }
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => {
      if (!m || seen.has(m)) return;
      seen.add(m);
      if ('envMapIntensity' in m) {
        m.envMapIntensity = m.userData?.spaceBlack ? 1.1 : 0.95;
      }
    });
  });

  modelScene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(modelScene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = FIT_SIZE / maxDim;

  const wrapper = new THREE.Group();
  const normGroup = new THREE.Group();
  normGroup.scale.setScalar(scale);
  normGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  normGroup.add(modelScene);
  wrapper.add(normGroup);

  const e = pivot?.userData || {};
  const hingeY = pivot ? pivot.position.y : DEFAULT_SEAT.HINGE_Y;
  const hingeZ = pivot ? pivot.position.z : DEFAULT_SEAT.HINGE_Z;
  const seat = {
    hingeY,
    hingeZ,
    relY: (e.screenBottomY ?? DEFAULT_SEAT.SCREEN_BOTTOM_Y) - hingeY,
    relZ: (e.screenBottomZ ?? DEFAULT_SEAT.SCREEN_BOTTOM_Z) - hingeZ,
    targetY: e.seatTargetY ?? DEFAULT_SEAT.TARGET_Y,
    openX: e.lidOpenX ?? DEFAULT_LID.OPEN_X,
    closedX: e.lidClosedX ?? DEFAULT_LID.CLOSED_X
  };

  return { wrapper, pivot, screenMat, seat };
}

function applyLidOpen(rig, openAmount) {
  if (!rig || !rig.pivot) return;
  const clamped = Math.max(0, Math.min(1, openAmount));
  const { openX, closedX, hingeY, relY, relZ, targetY } = rig.seat;
  const theta = closedX + (openX - closedX) * clamped;
  rig.pivot.rotation.x = theta;

  // Seat-lift keeps closed screen edge seated cleanly above the keycaps
  const edgeY = hingeY + relY * Math.cos(theta) - relZ * Math.sin(theta);
  rig.pivot.position.y = hingeY + Math.max(0, targetY - edgeY);

  // Smooth screen brightness wake as lid opens past 18%
  const wake = Math.max(0, Math.min(1, (clamped - 0.16) / 0.35));
  rig.screenMat.color.setScalar(wake);
}

/**
 * Interactive Camera Presets for Airform One "Lihat Lebih Dekat" 3D Explorer
 */
const EXPLORER_PRESETS = {
  overview: { rotY: -0.45, rotX: 0.18, open: 0.96, camZ: 6.4, camY: 0.72 },
  display: { rotY: 0.04, rotX: 0.05, open: 0.98, camZ: 5.1, camY: 0.55 },
  ram: { rotY: -0.22, rotX: 0.56, open: 1.0, camZ: 5.2, camY: 1.45 },
  ssd: { rotY: 0.42, rotX: 0.46, open: 1.0, camZ: 5.3, camY: 1.25 },
  thermal: { rotY: 2.72, rotX: 0.24, open: 0.92, camZ: 5.6, camY: 0.75 },
  ports: { rotY: -1.46, rotX: 0.12, open: 0.88, camZ: 5.4, camY: 0.42 },
  qc: { rotY: 0.54, rotX: 0.2, open: 0.96, camZ: 6.0, camY: 0.72 }
};

export default function Laptop3DCanvas({
  mode = 'hero', // 'hero' | 'explorer'
  scrollTargetRef = null,
  activePreset = 'overview',
  className = ''
}) {
  const containerRef = useRef(null);
  const presetRef = useRef(activePreset);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

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
      setStatus('error');
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Adaptive quality: weaker phones/laptops render at 1x and skip the animated screen redraw
    const lowEnd =
      (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2;
    renderer.setPixelRatio(lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 500;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const envRT = createStudioEnvMap(renderer);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);

    // Calibrated Apple Studio 3-Point Lighting Rig
    scene.add(new THREE.AmbientLight('#FFFFFF', 0.28));

    const keyLight = new THREE.DirectionalLight('#FFEEDA', 1.35);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#C4D2FF', 0.35);
    fillLight.position.set(-7, 3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#E6EEFF', 1.25);
    rimLight.position.set(-2, 6, -7);
    scene.add(rimLight);

    // Contact shadow plane
    const shadowTex = createShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.8), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.35;
    scene.add(shadowPlane);

    // Live animated OS screen texture
    const { texture: screenTexture, drawFrame: drawScreen } = createAnimatedScreenCanvas();

    let rig = null;
    let disposed = false;

    loadMacbookModel()
      .then((gltf) => {
        if (disposed) return;
        rig = rigMacbookClone(gltf.scene, screenTexture);
        scene.add(rig.wrapper);
        applyLidOpen(rig, mode === 'hero' ? 0.08 : 0.96);
        setStatus('ready');
      })
      .catch(() => {
        if (!disposed) setStatus('error');
      });

    // Pointer tilt & explorer 360° drag (supports smooth mobile touch swipe via touch-action: pan-y)
    const pointer = { x: 0, y: 0 };
    let isDragging = false;
    let activePointerId = null;
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
        const sensitivity = e.pointerType === 'touch' ? 0.015 : 0.01;
        dragVelocity = dx * sensitivity;
        dragOffsetY += dragVelocity;
      }
    };

    const onPointerDown = (e) => {
      if (mode !== 'explorer') return;
      isDragging = true;
      activePointerId = e.pointerId;
      dragStartX = e.clientX;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture is unsupported
      }
    };

    const onPointerEnd = (e) => {
      if (activePointerId !== null && e.pointerId === activePointerId) {
        try {
          if (container.hasPointerCapture(e.pointerId)) {
            container.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
        activePointerId = null;
      }
      isDragging = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);

    let lastPreset = presetRef.current;

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

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const state = {
      rotY: mode === 'hero' ? -0.78 : -0.45,
      rotX: mode === 'hero' ? 0.26 : 0.18,
      rotZ: mode === 'hero' ? -0.06 : 0,
      posX: 0,
      posY: mode === 'hero' ? 0.08 : -0.15,
      open: mode === 'hero' ? 0.08 : 0.96,
      camZ: mode === 'hero' ? 7.1 : 6.2,
      camY: 0.6
    };

    let rafId = 0;
    let lastScreenDraw = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();
      const cw = container.clientWidth || 800;
      const isNarrow = cw < 768;
      const isPhone = cw < 520;
      const aspectBoost = camera.aspect < 1.15 ? 1.15 / Math.max(camera.aspect, 0.52) : 1;

      if (mode === 'once') {
        // 1-shot Apple iPhone Duo style lid-opening animation, then settles completely still
        const introRaw = prefersReducedMotion ? 1 : Math.min(1, t / 1.35);
        const easeOut = 1 - Math.pow(1 - introRaw, 3);
        const targetRotY = -0.68 + easeOut * 0.46;
        const targetRotX = 0.24 - easeOut * 0.12;
        const targetRotZ = -0.04 * (1 - easeOut);
        const targetOpen = 0.06 + easeOut * 0.88;
        const targetPosX = 0;
        const targetPosY = isNarrow ? 0.05 : -0.02;
        const targetCamZ = (isNarrow ? 7.8 * aspectBoost : 6.7) - easeOut * 0.2;
        const targetCamY = 0.46 + easeOut * 0.12;

        state.rotY += (targetRotY - state.rotY) * 0.12;
        state.rotX += (targetRotX - state.rotX) * 0.12;
        state.rotZ += (targetRotZ - state.rotZ) * 0.12;
        state.open += (targetOpen - state.open) * 0.12;
        state.posX += (targetPosX - state.posX) * 0.12;
        state.posY += (targetPosY - state.posY) * 0.12;
        state.camZ += (targetCamZ - state.camZ) * 0.12;
        state.camY += (targetCamY - state.camY) * 0.12;
      } else if (mode === 'hero') {
        let p = 0;
        if (scrollTargetRef && scrollTargetRef.current) {
          const rect = scrollTargetRef.current.getBoundingClientRect();
          const scrollable = Math.max(rect.height - window.innerHeight, 1);
          p = Math.max(0, Math.min(1, -rect.top / scrollable));
        }

        const openT = Math.min(1, p / 0.42);
        const glideT = Math.max(0, Math.min(1, (p - 0.3) / 0.52));
        const smoothOpen = openT * openT * (3 - 2 * openT);
        const smoothGlide = glideT * glideT * (3 - 2 * glideT);

        // Auto-open smoothly on initial page load (like Apple iPhone Duo), then stay grounded
        const introRaw = prefersReducedMotion ? 1 : Math.min(1, t / 1.45);
        const introEase = 1 - Math.pow(1 - introRaw, 3);
        const effectiveOpen = Math.max(smoothOpen, introEase * 0.92);

        const targetRotY = -0.78 + effectiveOpen * 0.54 + smoothGlide * 0.08;
        const targetRotX = 0.24 - effectiveOpen * 0.12;
        const targetRotZ = -0.05 * (1 - effectiveOpen);
        const targetOpen = 0.08 + effectiveOpen * 0.92; // Smoothly opens on load!
        const targetPosX = isNarrow ? 0 : smoothGlide * 1.52;
        const targetPosY = isNarrow ? 0.18 + smoothGlide * 0.52 : 0.32 - smoothGlide * 0.18;
        const targetCamZ =
          (isNarrow ? 8.6 * aspectBoost : 7.9) - effectiveOpen * 0.25 + smoothGlide * 0.35;
        const targetCamY = (isNarrow ? 0.48 + smoothGlide * 0.25 : 0.52) + effectiveOpen * 0.14;

        const tiltX = prefersReducedMotion || isPhone ? 0 : pointer.y * 0.08;
        const tiltY = prefersReducedMotion || isPhone ? 0 : pointer.x * 0.16;

        state.rotY += (targetRotY + tiltY - state.rotY) * 0.1;
        state.rotX += (targetRotX + tiltX - state.rotX) * 0.1;
        state.rotZ += (targetRotZ - state.rotZ) * 0.1;
        state.open += (targetOpen - state.open) * 0.11;
        state.posX += (targetPosX - state.posX) * 0.1;
        state.posY += (targetPosY - state.posY) * 0.1;
        state.camZ += (targetCamZ - state.camZ) * 0.1;
        state.camY += (targetCamY - state.camY) * 0.1;
      } else {
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
        const mobileZoom = isPhone ? Math.max(1.42, aspectBoost * 1.25) : Math.max(1.18, aspectBoost);
        const targetCamZ = isNarrow ? preset.camZ * mobileZoom : preset.camZ;
        const targetCamY = isPhone ? preset.camY + 0.15 : preset.camY;

        state.rotY +=
          (preset.rotY + dragOffsetY + (prefersReducedMotion || isPhone ? 0 : pointer.x * 0.06) - state.rotY) *
          0.14;
        state.rotX +=
          (preset.rotX + (prefersReducedMotion || isPhone ? 0 : pointer.y * 0.035) - state.rotX) * 0.14;
        state.rotZ += (0 - state.rotZ) * 0.1;
        state.open += (preset.open - state.open) * 0.12;
        state.posX += (0 - state.posX) * 0.1;
        state.posY += ((isPhone ? -0.05 : -0.18) - state.posY) * 0.1;
        state.camZ += (targetCamZ - state.camZ) * 0.12;
        state.camY += (targetCamY - state.camY) * 0.12;
      }

      if (rig) {
        rig.wrapper.rotation.set(state.rotX, state.rotY, state.rotZ);
        rig.wrapper.position.set(state.posX, state.posY, 0);
        applyLidOpen(rig, state.open);
      }

      shadowPlane.position.x = state.posX;
      const shadowScale = 1 - Math.abs(state.posY + 0.15) * 0.18;
      shadowPlane.scale.set(shadowScale, shadowScale, 1);

      camera.position.set(0, state.camY, state.camZ);
      camera.lookAt(state.posX * 0.28, 0.05, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      screenTexture.dispose();
      shadowTex.dispose();
      envRT.dispose();
      if (rig?.screenMat) rig.screenMat.dispose();
      shadowPlane.geometry.dispose();
      shadowMat.dispose();
      renderer.dispose();
    };
  }, [mode, scrollTargetRef]);

  if (status === 'error') {
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
    <div className={`relative w-full h-full select-none ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-white/85 border border-[#E2E7EE] text-[10px] uppercase tracking-[0.1em] text-[#647082]">
            Memuat Model 3D...
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        style={mode === 'explorer' ? { touchAction: 'pan-y' } : undefined}
        className={`w-full h-full ${
          mode === 'explorer' ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        aria-label="Visualisasi 3D interaktif MacBook Pro TechCare"
      />
    </div>
  );
}
