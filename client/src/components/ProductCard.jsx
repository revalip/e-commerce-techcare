import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Heart, Star } from 'lucide-react';
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
  const images =
    product.gambar && product.gambar.length > 0
      ? product.gambar
      : ['/images/products/thinkpad-x1-carbon-front.jpg'];
  const hasSecondAngle = images.length > 1 && images[1] !== images[0];

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
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/90 hover:border-[#0B5FFF] shadow-tc-card hover:shadow-tc-hover transition-all duration-200 group cursor-pointer h-full"
    >
      {/* Hardware Image Stage */}
      <div className="relative bg-gradient-to-b from-[#F1F5F9] to-[#E8EEF6] aspect-[4/3] w-full flex items-center justify-center p-4 sm:p-5 overflow-hidden">
        {/* Top-left Discount / Stock Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1">
          {outOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-lg shadow-xs">
              Stok Habis
            </span>
          ) : (
            product.diskonPersen > 0 && (
              <span className="bg-[#F97316] text-white text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-lg shadow-xs tabular-nums">
                -{product.diskonPersen}%
              </span>
            )
          )}
          {lowStock && (
            <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-lg">
              Sisa {product.stok} unit
            </span>
          )}
        </div>

        {/* Top-right Wishlist Button (min 40px touch target) */}
        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={handleToggleHeart}
          aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className={`absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-xs ${
            wishlisted
              ? 'bg-[#FFF7ED] text-[#F97316] border border-[#FDBA74]'
              : 'bg-white/90 hover:bg-white text-slate-500 hover:text-[#F97316] border border-slate-200/80'
          }`}
        >
          <Heart size={15} className={wishlisted ? 'fill-[#F97316]' : ''} />
        </motion.button>

        {/* Product Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={images[0]}
            alt={product.nama}
            loading="lazy"
            className={`max-h-full max-w-[88%] object-contain drop-shadow-sm select-none transition-all duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${isHovered && hasSecondAngle ? 'opacity-0' : 'opacity-100'}`}
          />
          {hasSecondAngle && (
            <img
              src={images[1]}
              alt={`${product.nama} tampak lain`}
              loading="lazy"
              className={`absolute inset-0 m-auto max-h-full max-w-[88%] object-contain drop-shadow-sm select-none transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </div>

        {/* Bottom-left Condition Pill */}
        <span className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-slate-200/70 max-w-[85%] truncate">
          {product.kondisi || 'Second Grade A'}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5FFF] bg-[#EEF4FF] px-2 py-0.5 rounded-md truncate">
              {product.brand || 'TECHCARE'}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-slate-700 shrink-0 tabular-nums">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {product.rating || '4.9'}
            </span>
          </div>

          <h3 className="font-display font-bold text-xs sm:text-[15px] text-slate-900 group-hover:text-[#0B5FFF] transition-colors leading-snug line-clamp-2 min-h-[2.4em]">
            {product.nama}
          </h3>

          <p className="text-[11px] text-slate-500 line-clamp-1">
            {product.specRangeLabel || product.tagline}
          </p>
        </div>

        {/* Price + Quick Add (stacks cleanly on narrow 360px 2-col cards, row on sm+) */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="min-w-0">
            {product.hargaCoret && (
              <span className="text-[10px] text-slate-400 line-through block leading-tight mb-0.5 tabular-nums">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="font-display text-sm sm:text-base font-bold text-[#0B1220] tracking-tight block tabular-nums">
              {formatIDR(product.harga)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: outOfStock ? 1 : 0.94 }}
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-full sm:w-11 min-h-[40px] sm:h-11 px-3 sm:px-0 rounded-xl flex items-center justify-center gap-1.5 flex-shrink-0 transition-all text-xs font-bold ${
              outOfStock
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#EEF4FF] text-[#0B5FFF] group-hover:bg-[#0B5FFF] group-hover:text-white border border-[#C7DCFF]'
            }`}
            aria-label={outOfStock ? `${product.nama} stok habis` : `Tambah ${product.nama} ke keranjang`}
            title={outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          >
            {isAdded ? <Check size={15} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.3} />}
            <span className="sm:hidden">{outOfStock ? 'Habis' : isAdded ? 'Masuk!' : 'Keranjang'}</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
