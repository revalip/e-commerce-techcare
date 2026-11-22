import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Copy,
  Check,
  Upload,
  AlertCircle,
  ChevronLeft,
  MapPin,
  Wrench,
  CreditCard,
  XCircle,
  Lock
} from 'lucide-react';
import {
  getOrderByNumber,
  uploadOrderPaymentProof,
  confirmOrderReceived,
  cancelOrder
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatIDR, formatDate, formatWeight, getRemainingTime } from '../utils/format';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function maskName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Pelanggan TechCare';
  return parts.map((p, i) => (i === 0 ? p : `${p[0]}***`)).join(' ');
}

function maskPhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length < 6) return '••••••';
  return `${digits.slice(0, 4)}••••${digits.slice(-3)}`;
}

function maskEmail(email = '') {
  const [userPart, domain] = String(email).split('@');
  if (!userPart || !domain) return '•••@•••';
  return `${userPart.slice(0, 2)}***@${domain}`;
}

function getStatusColorClass(statusKey) {
  switch (statusKey) {
    case 'completed':
      return 'text-[#1D7F3E]';
    case 'shipped':
    case 'processing':
    case 'paid':
      return 'text-[#0071E3]';
    case 'cancelled':
      return 'text-[#D70015]';
    default:
      return 'text-[#B64400]';
  }
}

