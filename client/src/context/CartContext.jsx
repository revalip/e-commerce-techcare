import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

const STORAGE_KEY_CART = 'techcare_cart_state_v2';

function buildVariantKey(itemId, warna, specLabel = '') {
  return `${itemId}__${warna || 'Standard'}__${specLabel || 'Default'}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);
  const prevCount = useRef(items.reduce((acc, i) => acc + i.jumlah, 0));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }

    const currentCount = items.reduce((acc, i) => acc + i.jumlah, 0);
    if (currentCount > prevCount.current) {
      setCartBadgeBounce(true);
      const timer = setTimeout(() => setCartBadgeBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevCount.current = currentCount;
  }, [items]);

  // Tambah item ke keranjang dengan dukungan warna, konfigurasi spec (RAM/SSD), dan harga dinamis
  const addToCart = (product, jumlah = 1, warna = null, options = {}) => {
    const selectedColor = warna || (product.varianWarna && product.varianWarna[0]?.nama) || 'Standard';

    // Default spec jika ditambahkan langsung dari kartu katalog
    const defaultRam = product.specOptions?.ram?.[0]?.label || null;
    const defaultSsd = product.specOptions?.ssd?.[0]?.label || null;
    const defaultTier = product.specOptions?.tier?.[0]?.label || null;

    const selectedRam = options.ram !== undefined ? options.ram : defaultRam;
    const selectedSsd = options.ssd !== undefined ? options.ssd : defaultSsd;
    const selectedTier = options.tier !== undefined ? options.tier : defaultTier;

    const specParts = [selectedRam, selectedSsd, selectedTier].filter(Boolean);
    const specLabel = options.specLabel || specParts.join(' • ');
    const unitPrice = options.harga !== undefined ? Number(options.harga) : Number(product.harga);
    const variantKey = buildVariantKey(product.id, selectedColor, specLabel);

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.variantKey === variantKey);

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          jumlah: copy[existingIdx].jumlah + jumlah
        };
        return copy;
      }

      return [
        ...prev,
        {
          variantKey,
          id: product.id,
          brand: product.brand || 'TECHCARE',
          nama: product.nama,
          slug: product.slug,
          harga: unitPrice,
          beratGram: Number(product.beratGram) || 1000,
          stokTersedia: Number(product.stok) || 10,
          gambar: product.gambar ? product.gambar[0] : '/images/products/thinkpad-x1-carbon-front.jpg',
          warna: selectedColor,
          specLabel,
          kondisi: product.kondisi || 'Second Grade A',
          jumlah
        }
      ];
    });

    setToast({
      id: Date.now(),
      message: `"${product.nama}"${specLabel ? ` (${specLabel})` : ''} masuk keranjang`,
      variantKey,
      product,
      jumlah,
      warna: selectedColor,
      specLabel
    });
  };

  const undoAddToCart = (toastItem) => {
    if (!toastItem) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.variantKey === toastItem.variantKey);
      if (idx > -1) {
        const copy = [...prev];
        if (copy[idx].jumlah > toastItem.jumlah) {
          copy[idx] = { ...copy[idx], jumlah: copy[idx].jumlah - toastItem.jumlah };
        } else {
          copy.splice(idx, 1);
        }
        return copy;
      }
      return prev;
    });
    setToast(null);
  };

  const updateQuantity = (variantKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(variantKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantKey === variantKey ? { ...i, jumlah: newQty } : i))
    );
  };

  const removeFromCart = (variantKey) => {
    setItems((prev) => prev.filter((i) => i.variantKey !== variantKey));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.jumlah, 0);
  const subtotal = items.reduce((acc, item) => acc + item.harga * item.jumlah, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        undoAddToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        toast,
        setToast,
        cartBadgeBounce
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
