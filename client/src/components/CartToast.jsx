import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ArrowRight, RotateCcw } from 'lucide-react';

export default function CartToast({ onOpenCart }) {
  const { toast, setToast, undoAddToCart } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto bg-[#111113] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-neutral-800 flex items-center space-x-4 max-w-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{toast.message}</p>
              <p className="text-[10px] text-neutral-400">Varian: {toast.warna}</p>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => undoAddToCart(toast)}
                className="text-[11px] font-semibold text-neutral-300 hover:text-white px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors flex items-center space-x-1"
              >
                <RotateCcw size={12} />
                <span>Urungkan</span>
              </button>

              <button
                onClick={() => {
                  setToast(null);
                  onOpenCart();
                }}
                className="text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>Buka</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
