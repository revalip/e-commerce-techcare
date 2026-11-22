import React from 'react';
import { mockProducts } from '../data/mock';
import Reveal from './Reveal';

/**
 * Apple.com/id Symmetric 50/50 2-Column Alternating Grid (#F5F5F7 and #000000):
 * Matches Apple's clean 12px white gutter, sharp editorial edges, consistent
 * "Selengkapnya" (solid blue) + "Beli" (blue outline) pill CTAs, and transparent PNGs.
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
      orderClass: 'order-1 md:order-1',
      title: 'Laptop Second',
      subtitle: 'Ringan, andal, siap kerja setiap hari.',
      image: '/assets/asus-laptop.png',
      width: 573,
      height: 516,
      onLearn: () => (zenbook && onSelectProduct ? onSelectProduct(zenbook) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('laptop-second') : onShopClick())
    },
    {
      id: 'keyboard',
      dark: true,
      orderClass: 'order-2 md:order-2',
      title: 'Keyboard Mekanikal',
      subtitle: 'Ketikan presisi. Terasa pas di jari.',
      image: '/assets/tile-keyboard-dark.jpg',
      imageZoomClass: 'scale-[1.24] sm:scale-[1.18] hover:scale-[1.28]',
      width: 1024,
      height: 768,
      onLearn: () => (keyboard && onSelectProduct ? onSelectProduct(keyboard) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('peripherals') : onShopClick())
    },
    {
      id: 'mouse',
      dark: true,
      orderClass: 'order-4 md:order-3',
      title: 'Mouse Kerja & Gaming',
      subtitle: 'Kontrol akurat untuk kerja dan desain.',
      image: '/assets/logitech-mouse.png',
      width: 523,
      height: 656,
      onLearn: () => (mxMouse && onSelectProduct ? onSelectProduct(mxMouse) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('peripherals') : onShopClick())
    },
    {
      id: 'monitor',
      dark: false,
      orderClass: 'order-3 md:order-4',
      title: 'Monitor IPS & Ultrawide',
      subtitle: 'Warna akurat. Ruang kerja lebih luas.',
      image: '/assets/gaming-monitor.png',
      width: 724,
      height: 748,
      onLearn: () => (monitor && onSelectProduct ? onSelectProduct(monitor) : onShopClick()),
      onBuy: () => (onSelectCollection ? onSelectCollection('display-monitor') : onShopClick())
    }
  ];

  return (
    <section className="w-full bg-white py-3">
      {/* Apple.com/id exact mobile framing: full-bleed edge-to-edge (px-0) on mobile, 12px white gutter (md:px-3) on desktop */}
      <div className="max-w-[1440px] mx-auto px-0 md:px-3 space-y-3">
        {/* Symmetric 50% : 50% 2-Column Grid matching apple.com/id */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tiles.map((tile, idx) => (
            <Reveal key={tile.id} delay={idx * 0.04} className={tile.orderClass}>
              <div
                className={`h-full overflow-hidden min-h-[500px] sm:min-h-[560px] flex flex-col justify-between text-center pt-12 sm:pt-14 pb-8 px-4 sm:px-6 ${
                  tile.dark ? 'bg-[#000000] text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'
                }`}
              >
                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-[30px] sm:text-[38px] font-semibold tracking-[-0.03em] leading-[1.08]">
                    {tile.title}
                  </h2>
                  <p className={`text-[16px] sm:text-[18px] ${tile.dark ? 'text-[#F5F5F7]/85' : 'text-[#6E6E73]'}`}>
                    {tile.subtitle}
                  </p>
                  <div className="pt-3 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={tile.onLearn}
                      className="min-h-[38px] px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] sm:text-[14px] font-normal transition-colors cursor-pointer"
                    >
                      Selengkapnya
                    </button>
                    <button
                      type="button"
                      onClick={tile.onBuy}
                      className={`min-h-[38px] px-5 rounded-[980px] border border-[#0071E3] text-[13px] sm:text-[14px] font-normal transition-colors cursor-pointer ${
                        tile.dark
                          ? 'text-[#2997FF] hover:bg-[#0071E3] hover:text-white'
                          : 'text-[#0071E3] hover:bg-[#0071E3] hover:text-white'
                      }`}
                    >
                      Beli
                    </button>
                  </div>
                </div>

                <div className="mt-6 h-[250px] sm:h-[300px] flex items-center justify-center overflow-hidden">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    width={tile.width}
                    height={tile.height}
                    loading="lazy"
                    className={`max-h-full max-w-[90%] object-contain select-none transition-transform duration-300 ${
                      tile.imageZoomClass || 'hover:scale-[1.03]'
                    }`}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
