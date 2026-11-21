import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy, ShieldCheck } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { mockProducts } from '../data/mock';
import { promoVouchers } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import Reveal from './Reveal';

export default function FlagshipSpotlightSection({ onSelectProduct, onShopClick }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  // Featured flagship unit from verified catalog
  const flagship = mockProducts[0];
  if (!flagship) return null;

  const handleBuyFlagship = () => {
    addToCart(flagship, 1, flagship.varianWarna?.[0]?.nama || 'Matte Black');
    setIsCartOpen(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  };

  return (
    <section className="bg-[#F7F8FA] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Dark Flagship Spotlight Card (Apple × Samsung style) */}
          <Reveal className="lg:col-span-7">
            <div className="relative h-full rounded-[28px] bg-[#1D2129] text-white p-6 sm:p-8 overflow-hidden flex flex-col justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-sm relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono uppercase tracking-[0.14em] text-[#DCE2EA]">
                    <ShieldCheck size={12} />
                    <span>Pilihan Teknisi • Grade A+</span>
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.03em] leading-tight">
                    {flagship.nama}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A5B1C2] leading-relaxed">
                    14&quot; FHD+ IPS Anti-Glare • Core i5 Gen-11 • Bobot 1,13 kg
                  </p>
                  <div className="pt-1 flex items-baseline gap-2.5">
                    <span className="font-display text-xl sm:text-2xl font-semibold tabular-nums">
                      {formatIDR(flagship.harga)}
                    </span>
                    {flagship.hargaCoret && (
                      <span className="font-mono text-xs text-[#8692A3] line-through tabular-nums">
                        {formatIDR(flagship.hargaCoret)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-48 md:w-56 aspect-[4/3] rounded-2xl overflow-hidden bg-[#282D36] shrink-0">
                  <img
                    src={flagship.gambar?.[0] || '/images/products/thinkpad-x1-carbon-front.jpg'}
                    alt={flagship.nama}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleBuyFlagship}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 rounded-full bg-white text-[#1D2129] hover:bg-[#ECEFF4] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <span>Beli Sekarang</span>
                  <ArrowUpRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProduct && onSelectProduct(flagship)}
                  className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full border border-white/25 text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </Reveal>

          {/* Light Promo Voucher Card (Samsung × Xiaomi Indonesia style) */}
          <Reveal delay={0.05} className="lg:col-span-5">
            <div className="h-full rounded-[28px] bg-[#ECEFF4] border border-[#E2E7EE] p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-2.5">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-mono font-semibold uppercase tracking-[0.12em]">
                  Promo Toko • Hemat s/d 500rb
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#1D2129] leading-tight">
                  Diskon &amp; gratis pasang upgrade.
                </h3>
                <p className="text-xs sm:text-sm text-[#4F627A] leading-relaxed">
                  Salin kode voucher di bawah dan pakai langsung di keranjang. Bisa gratis pasang RAM/SSD di workshop.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  {promoVouchers.slice(0, 2).map((v) => {
                    const isCopied = copiedCode === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleCopyCode(v.code)}
                        className={`inline-flex items-center gap-2 min-h-[38px] px-3.5 rounded-full border text-xs transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-[#DCE2EA] hover:border-[#1D2129] text-[#1D2129]'
                        }`}
                      >
                        <span className="font-mono font-semibold">{v.code}</span>
                        <span className="text-[#647082]">
                          {v.type === 'percent' ? `-${v.value}%` : `-200rb`}
                        </span>
                        {isCopied ? <Check size={12} /> : <Copy size={12} className="text-[#8692A3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onShopClick}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1D2129] hover:text-[#4F627A] transition-colors min-h-[44px] cursor-pointer"
                >
                  <span>Jelajahi semua promo &amp; katalog</span>
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
