import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, User, Phone, ShieldCheck, ShoppingBag, Cpu, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    authNotice,
    login,
    register,
    loginAsAdminDemo,
    loginAsBuyerDemo
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone });
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses akun.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsAdminDemo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBuyer = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsBuyerDemo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#1D2129]/60 backdrop-blur-xs"
        onClick={closeAuthModal}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-white rounded-[24px] max-w-md w-full max-h-[92vh] overflow-y-auto shadow-tc-lift border border-[#E2E7EE] z-10"
      >
        {/* Top Navy Accent Banner */}
        <div className="bg-[#1D2129] text-white px-6 py-5 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Cpu size={20} />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9BB0C9] block">
                AKUN PENGGUNA TECHCARE
              </span>
              <h2 className="font-display text-xl font-bold text-white leading-tight">
                {authModalTab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Buyer'}
              </h2>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {authNotice && (
            <div className="p-3.5 bg-[#ECEFF4] border border-[#D4DBE5] rounded-xl text-xs text-[#1D2129] leading-relaxed">
              {authNotice}
            </div>
          )}

          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#F7F8FA] rounded-xl border border-[#E2E7EE]">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setError('');
              }}
              className={`min-h-[40px] rounded-lg text-xs font-bold transition-all ${
                authModalTab === 'login'
                  ? 'bg-white text-[#1D2129] shadow-xs'
                  : 'text-[#647082] hover:text-[#1D2129]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('register');
                setError('');
              }}
              className={`min-h-[40px] rounded-lg text-xs font-bold transition-all ${
                authModalTab === 'register'
                  ? 'bg-white text-[#1D2129] shadow-xs'
                  : 'text-[#647082] hover:text-[#1D2129]'
              }`}
            >
              Daftar Buyer
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#323846] mb-1">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8692A3]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    className="tc-input pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#323846] mb-1">
                Alamat Email *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8692A3]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="tc-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#323846] mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8692A3]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="tc-input pl-10"
                />
              </div>
            </div>

            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#323846] mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8692A3]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="tc-input pl-10"
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="tc-btn-primary w-full py-3.5 mt-1">
              {loading
                ? 'Memproses...'
                : authModalTab === 'login'
                ? 'Masuk Sekarang'
                : 'Buat Akun Buyer'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-[#ECEFF4] space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8692A3] text-center">
              Akses Cepat Demo Pengujian
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[#1D2129] hover:bg-[#323846] text-white text-xs font-semibold transition-colors"
              >
                <ShieldCheck size={14} className="text-[#9BB0C9]" />
                <span>Masuk Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={handleQuickBuyer}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[#ECEFF4] hover:bg-[#D4DBE5] text-[#1D2129] border border-[#D4DBE5] text-xs font-semibold transition-colors"
              >
                <ShoppingBag size={14} />
                <span>Masuk Buyer Demo</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
