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
    <section className="bg-[#f5f5f7] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row matching visual design */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-neutral-500 block mb-1">
                SHOP BY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Bestsellers
              </h2>
            </div>

            <button
              onClick={onExploreAll}
              className="self-start sm:self-auto bg-black text-white hover:bg-neutral-800 transition-all text-[11px] font-semibold tracking-[0.16em] uppercase px-6 py-3 rounded-full flex items-center space-x-2 active:scale-95 shadow-xs"
            >
              <span>EXPLORE ALL</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </Reveal>

        {/* 4 Rounded Cards Grid with 80ms Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 4).map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.08}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
        </div>

      </div>
    </section>
  );
}
