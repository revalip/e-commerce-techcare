import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal';
import {
  ArrowRight,
  ShieldCheck,
  Laptop,
  Cpu,
  Users,
  Award,
  Clock,
  Sparkles,
  MapPin,
  Wrench,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  Phone,
  Mail
} from 'lucide-react';

export default function AboutPage({ onExploreShop }) {
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { value: '5.200+', label: 'Unit Terkirim ke Seluruh RI' },
    { value: '100%', label: 'Unit Baru Bersegel Resmi' },
    { value: '< 2 Jam', label: 'Respon Konsultasi Teknisi' },
    { value: '4.9 / 5.0', label: 'Tingkat Kepuasan Pelanggan' }
  ];

  const partners = [
    { name: 'ASUS ROG & TUF', desc: 'Laptop Gaming & Workstation' },
    { name: 'LOGITECH G & MX', desc: 'Peripherals Akurasi Tinggi' },
    { name: 'LENOVO LEGION', desc: 'Performa Komputasi Ekstrem' },
    { name: 'FANTECH INDONESIA', desc: 'Mechanical Keyboard & Audio' },
    { name: 'MSI GAMING', desc: 'Display QD-OLED & Komponen' }
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Garansi Resmi Unit Baru',
      desc: 'Setiap unit laptop, monitor, dan peripheral yang keluar dari TechCare dijamin bersegel utuh pabrikan dan bergaransi resmi Indonesia. Kami menolak tegas barang rekondisi atau black market.'
    },
    {
      icon: Cpu,
      title: 'Transparansi Spesifikasi Riil',
      desc: 'Kami tidak menjual jargon pemasaran kosong. Tim kami menjelaskan detail teknis riil: TGP watt GPU, color gamut panel sRGB/DCI-P3, polling rate sensor, hingga durabilitas switch keyboard.'
    },
    {
      icon: Wrench,
      title: 'Quality Control & Stress-Test',
      desc: 'Sebelum pengiriman jarak jauh, kami menyediakan opsi pengecekan layar (dead pixel check) dan pengujian benchmark kestabilan untuk memastikan perangkat siap pakai langsung dari kotak.'
    },
    {
      icon: HeartHandshake,
      title: 'Pendampingan Purna Jual Personal',
      desc: 'Hubungan kami dengan pelanggan tidak berakhir saat barang sampai. Teknisi kami siap mendampingi panduan instalasi driver, optimasi bios, hingga bantuan klaim garansi ke service center resmi.'
    }
  ];

  const timeline = [
    {
      year: '2022',
      title: 'Awal Mula Komunitas',
      desc: 'Bermula dari jasa perakitan PC custom dan konsultasi hardware untuk pekerja kreatif dan gamer di Jakarta Barat.'
    },
    {
      year: '2024',
      title: 'Ekspansi Toko Retail UMKM',
      desc: 'Membuka workshop fisik mandiri dan resmi bermitra dengan prinsipal ternama: ASUS, Logitech, Lenovo, Fantech, dan MSI.'
    },
    {
      year: '2026',
      title: 'Platform Digital TechCare',
      desc: 'Meluncurkan webapp e-commerce mandiri dengan katalog spesifikasi mendalam, stepper checkout aman, dan verifikasi pembayaran lokal terpercaya.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah semua produk di TechCare original dan bergaransi resmi?',
      a: 'Ya, 100% produk yang kami jual adalah unit baru original bersegel pabrik yang bergaransi resmi dari distributor/prinsipal Indonesia (ASUS Indonesia, Logitech Indonesia, Lenovo Indonesia, dll). Nota pembelian resmi kami sertakan untuk kemudahan klaim di service center resmi di seluruh Indonesia.'
    },
    {
      q: 'Apakah saya bisa konsultasi spesifikasi sebelum membeli?',
      a: 'Tentu saja! Kami sangat menganjurkan Anda berkonsultasi terlebih dahulu mengenai kebutuhan software (misal: Adobe Creative Suite, Blender 3D, AutoCAD, coding, atau gaming kompetitif) agar anggaran Anda mendapatkan performa hardware yang paling optimal.'
    },
    {
      q: 'Bagaimana keamanan pengiriman laptop dan monitor?',
      a: 'Semua barang elektronik berukuran besar dan bernilai tinggi dikemas dengan perlindungan bubble wrap tebal ekstra, opsi packing kayu, serta proteksi asuransi pengiriman penuh dari ekspedisi kurir terpercaya.'
    },
    {
      q: 'Metode pembayaran apa saja yang diterima?',
      a: 'Saat ini kami melayani pembayaran lokal yang ramah UMKM: Transfer Bank langsung (BCA) serta QRIS Instan yang dapat dipindai oleh semua aplikasi m-Banking dan e-Wallet (BCA Mobile, Livin, GoPay, OVO, ShopeePay, Dana).'
    }
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* SECTION 1: HERO HEADER */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-neutral-400 block">
              TENTANG KAMI • TECHCARE IT STORE (UMKM)
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-tight">
              Bukan Sekadar Menjual Hardware, Kami Membangun Ekosistem Produktivitas Anda.
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light pt-2 max-w-2xl mx-auto">
              <strong>TechCare</strong> adalah usaha retail UMKM perangkat teknologi informasi yang berakar dari kecintaan mendalam terhadap hardware komputer. Kami hadir sebagai solusi bagi profesional, kreator konten, programmer, dan gamer yang mendambakan perangkat handal dengan garansi resmi dan pelayanan yang jujur.
            </p>
          </div>
        </Reveal>

        {/* SECTION 2: STATS COUNTER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <Reveal key={idx} delay={idx * 0.08}>
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-100 shadow-xs text-center space-y-1">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                  {s.value}
                </p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* SECTION 3: STORY & NARRATIVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 items-center">
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">
                CERITA & FILOSOFI
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-normal leading-snug">
                Lahir dari Keresahan Pasar Hardware Komputer
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Di tengah maraknya peredaran barang refurbish, garansi distributor tidak jelas, dan penjelasan spesifikasi yang membingungkan konsumen awam, TechCare didirikan dengan satu prinsip sederhana: <em>kejujuran tanpa kompromi</em>.
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                Bagi kami, setiap laptop yang dibeli adalah alat pencari nafkah seorang kreator. Setiap mouse dan keyboard adalah instrumen kerja harian seorang developer. Oleh karena itu, kami hanya menyediakan lini produk yang telah kami uji performa dan durabilitasnya dari brand terpercaya seperti ASUS, Logitech, Lenovo, Fantech, dan MSI.
              </p>
              <div className="pt-2 flex items-center space-x-6 text-xs text-neutral-700 font-medium">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-black" />
                  <span>No Gimmick</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-black" />
                  <span>QC Ketat</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-black" />
                  <span>Garansi Resmi</span>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-[#f4f4f6] rounded-4xl p-8 sm:p-12 border border-neutral-200/80 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md text-neutral-900 mb-2">
                <Laptop size={36} strokeWidth={1.6} />
              </div>
              <h4 className="font-serif text-xl font-semibold text-neutral-900">
                TechCare Hardware Studio
              </h4>
              <p className="text-xs text-neutral-500 max-w-xs font-light leading-relaxed">
                Pusat kurasi workstation, laptop gaming, display monitor resolusi tinggi, dan peripheral mekanikal pilihan.
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Verified Local Retailer
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* SECTION 4: 4 PILAR LAYANAN */}
        <div className="space-y-8">
          <Reveal>
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">
                NILAI UTAMA KAMI
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                4 Komitmen Tanpa Kompromi
              </h3>
              <p className="text-xs text-neutral-500">Standar layanan yang selalu kami pegang teguh untuk setiap pelanggan.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={index} delay={index * 0.08}>
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-100 shadow-xs space-y-3 h-full flex flex-col justify-between hover:border-neutral-300 transition-colors">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#fafafa] border border-neutral-100 flex items-center justify-center text-neutral-900">
                        <Icon size={19} />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: BRAND PARTNERS */}
        <div className="bg-white rounded-4xl p-8 sm:p-10 border border-neutral-100 shadow-xs space-y-6">
          <div className="text-center space-y-1 max-w-md mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-neutral-400">
              EKOSISTEM HARDWARE
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-neutral-900">
              Lini Brand Pilihan di TechCare
            </h3>
            <p className="text-xs text-neutral-500">
              Kami bermitra dengan brand global terpercaya untuk memastikan ketersediaan suku cadang dan garansi resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#fbfbfb] border border-neutral-100/80 text-center space-y-1 hover:bg-neutral-100 transition-colors"
              >
                <h5 className="font-serif text-sm font-bold text-neutral-900 tracking-wide">
                  {p.name}
                </h5>
                <p className="text-[10px] text-neutral-500">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: JEJAK PERJALANAN / TIMELINE */}
        <div className="space-y-8">
          <Reveal>
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">
                MILESTONES
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                Jejak Langkah TechCare
              </h3>
              <p className="text-xs text-neutral-500">Dedikasi kami dari bengkel hardware lokal hingga platform modern.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="bg-white p-7 rounded-3xl border border-neutral-100 shadow-xs space-y-3 relative overflow-hidden">
                  <span className="text-3xl font-serif font-bold text-neutral-200 block">
                    {item.year}
                  </span>
                  <h4 className="font-serif text-base font-bold text-neutral-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* SECTION 7: FAQ INTERAKTIF */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center space-y-1 mb-8">
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">
                PERTANYAAN UMUM
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-neutral-500">Hal-hal yang sering ditanyakan mengenai keaslian produk dan garansi.</p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-neutral-100 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center text-xs font-semibold text-neutral-900 hover:text-black gap-4"
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
                      className="px-5 pb-5 text-xs text-neutral-600 font-light leading-relaxed border-t border-neutral-50 pt-3"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: LOKASI & KONTAK WORKSHOP UMKM */}
        <div className="bg-white rounded-4xl p-8 sm:p-10 border border-neutral-100 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mx-auto sm:mx-0">
              <MapPin size={18} />
            </div>
            <h5 className="font-serif text-sm font-bold text-neutral-900">Workshop & Toko Fisik</h5>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Sentra Niaga IT Blok B No. 12<br />
              Grogol Petamburan, Jakarta Barat, DKI Jakarta 11470
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mx-auto sm:mx-0">
              <Clock size={18} />
            </div>
            <h5 className="font-serif text-sm font-bold text-neutral-900">Jam Operasional Toko</h5>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Senin – Sabtu: 09:00 – 20:00 WIB<br />
              Minggu & Libur Nasional: 10:00 – 17:00 WIB
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 mx-auto sm:mx-0">
              <Phone size={18} />
            </div>
            <h5 className="font-serif text-sm font-bold text-neutral-900">Layanan Konsultasi IT</h5>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              WhatsApp CS: +62 812-3456-7890<br />
              Email Resmi: care@techcare.id
            </p>
          </div>
        </div>

        {/* SECTION 9: CALL TO ACTION BANNER */}
        <Reveal>
          <div className="bg-black text-white rounded-4xl p-8 sm:p-14 text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-neutral-400">
              SIAP MENINGKATKAN PRODUKTIVITAS ANDA?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl max-w-xl mx-auto leading-tight">
              Temukan Laptop, Display OLED, dan Peripherals Resmi Hari Ini
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
              Nikmati kenyamanan berbelanja perangkat IT dengan potongan voucher diskon promo dan jaminan garansi resmi unit baru.
            </p>
            <div>
              <button
                onClick={onExploreShop}
                className="bg-white text-black hover:bg-neutral-100 transition-all px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-2 shadow-lg active:scale-95"
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
