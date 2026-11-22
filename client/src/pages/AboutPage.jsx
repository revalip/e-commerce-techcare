import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal';
import {
  ShieldCheck,
  Cpu,
  Clock,
  MapPin,
  Wrench,
  ChevronDown,
  ChevronRight,
  Phone,
  HardDrive
} from 'lucide-react';

/**
 * Apple.com/id-grade "Jasa IT & Tentang TechCare" page:
 * - Full-width #F5F5F7 editorial hero (no boxed dark cards, no pill eyebrows).
 * - Open borderless KPI row on pure white.
 * - Borderless #F5F5F7 rounded-[28px] service tiles with thin line icons.
 * - Hairline-divided Apple FAQ accordion on pure white.
 * - Clean #F5F5F7 Depok Workshop & WhatsApp band + full-width dark #000000 CTA.
 */
export default function AboutPage({ onExploreShop }) {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '1.200+', label: 'Unit terjual & terservis' },
    { value: '32 Titik', label: 'Standar QC teknisi' },
    { value: '< Rp 10 Jt', label: 'Kurasi harga hemat' },
    { value: '4.9 / 5', label: 'Rating pelanggan' }
  ];

  const services = [
    {
      icon: Wrench,
      title: 'Service & Maintenance Laptop',
      desc: 'Pembersihan kipas dan heatsink, ganti thermal paste baru, perbaikan engsel dan keyboard, hingga diagnosa hardware yang transparan.'
    },
    {
      icon: Cpu,
      title: 'Upgrade RAM & SSD Instan',
      desc: 'Tersedia RAM DDR4/DDR5 dan SSD NVMe yang sudah lolos MemTest86 serta CrystalDiskInfo. Pasang langsung gratis di workshop.'
    },
    {
      icon: HardDrive,
      title: 'Instalasi OS & Cloning Data',
      desc: 'Install ulang Windows atau Linux bersih, migrasi data lama ke SSD baru tanpa hilang file, dan optimasi performa kerja.'
    },
    {
      icon: ShieldCheck,
      title: 'Kurasi Hardware Grade A/A+',
      desc: 'Perangkat IT bisnis pilihan di bawah Rp 10 juta yang lulus 32 titik pengecekan, bebas cacat tersembunyi, bergaransi 30–90 hari.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah TechCare hanya menjual barang second?',
      a: 'Fokus utama TechCare adalah jasa IT (service, upgrade, maintenance) serta perangkat IT second pilihan (Certified Pre-Owned) di bawah Rp 10 juta agar mahasiswa, pekerja, dan UMKM mendapat performa tinggi dengan anggaran hemat.'
    },
    {
      q: 'Apakah saya bisa request upgrade RAM atau SSD sebelum dikirim?',
      a: 'Bisa. Langsung pilih kapasitas RAM (8GB/16GB/32GB) dan SSD (256GB/512GB/1TB) di halaman detail produk. Teknisi kami akan memasang, menguji kestabilan MemTest86/CrystalDiskInfo, lalu mengirim unit siap pakai.'
    },
    {
      q: 'Bagaimana jaminan garansi untuk produk di TechCare?',
      a: 'Setiap unit dilindungi Garansi Toko 30–90 hari (laptop 60 hari, RAM & SSD tukar unit 90 hari, monitor & peripheral 30 hari). Klaim garansi langsung ditangani tim teknisi kami di workshop.'
    },
    {
      q: 'Bagaimana cara melacak pesanan saya?',
      a: 'Buka menu Lacak Pesanan, lalu masukkan nomor invoice (contoh: TC-261117-9102) atau nomor resi kurir untuk melihat progres dari verifikasi pembayaran, QC teknisi, sampai paket tiba.'
    }
  ];

  return (
    <div className="bg-white text-[#1D1D1F] min-h-screen">
      {/* 1. Full-Width Clean Editorial Hero (#F5F5F7) */}
      <section className="w-full bg-[#F5F5F7] py-16 sm:py-24 lg:py-28">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <h1 className="tc-hero-title text-[#1D1D1F] max-w-3xl mx-auto">
              Berawal dari teknisi. Dibuat untuk dipercaya.
            </h1>
            <p className="mt-4 sm:mt-5 text-[17px] sm:text-[21px] leading-[1.45] text-[#6E6E73] max-w-2xl mx-auto">
              TechCare melayani perbaikan, pembersihan thermal, dan upgrade RAM/SSD, sekaligus menghadirkan perangkat IT bisnis pilihan yang lulus 32 titik pengecekan.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3.5 flex-wrap">
              <button
                type="button"
                onClick={onExploreShop}
                className="h-[40px] sm:h-[44px] px-5 sm:px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] sm:text-[17px] font-normal transition-colors cursor-pointer"
              >
                Lihat Katalog
              </button>
              <a
                href="https://wa.me/6285890673568"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 h-[40px] sm:h-[44px] px-4 text-[15px] sm:text-[17px] text-[#0071E3] hover:underline"
              >
                <span>Konsultasi WhatsApp</span>
                <ChevronRight size={17} strokeWidth={1.8} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Borderless Apple Stats Strip on Pure White */}
      <section className="w-full bg-white py-14 sm:py-20 border-b border-[#D2D2D7]/60">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
            {stats.map((s, idx) => (
              <Reveal key={s.label} delay={idx * 0.05}>
                <div className="space-y-1.5">
                  <p className="text-[32px] sm:text-[44px] font-semibold tracking-[-0.03em] text-[#1D1D1F] leading-none tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-[13px] sm:text-[14px] text-[#6E6E73]">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Borderless #F5F5F7 Service Bento Grid */}
      <section className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="tc-section-title text-[#1D1D1F]">
                Jasa IT &amp; kurasi hardware.
              </h2>
              <p className="mt-2.5 text-[17px] sm:text-[19px] text-[#6E6E73]">
                Dikerjakan langsung oleh teknisi dengan standar pengecekan transparan.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={idx * 0.05}>
                  <div className="bg-[#F5F5F7] rounded-[28px] p-7 sm:p-9 h-full space-y-3.5">
                    <Icon size={28} strokeWidth={1.5} className="text-[#1D1D1F]" />
                    <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] text-[#6E6E73] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Apple-Style Hairline FAQ Accordion */}
      <section className="w-full bg-white py-14 sm:py-20 border-t border-[#D2D2D7]/60">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6">
          <Reveal>
            <h2 className="tc-section-title text-[#1D1D1F] text-center mb-10 sm:mb-12">
              Pertanyaan umum.
            </h2>
          </Reveal>

          <div className="divide-y divide-[#D2D2D7] border-y border-[#D2D2D7]">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full py-5 sm:py-6 text-left flex justify-between items-center gap-6 text-[16px] sm:text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F] hover:text-[#0071E3] transition-colors cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.7}
                      className={`shrink-0 text-[#6E6E73] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1D1D1F]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-[15px] text-[#6E6E73] leading-relaxed pr-8">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Clean Borderless #F5F5F7 Workshop Depok & Contact Band */}
      <section className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="bg-[#F5F5F7] rounded-[28px] p-7 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <MapPin size={22} strokeWidth={1.5} className="text-[#1D1D1F]" />
                <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                  Workshop &amp; Pickup
                </h3>
                <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                  Jl. Keramat Benda XII, Bakti Jaya, Kec. Sukmajaya, Kota Depok, Jawa Barat
                </p>
                <a
                  href="https://maps.app.goo.gl/Yk2RrFqFscs4kRLB6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[14px] text-[#0071E3] hover:underline pt-1"
                >
                  <span>Buka di Google Maps</span>
                  <ChevronRight size={15} strokeWidth={1.8} />
                </a>
              </div>

              <div className="space-y-2">
                <Clock size={22} strokeWidth={1.5} className="text-[#1D1D1F]" />
                <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                  Jam Operasional
                </h3>
                <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                  Senin – Sabtu: 09.00 – 20.00 WIB
                  <br />
                  Minggu: 10.00 – 17.00 WIB
                </p>
              </div>

              <div className="space-y-2">
                <Phone size={22} strokeWidth={1.5} className="text-[#1D1D1F]" />
                <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                  Konsultasi Teknisi
                </h3>
                <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                  WhatsApp:{' '}
                  <a
                    href="https://wa.me/6285890673568"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0071E3] hover:underline"
                  >
                    +62 858-9067-3568
                  </a>
                  <br />
                  Email: care@techcare.id
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Full-Width Dark Closing CTA (#000000) */}
      <section className="w-full bg-[#000000] text-white py-16 sm:py-24 text-center">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 space-y-4">
          <h2 className="tc-section-title text-white">
            Siap upgrade atau cari laptop bisnis?
          </h2>
          <p className="text-[17px] sm:text-[19px] text-[#F5F5F7]/80 max-w-xl mx-auto">
            Pilih spesifikasi RAM &amp; SSD sesuai kebutuhan, pantau QC 32 titik, dan lacak pengiriman langsung.
          </p>
          <div className="pt-3">
            <button
              type="button"
              onClick={onExploreShop}
              className="h-[42px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] sm:text-[17px] font-normal transition-colors cursor-pointer"
            >
              Jelajahi Katalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
