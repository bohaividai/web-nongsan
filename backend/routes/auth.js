const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Đăng ký
router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Kiểm tra username hoặc email đã tồn tại
    db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Lỗi truy vấn CSDL" });

      if (results.length > 0) {
        return res.status(400).json({ message: "Tài khoản đã tồn tại!" });
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Chèn người dùng mới
      db.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, role],
        (err, result) => {
          if (err) {
            console.error("Lỗi khi thêm:", err);
            return res.status(500).json({ message: "Lỗi khi thêm người dùng vào CSDL" });
          }

          res.status(200).json({ message: "Đăng ký thành công!" });
        }
      );
    });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
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
