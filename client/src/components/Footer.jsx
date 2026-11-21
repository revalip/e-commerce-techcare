import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TechCareLogo from './TechCareLogo';

/**
 * Apple.com/id-inspired long structured footer:
 * Top legal/warranty notes -> 5 grouped directory columns on desktop
 * (collapsible accordions on mobile) -> compact bottom legal row.
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
        { label: 'Laptop Second (< Rp 10 Juta)', action: () => goCategory('laptop-second') },
        { label: 'RAM Desktop & Laptop SODIMM', action: () => goCategory('ram-memori') },
        { label: 'SSD NVMe PCIe Gen4', action: () => goCategory('ssd-storage') },
        { label: 'Monitor IPS & Curved', action: () => goCategory('display-monitor') },
        { label: 'Peripherals Gaming & Kerja', action: () => goCategory('peripherals') }
      ]
    },
    {
      id: 'akun',
      title: 'Akun',
      links: [
        { label: 'Lacak Pesanan & Resi', action: () => onNavigate('orders') },
        { label: 'Jelajahi Semua Katalog', action: () => onNavigate('shop') },
        { label: 'Keranjang & Checkout', action: () => onNavigate('checkout') }
      ]
    },
    {
      id: 'layanan',
      title: 'Layanan',
      links: [
        { label: 'Standar 32 Titik QC', action: () => onNavigate('learn') },
        { label: 'Jasa Repaste & Cleaning', action: () => onNavigate('about') },
        { label: 'Free Pasang Upgrade RAM/SSD', action: () => onNavigate('about') },
        { label: 'Garansi Toko 30–90 Hari', action: () => onNavigate('learn') }
      ]
    },
    {
      id: 'bisnis',
      title: 'Untuk Bisnis',
      links: [
        { label: 'Pengadaan Laptop Kantor', action: () => onNavigate('about') },
        { label: 'Maintenance Hardware UMKM', action: () => onNavigate('about') },
        { label: 'Custom Spesifikasi Unit', action: () => onNavigate('shop') }
      ]
    },
    {
      id: 'tentang',
      title: 'Tentang TechCare',
      links: [
        { label: 'Workshop & Tim Teknisi', action: () => onNavigate('about') },
        { label: 'Sentra Niaga IT Blok B No. 12, Jakarta Barat', action: () => onNavigate('about') },
        { label: 'WhatsApp: +62 812-3456-7890', action: () => onNavigate('about') },
        { label: 'Email: care@techcare.id', action: () => onNavigate('about') }
      ]
    }
  ];

  return (
    <footer className="bg-[#F5F5F7] text-[#4F627A] border-t border-[#E2E7EE] pt-10 pb-24 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Apple-style Fine Print & Assurance Notes */}
        <div className="pb-6 border-b border-[#DCE2EA] space-y-2 text-[11px] leading-relaxed text-[#6E6E73]">
          <p>
            1. Seluruh unit laptop dan komponen second melalui 32 titik inspeksi fisik, layar, baterai, suhu, dan performa MemTest86/CrystalDiskInfo sebelum masuk katalog.
          </p>
          <p>
            2. Garansi toko berlaku 30 hingga 90 hari sejak barang diterima (tergantung kategori produk). Gratis jasa pasang upgrade RAM/SSD untuk unit pembelian di TechCare.
          </p>
          <p>
            3. Harga dan ketersediaan stok dapat berubah sewaktu-waktu. Pengiriman via JNE, J&amp;T, SiCepat, atau ambil langsung di Workshop Jakarta Barat.
          </p>
        </div>

        {/* Directory: Accordion on Mobile (< md), 5 Clean Columns on Desktop */}
        <div className="py-6 md:py-10 md:grid md:grid-cols-5 md:gap-8 divide-y divide-[#DCE2EA] md:divide-y-0 border-b border-[#DCE2EA]">
          {groups.map((group) => {
            const isOpen = openGroup === group.id;
            return (
              <div key={group.id} className="py-3 md:py-0">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? '' : group.id)}
                  className="w-full md:hidden flex items-center justify-between py-1.5 text-left text-xs font-semibold text-[#1D2129]"
                  aria-expanded={isOpen}
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 text-[#6E6E73] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <h5 className="hidden md:block text-xs font-semibold text-[#1D2129] mb-3">
                  {group.title}
                </h5>

                <ul
                  className={`${
                    isOpen ? 'block pt-2 pb-1' : 'hidden md:block'
                  } space-y-2 text-xs text-[#6E6E73]`}
                >
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={link.action}
                        className="hover:text-[#0071E3] hover:underline text-left transition-colors py-0.5"
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

        {/* Bottom Legal & Store Strip */}
        <div className="pt-6 space-y-3 text-[11px] text-[#6E6E73]">
          <div className="flex flex-wrap items-center gap-2">
            <TechCareLogo size={20} />
            <span>
              Butuh konsultasi upgrade atau klaim garansi? Hubungi{' '}
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="text-[#0071E3] hover:underline font-medium"
              >
                Workshop TechCare Jakarta Barat
              </button>{' '}
              atau WhatsApp +62 812-3456-7890.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E2E7EE]">
            <p>Hak cipta © 2026 TechCare Indonesia. Seluruh hak cipta dilindungi.</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <button type="button" onClick={() => onNavigate('learn')} className="hover:text-[#1D2129]">
                Kebijakan Garansi
              </button>
              <button type="button" onClick={() => onNavigate('orders')} className="hover:text-[#1D2129]">
                Lacak Pesanan
              </button>
              <span className="font-medium text-[#1D2129]">Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
