import React from 'react';
import Reveal from '../components/Reveal';
import { Cpu, Monitor, Mouse, Keyboard, ArrowRight } from 'lucide-react';

export default function LearnPage({ onExploreShop }) {
  const topics = [
    {
      icon: Monitor,
      title: 'QD-OLED vs Fast IPS pada Monitor',
      desc: 'Pelajari perbedaan teknologi Quantum Dot OLED (MSI MAG 341CQP) yang menawarkan waktu respons 0.03ms dengan kontras tak terbatas, dibandingkan panel Fast IPS 240Hz yang unggul untuk kecerahan tinggi.'
    },
    {
      icon: Mouse,
      title: 'Sensor HERO 2 & Polling Rate 8000Hz',
      desc: 'Mengapa polling rate 8000Hz pada Logitech G PRO X Superlight 2 DEX membuat pelacakan kursor terasa instan tanpa jitter? Pahami bagaimana latensi 0.125ms memberikan keunggulan presisi di game kompetitif.'
    },
    {
      icon: Keyboard,
      title: 'Struktur Gasket Mount & Thocky Sound',
      desc: 'Pahami bagaimana rancangan pelat peredam poron dan switch pre-lubed pada keyboard Fantech MAXFIT81 & ROG Azoth menyerap getaran ketikan, menghasilkan feedback taktil lembut dan suara akustik yang mantap.'
    },
    {
      icon: Cpu,
      title: 'Manajemen Thermal & NPU AI Boost',
      desc: 'Bagaimana arsitektur Intel Core Ultra 9 dan pendingin Vapor Chamber pada laptop ASUS ROG Zephyrus G16 menjaga performa GPU RTX 4080 tetap dingin dan stabil saat beban kerja rendering berat.'
    }
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-neutral-400 block">
              TECHCARE TECH LAB & EDUKASI
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight">
              Memahami Sains di Balik Hardware
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Pelajari arsitektur komputasi, teknologi sensor periferal, dan panduan memilih spesifikasi yang tepat untuk kebutuhan Anda.
            </p>
          </div>
        </Reveal>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Reveal key={idx} delay={idx * 0.08}>
                <div className="bg-white p-8 rounded-4xl border border-neutral-100 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-neutral-900">
                    {t.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {t.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="text-center pt-8">
            <button
              onClick={onExploreShop}
              className="bg-black text-white hover:bg-neutral-800 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>Lihat Produk di Katalog</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
