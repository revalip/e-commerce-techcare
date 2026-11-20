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
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.05] text-center">
            Unit unggulan.
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.04}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onExploreAll}
            className="text-sm font-medium text-[#1D2129] hover:text-[#4F627A] transition-colors min-h-[44px]"
          >
            Lihat semua katalog →
          </button>
        </div>
      </div>
    </section>
  );
}
