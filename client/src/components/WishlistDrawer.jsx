import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import { formatIDR } from '../utils/format';

export default function WishlistDrawer({ onSelectProduct, onExploreShop }) {
  const {
    wishlistIds,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist
  } = useWishlist();
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[88vh] sm:rounded-none rounded-t-4xl overflow-hidden"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-neutral-300" />
                </div>
              )}

              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Heart size={18} className="text-neutral-900 fill-neutral-900" />
                  <h2 className="font-serif text-lg font-medium text-neutral-900">
                    Favorit Saya ({wishlistIds.length})
                  </h2>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                  aria-label="Tutup Favorit"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
                {savedProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                      <Heart size={26} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-lg text-neutral-800">Belum Ada Produk Favorit</p>
                      <p className="text-xs text-neutral-500 max-w-xs">
                        Tekan ikon hati pada laptop, RAM, SSD, atau peripheral second yang Anda incar untuk menyimpannya di sini.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onExploreShop();
                      }}
                      className="mt-2 bg-black text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-full hover:bg-neutral-800 transition-all active:scale-95"
                    >
                      Jelajahi Katalog
                    </button>
                  </div>
                ) : (
                  savedProducts.map((product) => (
                    <div key={product.id} className="py-4 flex gap-4">
                      <button
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        className="w-20 h-20 rounded-2xl bg-[#f4f4f5] p-2 flex items-center justify-center flex-shrink-0 border border-neutral-100 hover:border-neutral-300 transition-colors"
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
                              className="text-left font-serif text-sm font-semibold text-neutral-900 hover:underline line-clamp-1"
                            >
                              {product.nama}
                            </button>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                              aria-label="Hapus dari favorit"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {product.kondisi || 'Second Grade A'}
                          </p>
                          <p className="text-xs font-bold text-neutral-900 mt-1">
                            {formatIDR(product.harga)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => {
                              setIsWishlistOpen(false);
                              onSelectProduct(product);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-full border border-neutral-200 hover:border-black text-[11px] font-semibold text-neutral-800 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Pilih Spec</span>
                            <ArrowRight size={11} />
                          </button>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="py-1.5 px-3 rounded-full bg-black text-white hover:bg-neutral-800 text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <ShoppingBag size={11} />
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
