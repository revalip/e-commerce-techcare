import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

/**
 * Apple-style Fullscreen White Menu Overlay:
 * Large 28px typography with smooth stagger animation, giving access to every route
 * (Beranda, Katalog, Lacak Pesanan, Favorit, Masuk/Akun, Jasa IT, Standar QC, Admin).
 */
export default function MenuOverlay({ isOpen, onClose, onNavigate, currentPage }) {
  const { user, isAdmin, isGuest, logout, openAuthModal } = useAuth();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const items = [
    { label: 'Beranda', page: 'home', onClick: () => { onNavigate('home'); onClose(); } },
    { label: 'Katalog', page: 'shop', onClick: () => { onNavigate('shop'); onClose(); } },
    { label: 'Pesanan', page: 'orders', onClick: () => { onNavigate('orders'); onClose(); } },
    { label: 'Jasa IT', page: 'about', onClick: () => { onNavigate('about'); onClose(); } },
    { label: 'Standar QC', page: 'learn', onClick: () => { onNavigate('learn'); onClose(); } },
    {
      label: wishlistCount > 0 ? `Favorit (${wishlistCount})` : 'Favorit',
      page: 'wishlist',
      onClick: () => { onClose(); setIsWishlistOpen(true); }
    },
    ...(isAdmin
      ? [{ label: 'Admin', page: 'admin', onClick: () => { onNavigate('admin'); onClose(); } }]
      : isGuest
      ? [{ label: 'Masuk', page: 'auth', onClick: () => { onClose(); openAuthModal('login'); } }]
      : [])
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Utama"
        >
          {/* Top Bar matching 44px Navbar */}
          <div className="h-11 px-4 sm:px-6 flex items-center justify-between max-w-[1200px] w-full mx-auto shrink-0">
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
              TechCare
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 -mr-2 flex items-center justify-center text-[#1D1D1F] hover:opacity-70 transition-opacity"
              aria-label="Tutup Menu"
            >
              <X size={20} strokeWidth={1.6} />
            </button>
          </div>

          {/* Staggered 28px Navigation Links */}
          <nav className="flex-1 max-w-[1200px] w-full mx-auto px-6 sm:px-10 pt-8 pb-12 flex flex-col justify-between">
            <ul className="space-y-3">
              {items.map((item, idx) => {
                const isActive = currentPage === item.page;
                return (
                  <motion.li
                    key={item.label}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: shouldReduceMotion ? 0 : idx * 0.045,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <button
                      type="button"
                      onClick={item.onClick}
                      className={`text-left text-[28px] leading-[1.25] tracking-[-0.025em] font-semibold transition-colors py-1 ${
                        isActive ? 'text-[#0071E3]' : 'text-[#1D1D1F] hover:text-[#0071E3]'
                      }`}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {!isGuest && (
              <div className="pt-8 mt-8 border-t border-[#D2D2D7]">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                >
                  <LogOut size={16} strokeWidth={1.7} />
                  <span>Keluar dari {user?.name || 'Akun'}</span>
                </button>
              </div>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
