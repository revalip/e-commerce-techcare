import React from 'react';
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer({ onNavigate, onSelectCollection }) {
  const { isAdmin, openAuthModal } = useAuth();

  const goCategory = (slug) => {
    if (onSelectCollection) {
      onSelectCollection(slug);
    } else {
      onNavigate('shop');
    }
  };

  return (
    <footer className="bg-[#111111] text-[#D6D4CC] pt-14 pb-24 md:pb-10 border-t border-[#2A2A27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Massive Typographic Header */}
        <div className="pb-10 border-b border-[#2A2A27] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8880] block mb-2">
              TECHCARE // HARDWARE RETAIL &amp; WORKSHOP UMKM
            </span>
            <p className="font-display text-4xl sm:text-6xl font-black tracking-[-0.04em] uppercase text-[#F2F1EC] leading-none flex items-center gap-2.5">
              <span>TECHCARE</span>
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-[#E63B19] inline-block" />
            </p>
          </div>
          <p className="text-xs sm:text-sm text-[#A8A69E] leading-relaxed max-w-md">
            Toko retail IT &amp; perangkat certified pre-owned di bawah Rp 10 juta. Setiap unit laptop, RAM, SSD, monitor, dan peripheral diuji langsung 32 titik QC di workshop kami.
          </p>
        </div>

        {/* Hairline 12-Col Architectural Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 py-10 border-b border-[#2A2A27]">
          {/* 01 // Katalog */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[#8A8880]">
              [ 01 // KATALOG HARDWARE ]
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D6D4CC]">
              <li>
                <button
                  onClick={() => goCategory('laptop-second')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  Laptop Second (&lt; Rp 10 Juta)
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('ram-memori')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  RAM Desktop &amp; Laptop SODIMM
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('ssd-storage')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  SSD NVMe PCIe Gen4
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('display-monitor')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  Monitor IPS &amp; Curved Ultrawide
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('peripherals')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  Peripherals Gaming &amp; Kerja
                </button>
              </li>
            </ul>
          </div>

          {/* 02 // Layanan */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[#8A8880]">
              [ 02 // LAYANAN &amp; AKUN ]
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D6D4CC]">
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  Lacak Pesanan &amp; Resi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  Jasa Service &amp; Upgrade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learn')}
                  className="hover:text-[#E63B19] transition-colors py-0.5 text-left"
                >
                  Standar 32 Titik QC
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {
                    if (isAdmin) {
                      onNavigate('admin');
                    } else {
                      openAuthModal('login', 'Silakan masuk menggunakan akun admin TECHCARE.');
                    }
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[#F2F1EC] hover:text-[#E63B19] border-b border-[#F2F1EC] hover:border-[#E63B19] pb-0.5 transition-colors"
                >
                  <span>Portal Admin</span>
                  <ArrowUpRight size={13} />
                </button>
              </li>
            </ul>
          </div>

          {/* 03 // Workshop & Kontak */}
          <div className="lg:col-span-5 space-y-4">
            <h5 className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[#8A8880]">
              [ 03 // WORKSHOP &amp; PEMBAYARAN ]
            </h5>
            <div className="space-y-2 text-xs text-[#A8A69E]">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#E63B19] shrink-0 mt-0.5" />
                <span>Sentra Niaga IT Blok B No. 12, Grogol Petamburan, Jakarta Barat</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#E63B19] shrink-0" />
                <span>+62 812-3456-7890 (Senin–Sabtu, 09:00–20:00)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#E63B19] shrink-0" />
                <span>care@techcare.id</span>
              </p>
            </div>

            {/* Sharp Mono Payment & Courier Index */}
            <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.06em]">
              {['QRIS', 'BCA', 'MANDIRI', 'JNE', 'J&T', 'SICEPAT'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 border border-[#2A2A27] bg-[#1C1C1A] text-[#D6D4CC]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-[10px] uppercase tracking-[0.06em] text-[#787771] gap-2">
          <p>© 2026 TECHCARE INDONESIA — RETAIL IT &amp; WORKSHOP UMKM</p>
          <p>GARANSI TOKO 30–90 HARI // SIMULASI PEMBAYARAN LOKAL</p>
        </div>
      </div>
    </footer>
  );
}
