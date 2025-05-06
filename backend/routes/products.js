const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const verify = require('../middleware/auth'); // ✅ phải có dòng này

// Cấu hình multer để upload ảnh sản phẩm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// Thêm sản phẩm mới (không cần verify, người bán thêm được)
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, description, category_id, seller_id } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  if (!name || !price || !category_id || !seller_id || !image) {
    return res.status(400).json({ message: 'Thiếu dữ liệu sản phẩm' });
  }

  const sql = `
    INSERT INTO products (name, price, description, image, category_id, seller_id, approved)
    VALUES (?, ?, ?, ?, ?, ?, false)
  `;

  db.query(sql, [name, price, description, image, category_id, seller_id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi thêm sản phẩm:', err);
      return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm!' });
    }
    res.json({ message: '✅ Thêm sản phẩm thành công! Chờ quản lý duyệt.' });
  });
});

// Lấy sản phẩm đã được duyệt (hiển thị ở trang index.html) – không cần verify
router.get('/', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name, u.username AS seller_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    WHERE p.approved = 1
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy sản phẩm đã duyệt:', err);
      return res.status(500).json({ message: 'Không thể tải sản phẩm đã duyệt.' });
    }
    res.json(results);
  });
});

// Lấy sản phẩm chờ duyệt (cho admin duyệt) – cần verify
router.get('/pending', verify, (req, res) => {
  const sql = `
    SELECT p.id, p.name, p.price, u.username AS seller_name
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.approved = 1
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy sản phẩm chờ duyệt:', err);
      return res.status(500).json({ message: 'Không thể tải sản phẩm chờ duyệt.' });
    }
    res.json(results);
  });
});

// Duyệt sản phẩm (admin) – cần verify
router.put('/approve/:id', verify, (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE products SET approved = true WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi duyệt sản phẩm:', err);
      return res.status(500).json({ message: 'Không thể duyệt sản phẩm.' });
    }
    res.json({ message: '✅ Duyệt sản phẩm thành công!' });
  });
});

// Xóa sản phẩm (admin) – cần verify
router.delete('/:id', verify, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi xóa sản phẩm:', err);
      return res.status(500).json({ message: 'Không thể xóa sản phẩm.' });
    }
    res.json({ message: '✅ Xóa sản phẩm thành công!' });
  });
});

module.exports = router;
