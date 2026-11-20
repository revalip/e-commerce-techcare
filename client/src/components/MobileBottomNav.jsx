import React from 'react';
import { Home, LayoutGrid, Package, Heart, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav({ currentPage, onNavigate }) {
  const { isAdmin, isGuest, openAuthModal } = useAuth();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();

  const items = [
    { key: 'home', label: 'Beranda', icon: Home, onClick: () => onNavigate('home') },
    {
      key: 'shop',
      label: 'Katalog',
      icon: LayoutGrid,
      onClick: () => onNavigate('shop'),
      activeMatch: ['shop', 'collections', 'product-detail']
    },
    {
      key: 'orders',
      label: 'Lacak',
      icon: Package,
      onClick: () => onNavigate('orders'),
      activeMatch: ['orders', 'order-detail']
    },
    {
      key: 'wishlist',
      label: 'Favorit',
      icon: Heart,
      badge: wishlistCount,
      onClick: () => setIsWishlistOpen(true)
    },
    isAdmin
      ? {
          key: 'admin',
          label: 'Admin',
          icon: LayoutDashboard,
          onClick: () => onNavigate('admin')
        }
      : {
          key: 'account',
          label: isGuest ? 'Masuk' : 'Akun',
          icon: User,
          onClick: () => (isGuest ? openAuthModal('login') : onNavigate('orders'))
        }
  ];

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E7EE]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.activeMatch
            ? item.activeMatch.includes(currentPage)
            : currentPage === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[48px] transition-colors ${
                isActive ? 'text-[#1D2129]' : 'text-[#8692A3] hover:text-[#1D2129]'
              }`}
            >
              <span
                className={`relative flex items-center justify-center w-9 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-[#ECEFF4]' : ''
                }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#1D2129] text-white font-mono text-[9px] font-semibold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center tabular-nums">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
