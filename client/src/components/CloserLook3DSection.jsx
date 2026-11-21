import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const QC_STEPS = [
  {
    id: 'display',
    index: '01',
    label: 'Layar bebas dead pixel',
    badge: 'Panel IPS Anti-Glare',
    summary:
      'Setiap layar dicek warna, kecerahan, dan kekokohan engsel di ruang uji sebelum masuk katalog.',
    image: '/images/products/thinkpad-x1-carbon-front.jpg'
  },
  {
    id: 'ram',
    index: '02',
    label: 'RAM & SSD lulus uji bebas error',
    badge: 'Tested MemTest86',
    summary:
      'Modul RAM dan SSD NVMe melewati pengujian beban penuh agar sistem stabil tanpa blue-screen.',
    image: '/images/products/corsair-vengeance-ram.jpg'
  },
  {
    id: 'thermal',
    index: '03',
    label: 'Kipas bersih, thermal paste baru',
    badge: 'Repaste & Cleaning',
    summary:
      'Heatsink dibersihkan dari debu dan thermal paste diganti baru supaya suhu kerja tetap adem.',
    image: '/images/products/thermal-cooling-internal.jpg'
  },
  {
    id: 'ports',
    index: '04',
    label: 'Semua port dan fisik mulus',
    badge: 'Fisik Grade A',
    summary:
      'Port USB-C, Thunderbolt, HDMI, audio jack, keyboard, dan baterai dicek satu per satu.',
    image: '/images/products/thinkpad-x1-carbon-side.jpg'
  }
];

/**
 * Apple-style Pinned Scroll Showcase:
 * Desktop (lg+): Studio product stage stays pinned (sticky) while scrolling advances
 * through 4 sequential QC callouts (scrollYProgress) — also directly clickable!
 * Mobile (< lg): Clean interactive accordion cards with studio photo above.
 */
export default function CloserLook3DSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pinnedRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: pinnedRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    if (shouldReduceMotion) return undefined;
    return scrollYProgress.on('change', (latest) => {
      if (window.innerWidth < 1024) return;
      const idx = Math.min(QC_STEPS.length - 1, Math.floor(latest * QC_STEPS.length));
      setActiveIndex(idx);
    });
  }, [scrollYProgress, shouldReduceMotion]);

  const active = QC_STEPS[activeIndex] || QC_STEPS[0];

  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6E6E73]">
            Inspeksi 32 Titik Teknisi
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-[#1D1D1F] leading-[1.06] mt-2">
            Dicek luar dalam sebelum dikirim.
          </h2>
        </div>

        {/* Desktop Pinned Scroll Stage (lg+) */}
        <div
          ref={pinnedRef}
          className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:min-h-[185vh] items-start"
        >
          {/* Left: Scrolling Sequential Callouts */}
          <div className="lg:col-span-5 space-y-6 py-8">
            {QC_STEPS.map((step, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-6 rounded-[24px] border transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-[#1D1D1F]/15 shadow-tc-studio opacity-100'
                      : 'bg-transparent border-transparent opacity-45 hover:opacity-80'
                  }`}
                >
                  <span className="font-mono text-xs text-[#0071E3] font-semibold">
                    {step.index}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-[#1D1D1F] mt-1">
                    {step.label}
                  </h3>
                  <p className="text-sm text-[#6E6E73] leading-relaxed mt-2">
                    {step.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Sticky Pinned Studio Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="relative bg-white rounded-[28px] overflow-hidden aspect-[16/11] shadow-tc-studio">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.id}
                  src={active.image}
                  alt={active.label}
                  initial={shouldReduceMotion ? false : { opacity: 0.25, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0.25 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              <div className="absolute bottom-5 left-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-xs font-medium text-[#1D1D1F] shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
                  <span>{active.badge}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Interactive View (< lg) */}
        <div className="lg:hidden space-y-6">
          <div className="relative bg-white rounded-[24px] overflow-hidden aspect-[4/3] shadow-tc-studio">
            <AnimatePresence mode="wait">
              <motion.img
                key={active.id}
                src={active.image}
                alt={active.label}
                initial={shouldReduceMotion ? false : { opacity: 0.3 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0.3 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-cover object-center"
              />
            </AnimatePresence>
            <div className="absolute bottom-3.5 left-3.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-[11px] font-medium text-[#1D1D1F] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
                <span>{active.badge}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {QC_STEPS.map((step, idx) => {
              const isOpen = idx === activeIndex;
              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border transition-colors ${
                    isOpen ? 'bg-white border-[#D2D2D7]' : 'bg-white/60 border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left min-h-[54px] px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span
                      className={`text-sm sm:text-base ${
                        isOpen ? 'font-semibold text-[#1D1D1F]' : 'font-medium text-[#6E6E73]'
                      }`}
                    >
                      {step.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0071E3]' : 'text-[#6E6E73]'
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
                          {step.summary}
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
