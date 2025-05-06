const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 🔐 Khai báo Client ID từ Imgur
const IMGUR_CLIENT_ID = 'b49af85871aadd24'; // <-- Thay bằng Client ID của bạn

// ⚙️ Cấu hình multer và giới hạn file ảnh tối đa 1MB
const upload = multer({
  dest: 'temp',
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB
});

// 📤 Route POST để upload ảnh lên Imgur
router.post('/upload-imgur', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Đọc ảnh và mã hóa base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Gửi ảnh đến Imgur
    const response = await axios.post('https://api.imgur.com/3/image', {
      image: imageBase64,
      type: 'base64'
    }, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
      }
    });

    // Xóa ảnh tạm sau khi upload xong
    fs.unlinkSync(imagePath);

    // Trả về URL ảnh
    res.json({
      success: true,
      link: response.data.data.link
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Upload thất bại!'
    });
  }
});

module.exports = router;
