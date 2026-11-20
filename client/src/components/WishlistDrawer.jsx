import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import { formatIDR } from '../utils/format';

export default function WishlistDrawer({ onSelectProduct, onExploreShop }) {
  const { wishlistIds, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isWishlistOpen) return;
    let active = true;
    getProducts().then((res) => {
      if (active && res.success) setAllProducts(res.data);
    });

    const onEsc = (e) => {
      if (e.key === 'Escape') setIsWishlistOpen(false);
    };
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      active = false;
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen, setIsWishlistOpen]);

  const savedProducts = allProducts.filter((p) =>
    wishlistIds.some((id) => String(id) === String(p.id))
  );

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsWishlistOpen(false)}
            className="absolute inset-0 bg-[#0B1220]/55 backdrop-blur-xs"
          />

          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[88vh] sm:rounded-none rounded-t-3xl overflow-hidden border-l border-slate-200"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-slate-300" />
                </div>
              )}

              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center">
                    <Heart size={18} className="fill-[#F97316]" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0B1220] leading-tight">
                      Produk Favorit
                    </h2>
                    <p className="text-[11px] text-slate-500">{wishlistIds.length} tersimpan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-10 h-10 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 flex items-center justify-center transition-colors"
                  aria-label="Tutup Favorit"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-slate-100">
                {savedProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-14 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center">
                      <Heart size={26} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display text-lg font-bold text-[#0B1220]">Belum Ada Favorit</p>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        Tekan ikon hati pada perangkat IT yang Anda incar untuk membandingkan harga dan menyimpannya di sini.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onExploreShop();
                      }}
                      className="tc-btn-primary"
                    >
                      <span>Jelajahi Katalog</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  savedProducts.map((product) => (
                    <div key={product.id} className="py-4 flex gap-3.5">
                      <button
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        className="w-20 h-20 rounded-xl bg-[#EEF2F7] p-2 flex items-center justify-center flex-shrink-0 border border-slate-200/70 hover:border-[#0B5FFF] transition-colors"
                      >
                        <img
                          src={product.gambar?.[0]}
                          alt={product.nama}
                          className="max-h-full max-w-full object-contain"
                        />
                      </button>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => {
                                setIsWishlistOpen(false);
                                onSelectProduct(product);
                              }}
                              className="text-left font-display text-sm font-bold text-[#0B1220] hover:text-[#0B5FFF] line-clamp-1"
                            >
                              {product.nama}
                            </button>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center shrink-0"
                              aria-label="Hapus dari favorit"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {product.brand} • {product.kondisi || 'Second Grade A'}
                          </p>
                          <p className="font-display text-sm font-bold text-[#0B1220] mt-1 tabular-nums">
                            {formatIDR(product.harga)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => {
                              setIsWishlistOpen(false);
                              onSelectProduct(product);
                            }}
                            className="flex-1 min-h-[38px] px-3 rounded-xl border border-slate-200 hover:border-[#0B5FFF] hover:text-[#0B5FFF] text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Detail</span>
                            <ArrowRight size={12} />
                          </button>
                          <button
                            disabled={Number(product.stok) <= 0}
                            onClick={() => addToCart(product, 1)}
                            className="min-h-[38px] px-3.5 rounded-xl bg-[#0B5FFF] hover:bg-[#0847C4] disabled:bg-slate-200 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <ShoppingBag size={12} />
                            <span>+ Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
