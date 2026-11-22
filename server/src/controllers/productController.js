const { pool } = require('../config/db');
const { sanitizeText } = require('../middleware/security');

function safeJsonParse(value, fallback = []) {
  if (typeof value !== 'string') return value || fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const { collection, search, bestseller, sort } = req.query;

    let query = `
      SELECT p.*, c.name AS collection_name, c.slug AS collection_slug
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.is_active = TRUE
    `;
    const params = [];

    if (collection) {
      query += ` AND c.slug = ?`;
      params.push(sanitizeText(collection, 100));
    }

    if (search) {
      const q = `%${sanitizeText(search, 100)}%`;
      query += ` AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ? OR p.tagline LIKE ? OR c.name LIKE ?)`;
      params.push(q, q, q, q, q);
    }

    if (bestseller === 'true' || bestseller === '1') {
      query += ` AND p.is_bestseller = TRUE`;
    }

    if (sort === 'price_asc') {
      query += ` ORDER BY p.price ASC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY p.price DESC`;
    } else {
      query += ` ORDER BY p.is_bestseller DESC, p.created_at DESC`;
    }

    const [products] = await pool.query(query, params);

    const formatted = products.map((item) => ({
      ...item,
      features: safeJsonParse(item.features, []),
      gallery_urls: safeJsonParse(item.gallery_urls, [])
    }));

    return res.json({ success: true, count: formatted.length, products: formatted });
  } catch (error) {
    console.error('getAllProducts error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar produk.' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const slug = sanitizeText(req.params.slug, 150);

    const [rows] = await pool.query(
      `
      SELECT p.*, c.name AS collection_name, c.slug AS collection_slug
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.slug = ? AND p.is_active = TRUE
    `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    const product = rows[0];
    product.features = safeJsonParse(product.features, []);
    product.gallery_urls = safeJsonParse(product.gallery_urls, []);

    return res.json({ success: true, product });
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat detail produk.' });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const [collections] = await pool.query(`
      SELECT c.*, COUNT(p.id) AS product_count
      FROM collections c
      LEFT JOIN products p ON p.collection_id = c.id AND p.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.id ASC
    `);

    return res.json({ success: true, collections });
  } catch (error) {
    console.error('getCollections error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat kategori/koleksi.' });
  }
};
