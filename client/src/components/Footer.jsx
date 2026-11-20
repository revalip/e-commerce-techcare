import React from 'react';
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
    <footer className="bg-white border-t border-neutral-200 pt-12 sm:pt-14 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-100">
          {/* Brand */}
          <div className="space-y-3">
            <div>
              <span className="font-serif text-2xl tracking-[0.16em] font-medium text-black block">
                TECHCARE
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">
                IT Service & Certified Second
              </span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Spesialis jasa IT, upgrade hardware, dan penjualan perangkat IT second berkualitas di bawah Rp 10 juta. Setiap unit lulus 32 titik QC teknisi dan bergaransi toko.
            </p>
          </div>

          {/* Katalog */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-900">
              Katalog Second
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <button onClick={() => goCategory('laptop-second')} className="hover:text-black transition-colors">
                  Laptop Second (&lt; Rp 10 Juta)
                </button>
              </li>
              <li>
                <button onClick={() => goCategory('ram-memori')} className="hover:text-black transition-colors">
                  RAM Desktop & Laptop SODIMM
                </button>
              </li>
              <li>
                <button onClick={() => goCategory('ssd-storage')} className="hover:text-black transition-colors">
                  SSD NVMe Health 97%+
                </button>
              </li>
              <li>
                <button onClick={() => goCategory('display-monitor')} className="hover:text-black transition-colors">
                  Monitor IPS & Peripherals
                </button>
              </li>
            </ul>
          </div>

          {/* Layanan & Pelacakan */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-900">
              Layanan & Akun
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-black transition-colors">
                  Lacak Pesanan & Resi
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-black transition-colors">
                  Jasa Service & Upgrade IT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="hover:text-black transition-colors">
                  Panduan QC & Pilih Spec
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (isAdmin) {
                      onNavigate('admin');
                    } else {
                      openAuthModal('login', 'Silakan masuk menggunakan akun admin TECHCARE.');
                    }
                  }}
                  className="hover:text-black text-neutral-900 font-semibold"
                >
                  Portal Dashboard Admin →
                </button>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-900">
              Workshop & Kontak
            </h5>
            <p className="text-xs text-neutral-500 leading-relaxed">
              care@techcare.id<br />
              WhatsApp: +62 812-3456-7890<br />
              Senin – Sabtu (09:00 – 20:00 WIB)<br />
              Sentra Niaga IT, Jakarta Barat
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3">
          <p>© 2026 TECHCARE — Jasa IT & Perangkat Second Berkualitas.</p>
          <div className="flex space-x-5">
            <span>Garansi Toko 30–90 Hari</span>
            <span>•</span>
            <span>Lulus 32 Titik QC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
