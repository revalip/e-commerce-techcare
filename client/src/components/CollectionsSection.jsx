import React from 'react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-[#F7F8FA] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8692A3]">
              Kategori Perangkat
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-medium tracking-[-0.03em] text-[#1D2129] leading-tight mt-1">
              Pilih sesuai kebutuhan.
            </h2>
          </div>
          <span className="lg:hidden text-[11px] text-[#8692A3]">Geser →</span>
        </div>

        {/* Horizontal Swipe Rail on Mobile, Clean 5-Col Grid on Desktop (Apple × Xiaomi style) */}
        <div className="mt-6 sm:mt-8 flex lg:grid lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
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
                    className={`bg-[#ECEFF4] border border-[#E2E7EE] rounded-[22px] aspect-square flex items-center justify-center overflow-hidden ${
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
                          : 'max-h-[84%] max-w-[84%] object-contain mix-blend-multiply'
                      } group-hover:scale-105 transition-transform duration-500`}
                    />
                  </div>
                  <p className="mt-2.5 text-center text-xs sm:text-sm font-medium text-[#1D2129] group-hover:text-[#4F627A] transition-colors truncate">
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
