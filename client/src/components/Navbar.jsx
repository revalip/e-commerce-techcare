import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Heart, User, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import MenuOverlay from './MenuOverlay';

/**
 * Apple.com/id Global Navbar:
 * 44px sticky translucent bar (rgba(255,255,255,.8) + backdrop-blur(20px)),
 * 1px #D2D2D7 bottom hairline ONLY when scrolled.
 * Left: plain text "TechCare" (no box). Right: Search + Bag icon with tiny blue count badge + Hamburger.
 */
export default function Navbar({ onNavigate, onQuickSearch, currentPage }) {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { user, isAdmin, isGuest, openAuthModal } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  const navLinks = [
    { label: 'Beranda', page: 'home' },
    { label: 'Katalog', page: 'shop' },
    { label: 'Lacak Pesanan', page: 'orders' },
    { label: 'Jasa IT', page: 'about' },
    { label: 'Standar QC', page: 'learn' }
  ];

  const handleLinkClick = (page) => {
    onNavigate(page);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    if (onQuickSearch) {
      onQuickSearch(q);
    } else {
      onNavigate('shop');
    }
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-11 bg-white/80 backdrop-blur-[20px] transition-colors duration-200 ${
          isScrolled ? 'border-b border-[#D2D2D7]' : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left: Clean Text Wordmark (No box) */}
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="text-[17px] font-semibold tracking-[-0.025em] text-[#1D1D1F] hover:opacity-75 transition-opacity shrink-0"
          >
            TechCare
          </button>

          {/* Center: Clean Flat Links on Tablet/Desktop (>= 768px, matching Apple.com Desktop Site at 980px) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8" aria-label="Navigasi Utama">
            {navLinks.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'shop' && currentPage === 'product-detail') ||
                (item.page === 'orders' && currentPage === 'order-detail');
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleLinkClick(item.page)}
                  className={`text-[12px] tracking-[-0.01em] whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#0071E3] font-medium'
                      : 'text-[#1D1D1F]/80 hover:text-[#1D1D1F]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Search + Desktop Account/Favorit + Bag Icon with Tiny Blue Badge + Mobile-only Hamburger */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="w-9 h-9 flex items-center justify-center text-[#1D1D1F]/85 hover:text-[#1D1D1F] transition-colors"
              aria-label="Cari produk"
            >
              <Search size={16} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="hidden md:flex relative w-9 h-9 items-center justify-center text-[#1D1D1F]/85 hover:text-[#1D1D1F] transition-colors"
              aria-label="Favorit"
              title="Favorit"
            >
              <Heart
                size={16}
                strokeWidth={1.7}
                className={wishlistCount > 0 ? 'fill-[#0071E3] text-[#0071E3]' : ''}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#0071E3] text-white text-[9px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => handleLinkClick('admin')}
                className="hidden md:inline-flex items-center gap-1 px-2.5 h-8 rounded-full text-[12px] font-medium text-[#0071E3] hover:bg-[#F5F5F7] transition-colors"
              >
                <LayoutDashboard size={13} strokeWidth={1.8} />
                <span>Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (isGuest ? openAuthModal('login') : handleLinkClick('orders'))}
                className="hidden md:inline-flex items-center gap-1 px-2 h-8 text-[12px] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors"
              >
                <User size={14} strokeWidth={1.7} />
                <span className="max-w-[84px] truncate">{isGuest ? 'Masuk' : user?.name || 'Akun'}</span>
              </button>
            )}

            {/* Bag Icon with Tiny Blue Badge (No black pill!) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 flex items-center justify-center text-[#1D1D1F]/85 hover:text-[#1D1D1F] transition-colors"
              aria-label={`Keranjang belanja, ${totalItems} item`}
            >
              <ShoppingBag size={16} strokeWidth={1.7} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#0071E3] text-white text-[9px] font-semibold flex items-center justify-center tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger (mobile only < 768px) opening Fullscreen White MenuOverlay */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setSearchOpen(false);
              }}
              className="md:hidden w-9 h-9 -mr-1.5 flex items-center justify-center text-[#1D1D1F]"
              aria-label="Buka Menu"
            >
              <Menu size={18} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        {/* Clean Slide-Down Quick Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white/95 backdrop-blur-[20px] border-b border-[#D2D2D7] overflow-hidden"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-[720px] mx-auto px-4 py-3 flex items-center gap-2.5"
              >
                <Search size={16} className="text-[#6E6E73] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Cari ThinkPad, ASUS, Logitech, Monitor, RAM..."
                  className="flex-1 bg-transparent text-[15px] text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none min-h-[38px]"
                />
                <button
                  type="submit"
                  className="px-4 min-h-[34px] rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal transition-colors"
                >
                  Cari
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
                  aria-label="Tutup pencarian"
                >
                  <X size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
    </>
  );
}
