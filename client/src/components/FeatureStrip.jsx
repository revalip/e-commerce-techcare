import React from 'react';
import {
  ShieldCheck,
  Wrench,
  Cpu,
  HardDrive,
  Truck,
  Headphones,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Reveal from './Reveal';

export default function FeatureStrip({ onNavigateAbout, onNavigateShop }) {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Lulus 32 Titik QC',
      desc: 'Cek layar, baterai, port, suhu, dan stress-test sebelum masuk stok.'
    },
    {
      icon: Cpu,
      title: 'Custom RAM & SSD',
      desc: 'Bebas pilih upgrade RAM 8–32GB & SSD 256GB–1TB sesuai kebutuhan.'
    },
    {
      icon: Wrench,
      title: 'Jasa Service IT',
      desc: 'Pembersihan kipas, repasta thermal, dan instalasi OS oleh teknisi.'
    },
    {
      icon: HardDrive,
      title: 'Tested MemTest86',
      desc: 'Komponen RAM & SSD teruji 0-error dan Health 97%+ CrystalDiskInfo.'
    },
    {
      icon: Truck,
      title: 'Ongkir & Resi Jelas',
      desc: 'Dukung JNE, J&T, SiCepat dengan estimasi tarif lokal & tracking.'
    },
    {
      icon: Headphones,
      title: 'Garansi Toko Resmi',
      desc: 'Garansi tukar unit & servis toko 30–90 hari tanpa proses berbelit.'
    }
  ];

  return (
    <section className="bg-white border-t border-slate-200/80 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 6-Pillar Trust Grid */}
        <div className="space-y-7">
          <Reveal>
            <div className="text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#0B5FFF] block mb-1">
                KEUNGGULAN TOKO TECHCARE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220]">
                Standar Teknisi di Setiap Unit
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={idx} delay={idx * 0.04}>
                  <div className="bg-[#F4F6FA] hover:bg-[#EEF4FF]/70 border border-slate-200/80 hover:border-[#C7DCFF] rounded-2xl p-4 space-y-2.5 h-full transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0B5FFF] shadow-2xs">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <h4 className="font-display text-xs sm:text-sm font-bold text-[#0B1220]">
                      {item.title}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Workshop & IT Service Banner */}
        <Reveal>
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1220] via-[#111F3A] to-[#0E295A] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-tc-float flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="absolute inset-0 tc-tech-grid opacity-50 pointer-events-none" />
            <div className="relative z-10 space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B5FFF]/25 border border-[#38BDF8]/30 text-sky-200 text-[11px] font-bold">
                <Wrench size={12} /> WORKSHOP &amp; KONSULTASI TEKNISI
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                Butuh Upgrade RAM/SSD, Repasta, atau Service Laptop?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Selain menjual perangkat IT second bergaransi di bawah Rp 10 juta, teknisi TECHCARE melayani upgrade hardware, cloning OS tanpa hilang data, hingga pembersihan thermal secara transparan.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-sky-200">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Gratis Cek Kerusakan
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Gratis Pasang RAM/SSD
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Bisa Ditunggu di Workshop
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 w-full lg:w-auto shrink-0">
              <button onClick={onNavigateAbout} className="tc-btn-primary flex-1 lg:flex-initial">
                <span>Info Jasa IT</span>
                <ArrowRight size={15} />
              </button>
              {onNavigateShop && (
                <button
                  onClick={onNavigateShop}
                  className="flex-1 lg:flex-initial inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  Lihat Katalog
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
