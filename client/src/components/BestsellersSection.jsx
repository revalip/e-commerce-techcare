import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import Reveal from './Reveal';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';

function WideStudioBentoCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const outOfStock = Number(product.stok) <= 0;
  const skuCode = `TC_${String(product.id).padStart(2, '0')}`;
  const mainImg =
    product.gambar && product.gambar.length > 0
      ? product.gambar[0]
      : '/images/products/thinkpad-x1-carbon-front.jpg';
  const isJpg = /\.(jpe?g)$/i.test(mainImg || '');

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 950);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24 }}
      onClick={() => onSelect(product)}
      className="bg-white rounded-[24px] border border-[#E2E7EE] hover:border-[#B8C4D2] hover:shadow-tc-lift transition-all cursor-pointer group h-full grid grid-cols-1 sm:grid-cols-12 overflow-hidden"
    >
      {/* Large Studio Visual Stage */}
      <div
        className={`sm:col-span-6 bg-[#ECEFF4] relative flex items-center justify-center min-h-[220px] overflow-hidden ${
          isJpg ? 'p-0' : 'p-6 sm:p-8'
        }`}
      >
        <span className="absolute top-3.5 left-3.5 z-10 font-mono text-[10px] uppercase tracking-[0.06em] text-[#4F627A] bg-white/95 border border-[#E2E7EE] px-2.5 py-1 rounded-full tabular-nums">
          {skuCode} • Unggulan
        </span>

        {!outOfStock && product.diskonPersen > 0 && (
          <span className="absolute top-3.5 right-3.5 z-10 bg-[#1D2129] text-white font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full tabular-nums">
            -{product.diskonPersen}%
          </span>
        )}

        <img
          src={mainImg}
          alt={product.nama}
          loading="lazy"
          className={`${
            isJpg
              ? 'w-full h-full object-cover object-center'
              : 'max-h-52 sm:max-h-60 max-w-[86%] object-contain drop-shadow-md'
          } group-hover:scale-105 transition-transform duration-500`}
        />
      </div>

      {/* Studio Copy & Spec Column */}
      <div className="sm:col-span-6 p-5 sm:p-7 flex flex-col justify-between gap-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.06em] text-[#8692A3]">
            <span>{product.brand}</span>
            <span className={outOfStock ? 'text-rose-600 font-semibold' : 'text-[#4F627A]'}>
              {outOfStock ? 'Stok Habis' : `Stok ${product.stok}`}
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-medium tracking-[-0.035em] text-[#1D2129] leading-snug">
            {product.nama}
          </h3>

          <p className="text-xs text-[#647082] leading-relaxed line-clamp-3">
            {product.qcSummary || product.deskripsi}
          </p>

          <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-[#4F627A]">
            <span className="px-2.5 py-1 rounded-full bg-[#F7F8FA] border border-[#E2E7EE]">
              {product.kondisi || 'Grade A'}
            </span>
            {product.garansi && (
              <span className="px-2.5 py-1 rounded-full bg-[#F7F8FA] border border-[#E2E7EE]">
                {product.garansi}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[#ECEFF4] flex flex-wrap items-end justify-between gap-3">
          <div>
            {product.hargaCoret && (
              <span className="font-mono text-[11px] text-[#8692A3] line-through block tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="font-display text-lg sm:text-xl font-semibold text-[#1D2129] tabular-nums">
              {formatIDR(product.harga)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`min-h-[44px] px-5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
              outOfStock
                ? 'bg-[#ECEFF4] text-[#8692A3] cursor-not-allowed'
                : added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#1D2129] text-white hover:bg-[#323846]'
            }`}
          >
            {added ? <Check size={14} /> : <Plus size={14} />}
            <span>{outOfStock ? 'Habis' : added ? 'Masuk' : 'Tambah'}</span>
          </button>
        </div>
      </div>
    </motion.article>
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
    <section className="bg-[#F7F8FA] py-16 sm:py-24 border-b border-[#E2E7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#647082] block">
                02 / Pilihan Minggu Ini
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-[-0.04em] text-[#1D2129] leading-[1.02]">
                Unit unggulan.
              </h2>
            </div>

            <button
              type="button"
              onClick={onExploreAll}
              className="tc-btn-secondary self-start sm:self-auto"
            >
              <span>Lihat Semua Katalog</span>
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
          /* Asymmetric 7+5 then 5+7 Studio Bento Grid */
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-5">
            {featured.map((product, idx) => {
              const isWide = idx === 0 || idx === 3;
              return (
                <Reveal
                  key={product.id}
                  delay={idx * 0.05}
                  className={
                    idx === 0 || idx === 3
                      ? 'col-span-2 lg:col-span-7'
                      : 'col-span-1 lg:col-span-5'
                  }
                >
                  {isWide ? (
                    <WideStudioBentoCard product={product} onSelect={onSelectProduct} />
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
