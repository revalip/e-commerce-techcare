import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../utils/format';
import { FREE_SHIPPING_THRESHOLD } from '../data/shipping';
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

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#0B1220]/55 backdrop-blur-xs"
          />

          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[90vh] sm:rounded-none rounded-t-3xl overflow-hidden border-l border-slate-200"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-slate-300" />
                </div>
              )}

              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center">
                    <ShoppingBag size={18} />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0B1220] leading-tight">
                      Keranjang Belanja
                    </h2>
                    <p className="text-[11px] text-slate-500">{totalItems} item siap checkout</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 flex items-center justify-center transition-colors"
                  aria-label="Tutup Keranjang"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Free Shipping Progress Strip */}
              {items.length > 0 && (
                <div className="px-5 py-3 bg-[#EEF4FF]/70 border-b border-[#C7DCFF]/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0B1220]">
                    <Truck size={14} className="text-[#0B5FFF] shrink-0" />
                    {remainingForFree === 0 ? (
                      <span className="text-emerald-700">
                        Selamat! Anda mendapat <strong>Gratis Ongkir Jabodetabek</strong> (JNE Reg / J&amp;T).
                      </span>
                    ) : (
                      <span>
                        Tambah <strong>{formatIDR(remainingForFree)}</strong> lagi untuk Gratis Ongkir Jabodetabek
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-[#C7DCFF]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        remainingForFree === 0 ? 'bg-emerald-500' : 'bg-[#0B5FFF]'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-slate-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-14 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#EEF4FF] text-[#0B5FFF] flex items-center justify-center">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display text-lg font-bold text-[#0B1220]">Keranjang Masih Kosong</p>
                      <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        Temukan laptop bisnis, monitor, peripheral, RAM DDR4/DDR5, dan SSD NVMe bergaransi toko di bawah Rp 10 juta.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onContinueShopping();
                      }}
                      className="tc-btn-primary"
                    >
                      <span>Jelajahi Katalog</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const key = item.variantKey || `${item.id}-${item.warna}`;
                    return (
                      <div key={key} className="py-4 flex gap-3.5">
                        <div className="w-20 h-20 bg-[#EEF2F7] rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-slate-200/70">
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-display font-bold text-sm text-[#0B1220] line-clamp-1">
                                {item.nama}
                              </h4>
                              <button
                                onClick={() => removeFromCart(key)}
                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0"
                                aria-label="Hapus item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            {item.specLabel && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#EEF4FF] text-[#0B5FFF] text-[10px] font-bold">
                                {item.specLabel}
                              </span>
                            )}
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {item.warna} • {item.kondisi || 'Second Grade A'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-2.5">
                            <div className="inline-flex items-center border border-slate-200 rounded-xl bg-[#F8FAFC]">
                              <button
                                onClick={() => updateQuantity(key, item.jumlah - 1)}
                                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#0B5FFF]"
                                aria-label="Kurangi jumlah"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-xs font-bold min-w-[22px] text-center tabular-nums">
                                {item.jumlah}
                              </span>
                              <button
                                onClick={() => updateQuantity(key, item.jumlah + 1)}
                                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#0B5FFF]"
                                aria-label="Tambah jumlah"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <span className="font-display text-sm font-bold text-[#0B1220] tabular-nums">
                              {formatIDR(item.harga * item.jumlah)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-slate-200 bg-[#F8FAFC] space-y-3.5">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Ongkir &amp; Kurir</span>
                    <span className="text-slate-800 font-semibold">Dihitung di Checkout</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-display text-sm font-bold text-slate-700">Subtotal Produk</span>
                    <span className="font-display text-lg font-bold text-[#0B1220] tabular-nums">
                      {formatIDR(subtotal)}
                    </span>
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
                    className="tc-btn-primary w-full py-3.5 text-sm"
                  >
                    <span>Lanjut ke Checkout</span>
                    <ArrowRight size={16} />
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
