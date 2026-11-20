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
    <section className="bg-white py-16 sm:py-24 border-b border-[#E2E7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#647082] block">
                03 / Kupon Checkout Aktif
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.02]">
                Potongan langsung.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {activeDiscounts.map((d, idx) => {
            const isCopied = copiedCode === d.kode;
            const bigValue =
              d.tipe === 'persen' ? `${d.nilai}%` : formatIDR(d.nilai).replace(',00', '');

            return (
              <Reveal key={d.id} delay={idx * 0.05}>
                <div className="bg-[#F7F8FA] rounded-[24px] border border-[#E2E7EE] hover:border-[#B8C4D2] transition-all flex flex-col justify-between h-full overflow-hidden">
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.06em] text-[#8692A3]">
                      <span>Voucher 0{idx + 1}</span>
                      <span className="tabular-nums">Min. {formatIDR(d.minBelanja)}</span>
                    </div>

                    <p className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-[#1D2129] leading-none tabular-nums">
                      {d.tipe === 'persen' ? `Diskon ${bigValue}` : bigValue}
                    </p>

                    <h3 className="text-xs sm:text-sm text-[#4F627A] leading-snug">
                      {d.nama}
                    </h3>
                  </div>

                  <div className="px-6 py-4 border-t border-[#E2E7EE] bg-white flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold tracking-[0.08em] text-[#1D2129] bg-[#F7F8FA] px-3.5 py-2 rounded-full border border-[#E2E7EE]">
                      {d.kode}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(d.kode)}
                      className={`min-h-[42px] px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                        isCopied
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#1D2129] hover:bg-[#323846] text-white'
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
