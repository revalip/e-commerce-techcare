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
            className="absolute inset-0 bg-[#1D2129]/45 backdrop-blur-xs"
          />

          <div className="fixed inset-0 pointer-events-none flex sm:justify-end justify-center sm:items-stretch items-end">
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="pointer-events-auto w-full sm:max-w-md bg-white shadow-2xl flex flex-col sm:h-full max-h-[90vh] sm:rounded-none rounded-t-[28px] overflow-hidden"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1">
                  <span className="w-10 h-1 rounded-full bg-[#D2D2D7]" />
                </div>
              )}

              {/* Header */}
              <div className="px-6 py-4 border-b border-[#D2D2D7]/70 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                    <ShoppingBag size={18} strokeWidth={1.7} />
                  </span>
                  <div>
                    <h2 className="text-[18px] font-semibold tracking-[-0.015em] text-[#1D1D1F] leading-tight">
                      Tas Belanja
                    </h2>
                    <p className="text-[12px] text-[#6E6E73]">{totalItems} item siap checkout</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-11 h-11 -mr-2 rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Keranjang"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Free Shipping Progress Strip */}
              {items.length > 0 && (
                <div className="px-6 py-3.5 bg-[#F5F5F7] space-y-2">
                  <div className="flex items-center gap-2 text-[12px] text-[#1D1D1F]">
                    <Truck size={15} strokeWidth={1.7} className="text-[#0071E3] shrink-0" />
                    {remainingForFree === 0 ? (
                      <span className="text-[#1D7F3E] font-medium">
                        Gratis ongkir Jabodetabek aktif.
                      </span>
                    ) : (
                      <span>
                        Tambah <strong>{formatIDR(remainingForFree)}</strong> lagi untuk gratis ongkir Jabodetabek
                      </span>
                    )}
                  </div>
                  <div className="h-[4px] w-full bg-[#E5E5EA] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        remainingForFree === 0 ? 'bg-[#1D7F3E]' : 'bg-[#0071E3]'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-[#D2D2D7]/60">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-14 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                      <ShoppingBag size={26} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[19px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                        Tas belanja kosong
                      </p>
                      <p className="text-[14px] text-[#6E6E73] max-w-xs leading-relaxed">
                        Temukan laptop bisnis, monitor, peripheral, RAM, dan SSD bergaransi toko di bawah Rp 10 juta.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        onContinueShopping();
                      }}
                      className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
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
                        <div className="w-20 h-20 bg-[#F5F5F7] rounded-2xl flex items-center justify-center p-2 shrink-0">
                          <img
                            src={item.gambar}
                            alt={item.nama}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-semibold text-[14px] text-[#1D1D1F] line-clamp-1">
                                {item.nama}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeFromCart(key)}
                                className="w-9 h-9 -mr-1.5 -mt-1.5 rounded-full text-[#86868B] hover:text-[#D70015] hover:bg-[#F5F5F7] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                                aria-label="Hapus item"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            {item.specLabel && (
                              <p className="text-[12px] text-[#424245] mt-0.5 truncate">
                                {item.specLabel}
                              </p>
                            )}
                            <p className="text-[12px] text-[#6E6E73] mt-0.5">
                              {item.warna} · {item.kondisi || 'Grade A'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-3">
                            <div className="inline-flex items-center rounded-[980px] bg-[#F5F5F7]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(key, item.jumlah - 1)}
                                className="w-10 h-10 flex items-center justify-center text-[#1D1D1F] hover:text-[#0071E3] cursor-pointer"
                                aria-label="Kurangi jumlah"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-[13px] font-semibold min-w-[24px] text-center tabular-nums text-[#1D1D1F]">
                                {item.jumlah}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(key, item.jumlah + 1)}
                                className="w-10 h-10 flex items-center justify-center text-[#1D1D1F] hover:text-[#0071E3] cursor-pointer"
                                aria-label="Tambah jumlah"
                              >
                                <Plus size={13} />
                              </button>
                            </div>

                            <span className="text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
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
                <div className="p-6 border-t border-[#D2D2D7]/70 bg-[#F5F5F7] space-y-3.5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                  <div className="flex justify-between items-center text-[13px] text-[#6E6E73]">
                    <span>Ongkos Kirim</span>
                    <span className="text-[#1D1D1F] font-medium">Dihitung di Checkout</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[15px] font-semibold text-[#1D1D1F]">Subtotal</span>
                    <span className="text-[20px] font-semibold text-[#1D1D1F] tabular-nums">
                      {formatIDR(subtotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      if (isGuest) {
                        openAuthModal(
                          'login',
                          'Silakan masuk atau daftar akun terlebih dahulu untuk melanjutkan checkout.',
                          () => onCheckout()
                        );
                      } else {
                        onCheckout();
                      }
                    }}
                    className="w-full h-[46px] rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] font-normal inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
