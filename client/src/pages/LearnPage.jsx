import React from 'react';
import Reveal from '../components/Reveal';
import { Cpu, HardDrive, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';

export default function LearnPage({ onExploreShop }) {
  const topics = [
    {
      icon: ShieldCheck,
      title: 'Standar 32 Titik QC Laptop Second TECHCARE',
      desc: 'Sebelum unit second masuk katalog, teknisi kami memeriksa layar (dead pixel & whitespot), battery health/cycle count, seluruh port USB-C/HDMI, keyboard, kamera, speaker, hingga stress-test suhu CPU selama 4 jam.'
    },
    {
      icon: Cpu,
      title: 'Pilih RAM 8GB, 16GB, atau 32GB? (DDR4 vs DDR5)',
      desc: 'Untuk tugas kuliah & office ringan, RAM 8GB cukup. Untuk coding, Figma, dan puluhan tab browser, upgrade ke 16GB dual-channel memberi lonjakan responsivitas paling terasa. Semua RAM second kami lolos MemTest86 0-error.'
    },
    {
      icon: HardDrive,
      title: 'Cek Kesehatan SSD NVMe (256GB / 512GB / 1TB)',
      desc: 'Berbeda dari HDD lama, SSD NVMe Gen4 mempercepat booting hingga di bawah 10 detik. Kami hanya menjual SSD second dengan Health terverifikasi minimal 97% via CrystalDiskInfo dan bebas bad sector.'
    },
    {
      icon: Wrench,
      title: 'Kenapa Repasta & Cleaning Rutin Itu Penting?',
      desc: 'Debu kipas dan thermal paste kering bikin laptop second cepat panas (thermal throttling) dan lemot. Setiap laptop di TECHCARE sudah dibersihkan total dan diganti thermal paste baru sebelum dikirim ke pembeli.'
    }
  ];

  return (
    <div className="bg-[#f9f9f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400 block">
              TECHCARE QC LAB & EDUKASI
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight">
              Panduan Cerdas Beli Hardware Second & Upgrade Spec
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Pahami standar pengecekan teknisi kami dan cara memilih kombinasi RAM serta SSD yang paling pas untuk kebutuhan Anda.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Reveal key={idx} delay={idx * 0.07}>
                <div className="bg-white p-7 rounded-3xl border border-neutral-200/70 space-y-3 h-full hover:border-neutral-900 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-[#f4f4f5] flex items-center justify-center text-neutral-900">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-neutral-900">{t.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="text-center pt-4">
            <button
              onClick={onExploreShop}
              className="bg-black text-white hover:bg-neutral-800 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>Jelajahi Katalog Second (&lt; 10 Juta)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
