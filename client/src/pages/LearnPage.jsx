import React from 'react';
import Reveal from '../components/Reveal';
import { Cpu, HardDrive, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

export default function LearnPage({ onExploreShop }) {
  const topics = [
    {
      icon: ShieldCheck,
      title: 'Standar 32 Titik QC Laptop TECHCARE',
      desc: 'Sebelum unit masuk katalog, teknisi kami memeriksa layar (dead pixel & whitespot), battery health/cycle count, seluruh port USB-C/HDMI, keyboard, kamera, speaker, hingga stress-test suhu CPU selama 4 jam.'
    },
    {
      icon: Cpu,
      title: 'Pilih RAM 8GB, 16GB, atau 32GB? (DDR4 vs DDR5)',
      desc: 'Untuk tugas kuliah & office ringan, RAM 8GB cukup. Untuk coding, Figma, dan puluhan tab browser, upgrade ke 16GB dual-channel memberi lonjakan responsivitas paling terasa. Semua RAM kami lolos MemTest86 0-error.'
    },
    {
      icon: HardDrive,
      title: 'Cek Kesehatan SSD NVMe (256GB / 512GB / 1TB)',
      desc: 'Berbeda dari HDD lama, SSD NVMe Gen4 mempercepat booting hingga di bawah 10 detik. Kami hanya menjual SSD dengan Health terverifikasi minimal 97% via CrystalDiskInfo dan bebas bad sector.'
    },
    {
      icon: Wrench,
      title: 'Kenapa Repasta & Cleaning Rutin Itu Penting?',
      desc: 'Debu kipas dan thermal paste kering bikin laptop cepat panas (thermal throttling) dan lemot. Setiap laptop di TECHCARE sudah dibersihkan total dan diganti thermal paste baru sebelum dikirim ke pembeli.'
    }
  ];

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-6 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <div className="bg-gradient-to-r from-[#0B1220] to-[#112447] text-white rounded-3xl p-6 sm:p-10 text-center space-y-3 border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 tc-tech-grid opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#0B5FFF]/25 border border-[#38BDF8]/30 text-[11px] uppercase tracking-wider font-bold text-sky-200">
                TECHCARE QC LAB &amp; EDUKASI
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Panduan Cerdas Beli Hardware &amp; Upgrade Spec
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Pahami standar pengecekan 32 titik teknisi kami dan cara memilih kombinasi RAM serta SSD yang paling pas untuk kebutuhan Anda.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-[#0B5FFF] shadow-tc-card space-y-3 h-full transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0B1220]">{t.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="text-center pt-2">
            <button onClick={onExploreShop} className="tc-btn-primary px-8 py-3.5">
              <span>Jelajahi Katalog Hardware</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
