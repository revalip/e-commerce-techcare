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
    <section className="bg-[#FAF9F6] border-t border-[#D6D4CC] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 04 // Numbered Architectural Spec Grid (Shared Hairline Borders) */}
        <div className="space-y-8">
          <Reveal>
            <div className="pb-5 border-b border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#6E6D68] block mb-2">
                  [ 04 // STANDAR OPERASIONAL ]
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-[-0.04em] text-[#111111] leading-[0.96]">
                  STANDAR TEKNISI
                </h2>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6E6D68]">
                TERVERIFIKASI DI WORKSHOP JAKARTA BARAT
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#D6D4CC]">
            {pillars.map((item, idx) => (
              <Reveal key={item.code} delay={idx * 0.03}>
                <div className="p-5 sm:p-6 border-r border-b border-[#D6D4CC] bg-[#FAF9F6] hover:bg-[#F2F1EC] transition-colors h-full flex flex-col justify-between gap-4">
                  <span className="font-mono text-xs font-bold text-[#E63B19] tabular-nums">
                    /{item.code}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-base sm:text-lg font-bold uppercase tracking-[-0.02em] text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#6E6D68] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Solid Matte Carbon Workshop CTA Band (Zero Gradients/Glow) */}
        <Reveal>
          <div className="relative bg-[#111111] text-[#F2F1EC] border border-[#2A2A27] p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <span aria-hidden="true" className="absolute top-2.5 left-3 font-mono text-xs text-[#6E6D68] select-none">+</span>
            <span aria-hidden="true" className="absolute top-2.5 right-3 font-mono text-xs text-[#6E6D68] select-none">+</span>

            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#E63B19] font-semibold block">
                WORKSHOP &amp; KONSULTASI TEKNISI
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-[-0.03em] text-[#F2F1EC] leading-[1.02]">
                BUTUH UPGRADE RAM/SSD, REPASTA, ATAU SERVICE LAPTOP?
              </h3>
              <p className="text-xs sm:text-sm text-[#A8A69E] leading-relaxed">
                Selain menjual perangkat IT second bergaransi di bawah Rp 10 juta, teknisi TECHCARE melayani upgrade hardware, cloning OS tanpa hilang data, hingga pembersihan thermal secara transparan.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-[#D6D4CC]">
                <span className="px-2.5 py-1 border border-[#2A2A27] bg-[#1C1C1A]">
                  GRATIS CEK KERUSAKAN
                </span>
                <span className="px-2.5 py-1 border border-[#2A2A27] bg-[#1C1C1A]">
                  GRATIS PASANG RAM/SSD
                </span>
                <span className="px-2.5 py-1 border border-[#2A2A27] bg-[#1C1C1A]">
                  BISA DITUNGGU DI WORKSHOP
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
                  className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-[2px] font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#F2F1EC] border border-[#3A3A36] hover:border-[#F2F1EC] transition-colors"
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
