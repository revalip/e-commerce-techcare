import React from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Reveal from './Reveal';

export default function BestsellersSection({
  products,
  loading,
  onSelectProduct,
  onExploreAll
}) {
  const featured = products.slice(0, 4);

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#6E6E73]">
              Pilihan Populer
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1D1D1F] leading-tight mt-1">
              Siap dikirim hari ini.
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-0.5 text-xs sm:text-sm font-medium text-[#0071E3] hover:underline transition-colors min-h-[40px] shrink-0 cursor-pointer"
          >
            <span>Lihat semua</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Horizontal Swipe Carousel on Mobile, 4-Col Grid on Desktop */}
        <div className="mt-8 sm:mt-10 flex lg:grid lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-3 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[74vw] max-w-[265px] lg:w-auto shrink-0 snap-start">
                  <ProductCardSkeleton />
                </div>
              ))
            : featured.map((product, idx) => (
                <Reveal
                  key={product.id}
                  delay={idx * 0.04}
                  className="w-[74vw] max-w-[265px] lg:w-auto shrink-0 snap-start"
                >
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
