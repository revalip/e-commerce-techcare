import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Footer({ onNavigate }) {
  const { isAdmin, openAuthModal } = useAuth();

  return (
    <footer className="bg-white border-t border-neutral-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-100">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif text-2xl tracking-[0.18em] font-normal text-black block">
              TECHCARE
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Toko retail UMKM hardware IT, laptop kerja & gaming, peripheral berkualitas tinggi, dan aksesoris digital terpercaya di Indonesia dari brand ASUS, Logitech, Lenovo, Fantech, dan MSI.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900">
              Kategori Hardware
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-black transition-colors">Laptop ASUS ROG & Legion</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-black transition-colors">Monitor MSI QD-OLED</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-black transition-colors">Keyboard Fantech & ROG</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-black transition-colors">Mouse Logitech G Superlight</button></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900">
              Layanan & Akun
            </h5>
            <ul className="space-y-2 text-xs text-neutral-500">
              <li><button onClick={() => onNavigate('orders')} className="hover:text-black transition-colors">Lacak Status Pesanan</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-black transition-colors">Tentang TechCare</button></li>
              <li><span className="text-neutral-700">100% Garansi Resmi Unit Baru</span></li>
              <li>
                <button
                  onClick={() => {
                    if (isAdmin) {
                      onNavigate('admin');
                    } else {
                      openAuthModal('login', 'Silakan masuk menggunakan akun admin.');
                    }
                  }}
                  className="hover:text-black text-neutral-900 font-semibold"
                >
                  Portal Dashboard Admin →
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-900">
              Pusat Layanan & Kontak
            </h5>
            <p className="text-xs text-neutral-500 leading-relaxed">
              care@techcare.id<br />
              TECHCARE IT STORE (UMKM)<br />
              Layanan: Senin – Sabtu (08:00 – 21:00 WIB)<br />
              Jakarta, Indonesia
            </p>
          </div>

        </div>

        {/* Bottom Bar: Clean Minimalism */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© 2026 TECHCARE. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-neutral-600 transition-colors cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-neutral-600 transition-colors cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-neutral-600 transition-colors cursor-pointer">Klaim Garansi</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
