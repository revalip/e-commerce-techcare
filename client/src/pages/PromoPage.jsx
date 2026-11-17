import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { promoVouchers } from '../data/mockProducts';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function PromoPage({ products, onSelectProduct, onExploreShop }) {
  const { addToCart } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const discountedProducts = products.filter(p => p.discount_percentage > 0);

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-200 inline-block">
            Pusat Promo & Kupon Diskon
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 tracking-tight">
            Hemat Lebih Banyak untuk Perangkat IT Terbaik
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light">
            Klaim kupon voucher diskon eksklusif dan nikmati potongan harga langsung untuk setiap pembelian hardware di TechCare.
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Tag size={18} className="text-neutral-900" />
            <h2 className="font-serif text-xl sm:text-2xl text-neutral-900">
              Kupon Voucher Tersedia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoVouchers.map((voucher) => (
              <div
                key={voucher.code}
                className="bg-white rounded-3xl p-6 border-2 border-dashed border-neutral-200 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-black transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-neutral-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {voucher.type === 'percent' ? `DISKON ${voucher.value}%` : `POTONGAN ${formatIDR(voucher.value)}`}
                    </span>
                    <Sparkles size={16} className="text-amber-500" />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      {voucher.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {voucher.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 mt-4 flex items-center justify-between gap-3">
                  <div className="bg-[#f8f8fa] px-3.5 py-2 rounded-xl border border-neutral-200 font-mono text-xs font-bold text-neutral-900 tracking-wider">
                    {voucher.code}
                  </div>

                  <button
                    onClick={() => handleCopy(voucher.code)}
                    className="flex-1 bg-black hover:bg-neutral-800 text-white transition-all py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
                  >
                    {copiedCode === voucher.code ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedCode === voucher.code ? 'Tersalin!' : 'Salin Kupon'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flash Sale / Discount IT Deals */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock size={15} />
                <span>PENAWARAN TERBATAS</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                Produk IT dengan Diskon Tertinggi
              </h2>
            </div>

            <button
              onClick={onExploreShop}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center space-x-1"
            >
              <span>Lihat Semua Produk</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-4xl p-6 sm:p-7 border border-neutral-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all relative group"
              >
                {/* Discount Badge */}
                <div className="absolute top-5 right-5 bg-red-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                  HEMAT {p.discount_percentage}%
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    {p.collection_name}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(p)}
                    className="font-serif text-lg font-bold text-neutral-900 cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    {p.name}
                  </h3>
                </div>

                {/* Image */}
                <div
                  onClick={() => onSelectProduct(p)}
                  className="my-6 h-48 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform"
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="max-h-full max-w-[85%] object-contain"
                  />
                </div>

                {/* Price Calculation with Discount Slashed */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-neutral-400 line-through">
                      {formatIDR(p.original_price)}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-neutral-900">
                      {formatIDR(p.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(p, 1)}
                    className="w-full bg-black hover:bg-neutral-800 text-white py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors active:scale-95"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
