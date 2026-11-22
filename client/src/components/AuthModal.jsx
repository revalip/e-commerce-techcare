import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Cpu, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    authNotice,
    login,
    register
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
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative bg-white rounded-[28px] max-w-md w-full max-h-[92vh] overflow-y-auto shadow-[0_24px_60px_rgba(0,0,0,0.18)] z-10"
      >
        {/* Minimalist Apple Store Sign-In Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[12px] font-medium text-[#6E6E73]">TechCare ID</p>
            <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-[#1D1D1F] leading-[1.15]">
              {authModalTab === 'login' ? 'Masuk untuk checkout lebih cepat.' : 'Buat akun TechCare.'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="w-11 h-11 -mr-2 -mt-1 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-6 pt-4 space-y-5">
          {authNotice && (
            <div className="p-3.5 bg-[#F5F5F7] rounded-[14px] text-[13px] text-[#424245] leading-relaxed">
              {authNotice}
            </div>
          )}

          {/* Segmented Tab Switcher (Apple HIG >= 44px touch height) */}
          <div className="grid grid-cols-2 p-1 bg-[#F5F5F7] rounded-[980px]">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setError('');
              }}
              className={`min-h-[40px] rounded-[980px] text-[14px] font-medium transition-all cursor-pointer ${
                authModalTab === 'login'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
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
              className={`min-h-[40px] rounded-[980px] text-[14px] font-medium transition-all cursor-pointer ${
                authModalTab === 'register'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-[#F5F5F7] text-[#D70015] rounded-[14px] text-[13px] flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-[12px] bg-[#F5F5F7] text-[15px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-[12px] bg-[#F5F5F7] text-[15px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full min-h-[44px] pl-10 pr-4 rounded-[12px] bg-[#F5F5F7] text-[15px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>

            {authModalTab === 'register' && (
              <div>
                <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                  Nomor WhatsApp (Opsional)
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full min-h-[44px] pl-10 pr-4 rounded-[12px] bg-[#F5F5F7] text-[15px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white text-[15px] font-normal transition-colors cursor-pointer mt-2"
            >
              {loading
                ? 'Memproses...'
                : authModalTab === 'login'
                ? 'Masuk'
                : 'Buat Akun'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
