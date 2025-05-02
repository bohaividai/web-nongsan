const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Đăng ký
// Đăng ký
// ĐĂNG KÝ
router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  // Kiểm tra trùng username hoặc email
  db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn CSDL" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role],    
      (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi khi thêm người dùng vào CSDL" });
        res.json({ message: "Đăng ký thành công!" });
      }
    );
  });
});



// Đăng nhập
// Đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tồn tại!" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  });
});


module.exports = router;
