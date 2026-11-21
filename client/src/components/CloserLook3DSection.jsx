import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const FEATURES = [
  {
    id: 'display',
    label: 'Layar bebas dead pixel',
    badge: 'Panel IPS Anti-Glare',
    summary:
      'Setiap layar diuji keseragaman warna, kecerahan, dan engsel kokoh sebelum masuk katalog.',
    image: '/images/products/thinkpad-x1-carbon-front.jpg'
  },
  {
    id: 'ram',
    label: 'RAM & SSD sesuai kebutuhan',
    badge: 'Tested MemTest86',
    summary:
      'Pilih kapasitas RAM dan SSD langsung di halaman produk. Semua modul lulus uji bebas error.',
    image: '/images/products/corsair-vengeance-ram.jpg'
  },
  {
    id: 'thermal',
    label: 'Thermal baru, kipas bersih',
    badge: 'Repaste & Cleaning',
    summary:
      'Heatsink dibersihkan total dan thermal paste diganti baru supaya suhu tetap adem dan senyap.',
    image: '/images/products/thinkpad-x1-carbon-front.jpg'
  },
  {
    id: 'ports',
    label: 'Semua port berfungsi',
    badge: 'Port & Fisik Grade A',
    summary:
      'USB-C, Thunderbolt, HDMI, dan audio jack dicek satu per satu pada kondisi fisik mulus.',
    image: '/images/products/thinkpad-x1-carbon-side.jpg'
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
          {/* Clean Apple-Style Studio Photo Stage (No Ugly Overlapping Dots!) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative bg-[#ECEFF4] rounded-[28px] overflow-hidden aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt={active.label}
                  initial={{ opacity: 0.35, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.35 }}
                  transition={{ duration: 0.28 }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              <div className="absolute bottom-4 left-4 pointer-events-none">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E2E7EE] text-[11px] font-medium text-[#1D2129] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{active.badge}</span>
                </span>
              </div>
            </div>
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