export default function OrderDetailPage({ orderNumber, onBackToOrders, onBackToShop }) {
  const { user, isAdmin, isBuyer, openAuthModal } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [proofPreview, setProofPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
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

  const handleCopy = async (text, key) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(String(text));
      }
      setCopiedField(key);
      setTimeout(() => setCopiedField(''), 2000);
    } catch {
      // Fallback silent if clipboard blocked on non-HTTPS context
    }
  };

  const handleFileChange = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setUploadError('Format bukti pembayaran harus JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Ukuran file bukti pembayaran maksimal 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProofPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const isOwnerOrAdmin = Boolean(
    order &&
      (isAdmin ||
        (isBuyer &&
          user?.email &&
          (order.userEmail || order.customer?.email || '').toLowerCase() ===
            user.email.toLowerCase()))
  );

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!isOwnerOrAdmin || !proofPreview) return;
    setUploading(true);
    setUploadError('');
    const res = await uploadOrderPaymentProof(order.nomorPesanan, {
      proofUrl: proofPreview,
      notes
    });
    setUploading(false);
    if (res.success) {
      setOrder(res.data);
      setNotes('');
      setProofPreview(null);
      setActionMsg('Bukti pembayaran terkirim. Tim TechCare akan segera memverifikasi.');
      setTimeout(() => setActionMsg(''), 5000);
    } else {
      setUploadError(res.error || 'Gagal mengunggah bukti pembayaran.');
    }
  };

  const handleConfirmReceived = async () => {
    if (!isOwnerOrAdmin) return;
    if (!window.confirm('Konfirmasi bahwa unit pesanan telah diterima dalam kondisi baik?')) return;
    setConfirming(true);
    const res = await confirmOrderReceived(order.id);
    setConfirming(false);
    if (res.success && res.data) {
      setOrder(res.data);
      setActionMsg('Pesanan selesai. Garansi toko TechCare resmi aktif.');
    } else if (res.error) {
      setUploadError(res.error);
    }
  };

  const handleCancelOrder = async () => {
    if (!isOwnerOrAdmin) return;
    if (!window.confirm('Yakin ingin membatalkan pesanan ini? Stok unit akan dikembalikan ke katalog.')) {
      return;
    }
    setCancelling(true);
    const res = await cancelOrder(order.id);
    setCancelling(false);
    if (res.success && res.data) {
      setOrder(res.data);
      setActionMsg('Pesanan dibatalkan dan stok produk telah dikembalikan.');
    } else if (res.error) {
      setUploadError(res.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[13px] text-[#6E6E73]">Memuat status pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#F5F5F7] rounded-[28px] p-10 space-y-4">
          <AlertCircle size={32} strokeWidth={1.5} className="text-[#D70015] mx-auto" />
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
            Pesanan tidak ditemukan
          </h2>
          <p className="text-[14px] text-[#6E6E73]">{error}</p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={onBackToOrders}
              className="h-[40px] px-5 rounded-[980px] bg-white text-[#1D1D1F] text-[14px] hover:bg-[#E8E8ED] transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={onBackToShop}
              className="h-[40px] px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] transition-colors cursor-pointer"
            >
              Lihat Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = order.statusKey === 'cancelled';
  const isPaid = order.paymentStatus === 'paid';
  const isAwaiting = order.paymentStatus === 'awaiting_verification';
  const isRejected = order.paymentStatus === 'rejected';
  const isShipped = order.statusKey === 'shipped';
  const isQris =
    order.paymentMethodKey === 'qris' || (order.metodeBayar || '').toLowerCase().includes('qris');
  const isMandiri =
    order.paymentMethodKey === 'bank_mandiri' ||
    (order.metodeBayar || '').toLowerCase().includes('mandiri');
  const canCancel = isOwnerOrAdmin && !isCancelled && !isPaid && !isAwaiting && order.statusKey === 'pending';
  const canUploadProof = isOwnerOrAdmin && !isCancelled && !isPaid && order.statusKey !== 'completed' && order.statusKey !== 'shipped';

  const steps = [
    { key: 'pending', label: 'Dipesan', icon: Clock },
    { key: 'awaiting_verification', label: 'Verifikasi', icon: CreditCard },
    { key: 'paid', label: 'Dibayar', icon: CheckCircle2 },
    { key: 'processing', label: 'QC 32 Titik', icon: Wrench },
    { key: 'shipped', label: 'Dikirim', icon: Truck },
    { key: 'completed', label: 'Selesai', icon: Package }
  ];

  const statusOrderIndex = {
    pending: 0,
    awaiting_verification: 1,
    paid: 2,
    processing: 3,
    shipped: 4,
    completed: 5
  };
  const currentStepIdx = isCancelled ? -1 : statusOrderIndex[order.statusKey] ?? 0;
  const progressPercent = isCancelled ? 0 : Math.round((currentStepIdx / (steps.length - 1)) * 100);
  const statusColor = getStatusColorClass(order.statusKey || order.paymentStatus);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white text-[#1D1D1F] min-h-screen pb-16"
    >
      {/* 1. Full-Width Clean Header Band (#F5F5F7) */}
      <section className="w-full bg-[#F5F5F7] py-10 sm:py-14">
        <div className="max-w-[920px] mx-auto px-4 sm:px-6 space-y-5">
          <button
            type="button"
            onClick={onBackToOrders}
            className="inline-flex items-center gap-1 text-[14px] text-[#0071E3] hover:underline cursor-pointer"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
            <span>Kembali ke Lacak Pesanan</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[28px] sm:text-[38px] font-semibold tracking-[-0.03em] text-[#1D1D1F] leading-tight">
                  #{order.nomorPesanan}
                </h1>
                <button
                  type="button"
                  onClick={() => handleCopy(order.nomorPesanan, 'invoice')}
                  className="h-[30px] px-3 rounded-[980px] bg-white text-[12px] text-[#1D1D1F] hover:bg-[#E8E8ED] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedField === 'invoice' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedField === 'invoice' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-[14px] text-[#6E6E73]">
                {formatDate(order.tanggal)} · {order.metodeBayar || 'Transfer Bank'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-[15px] font-semibold ${statusColor}`}>
                {order.status || 'Diproses'}
              </span>
              {isOwnerOrAdmin && isShipped && (
                <button
                  type="button"
                  disabled={confirming}
                  onClick={handleConfirmReceived}
                  className="h-[38px] px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal transition-colors cursor-pointer disabled:opacity-50"
                >
                  {confirming ? 'Memproses...' : 'Konfirmasi Diterima'}
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelOrder}
                  className="h-[38px] px-5 rounded-[980px] border border-[#D70015] text-[#D70015] hover:bg-[#D70015] hover:text-white text-[13px] font-normal transition-colors cursor-pointer disabled:opacity-50"
                >
                  {cancelling ? 'Membatalkan...' : 'Batalkan'}
                </button>
              )}
            </div>
          </div>

          {actionMsg && (
            <div className="p-4 rounded-[16px] bg-white text-[#1D7F3E] text-[14px] flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{actionMsg}</span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-[920px] mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* 2. Apple-Style Linear Progress Stepper */}
        <section className="space-y-6">
          {isCancelled ? (
            <div className="bg-[#F5F5F7] rounded-[24px] p-6 flex items-center gap-3.5 text-[#D70015]">
              <XCircle size={22} strokeWidth={1.6} className="shrink-0" />
              <div className="text-[14px]">
                <p className="font-semibold">Pesanan ini telah dibatalkan.</p>
                <p className="text-[#6E6E73]">Stok perangkat telah dikembalikan ke katalog TechCare.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative pt-1">
                <div className="h-[3px] w-full bg-[#E8E8ED] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0071E3] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-4 gap-x-2 mt-4">
                  {steps.map((step, idx) => {
                    const done = currentStepIdx >= idx;
                    const current = currentStepIdx === idx;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-start sm:items-center sm:text-center gap-1">
                        <Icon
                          size={16}
                          strokeWidth={1.7}
                          className={
                            current
                              ? 'text-[#0071E3]'
                              : done
                              ? 'text-[#1D1D1F]'
                              : 'text-[#A1A1A6]'
                          }
                        />
                        <span
                          className={`text-[12px] leading-tight ${
                            current
                              ? 'text-[#0071E3] font-semibold'
                              : done
                              ? 'text-[#1D1D1F] font-medium'
                              : 'text-[#86868B]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Courier & Resi Bar */}
          <div className="bg-[#F5F5F7] rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Truck size={20} strokeWidth={1.6} className="text-[#1D1D1F] shrink-0" />
              <div className="text-[14px]">
                <p className="font-semibold text-[#1D1D1F]">{order.kurir || 'JNE Reguler'}</p>
                <p className="text-[#6E6E73] text-[13px]">
                  {order.resi ? `Resi: ${order.resi}` : 'Menunggu proses QC dan penyerahan ke kurir'}
                </p>
              </div>
            </div>
            {order.resi && (
              <button
                type="button"
                onClick={() => handleCopy(order.resi, 'resi')}
                className="h-[36px] px-4 rounded-[980px] bg-white hover:bg-[#E8E8ED] text-[#1D1D1F] text-[13px] inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                {copiedField === 'resi' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedField === 'resi' ? 'Tersalin' : 'Salin Resi'}</span>
              </button>
            )}
          </div>
        </section>

        {/* Guest Privacy Notice */}
        {!isOwnerOrAdmin && (
          <section className="bg-[#F5F5F7] rounded-[24px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <Lock size={18} strokeWidth={1.6} className="text-[#6E6E73] shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[14px]">
                <p className="font-semibold text-[#1D1D1F]">Mode pelacakan terbatas</p>
                <p className="text-[#6E6E73]">
                  Data pribadi penerima disamarkan. Masuk dengan akun pemilik pesanan untuk mengelola pesanan atau melihat alamat lengkap.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login', 'Masuk dengan akun pemilik pesanan untuk melihat detail lengkap.')}
              className="h-[38px] px-5 rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-normal shrink-0 self-start sm:self-auto transition-colors cursor-pointer"
            >
              Masuk
            </button>
          </section>
        )}

        {/* 3. Payment & Proof Upload (Owner/Admin ONLY when unpaid) */}
        {canUploadProof && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Payment Instructions */}
            <div className="bg-[#F5F5F7] rounded-[24px] p-6 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                  Instruksi Pembayaran
                </h2>
                {countdown && !countdown.expired && (
                  <span className="text-[12px] font-medium text-[#B64400] tabular-nums">
                    {String(countdown.hours).padStart(2, '0')}:
                    {String(countdown.minutes).padStart(2, '0')}:
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                )}
              </div>

              {isRejected && (
                <p className="text-[13px] text-[#D70015] bg-white rounded-[14px] p-3.5">
                  Bukti sebelumnya perlu diperbaiki: {order.paymentNotes || 'Nominal atau bukti belum sesuai.'}
                </p>
              )}

              <div className="bg-[#1D1D1F] text-white rounded-[20px] p-5 space-y-2.5">
                <span className="text-[12px] text-[#A1A1A6] block">
                  Transfer tepat hingga 3 digit kode unik
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[24px] font-semibold tracking-tight tabular-nums">
                    {formatIDR(order.total)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.total, 'amount')}
                    className="h-[34px] px-3.5 bg-white text-[#1D1D1F] hover:bg-[#E8E8ED] rounded-[980px] text-[12px] font-medium inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedField === 'amount' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedField === 'amount' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                {order.uniqueCode > 0 && (
                  <p className="text-[12px] text-[#A1A1A6]">
                    Termasuk kode unik <strong className="text-white font-semibold">+{order.uniqueCode}</strong>
                    {order.paymentDeadline ? ` · Batas bayar ${formatDate(order.paymentDeadline)}` : ''}
                  </p>
                )}
              </div>

              {isQris ? (
                <div className="text-center space-y-3">
                  <div className="max-w-[210px] mx-auto bg-white p-3 rounded-[20px]">
                    <img
                      src="/images/qris-techcare.svg"
                      alt="QRIS TechCare"
                      className="w-full h-auto object-contain rounded-xl"
                    />
                  </div>
                  <p className="text-[13px] text-[#6E6E73]">
                    Scan QRIS lewat aplikasi bank atau e-wallet sebesar{' '}
                    <strong className="text-[#1D1D1F]">{formatIDR(order.total)}</strong>.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-[18px] p-4 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[12px] text-[#6E6E73]">
                      {isMandiri ? 'Bank Mandiri' : 'Bank BCA'} · PT TechCare Solusi Teknologi
                    </p>
                    <p className="text-[17px] font-semibold text-[#1D1D1F] tabular-nums">
                      {isMandiri ? '1330029481022' : '8271039821'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(isMandiri ? '1330029481022' : '8271039821', 'rek')}
                    className="h-[34px] px-4 rounded-[980px] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-[12px] font-medium cursor-pointer"
                  >
                    {copiedField === 'rek' ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              )}
            </div>

            {/* Proof Upload */}
            <form onSubmit={handleUploadProof} className="bg-[#F5F5F7] rounded-[24px] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
                    Bukti Pembayaran
                  </h2>
                  <p className="text-[13px] text-[#6E6E73] mt-0.5">
                    Unggah screenshot transfer atau QRIS (JPG, PNG, WebP maks. 4MB).
                  </p>
                </div>

                {order.paymentProofUrl && !proofPreview && (
                  <div className="bg-white rounded-[18px] p-4 text-center space-y-2">
                    <img
                      src={order.paymentProofUrl}
                      alt="Bukti pembayaran terunggah"
                      className="max-h-36 mx-auto rounded-xl object-contain"
                    />
                    <p className="text-[12px] text-[#6E6E73]">
                      Bukti sudah terunggah{order.paymentNotes ? ` · ${order.paymentNotes}` : ''}
                    </p>
                  </div>
                )}

                {proofPreview && (
                  <div className="bg-white rounded-[18px] p-4 text-center">
                    <img
                      src={proofPreview}
                      alt="Pratinjau bukti"
                      className="max-h-36 mx-auto rounded-xl object-contain"
                    />
                  </div>
                )}

                <label className="block w-full bg-white hover:bg-[#EFEFF2] rounded-[16px] p-4 text-center cursor-pointer transition-colors">
                  <span className="inline-flex items-center gap-2 text-[14px] text-[#0071E3] font-medium">
                    <Upload size={15} />
                    <span>{proofPreview ? 'Ganti gambar bukti' : 'Pilih gambar bukti transfer'}</span>
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  placeholder="Catatan opsional (mis. Transfer BCA a.n. Budi)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-[42px] px-4 rounded-[14px] bg-white text-[14px] text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />

                {uploadError && (
                  <p className="text-[13px] text-[#D70015]">{uploadError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!proofPreview || uploading}
                className="w-full h-[42px] rounded-[980px] bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 text-white text-[14px] font-normal transition-colors cursor-pointer"
              >
                {uploading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
              </button>
            </form>
          </section>
        )}

        {/* 4. Clean Apple Tracking Timeline directly on Pure White */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
              Riwayat pelacakan
            </h2>
            <span className="text-[13px] text-[#6E6E73]">
              {(order.trackingHistory || []).length} pembaruan
            </span>
          </div>

          <div className="border-t border-[#D2D2D7] divide-y divide-[#D2D2D7]/70">
            {(order.trackingHistory || []).map((ev, idx) => (
              <div key={idx} className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-start gap-3.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      idx === 0 ? 'bg-[#0071E3]' : 'bg-[#D2D2D7]'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <p className={`text-[15px] font-semibold ${idx === 0 ? 'text-[#1D1D1F]' : 'text-[#424245]'}`}>
                      {ev.status}
                    </p>
                    <p className="text-[13px] text-[#6E6E73] flex items-center gap-1">
                      <MapPin size={12} strokeWidth={1.7} />
                      <span>{ev.lokasi}</span>
                    </p>
                    {ev.keterangan && (
                      <p className="text-[13px] text-[#6E6E73] pt-0.5">{ev.keterangan}</p>
                    )}
                  </div>
                </div>
                <span className="text-[12px] text-[#86868B] pl-6 sm:pl-0 shrink-0 tabular-nums">
                  {formatDate(ev.waktu)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Items Summary & Masked/Full Recipient Info */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
          <div className="md:col-span-7 bg-[#F5F5F7] rounded-[24px] p-6 space-y-5">
            <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
              Rincian produk
            </h2>

            <div className="divide-y divide-[#D2D2D7]/70">
              {(order.items || []).map((item, i) => (
                <div key={i} className="py-3.5 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0">
                      <img
                        src={item.gambar || '/assets/products/thinkpad-x1-carbon-front.png'}
                        alt={item.nama}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#1D1D1F] truncate">{item.nama}</p>
                      <p className="text-[12px] text-[#6E6E73] truncate">
                        {[item.specLabel, item.warna].filter(Boolean).join(' · ')}
                      </p>
                      <p className="text-[12px] text-[#86868B] mt-0.5">
                        {item.jumlah} × {formatIDR(item.harga)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#1D1D1F] shrink-0 tabular-nums">
                    {formatIDR(item.harga * item.jumlah)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D2D2D7]/80 space-y-2 text-[13px]">
              <div className="flex justify-between text-[#6E6E73]">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#1D1D1F]">{formatIDR(order.subtotal)}</span>
              </div>
              {order.diskon > 0 && (
                <div className="flex justify-between text-[#D70015] font-medium">
                  <span>Diskon ({order.kodeDiskon || 'Promo'})</span>
                  <span className="tabular-nums">-{formatIDR(order.diskon)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6E6E73]">
                <span>Ongkir ({formatWeight(order.totalWeightGram || 1000)})</span>
                <span className="tabular-nums text-[#1D1D1F]">
                  {order.ongkir > 0 ? formatIDR(order.ongkir) : 'Gratis'}
                </span>
              </div>
              {order.uniqueCode > 0 && (
                <div className="flex justify-between text-[#6E6E73]">
                  <span>Kode Unik</span>
                  <span className="tabular-nums text-[#1D1D1F]">+{formatIDR(order.uniqueCode)}</span>
                </div>
              )}
              <div className="flex justify-between text-[16px] font-semibold text-[#1D1D1F] pt-3 border-t border-[#D2D2D7]">
                <span>Total</span>
                <span className="tabular-nums">{formatIDR(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#F5F5F7] rounded-[24px] p-6 space-y-3 h-fit text-[14px]">
            <h2 className="text-[19px] font-semibold tracking-[-0.015em] text-[#1D1D1F]">
              Pengiriman
            </h2>
            <div className="space-y-2 text-[#6E6E73]">
              <p>
                <span className="text-[#1D1D1F] font-medium">Penerima:</span>{' '}
                {isOwnerOrAdmin ? order.customer?.nama : maskName(order.customer?.nama)}
              </p>
              <p>
                <span className="text-[#1D1D1F] font-medium">WhatsApp:</span>{' '}
                {isOwnerOrAdmin ? order.customer?.telepon : maskPhone(order.customer?.telepon)}
              </p>
              <p>
                <span className="text-[#1D1D1F] font-medium">Email:</span>{' '}
                {isOwnerOrAdmin ? order.customer?.email : maskEmail(order.customer?.email)}
              </p>
              <p>
                <span className="text-[#1D1D1F] font-medium">Tujuan:</span>{' '}
                {isOwnerOrAdmin
                  ? `${order.customer?.alamat}, ${order.customer?.kota} ${order.customer?.kodePos || ''}`
                  : `${order.customer?.kota || order.shippingZone || 'Indonesia'} (alamat lengkap disembunyikan)`}
              </p>
              <p>
                <span className="text-[#1D1D1F] font-medium">Kurir:</span>{' '}
                {order.kurir || 'JNE Reguler'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
