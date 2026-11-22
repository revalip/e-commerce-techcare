import React from 'react';
import { Home, LayoutGrid, Package, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Apple Store iOS Liquid Glass 4-Tab Mobile Navigation Bar:
 * - Strictly 4 primary destinations (Beranda, Katalog, Pesanan, Akun/Admin)
 * - >= 48px tap targets & >= 11px legible labels (Apple UI Design Dos & Don'ts)
 * - Translucent frosted backdrop-blur-xl surface
 */
export default function MobileBottomNav({ currentPage, onNavigate }) {
  const { isAdmin, isGuest, openAuthModal } = useAuth();

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
      label: 'Pesanan',
      icon: Package,
      onClick: () => onNavigate('orders'),
      activeMatch: ['orders', 'order-detail']
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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-t border-black/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 h-[60px] max-w-md mx-auto px-2">
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
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[48px] transition-colors cursor-pointer ${
                isActive ? 'text-[#0071E3]' : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.1 : 1.6} />
              <span className={`text-[11px] leading-none ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
