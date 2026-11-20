import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Reveal from './Reveal';

export default function BestsellersSection({
  products,
  loading,
  onSelectProduct,
  onExploreAll
}) {
  return (
    <section className="bg-[#f9f9f8] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-neutral-400 block mb-1">
                UNIT TERLARIS &lt; RP 10 JUTA
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 tracking-tight">
                Best Sellers Second & RAM
              </h2>
            </div>

            <button
              onClick={onExploreAll}
              className="self-start sm:self-auto bg-white hover:bg-black hover:text-white text-neutral-900 border border-neutral-300 hover:border-black transition-all text-[11px] font-bold tracking-[0.14em] uppercase px-5 py-2.5 rounded-full flex items-center space-x-1.5 active:scale-95"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 4).map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.06}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
