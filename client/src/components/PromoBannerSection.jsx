import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { formatIDR } from '../utils/format';
import Reveal from './Reveal';

export default function PromoBannerSection({ discounts = [], onExploreShop }) {
  const [copiedCode, setCopiedCode] = useState('');

  const activeDiscounts = discounts.filter((d) => d.aktif).slice(0, 3);
  if (activeDiscounts.length === 0) return null;

  const handleCopy = (kode) => {
    navigator.clipboard.writeText(kode);
    setCopiedCode(kode);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <section className="bg-[#F4F6FA] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#0B5FFF] mb-1">
                <Sparkles size={13} className="text-[#F97316]" />
                <span>PROMO &amp; VOUCHER AKTIF</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220]">
                Hemat Lebih Banyak Saat Checkout
              </h2>
            </div>
            <button onClick={onExploreShop} className="tc-btn-secondary self-start sm:self-auto">
              <span>Pakai Voucher Sekarang</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeDiscounts.map((d, idx) => {
            const isCopied = copiedCode === d.kode;
            return (
              <Reveal key={d.id} delay={idx * 0.06}>
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#0B5FFF] shadow-tc-card transition-all flex flex-col justify-between gap-4 h-full relative overflow-hidden">
                  {/* Top Accent Bar */}
                  <span
                    className={`absolute top-0 inset-x-0 h-1 ${
                      idx === 0
                        ? 'bg-[#0B5FFF]'
                        : idx === 1
                        ? 'bg-[#F97316]'
                        : 'bg-emerald-500'
                    }`}
                  />

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF4FF] text-[#0B5FFF] text-[11px] font-bold">
                        <Tag size={12} />
                        {d.tipe === 'persen' ? `Diskon ${d.nilai}%` : `Potongan ${formatIDR(d.nilai)}`}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Min. {formatIDR(d.minBelanja)}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-[#0B1220] leading-snug">
                      {d.nama}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-dashed border-slate-200">
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#0B1220] bg-[#F4F6FA] px-3 py-2 rounded-xl border border-slate-200">
                      {d.kode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(d.kode)}
                      className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0B1220] hover:bg-[#0B5FFF] text-white'
                      }`}
                    >
                      {isCopied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{isCopied ? 'Tersalin!' : 'Salin Kode'}</span>
                    </button>
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
