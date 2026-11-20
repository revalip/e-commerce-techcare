import React, { useState } from 'react';
import { Plus, Check, Heart } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = Number(product.stok) <= 0;
  const lowStock = !outOfStock && Number(product.stok) <= 5;
  const skuCode = `TC_${String(product.id).padStart(2, '0')}`;

  const images =
    product.gambar && product.gambar.length > 0
      ? product.gambar
      : ['/images/products/thinkpad-x1-carbon-front.jpg'];
  const hasSecondAngle = images.length > 1 && images[1] !== images[0];
  const isStudioJpg = (src) => /\.(jpe?g)$/i.test(src || '');

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 950);
  };

  const handleToggleHeart = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(product)}
      className="bg-white rounded-[20px] border border-[#E2E7EE] hover:border-[#B8C4D2] hover:shadow-tc-lift hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full overflow-hidden"
    >
      {/* Seamless Studio Hardware Stage */}
      <div
        className={`relative bg-[#ECEFF4] aspect-[4/3] w-full flex items-center justify-center overflow-hidden ${
          isStudioJpg(images[0]) ? 'p-0' : 'p-4 sm:p-5'
        }`}
      >
        {/* Top-left SKU or Discount Pill */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
          {!outOfStock && product.diskonPersen > 0 ? (
            <span className="bg-[#1D2129] text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums">
              -{product.diskonPersen}%
            </span>
          ) : (
            <span className="bg-white/90 text-[#4F627A] font-mono text-[10px] px-2 py-0.5 rounded-full border border-[#E2E7EE] tabular-nums">
              {skuCode}
            </span>
          )}
        </div>

        {/* Top-right Circular Wishlist Toggle */}
        <button
          type="button"
          onClick={handleToggleHeart}
          aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className={`absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
            wishlisted
              ? 'bg-[#1D2129] text-white border-[#1D2129]'
              : 'bg-white/90 text-[#4F627A] border-[#E2E7EE] hover:border-[#1D2129] hover:text-[#1D2129]'
          }`}
        >
          <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[0]}
            alt={product.nama}
            loading="lazy"
            className={`${
              isStudioJpg(images[0])
                ? 'w-full h-full object-cover object-center'
                : 'max-h-full max-w-[86%] object-contain drop-shadow-sm'
            } select-none transition-all duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${isHovered && hasSecondAngle ? 'opacity-0' : 'opacity-100'}`}
          />
          {hasSecondAngle && (
            <img
              src={images[1]}
              alt={`${product.nama} tampak lain`}
              loading="lazy"
              className={`absolute inset-0 m-auto ${
                isStudioJpg(images[1])
                  ? 'w-full h-full object-cover object-center'
                  : 'max-h-full max-w-[86%] object-contain drop-shadow-sm'
              } select-none transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </div>

        {/* Bottom-left Honest Condition Tag */}
        <span className="absolute bottom-2.5 left-2.5 z-10 bg-white text-[#1D2129] border border-[#E2E7EE] text-[10px] font-medium px-2.5 py-0.5 rounded-full max-w-[86%] truncate shadow-xs">
          {product.kondisi || 'Grade A'}
        </span>
      </div>

      {/* Card Body — Honest Specs, Zero Fake Ratings */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.05em]">
            <span className="text-[#647082] truncate">{product.brand || 'TechCare'}</span>
            {outOfStock ? (
              <span className="text-rose-600 font-semibold shrink-0">Habis</span>
            ) : lowStock ? (
              <span className="text-[#1D2129] font-semibold shrink-0 tabular-nums">
                Sisa {product.stok}
              </span>
            ) : (
              <span className="text-[#8692A3] shrink-0 tabular-nums">Stok {product.stok}</span>
            )}
          </div>

          <h3 className="font-display font-medium text-[13px] sm:text-[15px] text-[#1D2129] group-hover:text-[#4F627A] transition-colors leading-snug line-clamp-2 min-h-[2.45em]">
            {product.nama}
          </h3>

          <p className="text-[11px] text-[#8692A3] line-clamp-1">
            {product.specRangeLabel || product.tagline}
          </p>
        </div>

        {/* Price + Pill CTA (stacks cleanly on narrow 360px 2-col cards, row on sm+) */}
        <div className="pt-2.5 border-t border-[#ECEFF4] flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="min-w-0">
            {product.hargaCoret && (
              <span className="font-mono text-[10px] text-[#8692A3] line-through block leading-tight mb-0.5 tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="font-display text-sm sm:text-[15px] font-semibold text-[#1D2129] tracking-tight block tabular-nums">
              {formatIDR(product.harga)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full sm:w-10 min-h-[42px] sm:h-10 px-3 sm:px-0 rounded-full flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors text-xs font-medium ${
              outOfStock
                ? 'bg-[#ECEFF4] text-[#8692A3] cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#1D2129] text-white hover:bg-[#323846]'
            }`}
            aria-label={outOfStock ? `${product.nama} stok habis` : `Tambah ${product.nama} ke keranjang`}
            title={outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          >
            {isAdded ? <Check size={15} strokeWidth={2.4} /> : <Plus size={15} strokeWidth={2.2} />}
            <span className="sm:hidden">
              {outOfStock ? 'Habis' : isAdded ? 'Masuk' : 'Tambah'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
