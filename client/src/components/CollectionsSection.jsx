import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-[#E2E7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#647082] block">
                01 / Kategori Perangkat
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.02]">
                Pilih kategori.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#647082] max-w-sm leading-relaxed">
              Seluruh kategori perangkat di bawah Rp 10 juta dengan opsi custom RAM &amp; SSD langsung di workshop kami.
            </p>
          </div>
        </Reveal>

        {/* Asymmetric Studio Bento: 2 Wide Top + 3 Bottom on Desktop; Clean 2-col (+ full-width 5th) on Mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
          {collections.map((col, idx) => {
            const isTopRow = idx < 2;
            const isLastOddMobile = collections.length % 2 === 1 && idx === collections.length - 1;
            const isJpg = /\.(jpe?g)$/i.test(col.gambar || '');

            return (
              <Reveal
                key={col.id}
                delay={idx * 0.04}
                className={`${isTopRow ? 'lg:col-span-6' : 'lg:col-span-4'} ${
                  isLastOddMobile ? 'col-span-2 lg:col-span-4' : 'col-span-1'
                }`}
              >
                <motion.button
                  type="button"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => onSelectCollection(col.slug)}
                  className={`w-full h-full text-left group bg-[#F7F8FA] hover:bg-white rounded-[24px] border border-[#E2E7EE] hover:border-[#B8C4D2] hover:shadow-tc-lift transition-all flex flex-col justify-between overflow-hidden ${
                    isTopRow ? 'lg:flex-row' : ''
                  }`}
                >
                  {/* Seamless Studio Hardware Stage */}
                  <div
                    className={`bg-[#ECEFF4] flex items-center justify-center overflow-hidden ${
                      isJpg ? 'p-0' : 'p-5 sm:p-7'
                    } ${
                      isTopRow
                        ? 'aspect-[4/3] lg:aspect-auto lg:w-[48%]'
                        : 'aspect-[4/3] w-full'
                    }`}
                  >
                    <img
                      src={col.gambar}
                      alt={col.nama}
                      loading="lazy"
                      className={`${
                        isJpg
                          ? 'w-full h-full object-cover object-center'
                          : 'max-h-36 sm:max-h-44 max-w-[84%] object-contain drop-shadow-md'
                      } group-hover:scale-105 transition-transform duration-500`}
                    />
                  </div>

                  {/* Clean Studio Copy */}
                  <div
                    className={`p-4 sm:p-6 flex flex-col justify-between gap-4 ${
                      isTopRow ? 'lg:w-[52%]' : 'flex-1'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[#8692A3]">
                        <span>0{idx + 1}</span>
                        <span className="w-7 h-7 rounded-full bg-white border border-[#E2E7EE] group-hover:bg-[#1D2129] group-hover:text-white group-hover:border-[#1D2129] flex items-center justify-center transition-colors">
                          <ArrowUpRight size={13} />
                        </span>
                      </div>

                      <h3 className="font-display text-base sm:text-xl font-medium tracking-[-0.03em] text-[#1D2129] leading-snug">
                        {col.nama}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-[#647082] line-clamp-2 leading-relaxed">
                        {col.tagline}
                      </p>
                    </div>

                    <span className="text-[11px] font-medium text-[#4F627A] group-hover:text-[#1D2129] transition-colors">
                      Lihat koleksi →
                    </span>
                  </div>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
