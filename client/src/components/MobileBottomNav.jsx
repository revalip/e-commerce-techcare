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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F2F1EC] border-t border-[#111111]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto divide-x divide-[#D6D4CC]/70">
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
                isActive
                  ? 'text-[#111111] bg-[#E7E5DE]/60'
                  : 'text-[#6E6D68] hover:text-[#111111]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 inset-x-0 h-[2px] bg-[#E63B19]" />
              )}
              <span className="relative flex items-center justify-center">
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#E63B19] text-white font-mono text-[9px] font-bold min-w-[15px] h-[15px] px-1 flex items-center justify-center tabular-nums">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.06em] leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
