import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Search, ChevronDown } from 'lucide-react';
import Laptop3DCanvas from './Laptop3DCanvas';

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
  const stageContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageContainerRef,
    offset: ['start start', 'end end']
  });

  // Phase 1 (Opening Airform Shot): Giant faded wordmark behind 3D laptop
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.36, 0.52], [1, 0.45, 0]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.52], [1, 1.09]);
  const introCueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Phase 2 (Airform Mid-Scroll Reveal): Editorial headline & CTAs appear beside opened 3D laptop
  const revealOpacity = useTransform(scrollYProgress, [0.42, 0.68], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.42, 0.68], [32, 0]);
  const revealPointer = useTransform(scrollYProgress, (v) => (v > 0.45 ? 'auto' : 'none'));

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
    <section className="w-full bg-[#F7F8FA]">
      {/* 1. Airform One Scroll-Choreographed 3D Hero Stage */}
      <div
        ref={stageContainerRef}
        className="relative h-[170vh] sm:h-[205vh] lg:h-[225vh] bg-[#F7F8FA]"
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[540px] max-h-[860px] w-full overflow-hidden flex items-center justify-center">
          {/* Layer 1 (Back): Giant Airform-Style Silver-Mist Wordmark behind the 3D Hardware */}
          <motion.div
            style={{ opacity: wordmarkOpacity, scale: wordmarkScale }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-4"
            aria-hidden="true"
          >
            <span className="font-display font-semibold tracking-[-0.055em] leading-none text-[21vw] sm:text-[18vw] lg:text-[16.5vw] tc-airform-wordmark select-none">
              TechCare
            </span>
          </motion.div>

          {/* Layer 2 (Middle): Real-Time Three.js PBR 3D Laptop Canvas */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <Laptop3DCanvas mode="hero" scrollTargetRef={stageContainerRef} />
          </div>

          {/* Layer 3A (Opening Top/Bottom Minimal Cues — fades smoothly on scroll) */}
          <motion.div
            style={{ opacity: introCueOpacity }}
            className="absolute inset-x-0 top-5 sm:top-9 z-30 flex justify-center px-4 pointer-events-none"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#E2E7EE] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-[#4F627A] shadow-[0_2px_10px_rgba(29,33,41,0.04)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D2129]" />
              <span>Certified IT Hardware &lt; Rp 10 Juta</span>
            </span>
          </motion.div>

          <motion.div
            style={{ opacity: introCueOpacity }}
            className="absolute inset-x-0 bottom-20 md:bottom-9 z-30 flex flex-col items-center gap-2.5 px-4"
          >
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={onShopClick} className="tc-btn-primary">
                <span>Jelajahi Katalog</span>
                <ArrowUpRight size={15} />
              </button>
              <button type="button" onClick={onTrackClick} className="tc-btn-secondary">
                <span>Lacak Pesanan</span>
              </button>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#647082]">
              <span>Scroll untuk membuka unit 3D</span>
              <ChevronDown size={13} className="animate-bounce" />
            </span>
          </motion.div>

          {/* Layer 3B (Airform Mid-Scroll Editorial Reveal beside opened 3D Laptop) */}
          <motion.div
            style={{ opacity: revealOpacity, y: revealY, pointerEvents: revealPointer }}
            className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-24 md:pb-12 lg:items-center lg:pb-0"
          >
            <div className="w-full lg:w-[46%] bg-[#F7F8FA]/85 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-5 sm:p-6 lg:p-0 rounded-3xl lg:rounded-none border border-[#E2E7EE] lg:border-0 space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-medium tracking-[-0.045em] leading-[1.02] text-[#1D2129]">
                  TechCare{' '}
                  <span className="font-light text-[#8F9FB3]">Studio</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#4F627A] leading-relaxed max-w-md">
                  Laptop bisnis ThinkPad, MacBook Air M1, ASUS OLED, monitor &amp; upgrade RAM/SSD — seluruh unit lulus 32 titik QC teknisi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button type="button" onClick={onShopClick} className="tc-btn-primary">
                  <span>Lihat Katalog</span>
                  <ArrowUpRight size={15} />
                </button>
                <button type="button" onClick={onTrackClick} className="tc-btn-secondary">
                  <span>Lacak Pesanan</span>
                </button>
              </div>

              {/* Honest Factual Spec Row (Zero Fabricated Numbers) */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E7EE] max-w-sm">
                <div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-[#1D2129] tabular-nums">
                    13 Unit
                  </p>
                  <p className="text-[11px] text-[#647082]">Ready Stock</p>
                </div>
                <div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-[#1D2129] tabular-nums">
                    32 Titik
                  </p>
                  <p className="text-[11px] text-[#647082]">Inspeksi QC</p>
                </div>
                <div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-[#1D2129] tabular-nums">
                    30–90 Hr
                  </p>
                  <p className="text-[11px] text-[#647082]">Garansi Toko</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. Subtle Studio Brand Marquee */}
      <div className="bg-white border-y border-[#E2E7EE] py-3.5 overflow-hidden tc-marquee-wrap">
        <div className="tc-marquee-track font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#647082]">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={`${brand}-${i}`} className="inline-flex items-center whitespace-nowrap">
              <span className="px-6 sm:px-8">{brand}</span>
              <span className="w-1 h-1 rounded-full bg-[#BAC4D2] inline-block" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {/* 3. Minimal Studio Pill Search & Quick Categories */}
      <div className="bg-[#F7F8FA] border-b border-[#E2E7EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96 flex-shrink-0">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8692A3]" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Cari ThinkPad, ASUS, MSI, Logitech, RAM..."
              className="tc-input pl-10 pr-20"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[34px] px-4 rounded-full bg-[#1D2129] hover:bg-[#323846] text-white text-xs font-medium transition-colors"
            >
              Cari
            </button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 lg:pb-0 no-scrollbar">
            {quickCategories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => onSelectCollection(cat.slug)}
                className="min-h-[40px] px-4 rounded-full bg-white border border-[#E2E7EE] hover:border-[#1D2129] text-xs font-medium text-[#4F627A] hover:text-[#1D2129] whitespace-nowrap transition-colors"
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
