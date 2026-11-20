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
      title: '32 TITIK QC',
      desc: 'Cek layar, baterai, port, suhu, dan stress-test sebelum unit dijual.'
    },
    {
      icon: Cpu,
      title: 'CUSTOM RAM/SSD',
      desc: 'Bebas pilih upgrade RAM 8–32GB & SSD 256GB–1TB sesuai kebutuhan.'
    },
    {
      icon: Wrench,
      title: 'JASA SERVICE IT',
      desc: 'Pembersihan debu, repasta thermal, dan instalasi OS oleh teknisi.'
    },
    {
      icon: HardDrive,
      title: 'TESTED MEMTEST',
      desc: 'RAM & SSD second teruji MemTest86 0-error dan Health 97%+.'
    },
    {
      icon: Truck,
      title: 'TRACKING JELAS',
      desc: 'Pantau tahap QC, resi ekspedisi, sampai paket tiba di tangan Anda.'
    },
    {
      icon: Headphones,
      title: 'GARANSI TOKO',
      desc: 'Garansi tukar unit & servis toko 30–90 hari tanpa proses berbelit.'
    }
  ];

  return (
    <section className="bg-white border-t border-neutral-200/80 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 6-Card Minimalist Tech/Service Grid (matching AERO STEP reference) */}
        <div className="space-y-8">
          <Reveal>
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-neutral-400 block mb-1">
                STANDAR TEKNISI TECHCARE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-tight">
                Kenapa Beli Second & Jasa IT di TECHCARE?
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={idx} delay={idx * 0.05}>
                  <div className="bg-[#f9f9f8] hover:bg-neutral-100/80 border border-neutral-200/70 rounded-2xl p-4 sm:p-5 text-center space-y-2.5 h-full transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-900 mx-auto">
                      <Icon size={18} strokeWidth={1.7} />
                    </div>
                    <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-neutral-900">
                      {item.title}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-neutral-500">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* IT Care & Trade-In Membership Banner (inspired by AERO STEP CLUB banner) */}
        <Reveal>
          <div className="bg-[#f4f4f2] rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-neutral-200/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Minimalist Service Pass Card */}
              <div className="w-full sm:w-44 h-28 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white p-4 flex flex-col justify-between shadow-lg flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                    TECHCARE PASS
                  </span>
                  <Wrench size={14} className="text-neutral-300" />
                </div>
                <div>
                  <p className="font-serif text-base tracking-wider">IT CARE</p>
                  <p className="text-[9px] text-neutral-300 uppercase tracking-widest">
                    Service • Upgrade • QC
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl text-neutral-900">
                  Butuh Jasa Service, Upgrade RAM/SSD, atau Konsultasi IT?
                </h3>
                <p className="text-xs text-neutral-600 max-w-xl leading-relaxed">
                  Selain menjual unit second bergaransi di bawah Rp 10 juta, teknisi TECHCARE melayani pembersihan & repasta laptop, instalasi Windows/Linux, cloning SSD, hingga tukar tambah perangkat kerja.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] font-semibold text-neutral-700">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-black" />
                    Gratis Cek Kerusakan
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-black" />
                    Pengerjaan Transparan
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-black" />
                    Bisa Tunggu di Workshop
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
              <button
                onClick={onNavigateAbout}
                className="flex-1 lg:flex-initial bg-neutral-900 hover:bg-black text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all"
              >
                <span>Info Jasa IT</span>
                <ArrowRight size={14} />
              </button>
              {onNavigateShop && (
                <button
                  onClick={onNavigateShop}
                  className="flex-1 lg:flex-initial bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 px-5 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cek Katalog
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
