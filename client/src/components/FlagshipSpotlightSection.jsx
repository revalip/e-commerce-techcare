import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { mockProducts } from '../data/mock';
import { promoVouchers } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import Reveal from './Reveal';

/**
 * Apple Indonesia (apple.com/id/) section-promo pattern:
 * 2-column symmetric showcase tiles on desktop, 1 full-width tile per row on mobile.
 * Each tile keeps Apple's 4-element discipline: Title, 1-line tagline, 2 pill CTAs, studio photo.
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

  const promoTiles = [
    {
      id: 'thinkpad-tile',
      dark: true,
      title: thinkpad?.nama || 'Lenovo ThinkPad X1 Carbon Gen 9',
      subtitle: `14" FHD+ IPS Anti-Glare • Mulai ${formatIDR(thinkpad?.harga || 7850000)}`,
      image: thinkpad?.gambar?.[0] || '/images/products/thinkpad-x1-carbon-front.jpg',
      product: thinkpad
    },
    {
      id: 'macbook-tile',
      dark: false,
      title: macbook?.nama || 'MacBook Air M1 (2020)',
      subtitle: `Clean iCloud • Battery 92% • ${formatIDR(macbook?.harga || 8250000)}`,
      image: macbook?.gambar?.[0] || '/images/products/macbook-air-m1.jpg',
      product: macbook
    },
    {
      id: 'zenbook-tile',
      dark: false,
      title: zenbook?.nama || 'ASUS ZenBook 14 OLED',
      subtitle: `Layar 2.8K OLED 90Hz • ${formatIDR(zenbook?.harga || 7450000)}`,
      image: zenbook?.gambar?.[0] || '/images/products/asus-zenbook-14-oled.jpg',
      product: zenbook
    }
  ];

  return (
    <section className="bg-white py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {promoTiles.map((tile, idx) => (
            <Reveal key={tile.id} delay={idx * 0.04}>
              <div
                className={`relative rounded-[24px] overflow-hidden min-h-[430px] sm:min-h-[500px] flex flex-col justify-between text-center pt-9 sm:pt-11 px-6 pb-6 ${
                  tile.dark ? 'bg-[#1D2129] text-white' : 'bg-[#F5F5F7] text-[#1D2129]'
                }`}
              >
                {/* Top: Apple-style Centered Title + 1-Line Subtitle + 2 Pill Buttons */}
                <div className="relative z-10 max-w-md mx-auto space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] leading-tight">
                    {tile.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm ${
                      tile.dark ? 'text-[#CBD5E1]' : 'text-[#4F627A]'
                    }`}
                  >
                    {tile.subtitle}
                  </p>
                  <div className="pt-2.5 flex items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => tile.product && onSelectProduct && onSelectProduct(tile.product)}
                      className={`min-h-[40px] px-5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                        tile.dark
                          ? 'bg-white text-[#1D2129] hover:bg-[#ECEFF4]'
                          : 'bg-[#1D2129] text-white hover:bg-[#323846]'
                      }`}
                    >
                      Selengkapnya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickBuy(tile.product)}
                      className={`min-h-[40px] px-5 rounded-full text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                        tile.dark
                          ? 'border-white/35 text-white hover:bg-white/10'
                          : 'border-[#1D2129] text-[#1D2129] hover:bg-[#1D2129] hover:text-white'
                      }`}
                    >
                      Beli
                    </button>
                  </div>
                </div>

                {/* Bottom: Clean Full Studio Product Photo */}
                <div className="relative mt-6 h-[220px] sm:h-[260px] w-full rounded-2xl overflow-hidden flex items-center justify-center">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </Reveal>
          ))}

          {/* 4th Tile: Promo Voucher & Upgrade Workshop (completes symmetric 2x2 grid on desktop!) */}
          <Reveal delay={0.12}>
            <div className="relative rounded-[24px] overflow-hidden min-h-[430px] sm:min-h-[500px] bg-[#1D2129] text-white flex flex-col justify-between text-center pt-9 sm:pt-11 px-6 pb-8">
              <div className="max-w-md mx-auto space-y-2.5">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-mono font-semibold uppercase tracking-[0.12em]">
                  Promo Toko • Hemat s/d 500rb
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.03em] leading-tight">
                  Diskon &amp; Free Pasang
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1]">
                  Salin kode voucher untuk dipakai di keranjang. Gratis pasang upgrade RAM/SSD di workshop.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  {promoVouchers.slice(0, 2).map((v) => {
                    const isCopied = copiedCode === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleCopyCode(v.code)}
                        className={`inline-flex items-center gap-2 min-h-[38px] px-3.5 rounded-full border text-xs transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                            : 'bg-white/10 border-white/20 hover:border-white text-white'
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
              </div>

              <div className="mt-6 flex flex-col items-center gap-4">
                <img
                  src="/images/products/thermal-cooling-internal.jpg"
                  alt="Perawatan kipas & upgrade internal TechCare"
                  loading="lazy"
                  className="w-full h-[180px] sm:h-[210px] object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={onShopClick}
                  className="inline-flex items-center gap-1.5 min-h-[42px] px-6 rounded-full bg-white text-[#1D2129] hover:bg-[#ECEFF4] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>Lihat Semua Katalog</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
