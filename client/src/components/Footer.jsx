import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Apple.com/id Footer (#F5F5F7, 12px typography, 5 clean grouped columns + mobile accordions).
 */
export default function Footer({ onNavigate, onSelectCollection }) {
  const [openGroup, setOpenGroup] = useState('belanja');

  const goCategory = (slug) => {
    if (onSelectCollection) {
      onSelectCollection(slug);
    } else {
      onNavigate('shop');
    }
  };

  const groups = [
    {
      id: 'belanja',
      title: 'Belanja',
      links: [
        { label: 'Laptop Second', action: () => goCategory('laptop-second') },
        { label: 'RAM & Memori', action: () => goCategory('ram-memori') },
        { label: 'SSD & Storage', action: () => goCategory('ssd-storage') },
        { label: 'Monitor Second', action: () => goCategory('display-monitor') },
        { label: 'Peripherals', action: () => goCategory('peripherals') }
      ]
    },
    {
      id: 'akun',
      title: 'Akun',
      links: [
        { label: 'Lacak Pesanan', action: () => onNavigate('orders') },
        { label: 'Semua Katalog', action: () => onNavigate('shop') },
        { label: 'Checkout', action: () => onNavigate('checkout') }
      ]
    },
    {
      id: 'layanan',
      title: 'Layanan',
      links: [
        { label: 'Standar 32 Titik QC', action: () => onNavigate('learn') },
        { label: 'Jasa Repaste & Cleaning', action: () => onNavigate('about') },
        { label: 'Gratis Pasang Upgrade', action: () => onNavigate('about') },
        { label: 'Garansi Toko 30–90 Hari', action: () => onNavigate('learn') }
      ]
    },
    {
      id: 'bisnis',
      title: 'Bisnis',
      links: [
        { label: 'Pengadaan Laptop Kantor', action: () => onNavigate('about') },
        { label: 'Perawatan Hardware', action: () => onNavigate('about') },
        { label: 'Custom Spesifikasi Unit', action: () => onNavigate('shop') }
      ]
    },
    {
      id: 'tentang',
      title: 'Tentang',
      links: [
        { label: 'Workshop Jakarta Barat', action: () => onNavigate('about') },
        { label: 'Sentra Niaga IT Blok B No. 12', action: () => onNavigate('about') },
        { label: '+62 812-3456-7890', action: () => onNavigate('about') },
        { label: 'care@techcare.id', action: () => onNavigate('about') }
      ]
    }
  ];

  return (
    <footer className="bg-[#F5F5F7] text-[#6E6E73] text-[12px] leading-relaxed pt-10 pb-12">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
        <div className="pb-6 border-b border-[#D2D2D7] space-y-2">
          <p>
            1. Seluruh unit laptop, monitor, dan komponen melalui 32 titik pengecekan fisik, layar, baterai, suhu, dan stabilitas MemTest86/CrystalDiskInfo sebelum dijual.
          </p>
          <p>
            2. Garansi toko 30 hingga 90 hari berlaku sejak barang diterima. Pemasangan upgrade RAM/SSD untuk unit pembelian di TechCare bebas biaya jasa.
          </p>
          <p>
            3. Pembayaran melalui QRIS dan transfer bank lokal (BCA &amp; Mandiri). Pengiriman lewat JNE, J&amp;T, SiCepat, atau ambil langsung di workshop.
          </p>
        </div>

        <div className="py-5 md:py-9 md:grid md:grid-cols-5 md:gap-8 divide-y divide-[#D2D2D7] md:divide-y-0 border-b border-[#D2D2D7]">
          {groups.map((group) => {
            const isOpen = openGroup === group.id;
            return (
              <div key={group.id} className="py-2.5 md:py-0">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? '' : group.id)}
                  className="w-full md:hidden flex items-center justify-between py-1 text-left text-[12px] font-semibold text-[#1D1D1F]"
                  aria-expanded={isOpen}
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 text-[#6E6E73] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <h5 className="hidden md:block text-[12px] font-semibold text-[#1D1D1F] mb-3">
                  {group.title}
                </h5>

                <ul
                  className={`${
                    isOpen ? 'block pt-2 pb-1' : 'hidden md:block'
                  } space-y-2 text-[12px] text-[#6E6E73]`}
                >
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={link.action}
                        className="hover:text-[#1D1D1F] hover:underline text-left transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="pt-6 space-y-3">
          <p>
            Butuh konsultasi upgrade atau klaim garansi? Hubungi{' '}
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="text-[#0071E3] hover:underline"
            >
              Workshop TechCare Jakarta Barat
            </button>{' '}
            atau WhatsApp +62 812-3456-7890.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#D2D2D7]/80">
            <p>Hak cipta © 2026 TechCare Indonesia. Seluruh hak cipta dilindungi.</p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => onNavigate('learn')} className="hover:text-[#1D1D1F]">
                Kebijakan Garansi
              </button>
              <button type="button" onClick={() => onNavigate('orders')} className="hover:text-[#1D1D1F]">
                Lacak Pesanan
              </button>
              <span className="text-[#1D1D1F]">Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
