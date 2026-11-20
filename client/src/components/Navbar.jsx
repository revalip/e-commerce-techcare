import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  Cpu,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Heart,
  ShieldCheck,
  Truck
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
      if (currentScrollY > 120 && currentScrollY > lastScrollY) {
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
    { label: 'Lacak Pesanan', page: 'orders' },
    { label: 'Jasa IT', page: 'about' },
    { label: 'Panduan QC', page: 'learn' }
  ];

  const handleLinkClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -110 }}
      transition={{ duration: 0.24, ease: 'easeInOut' }}
      className="sticky top-0 z-40"
    >
      {/* Top Tech Retail Trust Bar */}
      <div className="bg-[#0B1220] text-slate-200 text-[11px] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 truncate">
            <span className="inline-flex items-center gap-1.5 font-medium truncate">
              <ShieldCheck size={13} className="text-[#38BDF8] shrink-0" />
              <span className="truncate">Lulus 32 Titik QC Teknisi • Garansi Toko 30–90 Hari</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
              <Truck size={13} className="text-[#F97316] shrink-0" />
              <span>Gratis Ongkir Jabodetabek min. Rp 5 Juta</span>
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Toko IT Terpercaya UMKM
          </span>
        </div>
      </div>

      {/* Main White Glass Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(11,18,32,0.04)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Mobile & Tablet Hamburger (< lg) */}
          <div className="lg:hidden flex items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 -ml-1.5 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-[#0B5FFF] transition-colors"
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {/* Brand Identity */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 text-left group shrink-0"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#0B5FFF] to-[#0847C4] text-white flex items-center justify-center shadow-tc-primary group-hover:scale-105 transition-transform">
              <Cpu size={17} strokeWidth={2.2} />
            </span>
            <div>
              <span className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#0B1220] block leading-none">
                TECH<span className="text-[#0B5FFF]">CARE</span>
              </span>
              <span className="hidden lg:block text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
                IT Retail &amp; Service
              </span>
            </div>
          </button>

          {/* Desktop Nav Links (lg+) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'shop' && currentPage === 'product-detail') ||
                (item.page === 'orders' && currentPage === 'order-detail');
              return (
                <button
                  key={item.page}
                  onClick={() => handleLinkClick(item.page)}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#EEF4FF] text-[#0B5FFF]'
                      : 'text-slate-600 hover:text-[#0B1220] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isGuest && (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[42px] px-3.5 rounded-xl border border-slate-200 hover:border-[#0B5FFF] hover:bg-[#EEF4FF]/60 text-slate-800 hover:text-[#0B5FFF] text-xs font-semibold transition-all"
              >
                <User size={14} />
                <span>Masuk</span>
              </button>
            )}

            {isBuyer && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 pl-3 pr-1.5 py-1 rounded-xl text-xs">
                <button
                  onClick={() => handleLinkClick('orders')}
                  className="font-semibold text-slate-800 truncate max-w-[96px] lg:max-w-[115px] hover:text-[#0B5FFF]"
                  title="Lihat pesanan saya"
                >
                  {user?.name || 'Buyer'}
                </button>
                <button
                  onClick={logout}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
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
                  className={`inline-flex items-center justify-center gap-1.5 min-h-[42px] px-2.5 sm:px-3.5 rounded-xl text-xs font-semibold transition-all ${
                    currentPage === 'admin'
                      ? 'bg-[#0B5FFF] text-white shadow-tc-primary'
                      : 'bg-[#0B1220] text-white hover:bg-[#162238]'
                  }`}
                  aria-label="Dashboard Admin"
                >
                  <LayoutDashboard size={15} />
                  <span className="hidden sm:inline">Admin</span>
                </button>
                <button
                  onClick={logout}
                  className="hidden sm:inline-flex w-10 h-10 rounded-xl items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Keluar dari Admin"
                  aria-label="Keluar dari Admin"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}

            {/* Wishlist Button (hidden on < sm because Favorit is in Mobile Bottom Nav) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden sm:flex relative w-11 h-11 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-[#0B5FFF] items-center justify-center transition-colors"
              aria-label="Produk Favorit"
              title="Favorit Saya"
            >
              <Heart
                size={19}
                className={wishlistCount > 0 ? 'fill-[#F97316] text-[#F97316]' : ''}
              />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#F97316] text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <motion.button
              animate={cartBadgeBounce ? { scale: [1, 1.12, 0.96, 1] } : {}}
              transition={{ duration: 0.35 }}
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-2.5 sm:px-3.5 bg-[#0B5FFF] hover:bg-[#0847C4] text-white rounded-xl transition-all shadow-tc-primary"
              aria-label="Buka Keranjang"
            >
              <ShoppingBag size={16} />
              <span className="hidden lg:inline text-xs font-semibold">Keranjang</span>
              <span className="bg-white text-[#0B5FFF] text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-lg flex items-center justify-center tabular-nums">
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
            className="lg:hidden bg-white border-b border-slate-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5">
              {navLinks.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleLinkClick(item.page)}
                    className={`w-full text-left px-4 min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#EEF4FF] text-[#0B5FFF]'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                {isGuest ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="tc-btn-primary w-full"
                  >
                    <User size={15} />
                    <span>Masuk / Daftar Akun</span>
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 px-2 truncate">
                      <Package size={15} className="text-[#0B5FFF] shrink-0" />
                      <span className="truncate">
                        {user?.name} ({user?.role})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="min-h-[40px] px-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold"
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
