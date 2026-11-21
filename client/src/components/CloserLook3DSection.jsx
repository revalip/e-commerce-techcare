import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const FEATURES = [
  {
    id: 'display',
    preset: 'display',
    label: 'Layar bebas dead pixel',
    summary:
      'Setiap layar diuji keseragaman warna, kecerahan, dan engsel sebelum masuk katalog.',
    image: '/images/products/thinkpad-x1-carbon-front.jpg',
    hotspot: { top: '34%', left: '50%' }
  },
  {
    id: 'ram',
    preset: 'ram',
    label: 'RAM & SSD sesuai kebutuhan',
    summary:
      'Pilih kapasitas RAM dan SSD langsung di halaman produk. Semua modul lulus MemTest86 tanpa error.',
    image: '/images/products/thinkpad-x1-carbon-front.jpg',
    hotspot: { top: '65%', left: '46%' }
  },
  {
    id: 'thermal',
    preset: 'thermal',
    label: 'Thermal baru, kipas bersih',
    summary:
      'Heatsink dibersihkan dan thermal paste diganti baru supaya suhu tetap adem dan kipas senyap.',
    image: '/images/products/thinkpad-x1-carbon-front.jpg',
    hotspot: { top: '57%', left: '52%' }
  },
  {
    id: 'ports',
    preset: 'ports',
    label: 'Semua port berfungsi',
    summary:
      'USB-C, Thunderbolt, HDMI, dan audio jack dicek satu per satu pada kondisi fisik mulus.',
    image: '/images/products/thinkpad-x1-carbon-side.jpg',
    hotspot: { top: '66%', left: '34%' }
  }
];

export default function CloserLook3DSection() {
  const [activeId, setActiveId] = useState('display');
  const active = FEATURES.find((f) => f.id === activeId) || FEATURES[0];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.05] text-center">
            Lihat lebih dekat.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Lightweight 60fps Studio QC Hotspot Stage (Zero 2nd WebGL Overhead!) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative bg-[#ECEFF4] rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center">
              <img
                src={active.image}
                alt={active.label}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Interactive Hotspot Pins on Hardware */}
              {FEATURES.map((feat) => {
                const isSelected = feat.id === activeId;
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => setActiveId(feat.id)}
                    aria-label={feat.label}
                    style={{ top: feat.hotspot.top, left: feat.hotspot.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#1D2129] text-white scale-110 ring-4 ring-white/80 shadow-lg'
                        : 'bg-white/90 text-[#1D2129] hover:scale-110 border border-[#D4DBE5] shadow-md'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-current" />
                  </button>
                );
              })}

              <div className="absolute bottom-3.5 inset-x-3.5 flex justify-center pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-white/92 backdrop-blur-xs border border-[#E2E7EE] text-[11px] font-medium text-[#1D2129] shadow-xs">
                  {active.label}
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-[#8692A3]">
              Klik titik pada unit untuk cek detail 32 titik QC
            </p>
          </div>

          <div className="lg:col-span-5 order-2 lg:order-1 divide-y divide-[#E2E7EE] border-y border-[#E2E7EE]">
            {FEATURES.map((feat) => {
              const isOpen = feat.id === activeId;
              return (
                <div key={feat.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(feat.id)}
                    className="w-full text-left min-h-[56px] py-4 flex items-center justify-between gap-3"
                  >
                    <span
                      className={`text-base sm:text-lg transition-colors ${
                        isOpen ? 'font-medium text-[#1D2129]' : 'text-[#8692A3] hover:text-[#4F627A]'
                      }`}
                    >
                      {feat.label}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm text-[#647082] leading-relaxed max-w-sm">
                          {feat.summary}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
