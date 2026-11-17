import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Laptop, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentPage }) {
  const { totalItems, setIsCartOpen, cartBadgeBounce } = useCart();
  const { user, isAdmin, isBuyer, isGuest, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Auto-hide navbar logic
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false); // Scroll down -> hide
      } else {
        setIsVisible(true); // Scroll up -> show
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Shop', page: 'shop' },
    { label: 'Collection', page: 'collections' },
    { label: 'About', page: 'about' },
    { label: 'Learn', page: 'learn' },
  ];

  const handleLinkClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -90 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#f0f0f2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-[12px] font-medium tracking-[0.16em] text-neutral-600">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.page)}
              className={`hover:text-black transition-colors uppercase ${
                currentPage === item.page ? 'text-black font-semibold' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-neutral-800 hover:text-black focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex-1 md:flex-initial text-center">
          <button
            onClick={() => handleLinkClick('home')}
            className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-normal text-black hover:opacity-85 transition-opacity flex items-center justify-center space-x-2"
          >
            <Laptop size={20} className="text-neutral-900 hidden sm:inline" />
            <span>TECHCARE</span>
          </button>
        </div>

        {/* Right: Account Auth & Cart */}
        <div className="flex items-center space-x-3 sm:space-x-4 text-[12px] font-medium tracking-[0.14em]">
          
          {/* GUEST: Tombol Masuk / Daftar */}
          {isGuest && (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-neutral-300 hover:border-black text-neutral-800 hover:text-black text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              <User size={13} />
              <span>Masuk / Daftar</span>
            </button>
          )}

          {/* BUYER LOGGED IN */}
          {isBuyer && (
            <div className="relative">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleLinkClick('orders')}
                  className="hidden sm:inline-flex items-center space-x-1 text-neutral-600 hover:text-black uppercase text-[11px] font-semibold transition-colors"
                  title="Lihat riwayat pesanan"
                >
                  <Package size={14} />
                  <span>Pesanan Saya</span>
                </button>

                <div className="flex items-center space-x-1.5 bg-neutral-100/80 px-2.5 py-1 rounded-full text-[11px]">
                  <span className="font-semibold text-neutral-900 truncate max-w-[100px] sm:max-w-[130px]">
                    {user?.name || 'Buyer'}
                  </span>
                  <button
                    onClick={logout}
                    className="text-neutral-400 hover:text-red-600 ml-1 p-0.5 transition-colors"
                    title="Keluar"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN LOGGED IN */}
          {isAdmin && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => handleLinkClick('admin')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  currentPage === 'admin'
                    ? 'bg-black text-white'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <LayoutDashboard size={12} />
                <span>Dashboard Admin</span>
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

          {/* Cart Trigger with Bounce Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-neutral-900 hover:text-black transition-colors"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag size={18} strokeWidth={1.8} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.6 }}
                animate={{ scale: cartBadgeBounce ? [1, 1.35, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-neutral-200 px-6 py-5 space-y-4 text-xs font-semibold tracking-[0.16em] overflow-hidden"
          >
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.page)}
                className="block w-full text-left py-2 hover:text-neutral-500 transition-colors uppercase"
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-neutral-100 space-y-3">
              {isGuest && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 bg-black text-white rounded-full text-center text-xs uppercase tracking-wider font-semibold"
                >
                  Masuk / Buat Akun
                </button>
              )}

              {isBuyer && (
                <div className="space-y-2">
                  <div className="text-[11px] text-neutral-500">
                    Masuk sebagai: <strong className="text-black">{user?.name}</strong>
                  </div>
                  <button
                    onClick={() => handleLinkClick('orders')}
                    className="block w-full text-left py-1.5 text-xs text-neutral-800 uppercase"
                  >
                    Riwayat Pesanan Saya
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1.5 text-xs text-red-600 uppercase"
                  >
                    Keluar (Logout)
                  </button>
                </div>
              )}

              {isAdmin && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleLinkClick('admin')}
                    className="w-full py-2 bg-black text-white rounded-full text-center text-xs uppercase tracking-wider font-semibold"
                  >
                    Buka Dashboard Admin
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center py-1.5 text-xs text-red-600 uppercase"
                  >
                    Keluar dari Admin
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
