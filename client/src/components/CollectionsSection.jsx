import React from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';

export default function CollectionsSection({ collections, onSelectCollection }) {
  const collectionStyle = [
    { bgColor: 'bg-[#eef2f6]', image: '/images/products/laptop.svg' },
    { bgColor: 'bg-[#f4f4f6]', image: '/images/products/keyboard.svg' },
    { bgColor: 'bg-[#e9edf5]', image: '/images/products/monitor.svg' },
    { bgColor: 'bg-[#f1f1f3]', image: '/images/products/ssd.svg' }
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="text-center mb-14 sm:mb-16">
            <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-neutral-500 block mb-2">
              KATEGORI PERANGKAT IT RESMI
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              Pilihan Hardware & Peripherals Terbaik
            </h2>
          </div>
        </Reveal>

        {/* 4 Tall Cards Grid with 80ms Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col, idx) => {
            const style = collectionStyle[idx % collectionStyle.length];
            return (
              <Reveal key={col.id} delay={idx * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSelectCollection(col.slug)}
                  className={`relative ${style.bgColor} rounded-4xl h-[380px] sm:h-[440px] flex flex-col justify-between items-center p-6 cursor-pointer overflow-hidden group shadow-xs`}
                >
                  <div className="w-full text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                      Lihat Katalog
                    </span>
                  </div>

                  {/* Graphic centered */}
                  <div className="w-full flex-1 flex items-center justify-center p-4 group-hover:scale-108 transition-transform duration-700">
                    <img
                      src={col.gambar || style.image}
                      alt={col.nama}
                      className="max-h-[220px] object-contain drop-shadow-xl"
                    />
                  </div>

                  {/* Overlay Horizontal Black Pill Bar */}
                  <div className="w-full z-10 mb-2">
                    <div className="w-full bg-black text-white hover:bg-neutral-800 transition-colors py-3 px-4 rounded-full text-center flex items-center justify-center space-x-2 shadow-md">
                      <span className="text-[11px] font-bold tracking-[0.18em] uppercase">
                        {col.buttonText || `${col.nama.toUpperCase()} +`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
