import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

const STORAGE_KEY_WISHLIST = 'techcare_wishlist_v1';

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlistIds]);

  const isWishlisted = (productId) => {
    return wishlistIds.some((id) => String(id) === String(productId));
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const exists = isWishlisted(product.id);

    setWishlistIds((prev) =>
      exists
        ? prev.filter((id) => String(id) !== String(product.id))
        : [product.id, ...prev]
    );

    setWishlistToast({
      id: Date.now(),
      added: !exists,
      message: !exists
        ? `"${product.nama}" disimpan ke Favorit`
        : `"${product.nama}" dihapus dari Favorit`
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => String(id) !== String(productId)));
  };

  const clearWishlist = () => setWishlistIds([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        wishlistToast,
        setWishlistToast
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
