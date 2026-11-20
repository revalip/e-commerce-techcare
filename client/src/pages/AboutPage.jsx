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
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  Phone,
  HardDrive
} from 'lucide-react';

export default function AboutPage({ onExploreShop }) {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '1.200+', label: 'Unit Second Terjual & Terservis' },
    { value: '32 Titik', label: 'Standar QC Teknisi' },
    { value: '< Rp 10 Jt', label: 'Harga Terjangkau & Transparan' },
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
      desc: 'Bikin laptop atau PC lama kembali kencang. Tersedia RAM DDR4/DDR5 & SSD NVMe second tested MemTest86 + gratis pasang di workshop.'
    },
    {
      icon: HardDrive,
      title: 'Instalasi OS, Driver & Cloning Data',
      desc: 'Install ulang Windows/Linux bersih, migrasi data lama ke SSD baru tanpa kehilangan file, dan optimasi performa kerja/kuliah.'
    },
    {
      icon: ShieldCheck,
      title: 'Kurasi Barang Second Grade A/A+',
      desc: 'Hanya menjual perangkat IT second pilihan di bawah Rp 10 juta yang lulus 32 titik QC, bebas kerusakan tersembunyi, dan bergaransi toko 30–90 hari.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah TECHCARE hanya menjual barang second?',
      a: 'Benar. Fokus utama TECHCARE adalah jasa IT (service, upgrade, maintenance) serta menjual perangkat IT second berkualitas pilihan (Certified Pre-Owned) dengan harga di bawah Rp 10 juta agar mahasiswa, pekerja, dan UMKM mendapatkan performa maksimal dengan anggaran hemat.'
    },
    {
      q: 'Apakah saya bisa request upgrade RAM atau SSD sebelum barang dikirim?',
      a: 'Bisa banget! Langsung pilih konfigurasi RAM (8GB/16GB/32GB) dan SSD (256GB/512GB/1TB) di halaman detail produk. Teknisi kami akan memasang, menguji kestabilan MemTest86/CrystalDiskInfo, lalu mengirim unit siap pakai.'
    },
    {
      q: 'Bagaimana jaminan garansi untuk produk second di TECHCARE?',
      a: 'Setiap unit dilindungi Garansi Toko TECHCARE 30–90 hari (tergantung kategori: laptop 60 hari, RAM & SSD tukar unit 90 hari, monitor & peripheral 30 hari). Klaim garansi langsung ditangani tim teknisi kami tanpa proses berbelit.'
    },
    {
      q: 'Bagaimana cara melacak pesanan saya?',
      a: 'Masuk ke menu "Lacak Pesanan", masukkan nomor invoice (contoh: TC-261117-9102) atau nomor resi kurir. Anda dapat melihat progres dari verifikasi pembayaran, proses QC teknisi, hingga posisi paket ekspedisi secara real-time.'
    }
  ];

  return (
    <div className="bg-[#f9f9f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20">
        {/* Hero */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] uppercase tracking-[0.26em] font-bold text-neutral-400 block">
              JASA IT & CERTIFIED SECOND-HAND • TECHCARE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-tight">
              Berawal dari Teknisi IT, Menghadirkan Perangkat Second yang Bisa Dipercaya.
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              <strong>TECHCARE</strong> bergerak di bidang jasa IT — mulai dari service, pembersihan thermal, hingga upgrade RAM & SSD — sekaligus menyediakan perangkat IT second pilihan di bawah Rp 10 juta yang telah melalui pengecekan ketat 32 titik oleh teknisi kami sendiri.
            </p>
          </div>
        </Reveal>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <Reveal key={idx} delay={idx * 0.06}>
              <div className="bg-white p-6 rounded-3xl border border-neutral-200/70 text-center space-y-1">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">{s.value}</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 4 Layanan Jasa IT */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-neutral-400">
              LAYANAN UTAMA TECHCARE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900">
              Jasa IT & Kurasi Hardware Second
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={idx} delay={idx * 0.06}>
                  <div className="bg-white p-6 rounded-3xl border border-neutral-200/70 space-y-3 h-full">
                    <div className="w-10 h-10 rounded-2xl bg-[#f4f4f5] flex items-center justify-center text-neutral-900">
                      <Icon size={19} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-neutral-400">
              PERTANYAAN UMUM
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
              FAQ Produk Second & Jasa IT
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-neutral-200/70 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center text-xs font-bold text-neutral-900 gap-4"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 text-neutral-400 ${
                      openFaq === i ? 'rotate-180 text-black' : ''
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
                      className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3"
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
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-neutral-200/70 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <MapPin size={18} className="text-neutral-900" />
            <h5 className="font-serif text-sm font-bold text-neutral-900">Workshop Jasa IT & Pickup</h5>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Sentra Niaga IT Blok B No. 12, Grogol Petamburan, Jakarta Barat 11470
            </p>
          </div>
          <div className="space-y-1.5">
            <Clock size={18} className="text-neutral-900" />
            <h5 className="font-serif text-sm font-bold text-neutral-900">Jam Operasional</h5>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Senin – Sabtu: 09:00 – 20:00 WIB<br />Minggu: 10:00 – 17:00 WIB
            </p>
          </div>
          <div className="space-y-1.5">
            <Phone size={18} className="text-neutral-900" />
            <h5 className="font-serif text-sm font-bold text-neutral-900">Konsultasi Teknisi</h5>
            <p className="text-xs text-neutral-500 leading-relaxed">
              WhatsApp: +62 812-3456-7890<br />Email: care@techcare.id
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-neutral-950 text-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-4xl max-w-xl mx-auto">
            Siap Upgrade RAM/SSD atau Cari Laptop Second di Bawah 10 Juta?
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Pilih spesifikasi RAM & SSD sesuai kebutuhan Anda, pantau proses QC, dan lacak pengiriman langsung di TECHCARE.
          </p>
          <button
            onClick={onExploreShop}
            className="bg-white text-black hover:bg-neutral-100 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-2 transition-all active:scale-95"
          >
            <span>Lihat Katalog Second</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
