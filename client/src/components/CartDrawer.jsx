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
            className="absolute inset-0 bg-[#1D2129]/55 backdrop-blur-xs"
          />

          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[90vh] sm:rounded-none rounded-t-3xl overflow-hidden border-l border-[#E2E7EE]"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-[#BAC4D2]" />
                </div>
              )}

              {/* Header */}
              <div className="px-5 py-4 border-b border-[#E2E7EE] flex items-center justify-between bg-[#F7F8FA]">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#ECEFF4] text-[#1D2129] flex items-center justify-center">
                    <ShoppingBag size={18} />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#1D2129] leading-tight">
                      Keranjang Belanja
                    </h2>
                    <p className="text-[11px] text-[#647082]">{totalItems} item siap checkout</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-xl text-[#647082] hover:text-[#1D2129] hover:bg-[#E2E7EE]/70 flex items-center justify-center transition-colors"
                  aria-label="Tutup Keranjang"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Free Shipping Progress Strip */}
              {items.length > 0 && (
                <div className="px-5 py-3 bg-[#ECEFF4]/70 border-b border-[#D4DBE5]/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#1D2129]">
                    <Truck size={14} className="text-[#1D2129] shrink-0" />
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
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-[#D4DBE5]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        remainingForFree === 0 ? 'bg-emerald-500' : 'bg-[#1D2129]'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-[#ECEFF4]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-14 space-y-4">
                    <div className="w-16 h-16 rounded-[20px] bg-[#ECEFF4] text-[#1D2129] flex items-center justify-center">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display text-lg font-bold text-[#1D2129]">Keranjang Masih Kosong</p>
                      <p className="text-xs text-[#647082] max-w-xs leading-relaxed">
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
                        <div className="w-20 h-20 bg-[#ECEFF4] rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-[#E2E7EE]/70">
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-display font-bold text-sm text-[#1D2129] line-clamp-1">
                                {item.nama}
                              </h4>
                              <button
                                onClick={() => removeFromCart(key)}
                                className="w-8 h-8 rounded-lg text-[#8692A3] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0"
                                aria-label="Hapus item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            {item.specLabel && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#ECEFF4] text-[#1D2129] text-[10px] font-bold">
                                {item.specLabel}
                              </span>
                            )}
                            <p className="text-[11px] text-[#647082] mt-0.5">
                              {item.warna} • {item.kondisi || 'Second Grade A'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-2.5">
                            <div className="inline-flex items-center border border-[#E2E7EE] rounded-xl bg-[#F7F8FA]">
                              <button
                                onClick={() => updateQuantity(key, item.jumlah - 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#4F627A] hover:text-[#1D2129]"
                                aria-label="Kurangi jumlah"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-xs font-bold min-w-[22px] text-center tabular-nums">
                                {item.jumlah}
                              </span>
                              <button
                                onClick={() => updateQuantity(key, item.jumlah + 1)}
                                className="w-9 h-9 flex items-center justify-center text-[#4F627A] hover:text-[#1D2129]"
                                aria-label="Tambah jumlah"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <span className="font-display text-sm font-bold text-[#1D2129] tabular-nums">
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
                <div className="p-5 border-t border-[#E2E7EE] bg-[#F7F8FA] space-y-3.5">
                  <div className="flex justify-between items-center text-xs text-[#647082]">
                    <span>Ongkir &amp; Kurir</span>
                    <span className="text-[#23272F] font-semibold">Dihitung di Checkout</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-display text-sm font-bold text-[#323846]">Subtotal Produk</span>
                    <span className="font-display text-lg font-bold text-[#1D2129] tabular-nums">
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
