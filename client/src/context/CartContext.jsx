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
    const shouldBounce = currentCount > prevCount.current;
    prevCount.current = currentCount;
    if (shouldBounce) {
      setCartBadgeBounce(true);
      const timer = setTimeout(() => setCartBadgeBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [items]);

  // Tambah item ke keranjang dengan dukungan warna, konfigurasi spec (RAM/SSD), dan pembatasan stok agregat per produk
  const addToCart = (product, jumlah = 1, warna = null, options = {}) => {
    const availableStock = Number.isFinite(Number(product.stok)) ? Math.max(0, Number(product.stok)) : 0;
    const requestedQty = Math.max(1, parseInt(jumlah, 10) || 1);

    if (availableStock <= 0) {
      setToast({
        id: Date.now(),
        message: `Stok "${product.nama}" sedang habis`
      });
      return;
    }

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

    let addedQty = 0;

    setItems((prev) => {
      const currentProductTotal = prev
        .filter((i) => String(i.id) === String(product.id))
        .reduce((sum, i) => sum + i.jumlah, 0);
      const remainingStock = Math.max(0, availableStock - currentProductTotal);
      if (remainingStock <= 0) return prev;

      addedQty = Math.min(requestedQty, remainingStock);
      const existingIdx = prev.findIndex((i) => i.variantKey === variantKey);

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          stokTersedia: availableStock,
          jumlah: copy[existingIdx].jumlah + addedQty
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
          stokTersedia: availableStock,
          gambar: options.gambar || (product.gambar ? product.gambar[0] : '/assets/products/thinkpad-x1-carbon-front.png'),
          warna: selectedColor,
          specLabel,
          kondisi: product.kondisi || 'Second Grade A',
          jumlah: addedQty
        }
      ];
    });

    setToast({
      id: Date.now(),
      message:
        addedQty > 0
          ? `"${product.nama}"${specLabel ? ` (${specLabel})` : ''} masuk keranjang`
          : `Jumlah "${product.nama}" di keranjang sudah mencapai batas stok (${availableStock} unit)`,
      variantKey,
      product,
      jumlah: addedQty,
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
    setItems((prev) => {
      const target = prev.find((i) => i.variantKey === variantKey);
      if (!target) return prev;
      const otherVariantsQty = prev
        .filter((i) => String(i.id) === String(target.id) && i.variantKey !== variantKey)
        .reduce((sum, i) => sum + i.jumlah, 0);
      const maxForItem = Math.max(
        1,
        (Number.isFinite(Number(target.stokTersedia)) ? Number(target.stokTersedia) : 1) - otherVariantsQty
      );
      const clampedQty = Math.min(Math.max(1, parseInt(newQty, 10) || 1), maxForItem);
      return prev.map((i) => (i.variantKey === variantKey ? { ...i, jumlah: clampedQty } : i));
    });
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
