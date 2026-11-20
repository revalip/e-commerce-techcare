import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const Laptop3DCanvas = lazy(() => import('./Laptop3DCanvas'));

const FEATURES = [
  {
    id: 'display',
    preset: 'display',
    label: 'Layar bebas dead pixel',
    summary:
      'Setiap layar diuji keseragaman warna, kecerahan, dan engsel sebelum masuk katalog.'
  },
  {
    id: 'ram',
    preset: 'ram',
    label: 'RAM & SSD sesuai kebutuhan',
    summary:
      'Pilih kapasitas RAM dan SSD langsung di halaman produk. Semua modul lulus MemTest86 tanpa error.'
  },
  {
    id: 'thermal',
    preset: 'thermal',
    label: 'Thermal baru, kipas bersih',
    summary:
      'Heatsink dibersihkan dan thermal paste diganti baru supaya suhu tetap adem dan kipas senyap.'
  },
  {
    id: 'ports',
    preset: 'ports',
    label: 'Semua port berfungsi',
    summary:
      'USB-C, Thunderbolt, HDMI, dan audio jack dicek satu per satu pada kondisi fisik mulus.'
  }
];

export default function CloserLook3DSection() {
  const [activeId, setActiveId] = useState('display');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Mount the 2nd WebGL context only when this section is near the viewport (saves GPU/battery on phones)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = FEATURES.find((f) => f.id === activeId) || FEATURES[0];

  return (
    <section ref={sectionRef} className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.05] text-center">
            Lihat lebih dekat.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative bg-[#F7F8FA] rounded-[28px] overflow-hidden h-[320px] sm:h-[440px] lg:h-[500px]">
              {inView && (
                <Suspense fallback={null}>
                  <Laptop3DCanvas mode="explorer" activePreset={active.preset} />
                </Suspense>
              )}
            </div>
            <p className="mt-3 text-center text-[11px] text-[#8692A3]">
              Geser untuk memutar
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
