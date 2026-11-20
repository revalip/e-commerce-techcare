import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { totalItems, setIsCartOpen, cartBadgeBounce } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { user, isAdmin, isBuyer, isGuest, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 140 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Beranda', page: 'home' },
    { label: 'Katalog', page: 'shop' },
    { label: 'Lacak', page: 'orders' },
    { label: 'Jasa IT', page: 'about' },
    { label: 'Standar QC', page: 'learn' }
  ];

  const handleLinkClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -110 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="sticky top-0 z-40"
    >
      {/* Architectural Technical Status Strip */}
      <div className="bg-[#111111] text-[#D6D4CC] border-b border-[#2A2A27]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-7 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.06em] uppercase">
          <div className="flex items-center gap-3 sm:gap-5 truncate">
            <span className="inline-flex items-center gap-1.5 truncate text-[#F2F1EC]">
              <span className="w-1.5 h-1.5 bg-[#E63B19] shrink-0" />
              <span className="truncate">32 TITIK QC TEKNISI // GARANSI TOKO 30–90 HARI</span>
            </span>
            <span className="hidden lg:inline text-[#8A8880] shrink-0">
              GRATIS ONGKIR JABODETABEK MIN. RP 5 JT
            </span>
          </div>
          <span className="hidden sm:inline text-[#8A8880] shrink-0">
            JKT_BARAT // MON–SAT 09–20
          </span>
        </div>
      </div>

      {/* Main Hairline Paper Header (Dimwit + Monolith style) */}
      <div className="bg-[#F2F1EC]/95 backdrop-blur-sm border-b border-[#D6D4CC]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Mobile & Tablet Hamburger (< lg) */}
          <div className="lg:hidden flex items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 -ml-1.5 rounded-[2px] flex items-center justify-center text-[#111111] border border-transparent hover:border-[#111111] transition-colors"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>

          {/* Typographic Wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-baseline gap-2 text-left group shrink-0"
          >
            <span className="font-display text-lg sm:text-xl font-black tracking-[-0.04em] uppercase text-[#111111] leading-none flex items-center gap-1.5">
              <span>TECHCARE</span>
              <span className="w-2 h-2 bg-[#E63B19] inline-block group-hover:scale-125 transition-transform" />
            </span>
            <span className="hidden xl:inline font-mono text-[10px] uppercase tracking-[0.12em] text-[#6E6D68]">
              / IT HARDWARE
            </span>
          </button>

          {/* Desktop Inline Underlined Nav Links (lg+) */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Navigasi Utama">
            {navLinks.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'shop' && currentPage === 'product-detail') ||
                (item.page === 'orders' && currentPage === 'order-detail');
              return (
                <button
                  key={item.page}
                  onClick={() => handleLinkClick(item.page)}
                  className={`relative py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#111111]'
                      : 'text-[#6E6D68] hover:text-[#111111]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#E63B19]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls — Compact & Clip-Free on 360px & 768px */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isGuest && (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[42px] px-3 rounded-[2px] border border-[#D6D4CC] hover:border-[#111111] bg-[#FAF9F6] text-[#111111] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors"
              >
                <User size={13} />
                <span>Masuk</span>
              </button>
            )}

            {isBuyer && (
              <div className="hidden sm:flex items-center border border-[#D6D4CC] bg-[#FAF9F6] rounded-[2px] min-h-[42px] pl-3 pr-1">
                <button
                  onClick={() => handleLinkClick('orders')}
                  className="font-mono text-[11px] font-semibold uppercase text-[#111111] truncate max-w-[90px] lg:max-w-[110px] hover:text-[#E63B19]"
                  title="Lihat pesanan saya"
                >
                  {user?.name || 'Buyer'}
                </button>
                <button
                  onClick={logout}
                  className="w-8 h-8 ml-1 flex items-center justify-center text-[#6E6D68] hover:text-[#E63B19] transition-colors"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}

            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleLinkClick('admin')}
                  className={`inline-flex items-center justify-center gap-1.5 min-h-[42px] px-2.5 sm:px-3 rounded-[2px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    currentPage === 'admin'
                      ? 'bg-[#E63B19] text-white'
                      : 'bg-[#111111] text-[#F2F1EC] hover:bg-[#E63B19]'
                  }`}
                  aria-label="Dashboard Admin"
                >
                  <LayoutDashboard size={14} />
                  <span className="hidden sm:inline">Admin</span>
                </button>
                <button
                  onClick={logout}
                  className="hidden sm:inline-flex w-10 h-[42px] rounded-[2px] border border-[#D6D4CC] hover:border-[#E63B19] items-center justify-center text-[#6E6D68] hover:text-[#E63B19] transition-colors"
                  title="Keluar dari Admin"
                  aria-label="Keluar dari Admin"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}

            {/* Wishlist Button (hidden on < sm because Favorit is in Mobile Bottom Nav) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden sm:flex relative w-[42px] h-[42px] rounded-[2px] border border-[#D6D4CC] hover:border-[#111111] bg-[#FAF9F6] text-[#111111] items-center justify-center transition-colors"
              aria-label="Produk Favorit"
              title="Favorit Saya"
            >
              <Heart
                size={16}
                className={wishlistCount > 0 ? 'fill-[#E63B19] text-[#E63B19]' : ''}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E63B19] text-white font-mono text-[9px] font-bold min-w-[16px] h-4 px-1 flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Dimwit-Inspired 2-Cell Architectural Cart Badge */}
            <motion.button
              animate={cartBadgeBounce ? { scale: [1, 1.08, 0.97, 1] } : {}}
              transition={{ duration: 0.3 }}
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-stretch min-h-[42px] rounded-[2px] border border-[#111111] bg-[#FAF9F6] hover:bg-[#111111] hover:text-[#F2F1EC] text-[#111111] transition-colors overflow-hidden group"
              aria-label="Buka Keranjang"
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]">
                <ShoppingBag size={14} strokeWidth={2} />
                <span className="hidden xs:inline sm:inline">CART</span>
              </span>
              <span
                className={`min-w-[34px] px-2 flex items-center justify-center font-mono text-xs font-bold tabular-nums border-l border-[#111111] transition-colors ${
                  totalItems > 0
                    ? 'bg-[#E63B19] text-white'
                    : 'bg-[#111111] text-[#F2F1EC] group-hover:bg-[#E63B19]'
                }`}
              >
                {totalItems}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Drawer (< lg) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#F2F1EC] border-b border-[#111111] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((item, idx) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleLinkClick(item.page)}
                    className={`w-full flex items-center justify-between px-3 min-h-[44px] border-b border-[#D6D4CC]/70 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
                      isActive
                        ? 'text-[#E63B19] font-bold'
                        : 'text-[#111111] hover:text-[#E63B19]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-[#6E6D68]">0{idx + 1}</span>
                  </button>
                );
              })}

              <div className="pt-4 flex items-center justify-between gap-2">
                {isGuest ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="tc-btn-primary w-full"
                  >
                    <User size={14} />
                    <span>Masuk / Daftar Akun</span>
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-[#111111] truncate">
                      <Package size={14} className="text-[#E63B19] shrink-0" />
                      <span className="truncate">
                        {user?.name} ({user?.role})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="min-h-[44px] px-4 rounded-[2px] border border-[#111111] font-mono text-[11px] font-bold uppercase text-[#111111] hover:bg-[#E63B19] hover:text-white hover:border-[#E63B19] transition-colors"
                    >
                      Keluar
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
