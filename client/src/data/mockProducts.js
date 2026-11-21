import { mockProducts, mockCollections } from './mock';

// Re-export catalog & collections from the verified < Rp 10 Juta store data
export const initialProducts = mockProducts;
export const initialCollections = mockCollections;

// Available Promo Vouchers for Discount System
export const promoVouchers = [
  {
    code: 'TECHCARE10',
    name: 'Diskon Spesial 10%',
    type: 'percent',
    value: 10,
    maxDiscount: 500000,
    minPurchase: 500000,
    description: 'Diskon 10% hingga Rp 500.000 untuk semua perangkat IT.'
  },
  {
    code: 'HEMAT200K',
    name: 'Potongan Langsung 200 Ribu',
    type: 'fixed',
    value: 200000,
    minPurchase: 1000000,
    description: 'Potongan langsung Rp 200.000 minimal belanja Rp 1.000.000.'
  },
  {
    code: 'GAJIANPROMO',
    name: 'Promo Gajian Hemat 500K',
    type: 'fixed',
    value: 500000,
    minPurchase: 3000000,
    description: 'Potongan langsung Rp 500.000 khusus pembelian minimal Rp 3.000.000.'
  }
];
