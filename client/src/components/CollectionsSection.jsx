import React from 'react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-[#F7F8FA] py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.05] text-center">
            Pilih kategori.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {collections.map((col, idx) => {
            const isJpg = /\.(jpe?g)$/i.test(col.gambar || '');
            const isLastOddMobile =
              collections.length % 2 === 1 && idx === collections.length - 1;

            return (
              <Reveal
                key={col.id}
                delay={idx * 0.03}
                className={isLastOddMobile ? 'col-span-2 md:col-span-1' : ''}
              >
                <button
                  type="button"
                  onClick={() => onSelectCollection(col.slug)}
                  className="w-full group text-left"
                >
                  <div
                    className={`bg-white rounded-[24px] aspect-square flex items-center justify-center overflow-hidden ${
                      isJpg ? 'p-0' : 'p-6'
                    }`}
                  >
                    <img
                      src={col.gambar}
                      alt={col.nama}
                      loading="lazy"
                      className={`${
                        isJpg
                          ? 'w-full h-full object-cover'
                          : 'max-h-[70%] max-w-[70%] object-contain'
                      } group-hover:scale-105 transition-transform duration-500`}
                    />
                  </div>
                  <p className="mt-3 text-center text-sm font-medium text-[#1D2129] group-hover:text-[#4F627A] transition-colors">
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
