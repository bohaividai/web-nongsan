const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');


// Khai báo Client ID từ Imgur
const IMGUR_CLIENT_ID = 'b49af8571aadd24'; // <- Thay bằng client ID của bạn

// Cấu hình Multer để lưu file tạm
const upload = multer({ dest: 'temp/' });

// Route POST /api/upload-imgur
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Đọc ảnh base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Gửi ảnh lên Imgur
    const response = await axios.post('https://api.imgur.com/3/image', {
      image: imageBase64,
      type: 'base64',
    }, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
    });

    // Xoá file tạm
    fs.unlinkSync(imagePath);

    // Trả về URL ảnh
    res.json({
      success: true,
      link: response.data.data.link
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload thất bại' });
  }
});

module.exports = router;
