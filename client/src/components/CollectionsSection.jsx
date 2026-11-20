import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  return (
    <section className="bg-[#F4F6FA] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#0B5FFF] block mb-1">
                KATEGORI PILIHAN
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220]">
                Belanja Berdasarkan Kategori
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Semua perangkat IT pilihan di bawah Rp 10 juta dengan opsi upgrade RAM &amp; SSD langsung dari teknisi.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {collections.map((col, idx) => (
            <Reveal key={col.id} delay={idx * 0.05}>
              <motion.button
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCollection(col.slug)}
                className="w-full text-left group bg-white rounded-2xl border border-slate-200/90 hover:border-[#0B5FFF] p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-tc-card hover:shadow-tc-hover transition-all h-full"
              >
                <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-b from-[#F1F5F9] to-[#E8EEF6] p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={col.gambar}
                    alt={col.nama}
                    loading="lazy"
                    className="max-h-full max-w-[85%] object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-sm sm:text-base font-bold text-[#0B1220] group-hover:text-[#0B5FFF] transition-colors line-clamp-1">
                    {col.nama}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {col.tagline}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B5FFF] pt-1">
                  <span>Lihat Produk</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
