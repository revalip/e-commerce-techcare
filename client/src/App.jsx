import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { getProduct } from './services/api';

// Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CartToast from './components/CartToast';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AboutPage from './pages/AboutPage';
import LearnPage from './pages/LearnPage';

function safeDecode(val) {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

function parseRouteFromPath(pathname) {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  if (clean === '/') return { page: 'home' };
  if (clean === '/shop' || clean === '/katalog') return { page: 'shop' };
  if (clean === '/checkout') return { page: 'checkout' };
  if (clean === '/orders' || clean === '/lacak') return { page: 'orders' };
  if (clean === '/admin') return { page: 'admin' };
  if (clean === '/about' || clean === '/jasa-it') return { page: 'about' };
  if (clean === '/learn' || clean === '/edukasi') return { page: 'learn' };
  if (clean.startsWith('/product/')) {
    return { page: 'product-detail', slug: safeDecode(clean.replace('/product/', '')) };
  }
  if (clean.startsWith('/order/')) {
    return { page: 'order-detail', orderNumber: safeDecode(clean.replace('/order/', '')) };
  }
  return { page: 'home' };
}

function buildPathForRoute(page, param = '') {
  switch (page) {
    case 'home':
      return '/';
    case 'shop':
    case 'collections':
      return '/shop';
    case 'product-detail':
      return param ? `/product/${encodeURIComponent(param)}` : '/shop';
    case 'checkout':
      return '/checkout';
    case 'orders':
      return '/orders';
    case 'order-detail':
      return param ? `/order/${encodeURIComponent(param)}` : '/orders';
    case 'admin':
      return '/admin';
    case 'about':
      return '/about';
    case 'learn':
      return '/learn';
    default:
      return '/';
  }
}

function MainApp() {
  const initialRoute = parseRouteFromPath(window.location.pathname);

  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [activeOrderNumber, setActiveOrderNumber] = useState(initialRoute.orderNumber || null);

  const { setIsCartOpen } = useCart();
  const { isAdmin, openAuthModal } = useAuth();
  const lenisRef = useRef(null);

  // Lenis smooth inertial scrolling (Shopify Editions / Airform One motion feel)
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const pushPath = useCallback((page, param = '') => {
    const nextPath = buildPathForRoute(page, param);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ page, param }, '', nextPath);
    }
  }, []);

  // Muat produk bila deep-link langsung ke /product/:slug
  useEffect(() => {
    if (initialRoute.page === 'product-detail' && initialRoute.slug && !selectedProduct) {
      getProduct(initialRoute.slug).then((res) => {
        if (res.success && res.data) {
          setSelectedProduct(res.data);
        } else {
          setCurrentPage('shop');
        }
      });
    }
  }, []);

  // Dengarkan tombol Back/Forward browser
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseRouteFromPath(window.location.pathname);
      setCurrentPage(parsed.page);
      if (parsed.orderNumber) setActiveOrderNumber(parsed.orderNumber);
      if (parsed.page === 'product-detail' && parsed.slug) {
        getProduct(parsed.slug).then((res) => {
          if (res.success && res.data) setSelectedProduct(res.data);
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = (page) => {
    if (page === 'admin' && !isAdmin) {
      openAuthModal(
        'login',
        'Halaman ini khusus untuk Administrator TECHCARE. Silakan masuk dengan akun admin.',
        (loggedInUser) => {
          if (loggedInUser?.role === 'admin') {
            setCurrentPage('admin');
            pushPath('admin');
          }
        }
      );
      return;
    }
    if (page === 'shop') {
      setShopSearchQuery('');
    }
    setCurrentPage(page);
    pushPath(page);
    scrollToTop();
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    pushPath('product-detail', product?.slug || '');
    scrollToTop();
  };

  const handleSelectCollection = (collectionSlug) => {
    setSelectedCategory(collectionSlug);
    setShopSearchQuery('');
    setCurrentPage('shop');
    pushPath('shop');
    scrollToTop();
  };

  const handleQuickSearch = (query) => {
    setSelectedCategory('');
    setShopSearchQuery(query);
    setCurrentPage('shop');
    pushPath('shop');
    scrollToTop();
  };

  const handleOpenOrderDetail = (orderNumber) => {
    setActiveOrderNumber(orderNumber);
    setCurrentPage('order-detail');
    pushPath('order-detail', orderNumber);
    scrollToTop();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1D1D1F] overflow-x-clip">
      <Navbar
        onNavigate={handleNavigate}
        onQuickSearch={handleQuickSearch}
        currentPage={currentPage}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage
                onSelectProduct={handleSelectProduct}
                onNavigate={handleNavigate}
                onSelectCollection={handleSelectCollection}
                onQuickSearch={handleQuickSearch}
              />
            </motion.div>
          )}

          {(currentPage === 'shop' || currentPage === 'collections') && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <ShopPage
                onSelectProduct={handleSelectProduct}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                initialSearch={shopSearchQuery}
              />
            </motion.div>
          )}

          {currentPage === 'product-detail' && (
            <motion.div
              key={`product-${selectedProduct?.id || 'detail'}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProductDetailPage
                product={selectedProduct}
                onBack={() => handleNavigate('shop')}
                onDirectCheckout={() => handleNavigate('checkout')}
                onSelectProduct={handleSelectProduct}
              />
            </motion.div>
          )}

          {currentPage === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <CheckoutPage
                onBackToCart={() => handleNavigate('shop')}
                onOrderCompleted={handleOpenOrderDetail}
              />
            </motion.div>
          )}

          {currentPage === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <OrderHistoryPage
                onSelectOrder={handleOpenOrderDetail}
                onBackToShop={() => handleNavigate('shop')}
              />
            </motion.div>
          )}

          {currentPage === 'order-detail' && (
            <motion.div
              key={`order-${activeOrderNumber}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              <OrderDetailPage
                orderNumber={activeOrderNumber}
                onBackToOrders={() => handleNavigate('orders')}
                onBackToShop={() => handleNavigate('shop')}
              />
            </motion.div>
          )}

          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isAdmin ? (
                <AdminDashboard onBackToShop={() => handleNavigate('home')} />
              ) : (
                <div className="py-20 px-4 text-center">
                  <div className="max-w-md mx-auto bg-[#F5F5F7] rounded-[28px] p-10 space-y-4">
                    <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-[#1D1D1F]">
                      Akses khusus Admin
                    </h2>
                    <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                      Dashboard Admin dilindungi hak akses peran. Silakan masuk dengan akun Administrator TechCare.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login', 'Silakan masuk menggunakan akun admin.')}
                      className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal transition-colors cursor-pointer"
                    >
                      Masuk sebagai Admin
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AboutPage onExploreShop={() => handleNavigate('shop')} />
            </motion.div>
          )}

          {currentPage === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LearnPage onExploreShop={() => handleNavigate('shop')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onContinueShopping={() => handleNavigate('shop')}
      />

      <WishlistDrawer
        onSelectProduct={handleSelectProduct}
        onExploreShop={() => handleNavigate('shop')}
      />

      <CartToast onOpenCart={() => setIsCartOpen(true)} />
      <AuthModal />
      <Footer onNavigate={handleNavigate} onSelectCollection={handleSelectCollection} />
      {currentPage !== 'product-detail' && (
        <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
