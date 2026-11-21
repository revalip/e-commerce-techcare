import React, { useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// 3D engine stays code-split for fast first paint
const Laptop3DCanvas = lazy(() => import('./Laptop3DCanvas'));

/**
 * Apple.com/id Full-Width Hero Tile #1 (Light #F7F8FA Surface) + Tile #2 (Dark #1D2129 Surface):
 * Big bold title, super short punchy tagline, 2 Apple links ("Selengkapnya" & "Beli"), large visual.
 */
export default function HeroSection({ onShopClick, onLearnClick, onAboutClick }) {
  const stageContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageContainerRef,
    offset: ['start start', 'end end']
  });

  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.36, 0.52], [1, 0.4, 0]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.52], [1, 1.06]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const revealOpacity = useTransform(scrollYProgress, [0.42, 0.66], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.42, 0.66], [24, 0]);
  const revealPointer = useTransform(scrollYProgress, (v) => (v > 0.45 ? 'auto' : 'none'));

  return (
    <div className="w-full space-y-3 bg-white">
      {/* FULL-WIDTH TILE 1 (LIGHT #F7F8FA): Laptop bekas. Rasa baru. */}
      <section className="w-full bg-[#F7F8FA] overflow-hidden">
        {/* Mobile (< md): Immediate above-the-fold Apple hero */}
        <div className="md:hidden px-4 pt-8 pb-6 space-y-4 text-center">
          <div className="space-y-1.5">
            <h1 className="font-display text-[34px] font-semibold tracking-[-0.04em] leading-[1.06] text-[#1D2129]">
              ThinkPad &amp; Workstation
            </h1>
            <p className="text-base text-[#1D2129] font-normal">
              Laptop bekas. Rasa baru.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onLearnClick}
                className="min-h-[42px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium transition-colors"
              >
                Selengkapnya
              </button>
              <button
                type="button"
                onClick={onShopClick}
                className="min-h-[42px] px-5 rounded-full border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-xs font-medium transition-colors"
              >
                Beli
              </button>
            </div>
          </div>

          <div className="relative h-[230px] w-full overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="font-display font-semibold tracking-[-0.055em] leading-none text-[18vw] tc-airform-wordmark select-none opacity-65">
                TechCare
              </span>
            </div>
            <Suspense fallback={null}>
              <Laptop3DCanvas mode="hero" />
            </Suspense>
          </div>
        </div>

        {/* Desktop (md+): Apple Full-Width Hero with auto-opening 3D laptop & scroll choreography */}
        <div
          ref={stageContainerRef}
          className="hidden md:block relative h-[145vh] bg-[#F7F8FA]"
        >
          <div className="sticky top-12 h-[calc(100vh-3rem)] min-h-[540px] max-h-[820px] w-full overflow-hidden flex items-center justify-center">
            <motion.div
              style={{ opacity: wordmarkOpacity, scale: wordmarkScale }}
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4"
              aria-hidden="true"
            >
              <span className="font-display font-semibold tracking-[-0.055em] leading-none text-[16vw] tc-airform-wordmark select-none">
                TechCare
              </span>
            </motion.div>

            {/* Centered 3D Ultrabook */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <Suspense fallback={null}>
                <Laptop3DCanvas mode="hero" scrollTargetRef={stageContainerRef} />
              </Suspense>
            </div>

            {/* Intro overlay: Apple headline + Selengkapnya & Beli */}
            <motion.div
              style={{ opacity: introOpacity }}
              className="absolute inset-x-0 top-6 z-30 flex flex-col items-center text-center gap-1.5 px-4"
            >
              <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-[#1D2129]">
                ThinkPad &amp; Workstation
              </h1>
              <p className="text-lg text-[#1D2129]">
                Laptop bekas. Rasa baru.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onLearnClick}
                  className="min-h-[40px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-medium transition-colors"
                >
                  Selengkapnya
                </button>
                <button
                  type="button"
                  onClick={onShopClick}
                  className="min-h-[40px] px-5 rounded-full border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-sm font-medium transition-colors"
                >
                  Beli
                </button>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: introOpacity }}
              className="absolute inset-x-0 bottom-5 z-30 flex justify-center pointer-events-none"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#6E6E73] bg-[#F7F8FA]/85 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E2E7EE]">
                <span>Scroll</span>
                <ChevronDown size={13} className="animate-bounce" />
              </span>
            </motion.div>

            {/* After scroll: Editorial copy beside opened laptop */}
            <motion.div
              style={{ opacity: revealOpacity, y: revealY, pointerEvents: revealPointer }}
              className="relative z-30 w-full max-w-6xl mx-auto px-6 lg:px-8 h-full flex items-center"
            >
              <div className="w-[35%] max-w-xs space-y-4">
                <h2 className="font-display text-5xl font-semibold tracking-[-0.045em] leading-[1.04] text-[#1D2129]">
                  32 Titik QC.
                  <br />
                  <span className="text-[#6E6E73] font-normal">Siap kerja keras.</span>
                </h2>
                <p className="text-base text-[#4F627A] leading-relaxed max-w-sm">
                  Layar bebas dead pixel, thermal paste baru, baterai sehat, bergaransi toko hingga 90 hari.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onLearnClick}
                    className="min-h-[44px] px-6 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-medium transition-colors"
                  >
                    Selengkapnya
                  </button>
                  <button
                    type="button"
                    onClick={onShopClick}
                    className="min-h-[44px] px-6 rounded-full border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-sm font-medium transition-colors"
                  >
                    Beli
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH TILE 2 (DARK #1D2129): Upgrade. Bergaransi. */}
      <section className="w-full bg-[#1D2129] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 pt-12 sm:pt-16 pb-0 text-center space-y-3">
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.04em]">
            Upgrade &amp; Thermal Studio
          </h2>
          <p className="text-base sm:text-xl text-[#CBD5E1]">
            Upgrade. Bergaransi.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onAboutClick || onLearnClick}
              className="min-h-[42px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Selengkapnya
            </button>
            <button
              type="button"
              onClick={onShopClick}
              className="min-h-[42px] px-5 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#1D2129] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Beli
            </button>
          </div>

          <div className="pt-6 sm:pt-8 max-w-3xl mx-auto">
            <img
              src="/images/products/thermal-cooling-internal.jpg"
              alt="Komponen kipas pendingin & thermal paste baru TechCare"
              loading="lazy"
              className="w-full h-[240px] sm:h-[360px] object-cover object-center rounded-t-3xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
