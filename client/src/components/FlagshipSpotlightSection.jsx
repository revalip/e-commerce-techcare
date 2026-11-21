import React from 'react';
import { ChevronRight } from 'lucide-react';
import { mockProducts } from '../data/mock';
import Reveal from './Reveal';

/**
 * Apple.com/id Alternating Category Tiles (#F5F5F7 and #000000):
 * Laptop Second, Keyboard, Mouse, Monitor, Headset.
 * One tile = one clear message, transparent PNG product floating cleanly without boxes or borders.
 */
export default function FlagshipSpotlightSection({ onSelectProduct, onSelectCollection, onShopClick }) {
  const zenbook = mockProducts[2]; // ASUS ZenBook 14 OLED
  const monitor = mockProducts[7]; // LG UltraGear 27" IPS
  const mxMouse = mockProducts[8]; // Logitech MX Master 3S
  const keyboard = mockProducts[10]; // Fantech MAXFIT81 Frost

  const tiles = [
    {
      id: 'laptop-second',
      dark: false,
      span: 'md:col-span-7',
      title: 'Laptop Second',
      subtitle: 'Tipis, hening, dan lolos 32 titik pengecekan.',
      image: '/assets/asus-laptop.png',
      width: 573,
      height: 516,
      onLearn: () => (zenbook && onSelectProduct ? onSelectProduct(zenbook) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('laptop-second') : onShopClick())
    },
    {
      id: 'keyboard',
      dark: true,
      span: 'md:col-span-5',
      title: 'Keyboard Mekanikal',
      subtitle: 'Keycaps bersih ultrasonic. Hot-swap responsif.',
      image: '/assets/mechanical-keyboard.png',
      width: 1000,
      height: 571,
      onLearn: () => (keyboard && onSelectProduct ? onSelectProduct(keyboard) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('peripherals') : onShopClick())
    },
    {
      id: 'mouse',
      dark: true,
      span: 'md:col-span-5',
      title: 'Mouse Kerja & Gaming',
      subtitle: 'Sensor presisi. Klik bebas double-click.',
      image: '/assets/logitech-mouse.png',
      width: 523,
      height: 656,
      onLearn: () => (mxMouse && onSelectProduct ? onSelectProduct(mxMouse) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('peripherals') : onShopClick())
    },
    {
      id: 'monitor',
      dark: false,
      span: 'md:col-span-7',
      title: 'Monitor IPS & Ultrawide',
      subtitle: 'Layar tajam 144Hz. Nol dead pixel.',
      image: '/assets/gaming-monitor.png',
      width: 724,
      height: 748,
      onLearn: () => (monitor && onSelectProduct ? onSelectProduct(monitor) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('display-monitor') : onShopClick())
    }
  ];

  return (
    <section className="w-full bg-white py-3">
      <div className="max-w-[1440px] mx-auto px-3 space-y-3">
        {/* Alternating 2-Column Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {tiles.map((tile, idx) => (
            <Reveal key={tile.id} delay={idx * 0.05} className={tile.span}>
              <div
                className={`h-full rounded-[28px] overflow-hidden min-h-[460px] sm:min-h-[540px] flex flex-col justify-between text-center pt-12 sm:pt-14 pb-8 px-6 ${
                  tile.dark ? 'bg-[#000000] text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'
                }`}
              >
                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-[28px] sm:text-[38px] font-semibold tracking-[-0.03em] leading-[1.08]">
                    {tile.title}
                  </h2>
                  <p className={`text-[15px] sm:text-[18px] ${tile.dark ? 'text-[#A1A1A6]' : 'text-[#6E6E73]'}`}>
                    {tile.subtitle}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={tile.onLearn}
                      className={`inline-flex items-center gap-0.5 min-h-[40px] text-[15px] hover:underline ${
                        tile.dark ? 'text-[#2997FF]' : 'text-[#0071E3]'
                      }`}
                    >
                      <span>Selengkapnya</span>
                      <ChevronRight size={16} strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={tile.onBuy}
                      className={`inline-flex items-center gap-0.5 min-h-[40px] text-[15px] hover:underline ${
                        tile.dark ? 'text-[#2997FF]' : 'text-[#0071E3]'
                      }`}
                    >
                      <span>Beli</span>
                      <ChevronRight size={16} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>

                <div className="mt-8 h-[220px] sm:h-[260px] flex items-center justify-center">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    width={tile.width}
                    height={tile.height}
                    loading="lazy"
                    className="max-h-full max-w-[85%] object-contain transition-transform duration-300 hover:scale-[1.04]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 5th Category Tile (Full-Width #F5F5F7): Headset & Audio */}
        <Reveal>
          <div className="rounded-[28px] bg-[#F5F5F7] text-[#1D1D1F] py-14 sm:py-20 px-6 text-center overflow-hidden">
            <div className="max-w-lg mx-auto space-y-2">
              <h2 className="text-[28px] sm:text-[42px] font-semibold tracking-[-0.03em] leading-[1.08]">
                Headset &amp; Aksesori Kerja
              </h2>
              <p className="text-[16px] sm:text-[19px] text-[#6E6E73]">
                Audio jernih untuk rapat, belajar, dan fokus seharian.
              </p>
              <div className="pt-2 flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => (onSelectCollection ? onSelectCollection('peripherals') : onShopClick())}
                  className="inline-flex items-center gap-0.5 min-h-[40px] text-[16px] text-[#0071E3] hover:underline"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight size={16} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => (onSelectCollection ? onSelectCollection('peripherals') : onShopClick())}
                  className="inline-flex items-center gap-0.5 min-h-[40px] text-[16px] text-[#0071E3] hover:underline"
                >
                  <span>Beli</span>
                  <ChevronRight size={16} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="mt-8 h-[210px] sm:h-[260px] flex items-center justify-center">
              <img
                src="/assets/studio-headset.png"
                alt="Headset & Aksesori Kerja TechCare"
                width={666}
                height={1000}
                loading="lazy"
                className="max-h-full max-w-[75%] object-contain transition-transform duration-300 hover:scale-[1.04]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
