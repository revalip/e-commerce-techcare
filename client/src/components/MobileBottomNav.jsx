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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
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
              className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[48px] transition-colors ${
                isActive ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-black" />
              )}
              <span className="relative">
                <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] leading-none tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
