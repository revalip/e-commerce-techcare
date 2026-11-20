import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import Reveal from './Reveal';

const BRANDS = [
  'LENOVO THINKPAD',
  'APPLE',
  'ASUS',
  'DELL',
  'MSI',
  'LG',
  'LOGITECH',
  'FANTECH',
  'CORSAIR',
  'KINGSTON',
  'SAMSUNG'
];

export default function HeroSection({
  onShopClick,
  onTrackClick,
  onQuickSearch,
  onSelectCollection
}) {
  const [heroSearch, setHeroSearch] = useState('');
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const specimenY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 28]);

  const quickCategories = [
    { label: 'Semua', slug: '' },
    { label: 'Laptop Second', slug: 'laptop-second' },
    { label: 'RAM & Memori', slug: 'ram-memori' },
    { label: 'SSD NVMe', slug: 'ssd-storage' },
    { label: 'Monitor', slug: 'display-monitor' },
    { label: 'Peripherals', slug: 'peripherals' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onQuickSearch) {
      onQuickSearch(heroSearch.trim());
    } else {
      onShopClick();
    }
  };

  return (
    <section ref={heroRef} className="w-full">
      {/* 1. Matte Carbon Architectural Hero (Solara + Lightweight Crosshair DNA — ZERO Gradients/Glow) */}
      <div className="bg-[#111111] text-[#F2F1EC] border-b border-[#2A2A27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="relative border border-[#2A2A27] p-5 sm:p-8 lg:p-12">
            {/* Subtle Architectural Crosshair Markers (+) */}
            <span aria-hidden="true" className="absolute -top-[9px] -left-[5px] font-mono text-xs text-[#6E6D68] select-none">+</span>
            <span aria-hidden="true" className="absolute -top-[9px] -right-[5px] font-mono text-xs text-[#6E6D68] select-none">+</span>
            <span aria-hidden="true" className="absolute -bottom-[9px] -left-[5px] font-mono text-xs text-[#6E6D68] select-none">+</span>
            <span aria-hidden="true" className="absolute -bottom-[9px] -right-[5px] font-mono text-xs text-[#6E6D68] select-none">+</span>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Typographic Centerpiece */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <Reveal delay={0.03}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#A8A69E]">
                    <span className="inline-flex items-center gap-1.5 text-[#F2F1EC]">
                      <span className="w-2 h-2 bg-[#E63B19]" />
                      TECHCARE // 2026
                    </span>
                    <span className="text-[#4A4A45]">/</span>
                    <span>CERTIFIED PRE-OWNED &lt; RP 10 JUTA</span>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <h1 className="font-display text-[36px] sm:text-6xl lg:text-[70px] font-black uppercase tracking-[-0.04em] leading-[0.94] text-[#F2F1EC]">
                    PERANGKAT IT.
                    <br />
                    STANDAR{' '}
                    <span className="text-[#E63B19]">TEKNISI.</span>
                  </h1>
                </Reveal>

                <Reveal delay={0.14}>
                  <p className="text-xs sm:text-sm md:text-base text-[#A8A69E] leading-relaxed max-w-xl">
                    Laptop bisnis ThinkPad, MacBook Air M1, ASUS OLED, monitor MSI &amp; LG, peripheral Logitech &amp; Fantech, hingga upgrade RAM/SSD — seluruh unit melalui 32 titik pengecekan fisik, thermal, dan baterai di workshop kami.
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={onShopClick}
                      className="tc-btn-bone"
                    >
                      <span>Lihat Katalog</span>
                      <ArrowUpRight size={15} strokeWidth={2.2} />
                    </button>

                    <button
                      type="button"
                      onClick={onTrackClick}
                      className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-[2px] font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#F2F1EC] border border-[#3A3A36] hover:border-[#F2F1EC] transition-colors"
                    >
                      <span>Lacak Pesanan</span>
                    </button>
                  </div>
                </Reveal>

                {/* Honest Factual Spec Strip (Zero Fabricated Ratings/Sales Counts) */}
                <Reveal delay={0.22}>
                  <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 border-t border-[#2A2A27] max-w-lg">
                    <div>
                      <p className="font-mono text-base sm:text-xl font-bold text-[#F2F1EC] tabular-nums">
                        13 UNIT
                      </p>
                      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#8A8880] mt-0.5">
                        Katalog Terkurasi
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-base sm:text-xl font-bold text-[#F2F1EC] tabular-nums">
                        32 TITIK
                      </p>
                      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#8A8880] mt-0.5">
                        Cek QC Teknisi
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-base sm:text-xl font-bold text-[#E63B19] tabular-nums">
                        30–90 HR
                      </p>
                      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.08em] text-[#8A8880] mt-0.5">
                        Garansi Toko
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right Hardware Specimen Plate (Lightweight Desktop Scroll Parallax) */}
              <motion.div
                style={{ y: specimenY }}
                className="lg:col-span-5"
              >
                <div
                  onClick={onShopClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onShopClick()}
                  className="bg-[#1C1C1A] border border-[#2A2A27] hover:border-[#6E6D68] transition-colors cursor-pointer group"
                >
                  {/* Specimen Header */}
                  <div className="px-4 py-2.5 border-b border-[#2A2A27] flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.08em]">
                    <span className="text-[#F2F1EC]">TC_01 // FLAGSHIP UNIT</span>
                    <span className="text-[#E63B19] font-semibold">GRADE A+ • 97%</span>
                  </div>

                  {/* Full-Bleed Hardware Studio Plate */}
                  <div className="bg-[#E7E5DE] aspect-[16/10] w-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/products/thinkpad-x1-carbon-front.jpg"
                      alt="Lenovo ThinkPad X1 Carbon Gen 9 TECHCARE"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Specimen Technical Spec Sheet */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#8A8880]">
                          LENOVO THINKPAD
                        </p>
                        <p className="font-display text-base sm:text-lg font-bold text-[#F2F1EC] leading-snug">
                          X1 Carbon Gen 9
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-[10px] text-[#787771] line-through block tabular-nums">
                          Rp 9.500.000
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-[#F2F1EC] tabular-nums">
                          Rp 7.850.000
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#2A2A27] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.06em] text-[#A8A69E]">
                      <span>RAM 8–32GB / SSD 256GB–1TB</span>
                      <span className="text-[#F2F1EC] inline-flex items-center gap-1 group-hover:text-[#E63B19] transition-colors">
                        <span>DETAIL</span>
                        <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lightweight CSS-Only Infinite Brand Marquee */}
      <div className="bg-[#E7E5DE] border-b border-[#D6D4CC] py-3 overflow-hidden tc-marquee-wrap">
        <div className="tc-marquee-track font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3A3A36]">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={`${brand}-${i}`} className="inline-flex items-center whitespace-nowrap">
              <span className="px-5 sm:px-7">{brand}</span>
              <span className="w-1.5 h-1.5 bg-[#E63B19] inline-block" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {/* 3. Dimwit-Style Hairline Search & Quick Category Index Bar */}
      <div className="bg-[#F2F1EC] border-b border-[#D6D4CC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96 flex-shrink-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6D68]" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Cari ThinkPad, ASUS, MSI, Logitech, RAM..."
              className="tc-input pl-10 pr-20"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[34px] px-3.5 rounded-[2px] bg-[#111111] hover:bg-[#E63B19] text-[#F2F1EC] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors"
            >
              Cari
            </button>
          </form>

          <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-0.5 lg:pb-0 no-scrollbar">
            {quickCategories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => onSelectCollection(cat.slug)}
                className="min-h-[40px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3A3A36] hover:text-[#E63B19] border-b-2 border-transparent hover:border-[#E63B19] whitespace-nowrap transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
