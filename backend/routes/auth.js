const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

// ✅ ĐĂNG KÝ
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body; // name từ frontend
  const username = name;

  try {
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
          if (err) {
            console.error("❌ Lỗi INSERT:", err);
            return res.status(500).json({ message: "Lỗi khi thêm người dùng vào CSDL" });
          }
          res.status(200).json({ message: "Đăng ký thành công!" });
        }
      );
    });
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// ✅ ĐĂNG NHẬP
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn CSDL" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Email không tồn tại" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  });
});

module.exports = router;
