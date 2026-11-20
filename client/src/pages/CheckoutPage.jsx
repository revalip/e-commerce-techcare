import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  X,
  Sparkles,
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
  AlertCircle
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

  // Step 1: Alamat & Ekspedisi
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

  // Step 2: Pembayaran, Kode Unik, Bukti Opsional & Diskon
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer'); // 'bank_transfer' | 'bank_mandiri' | 'qris'
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
      ? 'QRIS Instan (Simulasi)'
      : paymentMethod === 'bank_mandiri'
      ? 'Transfer Bank Mandiri (Simulasi)'
      : 'Transfer Bank BCA (Simulasi)';

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
      }, 350);
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
      <div className="bg-[#f9f9f8] min-h-screen py-14 sm:py-24 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-neutral-900 text-white rounded-full flex items-center justify-center">
            <User size={28} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-neutral-400">
              CHECKOUT TECHCARE
            </span>
            <h2 className="font-serif text-3xl text-neutral-900">Masuk / Buat Akun Buyer</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Masuk atau daftar akun buyer agar Anda dapat menghitung ongkir, mengunggah bukti pembayaran, dan melacak nomor resi secara real-time.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() =>
                openAuthModal('login', 'Silakan masuk untuk melanjutkan proses checkout & pelacakan pesanan.')
              }
              className="w-full bg-black text-white hover:bg-neutral-800 transition-all py-3.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm"
            >
              Masuk ke Akun
            </button>
            <button
              onClick={() =>
                openAuthModal('register', 'Daftar akun buyer baru untuk checkout dan lacak pesanan Anda.')
              }
              className="w-full bg-white hover:bg-neutral-100 text-neutral-900 transition-all py-3.5 rounded-full text-xs font-bold tracking-wider uppercase border border-neutral-300"
            >
              Daftar Akun Baru (Buyer)
            </button>
            <button
              onClick={onBackToCart}
              className="text-xs text-neutral-500 hover:text-black underline block mx-auto pt-2"
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
      <div className="bg-[#f9f9f8] min-h-screen py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-500">
            <ShoppingBag size={24} />
          </div>
          <h2 className="font-serif text-2xl text-neutral-900">Keranjang Anda Kosong</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Tambahkan perangkat IT pilihan ke keranjang terlebih dahulu sebelum melanjutkan ke halaman checkout.
          </p>
          <button
            onClick={onBackToCart}
            className="w-full py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
          >
            Jelajahi Katalog Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f8] min-h-screen py-6 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Stepper Header */}
        <Reveal>
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-neutral-400">
              TECHCARE CHECKOUT
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl text-neutral-900">
              Selesaikan Pesanan Anda
            </h1>

            <div className="flex items-center justify-center max-w-sm mx-auto pt-2">
              {steps.map((st, i) => (
                <React.Fragment key={st.num}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        currentStep === st.num
                          ? 'bg-black text-white ring-4 ring-neutral-200'
                          : currentStep > st.num
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {st.num}
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 font-semibold whitespace-nowrap">
                      {st.title}
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

        {/* Main Card */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-10 border border-neutral-200/70 shadow-xs relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STEP 1: ALAMAT & EKSPEDISI */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <h3 className="font-serif text-xl font-medium text-neutral-900">
                    Langkah 1: Data Penerima & Ekspedisi
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Ongkir dihitung otomatis berdasarkan wilayah tujuan & berat total paket (tarif lokal).
                  </p>
                </div>

                {/* Order Items Mini Summary + Total Weight */}
                <div className="bg-[#f8f8f7] rounded-2xl p-4 border border-neutral-200/70 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Ringkasan Keranjang ({items.length} item)
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-700">
                      <Scale size={11} />
                      Berat Total: {formatWeight(totalWeightGram)} (dihitung {billableKg} kg)
                    </span>
                  </div>
                  {items.map((it) => (
                    <div key={it.variantKey || it.id} className="flex justify-between items-center text-xs gap-2">
                      <div className="min-w-0">
                        <span className="font-semibold text-neutral-900">{it.nama}</span>
                        <span className="text-neutral-500"> ({it.jumlah}x)</span>
                        {it.specLabel && (
                          <span className="block text-[10px] text-neutral-500">{it.specLabel}</span>
                        )}
                      </div>
                      <span className="font-bold text-neutral-900 flex-shrink-0">
                        {formatIDR(it.harga * it.jumlah)}
                      </span>
                    </div>
                  ))}
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
                        placeholder="Contoh: Budi Santoso"
                        className={`w-full px-4 py-3 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                          errors.name
                            ? 'border-red-500 bg-red-50/40'
                            : 'border-neutral-200 focus:border-black focus:bg-white'
                        }`}
                      />
                      {errors.name && <p className="text-[10px] text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className={`w-full px-4 py-3 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                          errors.phone
                            ? 'border-red-500 bg-red-50/40'
                            : 'border-neutral-200 focus:border-black focus:bg-white'
                        }`}
                      />
                      {errors.phone && <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Email Konfirmasi *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="budi@email.com"
                        className={`w-full px-4 py-3 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                          errors.email
                            ? 'border-red-500 bg-red-50/40'
                            : 'border-neutral-200 focus:border-black focus:bg-white'
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
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
                        className={`w-full px-4 py-3 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all ${
                          errors.city
                            ? 'border-red-500 bg-red-50/40'
                            : 'border-neutral-200 focus:border-black focus:bg-white'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="12190"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-[#f9f9fb] border border-neutral-200 focus:border-black focus:bg-white rounded-2xl text-xs outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Wilayah / Zona Pengiriman untuk Kalkulasi Ongkir */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        Wilayah / Provinsi Tujuan (Penentu Tarif Ongkir) *
                      </span>
                    </label>
                    <select
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f9f9fb] border border-neutral-200 focus:border-black focus:bg-white rounded-2xl text-xs font-medium outline-none transition-all cursor-pointer"
                    >
                      {SHIPPING_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.label}
                        </option>
                      ))}
                    </select>
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
                      className={`w-full px-4 py-3 bg-[#f9f9fb] border rounded-2xl text-xs outline-none transition-all resize-none ${
                        errors.address
                          ? 'border-red-500 bg-red-50/40'
                          : 'border-neutral-200 focus:border-black focus:bg-white'
                      }`}
                    />
                    {errors.address && <p className="text-[10px] text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  {/* Courier / Workshop Selection */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                        Pilih Ekspedisi (JNE / J&amp;T / SiCepat / Workshop)
                      </label>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Gratis Ongkir Jabodetabek (Reguler/J&amp;T) min. {formatIDR(FREE_SHIPPING_THRESHOLD)}
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
                            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 ${
                              active
                                ? 'border-black bg-neutral-50 shadow-2xs ring-1 ring-black'
                                : 'border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                                {c.id === 'workshop' ? <Wrench size={13} /> : <Truck size={13} />}
                                <span className="truncate">{c.label}</span>
                              </p>
                              <p className="text-[10px] text-neutral-600 font-medium">
                                Estimasi: {c.eta} • {c.weightKg} kg
                              </p>
                              <p className="text-[10px] text-neutral-400">{c.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {c.isFreePromo && (
                                <span className="block text-[10px] text-neutral-400 line-through">
                                  {formatIDR(c.originalCost)}
                                </span>
                              )}
                              <span
                                className={`text-[11px] font-bold ${
                                  c.cost === 0 ? 'text-emerald-700' : 'text-neutral-900'
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

                  <div className="pt-4 flex justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={onBackToCart}
                      className="text-xs font-semibold text-neutral-500 hover:text-black uppercase tracking-wider flex items-center space-x-1 py-2"
                    >
                      <ArrowLeft size={14} />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="submit"
                      className="bg-black text-white hover:bg-neutral-800 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95 shadow-sm"
                    >
                      <span>Lanjut Pembayaran</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: PEMBAYARAN & VOUCHER */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="space-y-6"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <h3 className="font-serif text-xl font-medium text-neutral-900">
                    Langkah 2: Pembayaran Lokal & Kupon Promo
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Pilih metode QRIS atau Transfer Bank lokal, klaim voucher, lalu selesaikan pesanan.
                  </p>
                </div>

                {/* Simulation Transparency Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                  <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Mode Simulasi Pembayaran:</strong> Pembayaran QRIS dan Transfer Bank pada aplikasi ini adalah simulasi untuk keperluan demo e-commerce (tanpa menarik dana sungguhan). Bukti bayar akan diverifikasi melalui Dashboard Admin.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Voucher Box */}
                <div className="bg-[#f8f8f7] p-4 sm:p-5 rounded-3xl border border-neutral-200/80 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800">
                    <Tag size={15} />
                    <span>Kupon Diskon TECHCARE</span>
                  </div>

                  {appliedVoucher ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles size={16} className="text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">
                            Kupon <strong>{appliedVoucher.kode}</strong> Aktif
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Hemat {formatIDR(discountAmount)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveVoucher}
                        className="p-1.5 rounded-full text-emerald-800 hover:bg-emerald-100"
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
                          placeholder="Kode promo (mis. TECHCARE10)"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs uppercase font-mono outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyVoucher()}
                          disabled={validatingVoucher}
                          className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-2xl hover:bg-neutral-800 uppercase tracking-wider disabled:opacity-50"
                        >
                          {validatingVoucher ? 'Cek...' : 'Pakai'}
                        </button>
                      </div>
                      {voucherError && <p className="text-[11px] text-red-600">{voucherError}</p>}
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-neutral-500">
                        <span>Kode tersedia:</span>
                        {['TECHCARE10', 'UPGRADERAM', 'LAPTOP250K'].map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleApplyVoucher(code)}
                            className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:border-black font-mono font-bold text-neutral-800"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                    Pilih Metode Pembayaran Lokal
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-black bg-neutral-50 ring-1 ring-black'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <CreditCard size={18} className="shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900">Transfer BCA</p>
                          <p className="text-[10px] text-neutral-500 truncate">8271039821 • TECHCARE</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border shrink-0 ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-4 border-black'
                            : 'border-neutral-300'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_mandiri')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                        paymentMethod === 'bank_mandiri'
                          ? 'border-black bg-neutral-50 ring-1 ring-black'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <CreditCard size={18} className="shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900">Transfer Mandiri</p>
                          <p className="text-[10px] text-neutral-500 truncate">1340029182734 • TECHCARE</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border shrink-0 ${
                          paymentMethod === 'bank_mandiri'
                            ? 'border-4 border-black'
                            : 'border-neutral-300'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                        paymentMethod === 'qris'
                          ? 'border-black bg-neutral-50 ring-1 ring-black'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <QrCode size={18} className="shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900">QRIS Instan</p>
                          <p className="text-[10px] text-neutral-500 truncate">GoPay, OVO, Dana, m-Banking</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border shrink-0 ${
                          paymentMethod === 'qris' ? 'border-4 border-black' : 'border-neutral-300'
                        }`}
                      />
                    </button>
                  </div>

                  {paymentMethod === 'qris' && (
                    <div className="p-4 rounded-2xl bg-[#f8f8f7] border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src="/images/qris-techcare.svg"
                        alt="QRIS Simulasi TECHCARE"
                        className="w-28 h-32 object-contain rounded-xl bg-white p-1.5 border border-neutral-200"
                      />
                      <div className="text-xs text-neutral-600 space-y-1 text-center sm:text-left">
                        <p className="font-bold text-neutral-900">QRIS Nasional TECHCARE (Simulasi)</p>
                        <p>
                          Scan kode QRIS di samping atau di halaman invoice setelah pesanan dibuat sebesar{' '}
                          <strong className="text-neutral-900">{formatIDR(finalTotal)}</strong> (sudah termasuk kode unik{' '}
                          <strong className="font-mono">+{uniqueCode}</strong>).
                        </p>
                        <p className="text-[11px] text-neutral-500 inline-flex items-center gap-1">
                          <Clock size={12} /> Batas waktu pembayaran: 24 jam sejak pesanan dibuat.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Upload Bukti Langsung */}
                <div className="p-4 rounded-2xl border border-dashed border-neutral-300 bg-[#fafafa] space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                    <Upload size={14} />
                    <span>Upload Bukti Bayar Sekarang (Opsional — bisa juga nanti di Halaman Invoice)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofFile}
                    className="block w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white cursor-pointer"
                  />
                  {proofPreview && (
                    <div className="flex items-center gap-3 pt-1">
                      <img
                        src={proofPreview}
                        alt="Preview bukti"
                        className="h-14 w-14 rounded-lg object-cover border border-neutral-200"
                      />
                      <input
                        type="text"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="Catatan transfer (mis. BCA a.n. Budi)"
                        className="flex-1 px-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs outline-none focus:border-black"
                      />
                    </div>
                  )}
                </div>

                {/* Cost Summary with Unique Code */}
                <div className="p-4 bg-[#f8f8f7] rounded-2xl border border-neutral-200/70 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal Produk</span>
                    <span>{formatIDR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Diskon ({appliedVoucher?.kode})</span>
                      <span>-{formatIDR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-600 gap-2">
                    <span className="truncate">
                      Ongkir ({selectedCourier.name} • {billableKg} kg • {selectedZone.label.split(' (')[0]})
                    </span>
                    <span className="text-neutral-900 font-semibold shrink-0">
                      {selectedCourier.cost > 0 ? formatIDR(selectedCourier.cost) : 'Gratis'}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Kode Unik Verifikasi (3 Digit)</span>
                    <span className="font-mono font-bold text-neutral-900">+{formatIDR(uniqueCode)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total Transfer Tepat</span>
                    <span className="text-base">{formatIDR(finalTotal)}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1 pt-0.5">
                    <Clock size={11} />
                    Batas waktu pembayaran 24 jam setelah invoice diterbitkan.
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-neutral-500 hover:text-black uppercase tracking-wider flex items-center space-x-1 py-2"
                  >
                    <ArrowLeft size={14} />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionStatus !== 'idle'}
                    onClick={handleFinishOrder}
                    className="bg-black text-white hover:bg-neutral-800 px-6 sm:px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 shadow-md"
                  >
                    {actionStatus === 'processing' ? (
                      <span>Membuat Invoice...</span>
                    ) : actionStatus === 'success' ? (
                      <span>Pesanan Dibuat!</span>
                    ) : (
                      <>
                        <span>Buat Pesanan Sekarang</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: INVOICE & REDIRECT TO TRACKING */}
            {currentStep === 3 && completedOrder && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={32} />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900">
                    Pesanan TECHCARE Berhasil Dibuat
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                    Simpan nomor invoice Anda di bawah. Lanjutkan ke halaman <strong>Instruksi Bayar &amp; Tracking</strong> untuk menyelesaikan pembayaran sesuai kode unik dan mengunggah bukti transfer.
                  </p>
                </div>

                <div className="bg-[#f8f8f7] p-5 sm:p-6 rounded-3xl border border-neutral-200 max-w-md mx-auto text-left space-y-2.5 text-xs">
                  <div className="flex justify-between items-center border-b border-neutral-200 pb-2.5">
                    <span className="text-neutral-500">Nomor Invoice</span>
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      #{completedOrder.nomorPesanan}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Penerima</span>
                    <span className="font-semibold text-neutral-900">{completedOrder.customer.nama}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-neutral-500">Ekspedisi</span>
                    <span className="text-neutral-900 text-right max-w-[62%]">{completedOrder.kurir}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Metode Bayar</span>
                    <span className="text-neutral-900">{completedOrder.metodeBayar}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Kode Unik</span>
                    <span className="font-mono font-bold text-neutral-900">
                      +{formatIDR(completedOrder.uniqueCode || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Status Saat Ini</span>
                    <span className="font-bold text-amber-700">{completedOrder.status}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-neutral-200 text-sm font-bold">
                    <span>Total Transfer Tepat</span>
                    <span>{formatIDR(completedOrder.total)}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => onOrderCompleted(completedOrder.nomorPesanan)}
                    className="bg-black text-white hover:bg-neutral-800 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md"
                  >
                    <span>Lihat Instruksi Bayar &amp; Lacak</span>
                    <ArrowRight size={14} />
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
