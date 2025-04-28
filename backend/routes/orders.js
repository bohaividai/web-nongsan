const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, items, total_price } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ message: "Thiếu dữ liệu!" });
  }

  const orderSql = "INSERT INTO orders (user_id, total_price) VALUES (?, ?)";
  db.query(orderSql, [user_id, total_price], (err, result) => {
    if (err) {
      console.error("Lỗi tạo đơn hàng:", err);
      return res.status(500).json({ message: "Lỗi tạo đơn hàng" });
    }

    const orderId = result.insertId;
    const orderItems = items.map(item => [orderId, item.id, item.quantity, item.price]);

    const itemSql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
    db.query(itemSql, [orderItems], (err2) => {
      if (err2) {
        console.error("Lỗi thêm sản phẩm:", err2);
        return res.status(500).json({ message: "Lỗi lưu sản phẩm vào đơn" });
      }

      res.json({ message: "Đặt hàng thành công!" });
    });
  });
});

module.exports = router;

