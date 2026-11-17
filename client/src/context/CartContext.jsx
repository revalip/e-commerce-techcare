import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('novaire_cart_state');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, lastRemovedItem, visible }
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);
  const prevCount = useRef(items.reduce((acc, i) => acc + i.jumlah, 0));

  useEffect(() => {
    try {
      localStorage.setItem('novaire_cart_state', JSON.stringify(items));
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

  // Tambah item ke keranjang + munculkan Toast dengan opsi Undo
  const addToCart = (product, jumlah = 1, warna = null) => {
    const selectedColor = warna || (product.varianWarna && product.varianWarna[0]?.nama) || 'Standard';

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.id === product.id && i.warna === selectedColor
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].jumlah += jumlah;
        return copy;
      }

      return [
        ...prev,
        {
          id: product.id,
          nama: product.nama,
          slug: product.slug,
          harga: product.harga,
          gambar: product.gambar ? product.gambar[0] : '/images/products/novaire-air.svg',
          warna: selectedColor,
          jumlah: jumlah
        }
      ];
    });

    // Tampilkan Toast
    setToast({
      id: Date.now(),
      message: `"${product.nama}" ditambahkan ke keranjang`,
      product: product,
      jumlah: jumlah,
      warna: selectedColor
    });
  };

  const undoAddToCart = (toastItem) => {
    if (!toastItem) return;
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === toastItem.product.id && i.warna === toastItem.warna
      );
      if (idx > -1) {
        const copy = [...prev];
        if (copy[idx].jumlah > toastItem.jumlah) {
          copy[idx].jumlah -= toastItem.jumlah;
        } else {
          copy.splice(idx, 1);
        }
        return copy;
      }
      return prev;
    });
    setToast(null);
  };

  const updateQuantity = (itemId, warna, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId, warna);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId && i.warna === warna ? { ...i, jumlah: newQty } : i))
    );
  };

  const removeFromCart = (itemId, warna) => {
    setItems((prev) => prev.filter((i) => !(i.id === itemId && i.warna === warna)));
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
