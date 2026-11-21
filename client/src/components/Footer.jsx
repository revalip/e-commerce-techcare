import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TechCareLogo from './TechCareLogo';

/**
 * Apple.com/id Structured Footer:
 * Footnotes -> 5 grouped sections (Belanja, Akun, Layanan, Bisnis, Tentang)
 * that collapse into accordions on mobile -> compact legal row.
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
        { label: 'Gratis Pasang Upgrade RAM/SSD', action: () => onNavigate('about') },
        { label: 'Garansi Toko 30–90 Hari', action: () => onNavigate('learn') }
      ]
    },
    {
      id: 'bisnis',
      title: 'Bisnis',
      links: [
        { label: 'Pengadaan Laptop Kantor', action: () => onNavigate('about') },
        { label: 'Perawatan Hardware Kantor', action: () => onNavigate('about') },
        { label: 'Custom Spesifikasi Unit', action: () => onNavigate('shop') }
      ]
    },
    {
      id: 'tentang',
      title: 'Tentang',
      links: [
        { label: 'Workshop & Tim Teknisi', action: () => onNavigate('about') },
        { label: 'Sentra Niaga IT Blok B No. 12, Jakarta Barat', action: () => onNavigate('about') },
        { label: 'WhatsApp: +62 812-3456-7890', action: () => onNavigate('about') },
        { label: 'Email: care@techcare.id', action: () => onNavigate('about') }
      ]
    }
  ];

  return (
    <footer className="bg-[#F5F5F7] text-[#6E6E73] border-t border-[#D2D2D7]/70 pt-10 pb-24 md:pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Fine Print Notes */}
        <div className="pb-6 border-b border-[#D2D2D7] space-y-2 text-[11px] leading-relaxed text-[#6E6E73]">
          <p>
            1. Seluruh unit laptop, monitor, dan komponen melalui 32 titik pengecekan fisik, layar, baterai, suhu, dan stabilitas MemTest86/CrystalDiskInfo sebelum dijual.
          </p>
          <p>
            2. Garansi toko 30 hingga 90 hari berlaku sejak unit diterima. Pembelian paket upgrade RAM/SSD bersama laptop bebas biaya pemasangan di workshop.
          </p>
          <p>
            3. Pembayaran mendukung QRIS dan transfer bank lokal (BCA &amp; Mandiri). Pengiriman melalui JNE, J&amp;T, SiCepat, atau ambil langsung di Workshop Jakarta Barat.
          </p>
        </div>

        {/* 5 Grouped Columns on Desktop / Collapsible Accordions on Mobile */}
        <div className="py-5 md:py-9 md:grid md:grid-cols-5 md:gap-8 divide-y divide-[#D2D2D7] md:divide-y-0 border-b border-[#D2D2D7]">
          {groups.map((group) => {
            const isOpen = openGroup === group.id;
            return (
              <div key={group.id} className="py-3 md:py-0">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? '' : group.id)}
                  className="w-full md:hidden flex items-center justify-between py-1 text-left text-xs font-semibold text-[#1D1D1F]"
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
                <h5 className="hidden md:block text-xs font-semibold text-[#1D1D1F] mb-3">
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
                        className="hover:text-[#1D1D1F] hover:underline text-left transition-colors py-0.5"
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

        {/* Compact Legal Row */}
        <div className="pt-6 space-y-3 text-[11px] text-[#6E6E73]">
          <div className="flex flex-wrap items-center gap-2">
            <TechCareLogo size={18} />
            <span>
              Konsultasi spesifikasi atau klaim garansi:{' '}
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#D2D2D7]/70">
            <p>Hak cipta © 2026 TechCare Indonesia. Seluruh hak cipta dilindungi.</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <button type="button" onClick={() => onNavigate('learn')} className="hover:text-[#1D1D1F]">
                Kebijakan Garansi
              </button>
              <button type="button" onClick={() => onNavigate('orders')} className="hover:text-[#1D1D1F]">
                Lacak Pesanan
              </button>
              <span className="font-medium text-[#1D1D1F]">Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
