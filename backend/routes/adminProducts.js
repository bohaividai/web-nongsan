const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/authenticate'); // ✅ thêm dòng này

const router = express.Router();

// Lấy sản phẩm chưa duyệt
router.get('/', authenticate, (req, res) => {
  const sql = `
    SELECT p.*, u.name AS seller_name 
    FROM products p 
    JOIN users u ON p.seller_id = u.id 
    WHERE p.approved = false
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json(results);
  });
});

// Duyệt sản phẩm
router.put('/products/:id/approve', authenticate, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền duyệt sản phẩm' });
  }

  const id = req.params.id;
  db.query("UPDATE products SET approved = 1 WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi duyệt sản phẩm" });
    res.json({ message: "Duyệt thành công!" });
  });
});


// Xoá sản phẩm
router.delete('/:id', authenticate, (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json({ message: 'Xoá thành công' });
  });
});

module.exports = router;
