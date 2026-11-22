import React from 'react';
import Reveal from '../components/Reveal';
import { Cpu, HardDrive, ShieldCheck, Wrench } from 'lucide-react';

/**
 * Apple.com/id-grade "Standar QC & Panduan Upgrade" page:
 * Full-width #F5F5F7 editorial hero + borderless #F5F5F7 rounded-[28px] QC tiles + clean CTA.
 */
export default function LearnPage({ onExploreShop }) {
  const topics = [
    {
      step: '01',
      icon: ShieldCheck,
      title: '32 Titik QC Sebelum Dijual',
      desc: 'Teknisi memeriksa layar (dead pixel & whitespot), battery health/cycle count, seluruh port USB-C/HDMI, keyboard, kamera, speaker, hingga stress-test suhu CPU selama 4 jam.'
    },
    {
      step: '02',
      icon: Cpu,
      title: 'Memilih RAM 8GB, 16GB, atau 32GB',
      desc: 'Untuk kuliah dan kerja harian, RAM 8GB cukup. Untuk coding, Figma, dan puluhan tab, upgrade ke 16GB dual-channel terasa jauh lebih gesit. Semua RAM lolos MemTest86 0-error.'
    },
    {
      step: '03',
      icon: HardDrive,
      title: 'Kesehatan SSD NVMe Minimal 97%',
      desc: 'SSD NVMe Gen4 mempercepat booting hingga di bawah 10 detik. Kami hanya menyediakan SSD dengan Health terverifikasi minimal 97% via CrystalDiskInfo dan bebas bad sector.'
    },
    {
      step: '04',
      icon: Wrench,
      title: 'Cleaning & Repasta Thermal Baru',
      desc: 'Debu kipas dan thermal paste kering membuat laptop cepat panas dan melambat. Setiap laptop di TechCare sudah dibersihkan menyeluruh dan diganti thermal paste baru sebelum dikirim.'
    }
  ];

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      {/* Full-Width Clean Editorial Hero (#F5F5F7) */}
      <section className="w-full bg-[#F5F5F7] py-16 sm:py-24 lg:py-28">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <h1 className="tc-hero-title text-[#1D1D1F]">
              Standar 32 titik QC.
            </h1>
            <p className="mt-4 text-[17px] sm:text-[21px] leading-[1.45] text-[#6E6E73] max-w-2xl mx-auto">
              Setiap unit bekas diperiksa satu per satu oleh teknisi sebelum masuk katalog—agar datang ke tangan Anda dengan rasa seperti baru.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Borderless #F5F5F7 Editorial Grid */}
      <section className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {topics.map((t, idx) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.step} delay={idx * 0.05}>
                  <div className="bg-[#F5F5F7] rounded-[28px] p-7 sm:p-9 h-full space-y-3.5">
                    <div className="flex items-center justify-between">
                      <Icon size={28} strokeWidth={1.5} className="text-[#1D1D1F]" />
                      <span className="text-[13px] font-medium text-[#6E6E73] tabular-nums">
                        {t.step}
                      </span>
                    </div>
                    <h2 className="text-[20px] sm:text-[23px] font-semibold tracking-[-0.02em] text-[#1D1D1F] leading-snug">
                      {t.title}
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-[#6E6E73] leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onExploreShop}
                className="h-[42px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] sm:text-[17px] font-normal transition-colors cursor-pointer"
              >
                Jelajahi Katalog Hardware
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
