import React from 'react';
import { ShieldCheck, Tag, Truck, Headphones } from 'lucide-react';
import Reveal from './Reveal';

export default function FeatureStrip() {
  const features = [
    {
      icon: ShieldCheck,
      title: '100% GARANSI RESMI',
      desc: 'Produk original baru dan bergaransi resmi ASUS, Logitech, Lenovo, Fantech & MSI.'
    },
    {
      icon: Tag,
      title: 'DISCOUNT & PROMO VOUCHER',
      desc: 'Penawaran harga terbaik dengan potongan voucher diskon berkala.'
    },
    {
      icon: Truck,
      title: 'PENGIRIMAN AMAN BERASURANSI',
      desc: 'Gratis ongkir dengan proteksi asuransi pengiriman ke seluruh Indonesia.'
    },
    {
      icon: Headphones,
      title: 'DUKUNGAN TEKNISI IT',
      desc: 'Layanan konsultasi spesifikasi dan bantuan purna jual responsif.'
    }
  ];

  return (
    <section className="bg-white border-y border-[#ededf0] py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Reveal key={index} delay={index * 0.08}>
                <div className="flex items-start space-x-3.5 group">
                  <div className="text-neutral-900 pt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <IconComponent size={20} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold tracking-[0.18em] text-neutral-900 uppercase">
                      {item.title}
                    </h4>
                    <p className="text-[12px] leading-relaxed text-neutral-500 font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
