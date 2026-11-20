import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Wrench,
  Truck,
  Star,
  Search,
  Laptop,
  Cpu,
  HardDrive,
  Monitor,
  Mouse,
  LayoutGrid,
  CheckCircle2,
  Zap
} from 'lucide-react';
import Reveal from './Reveal';

export default function HeroSection({
  onShopClick,
  onTrackClick,
  onQuickSearch,
  onSelectCollection
}) {
  const [heroSearch, setHeroSearch] = useState('');

  const quickCategories = [
    { label: 'Laptop Second', slug: 'laptop-second', icon: Laptop },
    { label: 'RAM & Memori', slug: 'ram-memori', icon: Cpu },
    { label: 'SSD NVMe', slug: 'ssd-storage', icon: HardDrive },
    { label: 'Monitor', slug: 'display-monitor', icon: Monitor },
    { label: 'Peripherals', slug: 'peripherals', icon: Mouse },
    { label: 'Semua Produk', slug: '', icon: LayoutGrid }
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
    <section className="w-full bg-[#F4F6FA] pt-4 sm:pt-6 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Bold Tech-Retail Hero Card (Midnight Navy + Cobalt Spotlight) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1220] via-[#0F1B33] to-[#0D2149] text-white border border-slate-800 shadow-tc-float">
          {/* Subtle Architectural Tech Grid & Cobalt Glow */}
          <div className="absolute inset-0 tc-tech-grid opacity-80 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0B5FFF]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-[#38BDF8]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 p-5 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <Reveal delay={0.04}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B5FFF]/20 border border-[#38BDF8]/30 text-sky-200 text-[11px] font-semibold">
                  <Zap size={13} className="text-[#F97316] shrink-0" />
                  <span>Retail IT UMKM • Certified Pre-Owned &lt; Rp 10 Juta</span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.07] text-white">
                  Hardware IT Berkualitas,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]">
                    Teruji 32 Titik QC.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Laptop bisnis Lenovo ThinkPad, ASUS OLED, monitor MSI &amp; LG, peripheral Logitech &amp; Fantech, hingga upgrade RAM/SSD — siap pakai, bergaransi toko, dan bisa pasang langsung di workshop.
                </p>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <button
                    onClick={onShopClick}
                    className="tc-btn-primary text-xs sm:text-sm px-6 py-3.5 rounded-xl"
                  >
                    <span>Belanja Sekarang</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={onTrackClick}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all"
                  >
                    <Truck size={15} className="text-[#38BDF8]" />
                    <span>Lacak Pesanan</span>
                  </button>
                </div>
              </Reveal>

              {/* Micro Trust Metrics */}
              <Reveal delay={0.26}>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 max-w-lg">
                  <div>
                    <p className="font-display text-lg sm:text-2xl font-bold text-white tabular-nums">1.200+</p>
                    <p className="text-[10px] sm:text-xs text-slate-400">Unit Terjual &amp; QC</p>
                  </div>
                  <div>
                    <p className="font-display text-lg sm:text-2xl font-bold text-[#38BDF8] tabular-nums flex items-center gap-1">
                      4.9 <Star size={14} className="fill-amber-400 text-amber-400" />
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400">Rating Pelanggan</p>
                  </div>
                  <div>
                    <p className="font-display text-lg sm:text-2xl font-bold text-emerald-400 tabular-nums">30–90 Hr</p>
                    <p className="text-[10px] sm:text-xs text-slate-400">Garansi Toko Resmi</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Featured Hardware Showcase Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider">
                    Unggulan Minggu Ini
                  </span>
                  <span className="text-[11px] font-semibold text-sky-200 inline-flex items-center gap-1">
                    <ShieldCheck size={13} /> Grade A+ • 97% Mulus
                  </span>
                </div>

                {/* Clean Product Preview Stage */}
                <div
                  onClick={onShopClick}
                  className="bg-gradient-to-b from-white to-[#EEF2F7] rounded-xl p-5 flex items-center justify-center aspect-[16/10] cursor-pointer group overflow-hidden"
                >
                  <img
                    src="/images/products/thinkpad-x1-carbon-front.jpg"
                    alt="Lenovo ThinkPad X1 Carbon Gen 9 TECHCARE"
                    className="max-h-full max-w-[88%] object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider">
                      Lenovo ThinkPad
                    </p>
                    <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                      X1 Carbon Gen 9 • Custom RAM/SSD
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 line-through block tabular-nums">
                      Rp 9.500.000
                    </span>
                    <span className="font-display text-base sm:text-lg font-bold text-[#38BDF8] tabular-nums">
                      Rp 7.850.000
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-200">
                  <span className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    <span className="truncate">RAM 8–32GB / SSD 1TB</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                    <Wrench size={12} className="text-[#38BDF8] shrink-0" />
                    <span className="truncate">Free Pasang &amp; OS</span>
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Search Bar + Quick Category Pills (Mobile-First) */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-tc-card flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-96 flex-shrink-0">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Cari laptop ASUS, ThinkPad, MSI, Logitech, RAM..."
              className="w-full min-h-[44px] pl-11 pr-24 py-2.5 bg-[#F4F6FA] border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-[#0B5FFF] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[34px] px-4 rounded-lg bg-[#0B5FFF] hover:bg-[#0847C4] text-white text-xs font-semibold transition-colors"
            >
              Cari
            </button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 lg:pb-0 flex-1 no-scrollbar">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => onSelectCollection(cat.slug)}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl bg-[#F4F6FA] border border-slate-200 hover:border-[#0B5FFF] hover:bg-[#EEF4FF] hover:text-[#0B5FFF] text-slate-700 text-xs font-semibold whitespace-nowrap transition-all"
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
