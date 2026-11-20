import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
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
    <section className="bg-white border-y border-slate-200/80 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 sm:mb-9 gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#F97316] mb-1">
                <Flame size={13} />
                <span>PRODUK UNGGULAN &amp; TERLARIS</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1220]">
                Pilihan Terbaik Minggu Ini
              </h2>
            </div>

            <button
              onClick={onExploreAll}
              className="tc-btn-secondary self-start sm:self-auto"
            >
              <span>Lihat Semua Katalog</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 4).map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.05}>
                  <ProductCard product={product} onSelect={onSelectProduct} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  );
}
