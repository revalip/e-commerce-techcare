import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ onCheckout, onContinueShopping }) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems
  } = useCart();
  const { isGuest, openAuthModal } = useAuth();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[88vh] sm:rounded-none rounded-t-4xl overflow-hidden"
            >
              {/* Mobile Drag Indicator Bar */}
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-neutral-300" />
                </div>
              )}

              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag size={18} className="text-neutral-900" />
                  <h2 className="font-serif text-lg font-medium text-neutral-900">
                    Keranjang ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                  aria-label="Tutup Keranjang"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-lg text-neutral-800">Keranjang Masih Kosong</p>
                      <p className="text-xs text-neutral-500 max-w-xs">
                        Pilih headphone impian Anda dan rasakan kemurnian suara tanpa kompromi.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onContinueShopping();
                      }}
                      className="mt-2 bg-black text-white text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-full hover:bg-neutral-800 transition-all active:scale-95"
                    >
                      Jelajahi Produk
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.warna}`} className="py-4 flex space-x-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 bg-[#f7f7f9] rounded-2xl flex items-center justify-center p-2 flex-shrink-0 border border-neutral-100">
                        <img
                          src={item.gambar}
                          alt={item.nama}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-semibold text-neutral-900 truncate">
                              {item.nama}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id, item.warna)}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                              aria-label="Hapus item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                            {item.warna}
                          </p>
                          <p className="text-xs font-semibold text-neutral-900 mt-1">
                            {formatIDR(item.harga)}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center border border-neutral-200 rounded-full px-2 py-0.5 space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.warna, item.jumlah - 1)}
                              className="text-neutral-500 hover:text-black p-0.5 active:scale-90"
                              aria-label="Kurangi jumlah"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold px-1 min-w-[14px] text-center">
                              {item.jumlah}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.warna, item.jumlah + 1)}
                              className="text-neutral-500 hover:text-black p-0.5 active:scale-90"
                              aria-label="Tambah jumlah"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="text-xs font-bold text-neutral-900 ml-auto">
                            {formatIDR(item.harga * item.jumlah)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-neutral-100 bg-[#fafafa] space-y-4">
                  <div className="flex justify-between items-center text-xs text-neutral-500">
                    <span>Pengiriman</span>
                    <span className="text-neutral-900 font-semibold uppercase tracking-wider text-[11px]">
                      Gratis Ongkir
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-neutral-900 pt-1">
                    <span className="font-serif text-base">Subtotal</span>
                    <span className="text-base">{formatIDR(subtotal)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      if (isGuest) {
                        openAuthModal(
                          'login',
                          'Silakan masuk atau buat akun buyer terlebih dahulu untuk melanjutkan proses checkout.',
                          () => onCheckout()
                        );
                      } else {
                        onCheckout();
                      }
                    }}
                    className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 px-6 rounded-full text-xs font-semibold tracking-[0.16em] uppercase flex items-center justify-center space-x-2 active:scale-[0.98] shadow-md"
                  >
                    <span>Lanjut ke Pembayaran</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
