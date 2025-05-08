const express = require("express");
const db = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Lấy danh sách sản phẩm chờ duyệt
router.get("/products/pending", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }

  const sql = `
    SELECT p.*, u.name AS seller_name 
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.approved = 0
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
});

// Duyệt sản phẩm
router.put("/products/:id/approve", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền duyệt sản phẩm" });
  }

  const { id } = req.params;
  db.query("UPDATE products SET approved = 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khi duyệt sản phẩm" });
    res.json({ message: "Duyệt sản phẩm thành công" });
  });
});

module.exports = router;

// DELETE xóa sản phẩm
router.delete("/products/:id", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền xóa sản phẩm" });
  }

  const id = req.params.id;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi xóa sản phẩm" });
    res.json({ message: "Xóa thành công!" });
  });
});

module.exports = router;
