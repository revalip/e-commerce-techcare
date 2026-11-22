import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/**
 * Clean Apple-Style Product Card (v2):
 * - #F5F5F7 background, 28px radius, ZERO border and ZERO shadow
 * - Centered transparent PNG with uniform height (scales 1.04 on hover)
 * - Small heart icon in corner WITHOUT a big white circle
 * - Only: optional small blue "Hemat X%", optional soft red #B64400 "Sisa N" (only if <= 3),
 *   title (600, 17px), 1-line grey spec, bold price + small grey strikethrough beside it,
 *   and blue pill "Beli" button.
 */
export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const stockNum = Number(product.stok) || 0;
  const outOfStock = stockNum <= 0;
  const lowStock = !outOfStock && stockNum <= 3;

  const images =
    product.gambar && product.gambar.length > 0
      ? product.gambar
      : ['/assets/products/thinkpad-x1-carbon-front.png'];

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
      onClick={() => onSelect(product)}
      className="relative bg-[#F5F5F7] rounded-[28px] p-5 sm:p-6 flex flex-col justify-between group cursor-pointer h-full transition-colors duration-300"
    >
      {/* Small Heart Icon in Top-Right Corner (No big white circle) */}
      <button
        type="button"
        onClick={handleToggleHeart}
        aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
      >
        <Heart
          size={18}
          strokeWidth={1.7}
          className={wishlisted ? 'fill-[#FF3B30] text-[#FF3B30]' : ''}
        />
      </button>

      {/* Uniform-Height Transparent PNG Product Stage */}
      <div className="h-44 sm:h-52 w-full flex items-center justify-center px-2 pt-2 pb-4 overflow-hidden">
        <img
          src={images[0]}
          alt={product.nama}
          width={480}
          height={360}
          loading="lazy"
          className="max-h-full max-w-[88%] object-contain select-none transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>

      {/* Clean Minimal Info */}
      <div className="flex-1 flex flex-col justify-between gap-4 pt-2">
        <div className="space-y-1">
          {/* Small blue savings / soft red low-stock (<= 3 only) */}
          {(product.diskonPersen > 0 || lowStock || outOfStock) && (
            <div className="flex items-center gap-2.5 text-[12px] font-medium min-h-[18px]">
              {!outOfStock && product.diskonPersen > 0 && (
                <span className="text-[#D70015]">Hemat {product.diskonPersen}%</span>
              )}
              {outOfStock ? (
                <span className="text-[#6E6E73]">Stok habis</span>
              ) : lowStock ? (
                <span className="text-[#B64400]">Sisa {stockNum}</span>
              ) : null}
            </div>
          )}

          <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F] leading-[1.25] line-clamp-2 min-h-[2.5em]">
            {product.nama}
          </h3>

          <p className="text-[13px] text-[#6E6E73] line-clamp-1">
            {product.specRangeLabel || product.tagline}
          </p>
        </div>

        {/* Price Row + Blue Pill "Beli" */}
        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="text-[16px] font-semibold text-[#1D1D1F] tabular-nums">
              {formatIDR(product.harga)}
            </span>
            {product.hargaCoret && (
              <span className="text-[12px] text-[#6E6E73] line-through tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`shrink-0 min-h-[36px] px-4 rounded-[980px] text-[13px] font-normal inline-flex items-center justify-center gap-1 transition-colors duration-300 ${
              outOfStock
                ? 'bg-[#E5E5EA] text-[#6E6E73] cursor-not-allowed'
                : isAdded
                ? 'bg-[#1D1D1F] text-white'
                : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
            }`}
            aria-label={outOfStock ? `${product.nama} stok habis` : `Beli ${product.nama}`}
          >
            {isAdded ? (
              <>
                <Check size={13} strokeWidth={2.2} />
                <span>Masuk</span>
              </>
            ) : (
              <span>{outOfStock ? 'Habis' : 'Beli'}</span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
