import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X, Heart, User, SlidersHorizontal, ArrowRight } from 'lucide-react';
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
    if (!searchOpen) return undefined;
    const focusTimer = setTimeout(() => searchInputRef.current?.focus(), 60);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [searchOpen]);

  const quickSearchLinks = [
    { label: 'ThinkPad Series', query: 'ThinkPad' },
    { label: 'MacBook Air M1', query: 'MacBook' },
    { label: 'Upgrade RAM & SSD', query: 'RAM' },
    { label: 'Lacak Pesanan', page: 'orders' },
    { label: 'Jasa IT Workshop Depok', page: 'about' }
  ];

  const navLinks = [
    { label: 'Beranda', page: 'home' },
    { label: 'Katalog', page: 'shop' },
    { label: 'Pesanan', page: 'orders' },
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
        className={`sticky top-0 z-40 h-11 transition-colors duration-200 ${
          searchOpen
            ? 'bg-white border-b border-transparent'
            : isScrolled
            ? 'bg-white/80 backdrop-blur-[20px] border-b border-[#D2D2D7]'
            : 'bg-white/80 backdrop-blur-[20px] border-b border-transparent'
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
                className={wishlistCount > 0 ? 'fill-[#FF3B30] text-[#FF3B30]' : ''}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#D70015] text-white text-[9px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => handleLinkClick('admin')}
                className={`hidden md:inline-flex items-center gap-1.5 px-2 h-8 text-[12px] tracking-[-0.01em] transition-colors cursor-pointer ${
                  currentPage === 'admin'
                    ? 'text-[#0071E3] font-medium'
                    : 'text-[#1D1D1F]/80 hover:text-[#1D1D1F]'
                }`}
              >
                <SlidersHorizontal size={14} strokeWidth={1.7} />
                <span>Admin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => (isGuest ? openAuthModal('login') : handleLinkClick('orders'))}
                className="hidden md:inline-flex items-center gap-1.5 px-2 h-8 text-[12px] tracking-[-0.01em] text-[#1D1D1F]/80 hover:text-[#1D1D1F] transition-colors cursor-pointer"
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

            {/* Minimal Apple 2-line menu icon (mobile only < 768px) opening Fullscreen White MenuOverlay */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setSearchOpen(false);
              }}
              className="md:hidden w-9 h-9 -mr-1.5 flex items-center justify-center text-[#1D1D1F]"
              aria-label="Buka Menu"
            >
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <line x1="2" y1="6.25" x2="16" y2="6.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="2" y1="11.75" x2="16" y2="11.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

      </header>

      {/* Authentic apple.com/id Full-Width Search Curtain + Frosted Page Blur Backdrop */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 top-11 z-30 bg-black/25 backdrop-blur-md"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-11 inset-x-0 z-40 bg-white pt-6 sm:pt-9 pb-10 sm:pb-12 shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
              role="dialog"
              aria-modal="true"
              aria-label="Telusuri techcare.id"
            >
              <div className="max-w-[980px] mx-auto px-5 sm:px-6 space-y-7">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                  <Search size={20} strokeWidth={1.8} className="text-[#86868B] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Telusuri techcare.id"
                    className="flex-1 bg-transparent text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[44px]"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchValue('');
                        searchInputRef.current?.focus();
                      }}
                      className="w-9 h-9 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Hapus teks pencarian"
                    >
                      <X size={16} />
                    </button>
                  )}
                </form>

                {/* Tautan Cepat / Live Submit Option (exact Apple.com/id style) */}
                <div className="space-y-2.5 pl-0.5">
                  <p className="text-[12px] font-normal text-[#6E6E73]">
                    {searchValue.trim() ? 'Hasil pencarian' : 'Tautan Cepat'}
                  </p>
                  <ul className="space-y-1">
                    {searchValue.trim() ? (
                      <li>
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full py-2 px-2 -mx-2 rounded-[10px] hover:bg-[#F5F5F7] flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] transition-colors text-left cursor-pointer"
                        >
                          <ArrowRight size={14} strokeWidth={1.8} className="text-[#6E6E73] shrink-0" />
                          <span>
                            Telusuri &ldquo;{searchValue.trim()}&rdquo; di Katalog
                          </span>
                        </button>
                      </li>
                    ) : (
                      quickSearchLinks.map((item) => (
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.page) {
                                handleLinkClick(item.page);
                              } else {
                                if (onQuickSearch) onQuickSearch(item.query);
                                else onNavigate('shop');
                                setSearchOpen(false);
                              }
                            }}
                            className="w-full py-2 px-2 -mx-2 rounded-[10px] hover:bg-[#F5F5F7] flex items-center gap-3 text-[14px] font-medium text-[#1D1D1F] transition-colors text-left cursor-pointer"
                          >
                            <ArrowRight size={14} strokeWidth={1.8} className="text-[#6E6E73] shrink-0" />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage={currentPage}
      />
    </>
  );
}
