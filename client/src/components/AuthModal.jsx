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
        className="relative bg-white rounded-[28px] max-w-md w-full max-h-[92vh] overflow-y-auto shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10"
      >
        {/* Clean Apple White Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#D2D2D7]/70 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[#6E6E73]">Akun TechCare</p>
            <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-[#1D1D1F] leading-tight">
              {authModalTab === 'login' ? 'Masuk ke akun' : 'Daftar akun baru'}
            </h2>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {authNotice && (
            <div className="p-3.5 bg-[#F5F5F7] rounded-[12px] text-[13px] text-[#1D1D1F] leading-relaxed">
              {authNotice}
            </div>
          )}

          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#F5F5F7] rounded-[12px]">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setError('');
              }}
              className={`min-h-[40px] rounded-[10px] text-[14px] font-medium transition-all ${
                authModalTab === 'login'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
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
              className={`min-h-[40px] rounded-[10px] text-[14px] font-medium transition-all ${
                authModalTab === 'register'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Daftar Akun
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
                : 'Buat Akun'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
