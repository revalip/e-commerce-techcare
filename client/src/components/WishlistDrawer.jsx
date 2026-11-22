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
            className="absolute inset-0 bg-[#1D2129]/55 backdrop-blur-xs"
          />

          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[88vh] sm:rounded-none rounded-t-[28px] overflow-hidden"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-[#D2D2D7]" />
                </div>
              )}

              {/* Header */}
              <div className="px-6 py-4 border-b border-[#D2D2D7]/70 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#F5F5F7] text-[#FF3B30] flex items-center justify-center">
                    <Heart size={17} className="fill-[#FF3B30]" />
                  </span>
                  <div>
                    <h2 className="text-[18px] font-semibold tracking-[-0.015em] text-[#1D1D1F] leading-tight">
                      Produk Favorit
                    </h2>
                    <p className="text-[12px] text-[#6E6E73]">{wishlistIds.length} tersimpan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWishlistOpen(false)}
                  className="w-11 h-11 -mr-2 rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Favorit"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-[#D2D2D7]/60">
                {savedProducts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-14 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                      <Heart size={26} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[19px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                        Belum ada favorit
                      </p>
                      <p className="text-[14px] text-[#6E6E73] max-w-xs leading-relaxed">
                        Ketuk ikon hati pada perangkat yang Anda incar untuk membandingkan harga dan menyimpannya di sini.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onExploreShop();
                      }}
                      className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Jelajahi Katalog</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  savedProducts.map((product) => (
                    <div key={product.id} className="py-4 flex gap-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsWishlistOpen(false);
                          onSelectProduct(product);
                        }}
                        className="w-20 h-20 rounded-2xl bg-[#F5F5F7] p-2 flex items-center justify-center shrink-0 cursor-pointer"
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
                              type="button"
                              onClick={() => {
                                setIsWishlistOpen(false);
                                onSelectProduct(product);
                              }}
                              className="text-left text-[14px] font-semibold text-[#1D1D1F] hover:text-[#0071E3] line-clamp-1 cursor-pointer"
                            >
                              {product.nama}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(product.id)}
                              className="w-9 h-9 -mr-1.5 -mt-1.5 rounded-full text-[#86868B] hover:text-[#D70015] hover:bg-[#F5F5F7] flex items-center justify-center shrink-0 cursor-pointer"
                              aria-label="Hapus dari favorit"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-[12px] text-[#6E6E73] mt-0.5">
                            {product.brand} · {product.kondisi || 'Grade A'}
                          </p>
                          <p className="text-[15px] font-semibold text-[#1D1D1F] mt-1 tabular-nums">
                            {formatIDR(product.harga)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWishlistOpen(false);
                              onSelectProduct(product);
                            }}
                            className="flex-1 h-[40px] px-4 rounded-[980px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[13px] font-medium text-[#1D1D1F] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Detail</span>
                            <ArrowRight size={13} />
                          </button>
                          <button
                            type="button"
                            disabled={Number(product.stok) <= 0}
                            onClick={() => addToCart(product, 1)}
                            className="h-[40px] px-4 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-[#E5E5EA] disabled:text-[#6E6E73] text-white text-[13px] font-normal transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag size={13} />
                            <span>Beli</span>
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
