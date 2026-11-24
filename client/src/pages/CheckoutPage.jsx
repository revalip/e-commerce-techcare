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

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/[^\d+]/g, '');
    setPhone(sanitized);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Nama lengkap penerima wajib diisi.';
    if (!isValidEmail(email)) errs.email = 'Alamat email tidak valid.';
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (!isValidPhone(cleanPhone)) errs.phone = 'Nomor WhatsApp harus 9–15 digit angka (contoh: 081234567890).';
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

  // Re-hitung kupon otomatis jika subtotal berubah (mis. item di keranjang dikurangi)
  useEffect(() => {
    if (!appliedVoucher) return;
    if (subtotal < (appliedVoucher.minBelanja || 0)) {
      setAppliedVoucher(null);
      setDiscountAmount(0);
      setVoucherError(
        `Kupon ${appliedVoucher.kode} dilepas karena subtotal di bawah minimal belanja.`
      );
      return;
    }
    let nextPotong = 0;
    if (appliedVoucher.tipe === 'persen') {
      const pct = Math.min(100, Math.max(0, Number(appliedVoucher.nilai) || 0));
      nextPotong = Math.round((subtotal * pct) / 100);
      if (appliedVoucher.maksDiskon > 0 && nextPotong > appliedVoucher.maksDiskon) {
        nextPotong = appliedVoucher.maksDiskon;
      }
    } else {
      nextPotong = Math.max(0, Number(appliedVoucher.nilai) || 0);
    }
    setDiscountAmount(Math.min(nextPotong, subtotal));
  }, [subtotal, appliedVoucher]);

  const handleProofFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!allowed.has(file.type)) {
      setSubmitError('Format file bukti bayar harus JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setSubmitError('Ukuran file bukti bayar maksimal 4MB.');
      return;
    }
    setSubmitError('');
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const safeDiscount = Math.min(subtotal, Math.max(0, discountAmount));
  const baseTotal = Math.max(0, subtotal - safeDiscount) + selectedCourier.cost;
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
      <div className="bg-white min-h-screen py-16 sm:py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#F5F5F7] rounded-[28px] p-8 sm:p-10 text-center space-y-5">
          <div className="w-14 h-14 mx-auto bg-white text-[#1D1D1F] rounded-full flex items-center justify-center">
            <User size={24} strokeWidth={1.6} />
          </div>
          <div className="space-y-1.5">
            <p className="text-[12px] font-medium text-[#6E6E73]">Checkout TechCare</p>
            <h2 className="text-[24px] font-semibold tracking-[-0.025em] text-[#1D1D1F]">
              Masuk untuk checkout lebih cepat.
            </h2>
            <p className="text-[14px] text-[#6E6E73] leading-relaxed">
              Masuk atau daftar akun buyer untuk menghitung ongkir, mengunggah bukti pembayaran, dan melacak resi secara real-time.
            </p>
          </div>
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() =>
                openAuthModal('login', 'Silakan masuk untuk melanjutkan proses checkout & pelacakan pesanan.')
              }
              className="w-full h-[46px] rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] font-normal transition-colors cursor-pointer"
            >
              Masuk ke Akun
            </button>
            <button
              type="button"
              onClick={() =>
                openAuthModal('register', 'Daftar akun buyer baru untuk checkout dan lacak pesanan Anda.')
              }
              className="w-full h-[46px] rounded-[980px] bg-white hover:bg-[#E8E8ED] text-[#1D1D1F] text-[15px] font-normal transition-colors cursor-pointer"
            >
              Daftar Akun Baru
            </button>
            <button
              type="button"
              onClick={onBackToCart}
              className="text-[13px] font-medium text-[#0071E3] hover:underline block mx-auto pt-2 cursor-pointer"
            >
              ← Kembali ke Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && currentStep < 3) {
    return (
      <div className="bg-white min-h-screen py-16 sm:py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#F5F5F7] rounded-[28px] p-8 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white text-[#1D1D1F] flex items-center justify-center mx-auto">
            <ShoppingBag size={24} strokeWidth={1.6} />
          </div>
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
            Tas belanja kosong
          </h2>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed">
            Tambahkan perangkat pilihan ke tas belanja terlebih dahulu sebelum melanjutkan checkout.
          </p>
          <button
            type="button"
            onClick={onBackToCart}
            className="h-[46px] px-7 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] font-normal transition-colors cursor-pointer"
          >
            Jelajahi Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#1D1D1F] pb-16">
      {/* 1. Full-Width Apple Header Band (#F5F5F7) */}
      <section className="w-full bg-[#F5F5F7] py-8 sm:py-12">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-[#6E6E73]">Checkout TechCare</p>
            <h1 className="text-[28px] sm:text-[38px] font-semibold tracking-[-0.03em] leading-[1.08] text-[#1D1D1F]">
              Selesaikan Pesanan
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {steps.map((st, i) => (
              <React.Fragment key={st.num}>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all ${
                      currentStep === st.num
                        ? 'bg-[#0071E3] text-white'
                        : currentStep > st.num
                        ? 'bg-[#1D1D1F] text-white'
                        : 'bg-white text-[#86868B]'
                    }`}
                  >
                    {currentStep > st.num ? '✓' : st.num}
                  </span>
                  <span
                    className={`text-[13px] hidden sm:inline ${
                      currentStep >= st.num ? 'text-[#1D1D1F] font-medium' : 'text-[#86868B]'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-6 sm:w-8 h-[2px] rounded-full ${
                      currentStep > st.num ? 'bg-[#0071E3]' : 'bg-[#D2D2D7]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Main 2-Column Checkout Grid (1-column on step 3) */}
        <div className={currentStep < 3 ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start' : 'max-w-2xl mx-auto'}>
          {/* Left Form Panel */}
          <div
            className={`${
              currentStep < 3 ? 'lg:col-span-8' : ''
            } bg-[#F5F5F7] rounded-[24px] p-5 sm:p-8`}
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
                  className="space-y-6"
                >
                  <div className="border-b border-[#D2D2D7]/70 pb-4">
                    <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                      Data Penerima &amp; Ekspedisi
                    </h2>
                    <p className="text-[13px] text-[#6E6E73] mt-0.5">
                      Ongkos kirim dihitung otomatis berdasarkan wilayah tujuan dan berat total paket.
                    </p>
                  </div>

                  <form onSubmit={handleNextStep1} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                          Nama Lengkap Penerima
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Contoh: Budi Santoso"
                          className={`w-full min-h-[44px] px-4 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] ${
                            errors.name ? 'ring-2 ring-[#D70015]' : ''
                          }`}
                        />
                        {errors.name && <p className="text-[12px] text-[#D70015] mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                          Nomor WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="081234567890"
                          className={`w-full min-h-[44px] px-4 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] ${
                            errors.phone ? 'ring-2 ring-[#D70015]' : ''
                          }`}
                        />
                        {errors.phone && <p className="text-[12px] text-[#D70015] mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                          Email Konfirmasi
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="budi@email.com"
                          className={`w-full min-h-[44px] px-4 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] ${
                            errors.email ? 'ring-2 ring-[#D70015]' : ''
                          }`}
                        />
                        {errors.email && <p className="text-[12px] text-[#D70015] mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                          Kota / Kabupaten
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Jakarta Selatan"
                          className={`w-full min-h-[44px] px-4 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3] ${
                            errors.city ? 'ring-2 ring-[#D70015]' : ''
                          }`}
                        />
                        {errors.city && <p className="text-[12px] text-[#D70015] mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="12190"
                          maxLength={10}
                          className="w-full min-h-[44px] px-4 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#0071E3]" />
                          Wilayah / Provinsi Tujuan
                        </span>
                      </label>
                      <select
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="w-full min-h-[44px] px-4 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                      >
                        {SHIPPING_ZONES.map((z) => (
                          <option key={z.id} value={z.id}>
                            {z.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5">
                        Alamat Lengkap
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                        className={`w-full min-h-[82px] px-4 py-3 rounded-[12px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] resize-none focus:outline-none focus:ring-2 focus:ring-[#0071E3] ${
                          errors.address ? 'ring-2 ring-[#D70015]' : ''
                        }`}
                      />
                      {errors.address && <p className="text-[12px] text-[#D70015] mt-1">{errors.address}</p>}
                    </div>

                    {/* Courier Options */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <label className="text-[14px] font-semibold text-[#1D1D1F]">
                          Pilih Ekspedisi
                        </label>
                        <span className="text-[12px] text-[#1D7F3E] font-medium">
                          Gratis ongkir Jabodetabek min. {formatIDR(FREE_SHIPPING_THRESHOLD)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {shippingOptions.map((c) => {
                          const active = selectedCourierId === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setSelectedCourierId(c.id)}
                              className={`p-4 rounded-[18px] text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                active
                                  ? 'bg-white ring-2 ring-[#0071E3]'
                                  : 'bg-white hover:bg-[#FAFAFC]'
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0">
                                <p className="text-[14px] font-semibold text-[#1D1D1F] truncate">
                                  {c.name}
                                </p>
                                <p className="text-[12px] text-[#424245]">
                                  {c.eta} · {c.weightKg} kg
                                </p>
                                <p className="text-[12px] text-[#6E6E73] leading-snug">{c.desc}</p>
                              </div>
                              <div className="text-right shrink-0">
                                {c.isFreePromo && (
                                  <span className="block text-[12px] text-[#86868B] line-through tabular-nums">
                                    {formatIDR(c.originalCost)}
                                  </span>
                                )}
                                <span
                                  className={`text-[14px] font-semibold tabular-nums ${
                                    c.cost === 0 ? 'text-[#1D7F3E]' : 'text-[#1D1D1F]'
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

                    <div className="pt-5 flex justify-between items-center gap-3 border-t border-[#D2D2D7]/70">
                      <button
                        type="button"
                        onClick={onBackToCart}
                        className="h-[44px] px-5 rounded-[980px] bg-white hover:bg-[#E8E8ED] text-[#1D1D1F] text-[14px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft size={15} />
                        <span>Kembali</span>
                      </button>

                      <button
                        type="submit"
                        className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Lanjut ke Pembayaran</span>
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
                  className="space-y-6"
                >
                  <div className="border-b border-[#D2D2D7]/70 pb-4">
                    <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                      Pembayaran &amp; Voucher
                    </h2>
                    <p className="text-[13px] text-[#6E6E73] mt-0.5">
                      Pilih QRIS atau transfer bank, masukkan kode promo bila ada, lalu buat pesanan.
                    </p>
                  </div>

                  {/* Payment Notice */}
                  <div className="p-4 rounded-[18px] bg-white flex items-start gap-3 text-[13px] text-[#424245]">
                    <Info size={16} className="text-[#0071E3] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Transfer sesuai nominal tagihan hingga <strong className="text-[#1D1D1F]">3 digit kode unik</strong>, lalu unggah bukti transfer agar admin segera memverifikasi pesanan.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-[18px] bg-white text-[#D70015] text-[13px] flex items-center gap-2.5">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Voucher Box */}
                  <div className="bg-white p-5 rounded-[20px] space-y-3">
                    <div className="flex items-center gap-2 text-[14px] font-semibold text-[#1D1D1F]">
                      <Tag size={15} className="text-[#0071E3]" />
                      <span>Voucher Diskon</span>
                    </div>

                    {appliedVoucher ? (
                      <div className="p-3.5 bg-[#F5F5F7] rounded-[14px] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Check size={16} className="text-[#1D7F3E] shrink-0" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#1D1D1F]">
                              Voucher {appliedVoucher.kode} aktif
                            </p>
                            <p className="text-[12px] text-[#D70015] font-medium">
                              Hemat {formatIDR(discountAmount)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVoucher}
                          className="w-10 h-10 rounded-full bg-white hover:bg-[#E8E8ED] text-[#1D1D1F] flex items-center justify-center cursor-pointer"
                          aria-label="Hapus kupon"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Masukkan kode (mis. TECHCARE10)"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            className="flex-1 min-h-[44px] px-4 rounded-[12px] bg-[#F5F5F7] text-[14px] text-[#1D1D1F] placeholder:text-[#86868B] uppercase focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyVoucher()}
                            disabled={validatingVoucher}
                            className="h-[44px] px-5 rounded-[980px] bg-[#1D1D1F] hover:bg-[#323236] text-white text-[13px] font-normal shrink-0 transition-colors cursor-pointer"
                          >
                            {validatingVoucher ? 'Cek...' : 'Pakai'}
                          </button>
                        </div>
                        {voucherError && <p className="text-[12px] text-[#D70015]">{voucherError}</p>}
                        <div className="flex items-center gap-2 flex-wrap text-[12px] text-[#6E6E73]">
                          <span>Kode tersedia:</span>
                          {['TECHCARE10', 'UPGRADERAM', 'LAPTOP250K'].map((code) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => handleApplyVoucher(code)}
                              className="h-[32px] px-3 rounded-[980px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[12px] font-medium text-[#1D1D1F] transition-colors cursor-pointer"
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-3">
                    <span className="text-[14px] font-semibold text-[#1D1D1F] block">
                      Metode Pembayaran
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          key: 'bank_transfer',
                          title: 'Transfer BCA',
                          sub: '8271039821 · TechCare',
                          icon: CreditCard
                        },
                        {
                          key: 'bank_mandiri',
                          title: 'Transfer Mandiri',
                          sub: '1340029182734 · TechCare',
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
                            className={`p-4 rounded-[18px] text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                              active ? 'bg-white ring-2 ring-[#0071E3]' : 'bg-white hover:bg-[#FAFAFC]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon
                                size={18}
                                strokeWidth={1.7}
                                className={active ? 'text-[#0071E3] shrink-0' : 'text-[#6E6E73] shrink-0'}
                              />
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-[#1D1D1F]">{m.title}</p>
                                <p className="text-[12px] text-[#6E6E73] truncate">{m.sub}</p>
                              </div>
                            </div>
                            <span
                              className={`w-4 h-4 rounded-full border shrink-0 ${
                                active ? 'border-[5px] border-[#0071E3]' : 'border-[#D2D2D7]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === 'qris' && (
                      <div className="p-5 rounded-[20px] bg-white flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src="/images/qris-techcare.svg"
                          alt="QRIS TechCare"
                          className="w-28 h-32 object-contain rounded-xl bg-[#F5F5F7] p-2"
                        />
                        <div className="text-[13px] text-[#6E6E73] space-y-1 text-center sm:text-left">
                          <p className="font-semibold text-[#1D1D1F]">QRIS Nasional TechCare</p>
                          <p>
                            Scan QRIS sebesar{' '}
                            <strong className="text-[#1D1D1F] tabular-nums">{formatIDR(finalTotal)}</strong>{' '}
                            (termasuk kode unik <strong className="text-[#1D1D1F]">+{uniqueCode}</strong>).
                          </p>
                          <p className="text-[12px] inline-flex items-center gap-1">
                            <Clock size={12} /> Batas pembayaran 24 jam.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Instant Proof Upload */}
                  <div className="p-5 rounded-[20px] bg-white space-y-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1D1D1F]">
                      <Upload size={15} className="text-[#0071E3]" />
                      <span>Unggah Bukti Bayar Sekarang (Opsional)</span>
                    </div>
                    <p className="text-[12px] text-[#6E6E73]">
                      Anda juga bisa mengunggah bukti transfer nanti dari halaman Detail Pesanan.
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProofFile}
                      className="block w-full text-[13px] text-[#6E6E73] file:mr-3 file:h-[38px] file:px-4 file:rounded-[980px] file:border-0 file:text-[13px] file:font-medium file:bg-[#F5F5F7] file:text-[#1D1D1F] hover:file:bg-[#E8E8ED] cursor-pointer"
                    />
                    {proofPreview && (
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={proofPreview}
                          alt="Preview bukti"
                          className="h-14 w-14 rounded-xl object-cover bg-[#F5F5F7]"
                        />
                        <input
                          type="text"
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          placeholder="Catatan transfer (mis. BCA a.n. Budi)"
                          className="flex-1 min-h-[44px] px-4 rounded-[12px] bg-[#F5F5F7] text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between items-center gap-3 border-t border-[#D2D2D7]/70">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="h-[44px] px-5 rounded-[980px] bg-white hover:bg-[#E8E8ED] text-[#1D1D1F] text-[14px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={15} />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionStatus !== 'idle'}
                      onClick={handleFinishOrder}
                      className="h-[44px] px-6 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white text-[14px] font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {actionStatus === 'processing' ? (
                        <span>Membuat Invoice...</span>
                      ) : actionStatus === 'success' ? (
                        <span>Pesanan Dibuat</span>
                      ) : (
                        <>
                          <span>Buat Pesanan</span>
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
                  className="text-center py-6 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-white text-[#1D7F3E] flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} strokeWidth={1.7} />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-[-0.025em] text-[#1D1D1F]">
                      Pesanan berhasil dibuat.
                    </h2>
                    <p className="text-[14px] text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                      Lanjutkan ke halaman Instruksi Pembayaran untuk melihat rekening/QRIS, batas waktu 24 jam, dan unggah bukti transfer.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-[22px] max-w-md mx-auto text-left space-y-2.5 text-[13px]">
                    <div className="flex justify-between items-center border-b border-[#D2D2D7]/70 pb-3">
                      <span className="text-[#6E6E73]">Nomor Invoice</span>
                      <span className="font-semibold text-[#1D1D1F] text-[15px]">
                        #{completedOrder.nomorPesanan}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6E6E73]">Penerima</span>
                      <span className="font-medium text-[#1D1D1F]">{completedOrder.customer.nama}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[#6E6E73]">Ekspedisi</span>
                      <span className="text-[#1D1D1F] text-right max-w-[64%]">{completedOrder.kurir}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6E6E73]">Metode Bayar</span>
                      <span className="text-[#1D1D1F]">{completedOrder.metodeBayar}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6E6E73]">Kode Unik</span>
                      <span className="font-semibold text-[#1D1D1F] tabular-nums">
                        +{formatIDR(completedOrder.uniqueCode || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-[#D2D2D7]/70 text-[15px] font-semibold">
                      <span>Total Transfer Tepat</span>
                      <span className="text-[17px] text-[#1D1D1F] tabular-nums">
                        {formatIDR(completedOrder.total)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOrderCompleted(completedOrder.nomorPesanan)}
                    className="h-[46px] px-7 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[15px] font-normal inline-flex items-center gap-2 transition-colors cursor-pointer"
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
            <aside className="lg:col-span-4 lg:sticky lg:top-20 bg-[#F5F5F7] rounded-[24px] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#D2D2D7]/70 pb-3.5">
                <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Ringkasan
                </h3>
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#6E6E73] tabular-nums">
                  <Scale size={13} /> {formatWeight(totalWeightGram)} ({billableKg} kg)
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.variantKey || it.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shrink-0">
                      <img src={it.gambar} alt={it.nama} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#1D1D1F] truncate">{it.nama}</p>
                      <p className="text-[12px] text-[#6E6E73] truncate">
                        {it.jumlah}× · {it.specLabel || it.warna}
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1D1D1F] shrink-0 tabular-nums">
                      {formatIDR(it.harga * it.jumlah)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#D2D2D7]/70 space-y-2 text-[13px]">
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-[#1D1D1F]">{formatIDR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D70015] font-medium">
                    <span>Diskon ({appliedVoucher?.kode})</span>
                    <span className="tabular-nums">-{formatIDR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E6E73] gap-2">
                  <span className="truncate">Ongkir ({selectedCourier.name})</span>
                  <span className="font-medium text-[#1D1D1F] shrink-0 tabular-nums">
                    {selectedCourier.cost > 0 ? formatIDR(selectedCourier.cost) : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Kode Unik</span>
                  <span className="font-medium text-[#1D1D1F] tabular-nums">+{formatIDR(uniqueCode)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3.5 border-t border-[#D2D2D7]">
                  <span className="text-[15px] font-semibold text-[#1D1D1F]">Total</span>
                  <span className="text-[19px] font-semibold text-[#1D1D1F] tabular-nums">
                    {formatIDR(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-[16px] bg-white flex items-center gap-2.5 text-[12px] text-[#6E6E73]">
                <ShieldCheck size={16} className="text-[#1D7F3E] shrink-0" />
                <span>Stok diamankan otomatis · Garansi toko 30–90 hari.</span>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
