import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  MapPin,
  Wrench,
  ChevronDown,
  Phone,
  HardDrive
} from 'lucide-react';

export default function AboutPage({ onExploreShop }) {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '1.200+', label: 'Unit Terjual & Terservis' },
    { value: '32 Titik', label: 'Standar QC Teknisi' },
    { value: '< Rp 10 Jt', label: 'Harga Terjangkau' },
    { value: '4.9 / 5.0', label: 'Rating Pelanggan' }
  ];

  const services = [
    {
      icon: Wrench,
      title: 'Service & Maintenance Laptop/PC',
      desc: 'Pembersihan kipas & heatsink, penggantian thermal paste premium, perbaikan engsel, keyboard, hingga diagnosa hardware transparan.'
    },
    {
      icon: Cpu,
      title: 'Upgrade RAM & SSD Instan',
      desc: 'Bikin laptop atau PC lama kembali kencang. Tersedia RAM DDR4/DDR5 & SSD NVMe tested MemTest86 + gratis pasang di workshop.'
    },
    {
      icon: HardDrive,
      title: 'Instalasi OS, Driver & Cloning Data',
      desc: 'Install ulang Windows/Linux bersih, migrasi data lama ke SSD baru tanpa kehilangan file, dan optimasi performa kerja/kuliah.'
    },
    {
      icon: ShieldCheck,
      title: 'Kurasi Hardware Grade A/A+',
      desc: 'Menjual perangkat IT pilihan di bawah Rp 10 juta yang lulus 32 titik QC, bebas kerusakan tersembunyi, dan bergaransi toko 30–90 hari.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah TECHCARE hanya menjual barang second?',
      a: 'Fokus utama TECHCARE adalah jasa IT (service, upgrade, maintenance) serta menyediakan perangkat IT second berkualitas pilihan (Certified Pre-Owned) dengan harga di bawah Rp 10 juta agar mahasiswa, pekerja, dan UMKM mendapatkan performa maksimal dengan anggaran hemat.'
    },
    {
      q: 'Apakah saya bisa request upgrade RAM atau SSD sebelum barang dikirim?',
      a: 'Bisa! Langsung pilih konfigurasi RAM (8GB/16GB/32GB) dan SSD (256GB/512GB/1TB) di halaman detail produk. Teknisi kami akan memasang, menguji kestabilan MemTest86/CrystalDiskInfo, lalu mengirim unit siap pakai.'
    },
    {
      q: 'Bagaimana jaminan garansi untuk produk di TECHCARE?',
      a: 'Setiap unit dilindungi Garansi Toko TECHCARE 30–90 hari (laptop 60 hari, RAM & SSD tukar unit 90 hari, monitor & peripheral 30 hari). Klaim garansi langsung ditangani tim teknisi kami tanpa berbelit.'
    },
    {
      q: 'Bagaimana cara melacak pesanan saya?',
      a: 'Masuk ke menu "Lacak Pesanan", masukkan nomor invoice (contoh: TC-261117-9102) atau nomor resi kurir. Anda dapat melihat progres dari verifikasi pembayaran, proses QC teknisi, hingga posisi paket ekspedisi.'
    }
  ];

  return (
    <div className="bg-[#F4F6FA] min-h-screen py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Hero */}
        <Reveal>
          <div className="bg-gradient-to-br from-[#0B1220] via-[#10203E] to-[#0D285B] text-white rounded-3xl p-6 sm:p-12 border border-slate-800 text-center space-y-4 relative overflow-hidden shadow-tc-float">
            <div className="absolute inset-0 tc-tech-grid opacity-50 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#0B5FFF]/25 border border-[#38BDF8]/30 text-[11px] uppercase tracking-wider font-bold text-sky-200">
                JASA IT &amp; RETAIL HARDWARE UMKM • TECHCARE
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
                Berawal dari Teknisi IT, Menghadirkan Perangkat yang Bisa Dipercaya.
              </h1>
              <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                TECHCARE melayani jasa perbaikan, pembersihan thermal, upgrade RAM/SSD, sekaligus menjual perangkat IT pilihan di bawah Rp 10 juta yang lulus 32 titik pengecekan.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {stats.map((s, idx) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-tc-card text-center space-y-1">
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#0B5FFF] tabular-nums">
                  {s.value}
                </p>
                <p className="text-xs text-slate-600 font-semibold">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Services */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#0B5FFF]">
              LAYANAN UTAMA TECHCARE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220]">
              Jasa IT &amp; Kurasi Hardware
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={idx} delay={idx * 0.05}>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-[#0B5FFF] shadow-tc-card space-y-3 h-full transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display text-sm font-bold text-[#0B1220]">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#0B5FFF]">
              PERTANYAAN UMUM
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220]">
              FAQ Produk &amp; Jasa IT
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-tc-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 min-h-[52px] text-left flex justify-between items-center text-xs sm:text-sm font-bold text-[#0B1220] gap-4"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 transition-transform duration-200 text-[#0B5FFF] ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-tc-card grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <MapPin size={20} className="text-[#0B5FFF]" />
            <h5 className="font-display text-sm font-bold text-[#0B1220]">Workshop Jasa IT &amp; Pickup</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sentra Niaga IT Blok B No. 12, Grogol Petamburan, Jakarta Barat 11470
            </p>
          </div>
          <div className="space-y-1.5">
            <Clock size={20} className="text-[#0B5FFF]" />
            <h5 className="font-display text-sm font-bold text-[#0B1220]">Jam Operasional</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Senin – Sabtu: 09:00 – 20:00 WIB
              <br />
              Minggu: 10:00 – 17:00 WIB
            </p>
          </div>
          <div className="space-y-1.5">
            <Phone size={20} className="text-[#0B5FFF]" />
            <h5 className="font-display text-sm font-bold text-[#0B1220]">Konsultasi Teknisi</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              WhatsApp: +62 812-3456-7890
              <br />
              Email: care@techcare.id
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0B1220] text-white rounded-3xl p-7 sm:p-10 text-center space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold max-w-xl mx-auto">
            Siap Upgrade RAM/SSD atau Cari Laptop di Bawah 10 Juta?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Pilih spesifikasi RAM &amp; SSD sesuai kebutuhan, pantau proses QC, dan lacak pengiriman langsung di TECHCARE.
          </p>
          <button onClick={onExploreShop} className="tc-btn-primary px-8 py-3.5">
            <span>Lihat Katalog Hardware</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
