import React from 'react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-[#FFFFFF] py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6E6E73]">
              Kategori
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1D1D1F] leading-tight mt-1">
              Cari perangkat yang dibutuhkan.
            </h2>
          </div>
          <span className="lg:hidden text-xs text-[#6E6E73]">Geser</span>
        </div>

        {/* Horizontal Swipe Rail on Mobile, Clean 5-Col Row on Desktop */}
        <div className="mt-7 sm:mt-10 flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
          {collections.map((col, idx) => {
            const isJpg = /\.(jpe?g)$/i.test(col.gambar || '');

            return (
              <Reveal
                key={col.id}
                delay={idx * 0.03}
                className="w-[144px] sm:w-[168px] lg:w-auto shrink-0 snap-start"
              >
                <button
                  type="button"
                  onClick={() => onSelectCollection(col.slug)}
                  className="w-full group text-left cursor-pointer"
                >
                  <div
                    className={`bg-[#F5F5F7] rounded-[24px] aspect-square flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 ${
                      isJpg ? 'p-0' : 'p-5'
                    }`}
                  >
                    <img
                      src={col.gambar}
                      alt={col.nama}
                      loading="lazy"
                      className={`${
                        isJpg
                          ? 'w-full h-full object-cover'
                          : 'max-h-[82%] max-w-[82%] object-contain mix-blend-multiply'
                      } group-hover:scale-105 transition-transform duration-500`}
                    />
                  </div>
                  <p className="mt-3 text-center text-xs sm:text-sm font-medium text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                    {col.nama}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
