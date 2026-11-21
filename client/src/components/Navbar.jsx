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
  Heart,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { mockCollections } from '../data/mock';
import TechCareLogo from './TechCareLogo';

function ScrollProgressRing() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const r = 12;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - progress);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Kembali ke atas"
      aria-label="Progres scroll — kembali ke atas"
      className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center hover:bg-[#ECEFF4] transition-colors shrink-0"
    >
      <svg width="28" height="28" viewBox="0 0 30 30" className="-rotate-90">
        <circle
          cx="15"
          cy="15"
          r={r}
          fill="none"
          stroke="#DCE2EA"
          strokeWidth="2"
        />
        <circle
          cx="15"
          cy="15"
          r={r}
          fill="none"
          stroke="#1D2129"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

export default function Navbar({ onNavigate, onSelectCollection, currentPage }) {
  const { totalItems, setIsCartOpen, cartBadgeBounce } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { user, isAdmin, isBuyer, isGuest, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogMenuOpen, setCatalogMenuOpen] = useState(false);

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
    setCatalogMenuOpen(false);
  };

  const handleCategoryPick = (slug) => {
    if (onSelectCollection) {
      onSelectCollection(slug);
    } else {
      onNavigate('shop');
    }
    setCatalogMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header
      onMouseLeave={() => setCatalogMenuOpen(false)}
      className="sticky top-0 z-40 bg-[#F7F8FA]/95 backdrop-blur-md border-b border-[#E2E7EE] shadow-[0_1px_8px_rgba(29,33,41,0.04)]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: Hamburger (< lg) + Minimal Airform Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 -ml-1.5 rounded-full flex items-center justify-center text-[#1D2129] hover:bg-[#ECEFF4] transition-colors"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={19} strokeWidth={1.9} /> : <Menu size={19} strokeWidth={1.9} />}
          </button>

          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 text-left group shrink-0"
          >
            <TechCareLogo size={26} className="group-hover:scale-105 transition-transform" />
            <span className="font-display text-base sm:text-lg font-semibold tracking-[-0.04em] text-[#1D2129]">
              TechCare
            </span>
          </button>
        </div>

        {/* Center: Floating Studio Pill Navigation (Airform One DNA, lg+) */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-white border border-[#E2E7EE] rounded-full p-1 shadow-[0_2px_10px_rgba(29,33,41,0.03)]"
          aria-label="Navigasi Utama"
        >
          {navLinks.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'shop' && currentPage === 'product-detail') ||
              (item.page === 'orders' && currentPage === 'order-detail');
            if (item.page === 'shop') {
              return (
                <button
                  key={item.page}
                  onMouseEnter={() => setCatalogMenuOpen(true)}
                  onClick={() => handleLinkClick(item.page)}
                  className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#1D2129] text-white'
                      : 'text-[#647082] hover:text-[#1D2129] hover:bg-[#F7F8FA]'
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
                onMouseEnter={() => setCatalogMenuOpen(false)}
                onClick={() => handleLinkClick(item.page)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1D2129] text-white'
                    : 'text-[#647082] hover:text-[#1D2129] hover:bg-[#F7F8FA]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls — Clean Studio Pills + Scroll Progress Ring */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isGuest && (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full text-xs font-medium text-[#4F627A] hover:text-[#1D2129] hover:bg-[#ECEFF4] transition-colors"
            >
              <User size={14} />
              <span>Masuk</span>
            </button>
          )}

          {isBuyer && (
            <div className="hidden sm:flex items-center gap-1 bg-white border border-[#E2E7EE] rounded-full pl-3.5 pr-1 h-[40px]">
              <button
                onClick={() => handleLinkClick('orders')}
                className="text-xs font-medium text-[#1D2129] truncate max-w-[92px] lg:max-w-[115px] hover:text-[#4F627A]"
                title="Lihat pesanan saya"
              >
                {user?.name || 'Buyer'}
              </button>
              <button
                onClick={logout}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#647082] hover:text-[#1D2129] hover:bg-[#F7F8FA] transition-colors"
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
                onClick={() => handleLinkClick('admin')}
                className={`inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3 rounded-full text-xs font-medium transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-[#1D2129] text-white'
                    : 'bg-white border border-[#DCE2EA] text-[#1D2129] hover:border-[#1D2129]'
                }`}
                aria-label="Dashboard Admin"
              >
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={logout}
                className="hidden sm:inline-flex w-9 h-9 rounded-full items-center justify-center text-[#647082] hover:text-[#1D2129] hover:bg-[#ECEFF4] transition-colors"
                title="Keluar dari Admin"
                aria-label="Keluar dari Admin"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Wishlist (hidden < sm because Favorit is in MobileBottomNav) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="hidden sm:flex relative w-10 h-10 rounded-full bg-white border border-[#E2E7EE] hover:border-[#1D2129] text-[#1D2129] items-center justify-center transition-colors"
            aria-label="Produk Favorit"
            title="Favorit Saya"
          >
            <Heart
              size={15}
              className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-semibold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Airform One Charcoal Pill Cart Button */}
          <motion.button
            animate={cartBadgeBounce ? { scale: [1, 1.09, 0.96, 1] } : {}}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-3.5 sm:px-4 rounded-full bg-[#1D2129] hover:bg-[#323846] text-white text-xs font-medium transition-colors"
            aria-label="Buka Keranjang"
          >
            <ShoppingBag size={14} strokeWidth={2} />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="bg-white/15 text-white font-mono text-[11px] font-semibold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center tabular-nums">
              {totalItems}
            </span>
          </motion.button>

          {/* Airform One Circular Scroll Progress Ring */}
          <ScrollProgressRing />
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
            className="lg:hidden bg-white border-b border-[#E2E7EE] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5">
              {navLinks.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleLinkClick(item.page)}
                    className={`w-full text-left px-4 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1D2129] text-white'
                        : 'text-[#4F627A] hover:bg-[#F7F8FA] hover:text-[#1D2129]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-2">
                <p className="px-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-[#8692A3]">
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
                      <img
                        src={col.gambar}
                        alt={col.nama}
                        className="w-4 h-4 object-contain"
                      />
                      <span>{col.nama}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-[#ECEFF4] flex items-center justify-between gap-2">
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
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1D2129] px-2 truncate">
                      <Package size={14} className="text-[#4F627A] shrink-0" />
                      <span className="truncate">
                        {user?.name} ({user?.role})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="min-h-[42px] px-4 rounded-full border border-[#DCE2EA] text-xs font-medium text-[#1D2129] hover:border-[#1D2129]"
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
      {/* Apple × Xiaomi Visual Category Mega-Menu (lg+) */}
      <AnimatePresence>
        {catalogMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="hidden lg:block absolute inset-x-0 top-16 bg-white/98 backdrop-blur-md border-b border-[#E2E7EE] shadow-[0_14px_32px_rgba(29,33,41,0.08)]"
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8692A3]">
                  Pilih Kategori Perangkat
                </span>
                <button
                  type="button"
                  onClick={() => handleLinkClick('shop')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#1D2129] hover:text-[#4F627A]"
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
                      <p className="text-[11px] text-[#647082] line-clamp-1 mt-0.5">
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
    </header>
  );
}
