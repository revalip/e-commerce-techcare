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
    reader.onloadend = () => setProofPreview(reader.result);
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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-2 border-[#1D2129] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#647082] font-semibold uppercase tracking-wider">
            Memuat Detail &amp; Tracking Pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-[24px] border border-[#E2E7EE] shadow-tc-studio text-center space-y-4">
          <AlertCircle size={36} className="text-rose-500 mx-auto" />
          <h2 className="font-display text-xl font-bold text-[#1D2129]">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#647082]">{error}</p>
          <button onClick={onBackToOrders || onBackToShop} className="tc-btn-primary">
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
    if (order.statusKey === 'awaiting_verification' || order.paymentStatus === 'awaiting_verification')
      return 1;
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="bg-[#F7F8FA] min-h-screen py-6 sm:py-10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Navigation & Invoice Header */}
        <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#E2E7EE]/90 shadow-tc-studio flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <button
              onClick={onBackToOrders || onBackToShop}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647082] hover:text-[#1D2129] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Riwayat Pesanan</span>
            </button>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1D2129]">
                Invoice #{order.nomorPesanan}
              </h1>
              <button
                onClick={() => handleCopy(order.nomorPesanan, 'inv')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ECEFF4] hover:bg-[#D4DBE5] text-[11px] font-bold text-[#1D2129]"
              >
                {copiedField === 'inv' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedField === 'inv' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-xs text-[#647082]">
              {formatDate(order.tanggal)} • {order.metodeBayar}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
            <span className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold border ${badge.bg}`}>
              {order.status || badge.label}
            </span>
            {order.statusKey === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="inline-flex items-center gap-1 min-h-[38px] px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold"
              >
                <XCircle size={14} />
                <span>{cancelling ? 'Membatalkan...' : 'Batalkan'}</span>
              </button>
            )}
          </div>
        </div>

        {actionMsg && (
          <div className="p-4 rounded-[20px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {isCancelled && (
          <div className="p-5 rounded-[20px] bg-[#ECEFF4] border border-[#BAC4D2] flex items-center gap-3 text-xs text-[#323846]">
            <XCircle size={22} className="text-[#4F627A] shrink-0" />
            <div>
              <p className="font-display font-bold text-[#1D2129] text-sm">Pesanan Dibatalkan</p>
              <p className="mt-0.5">
                Pesanan ini telah dibatalkan dan stok perangkat telah dikembalikan otomatis ke katalog TECHCARE.
              </p>
            </div>
          </div>
        )}

        {/* 1. 6-Step Progress & Resi */}
        {!isCancelled && (
          <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-[#E2E7EE]/90 shadow-tc-studio space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D2129] block">
                  STATUS PESANAN &amp; PENGIRIMAN
                </span>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#1D2129]">
                  Progres Pesanan Anda
                </h2>
              </div>

              {order.statusKey === 'shipped' && (
                <button
                  onClick={handleConfirmReceived}
                  disabled={confirming}
                  className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 size={15} />
                  <span>{confirming ? 'Memproses...' : 'Konfirmasi Pesanan Diterima'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {steps.map((st, i) => {
                const Icon = st.icon;
                const isPassed = i <= activeIdx;
                const isCurrent = i === activeIdx;
                return (
                  <div
                    key={st.key}
                    className={`flex flex-col items-center text-center p-3 rounded-[20px] border transition-all ${
                      isCurrent
                        ? 'bg-[#1D2129] text-white border-[#1D2129]'
                        : isPassed
                        ? 'bg-[#ECEFF4] text-[#1D2129] border-[#D4DBE5]'
                        : 'bg-[#F7F8FA] text-[#8692A3] border-[#E2E7EE]/70'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
                        isCurrent
                          ? 'bg-white text-[#1D2129]'
                          : isPassed
                          ? 'bg-[#1D2129] text-white'
                          : 'bg-[#E2E7EE]/80 text-[#8692A3]'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check size={15} strokeWidth={2.5} /> : <Icon size={15} />}
                    </div>
                    <span className="text-[11px] font-bold leading-tight">{st.title}</span>
                    <span className={`text-[10px] mt-0.5 ${isCurrent ? 'text-[#BAC4D2]' : 'text-[#8692A3]'}`}>
                      {st.sub}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Courier & Resi Bar */}
            <div className="bg-[#F7F8FA] rounded-[20px] p-4 border border-[#E2E7EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E7EE] flex items-center justify-center text-[#1D2129] shrink-0">
                  <Truck size={19} />
                </div>
                <div className="text-xs">
                  <p className="text-[#647082]">
                    Ekspedisi: <strong className="text-[#1D2129]">{order.kurir || 'JNE Reguler'}</strong>
                  </p>
                  <p className="text-[#647082] mt-0.5">
                    No. Resi:{' '}
                    {order.resi ? (
                      <strong className="font-mono text-sm text-[#1D2129] tracking-wider">
                        {order.resi}
                      </strong>
                    ) : (
                      <span className="italic text-[#8692A3]">
                        Menunggu proses QC &amp; penyerahan ke kurir
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {order.resi && (
                <button
                  onClick={() => handleCopy(order.resi, 'resi')}
                  className="tc-btn-dark self-start sm:self-center min-h-[40px] px-4 text-xs"
                >
                  {copiedField === 'resi' ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedField === 'resi' ? 'Resi Tersalin' : 'Salin No. Resi'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. Payment Instructions & Upload Proof */}
        {showPaymentSection && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 bg-white rounded-[24px] p-5 sm:p-6 border border-[#E2E7EE]/90 shadow-tc-studio space-y-4">
              <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-3 gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1D2129]">Instruksi Pembayaran</h3>
                  <span className="text-[11px] font-bold text-[#4F627A]">QRIS &amp; Transfer Bank</span>
                </div>
                {countdown && (
                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-1.5 ${
                      countdown.expired
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-[#ECEFF4] text-[#323846] border border-[#D4DBE5]'
                    }`}
                  >
                    <Clock size={13} />
                    <span>{countdown.text}</span>
                  </div>
                )}
              </div>

              {/* Exact Transfer Amount Card */}
              <div className="bg-[#1D2129] text-white p-4 rounded-[20px] space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#BAC4D2] font-bold block">
                  Transfer Tepat Hingga 3 Digit Kode Unik
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums">
                    {formatIDR(order.total)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.total, 'amount')}
                    className="min-h-[38px] px-3.5 bg-white hover:bg-[#ECEFF4] text-[#1D2129] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
                  >
                    {copiedField === 'amount' ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedField === 'amount' ? 'Tersalin' : 'Salin Nominal'}</span>
                  </button>
                </div>
                {order.uniqueCode > 0 && (
                  <p className="text-[11px] text-[#BAC4D2]">
                    Termasuk kode unik <strong className="font-mono text-[#1D2129]">+{order.uniqueCode}</strong>
                    {order.paymentDeadline ? ` • Batas bayar ${formatDate(order.paymentDeadline)}` : ''}
                  </p>
                )}
              </div>

              {isQris ? (
                <div className="text-center space-y-3">
                  <div className="max-w-[230px] mx-auto bg-[#F7F8FA] p-2.5 rounded-[20px] border border-[#E2E7EE]">
                    <img
                      src="/images/qris-techcare.svg"
                      alt="QRIS TECHCARE"
                      className="w-full h-auto object-contain rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-[#4F627A] leading-relaxed">
                    Scan kode QRIS di atas lewat BCA Mobile, Livin, GoPay, OVO, Dana, atau ShopeePay sebesar{' '}
                    <strong className="text-[#1D2129]">{formatIDR(order.total)}</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-[#F7F8FA] p-4 rounded-[20px] border border-[#E2E7EE] space-y-2.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8692A3]">
                        {bankName}
                      </p>
                      <p className="text-xs text-[#1D2129] font-bold">
                        a.n. PT TECHCARE SOLUSI TEKNOLOGI
                      </p>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E2E7EE]">
                      <span className="font-mono text-base font-bold text-[#1D2129] tracking-wider">
                        {bankAccNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(bankAccNumber, 'rek')}
                        className="min-h-[36px] px-3.5 bg-[#1D2129] hover:bg-[#323846] text-white rounded-lg text-xs font-semibold"
                      >
                        {copiedField === 'rek' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#ECEFF4]/70 border border-[#D4DBE5] flex items-start gap-2 text-[11px] text-[#323846]">
                <Info size={14} className="shrink-0 mt-0.5 text-[#1D2129]" />
                <span>
                  Lakukan pembayaran sesuai nominal tagihan hingga 3 digit kode unik, lalu unggah bukti transfer untuk verifikasi oleh Admin.
                </span>
              </div>
            </div>

            {/* Form Upload Bukti */}
            <div className="lg:col-span-6 bg-white rounded-[24px] p-5 sm:p-6 border border-[#E2E7EE]/90 shadow-tc-studio space-y-4">
              <div className="border-b border-[#ECEFF4] pb-3">
                <h3 className="font-display text-lg font-bold text-[#1D2129]">Upload Bukti Pembayaran</h3>
                <p className="text-xs text-[#647082]">
                  {order.paymentStatus === 'rejected'
                    ? 'Bukti sebelumnya ditolak admin. Silakan unggah ulang bukti transfer yang jelas.'
                    : 'Unggah screenshot transfer/QRIS untuk mempercepat konfirmasi oleh Admin.'}
                </p>
              </div>

              {order.paymentProofUrl && (
                <div className="p-3 bg-[#F7F8FA] rounded-[20px] border border-[#E2E7EE] text-center space-y-1.5">
                  <p className="text-[11px] font-bold text-[#323846]">Bukti yang Terunggah:</p>
                  <img
                    src={order.paymentProofUrl}
                    alt="Bukti Pembayaran"
                    className="max-h-40 mx-auto rounded-xl object-contain border border-[#E2E7EE] bg-white"
                  />
                  {order.paymentNotes && (
                    <p className="text-[11px] text-[#647082]">{order.paymentNotes}</p>
                  )}
                </div>
              )}

              <form onSubmit={handleUploadProof} className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-[#647082] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1D2129] file:text-white hover:file:bg-[#323846] border border-[#E2E7EE] rounded-xl p-1.5 bg-[#F7F8FA]"
                />
                {proofPreview && (
                  <img
                    src={proofPreview}
                    alt="Preview Bukti"
                    className="max-h-36 mx-auto rounded-xl object-contain border border-[#E2E7EE]"
                  />
                )}
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan (opsional, misal: Transfer BCA a.n. Budi)"
                  className="tc-input"
                />
                <button
                  type="submit"
                  disabled={!proofPreview || uploading}
                  className="tc-btn-primary w-full py-3.5"
                >
                  <Upload size={15} />
                  <span>{uploading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. Tracking Timeline */}
        <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-[#E2E7EE]/90 shadow-tc-studio space-y-5">
          <div className="flex items-center justify-between border-b border-[#ECEFF4] pb-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#1D2129]" />
              <h3 className="font-display text-lg font-bold text-[#1D2129]">
                Riwayat Pelacakan &amp; Aktivitas Pesanan
              </h3>
            </div>
            <span className="text-xs font-semibold text-[#8692A3]">
              {(order.trackingHistory || []).length} update
            </span>
          </div>

          <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E2E7EE]">
            {(order.trackingHistory || []).map((log, idx) => {
              const isLatest = idx === 0;
              return (
                <div key={idx} className="relative">
                  <span
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      isLatest
                        ? 'bg-[#1D2129] border-[#1D2129] text-white ring-4 ring-[#ECEFF4]'
                        : 'bg-white border-[#BAC4D2]'
                    }`}
                  >
                    {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className={`text-xs sm:text-sm font-bold ${isLatest ? 'text-[#1D2129]' : 'text-[#23272F]'}`}>
                      {log.status}
                    </h4>
                    <span className="text-[11px] text-[#8692A3] font-medium">{formatDate(log.waktu)}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#647082] mt-0.5">{log.lokasi}</p>
                  <p className="text-xs text-[#4F627A] mt-1 leading-relaxed">{log.keterangan}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Items & Recipient Info */}
        <div className="bg-white rounded-[24px] p-5 sm:p-7 border border-[#E2E7EE]/90 shadow-tc-studio space-y-5">
          <h3 className="font-display text-lg font-bold text-[#1D2129] border-b border-[#ECEFF4] pb-3">
            Rincian Produk &amp; Alamat Pengiriman
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-[#ECEFF4] last:border-0">
                  <div className="w-14 h-14 rounded-xl bg-[#ECEFF4] p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={it.gambar || '/images/products/thinkpad-x1-carbon-front.jpg'}
                      alt={it.nama}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1D2129] truncate">{it.nama}</p>
                    <p className="text-[11px] text-[#647082]">
                      {[it.specLabel, it.warna].filter(Boolean).join(' • ')}
                    </p>
                    <p className="text-[11px] text-[#8692A3]">
                      {it.jumlah} x {formatIDR(it.harga)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1D2129] tabular-nums">
                    {formatIDR((it.harga || 0) * (it.jumlah || 1))}
                  </span>
                </div>
              ))}

              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#647082]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatIDR(order.subtotal)}</span>
                </div>
                {order.diskon > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Diskon ({order.kodeDiskon || 'Promo'})</span>
                    <span className="tabular-nums">-{formatIDR(order.diskon)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#647082]">
                  <span>Ongkir ({formatWeight(order.totalWeightGram || 1000)})</span>
                  <span className="tabular-nums">{order.ongkir > 0 ? formatIDR(order.ongkir) : 'Gratis'}</span>
                </div>
                {order.uniqueCode > 0 && (
                  <div className="flex justify-between text-[#647082]">
                    <span>Kode Unik</span>
                    <span className="font-mono text-[#1D2129] font-bold">+{formatIDR(order.uniqueCode)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#1D2129] pt-2 border-t border-[#E2E7EE]">
                  <span>Total Pembayaran</span>
                  <span className="font-display text-base text-[#1D2129] tabular-nums">
                    {formatIDR(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F7F8FA] rounded-[20px] p-5 border border-[#E2E7EE] space-y-2 text-xs text-[#4F627A] h-fit">
              <div className="flex items-center gap-2 text-[#1D2129] font-bold uppercase tracking-wider text-[11px] mb-2">
                <Package size={14} className="text-[#1D2129]" />
                <span>Info Penerima &amp; Ekspedisi</span>
              </div>
              <p>
                <strong className="text-[#1D2129]">Nama:</strong> {order.customer?.nama}
              </p>
              <p>
                <strong className="text-[#1D2129]">WhatsApp:</strong> {order.customer?.telepon}
              </p>
              <p>
                <strong className="text-[#1D2129]">Email:</strong> {order.customer?.email}
              </p>
              <p>
                <strong className="text-[#1D2129]">Alamat:</strong> {order.customer?.alamat},{' '}
                {order.customer?.kota} {order.customer?.kodePos || ''}
              </p>
              {order.shippingZone && (
                <p>
                  <strong className="text-[#1D2129]">Wilayah:</strong> {order.shippingZone}
                </p>
              )}
              <p>
                <strong className="text-[#1D2129]">Kurir:</strong> {order.kurir || 'JNE Reguler'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
