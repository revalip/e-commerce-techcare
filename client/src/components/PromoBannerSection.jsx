import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
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
    <section className="bg-[#F2F1EC] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#111111]">
            <div>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#6E6D68] block mb-2">
                [ 03 // KUPON AKTIF CHECKOUT ]
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-[-0.04em] text-[#111111] leading-[0.96]">
                VOUCHER TOKO
              </h2>
            </div>

            <button
              type="button"
              onClick={onExploreShop}
              className="tc-btn-secondary self-start sm:self-auto"
            >
              <span>Pakai di Katalog</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeDiscounts.map((d, idx) => {
            const isCopied = copiedCode === d.kode;
            const bigValue =
              d.tipe === 'persen' ? `${d.nilai}%` : formatIDR(d.nilai).replace(',00', '');

            return (
              <Reveal key={d.id} delay={idx * 0.05}>
                <div className="bg-[#FAF9F6] rounded-[2px] border border-[#D6D4CC] hover:border-[#111111] transition-colors flex flex-col justify-between h-full">
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[#6E6D68]">
                      <span>VOUCHER_0{idx + 1}</span>
                      <span className="tabular-nums">MIN. {formatIDR(d.minBelanja)}</span>
                    </div>

                    <p
                      className={`font-display text-3xl sm:text-4xl font-black tracking-[-0.04em] leading-none tabular-nums ${
                        idx === 0 ? 'text-[#E63B19]' : 'text-[#111111]'
                      }`}
                    >
                      {d.tipe === 'persen' ? `DISKON ${bigValue}` : bigValue}
                    </p>

                    <h3 className="text-xs sm:text-sm font-semibold text-[#3A3A36] leading-snug">
                      {d.nama}
                    </h3>
                  </div>

                  <div className="px-5 py-3.5 border-t border-dashed border-[#B8B6AE] bg-[#F2F1EC]/60 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold tracking-[0.1em] text-[#111111] bg-[#FAF9F6] px-3 py-2 border border-[#D6D4CC]">
                      {d.kode}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(d.kode)}
                      className={`min-h-[44px] px-4 rounded-[2px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] inline-flex items-center gap-1.5 transition-colors ${
                        isCopied
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#111111] hover:bg-[#E63B19] text-[#F2F1EC]'
                      }`}
                    >
                      {isCopied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
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
