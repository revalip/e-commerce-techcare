import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  Copy,
  Check,
  Upload,
  AlertCircle,
  ArrowLeft,
  MapPin,
  Wrench,
  CreditCard,
  XCircle,
  Info
} from 'lucide-react';
import {
  getOrderByNumber,
  uploadOrderPaymentProof,
  confirmOrderReceived,
  cancelOrder
} from '../services/api';
import { formatIDR, formatDate, formatWeight, getStatusBadge, getRemainingTime } from '../utils/format';

export default function OrderDetailPage({ orderNumber, onBackToOrders, onBackToShop }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload Bukti Pembayaran State
  const [proofPreview, setProofPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const loadOrder = async () => {
    setLoading(true);
    setError('');
    const res = await getOrderByNumber(orderNumber);
    if (res.success) {
      setOrder(res.data);
    } else {
      setError(res.error || 'Pesanan tidak ditemukan.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (orderNumber) loadOrder();
  }, [orderNumber]);

  // Countdown timer batas waktu pembayaran (real-time setiap detik)
  useEffect(() => {
    if (!order?.paymentDeadline || order.paymentStatus === 'paid' || order.statusKey === 'cancelled') {
      setCountdown(null);
      return;
    }
    const updateTimer = () => setCountdown(getRemainingTime(order.paymentDeadline));
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.paymentDeadline, order?.paymentStatus, order?.statusKey]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(String(text));
    setCopiedField(key);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran file maksimal 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofPreview) return;
    setUploading(true);
    const res = await uploadOrderPaymentProof(order.nomorPesanan, {
      proofUrl: proofPreview,
      notes
    });
    setUploading(false);
    if (res.success) {
      setOrder(res.data);
      setNotes('');
      setProofPreview(null);
      setActionMsg('Bukti pembayaran berhasil dikirim! Admin TECHCARE akan segera memverifikasi.');
      setTimeout(() => setActionMsg(''), 5000);
    }
  };

  const handleConfirmReceived = async () => {
    if (!window.confirm('Konfirmasi bahwa unit pesanan telah Anda terima dalam kondisi baik?')) return;
    setConfirming(true);
    const res = await confirmOrderReceived(order.id);
    setConfirming(false);
    if (res.success && res.data) {
      setOrder(res.data);
      setActionMsg('Terima kasih! Pesanan selesai & Garansi Toko TECHCARE kini resmi aktif.');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Yakin ingin membatalkan pesanan ini? Stok unit akan dikembalikan ke katalog.')) {
      return;
    }
    setCancelling(true);
    const res = await cancelOrder(order.id);
    setCancelling(false);
    if (res.success && res.data) {
      setOrder(res.data);
      setActionMsg('Pesanan berhasil dibatalkan dan stok produk telah dikembalikan.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f8]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-semibold tracking-wider uppercase">
            Memuat Detail &amp; Tracking Pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f8] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-200 text-center space-y-4">
          <AlertCircle size={36} className="text-rose-500 mx-auto" />
          <h2 className="font-serif text-xl text-neutral-900">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-neutral-500">{error}</p>
          <button
            onClick={onBackToOrders || onBackToShop}
            className="bg-black text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
          >
            Kembali ke Daftar Pesanan
          </button>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(order.statusKey || order.paymentStatus);
  const isCancelled = order.statusKey === 'cancelled';
  const isMandiri = (order.metodeBayar || '').toLowerCase().includes('mandiri');
  const isQris = order.paymentMethodKey === 'qris' || (order.metodeBayar || '').includes('QRIS');
  const bankAccNumber = isMandiri ? '1340029182734' : '8271039821';
  const bankName = isMandiri ? 'Bank Mandiri' : 'Bank Central Asia (BCA)';

  // 6-Step Complete Order Lifecycle
  const steps = [
    { key: 'pending', title: 'Menunggu Bayar', sub: 'Transfer / QRIS', icon: CreditCard },
    { key: 'awaiting_verification', title: 'Verifikasi', sub: 'Cek Bukti', icon: Clock },
    { key: 'paid', title: 'Dibayar', sub: 'Lunas', icon: CheckCircle2 },
    { key: 'processing', title: 'Dikemas & QC', sub: '32 Titik QC', icon: Wrench },
    { key: 'shipped', title: 'Dikirim', sub: 'Kurir & Resi', icon: Truck },
    { key: 'completed', title: 'Selesai', sub: 'Garansi Aktif', icon: ShieldCheck }
  ];

  const getActiveStepIndex = () => {
    if (order.statusKey === 'completed') return 5;
    if (order.statusKey === 'shipped') return 4;
    if (order.statusKey === 'processing') return 3;
    if (order.statusKey === 'paid' || order.paymentStatus === 'paid') return 2;
    if (order.statusKey === 'awaiting_verification' || order.paymentStatus === 'awaiting_verification') return 1;
    return 0;
  };

  const activeIdx = getActiveStepIndex();
  const showPaymentSection =
    !isCancelled &&
    (order.paymentStatus === 'pending' ||
      order.paymentStatus === 'rejected' ||
      order.paymentStatus === 'awaiting_verification');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-[#f9f9f8] min-h-screen py-6 sm:py-14"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Top Navigation & Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
          <div>
            <button
              onClick={onBackToOrders || onBackToShop}
              className="inline-flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-black mb-2 transition-colors uppercase font-semibold tracking-wider"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Riwayat &amp; Lacak Pesanan</span>
            </button>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-medium">
                Pesanan #{order.nomorPesanan}
              </h1>
              <button
                onClick={() => handleCopy(order.nomorPesanan, 'inv')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold uppercase text-neutral-700"
              >
                {copiedField === 'inv' ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedField === 'inv' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Dibuat pada {formatDate(order.tanggal)} • {order.metodeBayar}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${badge.bg}`}>
              {order.status || badge.label}
            </span>
            {order.statusKey === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold"
              >
                <XCircle size={13} />
                <span>{cancelling ? 'Membatalkan...' : 'Batalkan'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Success / Action Feedback Banner */}
        {actionMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Cancelled Notice */}
        {isCancelled && (
          <div className="p-5 rounded-3xl bg-neutral-100 border border-neutral-300 flex items-center gap-3 text-xs text-neutral-700">
            <XCircle size={22} className="text-neutral-600 shrink-0" />
            <div>
              <p className="font-bold text-neutral-900 text-sm">Pesanan Dibatalkan</p>
              <p className="mt-0.5">
                Pesanan ini telah dibatalkan dan stok perangkat telah dikembalikan secara otomatis ke katalog TECHCARE.
              </p>
            </div>
          </div>
        )}

        {/* 1. VISUAL 6-STEP TRACKING PROGRESS CARD */}
        {!isCancelled && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-neutral-200/70 shadow-xs space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block">
                  STATUS PESANAN, PEMBAYARAN &amp; PENGIRIMAN
                </span>
                <h2 className="font-serif text-lg sm:text-xl text-neutral-900">
                  Progres Pesanan Anda
                </h2>
              </div>

              {order.statusKey === 'shipped' && (
                <button
                  onClick={handleConfirmReceived}
                  disabled={confirming}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>{confirming ? 'Memproses...' : 'Konfirmasi Pesanan Diterima'}</span>
                </button>
              )}
            </div>

            {/* 6-Step Stepper Visual */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {steps.map((st, i) => {
                const Icon = st.icon;
                const isPassed = i <= activeIdx;
                const isCurrent = i === activeIdx;
                return (
                  <div
                    key={st.key}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                        : isPassed
                        ? 'bg-neutral-50 text-neutral-900 border-neutral-200'
                        : 'bg-white text-neutral-400 border-neutral-100'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                        isCurrent
                          ? 'bg-white text-black'
                          : isPassed
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check size={14} strokeWidth={2.5} /> : <Icon size={14} />}
                    </div>
                    <span className="text-[11px] font-bold leading-tight">{st.title}</span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isCurrent ? 'text-neutral-300' : 'text-neutral-400'
                      }`}
                    >
                      {st.sub}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Courier & Resi Bar */}
            <div className="bg-[#f5f5f4] rounded-2xl p-4 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 flex-shrink-0">
                  <Truck size={18} />
                </div>
                <div className="text-xs">
                  <p className="text-neutral-500">
                    Ekspedisi: <strong className="text-neutral-900">{order.kurir || 'JNE Reguler'}</strong>
                  </p>
                  <p className="text-neutral-500 mt-0.5">
                    No. Resi:{' '}
                    {order.resi ? (
                      <strong className="font-mono text-sm text-neutral-900 tracking-wider">
                        {order.resi}
                      </strong>
                    ) : (
                      <span className="italic text-neutral-400">
                        Menunggu proses QC &amp; penyerahan ke kurir
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {order.resi && (
                <button
                  onClick={() => handleCopy(order.resi, 'resi')}
                  className="self-start sm:self-center px-4 py-2.5 bg-black text-white hover:bg-neutral-800 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  {copiedField === 'resi' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedField === 'resi' ? 'Resi Tersalin' : 'Salin No. Resi'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. PAYMENT INSTRUCTION (KODE UNIK + BATAS WAKTU + QRIS) & PROOF UPLOAD */}
        {showPaymentSection && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Instruksi Bayar */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/70 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 gap-2">
                <div>
                  <h3 className="font-serif text-lg text-neutral-900">Instruksi Pembayaran</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Simulasi Pembayaran Lokal
                  </span>
                </div>
                {countdown && (
                  <div
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold inline-flex items-center gap-1.5 ${
                      countdown.expired
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Clock size={12} />
                    <span>{countdown.text}</span>
                  </div>
                )}
              </div>

              {/* Exact Transfer Amount with Unique Code */}
              <div className="bg-neutral-900 text-white p-4 rounded-2xl space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Transfer Tepat Hingga 3 Digit Kode Unik
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight">
                    {formatIDR(order.total)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.total, 'amount')}
                    className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                  >
                    {copiedField === 'amount' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedField === 'amount' ? 'Tersalin' : 'Salin Nominal'}</span>
                  </button>
                </div>
                {order.uniqueCode > 0 && (
                  <p className="text-[10px] text-neutral-300">
                    Termasuk kode unik verifikasi <strong className="font-mono text-amber-300">+{order.uniqueCode}</strong>
                    {order.paymentDeadline ? ` • Batas bayar ${formatDate(order.paymentDeadline)}` : ''}
                  </p>
                )}
              </div>

              {isQris ? (
                <div className="text-center space-y-3">
                  <div className="max-w-[230px] mx-auto bg-[#fafafa] p-2.5 rounded-2xl border border-neutral-200">
                    <img
                      src="/images/qris-techcare.svg"
                      alt="QRIS Simulasi TECHCARE"
                      className="w-full h-auto object-contain rounded-xl"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Scan kode QRIS di atas melalui BCA Mobile, Livin, GoPay, OVO, Dana, atau ShopeePay sebesar{' '}
                    <strong className="text-neutral-900">{formatIDR(order.total)}</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-[#f5f5f4] p-4 rounded-2xl border border-neutral-200 space-y-2.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {bankName}
                      </p>
                      <p className="text-xs text-neutral-700 font-semibold">
                        a.n. PT TECHCARE SOLUSI TEKNOLOGI
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-neutral-200">
                      <span className="font-mono text-base font-bold text-neutral-900 tracking-wider">
                        {bankAccNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankAccNumber, 'rek')}
                        className="px-3 py-1.5 bg-black text-white rounded-lg text-[11px] font-semibold"
                      >
                        {copiedField === 'rek' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Setelah transfer tepat sebesar <strong className="text-neutral-900">{formatIDR(order.total)}</strong>, unggah screenshot bukti transfer pada form di samping agar admin segera memverifikasi.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-start gap-2 text-[11px] text-neutral-500">
                <Info size={14} className="shrink-0 mt-0.5 text-neutral-700" />
                <span>
                  Ini adalah <strong>simulasi pembayaran</strong> untuk demo proyek kuliah. Anda dapat mengunggah gambar bukti dummy apa saja lalu memverifikasinya lewat akun Admin Demo.
                </span>
              </div>
            </div>

            {/* Form Upload Bukti */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/70 shadow-xs space-y-4">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-lg text-neutral-900">Upload Bukti Pembayaran</h3>
                <p className="text-xs text-neutral-500">
                  {order.paymentStatus === 'rejected'
                    ? 'Bukti sebelumnya ditolak admin. Silakan unggah ulang bukti transfer yang jelas.'
                    : 'Unggah screenshot transfer/QRIS untuk konfirmasi pembayaran oleh Admin.'}
                </p>
              </div>

              {order.paymentProofUrl && (
                <div className="p-3 bg-[#fafafa] rounded-2xl border border-neutral-200 text-center space-y-1.5">
                  <p className="text-[11px] font-semibold text-neutral-700">Bukti yang Terunggah:</p>
                  <img
                    src={order.paymentProofUrl}
                    alt="Bukti Pembayaran"
                    className="max-h-40 mx-auto rounded-xl object-contain border border-neutral-200"
                  />
                  {order.paymentNotes && (
                    <p className="text-[11px] text-neutral-500">{order.paymentNotes}</p>
                  )}
                </div>
              )}

              <form onSubmit={handleUploadProof} className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-neutral-800 border border-neutral-200 rounded-2xl p-1.5 bg-[#fafafa]"
                />
                {proofPreview && (
                  <img
                    src={proofPreview}
                    alt="Preview Bukti"
                    className="max-h-36 mx-auto rounded-xl object-contain border border-neutral-200"
                  />
                )}
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan (opsional, misal: Transfer BCA a.n. Budi)"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-neutral-200 rounded-xl text-xs outline-none focus:border-black"
                />
                <button
                  type="submit"
                  disabled={!proofPreview || uploading}
                  className="w-full bg-black text-white hover:bg-neutral-800 disabled:opacity-40 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Upload size={14} />
                  <span>{uploading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. TRACKING CHECKPOINT LOGS */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-neutral-200/70 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-neutral-900" />
              <h3 className="font-serif text-lg sm:text-xl text-neutral-900">
                Riwayat Pelacakan &amp; Aktivitas Pesanan
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-neutral-400">
              {(order.trackingHistory || []).length} update
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
            {(order.trackingHistory || []).map((log, idx) => {
              const isLatest = idx === 0;
              return (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      isLatest
                        ? 'bg-black border-black text-white ring-4 ring-neutral-200'
                        : 'bg-white border-neutral-300'
                    }`}
                  >
                    {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className={`text-xs sm:text-sm font-bold ${isLatest ? 'text-black' : 'text-neutral-700'}`}>
                      {log.status}
                    </h4>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {formatDate(log.waktu)}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-neutral-500 mt-0.5">{log.lokasi}</p>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{log.keterangan}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. RINCIAN ITEM & ALAMAT PENGIRIMAN */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-neutral-200/70 shadow-xs space-y-6">
          <h3 className="font-serif text-lg sm:text-xl text-neutral-900 border-b border-neutral-100 pb-3">
            Rincian Unit &amp; Alamat Pengiriman
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-3">
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="w-14 h-14 rounded-xl bg-[#f4f4f5] p-1.5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={it.gambar || '/images/products/thinkpad-x1-carbon-front.jpg'}
                      alt={it.nama}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{it.nama}</p>
                    <p className="text-[11px] text-neutral-500">
                      {[it.specLabel, it.warna].filter(Boolean).join(' • ')}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {it.jumlah} x {formatIDR(it.harga)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {formatIDR((it.harga || 0) * (it.jumlah || 1))}
                  </span>
                </div>
              ))}

              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>{formatIDR(order.subtotal)}</span>
                </div>
                {order.diskon > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Diskon ({order.kodeDiskon || 'Promo'})</span>
                    <span>-{formatIDR(order.diskon)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Ongkir ({formatWeight(order.totalWeightGram || 1000)})</span>
                  <span>{order.ongkir > 0 ? formatIDR(order.ongkir) : 'Gratis'}</span>
                </div>
                {order.uniqueCode > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Kode Unik</span>
                    <span className="font-mono">+{formatIDR(order.uniqueCode)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-100">
                  <span>Total Pembayaran</span>
                  <span>{formatIDR(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f8f7] rounded-2xl p-5 border border-neutral-200/70 space-y-2 text-xs text-neutral-600 h-fit">
              <div className="flex items-center gap-2 text-neutral-900 font-bold uppercase tracking-wider text-[11px] mb-2">
                <Package size={14} />
                <span>Info Penerima &amp; Ekspedisi</span>
              </div>
              <p>
                <strong className="text-neutral-900">Nama:</strong> {order.customer?.nama}
              </p>
              <p>
                <strong className="text-neutral-900">WhatsApp:</strong> {order.customer?.telepon}
              </p>
              <p>
                <strong className="text-neutral-900">Email:</strong> {order.customer?.email}
              </p>
              <p>
                <strong className="text-neutral-900">Alamat:</strong> {order.customer?.alamat},{' '}
                {order.customer?.kota} {order.customer?.kodePos || ''}
              </p>
              {order.shippingZone && (
                <p>
                  <strong className="text-neutral-900">Wilayah:</strong> {order.shippingZone}
                </p>
              )}
              <p>
                <strong className="text-neutral-900">Kurir:</strong> {order.kurir || 'JNE Reguler'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
