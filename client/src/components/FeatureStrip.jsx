import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

export default function FeatureStrip({ onNavigateAbout, onNavigateShop }) {
  const pillars = [
    {
      code: '01',
      title: 'Lulus 32 Titik QC',
      desc: 'Cek layar bebas dead pixel, kesehatan baterai, port I/O, suhu, dan stress-test sebelum masuk stok.'
    },
    {
      code: '02',
      title: 'Custom RAM & SSD',
      desc: 'Bebas konfigurasi upgrade RAM 8–32GB & SSD 256GB–1TB sesuai kebutuhan kerja.'
    },
    {
      code: '03',
      title: 'Jasa Service IT',
      desc: 'Pembersihan kipas, repasta thermal baru, dan instalasi OS langsung oleh teknisi.'
    },
    {
      code: '04',
      title: 'Tested MemTest86',
      desc: 'Komponen RAM & SSD diuji 0-error serta Health 97%+ melalui CrystalDiskInfo.'
    },
    {
      code: '05',
      title: 'Ongkir & Resi Lokal',
      desc: 'Mendukung JNE, J&T, SiCepat, dan ambil di workshop dengan estimasi ongkir transparan.'
    },
    {
      code: '06',
      title: 'Garansi Toko 30–90 Hr',
      desc: 'Garansi tukar unit & servis langsung di workshop tanpa alur klaim yang berbelit.'
    }
  ];

  return (
    <section className="bg-[#F7F8FA] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-18">
        {/* Clean Numbered Studio Grid */}
        <div className="space-y-10">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#647082] block">
                  04 / Standar Operasional
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.02]">
                  Standar teknisi.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#647082]">
                Terverifikasi langsung di workshop Jakarta Barat.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((item, idx) => (
              <Reveal key={item.code} delay={idx * 0.03}>
                <div className="p-6 rounded-[24px] bg-white border border-[#E2E7EE] h-full flex flex-col justify-between gap-5">
                  <span className="font-mono text-xs text-[#8692A3] tabular-nums">
                    {item.code}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-medium tracking-[-0.025em] text-[#1D2129]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#647082] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Minimal Matte Charcoal Workshop CTA Card (Zero Gradients / Zero Glow) */}
        <Reveal>
          <div className="bg-[#1D2129] text-white rounded-[28px] p-7 sm:p-11 lg:p-14 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9BB0C9] block">
                Workshop &amp; Konsultasi Teknisi
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-medium tracking-[-0.04em] text-white leading-[1.06]">
                Butuh upgrade RAM/SSD, repasta, atau service laptop?
              </h3>
              <p className="text-xs sm:text-sm text-[#A5B1C2] leading-relaxed">
                Selain menyediakan perangkat IT second bergaransi di bawah Rp 10 juta, teknisi TechCare melayani upgrade hardware, cloning OS tanpa hilang data, hingga pembersihan thermal secara transparan.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#CBD3DF]">
                <span className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12">
                  Gratis Cek Kerusakan
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12">
                  Gratis Pasang RAM/SSD
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white/8 border border-white/12">
                  Bisa Ditunggu di Workshop
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={onNavigateAbout}
                className="tc-btn-bone"
              >
                <span>Info Jasa IT</span>
                <ArrowUpRight size={15} />
              </button>
              {onNavigateShop && (
                <button
                  type="button"
                  onClick={onNavigateShop}
                  className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white border border-white/25 hover:bg-white/10 transition-colors"
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
