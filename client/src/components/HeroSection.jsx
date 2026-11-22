import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Apple.com/id Beranda Top Stack:
 * - Light Hero (#F5F5F7) with 1-shot ThinkPad X1 Carbon lid-opening video (/assets/hero-thinkpad-open.mp4)
 *   blended seamlessly onto #F5F5F7 via pure-white mix-blend-multiply (plays once, stops cleanly open, no replay button).
 * - Synchronized Apple iPhone Duo-style subtitle reveal:
 *   "Laptop bekas." -> "Laptop bekas. Rasa baru."
 * - Consistent Apple pill CTAs: "Selengkapnya" (solid blue) + "Beli" (blue outline).
 */
export default function HeroSection({ onShopClick, onLearnClick, onAboutClick }) {
  const darkRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const [isRevealed, setIsRevealed] = useState(Boolean(shouldReduceMotion));
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || videoError) {
      setIsRevealed(true);
      return undefined;
    }
    // Fallback timer in case mobile battery-saver pauses autoplay
    const fallbackTimer = setTimeout(() => setIsRevealed(true), 2400);
    return () => clearTimeout(fallbackTimer);
  }, [shouldReduceMotion, videoError]);

  const { scrollYProgress: darkScroll } = useScroll({
    target: darkRef,
    offset: ['start end', 'end start']
  });
  const darkImgY = useTransform(darkScroll, [0, 1], [-20, 20]);

  const handleTimeUpdate = (e) => {
    if (!isRevealed && e.currentTarget.currentTime >= 1.85) {
      setIsRevealed(true);
    }
  };

  const handleVideoEnded = () => {
    setIsRevealed(true);
  };

  return (
    <div className="w-full bg-white space-y-3">
      {/* 1. HERO TERANG (#F5F5F7) — Exact Apple iPhone Duo proportions & bottom-flush video */}
      <section className="relative w-full bg-[#F5F5F7] pt-11 sm:pt-14 lg:pt-16 pb-0 overflow-hidden">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="tc-hero-title text-[#1D1D1F]">
            ThinkPad Series
          </h1>

          {/* Apple iPhone Duo-style Centered Synchronized Subtitle Reveal */}
          <p className="mt-1.5 sm:mt-2 text-[19px] sm:text-[26px] leading-[1.2] tracking-[-0.015em] text-[#1D1D1F] font-normal min-h-[1.3em] flex items-center justify-center">
            <motion.span
              layout
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Laptop bekas.
            </motion.span>
            <AnimatePresence initial={false}>
              {isRevealed && (
                <motion.span
                  key="sub-rasa-baru"
                  initial={shouldReduceMotion ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="inline-block overflow-hidden whitespace-nowrap text-[#1D1D1F]"
                >
                  &nbsp;Rasa baru.
                </motion.span>
              )}
            </AnimatePresence>
          </p>

          {/* Apple-proportioned Pill CTAs: Solid Blue "Selengkapnya" + Outline Blue "Beli" */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onLearnClick}
              className="h-[36px] sm:h-[42px] px-4 sm:px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Selengkapnya
            </button>
            <button
              type="button"
              onClick={onShopClick}
              className="h-[36px] sm:h-[42px] px-4 sm:px-5 rounded-[980px] border border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Beli
            </button>
          </div>
        </div>

        {/* Full-bleed bottom-flush video container: scaled up cleanly on mobile for commanding Apple presence */}
        <div className="mt-7 sm:mt-4 w-full max-w-[1160px] mx-auto px-0 flex items-end justify-center overflow-hidden">
          {shouldReduceMotion || videoError ? (
            <img
              src="/assets/products/thinkpad-x1-carbon-front.png"
              alt="Lenovo ThinkPad X1 Carbon Gen 9"
              width={922}
              height={720}
              className="w-full max-w-[540px] max-h-[280px] sm:max-h-[380px] lg:max-h-[420px] object-contain pb-8 select-none"
            />
          ) : (
            <video
              src="/assets/hero-thinkpad-open.mp4"
              poster="/assets/hero-thinkpad-open-poster.jpg"
              autoPlay
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onError={() => setVideoError(true)}
              aria-label="Animasi tangan membuka Lenovo ThinkPad X1 Carbon dari tertutup hingga terbuka"
              className="block w-full min-h-[250px] sm:min-h-0 aspect-[1280/624] object-cover object-bottom mix-blend-multiply select-none pointer-events-none scale-[1.18] sm:scale-100 origin-bottom lg:[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
            />
          )}
        </div>
      </section>

      {/* 2. TILE BESAR HITAM (#000000): Upgrade RAM & SSD (Apple iPhone Pro Full-Bleed Style) */}
      <section
        ref={darkRef}
        className="w-full bg-[#000000] text-white min-h-[480px] sm:min-h-[600px] pt-11 sm:pt-16 pb-10 sm:pb-14 flex flex-col justify-between overflow-hidden"
      >
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="tc-section-title text-white">Upgrade RAM &amp; SSD</h2>
          <p className="mt-1.5 sm:mt-2 text-[18px] sm:text-[22px] text-[#F5F5F7] max-w-2xl mx-auto">
            Pasang gratis. Garansi 90 hari.
          </p>

          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onAboutClick || onLearnClick}
              className="h-[36px] sm:h-[42px] px-4 sm:px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Selengkapnya
            </button>
            <button
              type="button"
              onClick={onShopClick}
              className="h-[36px] sm:h-[42px] px-4 sm:px-5 rounded-[980px] border border-[#0071E3] text-[#2997FF] hover:bg-[#0071E3] hover:text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Beli
            </button>
          </div>
        </div>

        <motion.div
          style={shouldReduceMotion ? undefined : { y: darkImgY }}
          className="mt-6 sm:mt-8 w-full max-w-[920px] mx-auto px-0 sm:px-6 flex items-center justify-center"
        >
          <img
            src="/assets/tile-upgrade-pro.jpg"
            alt="Upgrade RAM DDR5 & NVMe SSD Pro TechCare"
            width={1024}
            height={576}
            loading="lazy"
            className="w-full h-auto object-contain select-none"
          />
        </motion.div>
      </section>
    </div>
  );
}
