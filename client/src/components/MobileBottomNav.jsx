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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-6px_24px_rgba(11,18,32,0.08)]"
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
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[48px] rounded-xl transition-colors ${
                isActive ? 'text-[#0B5FFF] font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <span
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                  isActive ? 'bg-[#EEF4FF]' : ''
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 1.9} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-0.5 bg-[#F97316] text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
