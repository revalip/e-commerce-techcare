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
      className="bg-[#FAF9F6] rounded-[2px] border border-[#D6D4CC] hover:border-[#111111] transition-colors duration-200 flex flex-col justify-between group cursor-pointer h-full overflow-hidden"
    >
      {/* Top Technical SKU & Stock Bar (Monolith DNA) */}
      <div className="px-2.5 sm:px-3 py-1.5 border-b border-[#D6D4CC] flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.06em]">
        <span className="text-[#6E6D68] font-medium tabular-nums">{skuCode}</span>
        {outOfStock ? (
          <span className="text-rose-700 font-bold">HABIS</span>
        ) : lowStock ? (
          <span className="text-[#E63B19] font-bold tabular-nums">SISA {product.stok}</span>
        ) : (
          <span className="text-[#6E6D68] tabular-nums">
            STOK {String(product.stok).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Matte Stone Hardware Specimen Stage */}
      <div
        className={`relative bg-[#E7E5DE] aspect-[4/3] w-full flex items-center justify-center overflow-hidden border-b border-[#D6D4CC] ${
          isStudioJpg(images[0]) ? 'p-0' : 'p-4 sm:p-5'
        }`}
      >
        {/* Sharp Signal Discount Badge */}
        {!outOfStock && product.diskonPersen > 0 && (
          <span className="absolute top-2 left-2 z-20 bg-[#E63B19] text-white font-mono text-[10px] font-bold px-1.5 py-0.5 tabular-nums">
            -{product.diskonPersen}%
          </span>
        )}

        {/* Minimal Square Wishlist Toggle */}
        <button
          type="button"
          onClick={handleToggleHeart}
          aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className={`absolute top-2 right-2 z-20 w-9 h-9 rounded-[2px] flex items-center justify-center border transition-colors ${
            wishlisted
              ? 'bg-[#111111] text-[#E63B19] border-[#111111]'
              : 'bg-[#F2F1EC]/90 text-[#111111] border-[#D6D4CC] hover:border-[#111111]'
          }`}
        >
          <Heart size={14} className={wishlisted ? 'fill-[#E63B19]' : ''} />
        </button>

        {/* Product Image (Full-bleed for studio JPGs, centered cutout for transparent PNG/WebP) */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[0]}
            alt={product.nama}
            loading="lazy"
            className={`${
              isStudioJpg(images[0])
                ? 'w-full h-full object-cover object-center'
                : 'max-h-full max-w-[88%] object-contain'
            } select-none transition-all duration-300 ${
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
                  : 'max-h-full max-w-[88%] object-contain'
              } select-none transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </div>

        {/* Bottom-left Honest Condition Tag */}
        <span className="absolute bottom-2 left-2 z-10 bg-[#F2F1EC]/95 text-[#3A3A36] border border-[#D6D4CC] font-mono text-[9px] uppercase tracking-[0.04em] px-1.5 py-0.5 max-w-[86%] truncate">
          {product.kondisi || 'GRADE A'}
        </span>
      </div>

      {/* Card Body — Honest Specs, Zero Fake Ratings */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6E6D68] truncate">
              {product.brand || 'TECHCARE'}
            </span>
          </div>

          <h3 className="font-display font-bold text-[13px] sm:text-[15px] text-[#111111] group-hover:text-[#E63B19] transition-colors leading-snug line-clamp-2 min-h-[2.45em]">
            {product.nama}
          </h3>

          <p className="font-mono text-[10px] text-[#6E6D68] line-clamp-1">
            {product.specRangeLabel || product.tagline}
          </p>
        </div>

        {/* Price + Sharp CTA (stacks on narrow mobile cards, inline on sm+) */}
        <div className="pt-2.5 border-t border-[#D6D4CC]/80 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="min-w-0">
            {product.hargaCoret && (
              <span className="font-mono text-[10px] text-[#8A8880] line-through block leading-tight mb-0.5 tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="font-mono text-[13px] sm:text-sm font-bold text-[#111111] tracking-tight block tabular-nums">
              {formatIDR(product.harga)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full sm:w-11 min-h-[44px] sm:h-11 px-3 sm:px-0 rounded-[2px] flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${
              outOfStock
                ? 'bg-[#E7E5DE] text-[#8A8880] cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#111111] text-[#F2F1EC] hover:bg-[#E63B19]'
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
