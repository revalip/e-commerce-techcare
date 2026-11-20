import React from 'react';
import { Cpu, ShieldCheck, Truck, CreditCard, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
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
    <footer className="bg-[#0B1220] text-slate-300 pt-14 pb-24 md:pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B5FFF] to-[#0847C4] text-white flex items-center justify-center shadow-tc-primary">
                <Cpu size={20} />
              </span>
              <div>
                <span className="font-display text-xl font-bold text-white tracking-tight block leading-none">
                  TECH<span className="text-[#38BDF8]">CARE</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                  IT Retail • Certified Second • Service
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Toko retail IT &amp; elektronik UMKM terpercaya. Menyediakan laptop bisnis, monitor, peripheral (ASUS, Lenovo, Logitech, Fantech, MSI), serta upgrade RAM/SSD yang seluruhnya lulus 32 titik QC teknisi.
            </p>

            {/* Payment & Courier Badges */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  <CreditCard size={11} className="text-[#38BDF8]" /> QRIS
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  BCA
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  Mandiri
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  <Truck size={11} className="text-[#F97316]" /> JNE • J&amp;T • SiCepat
                </span>
              </div>
            </div>
          </div>

          {/* Katalog */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-white">Katalog Hardware</h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => goCategory('laptop-second')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  Laptop Second (&lt; Rp 10 Juta)
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('ram-memori')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  RAM Desktop &amp; Laptop SODIMM
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('ssd-storage')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  SSD NVMe PCIe Gen4
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('display-monitor')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  Monitor IPS &amp; Curved Ultrawide
                </button>
              </li>
              <li>
                <button
                  onClick={() => goCategory('peripherals')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  Peripherals Gaming &amp; Kerja
                </button>
              </li>
            </ul>
          </div>

          {/* Layanan & Akun */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-white">Layanan</h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('orders')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  Lacak Pesanan &amp; Resi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  Jasa Service &amp; Upgrade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('learn')}
                  className="hover:text-[#38BDF8] transition-colors py-0.5"
                >
                  Panduan 32 Titik QC
                </button>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => {
                    if (isAdmin) {
                      onNavigate('admin');
                    } else {
                      openAuthModal('login', 'Silakan masuk menggunakan akun admin TECHCARE.');
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[#38BDF8] hover:text-white font-semibold transition-colors"
                >
                  <span>Portal Admin</span>
                  <ArrowRight size={13} />
                </button>
              </li>
            </ul>
          </div>

          {/* Workshop & Kontak */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-xs font-bold tracking-wider uppercase text-white">Workshop &amp; Kontak</h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-[#38BDF8] shrink-0 mt-0.5" />
                <span>Sentra Niaga IT Blok B No. 12, Grogol Petamburan, Jakarta Barat</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-[#38BDF8] shrink-0" />
                <span>+62 812-3456-7890 (Senin–Sabtu, 09:00–20:00)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-[#38BDF8] shrink-0" />
                <span>care@techcare.id</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 TECHCARE Indonesia — E-Commerce Retail IT &amp; Jasa Upgrade UMKM.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck size={13} className="text-emerald-400" /> Garansi Toko 30–90 Hari
            </span>
            <span>•</span>
            <span className="text-slate-400">Simulasi Pembayaran Lokal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
