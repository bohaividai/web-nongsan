const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./db'); // 🔥 Bạn chưa require db nên mình thêm đúng kỹ thuật ở đây

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware chung
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


// Phục vụ file frontend (html, css, js)


// 🔥 Route test (tạm thời)
app.get('/', (req, res) => {
  res.send('Hello from nông sản API!');
});

// 👉 Thêm API lấy sản phẩm chờ duyệt cho admin
app.get('/api/pending-products', (req, res) => {
  const sql = `
    SELECT p.id, p.name, p.price, u.name AS seller_name
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.approved = 0
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy sản phẩm chờ duyệt:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
    res.json(results);
  });
});

// 👉 Các route API
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const adminProductRoutes = require('./routes/adminProducts');
app.use('/api/admin/products', adminProductRoutes);

// 👉 Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});




