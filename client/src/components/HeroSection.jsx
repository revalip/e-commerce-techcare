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
  LayoutGrid
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
    { label: 'SSD & Storage', slug: 'ssd-storage', icon: HardDrive },
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
    <section className="w-full bg-[#f9f9f8] pt-4 sm:pt-6 pb-6 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Main Editorial Hero Card (AERO STEP + adidas.co.id Clean Reference) */}
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-[#ededeb] border border-neutral-200/80 shadow-[0_8px_36px_rgba(0,0,0,0.04)] min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
          {/* Background Studio Image */}
          <div className="absolute inset-0">
            <img
              src="/images/hero-techcare.jpg"
              alt="TECHCARE Certified Second-Hand IT Hardware & Services"
              className="w-full h-full object-cover object-center sm:object-right"
            />
            {/* Soft Left Gradient for Guaranteed Typography Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f5f3]/95 via-[#f5f5f3]/80 to-[#f5f5f3]/15 sm:via-[#f5f5f3]/65 sm:to-transparent" />
          </div>

          {/* Content Grid */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Typography & CTAs */}
            <div className="lg:col-span-7 space-y-5 max-w-xl">
              <Reveal delay={0.05}>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-neutral-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200/80 shadow-2xs">
                  <ShieldCheck size={13} className="text-neutral-900" />
                  <span>Jasa IT & Barang Second Berkualitas • Semua &lt; Rp 10 Juta</span>
                </span>
              </Reveal>

              <Reveal delay={0.12}>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] text-neutral-950 font-medium tracking-tight leading-[1.08]">
                  PERFORMA IT SECOND, STANDAR TEKNISI.
                </h1>
              </Reveal>

              <Reveal delay={0.18}>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md">
                  Laptop second bisnis, RAM DDR4/DDR5, SSD NVMe, hingga peripheral pilihan — seluruhnya lulus <strong>32 titik QC</strong>, bebas pilih spec RAM & SSD, dan siap pasang oleh tim jasa IT TECHCARE.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onShopClick}
                    className="bg-neutral-900 text-white hover:bg-black transition-all text-xs font-bold tracking-[0.14em] uppercase px-6 sm:px-7 py-3.5 rounded-full inline-flex items-center gap-2 shadow-md"
                  >
                    <span>Lihat Katalog</span>
                    <ArrowRight size={15} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onTrackClick}
                    className="bg-white/90 hover:bg-white text-neutral-900 border border-neutral-300 hover:border-black transition-all text-xs font-bold tracking-[0.12em] uppercase px-6 py-3.5 rounded-full"
                  >
                    Lacak Pesanan
                  </motion.button>
                </div>
              </Reveal>
            </div>

            {/* Right Floating Frosted Trust Pills (matching AERO STEP reference) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col items-end justify-between gap-3 self-stretch">
              <div className="space-y-2.5 w-64">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Lulus 32 Titik QC',
                    sub: 'Cek layar, baterai & stress-test'
                  },
                  {
                    icon: Wrench,
                    title: 'Jasa Upgrade & Service',
                    sub: 'Gratis pasang RAM / SSD di workshop'
                  },
                  {
                    icon: Truck,
                    title: 'Tracking Real-Time',
                    sub: 'Packing aman & garansi toko 60 hari'
                  }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                      className="bg-white/85 backdrop-blur-md rounded-2xl p-3.5 border border-white shadow-sm flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 flex-shrink-0">
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 leading-tight">{item.title}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{item.sub}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Social Proof Pill */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.35 }}
                className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2.5 border border-white shadow-sm flex items-center gap-3 mt-auto"
              >
                <div className="flex -space-x-2">
                  {['BS', 'SR', 'AR'].map((init, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                    >
                      {init}
                    </span>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-neutral-900 leading-none">
                    1.200+ Unit Terjual & Terservis
                  </p>
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-1">
                    <span className="font-bold text-neutral-800">4.9</span>
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>Rating Pelanggan</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Search + Quick Category Pill Bar (Reference-inspired, Mobile-First Scrollable) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80 flex-shrink-0">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Cari ThinkPad, RAM DDR4, SSD 1TB..."
              className="w-full pl-10 pr-11 py-3 bg-white border border-neutral-200 rounded-full text-xs outline-none focus:border-black transition-all shadow-2xs"
            />
            <button
              type="submit"
              aria-label="Cari produk"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900 text-white hover:bg-black flex items-center justify-center transition-colors"
            >
              <Search size={13} />
            </button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 flex-1 no-scrollbar">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => onSelectCollection(cat.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-neutral-200 hover:border-black hover:bg-neutral-900 hover:text-white text-neutral-700 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs"
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
