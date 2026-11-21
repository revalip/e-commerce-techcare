import React, { useState } from 'react';
import { ChevronRight, Check, Copy } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { mockProducts } from '../data/mock';
import { promoVouchers } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import Reveal from './Reveal';

/**
 * Apple.com/id Varied-Size 2-Column Alternating Grid:
 * Deliberately non-uniform 7/5 and 5/7 desktop proportions (1-col full-width on mobile),
 * strict #FFFFFF / #F5F5F7 / #1D1D1F / #0071E3 palette, honest short Indonesian copy.
 */
export default function FlagshipSpotlightSection({ onSelectProduct, onShopClick }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  const thinkpad = mockProducts[0]; // Lenovo ThinkPad X1 Carbon Gen 9
  const macbook = mockProducts[1]; // MacBook Air M1 (2020)
  const zenbook = mockProducts[2]; // ASUS ZenBook 14 OLED UX3402
  const monitor = mockProducts[7]; // LG UltraGear 27" IPS 144Hz

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

  return (
    <section className="bg-white py-3">
      <div className="max-w-[1440px] mx-auto px-3 space-y-3">
        {/* ROW 1: Asymmetric 7 / 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Wide Dark Tile (7 cols) */}
          <Reveal className="md:col-span-7">
            <div className="h-full rounded-[28px] overflow-hidden bg-[#1D1D1F] text-white min-h-[480px] sm:min-h-[540px] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6">
              <div className="max-w-lg mx-auto space-y-2">
                <h3 className="font-display text-[28px] sm:text-[38px] font-semibold tracking-[-0.03em] leading-[1.08]">
                  ThinkPad X1 Carbon Gen 9
                </h3>
                <p className="text-sm sm:text-lg text-[#F5F5F7]">
                  Bobot 1,13 kg. Layar 14&quot; IPS Anti-Glare. Mulai {formatIDR(thinkpad?.harga || 7850000)}.
                </p>
                <div className="pt-2.5 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(thinkpad)}
                    className="min-h-[40px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Beli
                  </button>
                  <button
                    type="button"
                    onClick={() => thinkpad && onSelectProduct && onSelectProduct(thinkpad)}
                    className="inline-flex items-center gap-0.5 min-h-[40px] text-xs sm:text-sm font-medium text-[#2997FF] hover:underline cursor-pointer"
                  >
                    <span>Selengkapnya</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="-mx-6 mt-8 h-[260px] sm:h-[310px] overflow-hidden">
                <img
                  src={thinkpad?.gambar?.[0] || '/images/products/thinkpad-x1-carbon-front.jpg'}
                  alt="Lenovo ThinkPad X1 Carbon Gen 9"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </Reveal>

          {/* Compact Light Tile (5 cols) */}
          <Reveal delay={0.04} className="md:col-span-5">
            <div className="h-full rounded-[28px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] min-h-[480px] sm:min-h-[540px] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6">
              <div className="max-w-sm mx-auto space-y-2">
                <h3 className="font-display text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.08]">
                  MacBook Air M1
                </h3>
                <p className="text-sm sm:text-lg text-[#6E6E73]">
                  Hening tanpa kipas. Clean iCloud. {formatIDR(macbook?.harga || 8250000)}.
                </p>
                <div className="pt-2.5 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(macbook)}
                    className="min-h-[40px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Beli
                  </button>
                  <button
                    type="button"
                    onClick={() => macbook && onSelectProduct && onSelectProduct(macbook)}
                    className="inline-flex items-center gap-0.5 min-h-[40px] text-xs sm:text-sm font-medium text-[#0071E3] hover:underline cursor-pointer"
                  >
                    <span>Selengkapnya</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="-mx-6 mt-8 h-[260px] sm:h-[310px] overflow-hidden">
                <img
                  src={macbook?.gambar?.[0] || '/images/products/macbook-air-m1.jpg'}
                  alt="MacBook Air M1 (2020)"
                  loading="lazy"
                  className="w-full h-full object-cover object-center mix-blend-multiply"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ROW 2: Reversed Asymmetric 5 / 7 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Compact Light Tile (5 cols) */}
          <Reveal className="md:col-span-5">
            <div className="h-full rounded-[28px] overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] min-h-[460px] sm:min-h-[520px] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6">
              <div className="max-w-sm mx-auto space-y-2">
                <h3 className="font-display text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.08]">
                  ASUS ZenBook 14 OLED
                </h3>
                <p className="text-sm sm:text-lg text-[#6E6E73]">
                  Layar 2.8K OLED 90Hz. Bebas burn-in. {formatIDR(zenbook?.harga || 7450000)}.
                </p>
                <div className="pt-2.5 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(zenbook)}
                    className="min-h-[40px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Beli
                  </button>
                  <button
                    type="button"
                    onClick={() => zenbook && onSelectProduct && onSelectProduct(zenbook)}
                    className="inline-flex items-center gap-0.5 min-h-[40px] text-xs sm:text-sm font-medium text-[#0071E3] hover:underline cursor-pointer"
                  >
                    <span>Selengkapnya</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-6 h-[250px] sm:h-[290px] flex items-center justify-center p-4">
                <img
                  src="/assets/asus-laptop.png"
                  alt="ASUS ZenBook 14 OLED UX3402"
                  loading="lazy"
                  className="max-h-full max-w-[88%] object-contain drop-shadow-[0_12px_20px_rgba(29,29,31,0.12)]"
                />
              </div>
            </div>
          </Reveal>

          {/* Wide Dark Tile (7 cols): Monitor IPS + Clean Voucher Strip */}
          <Reveal delay={0.04} className="md:col-span-7">
            <div className="h-full rounded-[28px] overflow-hidden bg-[#1D1D1F] text-white min-h-[460px] sm:min-h-[520px] flex flex-col justify-between text-center pt-10 sm:pt-12 px-6">
              <div className="max-w-lg mx-auto space-y-2">
                <h3 className="font-display text-[28px] sm:text-[38px] font-semibold tracking-[-0.03em] leading-[1.08]">
                  Monitor IPS &amp; Promo Toko
                </h3>
                <p className="text-sm sm:text-lg text-[#F5F5F7]">
                  LG UltraGear 27&quot; 144Hz mulai {formatIDR(monitor?.harga || 2150000)}. Potongan s/d Rp 500rb.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  {promoVouchers.slice(0, 2).map((v) => {
                    const isCopied = copiedCode === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleCopyCode(v.code)}
                        className={`inline-flex items-center gap-2 min-h-[34px] px-3.5 rounded-full border text-xs transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-[#0071E3] border-[#0071E3] text-white'
                            : 'bg-white/10 border-white/20 hover:border-white text-white'
                        }`}
                      >
                        <span className="font-mono font-semibold">{v.code}</span>
                        <span className="text-[#D2D2D7]">
                          {v.type === 'percent' ? `-${v.value}%` : '-200rb'}
                        </span>
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(monitor)}
                    className="min-h-[40px] px-5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Beli
                  </button>
                  <button
                    type="button"
                    onClick={onShopClick}
                    className="inline-flex items-center gap-0.5 min-h-[40px] text-xs sm:text-sm font-medium text-[#2997FF] hover:underline cursor-pointer"
                  >
                    <span>Selengkapnya</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="-mx-6 mt-6 h-[240px] sm:h-[270px] overflow-hidden">
                <img
                  src={monitor?.gambar?.[0] || '/images/products/lg-ultragear-27-ips.jpg'}
                  alt="LG UltraGear 27 IPS 144Hz Monitor"
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
