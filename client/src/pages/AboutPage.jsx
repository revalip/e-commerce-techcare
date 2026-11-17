import React from 'react';
import Reveal from '../components/Reveal';
import { ArrowRight, ShieldCheck, Laptop, Cpu, Users, Award } from 'lucide-react';

export default function AboutPage({ onExploreShop }) {
  const partners = ['ASUS ROG', 'LOGITECH G', 'LENOVO LEGION', 'FANTECH', 'MSI GAMING'];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Garansi Resmi Unit Baru',
      desc: 'Seluruh perangkat IT yang kami jual dijamin 100% original, unit baru bersegel dan bergaransi resmi Indonesia tanpa kompromi barang black market.'
    },
    {
      icon: Cpu,
      title: 'Spesifikasi & Hardware Teruji',
      desc: 'Setiap laptop, komponen PC, dan peripheral melewati proses quality control (QC) ketat untuk memastikan stabilitas performa beban komputasi harian.'
    },
    {
      icon: Users,
      title: 'Solusi Korporat & Profesional',
      desc: 'Kami berpengalaman melayani pengadaan infrastruktur hardware untuk startup teknologi, software house, instansi pendidikan, dan kebutuhan personal.'
    },
    {
      icon: Award,
      title: 'Dukungan Purna Jual & Teknisi',
      desc: 'Layanan konsultasi spesifikasi gratis dan bantuan klaim garansi cepat didukung oleh tim teknisi IT bersertifikasi.'
    }
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* Hero Banner */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-neutral-400 block">
              TENTANG KAMI • TECHCARE IT STORE (UMKM)
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-tight">
              Toko Retail Perangkat IT & Solusi Komputasi UMKM Terpercaya
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light pt-2">
              <strong>TechCare</strong> adalah usaha retail UMKM yang bergerak di bidang penjualan perangkat keras teknologi informasi, laptop kerja & gaming, peripheral berkualitas tinggi, dan aksesoris komputer di Indonesia. Kami menghadirkan unit original terbaik dari brand ternama seperti ASUS, Logitech, Lenovo, Fantech, dan MSI dengan pelayanan personal dan garansi terjamin.
            </p>
          </div>
        </Reveal>

        {/* Brand Partners Ticker */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs text-center space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
            Brand Perangkat IT Pilihan di Toko Kami
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-1">
            {partners.map((p) => (
              <span key={p} className="font-serif text-sm sm:text-base font-bold tracking-wider text-neutral-800">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Narrative & Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
                Cerita Kami
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                Menghubungkan Inovasi Hardware dengan Kebutuhan Riil Anda
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Didirikan dengan visi menjadi rujukan utama ekosistem teknologi di tanah air, TechCare bermula dari pemahaman mendalam bahwa produktivitas kerja modern sangat bergantung pada keandalan perangkat komputasi.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Mulai dari laptop workstation bertenaga tinggi untuk rendering dan AI, monitor kurva beresolusi tajam untuk kenyamanan visual, hingga mouse dan mechanical keyboard ergonomis yang nyaman digunakan berjam-jam.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-[#f4f4f6] rounded-4xl p-8 sm:p-12 border border-neutral-200/80 flex items-center justify-center">
              <img
                src="/images/products/laptop.svg"
                alt="TechCare Hardware"
                className="max-h-72 object-contain drop-shadow-xl"
              />
            </div>
          </Reveal>
        </div>

        {/* 4 Pillars */}
        <div className="space-y-8">
          <Reveal>
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h3 className="font-serif text-2xl text-neutral-900">
                Komitmen Layanan TechCare
              </h3>
              <p className="text-xs text-neutral-500">Standar kualitas tanpa kompromi untuk seluruh pelanggan.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={index} delay={index * 0.08}>
                  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs space-y-2.5">
                    <Icon size={20} className="text-neutral-900" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{item.title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Reveal>
          <div className="bg-black text-white rounded-4xl p-8 sm:p-14 text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-neutral-400">
              SIAP UPGRADE HARDWARE ANDA?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl max-w-xl mx-auto leading-tight">
              Temukan Laptop, Monitor, dan Peripherals Resmi Hari Ini
            </h2>
            <div>
              <button
                onClick={onExploreShop}
                className="bg-white text-black hover:bg-neutral-100 transition-all px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-2"
              >
                <span>Jelajahi Katalog TechCare</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
