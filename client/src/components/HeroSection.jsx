import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const Laptop3DCanvas = lazy(() => import('./Laptop3DCanvas'));

function getInitialHeroVariant() {
  if (typeof window === 'undefined') return 'a';
  const params = new URLSearchParams(window.location.search);
  return params.get('hero')?.toLowerCase() === 'b' ? 'b' : 'a';
}

/**
 * Apple.com/id Beranda Top Stack with A/B Hero Switch (?hero=a | ?hero=b):
 * - Synchronized Apple iPhone Duo-style 1-shot opening reveal:
 *   "Laptop bekas." -> "Laptop bekas. Rasa baru."
 * - Consistent Apple pill CTAs: "Selengkapnya" (solid blue) + "Beli" (blue outline).
 * - Variant A (?hero=a): Ultra-crisp transparent PNG ThinkPad side-to-open reveal.
 * - Variant B (?hero=b): Matte-black unbranded 3D laptop 1-shot lid-open, then completely still.
 */
export default function HeroSection({ onShopClick, onLearnClick, onAboutClick }) {
  const heroVariant = getInitialHeroVariant();
  const darkRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const [isOpened, setIsOpened] = useState(Boolean(shouldReduceMotion));
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsOpened(true);
      return undefined;
    }
    setIsOpened(false);
    const timer = setTimeout(() => setIsOpened(true), 850);
    return () => clearTimeout(timer);
  }, [replayKey, shouldReduceMotion]);

  const { scrollYProgress: darkScroll } = useScroll({
    target: darkRef,
    offset: ['start end', 'end start']
  });
  const darkImgY = useTransform(darkScroll, [0, 1], [-20, 20]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  return (
    <div className="w-full bg-white space-y-3">
      {/* 1. HERO TERANG (#F5F5F7) */}
      <section className="w-full bg-[#F5F5F7] pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 overflow-hidden">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="tc-hero-title text-[#1D1D1F]">
            ThinkPad &amp; Laptop Bisnis
          </h1>

          {/* Apple iPhone Duo-style Synchronized Subtitle Reveal */}
          <p className="mt-2.5 sm:mt-3 text-[19px] sm:text-[26px] leading-[1.2] tracking-[-0.015em] text-[#1D1D1F] font-normal min-h-[1.3em] flex items-center justify-center flex-wrap gap-x-1.5">
            <span>Laptop bekas.</span>
            <motion.span
              key={`sub-${replayKey}`}
              initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              animate={isOpened ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-[#1D1D1F]"
            >
              Rasa baru.
            </motion.span>
          </p>

          {/* Consistent Apple Pill CTAs: Solid Blue "Selengkapnya" + Outline Blue "Beli" */}
          <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onLearnClick}
              className="min-h-[42px] px-5 sm:px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Selengkapnya
            </button>
            <button
              type="button"
              onClick={onShopClick}
              className="min-h-[42px] px-5 sm:px-6 rounded-[980px] border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Beli
            </button>
          </div>

          {/* Visual Centerpiece: Variant A (Transparent PNG ThinkPad) vs Variant B (1-Shot 3D Lid Open) */}
          {heroVariant === 'b' ? (
            <div className="mt-6 sm:mt-8 max-w-[780px] mx-auto">
              <div className="relative h-[280px] sm:h-[400px] lg:h-[450px] w-full pointer-events-none">
                <Suspense fallback={null}>
                  <Laptop3DCanvas key={`3d-${replayKey}`} mode="once" />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="mt-8 sm:mt-10 max-w-[680px] mx-auto h-[250px] sm:h-[360px] lg:h-[420px] flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {!isOpened ? (
                  <motion.img
                    key={`closed-${replayKey}`}
                    src="/assets/products/thinkpad-x1-carbon-side.png"
                    alt="Lenovo ThinkPad X1 Carbon posisi samping"
                    width={922}
                    height={644}
                    initial={{ opacity: 0.7, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 0.98 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-h-full max-w-[85%] object-contain select-none"
                  />
                ) : (
                  <motion.img
                    key={`open-${replayKey}`}
                    src="/assets/products/thinkpad-x1-carbon-front.png"
                    alt="Lenovo ThinkPad X1 Carbon Gen 9 terbuka penuh"
                    width={922}
                    height={720}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-h-full max-w-[92%] object-contain select-none"
                  />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Subtle Apple-style Replay Control */}
          {!shouldReduceMotion && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-1.5 text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors py-1 px-3 rounded-full"
              >
                <RotateCcw size={12} strokeWidth={1.8} />
                <span>Putar ulang</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. TILE BESAR HITAM (#000000): Upgrade RAM & SSD */}
      <section
        ref={darkRef}
        className="w-full bg-[#000000] text-white pt-14 sm:pt-20 pb-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="tc-section-title text-white">Upgrade RAM &amp; SSD</h2>
          <p className="mt-2.5 text-[17px] sm:text-[22px] text-[#F5F5F7] max-w-xl mx-auto">
            Pasang gratis di workshop. Garansi toko hingga 90 hari.
          </p>

          <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onAboutClick || onLearnClick}
              className="min-h-[42px] px-5 sm:px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Selengkapnya
            </button>
            <button
              type="button"
              onClick={onShopClick}
              className="min-h-[42px] px-5 sm:px-6 rounded-[980px] border border-[#0071E3] text-[#2997FF] hover:bg-[#0071E3] hover:text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Beli
            </button>
          </div>

          <motion.div
            style={shouldReduceMotion ? undefined : { y: darkImgY }}
            className="mt-10 sm:mt-14 flex items-center justify-center gap-6 sm:gap-12 flex-wrap"
          >
            <img
              src="/assets/products/corsair-vengeance-ram.png"
              alt="Corsair Vengeance RAM"
              width={480}
              height={309}
              loading="lazy"
              className="w-[220px] sm:w-[320px] h-auto object-contain select-none"
            />
            <img
              src="/images/products/samsung-990-pro-heatsink.png"
              alt="Samsung 990 PRO NVMe PCIe Gen4 SSD"
              width={420}
              height={180}
              loading="lazy"
              className="w-[210px] sm:w-[300px] h-auto object-contain select-none"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
