import React from 'react';
import { ShieldCheck, CheckCircle2, Truck, CreditCard, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: 'Garansi toko 30–90 hari',
    desc: 'Tukar unit atau servis langsung di workshop Depok.'
  },
  {
    icon: CheckCircle2,
    title: '32 titik pengecekan QC',
    desc: 'Layar, baterai, suhu, RAM, dan SSD diuji teknisi sebelum dijual.'
  },
  {
    icon: Truck,
    title: 'Kirim aman & ambil di toko',
    desc: 'Tersedia JNE, J&T, SiCepat dengan packing aman atau pickup.'
  },
  {
    icon: CreditCard,
    title: 'QRIS & transfer bank',
    desc: 'Pembayaran fleksibel lewat QRIS, BCA, atau Mandiri.'
  }
];

/**
 * Minimalist TechCare Advantages:
 * Thin line icons + short honest copy, NO boxes/borders/cards, generous Apple whitespace.
 */
export default function FeatureStrip({ onNavigateAbout, onNavigateShop }) {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-28 border-t border-[#D2D2D7]/60">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="tc-section-title text-[#1D1D1F]">
              Kenapa belanja di TechCare.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {ASSURANCES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={idx * 0.05}>
                <div className="space-y-3">
                  <Icon size={28} strokeWidth={1.4} className="text-[#1D1D1F]" />
                  <h3 className="text-[17px] font-semibold text-[#1D1D1F] tracking-[-0.015em]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center gap-6">
            <button type="button" onClick={onNavigateShop} className="tc-btn-primary">
              Jelajahi Katalog
            </button>
            <button
              type="button"
              onClick={onNavigateAbout}
              className="inline-flex items-center gap-0.5 min-h-[44px] text-[16px] text-[#0071E3] hover:underline"
            >
              <span>Konsultasi jasa &amp; upgrade</span>
              <ChevronRight size={17} strokeWidth={1.8} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
