const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require("../middleware/verifyToken");
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
// Thêm sản phẩm mới dùng Imgur
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category_id } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "Thiếu ảnh sản phẩm." });
    }

    // Lưu ảnh vào uploads/
    const filename = Date.now() + "-" + image.originalname;
    const fs = require("fs");
    fs.writeFileSync(`uploads/${filename}`, image.buffer);

    // Thêm sản phẩm vào DB
    const [result] = await db.query(
      `INSERT INTO products (name, price, description, image, category_id, seller_id, approved)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [name, price, description, filename, category_id, req.user.id]
    );

    res.json({ message: "Đã thêm sản phẩm chờ duyệt." });
  } catch (err) {
    console.error("Lỗi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
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
    WHERE p.approved = 0
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
