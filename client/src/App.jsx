import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CartToast from './components/CartToast';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AboutPage from './pages/AboutPage';
import LearnPage from './pages/LearnPage';

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeOrderNumber, setActiveOrderNumber] = useState(null);

  const { setIsCartOpen } = useCart();
  const { isAdmin, openAuthModal } = useAuth();

  const handleNavigate = (page) => {
    // Admin access gate
    if (page === 'admin' && !isAdmin) {
      openAuthModal('login', 'Halaman ini khusus untuk Administrator TechCare. Silakan masuk dengan akun admin.');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCollection = (collectionSlug) => {
    setSelectedCategory(collectionSlug);
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (orderNumber) => {
    setActiveOrderNumber(orderNumber);
    setCurrentPage('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-[#111113]">
      {/* Auto-Hide Sticky Navbar */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Pages */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            onSelectCollection={handleSelectCollection}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentPage === 'collections' && (
          <ShopPage
            onSelectProduct={handleSelectProduct}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => handleNavigate('shop')}
            onDirectCheckout={() => handleNavigate('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBackToCart={() => handleNavigate('shop')}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {currentPage === 'orders' && (
          <OrderHistoryPage
            onSelectOrder={(num) => {
              setActiveOrderNumber(num);
            }}
            onBackToShop={() => handleNavigate('shop')}
          />
        )}

        {currentPage === 'admin' && (
          isAdmin ? (
            <AdminDashboard
              onBackToShop={() => handleNavigate('home')}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-sm text-neutral-500 mb-4">Akses terbatas hanya untuk akun Administrator.</p>
              <button
                onClick={() => openAuthModal('login', 'Silakan masuk menggunakan akun admin.')}
                className="px-6 py-2.5 bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider"
              >
                Masuk Admin
              </button>
            </div>
          )
        )}

        {currentPage === 'about' && (
          <AboutPage
            onExploreShop={() => handleNavigate('shop')}
          />
        )}

        {currentPage === 'learn' && (
          <LearnPage
            onExploreShop={() => handleNavigate('shop')}
          />
        )}
      </main>

      {/* Cart Drawer (Right in Desktop, Bottom Sheet in Mobile) */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onContinueShopping={() => handleNavigate('shop')}
      />

      {/* Cart Toast Notification with Undo Button */}
      <CartToast onOpenCart={() => setIsCartOpen(true)} />

      {/* Global Auth Modal (Login & Register Buyer) */}
      <AuthModal />

      {/* Minimalist Monochrome Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
