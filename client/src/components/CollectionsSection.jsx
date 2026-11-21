import React from 'react';
import Reveal from './Reveal';

/**
 * Horizontal scroll-snap category row with large rounded #F5F5F7 cards (no borders, no shadows).
 */
export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <h2 className="tc-section-title text-[#1D1D1F]">
            Jelajahi kategori.
          </h2>
        </Reveal>

        <div className="mt-8 sm:mt-12 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {collections.map((col, idx) => (
            <Reveal
              key={col.id}
              delay={idx * 0.04}
              className="w-[180px] sm:w-[216px] shrink-0 snap-start"
            >
              <button
                type="button"
                onClick={() => onSelectCollection(col.slug)}
                className="w-full group text-center cursor-pointer"
              >
                <div className="bg-[#F5F5F7] rounded-[28px] aspect-square flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={col.gambar}
                    alt={col.nama}
                    width={320}
                    height={320}
                    loading="lazy"
                    className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                  />
                </div>
                <p className="mt-3.5 text-[15px] font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                  {col.nama}
                </p>
                <p className="mt-0.5 text-[13px] text-[#6E6E73] line-clamp-1">
                  {col.tagline}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
