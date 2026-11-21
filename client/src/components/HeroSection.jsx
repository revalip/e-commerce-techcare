import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * Apple.com/id Beranda Top Stack:
 * 1) Hero Terang (#F5F5F7): Giant headline + ONE short subtitle + blue pill "Beli" + "Selengkapnya ›"
 *    + large transparent PNG flagship laptop floating seamlessly (gentle parallax <= 40px, stagger 0.1s).
 * 2) Tile Besar Hitam (#000000): Upgrade RAM & SSD + 1-line copy + two blue links + transparent hardware PNGs.
 */
export default function HeroSection({ onShopClick, onLearnClick, onAboutClick }) {
  const heroRef = useRef(null);
  const darkRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroImgY = useTransform(heroScroll, [0, 1], [0, 36]);

  const { scrollYProgress: darkScroll } = useScroll({
    target: darkRef,
    offset: ['start end', 'end start']
  });
  const darkImgY = useTransform(darkScroll, [0, 1], [-24, 24]);

  const ease = [0.25, 0.1, 0.25, 1];

  return (
    <div className="w-full bg-white space-y-3">
      {/* 1. HERO TERANG (#F5F5F7) */}
      <section
        ref={heroRef}
        className="w-full bg-[#F5F5F7] pt-14 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 overflow-hidden"
      >
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0, ease }}
            className="tc-hero-title text-[#1D1D1F]"
          >
            ThinkPad &amp; Laptop Bisnis
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="mt-3 sm:mt-4 text-[19px] sm:text-[26px] leading-[1.2] tracking-[-0.015em] text-[#6E6E73] font-normal"
          >
            Laptop bisnis. Dicek satu per satu.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-6 sm:mt-7 flex items-center justify-center gap-6"
          >
            <button
              type="button"
              onClick={onShopClick}
              className="tc-btn-primary"
            >
              Beli
            </button>
            <button
              type="button"
              onClick={onLearnClick}
              className="inline-flex items-center gap-0.5 min-h-[44px] text-[17px] text-[#0071E3] hover:underline transition-colors"
            >
              <span>Selengkapnya</span>
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </motion.div>

          {/* Transparent PNG Flagship Laptop (No grey box, parallax <= 36px) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            style={shouldReduceMotion ? undefined : { y: heroImgY }}
            className="mt-10 sm:mt-14 flex justify-center"
          >
            <img
              src="/assets/products/thinkpad-x1-carbon-front.png"
              alt="Lenovo ThinkPad X1 Carbon Gen 9 terkurasi TechCare"
              width={922}
              height={720}
              className="w-full max-w-[340px] sm:max-w-[540px] lg:max-w-[660px] h-auto object-contain select-none"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. TILE BESAR HITAM (#000000): Upgrade RAM & SSD */}
      <section
        ref={darkRef}
        className="w-full bg-[#000000] text-white py-16 sm:py-24 lg:py-28 overflow-hidden"
      >
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="tc-section-title text-white">Upgrade RAM &amp; SSD</h2>
          <p className="mt-3 text-[17px] sm:text-[21px] text-[#A1A1A6] max-w-xl mx-auto">
            Pasang gratis di workshop. Garansi toko hingga 90 hari.
          </p>

          <div className="mt-6 flex items-center justify-center gap-7">
            <button
              type="button"
              onClick={onAboutClick || onLearnClick}
              className="inline-flex items-center gap-0.5 min-h-[44px] text-[17px] text-[#2997FF] hover:underline transition-colors"
            >
              <span>Pelajari lebih lanjut</span>
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={onShopClick}
              className="inline-flex items-center gap-0.5 min-h-[44px] text-[17px] text-[#2997FF] hover:underline transition-colors"
            >
              <span>Beli</span>
              <ChevronRight size={18} strokeWidth={1.8} />
            </button>
          </div>

          <motion.div
            style={shouldReduceMotion ? undefined : { y: darkImgY }}
            className="mt-10 sm:mt-14 flex items-center justify-center gap-6 sm:gap-12 flex-wrap"
          >
            <img
              src="/assets/products/corsair-vengeance-ram.png"
              alt="Corsair Vengeance Desktop & Laptop RAM"
              width={480}
              height={309}
              loading="lazy"
              className="w-[240px] sm:w-[340px] h-auto object-contain select-none"
            />
            <img
              src="/images/products/samsung-990-pro-heatsink.png"
              alt="Samsung 990 PRO NVMe PCIe Gen4 SSD"
              width={420}
              height={180}
              loading="lazy"
              className="w-[220px] sm:w-[320px] h-auto object-contain select-none"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
