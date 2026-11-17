import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Tag, X, Sparkles, CreditCard, QrCode, Copy, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatIDR } from '../utils/format';
import { validateDiscount, createOrder } from '../services/api';
import Reveal from '../components/Reveal';

export default function CheckoutPage({ onBackToCart, onOrderCompleted }) {
  const { items, subtotal, clearCart } = useCart();
  const { user, isGuest, openAuthModal } = useAuth();

  // Stepper: 1: Alamat, 2: Pembayaran & Diskon, 3: Selesai
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Form Alamat
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  // Step 2: Pembayaran & Diskon
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer'); // 'bank_transfer' | 'qris'
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [validatingVoucher, setValidatingVoucher] = useState(false);

  // Submit action state: 'idle' | 'processing' | 'success'
  const [actionStatus, setActionStatus] = useState('idle');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Nama lengkap wajib diisi.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Alamat email tidak valid.';
    if (!phone.trim() || phone.length < 9) errs.phone = 'Nomor telepon/WhatsApp minimal 9 digit.';
    if (!address.trim()) errs.address = 'Alamat lengkap pengiriman wajib diisi.';
    if (!city.trim()) errs.city = 'Kota tujuan wajib diisi.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Voucher validation via API layer
  const handleApplyVoucher = async () => {
    if (!promoCodeInput.trim()) return;
    setValidatingVoucher(true);
    setVoucherError('');

    const res = await validateDiscount(promoCodeInput, subtotal);
    setValidatingVoucher(false);

    if (res.success) {
      setAppliedVoucher(res.data);
      setDiscountAmount(res.data.nominalDiskon);
    } else {
      setVoucherError(res.error);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setPromoCodeInput('');
    setVoucherError('');
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Final Order Submission via API layer
  const handleFinishOrder = async () => {
    setActionStatus('processing');

    const payload = {
      customer: {
        nama: name,
        email: email,
        telepon: phone,
        alamat: address,
        kota: city
      },
      items: items,
      subtotal: subtotal,
      diskon: discountAmount,
      kodeDiskon: appliedVoucher ? appliedVoucher.kode : null,
      total: finalTotal,
      metodeBayar: paymentMethod === 'qris' ? 'QRIS Instan' : 'Transfer Bank (BCA)'
    };

    const res = await createOrder(payload);

    if (res.success) {
      setActionStatus('success');
      setCompletedOrder(res.data);
      clearCart();
      setTimeout(() => {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    } else {
      setActionStatus('idle');
      alert('Gagal memproses pesanan.');
    }
  };

  // Stepper Header
  const steps = [
    { num: 1, title: 'Alamat Pengiriman' },
    { num: 2, title: 'Pembayaran & Promo' },
    { num: 3, title: 'Konfirmasi Selesai' }
  ];

  if (isGuest) {
    return (
      <div className="bg-[#fcfcfd] min-h-screen py-16 sm:py-24 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center text-neutral-800">
            <User size={28} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-neutral-400">
              CHECKOUT TECHCARE
            </span>
            <h2 className="font-serif text-3xl text-neutral-900">
              Wajib Masuk / Buat Akun
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Sebagai guest, Anda dapat melihat seluruh produk kami. Namun untuk menyelesaikan pesanan, Anda wajib memiliki akun buyer.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal('login', 'Silakan masuk ke akun Anda untuk menyelesaikan proses checkout pesanan.')}
              className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3 rounded-full text-xs font-semibold tracking-wider uppercase shadow-sm"
            >
              Masuk ke Akun
            </button>
            <button
              onClick={() => openAuthModal('register', 'Buat akun buyer baru untuk memproses dan melacak pesanan Anda.')}
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-all py-3 rounded-full text-xs font-semibold tracking-wider uppercase border border-neutral-200/80"
            >
              Daftar Akun Baru (Buyer)
            </button>
            <button
              onClick={onBackToCart}
              className="text-xs text-neutral-500 hover:text-black underline block mx-auto pt-3"
            >
              ← Kembali ke Katalog Toko
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Stepper Progress Bar */}
        <Reveal>
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-neutral-400">
              TECHCARE CHECKOUT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900">
              Selesaikan Pesanan Anda
            </h1>

            {/* Stepper Dots & Line */}
            <div className="flex items-center justify-center max-w-xs mx-auto pt-2">
              {steps.map((st, i) => (
                <React.Fragment key={st.num}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        currentStep === st.num
                          ? 'bg-black text-white ring-4 ring-neutral-200'
                          : currentStep > st.num
                          ? 'bg-neutral-800 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {st.num}
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 font-medium whitespace-nowrap">
                      {st.title.split(' ')[0]}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 -mt-4 transition-colors duration-300 ${
                        currentStep > st.num ? 'bg-black' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Step Transition Container */}
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-neutral-100 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ALAMAT PENGIRIMAN */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <h3 className="font-serif text-xl font-medium text-neutral-900">
                    Langkah 1: Alamat Penerima
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Masukkan data penerima untuk pengiriman headphone resmi NOVAIRE.
                  </p>
                </div>

                <form onSubmit={handleNextStep1} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Nama Lengkap Penerima *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Adrian Wijaya"
                        className={`w-full px-4 py-2.5 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                          errors.name ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 focus:border-black focus:bg-white'
                        }`}
                      />
                      {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Nomor WhatsApp / HP *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className={`w-full px-4 py-2.5 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                          errors.phone ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 focus:border-black focus:bg-white'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Alamat Email Konfirmasi *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="adrian@example.com"
                      className={`w-full px-4 py-2.5 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                        errors.email ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 focus:border-black focus:bg-white'
                      }`}
                    />
                    {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                      className={`w-full px-4 py-2.5 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all resize-none ${
                        errors.address ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 focus:border-black focus:bg-white'
                      }`}
                    />
                    {errors.address && <p className="text-[10px] text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Kota / Kabupaten *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Jakarta Selatan"
                      className={`w-full px-4 py-2.5 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                        errors.city ? 'border-red-500 bg-red-50/40' : 'border-neutral-200 focus:border-black focus:bg-white'
                      }`}
                    />
                    {errors.city && <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>}
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={onBackToCart}
                      className="text-xs font-semibold text-neutral-500 hover:text-black uppercase tracking-wider flex items-center space-x-1"
                    >
                      <ArrowLeft size={14} />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95 shadow-sm"
                    >
                      <span>Lanjut ke Pembayaran</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: PEMBAYARAN & DISKON */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <h3 className="font-serif text-xl font-medium text-neutral-900">
                    Langkah 2: Pembayaran & Diskon Promo
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Pilih metode pembayaran dan masukkan kode voucher diskon Anda.
                  </p>
                </div>

                {/* Promo Code Input */}
                <div className="bg-[#f9f9fb] p-5 rounded-3xl border border-neutral-200 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800">
                    <Tag size={15} />
                    <span>Punya Kupon Diskon?</span>
                  </div>

                  {appliedVoucher ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">
                            Kupon <strong>{appliedVoucher.kode}</strong> Berhasil Dipasang
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Hemat {formatIDR(discountAmount)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveVoucher}
                        className="p-1 rounded-full text-emerald-800 hover:bg-emerald-100"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Masukkan kode (e.g. NOVAIRE10)"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs uppercase font-mono outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={handleApplyVoucher}
                          disabled={validatingVoucher}
                          className="px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-2xl hover:bg-neutral-800 uppercase tracking-wider disabled:opacity-50"
                        >
                          {validatingVoucher ? 'Memeriksa...' : 'Gunakan'}
                        </button>
                      </div>
                      {voucherError && <p className="text-[10px] text-red-600">{voucherError}</p>}
                      <p className="text-[10px] text-neutral-400">
                        Tips: Gunakan kode <strong>NOVAIRE10</strong> untuk diskon 10% pesanan pertama.
                      </p>
                    </div>
                  )}
                </div>

                {/* Metode Pembayaran Selection */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                    Pilih Metode Pembayaran
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-black bg-neutral-50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard size={18} />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">Transfer Bank (BCA)</p>
                          <p className="text-[10px] text-neutral-400">Verifikasi manual langsung</p>
                        </div>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-4 border-black'
                            : 'border-neutral-300'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        paymentMethod === 'qris'
                          ? 'border-black bg-neutral-50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <QrCode size={18} />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">QRIS Instan</p>
                          <p className="text-[10px] text-neutral-400">BCA, GoPay, OVO, ShopeePay</p>
                        </div>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border ${
                          paymentMethod === 'qris' ? 'border-4 border-black' : 'border-neutral-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Ringkasan Biaya */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal Produk</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Diskon Kupon ({appliedVoucher?.kode})</span>
                      <span>-{formatIDR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-neutral-900 font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total Pembayaran</span>
                    <span className="text-base">{formatIDR(finalTotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-neutral-500 hover:text-black uppercase tracking-wider flex items-center space-x-1"
                  >
                    <ArrowLeft size={14} />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionStatus !== 'idle'}
                    onClick={handleFinishOrder}
                    className="bg-black text-white hover:bg-neutral-800 px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 shadow-md"
                  >
                    {actionStatus === 'processing' ? (
                      <span>Memproses...</span>
                    ) : actionStatus === 'success' ? (
                      <span>Berhasil!</span>
                    ) : (
                      <>
                        <span>Konfirmasi & Buat Pesanan</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SELESAI / KONFIRMASI */}
            {currentStep === 3 && completedOrder && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto text-xl font-serif">
                  N
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                    Pesanan Berhasil Diterima
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    Terima kasih telah mempercayakan pengalaman audio Anda kepada NOVAIRE. Pesanan Anda saat ini sedang dipersiapkan.
                  </p>
                </div>

                <div className="bg-[#f9f9fb] p-6 rounded-3xl border border-neutral-200 max-w-md mx-auto text-left space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">Nomor Pesanan</span>
                    <span className="font-mono font-bold text-neutral-900">
                      #{completedOrder.nomorPesanan}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Penerima</span>
                    <span className="font-semibold text-neutral-900">
                      {completedOrder.customer.nama}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Tujuan</span>
                    <span className="text-neutral-900">{completedOrder.customer.kota}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Metode</span>
                    <span className="text-neutral-900">{completedOrder.metodeBayar}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm font-bold">
                    <span>Total Tagihan</span>
                    <span>{formatIDR(completedOrder.total)}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center space-x-4">
                  <button
                    onClick={() => onOrderCompleted(completedOrder.nomorPesanan)}
                    className="bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Lihat Riwayat Pesanan
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
