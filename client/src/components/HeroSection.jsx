import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

/**
 * Apple.com/id Beranda Top Stack:
 * - Light Hero (#F5F5F7) with 1-shot ThinkPad X1 Carbon studio reveal video (/assets/hero.mp4, 385 KB)
 *   blended seamlessly onto #F5F5F7 via pure-white mix-blend-multiply (no loop, stops dead-center).
 * - Synchronized Apple iPhone Duo-style subtitle reveal:
 *   "Laptop bekas." -> "Laptop bekas. Rasa baru."
 * - Consistent Apple pill CTAs: "Selengkapnya" (solid blue) + "Beli" (blue outline).
 * - Subtle "Putar ulang" control to replay the 1-shot reveal anytime.
 */
export default function HeroSection({ onShopClick, onLearnClick, onAboutClick }) {
  const darkRef = useRef(null);
  const videoRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const [isRevealed, setIsRevealed] = useState(Boolean(shouldReduceMotion));
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || videoError) {
      setIsRevealed(true);
      return undefined;
    }
    // Fallback timer in case mobile battery-saver pauses autoplay
    const fallbackTimer = setTimeout(() => setIsRevealed(true), 1600);
    return () => clearTimeout(fallbackTimer);
  }, [replayKey, shouldReduceMotion, videoError]);

  const { scrollYProgress: darkScroll } = useScroll({
    target: darkRef,
    offset: ['start end', 'end start']
  });
  const darkImgY = useTransform(darkScroll, [0, 1], [-20, 20]);

  const handleTimeUpdate = (e) => {
    if (!isRevealed && e.currentTarget.currentTime >= 1.15) {
      setIsRevealed(true);
    }
  };

  const handleVideoEnded = () => {
    setIsRevealed(true);
    setVideoEnded(true);
  };

  const handleReplay = () => {
    setIsRevealed(false);
    setVideoEnded(false);
    setReplayKey((k) => k + 1);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => setIsRevealed(true));
      }
    }
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
              animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
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

          {/* 1-Shot ThinkPad X1 Carbon Studio Video (pure white bg + mix-blend-multiply -> seamless on #F5F5F7) */}
          <div className="mt-6 sm:mt-8 max-w-[660px] mx-auto flex items-center justify-center">
            {shouldReduceMotion || videoError ? (
              <img
                src="/assets/products/thinkpad-x1-carbon-front.png"
                alt="Lenovo ThinkPad X1 Carbon Gen 9"
                width={922}
                height={720}
                className="w-full max-w-[540px] max-h-[280px] sm:max-h-[380px] lg:max-h-[420px] object-contain select-none"
              />
            ) : (
              <video
                ref={videoRef}
                src="/assets/hero.mp4"
                poster="/assets/hero-poster.jpg"
                autoPlay
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onError={() => setVideoError(true)}
                aria-label="Animasi Lenovo ThinkPad X1 Carbon berputar ke posisi depan"
                className="w-full max-w-[620px] aspect-[1080/792] max-h-[290px] sm:max-h-[390px] lg:max-h-[440px] object-contain mix-blend-multiply select-none pointer-events-none"
              />
            )}
          </div>

          {/* Subtle Apple-style Replay Control (appears cleanly once played) */}
          {!shouldReduceMotion && !videoError && (
            <div className="mt-3 flex justify-center min-h-[28px]">
              <button
                type="button"
                onClick={handleReplay}
                className={`inline-flex items-center gap-1.5 text-[12px] text-[#6E6E73] hover:text-[#1D1D1F] transition-opacity duration-300 py-1 px-3 rounded-full cursor-pointer ${
                  videoEnded ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                }`}
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
            className="mt-6 sm:mt-10 flex items-center justify-center"
          >
            <img
              src="/assets/tile-upgrade-dark.jpg"
              alt="Upgrade RAM DDR5 & NVMe PCIe Gen4 SSD TechCare"
              width={1280}
              height={714}
              loading="lazy"
              className="w-full max-w-[840px] h-auto object-contain select-none"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
