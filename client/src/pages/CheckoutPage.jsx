import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  X,
  Check,
  CreditCard,
  QrCode,
  User,
  Truck,
  Wrench,
  CheckCircle2,
  Upload,
  Scale,
  MapPin,
  Clock,
  Info,
  ShoppingBag,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatIDR, formatWeight } from '../utils/format';
import { isValidEmail, isValidPhone } from '../utils/security';
import {
  SHIPPING_ZONES,
  FREE_SHIPPING_THRESHOLD,
  calculateCartWeightGram,
  getBillableWeightKg,
  getShippingOptions
} from '../data/shipping';
import { validateDiscount, createOrder } from '../services/api';
import Reveal from '../components/Reveal';

export default function CheckoutPage({ onBackToCart, onOrderCompleted }) {
  const { items, subtotal, clearCart } = useCart();
  const { user, isGuest, openAuthModal } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [zoneId, setZoneId] = useState('jabodetabek');
  const [selectedCourierId, setSelectedCourierId] = useState('jne_reg');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [uniqueCode] = useState(() => Math.floor(101 + Math.random() * 898));
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [validatingVoucher, setValidatingVoucher] = useState(false);
  const [proofPreview, setProofPreview] = useState(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [actionStatus, setActionStatus] = useState('idle');
  const [completedOrder, setCompletedOrder] = useState(null);

  const totalWeightGram = useMemo(() => calculateCartWeightGram(items), [items]);
  const billableKg = useMemo(() => getBillableWeightKg(totalWeightGram), [totalWeightGram]);
  const shippingOptions = useMemo(
    () => getShippingOptions({ zoneId, totalWeightGram, subtotal }),
    [zoneId, totalWeightGram, subtotal]
  );

  const selectedCourier =
    shippingOptions.find((c) => c.id === selectedCourierId) || shippingOptions[0];
  const selectedZone =
    SHIPPING_ZONES.find((z) => z.id === zoneId) || SHIPPING_ZONES[0];

  const validateStep1 = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Nama lengkap penerima wajib diisi.';
    if (!isValidEmail(email)) errs.email = 'Alamat email tidak valid.';
    if (!isValidPhone(phone)) errs.phone = 'Nomor WhatsApp harus 9–15 digit angka.';
    if (!address.trim() || address.trim().length < 8)
      errs.address = 'Alamat lengkap pengiriman wajib diisi.';
    if (!city.trim()) errs.city = 'Kota / Kabupaten tujuan wajib diisi.';
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

  const handleApplyVoucher = async (codeOverride = null) => {
    const code = (codeOverride ?? promoCodeInput).trim();
    if (!code) return;
    setPromoCodeInput(code);
    setValidatingVoucher(true);
    setVoucherError('');

    const res = await validateDiscount(code, subtotal);
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

  const handleProofFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setSubmitError('Ukuran file bukti bayar maksimal 4MB.');
      return;
    }
    setSubmitError('');
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const baseTotal = Math.max(0, subtotal - discountAmount + selectedCourier.cost);
  const finalTotal = baseTotal + uniqueCode;

  const paymentMethodLabel =
    paymentMethod === 'qris'
      ? 'QRIS Instan'
      : paymentMethod === 'bank_mandiri'
      ? 'Transfer Bank Mandiri'
      : 'Transfer Bank BCA';

  const handleFinishOrder = async () => {
    if (items.length === 0) return;
    setSubmitError('');
    setActionStatus('processing');

    const payload = {
      customer: {
        nama: name,
        email,
        telepon: phone,
        alamat: address,
        kota: city,
        kodePos: postalCode
      },
      items,
      subtotal,
      diskon: discountAmount,
      kodeDiskon: appliedVoucher ? appliedVoucher.kode : null,
      ongkir: selectedCourier.cost,
      uniqueCode,
      totalWeightGram,
      shippingZone: selectedZone.label.split(' (')[0],
      kurir: `${selectedCourier.label} (${selectedCourier.eta})`,
      total: finalTotal,
      paymentMethodKey: paymentMethod === 'qris' ? 'qris' : 'bank_transfer',
      metodeBayar: paymentMethodLabel,
      paymentProofUrl: proofPreview,
      paymentNotes
    };

    const res = await createOrder(payload);

    if (res.success) {
      setActionStatus('success');
      setCompletedOrder(res.data);
      clearCart();
      setTimeout(() => {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      setActionStatus('idle');
      setSubmitError(res.error || 'Gagal memproses pesanan. Periksa kembali keranjang Anda.');
    }
  };

  const steps = [
    { num: 1, title: 'Alamat & Kurir' },
    { num: 2, title: 'Pembayaran' },
    { num: 3, title: 'Invoice' }
  ];

  if (isGuest) {
    return (
      <div className="bg-[#F7F8FA] min-h-screen py-14 sm:py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[24px] p-7 sm:p-8 border border-[#E2E7EE] shadow-tc-studio text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-[#ECEFF4] text-[#1D2129] rounded-[20px] flex items-center justify-center">
            <User size={28} />
          </div>
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#1D2129]">
              CHECKOUT TECHCARE
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1D2129]">Masuk / Buat Akun Buyer</h2>
            <p className="text-xs text-[#647082] leading-relaxed">
              Masuk atau daftar akun buyer agar Anda dapat menghitung ongkir, mengunggah bukti pembayaran, dan melacak nomor resi secara real-time.
            </p>
          </div>
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() =>
                openAuthModal('login', 'Silakan masuk untuk melanjutkan proses checkout & pelacakan pesanan.')
              }
              className="tc-btn-primary w-full"
            >
              Masuk ke Akun
            </button>
            <button
              onClick={() =>
                openAuthModal('register', 'Daftar akun buyer baru untuk checkout dan lacak pesanan Anda.')
              }
              className="tc-btn-secondary w-full"
            >
              Daftar Akun Baru (Buyer)
            </button>
            <button
              onClick={onBackToCart}
              className="text-xs font-semibold text-[#647082] hover:text-[#1D2129] block mx-auto pt-2"
            >
              ← Kembali ke Katalog TECHCARE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && currentStep < 3) {
    return (
      <div className="bg-[#F7F8FA] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[24px] p-8 border border-[#E2E7EE] shadow-tc-studio text-center space-y-4">
          <div className="w-14 h-14 rounded-[20px] bg-[#ECEFF4] text-[#1D2129] flex items-center justify-center mx-auto">
            <ShoppingBag size={26} />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1D2129]">Keranjang Anda Kosong</h2>
          <p className="text-xs text-[#647082] leading-relaxed">
            Tambahkan perangkat IT pilihan ke keranjang terlebih dahulu sebelum melanjutkan ke halaman checkout.
          </p>
          <button onClick={onBackToCart} className="tc-btn-primary w-full">
            Jelajahi Katalog Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Stepper Header */}
        <Reveal>
          <div className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border border-[#E2E7EE]/90 shadow-tc-studio flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#1D2129] block">
                CHECKOUT AMAN TECHCARE
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1D2129]">
                Selesaikan Pesanan Anda
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {steps.map((st, i) => (
                <React.Fragment key={st.num}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        currentStep === st.num
                          ? 'bg-[#0071E3] text-white'
                          : currentStep > st.num
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#ECEFF4] text-[#8692A3]'
                      }`}
                    >
                      {currentStep > st.num ? '✓' : st.num}
                    </span>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        currentStep >= st.num ? 'text-[#1D2129]' : 'text-[#8692A3]'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-6 sm:w-8 h-0.5 rounded-full ${
                        currentStep > st.num ? 'bg-emerald-500' : 'bg-[#E2E7EE]'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Main 2-Column Checkout Grid (1-column on step 3) */}
        <div className={currentStep < 3 ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : 'max-w-2xl mx-auto'}>
          {/* Left Form Card */}
          <div
            className={`${
              currentStep < 3 ? 'lg:col-span-8' : ''
            } bg-white rounded-[28px] p-6 sm:p-8 border border-[#D2D2D7]/60`}
          >
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="border-b border-[#ECEFF4] pb-4">
                    <h2 className="font-display text-xl font-bold text-[#1D2129]">
                      Langkah 1: Data Penerima &amp; Ekspedisi
                    </h2>
                    <p className="text-xs text-[#647082] mt-0.5">
                      Ongkos kirim dihitung otomatis dari tabel tarif lokal berdasarkan wilayah &amp; berat total paket.
                    </p>
                  </div>

                  <form onSubmit={handleNextStep1} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#323846] mb-1">
                          Nama Lengkap Penerima *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Budi Santoso"
                          className={`tc-input ${errors.name ? 'border-rose-500 bg-rose-50/40' : ''}`}
                        />
                        {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323846] mb-1">
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="081234567890"
                          className={`tc-input ${errors.phone ? 'border-rose-500 bg-rose-50/40' : ''}`}
                        />
                        {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#323846] mb-1">
                          Email Konfirmasi *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="budi@email.com"
                          className={`tc-input ${errors.email ? 'border-rose-500 bg-rose-50/40' : ''}`}
                        />
                        {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323846] mb-1">
                          Kota / Kabupaten *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Jakarta Selatan"
                          className={`tc-input ${errors.city ? 'border-rose-500 bg-rose-50/40' : ''}`}
                        />
                        {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#323846] mb-1">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="12190"
                          maxLength={10}
                          className="tc-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#323846] mb-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-[#1D2129]" />
                          Wilayah / Provinsi Tujuan (Penentu Tarif Ongkir) *
                        </span>
                      </label>
                      <select
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="tc-input font-medium cursor-pointer"
                      >
                        {SHIPPING_ZONES.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#323846] mb-1">
                        Alamat Lengkap *
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                        className={`tc-input min-h-[76px] resize-none ${
                          errors.address ? 'border-rose-500 bg-rose-50/40' : ''
                        }`}
                      />
                      {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
                    </div>

                    {/* Courier Options */}
                    <div className="space-y-2.5 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="text-xs font-bold text-[#1D2129]">
                          Pilih Ekspedisi (JNE / J&amp;T / SiCepat / Workshop)
                        </label>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          Gratis Ongkir Jabodetabek min. {formatIDR(FREE_SHIPPING_THRESHOLD)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {shippingOptions.map((c) => {
                          const active = selectedCourierId === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedCourierId(c.id)}
                              className={`p-3.5 rounded-[20px] border text-left transition-all flex items-start justify-between gap-2 ${
                                active
                                  ? 'border-[#0071E3] bg-[#0071E3]/5 ring-1 ring-[#0071E3]'
                                  : 'border-[#E2E7EE] hover:border-[#8692A3] bg-white'
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-[#0071E3] text-white text-[9px] font-bold uppercase shrink-0">
                                    {c.code}
                                  </span>
                                  <p className="text-xs font-bold text-[#1D2129] truncate">{c.name}</p>
                                </div>
                                <p className="text-[11px] text-[#4F627A] font-medium">
                                  {c.eta} • {c.weightKg} kg
                                </p>
                                <p className="text-[10px] text-[#647082] leading-snug">{c.desc}</p>
                              </div>
                              <div className="text-right shrink-0">
                                {c.isFreePromo && (
                                  <span className="block text-[10px] text-[#8692A3] line-through tabular-nums">
                                    {formatIDR(c.originalCost)}
                                  </span>
                                )}
                                <span
                                  className={`font-display text-xs font-bold tabular-nums ${
                                    c.cost === 0 ? 'text-emerald-600' : 'text-[#1D2129]'
                                  }`}
                                >
                                  {c.cost > 0 ? formatIDR(c.cost) : 'Gratis'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center gap-3 border-t border-[#ECEFF4]">
                      <button
                        type="button"
                        onClick={onBackToCart}
                        className="tc-btn-secondary px-4"
                      >
                        <ArrowLeft size={15} />
                        <span>Kembali</span>
                      </button>

                      <button type="submit" className="tc-btn-primary px-6">
                        <span>Lanjut Pembayaran</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="border-b border-[#ECEFF4] pb-4">
                    <h2 className="font-display text-xl font-bold text-[#1D2129]">
                      Langkah 2: Pembayaran Lokal &amp; Kupon Promo
                    </h2>
                    <p className="text-xs text-[#647082] mt-0.5">
                      Pilih metode QRIS atau Transfer Bank lokal, klaim voucher, lalu buat pesanan.
                    </p>
                  </div>

                  {/* Payment Verification Notice */}
                  <div className="p-3.5 rounded-[20px] bg-[#ECEFF4] border border-[#D4DBE5] flex items-start gap-2.5 text-xs text-[#1D2129]">
                    <Info size={16} className="text-[#1D2129] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Konfirmasi Pembayaran:</strong> Transfer sesuai nominal tagihan hingga 3 digit kode unik, lalu unggah bukti transfer untuk diverifikasi Admin.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-[20px] bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Voucher Box */}
                  <div className="bg-[#F7F8FA] p-4 rounded-[20px] border border-[#E2E7EE] space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D2129]">
                      <Tag size={15} className="text-[#1D2129]" />
                      <span>Kupon Diskon TECHCARE</span>
                    </div>

                    {appliedVoucher ? (
                      <div className="p-3 bg-[#F5F5F7] border border-[#0071E3]/40 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-[#0071E3]" />
                          <div>
                            <p className="text-xs font-bold text-[#1D1D1F]">
                              Kupon <strong>{appliedVoucher.kode}</strong> Aktif
                            </p>
                            <p className="text-[11px] text-[#0071E3]">
                              Hemat {formatIDR(discountAmount)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveVoucher}
                          className="w-8 h-8 rounded-lg text-emerald-800 hover:bg-emerald-100 flex items-center justify-center"
                          aria-label="Hapus kupon"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Masukkan kode (mis. TECHCARE10)"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            className="tc-input flex-1 bg-white uppercase "
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyVoucher()}
                            disabled={validatingVoucher}
                            className="tc-btn-dark px-5 shrink-0"
                          >
                            {validatingVoucher ? 'Cek...' : 'Pakai'}
                          </button>
                        </div>
                        {voucherError && <p className="text-[11px] text-rose-600">{voucherError}</p>}
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-[#647082]">
                          <span>Kode cepat:</span>
                          {['TECHCARE10', 'UPGRADERAM', 'LAPTOP250K'].map((code) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => handleApplyVoucher(code)}
                              className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E7EE] hover:border-[#1D2129] hover:text-[#1D2129] text-[11px] font-bold text-[#323846] transition-colors"
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-[#1D2129]">
                      Pilih Metode Pembayaran Lokal
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          key: 'bank_transfer',
                          title: 'Transfer BCA',
                          sub: '8271039821 • TECHCARE',
                          icon: CreditCard
                        },
                        {
                          key: 'bank_mandiri',
                          title: 'Transfer Mandiri',
                          sub: '1340029182734 • TECHCARE',
                          icon: CreditCard
                        },
                        {
                          key: 'qris',
                          title: 'QRIS Instan',
                          sub: 'GoPay, OVO, Dana, m-Banking',
                          icon: QrCode
                        }
                      ].map((m) => {
                        const Icon = m.icon;
                        const active = paymentMethod === m.key;
                        return (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setPaymentMethod(m.key)}
                            className={`p-4 rounded-[20px] border text-left flex items-center justify-between gap-2 transition-all ${
                              active
                                ? 'border-[#0071E3] bg-[#0071E3]/5 ring-1 ring-[#0071E3]'
                                : 'border-[#E2E7EE] hover:border-[#8692A3] bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                size={18}
                                className={active ? 'text-[#0071E3] shrink-0' : 'text-[#647082] shrink-0'}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1D2129]">{m.title}</p>
                                <p className="text-[10px] text-[#647082] truncate">{m.sub}</p>
                              </div>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full border shrink-0 ${
                                active ? 'border-[5px] border-[#0071E3]' : 'border-[#BAC4D2]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === 'qris' && (
                      <div className="p-4 rounded-[20px] bg-[#F7F8FA] border border-[#E2E7EE] flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src="/images/qris-techcare.svg"
                          alt="QRIS TECHCARE"
                          className="w-28 h-32 object-contain rounded-xl bg-white p-1.5 border border-[#E2E7EE]"
                        />
                        <div className="text-xs text-[#4F627A] space-y-1 text-center sm:text-left">
                          <p className="font-display font-bold text-[#1D2129]">
                            QRIS Nasional TECHCARE
                          </p>
                          <p>
                            Scan kode QRIS sebesar{' '}
                            <strong className="text-[#1D2129] tabular-nums">{formatIDR(finalTotal)}</strong>{' '}
                            (termasuk kode unik <strong className="">+{uniqueCode}</strong>).
                          </p>
                          <p className="text-[11px] text-[#647082] inline-flex items-center gap-1">
                            <Clock size={12} /> Batas waktu pembayaran: 24 jam.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Instant Proof Upload */}
                  <div className="p-4 rounded-[20px] border border-dashed border-[#BAC4D2] bg-[#F7F8FA] space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#23272F]">
                      <Upload size={14} className="text-[#1D2129]" />
                      <span>Upload Bukti Bayar Sekarang (Opsional — bisa nanti di halaman Invoice)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProofFile}
                      className="block w-full text-xs text-[#647082] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1D2129] file:text-white hover:file:bg-[#323846] cursor-pointer"
                    />
                    {proofPreview && (
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={proofPreview}
                          alt="Preview bukti"
                          className="h-14 w-14 rounded-xl object-cover border border-[#E2E7EE]"
                        />
                        <input
                          type="text"
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          placeholder="Catatan transfer (mis. BCA a.n. Budi)"
                          className="tc-input flex-1 bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex justify-between items-center gap-3 border-t border-[#ECEFF4]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="tc-btn-secondary px-4"
                    >
                      <ArrowLeft size={15} />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionStatus !== 'idle'}
                      onClick={handleFinishOrder}
                      className="tc-btn-primary px-6"
                    >
                      {actionStatus === 'processing' ? (
                        <span>Membuat Invoice...</span>
                      ) : actionStatus === 'success' ? (
                        <span>Pesanan Dibuat!</span>
                      ) : (
                        <>
                          <span>Buat Pesanan Sekarang</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS INVOICE */}
              {currentStep === 3 && completedOrder && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-4 space-y-6"
                >
                  <div className="w-16 h-16 rounded-[20px] bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={34} />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1D2129]">
                      Pesanan Berhasil Dibuat!
                    </h2>
                    <p className="text-xs sm:text-sm text-[#647082] max-w-md mx-auto leading-relaxed">
                      Lanjutkan ke halaman <strong>Instruksi Bayar &amp; Tracking</strong> untuk melihat rekening/QRIS, batas waktu 24 jam, dan mengunggah bukti pembayaran.
                    </p>
                  </div>

                  <div className="bg-[#F7F8FA] p-5 rounded-[20px] border border-[#E2E7EE] max-w-md mx-auto text-left space-y-2.5 text-xs">
                    <div className="flex justify-between items-center border-b border-[#E2E7EE] pb-2.5">
                      <span className="text-[#647082]">Nomor Invoice</span>
                      <span className="font-bold text-[#1D2129] text-sm">
                        #{completedOrder.nomorPesanan}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#647082]">Penerima</span>
                      <span className="font-semibold text-[#1D2129]">{completedOrder.customer.nama}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[#647082]">Ekspedisi</span>
                      <span className="text-[#1D2129] text-right max-w-[64%]">{completedOrder.kurir}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#647082]">Metode Bayar</span>
                      <span className="text-[#1D2129]">{completedOrder.metodeBayar}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#647082]">Kode Unik</span>
                      <span className="font-bold text-[#1D2129]">
                        +{formatIDR(completedOrder.uniqueCode || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2.5 border-t border-[#E2E7EE] text-sm font-bold">
                      <span>Total Transfer Tepat</span>
                      <span className="font-display text-base text-[#1D2129] tabular-nums">
                        {formatIDR(completedOrder.total)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOrderCompleted(completedOrder.nomorPesanan)}
                    className="tc-btn-primary px-8 py-3.5 text-sm"
                  >
                    <span>Lihat Instruksi Bayar &amp; Lacak</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sticky Order Summary Card (visible on Steps 1 & 2) */}
          {currentStep < 3 && (
            <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-white rounded-[24px] p-5 sm:p-6 border border-[#E2E7EE]/90 shadow-tc-studio space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3">
                <h3 className="font-display text-base font-bold text-[#1D2129]">
                  Ringkasan Pesanan
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#ECEFF4] text-[#1D2129]">
                  <Scale size={12} /> {formatWeight(totalWeightGram)} ({billableKg} kg)
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.variantKey || it.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#ECEFF4] p-1.5 flex items-center justify-center shrink-0">
                      <img src={it.gambar} alt={it.nama} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1D2129] truncate">{it.nama}</p>
                      <p className="text-[11px] text-[#647082] truncate">
                        {it.jumlah}x • {it.specLabel || it.warna}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1D2129] shrink-0 tabular-nums">
                      {formatIDR(it.harga * it.jumlah)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#ECEFF4] space-y-2 text-xs">
                <div className="flex justify-between text-[#4F627A]">
                  <span>Subtotal Produk</span>
                  <span className="tabular-nums font-semibold">{formatIDR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Diskon ({appliedVoucher?.kode})</span>
                    <span className="tabular-nums">-{formatIDR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4F627A] gap-2">
                  <span className="truncate">Ongkir ({selectedCourier.name})</span>
                  <span className="font-semibold text-[#1D2129] shrink-0 tabular-nums">
                    {selectedCourier.cost > 0 ? formatIDR(selectedCourier.cost) : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-[#4F627A]">
                  <span>Kode Unik (3 Digit)</span>
                  <span className="font-bold text-[#1D2129]">+{formatIDR(uniqueCode)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E2E7EE]">
                  <span className="font-display text-sm font-bold text-[#1D2129]">Total Bayar</span>
                  <span className="font-display text-lg font-bold text-[#1D2129] tabular-nums">
                    {formatIDR(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E2E7EE]/80 flex items-center gap-2 text-[11px] text-[#4F627A]">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Stok otomatis diamankan &amp; bergaransi toko TECHCARE 30–90 hari.</span>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
