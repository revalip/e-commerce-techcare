import React from 'react';
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
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8692A3]">
              Paling Banyak Dicari
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-medium tracking-[-0.03em] text-[#1D2129] leading-tight mt-1">
              Unit unggulan.
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="text-xs sm:text-sm font-medium text-[#1D2129] hover:text-[#4F627A] transition-colors min-h-[40px] shrink-0 cursor-pointer"
          >
            Semua →
          </button>
        </div>

        {/* Horizontal Swipe Carousel on Mobile, 4-Col Grid on Desktop */}
        <div className="mt-7 sm:mt-10 flex lg:grid lg:grid-cols-4 gap-3.5 sm:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-3 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[72vw] max-w-[260px] lg:w-auto shrink-0 snap-start">
                  <ProductCardSkeleton />
                </div>
              ))
            : featured.map((product, idx) => (
                <Reveal
                  key={product.id}
                  delay={idx * 0.04}
                  className="w-[72vw] max-w-[260px] lg:w-auto shrink-0 snap-start"
                >
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
