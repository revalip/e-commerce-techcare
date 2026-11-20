import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  Laptop,
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
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
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
    { label: 'Katalog', page: 'shop' },
    { label: 'Lacak Pesanan', page: 'orders' },
    { label: 'Jasa IT', page: 'about' },
    { label: 'Edukasi QC', page: 'learn' }
  ];

  const handleLinkClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -90 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-neutral-800 hover:text-black focus:outline-none"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Left: Brand Logo (clean retail alignment) */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center space-x-2 text-left hover:opacity-85 transition-opacity shrink-0"
        >
          <span className="w-8 h-8 rounded-xl bg-neutral-900 text-white hidden lg:flex items-center justify-center">
            <Laptop size={16} />
          </span>
          <div>
            <span className="font-serif text-lg sm:text-xl lg:text-2xl tracking-[0.14em] lg:tracking-[0.16em] font-medium text-black block leading-none">
              TECHCARE
            </span>
            <span className="hidden lg:block text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mt-0.5">
              IT Service & Second
            </span>
          </div>
        </button>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-7 text-[11px] lg:text-[12px] font-semibold tracking-[0.06em] lg:tracking-[0.1em] text-neutral-500">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.page)}
              className={`hover:text-black transition-colors uppercase relative py-1 whitespace-nowrap ${
                currentPage === item.page ||
                (item.page === 'orders' && currentPage === 'order-detail')
                  ? 'text-black'
                  : ''
              }`}
            >
              {item.label}
              {(currentPage === item.page ||
                (item.page === 'orders' && currentPage === 'order-detail')) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-black rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right: Account, Wishlist Heart & Cart */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Auth Controls */}
          {isGuest && (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-neutral-200 hover:border-black text-neutral-800 hover:text-black text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              <User size={13} />
              <span>Masuk</span>
            </button>
          )}

          {isBuyer && (
            <div className="hidden sm:flex items-center space-x-1.5 bg-neutral-100 px-2.5 lg:px-3 py-1.5 rounded-full text-[11px]">
              <button
                onClick={() => handleLinkClick('orders')}
                className="font-semibold text-neutral-900 truncate max-w-[72px] lg:max-w-[100px] hover:underline"
                title="Lihat pesanan saya"
              >
                {user?.name || 'Buyer'}
              </button>
              <button
                onClick={logout}
                className="text-neutral-400 hover:text-red-600 p-0.5 transition-colors"
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleLinkClick('admin')}
                className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  currentPage === 'admin'
                    ? 'bg-black text-white'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <LayoutDashboard size={12} />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center text-neutral-400 hover:text-red-600 p-1.5 transition-colors"
                title="Keluar dari Admin"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-neutral-100 text-neutral-800 hover:text-black transition-colors"
            aria-label="Produk Favorit"
            title="Favorit Saya"
          >
            <Heart
              size={18}
              className={wishlistCount > 0 ? 'fill-neutral-900 text-neutral-900' : ''}
            />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <motion.button
            animate={cartBadgeBounce ? { scale: [1, 1.15, 0.95, 1] } : {}}
            transition={{ duration: 0.35 }}
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-3.5 py-2 rounded-full transition-colors shadow-xs"
            aria-label="Buka Keranjang"
          >
            <ShoppingBag size={15} />
            <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-wider">
              Keranjang
            </span>
            <span className="bg-white text-black text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.page)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    currentPage === item.page
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                {isGuest ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full py-3 rounded-full bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <User size={14} />
                    <span>Masuk / Daftar Akun</span>
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 px-2">
                      <Package size={14} />
                      <span>{user?.name} ({user?.role})</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase"
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
