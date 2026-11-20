import React, { useState } from 'react';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Reveal from './Reveal';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';

function WideBentoCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const outOfStock = Number(product.stok) <= 0;
  const skuCode = `TC_${String(product.id).padStart(2, '0')}`;
  const mainImg =
    product.gambar && product.gambar.length > 0
      ? product.gambar[0]
      : '/images/products/thinkpad-x1-carbon-front.jpg';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 950);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="bg-[#FAF9F6] rounded-[2px] border border-[#D6D4CC] hover:border-[#111111] transition-colors cursor-pointer group h-full grid grid-cols-1 sm:grid-cols-12 overflow-hidden"
    >
      {/* Large Specimen Stage */}
      <div
        className={`sm:col-span-6 bg-[#E7E5DE] relative flex items-center justify-center border-b sm:border-b-0 sm:border-r border-[#D6D4CC] min-h-[220px] overflow-hidden ${
          /\.(jpe?g)$/i.test(mainImg || '') ? 'p-0' : 'p-6 sm:p-8'
        }`}
      >
        <span className="absolute top-3 left-3 z-10 font-mono text-[10px] uppercase tracking-[0.08em] text-[#3A3A36] bg-[#F2F1EC]/95 border border-[#D6D4CC] px-2 py-0.5 tabular-nums">
          {skuCode} // UNGGULAN
        </span>

        {!outOfStock && product.diskonPersen > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-[#E63B19] text-white font-mono text-[10px] font-bold px-2 py-0.5 tabular-nums">
            -{product.diskonPersen}%
          </span>
        )}

        <img
          src={mainImg}
          alt={product.nama}
          loading="lazy"
          className={`${
            /\.(jpe?g)$/i.test(mainImg || '')
              ? 'w-full h-full object-cover object-center'
              : 'max-h-52 sm:max-h-60 max-w-[88%] object-contain'
          } group-hover:scale-105 transition-transform duration-300`}
        />
      </div>

      {/* Editorial Spec Column */}
      <div className="sm:col-span-6 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#6E6D68]">
            <span>{product.brand}</span>
            <span className={outOfStock ? 'text-rose-700 font-bold' : 'text-[#111111]'}>
              {outOfStock ? 'HABIS' : `STOK ${String(product.stok).padStart(2, '0')}`}
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-black tracking-[-0.03em] text-[#111111] group-hover:text-[#E63B19] transition-colors leading-tight">
            {product.nama}
          </h3>

          <p className="text-xs text-[#6E6D68] leading-relaxed line-clamp-3">
            {product.qcSummary || product.deskripsi}
          </p>

          <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[10px] uppercase">
            <span className="px-2 py-0.5 bg-[#F2F1EC] border border-[#D6D4CC] text-[#3A3A36]">
              {product.kondisi || 'GRADE A'}
            </span>
            {product.garansi && (
              <span className="px-2 py-0.5 bg-[#F2F1EC] border border-[#D6D4CC] text-[#3A3A36]">
                {product.garansi}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#D6D4CC] flex flex-wrap items-end justify-between gap-3">
          <div>
            {product.hargaCoret && (
              <span className="font-mono text-[10px] text-[#8A8880] line-through block tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="font-mono text-base sm:text-lg font-bold text-[#111111] tabular-nums">
              {formatIDR(product.harga)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`min-h-[44px] px-4 rounded-[2px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] inline-flex items-center gap-1.5 transition-colors ${
              outOfStock
                ? 'bg-[#E7E5DE] text-[#8A8880] cursor-not-allowed'
                : added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#111111] text-[#F2F1EC] hover:bg-[#E63B19]'
            }`}
          >
            {added ? <Check size={14} /> : <Plus size={14} />}
            <span>{outOfStock ? 'Habis' : added ? 'Masuk' : 'Tambah'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BestsellersSection({
  products,
  loading,
  onSelectProduct,
  onExploreAll
}) {
  const featured = products.slice(0, 4);

  return (
    <section className="bg-[#FAF9F6] border-y border-[#D6D4CC] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#111111]">
            <div>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[#E63B19] font-semibold block mb-2">
                [ 02 // UNIT PILIHAN MINGGU INI ]
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-[-0.04em] text-[#111111] leading-[0.96]">
                UNIT UNGGULAN
              </h2>
            </div>

            <button
              type="button"
              onClick={onExploreAll}
              className="tc-btn-secondary self-start sm:self-auto"
            >
              <span>Semua Katalog</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          /* Asymmetric Bento Grid (Desktop: 7+5 then 5+7; Mobile: Hero 1 full-width + crisp grid) */
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
            {featured.map((product, idx) => {
              const isWide = idx === 0 || idx === 3;
              return (
                <Reveal
                  key={product.id}
                  delay={idx * 0.05}
                  className={
                    idx === 0
                      ? 'col-span-2 lg:col-span-7'
                      : idx === 3
                      ? 'col-span-2 lg:col-span-7'
                      : 'col-span-1 lg:col-span-5'
                  }
                >
                  {isWide ? (
                    <WideBentoCard product={product} onSelect={onSelectProduct} />
                  ) : (
                    <ProductCard product={product} onSelect={onSelectProduct} />
                  )}
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
