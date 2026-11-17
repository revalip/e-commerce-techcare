import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { formatIDR } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelect }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-4xl p-6 sm:p-7 flex flex-col justify-between items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300 group relative cursor-pointer"
      onClick={() => onSelect(product)}
    >
      {/* Brand & Discount Pills */}
      <div className="w-full flex items-center justify-between text-[9px] font-bold tracking-wider uppercase mb-1">
        <span className="text-neutral-400">
          {product.brand || 'TECHCARE'}
        </span>
        {product.diskonPersen && (
          <span className="bg-black text-white px-2 py-0.5 rounded-full">
            -{product.diskonPersen}%
          </span>
        )}
      </div>

      {/* Product Titles */}
      <div className="space-y-1 w-full text-center">
        <h3 className="font-serif text-base sm:text-lg font-medium tracking-wide text-neutral-900 group-hover:opacity-80 transition-opacity line-clamp-1">
          {product.nama}
        </h3>
        <p className="text-[10px] tracking-[0.16em] uppercase font-semibold text-neutral-400 line-clamp-1">
          {product.tagline}
        </p>
      </div>

      {/* Hardware Graphic with Zoom 1.04 on Hover */}
      <div className="my-7 sm:my-8 w-full h-40 sm:h-48 flex items-center justify-center overflow-hidden">
        <motion.img
          src={product.gambar ? product.gambar[0] : '/images/products/laptop.svg'}
          alt={product.nama}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-h-full max-w-[85%] object-contain drop-shadow-md"
        />
      </div>

      {/* Price and Action */}
      <div className="w-full space-y-2 pt-1">
        {product.hargaCoret && (
          <span className="text-[11px] text-neutral-400 line-through block text-center">
            {formatIDR(product.hargaCoret)}
          </span>
        )}

        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex-1 bg-[#f8f8fa] group-hover:bg-[#f0f0f3] transition-colors py-2 px-3 rounded-full text-xs font-bold tracking-tight text-neutral-900 border border-neutral-200/60 truncate">
            {formatIDR(product.harga)}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-xs ${
              isAdded
                ? 'bg-neutral-800 text-white'
                : 'bg-neutral-100 group-hover:bg-black text-neutral-800 group-hover:text-white'
            }`}
            aria-label={`Tambah ${product.nama} ke keranjang`}
          >
            {isAdded ? <Check size={14} strokeWidth={2.5} /> : <Plus size={15} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
