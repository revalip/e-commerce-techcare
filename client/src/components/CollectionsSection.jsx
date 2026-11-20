import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-[#f9f9f8] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-neutral-400 block mb-1">
                EKSPLORASI KATEGORI SECOND
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                Pilih Berdasarkan Kebutuhan IT
              </h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Semua kategori berisi unit second pilihan di bawah Rp 10 juta dengan opsi upgrade RAM & SSD.
            </p>
          </div>
        </Reveal>

        {/* Clean Horizontal Split Editorial Cards (2-col on md+, inspired by AERO STEP reference) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {collections.slice(0, 4).map((col, idx) => (
            <Reveal key={col.id} delay={idx * 0.07}>
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectCollection(col.slug)}
                className="group relative bg-white rounded-3xl border border-neutral-200/80 hover:border-neutral-900 overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex items-center justify-between gap-4 min-h-[175px] sm:min-h-[205px]"
              >
                <div className="flex-1 space-y-2.5 z-10 max-w-[58%]">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-neutral-900 uppercase tracking-tight">
                    {col.nama}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {col.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:gap-2.5 transition-all pt-1">
                    <span>Lihat Kategori</span>
                    <ArrowRight size={14} />
                  </span>
                </div>

                <div className="w-32 h-28 sm:w-44 sm:h-36 rounded-2xl bg-[#f4f4f5] p-3 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={col.gambar}
                    alt={col.nama}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* 5th Category Banner (Peripherals Second) */}
        {collections[4] && (
          <Reveal delay={0.2}>
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => onSelectCollection(collections[4].slug)}
              className="mt-4 sm:mt-6 group bg-white rounded-3xl border border-neutral-200/80 hover:border-neutral-900 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  AKSESORIS & WORKSPACE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-neutral-900 uppercase">
                  {collections[4].nama}
                </h3>
                <p className="text-xs text-neutral-500">{collections[4].tagline}</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-28 h-20 rounded-2xl bg-[#f4f4f5] p-2 flex items-center justify-center">
                  <img
                    src={collections[4].gambar}
                    alt={collections[4].nama}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
                <span className="px-5 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <span>Lihat</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </motion.div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
