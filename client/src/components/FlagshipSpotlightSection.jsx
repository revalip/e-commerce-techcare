import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { mockProducts } from '../data/mock';
import { promoVouchers } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import Reveal from './Reveal';

/**
 * Apple.com/id section-promo 2-Column Alternating Light/Dark Grid:
 * Desktop: 2 symmetrical columns; Mobile: 1 full-width tile per row.
 * Each tile: Big headline + 1 short tagline + "Selengkapnya" & "Beli" pills + large photo.
 */
export default function FlagshipSpotlightSection({ onSelectProduct, onShopClick }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  const thinkpad = mockProducts[0]; // Lenovo ThinkPad X1 Carbon Gen 9
  const macbook = mockProducts[1]; // MacBook Air M1 (2020)
  const zenbook = mockProducts[2]; // ASUS ZenBook 14 OLED UX3402

  const handleQuickBuy = (item) => {
    if (!item) return;
    addToCart(item, 1, item.varianWarna?.[0]?.nama || 'Standard');
    setIsCartOpen(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  };

  const tiles = [
    {
      id: 'thinkpad',
      dark: true,
      title: 'ThinkPad X1 Carbon Gen 9',
      subtitle: `Tangguh di kerjaan. Mulai ${formatIDR(thinkpad?.harga || 7850000)}.`,
      image: thinkpad?.gambar?.[0] || '/images/products/thinkpad-x1-carbon-front.jpg',
      product: thinkpad
    },
    {
      id: 'macbook',
      dark: false,
      title: 'MacBook Air M1 (2020)',
      subtitle: `Baterai awet. Hening tanpa kipas. ${formatIDR(macbook?.harga || 8250000)}.`,
      image: macbook?.gambar?.[0] || '/images/products/macbook-air-m1.jpg',
      product: macbook
    },
    {
      id: 'zenbook',
      dark: false,
      title: 'ASUS ZenBook 14 OLED',
      subtitle: `Warna akurat 2.8K OLED. ${formatIDR(zenbook?.harga || 7450000)}.`,
      image: zenbook?.gambar?.[0] || '/images/products/asus-zenbook-14-oled.jpg',
      product: zenbook
    }
  ];

  return (
    <section className="bg-white py-3">
      <div className="max-w-7xl mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tiles.map((tile, idx) => (
            <Reveal key={tile.id} delay={idx * 0.04}>
              <div
                className={`relative overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-between text-center pt-10 px-6 ${
                  tile.dark ? 'bg-[#1D2129] text-white' : 'bg-[#F5F5F7] text-[#1D2129]'
                }`}
              >
                <div className="relative z-10 max-w-md mx-auto space-y-1.5">
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em]">
                    {tile.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${tile.dark ? 'text-[#CBD5E1]' : 'text-[#6E6E73]'}`}>
                    {tile.subtitle}
                  </p>
                  <div className="pt-2.5 flex items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => tile.product && onSelectProduct && onSelectProduct(tile.product)}
                      className="min-h-[38px] px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                    >
                      Selengkapnya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBuy(tile.product)}
                      className={`min-h-[38px] px-4 rounded-full text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                        tile.dark
                          ? 'border-white/40 text-white hover:bg-white hover:text-[#1D2129]'
                          : 'border-[#0071E3] text-[#0071E3] hover:bg-[#0071E3] hover:text-white'
                      }`}
                    >
                      Beli
                    </button>
                  </div>
                </div>

                {/* Full-bleed Studio Product Image */}
                <div className="relative -mx-6 mt-6 h-[270px] sm:h-[310px] overflow-hidden flex items-center justify-center">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    loading="lazy"
                    className={`w-full h-full object-cover object-center ${
                      tile.dark ? '' : 'mix-blend-multiply'
                    }`}
                  />
                </div>
              </div>
            </Reveal>
          ))}

          {/* 4th Symmetrical Tile (Dark): Voucher Promo & Monitor / Upgrade */}
          <Reveal delay={0.12}>
            <div className="relative overflow-hidden min-h-[460px] sm:min-h-[520px] bg-[#1D2129] text-white flex flex-col justify-between text-center pt-10 px-6 pb-8">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em]">
                  Promo &amp; Monitor Pro
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1]">
                  Hemat hingga Rp 500rb dengan voucher toko.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  {promoVouchers.slice(0, 2).map((v) => {
                    const isCopied = copiedCode === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleCopyCode(v.code)}
                        className={`inline-flex items-center gap-2 min-h-[36px] px-3.5 rounded-full border text-xs transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                            : 'bg-white/10 border-white/25 hover:border-white text-white'
                        }`}
                      >
                        <span className="font-mono font-semibold">{v.code}</span>
                        <span className="text-[#CBD5E1]">
                          {v.type === 'percent' ? `-${v.value}%` : '-200rb'}
                        </span>
                        {isCopied ? <Check size={12} /> : <Copy size={12} className="text-[#CBD5E1]" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={onShopClick}
                    className="min-h-[38px] px-4 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Selengkapnya
                  </button>
                  <button
                    type="button"
                    onClick={onShopClick}
                    className="min-h-[38px] px-4 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#1D2129] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Beli
                  </button>
                </div>
              </div>

              <div className="relative -mx-6 -mb-8 mt-6 h-[240px] sm:h-[260px] overflow-hidden">
                <img
                  src="/images/products/lg-ultragear-27-ips.jpg"
                  alt="Monitor LG UltraGear 27 IPS TechCare"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
