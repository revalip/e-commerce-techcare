import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, User, Phone, ShieldCheck, ShoppingBag } from 'lucide-react';
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
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative bg-white rounded-4xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 space-y-5"
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black p-1.5 rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1">
          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-neutral-400 block mb-1">
            AKUN PENGGUNA • TECHCARE
          </span>
          <h2 className="font-serif text-2xl text-neutral-900 font-normal">
            {authModalTab === 'login' ? 'Masuk ke TechCare' : 'Daftar Akun Buyer'}
          </h2>
        </div>

        {/* Notice (misalnya jika dari checkout) */}
        {authNotice && (
          <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-2xl text-xs text-neutral-700 leading-relaxed text-center">
            {authNotice}
          </div>
        )}

        {/* Tab switch */}
        <div className="flex border-b border-neutral-100 pb-2 space-x-6 text-xs font-semibold tracking-wider justify-center">
          <button
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
            className={`pb-2 transition-colors relative ${
              authModalTab === 'login' ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            MASUK
            {authModalTab === 'login' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
            className={`pb-2 transition-colors relative ${
              authModalTab === 'register' ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            BUAT AKUN (BUYER)
            {authModalTab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-xs leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Nama Lengkap *
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Pratama"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Alamat Email *
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs focus:bg-white focus:border-black outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs focus:bg-white focus:border-black outline-none transition-all"
              />
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Nomor WhatsApp / HP (Opsional)
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9fb] border border-neutral-200 rounded-2xl text-xs focus:bg-white focus:border-black outline-none transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-black text-white hover:bg-neutral-800 transition-all py-3 rounded-full text-xs font-semibold tracking-widest uppercase active:scale-[0.99] disabled:opacity-50"
          >
            {loading
              ? 'Memproses...'
              : authModalTab === 'login'
              ? 'Masuk Sekarang'
              : 'Daftar Akun Buyer'}
          </button>
        </form>

        {/* Quick Demo Logins untuk kemudahan pengetesan */}
        <div className="pt-3 border-t border-neutral-100 text-center space-y-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            Akses Cepat (Demo Testing)
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              <ShieldCheck size={13} className="text-neutral-700" />
              <span>Masuk Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickBuyer}
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              <ShoppingBag size={13} className="text-neutral-700" />
              <span>Masuk Buyer Demo</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
