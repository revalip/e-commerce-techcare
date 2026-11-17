import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Reveal from './Reveal';

export default function HeroSection({ onShopClick }) {
  return (
    <section className="relative w-full bg-[#f4f4f6] overflow-hidden">
      <div className="relative max-w-6xl mx-auto min-h-[580px] sm:min-h-[680px] lg:min-h-[740px] flex flex-col justify-between items-center px-4 py-8 sm:py-12">
        
        {/* Flagship IT Hardware visual presentation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
            {/* Ambient Lighting */}
            <div className="absolute w-[360px] sm:w-[560px] h-[360px] sm:h-[560px] rounded-full bg-gradient-to-tr from-blue-100/50 via-neutral-200/40 to-transparent blur-3xl" />
            
            <div className="relative z-10 w-80 sm:w-[460px] lg:w-[520px] transition-transform duration-700 hover:scale-[1.02]">
              <img
                src="/images/products/laptop.svg"
                alt="ASUS ROG Zephyrus G16 TechCare"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Top subtle badge */}
        <Reveal delay={0.1}>
          <div className="relative z-10 text-center pt-2">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] font-semibold text-neutral-600 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-neutral-200/70 shadow-xs flex items-center space-x-1.5">
              <ShieldCheck size={13} className="text-neutral-800" />
              <span>Toko Retail IT & Elektronik UMKM • Unit Baru & Garansi Resmi</span>
            </span>
          </div>
        </Reveal>

        {/* Floating Pill Card at Bottom Center */}
        <div className="relative z-20 w-full max-w-md sm:max-w-xl mb-6 sm:mb-10">
          <Reveal delay={0.25} y={30}>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white/90 backdrop-blur-xl border border-white/95 rounded-full px-4 sm:px-6 py-3.5 sm:py-4 shadow-[0_12px_40px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3 sm:gap-4"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#f4f4f6] flex-shrink-0 flex items-center justify-center p-1.5 border border-white">
                <img
                  src="/images/products/laptop.svg"
                  alt="ASUS ROG Zephyrus G16"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Middle Text Info */}
              <div className="flex-1 text-left min-w-0 pr-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif text-sm sm:text-base font-semibold tracking-wide text-neutral-900 truncate">
                    ASUS ROG Zephyrus G16
                  </h4>
                  <span className="hidden sm:inline-block px-2 py-0.2 bg-black text-white text-[9px] font-bold rounded-full">
                    NEW 2024
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-neutral-500 line-clamp-1 leading-snug">
                  Intel Core Ultra 9 • RTX 4080 • 2.5K OLED 240Hz
                </p>
              </div>

              {/* Shop Button */}
              <button
                onClick={onShopClick}
                className="flex-shrink-0 bg-black text-white hover:bg-neutral-800 transition-all text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase px-5 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center space-x-1.5 shadow-xs active:scale-95"
              >
                <span>SHOP</span>
                <ArrowRight size={13} className="ml-0.5" />
              </button>
            </motion.div>

            {/* Small Indicator Dash Below Pill */}
            <div className="flex justify-center mt-3">
              <span className="w-7 h-1 rounded-full bg-neutral-400/70"></span>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
