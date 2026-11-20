import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Heart, Star, ArrowUpRight } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const outOfStock = Number(product.stok) <= 0;
  const lowStock = !outOfStock && Number(product.stok) <= 5;
  const images = product.gambar && product.gambar.length > 0
    ? product.gambar
    : ['/images/products/thinkpad-x1-carbon-front.jpg'];
  const hasSecondAngle = images.length > 1 && images[1] !== images[0];

  const handleAdd = (e) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);
  };

  const handleToggleHeart = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCardClick = () => {
    setIsClicking(true);
    setTimeout(() => {
      onSelect(product);
      setIsClicking(false);
    }, 150);
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      animate={isClicking ? { scale: 0.96, opacity: 0.9 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between border border-neutral-200/70 hover:border-neutral-900 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)] transition-all duration-300 group relative cursor-pointer"
    >
      {/* Top Studio Image Stage (AERO STEP + adidas.co.id clean gray stage) */}
      <div className="relative bg-[#f4f4f5] aspect-[4/3] w-full flex items-center justify-center p-5 sm:p-6 overflow-hidden">
        {/* Top Left: Condition / Discount / Stock Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1">
          {outOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
              Stok Habis
            </span>
          ) : (
            product.diskonPersen > 0 && (
              <span className="bg-neutral-900 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                -{product.diskonPersen}%
              </span>
            )
          )}
          <span className="bg-white/95 backdrop-blur-xs text-neutral-800 text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-neutral-200/80">
            {lowStock ? `Sisa ${product.stok} Unit` : product.kondisi || 'Second Grade A'}
          </span>
        </div>

        {/* Top Right: Favorite / Wishlist Heart Button */}
        <motion.button
          whileTap={{ scale: 0.78 }}
          animate={wishlisted ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.28 }}
          onClick={handleToggleHeart}
          aria-label={wishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
            wishlisted
              ? 'bg-neutral-900 text-white'
              : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-black border border-neutral-200/80'
          }`}
        >
          <Heart
            size={15}
            className={wishlisted ? 'fill-white text-white' : ''}
            strokeWidth={2}
          />
        </motion.button>

        {/* Product Image with Hover 2nd-Angle Swap & Smooth Zoom */}
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.img
            src={images[0]}
            alt={product.nama}
            animate={{
              scale: isHovered ? 1.07 : 1,
              opacity: isHovered && hasSecondAngle ? 0 : 1
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-full max-w-[88%] object-contain drop-shadow-sm select-none"
          />

          {hasSecondAngle && (
            <motion.img
              src={images[1]}
              alt={`${product.nama} sudut lain`}
              initial={{ opacity: 0 }}
              animate={{
                scale: isHovered ? 1.07 : 1.01,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 m-auto max-h-full max-w-[88%] object-contain drop-shadow-sm select-none"
            />
          )}
        </div>

        {/* Adidas-style subtle bottom hover quick-view pill */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none"
            >
              <span className="bg-white/95 backdrop-blur-md text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1">
                <span>Pilih Spec & Detail</span>
                <ArrowUpRight size={11} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Clean Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <span>{product.brand || 'TECHCARE'}</span>
            <span className="inline-flex items-center gap-0.5 text-neutral-700 font-semibold">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {product.rating || '4.9'}
            </span>
          </div>

          <h3 className="font-semibold text-sm sm:text-[15px] text-neutral-900 group-hover:text-black leading-snug line-clamp-1">
            {product.nama}
          </h3>

          <p className="text-[11px] text-neutral-500 line-clamp-1">
            {product.specRangeLabel || product.tagline}
          </p>
        </div>

        {/* Price Row + Quick Add */}
        <div className="pt-2 border-t border-neutral-100 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {product.hargaCoret && (
              <span className="text-[10px] text-neutral-400 line-through block leading-none mb-0.5">
                {formatIDR(product.hargaCoret)}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight block truncate">
              {formatIDR(product.harga)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: outOfStock ? 1 : 0.86 }}
            onClick={handleAdd}
            disabled={outOfStock}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              outOfStock
                ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 group-hover:bg-black text-neutral-800 group-hover:text-white'
            }`}
            aria-label={outOfStock ? `${product.nama} stok habis` : `Tambah ${product.nama} ke keranjang`}
            title={outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          >
            {isAdded ? <Check size={14} strokeWidth={2.5} /> : <Plus size={15} />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
