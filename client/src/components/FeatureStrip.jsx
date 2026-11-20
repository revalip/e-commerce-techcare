import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

const POINTS = [
  { title: '32 titik QC', desc: 'Setiap unit diperiksa teknisi sebelum dijual.' },
  { title: 'Garansi 30–90 hari', desc: 'Tukar unit atau servis langsung di workshop.' },
  { title: 'Upgrade gratis pasang', desc: 'RAM dan SSD dipasang teknisi tanpa biaya jasa.' }
];

export default function FeatureStrip({ onNavigateAbout, onNavigateShop }) {
  return (
    <section className="bg-[#F7F8FA] py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.05] text-center">
            Standar teknisi.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center">
          {POINTS.map((p, idx) => (
            <Reveal key={p.title} delay={idx * 0.05}>
              <h3 className="font-display text-xl sm:text-2xl font-medium tracking-[-0.03em] text-[#1D2129]">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-[#647082] leading-relaxed max-w-[16rem] mx-auto">
                {p.desc}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 sm:mt-20 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={onNavigateAbout} className="tc-btn-primary">
              <span>Jasa service & upgrade</span>
              <ArrowUpRight size={15} />
            </button>
            {onNavigateShop && (
              <button type="button" onClick={onNavigateShop} className="tc-btn-secondary">
                Lihat katalog
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
