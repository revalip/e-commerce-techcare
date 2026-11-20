import React from 'react';
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TechCareLogo from './TechCareLogo';

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
    <footer className="bg-[#1D2129] text-[#CBD3DF] pt-16 pb-24 md:pb-12 border-t border-[#2E3440]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Minimal Studio Footer Header */}
        <div className="pb-10 border-b border-[#2E3440] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8692A3] block">
              Certified Hardware &amp; Workshop UMKM
            </span>
            <div className="flex items-center gap-3">
              <TechCareLogo size={36} dark />
              <p className="font-display text-3xl sm:text-4xl font-medium tracking-[-0.04em] text-white leading-none">
                TechCare
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#9BA6B8] leading-relaxed max-w-md">
            Toko retail IT &amp; perangkat bisnis certified pre-owned di bawah Rp 10 juta. Setiap unit laptop, RAM, SSD, monitor, dan peripheral lulus 32 titik inspeksi teknisi sebelum dijual.
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 py-10 border-b border-[#2E3440]">
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8692A3]">
              Katalog Hardware
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#CBD3DF]">
              <li>
                <button
                  onClick={() => goCategory('laptop-second')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  Laptop Second (&lt; Rp 10 Juta)
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('ram-memori')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  RAM Desktop &amp; Laptop SODIMM
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('ssd-storage')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  SSD NVMe PCIe Gen4
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('display-monitor')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  Monitor IPS &amp; Curved Ultrawide
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('peripherals')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  Peripherals Gaming &amp; Kerja
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8692A3]">
              Layanan
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-[#CBD3DF]">
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  Lacak Pesanan &amp; Resi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors py-0.5 text-left"
                >
                  Jasa Service &amp; Upgrade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learn')}
                  className="hover:text-white transition-colors py-0.5 text-left"
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
                  className="inline-flex items-center gap-1 text-xs font-medium text-white hover:text-[#9BB0C9] border-b border-white/30 pb-0.5 transition-colors"
                >
                  <span>Portal Admin</span>
                  <ArrowUpRight size={13} />
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h5 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8692A3]">
              Workshop &amp; Pengiriman
            </h5>
            <div className="space-y-2 text-xs text-[#9BA6B8]">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#9BB0C9] shrink-0 mt-0.5" />
                <span>Sentra Niaga IT Blok B No. 12, Grogol Petamburan, Jakarta Barat</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#9BB0C9] shrink-0" />
                <span>+62 812-3456-7890 (Senin–Sabtu, 09:00–20:00)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#9BB0C9] shrink-0" />
                <span>care@techcare.id</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.06em]">
              {['QRIS', 'BCA', 'MANDIRI', 'JNE', 'J&T', 'SICEPAT'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full border border-[#343B48] bg-[#252A34] text-[#CBD3DF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#7B8698] gap-2">
          <p>© 2026 TechCare Indonesia — Retail IT &amp; Workshop UMKM.</p>
          <p className="font-mono text-[11px]">Garansi Toko 30–90 Hari • Simulasi Pembayaran Lokal</p>
        </div>
      </div>
    </footer>
  );
}
