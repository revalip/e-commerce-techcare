import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 pointer-events-none flex justify-center sm:justify-end">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto bg-[#0B1220] text-white px-4 py-3 rounded-2xl shadow-tc-float border border-slate-700/80 flex items-center gap-3 max-w-md w-full sm:w-auto"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{toast.message}</p>
              {(toast.specLabel || toast.warna) && (
                <p className="text-[10px] text-slate-400 truncate">
                  {[toast.specLabel, toast.warna].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => undoAddToCart(toast)}
                className="min-h-[34px] text-[11px] font-semibold text-slate-300 hover:text-white px-2.5 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>Batal</span>
              </button>

              <button
                onClick={() => {
                  setToast(null);
                  onOpenCart();
                }}
                className="min-h-[34px] text-[11px] font-bold text-white bg-[#0B5FFF] hover:bg-[#0847C4] px-3 rounded-lg transition-colors inline-flex items-center gap-1"
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
