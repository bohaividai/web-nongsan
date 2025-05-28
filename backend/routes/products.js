const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const db = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authenticate, upload.single("image"), (req, res) => {
  try {
    const { name, price, description, category_id } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "Thiếu ảnh sản phẩm." });
    }

    const filename = Date.now() + "_" + image.originalname;
    fs.writeFileSync(`uploads/${filename}`, image.buffer);

    const sql = `
      INSERT INTO products (name, price, description, image, category_id, seller_id, approved)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;
    const values = [name, price, description, filename, category_id, req.user.id];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Lỗi thêm sản phẩm:", err);
        return res.status(500).json({ message: "Lỗi server." });
      }
      res.json({ message: "Đã thêm sản phẩm chờ duyệt." });
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
});

module.exports = router;



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
router.get('/pending', authenticate, (req, res) => {
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
router.put('/approve/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE products SET approved = true WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi duyệt sản phẩm:', err);
      return res.status(500).json({ message: 'Không thể duyệt sản phẩm.' });
    }
    res.json({ message: '✅ 제품 검색에 성공했습니다!' });
  });
});

// Xóa sản phẩm (admin) – cần verify
router.delete('/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi xóa sản phẩm:', err);
      return res.status(500).json({ message: 'Không thể xóa sản phẩm.' });
    }
    res.json({ message: '✅ 제품이 삭제되었습니다!' });
  });
});

module.exports = router;
