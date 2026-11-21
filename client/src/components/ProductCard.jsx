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
      className="bg-white rounded-[24px] border border-[#D2D2D7]/60 hover:border-[#D2D2D7] hover:shadow-tc-lift hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full overflow-hidden"
    >
      {/* Seamless Studio Stage (#F5F5F7) */}
      <div
        className={`relative bg-[#F5F5F7] aspect-[4/3] w-full flex items-center justify-center overflow-hidden ${
          isStudioJpg(images[0]) ? 'p-0' : 'p-5'
        }`}
      >
        {/* Top-left Minimal Discount or SKU Pill */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          {!outOfStock && product.diskonPersen > 0 ? (
            <span className="bg-[#1D1D1F] text-white font-mono text-[10px] font-semibold px-2.5 py-0.5 rounded-full tabular-nums">
              -{product.diskonPersen}%
            </span>
          ) : (
            <span className="bg-white/95 text-[#6E6E73] font-mono text-[10px] px-2 py-0.5 rounded-full border border-[#D2D2D7]/60 tabular-nums">
              {skuCode}
            </span>
          )}
        </div>

        {/* Top-right Solid Canvas Circle Wishlist Toggle (Monochrome until clicked) */}
        <button
          type="button"
          onClick={handleToggleHeart}
          aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-[#FFFFFF] border border-[#D2D2D7]/70 hover:border-[#1D1D1F]/30 transition-all cursor-pointer"
        >
          <Heart
            size={15}
            className={
              wishlisted
                ? 'fill-[#0071E3] text-[#0071E3] transition-transform scale-110'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] transition-colors'
            }
          />
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
                : 'max-h-full max-w-[84%] object-contain'
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
                  : 'max-h-full max-w-[84%] object-contain'
              } select-none transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </div>

        {/* Bottom-left Condition Pill */}
        <span className="absolute bottom-3 left-3 z-10 bg-white text-[#1D1D1F] text-[10px] font-medium px-2.5 py-0.5 rounded-full max-w-[85%] truncate shadow-xs">
          {product.kondisi || 'Grade A'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.04em]">
            <span className="text-[#6E6E73] truncate">{product.brand || 'TechCare'}</span>
            {outOfStock ? (
              <span className="text-[#6E6E73] font-semibold shrink-0">Habis</span>
            ) : lowStock ? (
              <span className="text-[#0071E3] font-semibold shrink-0 tabular-nums">
                Sisa {product.stok}
              </span>
            ) : (
              <span className="text-[#6E6E73] shrink-0 tabular-nums">Stok {product.stok}</span>
            )}
          </div>

          <h3 className="font-display font-semibold text-[14px] sm:text-[15px] text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-snug line-clamp-2 min-h-[2.45em]">
            {product.nama}
          </h3>

          <p className="text-[11px] text-[#6E6E73] line-clamp-1">
            {product.specRangeLabel || product.tagline}
          </p>

          {Array.isArray(product.varianWarna) && product.varianWarna.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1" aria-label="Pilihan warna">
              {product.varianWarna.slice(0, 4).map((v) => (
                <span
                  key={v.nama}
                  title={v.nama}
                  className="w-2.5 h-2.5 rounded-full border border-[#D2D2D7] shrink-0"
                  style={{ backgroundColor: v.hex || '#1D1D1F' }}
                />
              ))}
              {product.varianWarna.length > 1 && (
                <span className="text-[10px] text-[#6E6E73] ml-0.5">
                  {product.varianWarna.length} warna
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price + Pill CTA */}
        <div className="pt-3 border-t border-[#F5F5F7] flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="min-w-0">
            {product.hargaCoret && (
              <span className="font-mono text-[10px] text-[#6E6E73] line-through block leading-tight mb-0.5 tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="font-display text-sm sm:text-[15px] font-semibold text-[#1D1D1F] tracking-tight block tabular-nums">
              {formatIDR(product.harga)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full sm:w-9 min-h-[40px] sm:h-9 px-3 sm:px-0 rounded-full flex items-center justify-center gap-1.5 flex-shrink-0 transition-colors text-xs font-medium ${
              outOfStock
                ? 'bg-[#F5F5F7] text-[#6E6E73] cursor-not-allowed'
                : isAdded
                ? 'bg-[#1D1D1F] text-white'
                : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'
            }`}
            aria-label={outOfStock ? `${product.nama} stok habis` : `Tambah ${product.nama} ke keranjang`}
            title={outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          >
            {isAdded ? <Check size={14} strokeWidth={2.4} /> : <Plus size={14} strokeWidth={2.2} />}
            <span className="sm:hidden">
              {outOfStock ? 'Habis' : isAdded ? 'Masuk' : 'Beli'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
