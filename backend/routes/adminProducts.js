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
router.put('/:id/approve', authenticate, (req, res) => {
  const sql = 'UPDATE products SET approved = true WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json({ message: 'Duyệt thành công' });
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
