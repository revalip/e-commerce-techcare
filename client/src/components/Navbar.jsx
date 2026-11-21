import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Heart,
  ChevronDown,
  ChevronRight,
  Search
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { mockCollections } from '../data/mock';
import TechCareLogo from './TechCareLogo';

export default function Navbar({ onNavigate, onSelectCollection, onQuickSearch, currentPage }) {
  const { totalItems, setIsCartOpen, cartBadgeBounce } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { user, isAdmin, isBuyer, isGuest, logout, openAuthModal } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const searchInputRef = useRef(null);

  // Auto-hide navbar when scrolling down, show immediately on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (mobileMenuOpen || catalogMenuOpen || searchOpen || y < 72) {
        setNavVisible(true);
      } else if (y > lastScrollY.current + 6) {
        setNavVisible(false);
      } else if (y < lastScrollY.current - 6) {
        setNavVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileMenuOpen, catalogMenuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  const navLinks = [
    { label: 'Beranda', page: 'home' },
    { label: 'Katalog', page: 'shop' },
    { label: 'Jasa IT', page: 'about' },
    { label: 'Standar QC', page: 'learn' },
    { label: 'Lacak', page: 'orders' }
  ];

  const handleLinkClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setCatalogMenuOpen(false);
    setSearchOpen(false);
  };

  const handleCategoryPick = (slug) => {
    if (onSelectCollection) {
      onSelectCollection(slug);
    } else {
      onNavigate('shop');
    }
    setCatalogMenuOpen(false);
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={false}
      animate={{ y: navVisible || shouldReduceMotion ? 0 : -64 }}
      transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseLeave={() => setCatalogMenuOpen(false)}
      className="sticky top-0 z-40 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-[#D2D2D7]/60"
    >
      {/* Thin Apple-style Global Bar (44px desktop, 48px mobile) */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-12 lg:h-11 flex items-center justify-between gap-2">
        {/* Left: Mobile Menu + Wordmark */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setSearchOpen(false);
            }}
            className="lg:hidden w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#1D1D1F] hover:bg-black/5 transition-colors"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={1.7} /> : <Menu size={18} strokeWidth={1.7} />}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 text-left shrink-0"
          >
            <TechCareLogo size={20} />
            <span className="font-display text-sm font-semibold tracking-[-0.03em] text-[#1D1D1F]">
              TechCare
            </span>
          </button>
        </div>

        {/* Center: Clean Flat Links (12px Apple scale, lg+) */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Navigasi Utama">
          {navLinks.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'shop' && currentPage === 'product-detail') ||
              (item.page === 'orders' && currentPage === 'order-detail');

            if (item.page === 'shop') {
              return (
                <button
                  key={item.page}
                  type="button"
                  onMouseEnter={() => {
                    setCatalogMenuOpen(true);
                    setSearchOpen(false);
                  }}
                  onClick={() => handleLinkClick(item.page)}
                  className={`inline-flex items-center gap-1 text-xs font-normal whitespace-nowrap transition-colors py-1 ${
                    isActive ? 'text-[#0071E3] font-medium' : 'text-[#1D1D1F]/80 hover:text-[#1D1D1F]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${catalogMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              );
            }

            return (
              <button
                key={item.page}
                type="button"
                onMouseEnter={() => setCatalogMenuOpen(false)}
                onClick={() => handleLinkClick(item.page)}
                className={`text-xs font-normal whitespace-nowrap transition-colors py-1 ${
                  isActive ? 'text-[#0071E3] font-medium' : 'text-[#1D1D1F]/80 hover:text-[#1D1D1F]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Account, Wishlist, Bag */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setCatalogMenuOpen(false);
              setMobileMenuOpen(false);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-black/5 transition-colors"
            aria-label="Cari produk"
            title="Cari produk"
          >
            <Search size={15} strokeWidth={1.7} />
          </button>

          {isGuest && (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="hidden sm:inline-flex items-center gap-1 h-8 px-2.5 rounded-full text-xs text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-black/5 transition-colors"
            >
              <User size={14} strokeWidth={1.7} />
              <span>Masuk</span>
            </button>
          )}

          {isBuyer && (
            <div className="hidden sm:flex items-center gap-1 pl-2 pr-1 h-8 rounded-full hover:bg-black/5 transition-colors">
              <button
                type="button"
                onClick={() => handleLinkClick('orders')}
                className="text-xs font-medium text-[#1D1D1F] truncate max-w-[90px] hover:text-[#0071E3]"
                title="Lihat pesanan saya"
              >
                {user?.name || 'Akun'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut size={12} />
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleLinkClick('admin')}
                className={`inline-flex items-center justify-center gap-1 h-8 px-2.5 rounded-full text-xs font-medium transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-[#0071E3] text-white'
                    : 'text-[#1D1D1F] hover:bg-black/5'
                }`}
                aria-label="Dashboard Admin"
              >
                <LayoutDashboard size={13} />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="hidden sm:inline-flex w-8 h-8 rounded-full items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/5"
                title="Keluar dari Admin"
                aria-label="Keluar dari Admin"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="hidden sm:flex relative w-8 h-8 rounded-full text-[#1D1D1F]/80 hover:text-[#1D1D1F] hover:bg-black/5 items-center justify-center transition-colors"
            aria-label="Produk Favorit"
            title="Favorit Saya"
          >
            <Heart
              size={15}
              strokeWidth={1.7}
              className={wishlistCount > 0 ? 'fill-[#0071E3] text-[#0071E3]' : ''}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#0071E3] text-white font-mono text-[9px] font-semibold min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          <motion.button
            type="button"
            animate={cartBadgeBounce ? { scale: [1, 1.09, 0.96, 1] } : {}}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-full bg-[#1D1D1F] hover:bg-[#0071E3] text-white text-xs font-medium transition-colors"
            aria-label="Buka Keranjang"
          >
            <ShoppingBag size={13} strokeWidth={1.8} />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="font-mono text-[11px] font-semibold tabular-nums">{totalItems}</span>
          </motion.button>
        </div>
      </div>

      {/* Inline Quick Search Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.16 }}
            className="border-t border-[#D2D2D7]/70 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2.5"
            >
              <Search size={15} className="text-[#6E6E73] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari Lenovo ThinkPad, ASUS, Logitech, MSI, RAM, SSD..."
                className="flex-1 bg-transparent text-sm text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none min-h-[38px]"
              />
              <button
                type="submit"
                className="px-4 min-h-[34px] rounded-full bg-[#0071E3] text-white text-xs font-medium hover:bg-[#0077ED] transition-colors"
              >
                Cari
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
                aria-label="Tutup pencarian"
              >
                <X size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Category Dropdown */}
      <AnimatePresence>
        {catalogMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="hidden lg:block absolute inset-x-0 top-11 bg-white/95 backdrop-blur-xl border-b border-[#D2D2D7]/70 shadow-tc-studio"
          >
            <div className="max-w-5xl mx-auto px-6 py-7">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6E6E73]">
                  Jelajahi Katalog TechCare
                </span>
                <button
                  type="button"
                  onClick={() => handleLinkClick('shop')}
                  className="inline-flex items-center gap-0.5 text-xs font-medium text-[#0071E3] hover:underline"
                >
                  <span>Lihat semua produk</span>
                  <ChevronRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {mockCollections.map((col) => (
                  <button
                    key={col.slug}
                    type="button"
                    onClick={() => handleCategoryPick(col.slug)}
                    className="group text-left p-3 rounded-2xl bg-[#F5F5F7] hover:bg-[#ECECEF] transition-colors flex flex-col gap-2.5"
                  >
                    <div className="h-20 w-full rounded-xl bg-white flex items-center justify-center p-2 overflow-hidden">
                      <img
                        src={col.gambar}
                        alt={col.nama}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1D1D1F] truncate">{col.nama}</p>
                      <p className="text-[11px] text-[#6E6E73] line-clamp-1 mt-0.5">{col.tagline}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer (< lg) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-[#D2D2D7] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => handleLinkClick(item.page)}
                    className={`w-full text-left px-4 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-[#0071E3] text-white' : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-3">
                <p className="px-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-[#6E6E73]">
                  Kategori
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {mockCollections.map((col) => (
                    <button
                      key={col.slug}
                      type="button"
                      onClick={() => handleCategoryPick(col.slug)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F]"
                    >
                      <img src={col.gambar} alt={col.nama} className="w-4 h-4 object-contain" />
                      <span>{col.nama}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-[#F5F5F7] flex items-center justify-between gap-2">
                {isGuest ? (
                  <button
                    type="button"
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
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1D1D1F] px-2 truncate">
                      <Package size={14} className="text-[#0071E3] shrink-0" />
                      <span className="truncate">
                        {user?.name} ({user?.role})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="min-h-[40px] px-4 rounded-full border border-[#D2D2D7] text-xs font-medium text-[#1D1D1F]"
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
