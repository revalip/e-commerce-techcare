import React, { useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

// 3D engine is code-split: first paint stays fast, WebGL loads right after
const Laptop3DCanvas = lazy(() => import('./Laptop3DCanvas'));

export default function HeroSection({ onShopClick, onTrackClick }) {
  const stageContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageContainerRef,
    offset: ['start start', 'end end']
  });

  // Opening: giant wordmark behind the closed laptop. Scroll: wordmark fades, copy appears.
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.36, 0.52], [1, 0.4, 0]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.52], [1, 1.06]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const revealOpacity = useTransform(scrollYProgress, [0.42, 0.66], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.42, 0.66], [24, 0]);
  const revealPointer = useTransform(scrollYProgress, (v) => (v > 0.45 ? 'auto' : 'none'));

  return (
    <section className="w-full bg-[#F7F8FA]">
      <div
        ref={stageContainerRef}
        className="relative h-[165vh] sm:h-[200vh] lg:h-[220vh] bg-[#F7F8FA]"
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[520px] max-h-[860px] w-full overflow-hidden flex items-center justify-center">
          {/* Back: giant silver wordmark */}
          <motion.div
            style={{ opacity: wordmarkOpacity, scale: wordmarkScale }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4"
            aria-hidden="true"
          >
            <span className="font-display font-semibold tracking-[-0.055em] leading-none text-[21vw] sm:text-[18vw] lg:text-[16.5vw] tc-airform-wordmark select-none">
              TechCare
            </span>
          </motion.div>

          {/* Middle: 3D laptop */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <Suspense fallback={null}>
              <Laptop3DCanvas mode="hero" scrollTargetRef={stageContainerRef} />
            </Suspense>
          </div>

          {/* Front (intro): one CTA, one hint */}
          <motion.div
            style={{ opacity: introOpacity }}
            className="absolute inset-x-0 bottom-20 md:bottom-12 z-30 flex flex-col items-center gap-3 px-4"
          >
            <button type="button" onClick={onShopClick} className="tc-btn-primary">
              <span>Lihat Katalog</span>
              <ArrowUpRight size={15} />
            </button>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#647082]">
              <span>Scroll</span>
              <ChevronDown size={13} className="animate-bounce" />
            </span>
          </motion.div>

          {/* Front (after scroll): short headline beside the opened laptop */}
          <motion.div
            style={{ opacity: revealOpacity, y: revealY, pointerEvents: revealPointer }}
            className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-24 md:pb-14 lg:items-center lg:pb-0"
          >
            <div className="w-full lg:w-[42%] bg-[#F7F8FA]/85 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-5 sm:p-6 lg:p-0 rounded-3xl lg:rounded-none space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-[-0.045em] leading-[1.02] text-[#1D2129]">
                Perangkat IT.
                <br />
                <span className="text-[#8F9FB3] font-light">Teruji teknisi.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#4F627A] leading-relaxed max-w-sm">
                Laptop dan hardware bergaransi, lulus 32 titik pengecekan sebelum sampai ke tanganmu.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button type="button" onClick={onShopClick} className="tc-btn-primary">
                  <span>Lihat Katalog</span>
                  <ArrowUpRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={onTrackClick}
                  className="text-sm font-medium text-[#4F627A] hover:text-[#1D2129] transition-colors min-h-[44px]"
                >
                  Lacak pesanan →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
