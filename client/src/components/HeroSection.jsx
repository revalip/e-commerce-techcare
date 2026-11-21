import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * Apple.com/id Full-Width Hero Stack:
 * - Tile 1 (Light #F5F5F7): Giant headline + 1-line tagline + "Beli" (blue) & "Selengkapnya >"
 *   Studio product photograph zooms/shifts smoothly with scroll (useScroll + useTransform + useSpring)
 *   and gentle Ken Burns on load; headline subtly fades/scales on scroll.
 * - Tile 2 (Dark #1D1D1F): Full-width contrasting hardware upgrade showcase with subtle parallax.
 */
export default function HeroSection({ onShopClick, onLearnClick, onAboutClick }) {
  const heroRef = useRef(null);
  const darkTileRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const smoothHero = useSpring(heroProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3
  });

  // Hero text fades/scales gently while product photo scales up and shifts on scroll
  const textOpacity = useTransform(smoothHero, [0, 0.55], [1, 0.2]);
  const textScale = useTransform(smoothHero, [0, 0.55], [1, 0.96]);
  const textY = useTransform(smoothHero, [0, 0.55], [0, -18]);
  const imageScale = useTransform(smoothHero, [0, 0.9], [1, 1.09]);
  const imageY = useTransform(smoothHero, [0, 0.9], [0, 28]);

  // Subtle parallax on Dark Tile 2 photo
  const { scrollYProgress: darkProgress } = useScroll({
    target: darkTileRef,
    offset: ['start end', 'end start']
  });
  const darkImageY = useTransform(darkProgress, [0, 1], [-18, 18]);

  return (
    <div className="w-full bg-white space-y-3">
      {/* FULL-WIDTH HERO TILE 1 (LIGHT #F5F5F7) */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#F5F5F7] overflow-hidden pt-12 sm:pt-16 lg:pt-20 pb-0"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            style={
              shouldReduceMotion
                ? undefined
                : { opacity: textOpacity, scale: textScale, y: textY }
            }
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="font-display text-[36px] sm:text-[52px] lg:text-[64px] font-semibold tracking-[-0.035em] leading-[1.06] text-[#1D1D1F]">
              ThinkPad &amp; Laptop Bisnis
            </h1>
            <p className="text-[19px] sm:text-[26px] font-normal tracking-[-0.015em] leading-[1.2] text-[#1D1D1F]">
              Laptop bisnis. Dicek satu per satu.
            </p>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Lenovo, ASUS, Dell, hingga MacBook terkurasi di bawah Rp 10 juta. Garansi toko 30–90 hari.
            </p>

            {/* Apple CTA Pair: Blue Solid "Beli" + Clean "Selengkapnya >" Link */}
            <div className="pt-3 flex items-center justify-center gap-5 sm:gap-6">
              <button
                type="button"
                onClick={onShopClick}
                className="min-h-[44px] px-6 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm sm:text-[17px] font-normal transition-colors cursor-pointer"
              >
                Beli
              </button>
              <button
                type="button"
                onClick={onLearnClick}
                className="inline-flex items-center gap-0.5 min-h-[44px] text-sm sm:text-[17px] font-normal text-[#0071E3] hover:underline transition-colors cursor-pointer"
              >
                <span>Selengkapnya</span>
                <ChevronRight size={17} strokeWidth={2} />
              </button>
            </div>
          </motion.div>

          {/* Clean Studio Product Photograph (Zero 3D/AI clutter, smooth Ken Burns + Scroll Zoom) */}
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto overflow-hidden rounded-t-[28px]">
            <motion.div
              style={shouldReduceMotion ? undefined : { scale: imageScale, y: imageY }}
              className="w-full"
            >
              <img
                src="/assets/hero-workstation-studio.jpg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/products/thinkpad-x1-carbon-front.jpg';
                }}
                alt="Laptop bisnis terkurasi TechCare — Lenovo ThinkPad & Ultrabook studio"
                className="w-full h-[260px] sm:h-[400px] lg:h-[460px] object-cover object-center tc-ken-burns"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH TILE 2 (DARK #1D1D1F) */}
      <section
        ref={darkTileRef}
        className="relative w-full bg-[#1D1D1F] text-white overflow-hidden pt-14 sm:pt-20 pb-0"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <h2 className="font-display text-[32px] sm:text-[48px] lg:text-[56px] font-semibold tracking-[-0.035em] leading-[1.07]">
            Upgrade RAM &amp; SSD
          </h2>
          <p className="text-[19px] sm:text-[26px] font-normal tracking-[-0.015em] leading-[1.2] text-[#F5F5F7]">
            Upgrade hardware. Gratis pasang di workshop.
          </p>
          <p className="text-xs sm:text-sm text-[#A1A1A6]">
            Corsair, Kingston FURY, dan Samsung 990 PRO NVMe lulus uji MemTest86 &amp; CrystalDiskInfo.
          </p>

          <div className="pt-3 flex items-center justify-center gap-5 sm:gap-6">
            <button
              type="button"
              onClick={onShopClick}
              className="min-h-[44px] px-6 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Beli
            </button>
            <button
              type="button"
              onClick={onAboutClick || onLearnClick}
              className="inline-flex items-center gap-0.5 min-h-[44px] text-sm sm:text-[17px] font-normal text-[#2997FF] hover:underline transition-colors cursor-pointer"
            >
              <span>Selengkapnya</span>
              <ChevronRight size={17} strokeWidth={2} />
            </button>
          </div>

          <div className="pt-8 sm:pt-10 max-w-4xl mx-auto overflow-hidden rounded-t-[28px]">
            <motion.img
              style={shouldReduceMotion ? undefined : { y: darkImageY }}
              src="/images/products/thermal-cooling-internal.jpg"
              alt="Pembersihan kipas, pipa tembaga, dan penggantian thermal paste TechCare"
              loading="lazy"
              className="w-full h-[250px] sm:h-[380px] object-cover object-center scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
