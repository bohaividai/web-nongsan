const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Lấy sản phẩm chưa duyệt
router.get('/', (req, res) => {
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

// PUT: Duyệt sản phẩm
router.put('/:id/approve', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE products SET approved = true WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json({ message: 'Duyệt thành công' });
  });
});

// DELETE: Xóa sản phẩm
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    res.json({ message: 'Xóa sản phẩm thành công' });
  });
});

module.exports = router;
