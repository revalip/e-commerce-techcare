import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowUpRight,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);

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
    <header
      onMouseLeave={() => setCatalogMenuOpen(false)}
      className="sticky top-0 z-40 bg-[#F7F8FA]/80 backdrop-blur-xl border-b border-[#E2E7EE]/80"
    >
      {/* Apple-style Thin Sticky Bar (h-12 on desktop, h-14 on touch mobile) */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 lg:h-12 flex items-center justify-between gap-2">
        {/* Left: Hamburger (< lg) + Minimal Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setSearchOpen(false);
            }}
            className="lg:hidden w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#1D2129] hover:bg-[#ECEFF4] transition-colors"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 text-left group shrink-0"
          >
            <TechCareLogo size={22} className="group-hover:scale-105 transition-transform" />
            <span className="font-display text-sm sm:text-base font-semibold tracking-[-0.04em] text-[#1D2129]">
              TechCare
            </span>
          </button>
        </div>

        {/* Center: Clean Flat Apple-Style Navigation Links (lg+) */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigasi Utama">
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
                  className={`inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap transition-colors py-1 ${
                    isActive ? 'text-[#0071E3]' : 'text-[#1D2129]/80 hover:text-[#1D2129]'
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
                className={`text-xs font-medium whitespace-nowrap transition-colors py-1 ${
                  isActive ? 'text-[#0071E3]' : 'text-[#1D2129]/80 hover:text-[#1D2129]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search + Account + Wishlist + Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              setCatalogMenuOpen(false);
              setMobileMenuOpen(false);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#1D2129]/80 hover:text-[#1D2129] hover:bg-[#ECEFF4] transition-colors"
            aria-label="Cari produk"
            title="Cari produk"
          >
            <Search size={16} strokeWidth={1.8} />
          </button>

          {isGuest && (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="hidden sm:inline-flex items-center gap-1 h-9 px-2.5 rounded-full text-xs font-medium text-[#1D2129]/80 hover:text-[#1D2129] hover:bg-[#ECEFF4] transition-colors"
            >
              <User size={14} strokeWidth={1.8} />
              <span>Masuk</span>
            </button>
          )}

          {isBuyer && (
            <div className="hidden sm:flex items-center gap-1 pl-2 pr-1 h-9 rounded-full hover:bg-[#ECEFF4]/70 transition-colors">
              <button
                type="button"
                onClick={() => handleLinkClick('orders')}
                className="text-xs font-medium text-[#1D2129] truncate max-w-[90px] hover:text-[#0071E3]"
                title="Lihat pesanan saya"
              >
                {user?.name || 'Akun'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#6E6E73] hover:text-[#1D2129]"
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleLinkClick('admin')}
                className={`inline-flex items-center justify-center gap-1 h-9 px-2.5 rounded-full text-xs font-medium transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-[#0071E3] text-white'
                    : 'text-[#1D2129] hover:bg-[#ECEFF4]'
                }`}
                aria-label="Dashboard Admin"
              >
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="hidden sm:inline-flex w-8 h-8 rounded-full items-center justify-center text-[#6E6E73] hover:text-[#1D2129] hover:bg-[#ECEFF4]"
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
            className="hidden sm:flex relative w-9 h-9 rounded-full text-[#1D2129]/80 hover:text-[#1D2129] hover:bg-[#ECEFF4] items-center justify-center transition-colors"
            aria-label="Produk Favorit"
            title="Favorit Saya"
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white font-mono text-[9px] font-semibold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          <motion.button
            type="button"
            animate={cartBadgeBounce ? { scale: [1, 1.09, 0.96, 1] } : {}}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full bg-[#1D2129] hover:bg-[#0071E3] text-white text-xs font-medium transition-colors"
            aria-label="Buka Keranjang"
          >
            <ShoppingBag size={14} strokeWidth={1.9} />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="font-mono text-[11px] font-semibold tabular-nums">
              {totalItems}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Apple-style Slide-Down Quick Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.16 }}
            className="border-t border-[#E2E7EE] bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2.5"
            >
              <Search size={16} className="text-[#6E6E73] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari ThinkPad, MacBook Air, RAM SODIMM, SSD NVMe, Monitor..."
                className="flex-1 bg-transparent text-sm text-[#1D2129] placeholder:text-[#8692A3] focus:outline-none min-h-[40px]"
              />
              <button
                type="submit"
                className="px-4 min-h-[36px] rounded-full bg-[#0071E3] text-white text-xs font-medium hover:bg-[#0077ED] transition-colors"
              >
                Cari
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6E6E73] hover:text-[#1D2129]"
                aria-label="Tutup pencarian"
              >
                <X size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple-style Desktop Category Mega-Menu */}
      <AnimatePresence>
        {catalogMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="hidden lg:block absolute inset-x-0 top-12 bg-white/95 backdrop-blur-xl border-b border-[#E2E7EE] shadow-[0_14px_32px_rgba(29,33,41,0.08)]"
          >
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6E6E73]">
                  Jelajahi Kategori
                </span>
                <button
                  type="button"
                  onClick={() => handleLinkClick('shop')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0071E3] hover:underline"
                >
                  <span>Lihat Semua Katalog</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {mockCollections.map((col) => (
                  <button
                    key={col.slug}
                    type="button"
                    onClick={() => handleCategoryPick(col.slug)}
                    className="group text-left p-3 rounded-2xl bg-[#F7F8FA] hover:bg-[#ECEFF4] border border-[#E2E7EE] transition-colors flex flex-col gap-2.5"
                  >
                    <div className="h-20 w-full rounded-xl bg-white flex items-center justify-center p-2 overflow-hidden">
                      <img
                        src={col.gambar}
                        alt={col.nama}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="font-display text-xs font-semibold text-[#1D2129] truncate">
                        {col.nama}
                      </p>
                      <p className="text-[11px] text-[#6E6E73] line-clamp-1 mt-0.5">
                        {col.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer (< lg) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-[#E2E7EE] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5">
              {navLinks.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => handleLinkClick(item.page)}
                    className={`w-full text-left px-4 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#0071E3] text-white'
                        : 'text-[#4F627A] hover:bg-[#F7F8FA] hover:text-[#1D2129]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-2">
                <p className="px-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-[#6E6E73]">
                  Kategori Produk
                </p>
                <div className="flex flex-wrap gap-2 px-3">
                  {mockCollections.map((col) => (
                    <button
                      key={col.slug}
                      type="button"
                      onClick={() => handleCategoryPick(col.slug)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F8FA] border border-[#E2E7EE] text-xs font-medium text-[#1D2129]"
                    >
                      <img src={col.gambar} alt={col.nama} className="w-4 h-4 object-contain" />
                      <span>{col.nama}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-[#ECEFF4] flex items-center justify-between gap-2">
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
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1D2129] px-2 truncate">
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
                      className="min-h-[42px] px-4 rounded-full border border-[#DCE2EA] text-xs font-medium text-[#1D2129]"
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
    </header>
  );
}
