import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

function CountUpNumber({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      if (inView) setValue(target);
      return undefined;
    }
    let start = 0;
    const duration = 900;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setValue(start);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, shouldReduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

const METRICS = [
  {
    target: 32,
    suffix: '',
    label: 'Titik pengecekan teknisi',
    desc: 'Layar, baterai, suhu prosesor, keyboard, hingga seluruh port dicek sebelum unit dijual.'
  },
  {
    target: 90,
    suffix: ' hari',
    label: 'Garansi toko langsung',
    desc: 'Tukar unit atau servis cepat langsung di workshop tanpa antre RMA panjang.'
  },
  {
    target: 0,
    suffix: ' rupiah',
    label: 'Biaya jasa pasang upgrade',
    desc: 'Beli RAM atau SSD NVMe bersama laptop, pemasangan dan cloning sistem gratis.'
  }
];

export default function FeatureStrip({ onNavigateAbout, onNavigateShop }) {
  return (
    <section className="bg-white py-20 sm:py-28 border-t border-[#F5F5F7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6E6E73]">
              Standar Workshop TechCare
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-[#1D1D1F] leading-[1.06]">
              Angka nyata. Bukan janji.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center">
          {METRICS.map((m, idx) => (
            <Reveal key={m.label} delay={idx * 0.05}>
              <p className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.04em] text-[#1D1D1F]">
                <CountUpNumber target={m.target} suffix={m.suffix} />
              </p>
              <h3 className="mt-2 text-base font-semibold text-[#1D1D1F]">{m.label}</h3>
              <p className="mt-1.5 text-sm text-[#6E6E73] leading-relaxed max-w-[17rem] mx-auto">
                {m.desc}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 sm:mt-16 flex flex-wrap items-center justify-center gap-5">
            <button type="button" onClick={onNavigateShop} className="tc-btn-primary">
              Lihat katalog
            </button>
            <button
              type="button"
              onClick={onNavigateAbout}
              className="inline-flex items-center gap-0.5 min-h-[44px] text-sm font-medium text-[#0071E3] hover:underline"
            >
              <span>Konsultasi jasa &amp; upgrade</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
