const { pool } = require('../config/db');

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
      params.push(collection);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.tagline LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
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

    // Parse features & gallery_urls if string
    const formatted = products.map(item => ({
      ...item,
      features: typeof item.features === 'string' ? JSON.parse(item.features) : (item.features || []),
      gallery_urls: typeof item.gallery_urls === 'string' ? JSON.parse(item.gallery_urls) : (item.gallery_urls || [])
    }));

    return res.json({ success: true, count: formatted.length, products: formatted });
  } catch (error) {
    console.error('getAllProducts error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar produk: ' + error.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(`
      SELECT p.*, c.name AS collection_name, c.slug AS collection_slug
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.slug = ? AND p.is_active = TRUE
    `, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    const product = rows[0];
    product.features = typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || []);
    product.gallery_urls = typeof product.gallery_urls === 'string' ? JSON.parse(product.gallery_urls) : (product.gallery_urls || []);

    return res.json({ success: true, product });
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat detail produk: ' + error.message });
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
    return res.status(500).json({ success: false, message: 'Gagal memuat kategori/koleksi: ' + error.message });
  }
};
