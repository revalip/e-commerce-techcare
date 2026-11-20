import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-[#F2F1EC] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#111111]">
            <div>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#6E6D68] block mb-2">
                [ 01 // INDEX KATEGORI ]
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-[-0.04em] text-[#111111] leading-[0.96]">
                PILIH KATEGORI
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6E6D68] max-w-sm leading-relaxed">
              Seluruh kategori perangkat di bawah Rp 10 juta dengan opsi custom RAM/SSD dan pengecekan teknisi sebelum dikirim.
            </p>
          </div>
        </Reveal>

        {/* Asymmetric Architectural Bento Grid: 2 Wide Top + 3 Bottom on Desktop; Clean 2-col (+ full-width 5th) on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
          {collections.map((col, idx) => {
            const isTopRow = idx < 2;
            const isLastOddMobile = collections.length % 2 === 1 && idx === collections.length - 1;

            return (
              <Reveal
                key={col.id}
                delay={idx * 0.04}
                className={`${isTopRow ? 'lg:col-span-6' : 'lg:col-span-4'} ${
                  isLastOddMobile ? 'col-span-2 lg:col-span-4' : 'col-span-1'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectCollection(col.slug)}
                  className={`w-full h-full text-left group bg-[#FAF9F6] rounded-[2px] border border-[#D6D4CC] hover:border-[#111111] transition-colors flex flex-col justify-between overflow-hidden ${
                    isTopRow ? 'lg:flex-row' : ''
                  }`}
                >
                  {/* Image Stage (Full-bleed for studio JPGs, centered cutout for transparent PNG/WebP) */}
                  <div
                    className={`bg-[#E7E5DE] flex items-center justify-center overflow-hidden ${
                      /\.(jpe?g)$/i.test(col.gambar || '') ? 'p-0' : 'p-4 sm:p-6'
                    } ${
                      isTopRow
                        ? 'aspect-[4/3] lg:aspect-auto lg:w-[48%] lg:border-r border-b lg:border-b-0 border-[#D6D4CC]'
                        : 'aspect-[4/3] w-full border-b border-[#D6D4CC]'
                    }`}
                  >
                    <img
                      src={col.gambar}
                      alt={col.nama}
                      loading="lazy"
                      className={`${
                        /\.(jpe?g)$/i.test(col.gambar || '')
                          ? 'w-full h-full object-cover object-center'
                          : 'max-h-36 sm:max-h-44 max-w-[85%] object-contain'
                      } group-hover:scale-105 transition-transform duration-300`}
                    />
                  </div>

                  {/* Text & Numbered Index */}
                  <div
                    className={`p-3.5 sm:p-5 flex flex-col justify-between gap-4 ${
                      isTopRow ? 'lg:w-[52%]' : 'flex-1'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-[#6E6D68]">
                        <span>CAT_0{idx + 1}</span>
                        <ArrowUpRight
                          size={14}
                          className="text-[#111111] group-hover:text-[#E63B19] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </div>

                      <h3 className="font-display text-base sm:text-xl font-bold uppercase tracking-[-0.02em] text-[#111111] group-hover:text-[#E63B19] transition-colors leading-tight">
                        {col.nama}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-[#6E6D68] line-clamp-2 leading-relaxed">
                        {col.tagline}
                      </p>
                    </div>

                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#111111] group-hover:text-[#E63B19] inline-flex items-center gap-1 pt-2 border-t border-[#D6D4CC]/70">
                      <span>BUKA KATEGORI</span>
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
